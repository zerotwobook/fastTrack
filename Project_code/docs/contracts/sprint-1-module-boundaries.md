# Sprint 1 module boundaries - G0 proposal

Status: PROPOSED for the R1-J00 peer review. This document specifies integration seams before code; it does not implement or certify the application. Preserve the routes/DTOs/rules in project detail sections 7-9 and D1 Part C/E.

## Application and configuration

- A owns server/src/app.ts and the server entry point/configuration. The application factory accepts validated configuration and explicit domain-router registrations; tests can construct the app without starting a network listener.
- The server entry point loads/validates configuration and starts the listener. Domain modules do not start listeners or create independent app instances.
- A mounts the API router under /api. Each domain exports a router factory with explicit dependencies: createAuthRouter, createTeamsRouter, createMilestoneRouter, createSubmissionRouter and createFeedbackRouter. Names are proposed here for B's review.
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
- A owns the safe error handler and request-ID middleware. Proposed correlation transport is X-Request-Id, preserving the existing body envelope; review this transport before implementation.
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

Propose a distinct TEST_DATABASE_URL for test fixtures. Any destructive reset must require an explicit test environment and a database name reserved for tests, and reject a development/production database identity even if credentials differ. No destructive production helper or automatic startup reset is introduced by this proposal. B implements the schema/fixture operations only after the guarded contract is agreed.

## Frontend and tests

A00 owns client entry/build/test wiring only. B owns shared fonts/tokens/fields/buttons/status components. A/B own their feature modules across UI/API/tests and use the common approved design without adding unfinished S2/S3 actions.

Use Vitest for meaningful unit/harness checks, Supertest for API behavior and real PostgreSQL for domain integration. Playwright exercises the integrated browser journey once it exists. Config/error-harness results in A00 are not evidence that auth, DB persistence or S1 AC pass.

## Required peer decision

B reviews these names/ownership/dependencies and the response/request-ID/test-DB proposals together with the G0 baseline. Requested changes are resolved on the same PR before dependent code. Once accepted, record actual commit/reviewer evidence and change shared seams through a reviewed contract revision rather than silently changing another member's interface.
