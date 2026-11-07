# Sprint 1 module boundaries

Status: G0 boundary ACCEPTED by Atip-Infa in PR #44 at `d57b3ec`, integrated into staging as `30fc5ef`. The concrete A00 exports below require scaffold peer review before dependent implementation. This contract does not certify domain behavior. Preserve the routes/DTOs/rules in project detail sections 7-9 and D1 Part C/E.

## Application and configuration

- A owns server/src/app.ts and the server entry point/configuration. The application factory accepts validated configuration and explicit domain-router registrations; tests can construct the app without starting a network listener.
- The server entry point loads/validates configuration and starts the listener. Domain modules do not start listeners or create independent app instances.
- A mounts the API router under /api. Each domain exports a router factory with explicit dependencies: createAuthRouter, createTeamsRouter, createMilestoneRouter, createSubmissionRouter and createFeedbackRouter. These factory names were accepted at G0. Each router declares its complete paths relative to `/api`; for example, milestone routes include `/teams/:teamId/milestones` and `/milestones/:id`.
- B changes owned milestone/feedback module files and sends the exports/dependency requirements to A; A integrates composition/manifests/lockfiles. Do not edit the shared composition root on both branches concurrently.
- Local client fetches use /api with credentials included through the same-origin Vite proxy. Production serves the built client/API under one origin.

## Authentication and request context

- A owns requireSession, requireRole and mutation-origin/CSRF protection. Protected module dependencies are required, without permissive production defaults.
- Authentication populates an immutable server-derived context containing userId, role and sessionId. Domain code does not read authority from body/query parameters or frontend role switches.
- Scoped queries derive team membership/supervisor assignments from the DB and recheck rules inside mutations. A owns the shared scoped-team access interface; B uses it rather than duplicating identity logic.
- Authentication/private responses use no-store. B uses A's API/session-cache interface; logout/account changes clear private state.
- Before these real dependencies exist, isolated tests may inject explicitly test-only fixtures. The production app must not expose bypassed feature routes to make a demo appear complete.

## Responses and errors

- Keep the existing success data, error code/message/fields and domain-read meta.serverTime shapes. Use the D1 DTO allowlists rather than serializing ORM models.
- A owns the safe error handler and request-ID middleware. The accepted correlation transport is `X-Request-Id`, preserving the existing body envelope. A00 generates a fresh UUID, ignoring caller-supplied IDs.
- Error messages/UI text are English. Do not return SQL, stacks, credentials, session/CSRF tokens or private payloads in generic errors/logs.
- Apply the existing 400/401/403/404/409/415/500/503 policy and ordering; 404 does not reveal whether an out-of-scope record exists.
- Shared DTO fields and ordering are those in D1 C.7/E and project detail 9.4. Freeze any concrete export-file layout/manifests in the small scaffold review before dependent features use them; do not import server-only runtime code into the browser.

## Database, time and locks

- B owns Prisma schema/migrations/seed/fixtures and the database-client setup; A coordinates package/lockfile requirements with B.
- Services participating in one operation receive/use the same transaction client, including raw row locks if required by the pinned ORM version.
- A owns the shared team-then-milestone lock/clock helper interface used by submissions and later planning/revisions. B reviews it before depending on it.
- The authoritative write clock is the database clock read after acquiring locks, truncated once to milliseconds. Deadline checks and persisted submittedAt use the same value. A test clock is internal and cannot be supplied through production requests.
- A00 does not create B's schema/seed or report successful DB integration. B's migration/seed and A's scaffold are reproduced at G1.

## Environment and test database

Required configuration follows project detail section 13: DATABASE_URL, PORT, APP_ORIGIN, NODE_ENV, SESSION_TTL_HOURS, DEMO_SEED_PASSWORD and RELEASE_SHA as applicable to the implemented stage. Real credentials never enter Git, the client or logs.

Use a distinct TEST_DATABASE_URL for test fixtures. Any destructive reset must require an explicit test environment and a database name reserved for tests, and reject a development/production database identity even if credentials differ. No destructive production helper or automatic startup reset is introduced by this proposal. B implements the schema/fixture operations only after the guarded contract is agreed.

## Frontend and tests

A00 owns client entry/build/test wiring only. B owns shared fonts/tokens/fields/buttons/status components. A/B own their feature modules across UI/API/tests and use the common approved design without adding unfinished S2/S3 actions.

Use Vitest for meaningful unit/harness checks, Supertest for API behavior and real PostgreSQL for domain integration. Playwright exercises the integrated browser journey once it exists. Config/error-harness results in A00 are not evidence that auth, DB persistence or S1 AC pass.

## Concrete A00 exports for scaffold review

| File/export | Usage |
|---|---|
| `server/src/config.ts`: `loadConfig(env)`, `AppConfig`, `ConfigError` | Validated immutable runtime config; no DB connection or listener |
| `server/src/app.ts`: `createApp(config, options)`, `AppRouters`, `AppOptions` | Named optional router registrations (`auth`, `teams`, `milestones`, `submissions`, `feedback`) for composition. No domain routers are registered in A00. A integrates the real factories later. |
| `server/src/http/errors.ts`: `AppError`, `FieldErrors`, `requireJsonBody`, `parseJsonBody` | Public errors and per-route JSON validation. Router order: real session/role/source protection, then JSON type/parser/input, then scope/domain. There is no global parser ahead of authentication. |
| `server/src/http/request-context.ts`: `RequestLogger`, `RequestLog` | Only generated ID/method/route template/status/duration; no raw query, headers, payload, exception or DB URL |
| `server/src/db/test-database.ts`: `requireTestDatabase(env, protectedDatabaseUrls)` | Pure guard for B's future reset; no SQL, connection, reset or schema is implemented here |

`createApp` has no listener side effects. Only `server/src/index.ts` starts the server. Optional routers allow the scaffold to expose health alone; they are not optional authentication dependencies. A future protected router must require real protection dependencies; missing guards must never mean allow access. Session/team/transaction service signatures will be concretized in their owned feature tasks and reviewed before integration.

B owns `server/prisma/`, the runtime DB client and shared UI. Prisma CLI/client are both pinned to stable 7.10.1. Prisma 7 configuration, client generation, PostgreSQL adapter/driver dependencies, migrations and seeds still belong to B00; request additions from A before changing the shared manifest/lockfile. The scaffold never imports an ungenerated Prisma client.

The test guard requires NODE_ENV=test, a separate `[a-z0-9_]+_test` database name and an explicit protected DATABASE_URL. Pass any additional protected production/development URLs as the second argument. Credentials/query parameters cannot distinguish databases; same names on another host are rejected conservatively. Only `schema=public` and strict TLS sslmode values are allowed on the test connection. B must invoke the guard before opening a destructive connection and use a DB role restricted to that test database. DNS aliases cannot be proven distinct by a pure URL check.

## Review and changes

R1-A01 provides concrete real session/role/source/CSRF and scoped-team exports, described in [the auth contract](sprint-1-auth.md), accepted through B's approval/merge of PR #54 as `0b99a28`. PR #56 extends `createApplicationRouters` to auth/teams/milestones with required real guards before parsing, shared browser/API validation and scoped transactional reads/writes; see [the milestone contract](sprint-1-milestones.md). There is no production identity-header fallback. The combined candidate passes A's actual clean-clone/API/browser verification; B approved/merged the correction as 78d0cca; [delegated G2 is accepted](../evidence/R1-G2-acceptance.md). R1-A02 implements the real submission router/helper in PR #57 on A's separate task branch; B approved f6c4988 and merged its verified source as 3365a36. See [the first-submission seam](sprint-1-submissions.md).

G0 approval is recorded in the [decision](../decisions/0001-sprint-1-g0-baseline.md). B reviews/reproduces the A00 exports/scripts before the scaffold merge; A then reviews B00 migrations/seed/UI before joint G1. Change shared seams through a reviewed contract revision, preserving the canonical domain routes/DTOs/rules.
