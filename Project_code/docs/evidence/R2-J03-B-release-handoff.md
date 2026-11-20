# Sprint 2 release preparation and D2 evidence from B

[Issue #26](https://github.com/zerotwobook/fastTrack/issues/26) (`R2-J03`) — B-side D2 Part B/D/E evidence, F-05B and F-06 demos, effective PostgreSQL `TimeZone` readiness check, and `main` candidate diff review prepared on 20 November 2026 (`Asia/Bangkok`), complementing [A's release handoff](R2-J03-A-release-handoff.md) ([PR #124](https://github.com/zerotwobook/fastTrack/pull/124)).

## Verified candidate and test summary

- **Tested baseline commit**: `staging/sprint-2@63e81d1a91f7f288825100b47786823460943e5c` (verified working tree clean; [Issue #21](https://github.com/zerotwobook/fastTrack/issues/21) G3 integration baseline).
- **Approved A-side handoff review**: [PR #124](https://github.com/zerotwobook/fastTrack/pull/124) (`07ae43383d512d91e455b0b686012351f0fd3b86`) reviewed and approved by `@Atip-Infa`; verified `v1.0.0-sprint-1` (`ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`), `main@8e637e537cd037d630a5fffc1b5672d1b44371a8` ancestor status, CI run [44663918612](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612) (`63e81d1`), and public production `/api/health` + `/api/ready` probes returning `8e637e537cd037d630a5fffc1b5672d1b44371a8`.
- **Fresh local verification on `63e81d1`** (disposable `PostgreSQL 14.23` with `SHOW TIME ZONE = UTC`, compiled Express + Vite build, and Chromium Playwright):
  - `npm run typecheck`: exit `0`
  - `npm test`: `198` passed, `0` failed (`34` unit/client/module test suites total in Vitest report)
  - `npm run build`: exit `0`
  - PostgreSQL suites under `UTC`: `test:g1` (`38/38`), `test:auth` (`46/46`), `test:b01` (`48/48`), `test:a02` (`54/54`), `test:b02` (`48/48`), `test:j03` (`1/1`), `test:runtime` (`12/12`) — **`445` passing test cases, `0` failed** (`0` skipped).

## D2 Parts B, D and E evidence — F-05B and F-06

| Feature / PR / contract | Planned cases verified | Source & test files | Actual observed result (`63e81d1`) |
| --- | --- | --- | --- |
| **F-05B Milestone Planning** (`FR-07`, `S2-AC-03`, `S2-AC-07`) · [PR #118](https://github.com/zerotwobook/fastTrack/pull/118) (`09cdf9f5baeb1e910ed1ef7bbb22cfb767c34d7f`) | `STS-10` (active/overdue edit & strict payload), `STS-11` (post-submission lock), `STS-12` (terminal cancel & `409 MILESTONE_CANCELLED`), `STS-13` (DB-clock 1 ms future `dueAt` boundary), `STS-14` (concurrent edit/cancel vs submit), `STS-28` (auth/role/CSRF/UUID/`404` parity), `STS-30` (rollback contention retry & `503`) | [Contract §6](../contracts/sprint-2-feature-interfaces.md#6-milestone-planning-f-05b) · [Milestones service](../../server/src/modules/milestones/service.ts) · [Router](../../server/src/modules/milestones/router.ts) · [MilestoneTrack UI](../../client/src/features/milestones/MilestoneTrack.tsx) · [DB/API suite](../../server/src/testing/milestones-f05b.b01.ts) · [Service unit tests](../../server/src/modules/milestones/service.test.ts) · [Client input/overview tests](../../client/src/features/milestones/overview.test.ts) | `test:b01` **`48/48` passed** (`0` failed); server guard unit tests (`service.test.ts`) and client boundary/planning tests (`input.test.ts`, `overview.test.ts`) included in **`198/198`** passing unit/API suite. |
| **F-06 Revision History & Exact Feedback** (`FR-08`, `S2-AC-04`, `S2-AC-05`, `S2-AC-07`) · [PR #120](https://github.com/zerotwobook/fastTrack/pull/120) (`18e7a258c88bde1999e61305c3d039e5391d688a`) | `STS-15` (first-submit prerequisite & `ALREADY_SUBMITTED`), `STS-16` (sequential `v2`/`v3` & immutable history), `STS-17` (concurrent `expectedVersion` race -> `201` + `409 VERSION_CONFLICT`), `STS-18` (DB-clock 1 ms deadline & lock crossing), `STS-19` (`2147483647` bound, integer validation, precedence), `STS-20` (`v1` feedback retention after `v2`), `STS-21` (version ordering & scope privacy), `STS-22` (draft preservation on conflict), `STS-28`–`STS-31` | [Contract §7](../contracts/sprint-2-feature-interfaces.md#7-revisions-and-exact-version-feedback-f-06) · [Revisions service](../../server/src/modules/submissions/revisions.ts) · [Router](../../server/src/modules/submissions/router.ts) · [Submission UI](../../client/src/features/submissions/Submission.tsx) · [DB/API suite](../../server/src/testing/revisions-f06.b02.ts) · [Revision unit tests](../../server/src/modules/submissions/revisions.test.ts) · [History/input tests](../../client/src/features/submissions/history.test.ts) | `test:b02` **`48/48` passed** (`0` failed); `test:a02` (`54/54` first-submission regression) and `test:auth` (`46/46` including `STS-32` concurrent revision check) passed with `0` failed; unit `revisions.test.ts` and client `history.test.ts` / `input.test.ts` included in **`198/198`**. |

## D2 interactive demonstrations (`63e81d1`, Chromium + compiled server + PostgreSQL)

Both demonstrations ran against the compiled `@fasttrack/server` + `@fasttrack/client` bundle and disposable PostgreSQL `14.23` (`UTC`, `0` browser `pageerror` events):

1. **Demo 1 — F-05B Milestone edit & cancellation (what stays saved)**:
   - **Action**: As assigned supervisor (`Supervisor Demo`), created two active unsubmitted milestones (`Demo M1 Initial` and `Demo M2 Sibling`) for `Demo Team B` (`1` student member). Edited `Demo M1 Initial` via `/milestones/:id` -> `Edit milestone` (`Demo M1 Revised`, updated description and `dueAt`). Cancelled `Demo M2 Sibling` via `Cancel milestone` -> `Confirm cancel milestone`. Then Student submitted `v1` on `M1` and supervisor attempted another edit on `M1`.
   - **Expected & Actual**:
     - After editing `M1`: UI confirmed `"Milestone updated."`; PostgreSQL verified `M1.id`, `teamId`, `createdById`, `createdAt`, `cancelledAt` (`null`), sibling `Demo M2 Sibling` (unchanged `title` and `updatedAt`), and team membership all **stayed saved unchanged** while only `title`, `description`, `dueAt`, and `updatedAt` changed.
     - After cancelling `M2`: UI confirmed `"Milestone cancelled."`; PostgreSQL retained the `M2` row (`id`, original `title = "Demo M2 Sibling"`, original `dueAt`) with `cancelledAt = 2026-11-20T04:01:36.563Z` set once, preserved `M1` as active (`1` active milestone remaining) and preserved the `1` team membership row. Follow-up `PATCH` and `POST /submissions` against cancelled `M2` returned **`409 MILESTONE_CANCELLED`**.
     - After submission on `M1`: follow-up `PATCH /api/milestones/:m1Id` returned **`409 MILESTONE_HISTORY_LOCKED`**, leaving `M1` unchanged.

2. **Demo 2 — F-06 Revision history & exact-version feedback retention**:
   - **Action**: Student submitted `v1` (`M1 Submission v1`) on `M1`; supervisor saved feedback `"Please add API latency numbers in Section 2."` on `v1` (`"Feedback saved for version 1."`). Student then opened `/milestones/:m1Id/revisions/new` and submitted `v2` (`M1 Submission v2`). Finally, student clicked `"Open version 1"` in the version history panel.
   - **Expected & Actual**:
     - `v2` detail view displayed `"Version 2, submitted by Student Demo."` and `"No feedback for this version yet."` (API/DB `v2.feedbackCount = 0`).
     - Clicking `"Open version 1"` navigated to `/submissions/:v1Id`, displayed `"Viewing version 1; the latest version is version 2."`, and still showed `"Please add API latency numbers in Section 2."`.
     - Direct PostgreSQL readback confirmed **`2` stored rows** (`version = 1` and `version = 2`): `v1.title` and `v1.submittedAt` were unchanged, and the single `Feedback` row (`id` unchanged) remained linked to `v1.id` (`submissionId = v1.id`), never moved or duplicated onto `v2`.

## Effective PostgreSQL timezone verification and impact

- **Deployed / Cloud SQL effective `SHOW TIME ZONE`**: **`UNVERIFIED`** from B's environment.
  - **Missing access**: No Google Cloud CLI (`gcloud`), active GCP authentication profile, Cloud SQL Proxy session, or read-only Secret Manager / `DATABASE_URL` access to Cloud SQL instance `fasttrack-db` (`fasttrack_prod` as role `fasttrack_user`) is available in this local checkout environment. No credentials or connection strings were accessed or recorded.
  - **Application connection behavior**: [runtime-client.ts](../../server/src/db/runtime-client.ts) constructs `PrismaPg({ connectionString, ... })` without injecting `PGOPTIONS` or running `SET TIME ZONE 'UTC'`, so the effective session `TimeZone` matches the Cloud SQL instance/database/role default (A noted no Cloud SQL instance timezone override on `fasttrack-db`).
- **Non-UTC reproduction on `63e81d1` (PostgreSQL `14.23`)**:
  - Ran `SHOW TIME ZONE;` -> **`Asia/Bangkok`**, `SELECT version();` -> `PostgreSQL 14.23, compiled by Visual C++ build 1944, 64-bit`.
  - Executed `vitest.a01.config.ts` (`test:runtime`): **`11` passed, `1` failed** — failed case `A01 real PostgreSQL runtime boundaries cleans one bounded expired batch while preserving active locks and all domain records` (`AssertionError: expected 11 to be 10 // Object.is equality` at `server/src/testing/runtime.a01.ts:149`).
  - Re-executed against PostgreSQL `14.23` with `SHOW TIME ZONE = UTC`: `test:runtime` **`12` passed, `0` failed**.
- **Pre-release impact assessment**: In [rate-limit.ts](../../server/src/modules/auth/rate-limit.ts), `cleanExpiredLoginKeys` evaluates `locked_until <= clock_timestamp()` in SQL while callers insert `lockedUntil` via Prisma (`@prisma/adapter-pg`). When the effective PostgreSQL session timezone is non-UTC (for example `+07:00`), active lockout rows created with near-future timestamps can be treated as already expired and evicted by the bounded `cleanup:rate-limits` maintenance command before expiry. Before accepting G6 or running non-UTC PostgreSQL deployments, either run `SHOW TIME ZONE` on an authorized read-only Cloud SQL `fasttrack_user` session to confirm `UTC` on production `fasttrack-db`, or pin `UTC` explicitly in the database session/runtime configuration.

## Candidate diff review (`origin/main@8e637e5` vs staging)

- **Comparison inspected**: `origin/main..07ae43383d512d91e455b0b686012351f0fd3b86` (`312` changed files total; `311` at `63e81d1`, plus A's [R2-J03-A-release-handoff.md](R2-J03-A-release-handoff.md)).
- **Sensitive path boundaries**: Zero net diffs under `Project_code/server/prisma/` and `.github/workflows/`.
- **Four `output/documents/` files reviewed**:
  - `output/documents/lab5/lab5_sec31_InfaCompany.md` & `.docx`
  - `output/documents/lab5-google-docs/lab5_sec31_InfaCompany_GoogleDocs.md` & `.docx`
  - Verified these are repackaged Lab 5 deployment report editions referencing accepted `8e637e5` and `4f3102a` ([PR #104](https://github.com/zerotwobook/fastTrack/pull/104)); they introduce no application code, credentials, or workflow changes.
- **Draft release PR status**: Awaiting staging evidence PR coordination (`PR #124` and this B-side evidence PR) and A/B agreement on the final `staging/sprint-2` head (plus decision on verifying `SHOW TIME ZONE` on Cloud SQL or fixing non-UTC `TimeZone` handling before release). Once the final staging head is agreed, B will open the release PR targeting `main` as **Draft** per the [main release gate](../../../workflow/MAIN_RELEASE_GATE.md) and wait for explicit user authorization of that exact candidate.
