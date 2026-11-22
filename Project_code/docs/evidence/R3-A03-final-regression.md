
# R3-A03 final domain regression

A (@zerotwobook) ran the regression for [Issue #34](https://github.com/zerotwobook/fastTrack/issues/34) after [joint G3 acceptance](https://github.com/zerotwobook/fastTrack/issues/33). B (@Atip-Infa) reviews the evidence. The tested application source was Sprint 3 staging commit 6074f98eed54448237a65ee194ae4487a758ad52. Its application, runtime configuration and deployment files match the accepted D2 release at 7872a739147f7553e16e05a4d40b5d0de0c21f27.

## Guarded regression

The isolated A worktree used Node 26.13.0, npm 11.20.0, Docker Engine 29.9.2 and the runner's pinned PostgreSQL 16.8 image. From a clean checkout, run the following commands in `Project_code/`:

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

[Machine-readable runtime report](R3-A03-runtime-results.json) preserves the individual assertions, stage statuses and seven upgrade outcomes. Release-tag migration replays and production-image socket evidence will accompany the final handoff.
