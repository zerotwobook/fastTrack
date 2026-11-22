
# R3-A03 final domain regression

A (@zerotwobook) ran the regression for [Issue #34](https://github.com/zerotwobook/fastTrack/issues/34) after [joint G3 acceptance](https://github.com/zerotwobook/fastTrack/issues/33). B (@Atip-Infa) reviews the evidence. The tested application source was Sprint 3 staging commit 6074f98eed54448237a65ee194ae4487a758ad52. Its application, runtime configuration and deployment files match the accepted D2 release at 7872a739147f7553e16e05a4d40b5d0de0c21f27.

## Guarded regression

The isolated A worktree used Node 26.13.0, npm 11.20.0, Docker Engine 29.9.2 and the runner's pinned PostgreSQL 16.8 image. Run these commands from `Project_code/` in a clean checkout.

```powershell
npm ci --prefer-offline
npm run test:runtime:isolated
```

The runner executed on 22 November 2026 from 12:16:52 to 12:18:49 UTC. It passed fresh and repeat migrations, Prisma generation, typecheck, production build, eight test groups and seven legacy upgrade scenarios. It removed its disposable database. The initial npm install audit reported three high-severity findings for the locked dependencies. The dependency follow-up remains listed in [Issue #33](https://github.com/zerotwobook/fastTrack/issues/33).

| Test group | Passed | Failed | Skipped | Domain coverage |
| --- | ---: | ---: | ---: | --- |
| Ordinary unit and API | 214 | 0 | 0 | Validation, derived status and progress calculations |
| Foundation and seed | 38 | 0 | 0 | Canonical data boundaries, constraints, safe repeated seed and compiled client |
| Authentication, team and progress | 46 | 0 | 0 | Team membership and history locks, progress and integrated revision race |
| Milestones and Summary | 57 | 0 | 0 | Edit and cancellation races, weighted totals, team and status scope, and repeatable-read consistency |
| First submission | 54 | 0 | 0 | Exact deadline and post-lock clock, duplicate handling, no-write failures and Lab 6 regressions |
| Feedback and revisions | 61 | 0 | 0 | Version conflict, immutable history, exact-version feedback, retry and Lab 7 content boundaries |
| Compiled Sprint 1 journey | 1 | 0 | 0 | Authenticated milestone, submission and feedback continuity after restart and repeat seed |
| Runtime database integration | 12 | 0 | 0 | Database-backed limiter, timeout and cleanup behavior |
| **Total** | **483** | **0** | **0** | |

[Machine-readable runtime report](R3-A03-runtime-results.json) preserves the individual assertions, stage statuses and seven upgrade outcomes.

## Accepted Sprint database replay

[The accepted-tag replay results](R3-A03-accepted-tag-upgrades.json) record two isolated checks with synthetic records. The original migration files came from the accepted Git tags. Each database contained its own supervisor, student, team, membership, milestone, submission history and version-specific feedback. The Sprint 2 fixture held two versions and a 6,000-character feedback entry. Fingerprints included every row and the existing password hashes. Existing migration ledger checksums were compared separately.

| Starting tag | Migration outcome | Data and ledger outcome |
| --- | --- | --- |
| v1.0.0-sprint-1 at ae7a60a6 | Applied the auth rate-limit and Lab 7 feedback-limit migrations. | Existing rows and password hashes matched their original fingerprint. Existing ledger checksums matched. A second deploy made no changes. |
| v1.0.0-sprint-2 at f3ff8d9 | The current migration set was already present. | Both submission versions and their original feedback associations were preserved. Existing ledger checksums and row fingerprints survived both deploys. |

For each tag, use git archive with Project_code/server/prisma/migrations to extract the exact migration directory, set G1_HISTORY_MIGRATIONS_DIR to that directory and point DATABASE_URL to the corresponding empty local test database. From Project_code, run npm exec -- prisma migrate deploy --config prisma.g1-history.config.ts. Insert the representative history described above, fingerprint the rows of users, teams, team_members, milestones, submissions and feedback in stable order and capture the completed migration ledger. Run npm exec -- prisma migrate deploy --config prisma.config.ts twice. Compare the fingerprints and prior ledger after each run and confirm the expected new migration names. The report records the actual fingerprint comparisons and cleanup.

## Built image and persistence

Ran npm run verify:socket from Project_code on the same source on 22 November 2026. The clean clone built the production runner and jobs images. All 17 [recorded checks](R3-A03-socket-results.json) passed, including the business journey, fresh and repeat migration and seed, and retrieval of the same submission, feedback and still-valid database session after restarting the web container. The verifier removed the disposable containers and socket volume.

The hosted health and readiness readbacks for this run both returned HTTP 200 at D2 source 7872a739147f7553e16e05a4d40b5d0de0c21f27. Readiness reported the database connected. [The accepted D2 integration record](R3-J01-f08-integration.md) supplies the previously reviewed hosted F-08 and original-record readback for that source. The fresh test results cover isolated runtime and restart behavior. The release record covers the existing deployment. Rollback and roll-forward remain part of Final release readiness if the release uses them.

## Review and follow-up

B reviews transaction outcomes, unchanged row fingerprints and the consistency of F-07 and F-08 assertions. The existing Summary pager wording remains with the B-side UI follow-up. Joint independent UAT and release readiness are tracked in [Issue #36](https://github.com/zerotwobook/fastTrack/issues/36).
