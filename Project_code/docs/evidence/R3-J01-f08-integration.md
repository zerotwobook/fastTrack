# R3-J01 F-08 integration verification

The tested source is [staging candidate 84c4a31](https://github.com/zerotwobook/fastTrack/tree/84c4a31220898957be96c9a54cff0d6e37832821). It includes F-08B from [PR #134](https://github.com/zerotwobook/fastTrack/pull/134), F-08A from [PR #135](https://github.com/zerotwobook/fastTrack/pull/135), and the English project detail from [PR #137](https://github.com/zerotwobook/fastTrack/pull/137).

[Issues #28](https://github.com/zerotwobook/fastTrack/issues/28) and [#29](https://github.com/zerotwobook/fastTrack/issues/29) read Done / PASSED / ACCEPTED before verification. [Atip-Infa accepted the exact F-08A head](https://github.com/zerotwobook/fastTrack/pull/135#pullrequestreview-5996002975) and merged it to staging. G2 and the D2 candidate are tracked in [Issue #30](https://github.com/zerotwobook/fastTrack/issues/30).

## Automated baseline

Ran `npm run test:runtime:isolated` from `Project_code/` with the guarded PostgreSQL 16.8 fixture. Prisma generation, fresh and repeat migration, typecheck, and production build passed. Vitest recorded 483 passing cases, zero failures and zero skipped cases. All seven migration upgrade scenarios passed.

| Suite | Passed |
| --- | ---: |
| Unit and API contract | 214 |
| Foundation database, seed, and compiled client | 38 |
| Authentication and scoped sessions | 46 |
| Milestones, planning, and F-08 API/DB | 57 |
| Submission, team rules, and deadline regression | 54 |
| Feedback, exact-version access, and revision regression | 61 |
| Compiled original Sprint 1 journey and restart | 1 |
| Lab 5 runtime and database safeguards | 12 |

[Machine-readable regression results](R3-J01-regression-results.json)

The browser, database readback, and local production image evidence are being attached to this handoff.
