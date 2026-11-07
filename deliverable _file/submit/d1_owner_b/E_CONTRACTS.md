# Part E — Sprint 1 Engineering Contracts and Specifications

**Author:** Owner B (Atip Infa-udom / 67070503446) with input from Owner A (Supapanya Yathip / 67070503443)  
**System:** fastTrack — Course Project Management System  
**Baseline & Target:** Sprint 1 Verified Increment (`staging/sprint-1` commit `fe65b19`, fully passing all 310 test cases and clean production builds).

---

## E.0 Scope and Common Contract Invariants

Part E formalizes the interface boundaries, input constraints, data transfer objects (DTOs), acceptance criteria, and software test specifications for all four Sprint 1 features:
- **F-01**: Session-Based Authentication & Role-Scoped Access
- **F-02**: Team-Scoped Milestones with Server-Enforced Deadlines
- **F-03**: Single-Version Submissions with Strict Deadline Enforcement
- **F-04**: Version-Specific Feedback with Idempotent Retry Safety

### Common Contract Rules
1. **Response Envelope:** Every success response wraps its payload in `{ "data": T, "meta"?: { "serverTime": string } }`. Every error response wraps its payload in `{ "error": { "code": string, "message": string, "fields"?: Record<string, string> } }`.
2. **Identification & Types:** All database entity identifiers are RFC 4122 UUID v4 strings. Integer versions begin at 1.
3. **Timestamps:** Timestamps transmitted over HTTP are ISO 8601 strings in UTC format with millisecond precision (`YYYY-MM-DDTHH:mm:ss.sssZ`). Form display converts timestamps into `Asia/Bangkok` timezone while retaining seconds.
4. **Fail-Closed Security Order:** All mutation endpoints enforce:
   $$\text{requireSession} \longrightarrow \text{requireRole} \longrightarrow \text{requireMutation (Source + CSRF)} \longrightarrow \text{requireJsonBody} \longrightarrow \text{parseJsonBody}$$
5. **Indistinguishable 404s:** Out-of-scope or foreign-team resources return generic 404 `NOT_FOUND` responses indistinguishable from nonexistent IDs, preventing cross-tenant enumeration attacks.

---

## E.1 F-01 — Session-Based Authentication and Scoped Team Context

- **Requirements Covered:** FR-01, FR-02, BR-01, BR-02, NFR-01, NFR-02, NFR-05.
- **Primary Owner:** Owner A (@zerotwobook); Reviewer: Owner B (@Atip-Infa).
- **Physical Migration:** `20261105000000_init` (User, Session, Team, TeamMember).

### E.1.1 Endpoint Contracts

| HTTP Method / Path | Request Headers / Body | Success Response | Error Responses |
|---|---|---|---|
| `POST /api/auth/login` | `X-fastTrack-Request: 1`<br/>`Origin: <appOrigin>`<br/>`{ "email": string, "password": string }` | 200 OK<br/>`{ "data": { "user": AuthUserDto, "csrfToken": string } }`<br/>`Set-Cookie: fasttrack_session=<token>; HttpOnly; SameSite=Lax; Path=/; Max-Age=28800;` | 400 `INVALID_INPUT`<br/>401 `INVALID_CREDENTIALS`<br/>403 `FORBIDDEN` (bad source/missing header)<br/>415 `UNSUPPORTED_MEDIA_TYPE` |
| `GET /api/auth/session` | `Cookie: fasttrack_session=<token>` | 200 OK<br/>`{ "data": { "user": AuthUserDto, "csrfToken": string } }`<br/>`Cache-Control: no-store` | 401 `UNAUTHENTICATED` |
| `POST /api/auth/logout` | `Cookie: fasttrack_session=<token>`<br/>`X-CSRF-Token: <csrfToken>`<br/>`Origin: <appOrigin>` | 204 No Content<br/>`Set-Cookie: fasttrack_session=; Max-Age=0; Path=/;`<br/>(Revokes session in database) | 403 `FORBIDDEN` (invalid CSRF/Origin) |
| `GET /api/teams` | `Cookie: fasttrack_session=<token>` | 200 OK<br/>`{ "data": TeamDto[] }`<br/>(Scoped to caller's team or supervised teams) | 401 `UNAUTHENTICATED` |
| `GET /api/teams/:id` | `Cookie: fasttrack_session=<token>` | 200 OK<br/>`{ "data": TeamDto }` | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |

### E.1.2 Acceptance Criteria (AC-01)

- **AC-01.1:** Valid credentials for supervisor or student return HTTP 200 with matching `AuthUserDto`, a secure HttpOnly session cookie, and a valid `csrfToken`. Neither the password, salt, nor password hash is ever exposed in response payloads.
- **AC-01.2:** Invalid password, unregistered email, or malformed credentials return generic HTTP 401 `INVALID_CREDENTIALS` without creating a session row. Empty fields return HTTP 400.
- **AC-01.3:** Missing, revoked, or expired sessions return HTTP 401 `UNAUTHENTICATED` across all protected routes without revealing private data.
- **AC-01.4:** Logout revokes the session in the database and clears the client cookie; subsequent calls with the former cookie fail. Requests missing valid CSRF tokens on state-changing operations return HTTP 403.
- **AC-01.5:** Team endpoints return only the teams within the authenticated user's scope. Students without teams receive an empty array; foreign team lookups return HTTP 404.

---

## E.2 F-02 — Team-Scoped Milestones with Server-Enforced Deadlines

- **Requirements Covered:** FR-03, BR-02, BR-03, BR-08, NFR-02, NFR-05.
- **Primary Owner:** Owner B (@Atip-Infa); Reviewer: Owner A (@zerotwobook).
- **Physical Migration:** `20261105010000_milestones`.

### E.2.1 Endpoint Contracts

| HTTP Method / Path | Request Headers / Body | Success Response | Error Responses |
|---|---|---|---|
| `POST /api/teams/:teamId/milestones` | Session + CSRF + Supervisor Role<br/>`{ "title": string, "description": string, "dueAt": string }` | 201 Created<br/>`{ "data": MilestoneDto }` | 400 `INVALID_INPUT` (past deadline, length violation, unknown key)<br/>401 `UNAUTHENTICATED`<br/>403 `FORBIDDEN` (student caller)<br/>404 `NOT_FOUND` (foreign team) |
| `GET /api/teams/:teamId/milestones` | Session + Scoped Member/Supervisor | 200 OK<br/>`{ "data": MilestoneDto[], "meta": { "serverTime": string } }` | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |
| `GET /api/milestones/:id` | Session + Scoped Member/Supervisor | 200 OK<br/>`{ "data": MilestoneDto, "meta": { "serverTime": string } }` | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |

### E.2.2 Pure Validation Rules (`shared/milestones.mjs`)
- `title`: String, 1–120 Unicode code points (trimmed).
- `description`: String, 1–4,000 Unicode code points (trimmed).
- `dueAt`: Valid ISO 8601 string with explicit timezone offset. Evaluated against the server database clock (`date_trunc('milliseconds', clock_timestamp())`); must be strictly in the future at creation time ($\text{dueAt} > \text{acceptedAt}$).
- Rejection of unknown properties: any undeclared key in the input object throws `MilestoneInputError` with `{ form: 'Unknown field: ...' }`.

### E.2.3 Acceptance Criteria (AC-02)

- **AC-02.1:** The assigned supervisor can successfully create a milestone for their supervised team; the resulting `MilestoneDto` matches the persisted title, description, due date, and team assignment.
- **AC-02.2:** Students cannot create milestones (HTTP 403 `FORBIDDEN`). Supervisors cannot create or view milestones for foreign teams (HTTP 404 `NOT_FOUND`). Unauthenticated calls return HTTP 401.
- **AC-02.3:** Empty titles, titles exceeding 120 code points, descriptions exceeding 4,000 code points, unparseable dates, or dates in the past return HTTP 400 `INVALID_INPUT` with specific field errors. No database row is created.

---

## E.3 F-03 — Single-Version Submissions with Strict Deadline Enforcement

- **Requirements Covered:** FR-04, BR-02, BR-03, BR-04, BR-05, BR-08, NFR-02, NFR-03, NFR-05.
- **Primary Owner:** Owner A (@zerotwobook); Reviewer: Owner B (@Atip-Infa).
- **Physical Migration:** `20261105020000_submissions`.

### E.3.1 Endpoint Contracts

| HTTP Method / Path | Request Headers / Body | Success Response | Error Responses |
|---|---|---|---|
| `POST /api/milestones/:id/submissions` | Session + CSRF + Student Role<br/>`{ "title": string, "description": string, "url": string }` | 201 Created<br/>`{ "data": SubmissionDto }`<br/>(version: 1, submittedAt: server clock) | 400 `INVALID_INPUT` (bad URL, length violation)<br/>401 `UNAUTHENTICATED`<br/>403 `FORBIDDEN` (supervisor caller)<br/>404 `NOT_FOUND` (foreign milestone)<br/>409 `DEADLINE_PASSED`<br/>409 `DUPLICATE_SUBMISSION` |
| `GET /api/milestones/:id/submissions` | Session + Scoped Member/Supervisor | 200 OK<br/>`{ "data": SubmissionDto[] }` | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |
| `GET /api/submissions/:id` | Session + Scoped Member/Supervisor | 200 OK<br/>`{ "data": SubmissionDto }` | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |

### E.3.2 Pure Validation Rules (`shared/submissions.mjs`)
- `title`: String, 1–120 Unicode code points (trimmed).
- `description`: String, 1–4,000 Unicode code points (trimmed).
- `url`: String, 1–2,048 characters; must be a valid absolute URL with `http:` or `https:` protocol.
- Unknown properties rejected with `{ form: 'Unknown field: ...' }`.
- System-assigned fields (`id`, `version`, `submittedBy`, `submittedAt`, `milestoneId`) in the payload are rejected.

### E.3.3 Acceptance Criteria (AC-03)

- **AC-03.1:** A student member of the team can submit work before the milestone deadline; the submission is created as version 1 with persisted title, description, URL, author ID, and database timestamp.
- **AC-03.2:** Submissions submitted at or before the exact database deadline millisecond ($\text{acceptedAt} \le \text{dueAt}$) succeed. Any submission arriving even 1 ms after the deadline ($\text{acceptedAt} > \text{dueAt}$) is rejected with HTTP 409 `DEADLINE_PASSED`. Zero rows are written to the database, and the client retains the draft content.
- **AC-03.3:** Duplicate submissions for the same milestone in Sprint 1 are strictly rejected with HTTP 409 `DUPLICATE_SUBMISSION`. Concurrent submissions from teammates serialize so that exactly one submission succeeds as version 1.
- **AC-03.4:** Non-HTTP(S) URLs, oversized inputs, empty fields, or spoofed identity fields return HTTP 400 `INVALID_INPUT` without partial writes.
- **AC-03.5:** Foreign students and foreign supervisors receive HTTP 404 `NOT_FOUND` on read and write attempts. Supervisors cannot submit work (HTTP 403 `FORBIDDEN`).
- **AC-03.6:** Persisted submissions remain completely durable across full server application restarts and reconnect to the persistent database.

---

## E.4 F-04 — Version-Specific Feedback with Retry Safety

- **Requirements Covered:** FR-05, BR-02, BR-03, BR-06, BR-07, BR-08, NFR-02, NFR-03, NFR-05.
- **Primary Owner:** Owner B (@Atip-Infa); Reviewer: Owner A (@zerotwobook).
- **Physical Migration:** `20261105030000_feedback`.

### E.4.1 Endpoint Contracts

| HTTP Method / Path | Request Headers / Body | Success Response | Error Responses |
|---|---|---|---|
| `POST /api/submissions/:id/feedback` | Session + CSRF + Supervisor Role<br/>`{ "content": string, "clientRequestId": string }` | 201 Created (new write)<br/>200 OK (idempotent replay)<br/>`{ "data": FeedbackDto }` | 400 `INVALID_INPUT` (bad UUID, empty/long content)<br/>401 `UNAUTHENTICATED`<br/>403 `FORBIDDEN` (student caller)<br/>404 `NOT_FOUND` (foreign submission)<br/>409 `REQUEST_KEY_REUSED` (key reused with changed content) |
| `GET /api/submissions/:id/feedback` | Session + Scoped Member/Supervisor | 200 OK<br/>`{ "data": FeedbackDto[] }`<br/>(Ordered chronological: `createdAt: 'asc', id: 'asc'`) | 401 `UNAUTHENTICATED`<br/>404 `NOT_FOUND` |

### E.4.2 Pure Validation Rules (`shared/feedback.mjs`)
- `content`: String, 1–4,000 Unicode code points (trimmed).
- `clientRequestId`: Valid RFC 4122 UUID v4 string.
- Unknown properties rejected with `{ form: 'Unknown field: ...' }`.

### E.4.3 Acceptance Criteria (AC-04)

- **AC-04.1:** The assigned supervisor can append feedback tied to a specific submission version. Team members reading the submission receive the exact feedback array with supervisor author and timestamp. Feedback is strictly associated with the specific submission ID, never floating across milestones.
- **AC-04.2:** Students cannot create feedback (HTTP 403 `FORBIDDEN`). Foreign supervisors and students receive HTTP 404 `NOT_FOUND` when attempting to read or write feedback. Unauthenticated requests receive HTTP 401.
- **AC-04.3:** Empty content, content exceeding 4,000 code points, malformed `clientRequestId` UUIDs, or unknown properties return HTTP 400 `INVALID_INPUT`. The database state remains unmodified.
- **AC-04.4:** Multiple feedback entries append in stable chronological order. All feedback records persist durably across server process restarts.

---

## E.5 Sprint 1 Acceptance Extensions (S1-AC-EXT)

The Sprint 1 increment includes five architectural extensions originating from technical security and robustness requirements:

| Extension ID | Target Feature | Requirement Enforced | Observable Verification Behavior |
|---|---|---|---|
| **S1-AC-EXT-01** | F-01 / Auth | NFR-01, NFR-02 | Login bootstrap rejects foreign or missing origins and requires custom header `X-fastTrack-Request: 1`. Authenticated mutations reject invalid or missing `X-CSRF-Token` headers before reaching the controller. |
| **S1-AC-EXT-02** | F-04 / Feedback | FR-05, BR-07 | Idempotent retry safety: Replaying the identical `(clientRequestId, content)` returns HTTP 200 OK with the existing `FeedbackDto` without creating duplicate database rows, even under high concurrency. Reusing `clientRequestId` with changed content returns HTTP 409 `REQUEST_KEY_REUSED`. Tenant scope is validated prior to the idempotency lookup to prevent cross-tenant key probing. |
| **S1-AC-EXT-03** | F-02 / F-03 / F-04 | FR-02, FR-04, FR-05 | Read-model projection: Milestone list and detail queries batch-project `latestSubmission: { id, version, submittedAt, feedbackCount }` directly in the database query. Returns null if no submission exists. Response includes `meta.serverTime` for synchronization. |
| **S1-AC-EXT-04** | F-03 / Submissions | BR-04, BR-05 | Two-phase row-level locking (`teams` then `milestones`) serializes deadline evaluations against a single-read database clock (`clock_timestamp()`). Evaluates cancellation first, duplicate submission second, and deadline third. |
| **S1-AC-EXT-05** | F-01 / Auth | NFR-02, NFR-05 | Logout purges in-memory client state; switching accounts on the same browser prevents stale cache leakage. Post-logout `returnTo` parameters are strictly restricted to relative application routes, eliminating open redirect vulnerabilities. |

---

## E.6 Software Test Specification (STS) Execution Summary

All tests are implemented in TypeScript and executed via Vitest against PostgreSQL. The complete test suite contains **310 passing tests / 0 failures**:

| Test Group | Test File Location | Cases | Target ACs | Key Verification Scenarios |
|---|---|---:|---|---|
| Ordinary Input & Logic | `client/src/**/*.test.ts`, `server/src/config.test.ts`, `server/src/db/test-database.test.ts`, `server/src/app.test.ts` | 120 | AC-01.2, AC-02.3, AC-03.4, AC-04.3 | Pure Unicode validation, RFC 4122 UUID checking, unknown field rejection, correlation ID generation, and redaction. Runs in 1.4s without database requirement. |
| Foundation & DB Guards | `server/src/db/test-database.ts`, G1 harness | 38 | NFR-03, NFR-04 | Database connection safety, test database URL separation guard, non-destructive add-only seed verification. |
| F-01 Sessions & Scopes | `server/src/testing/sessions.auth.ts` | 28 | AC-01.1–01.5, EXT-01, EXT-05 | Real PostgreSQL session lifecycle, scrypt hash validation, 8h absolute expiry, CSRF rejection, account-switch cache isolation. |
| F-02 Milestone Management | `server/src/testing/milestones-review.b01.ts`, `server/src/modules/milestones/milestones.b01.ts` | 33 | AC-02.1–02.3, EXT-03 | Supervisor milestone creation, future deadline validation against DB clock, timezone conversions, foreign-team 404 denials. |
| F-03 Submissions & Locks | `server/src/testing/submissions.a02.ts` | 48 | AC-03.1–03.6, EXT-04 | Boundary millisecond clock evaluation (-1ms, 0ms, +1ms), 409 DEADLINE_PASSED rejection, duplicate serialization, team/milestone locks. |
| F-04 Feedback & Retries | `server/src/testing/feedback-review.b02.ts`, `server/src/modules/feedback/feedback.b02.ts` | 42 | AC-04.1–04.4, EXT-02 | Scoped supervisor feedback creation, chronological retrieval, 200 replay vs. 409 conflict, P2002 race absorption, access restriction denials. |
| Integrated System Journey | `server/src/testing/integrated-s1.j03.ts` | 1 | T-21, T-22, T-25, T-31 | Full end-to-end compiled HTTP journey: milestone create -> submission -> feedback append -> teammate read -> seed stability -> compiled app restart (PID change) -> session recovery. |
| **Total** | | **310** | **18 ACs + 5 EXT** | **All 310 cases PASSED cleanly (0 failed, 0 skipped).** |

---

## E.7 Definition of Done (DoD) Compliance

The Sprint 1 increment satisfies the engineering Definition of Done:
1. **Code & Typing:** Strict TypeScript with `noImplicitAny` and `exactOptionalPropertyTypes: true` passes with zero errors across all workspaces.
2. **Database Integrity:** Relational foreign keys, check constraints, unique indexes, and four ordered migrations execute cleanly from scratch on fresh PostgreSQL databases.
3. **Security Standards:** Cryptographically secure scrypt password hashing, opaque session token digests, double-submit CSRF enforcement, and origin checking protect every mutation.
4. **Peer Review:** Every pull request (#45, #50, #54, #56, #57, #61, #62) was independently reviewed and approved by the peer owner prior to merging into `staging/sprint-1`.
5. **Human Gate Decisions:** Joint Gates G0, G1, G2, G3, and G4 are formally evaluated and recorded as ACCEPTED based on verified evidence.

