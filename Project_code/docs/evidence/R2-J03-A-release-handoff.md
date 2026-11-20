# Sprint 2 release preparation and D2 evidence from A

[Issue #26](https://github.com/zerotwobook/fastTrack/issues/26) (R2-J03) is owned jointly by A and B. This handoff records the evidence available on 20 November 2026 (Asia/Bangkok). G3 is accepted on staging. G6 acceptance, release authorization, deployment of Sprint 2, and the Sprint 2 tag are pending.

## Verified product and release references

| Reference | Observed result |
| --- | --- |
| Accepted Sprint 1 tag | `v1.0.0-sprint-1` resolves to `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`. [Tag](https://github.com/zerotwobook/fastTrack/releases/tag/v1.0.0-sprint-1) |
| Current production | On 20 November, public `/api/health` returned `ok`, and `/api/ready` returned `ready` with `database: connected`. Both reported `8e637e537cd037d630a5fffc1b5672d1b44371a8`, which matched `main` at inspection. Cloud Run reported `fasttrack-app-00003-rc7` serving 100% of traffic. [Deploy run](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077) |
| Accepted G3 baseline | `staging/sprint-2@63e81d1a91f7f288825100b47786823460943e5c`. [Joint decision and evidence](https://github.com/zerotwobook/fastTrack/issues/21) |
| Candidate comparison | At inspection, `main@8e637e5` was an ancestor of `staging/sprint-2@63e81d1`. A `git merge-tree --write-tree` check succeeded and produced the staging tree. The full comparison contained 311 changed files, including app work and accumulated course evidence. The Prisma schema and migration files and GitHub workflows had no net changes in that comparison. Review the full file list, including four files under `output/documents/`, before selecting a release head. |

The current cloud probes verify release identity and connectivity. The merged G3 staging commit is the source for Sprint 2 behavioral evidence. Preserve the existing Sprint 1 tag as the continuity reference.

## D2 Parts A, B and D evidence

| Requirement or D2 purpose | Observed behavior and reusable evidence |
| --- | --- |
| Sprint 1 continuity (Part A) | The compiled Sprint 1 test exercised create, submit, feedback, role scope, repeated explicit seed, and a real process restart. CI recorded one passing compiled journey. Preserve the existing tag and rerun this journey on the concrete D2 release candidate. [Test](../../server/src/testing/integrated-s1.j03.ts) |
| F-05A Team Planning, FR-06 / S2-AC-01–02 / STS-01–09 (Parts B and D) | Supervisor creation and rename, minimal available-student paging, scoped assignment, database uniqueness under races, and membership lock after submission. F-05A was peer-accepted and merged at `a130a9f`. [Contract §5](../contracts/sprint-2-feature-interfaces.md#5-team-planning-and-minimal-candidates-f-05a) · [Test](../../server/src/testing/team-planning.auth.ts) · [PR #117](https://github.com/zerotwobook/fastTrack/pull/117) · [B's independent browser and database evidence](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827) |
| F-07 Team Progress, FR-09 / S2-AC-06 / STS-23–27 (Parts B and D) | All five milestone rows remain visible, with one cancelled row excluded from the count. PostgreSQL, API and browser agree on 3 of 4 and 75.0%. A new revision leaves the submitted count unchanged and its status reflects that version's feedback. F-07 was peer-accepted and merged at `3a22d5e`. [Contract §8](../contracts/sprint-2-feature-interfaces.md#8-progress-projection-and-shared-calculation-f-07) · [HTTP and database test](../../server/src/testing/progress.auth.ts) · [Calculation test](../../server/src/modules/progress/calculation.test.ts) · [PR #119](https://github.com/zerotwobook/fastTrack/pull/119) |
| Shared scope, runtime and continuity, S2-AC-07–08 / STS-28–32 (Parts D and E) | The cross-feature test confirms one committed revision per race, scope denial, immutable history and retained v1 feedback, with one consistent progress projection. A and B cross-reviewed the staging application. [Integrated test](../../server/src/testing/integrated-s2.auth.ts) · [A's G3 evidence](R2-J02-A-integration.md) · [B's independent results](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827) |

This traceability excerpt covers A's work. B adds F-05B Milestone Planning, F-06 Revision History, upgrade and deployment evidence. The [D2 summary](../../../deliverable%20_file/PROJECT_DELIVERABLE_2_SUMMARY.md) defines the full Parts A–E.

## Verified staging regression (D2 Part E)

[GitHub CI run 44663918612](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612) passed at `63e81d1`. A downloaded its `ci-runtime-report` artifact and verified 445 passing cases and seven passed upgrade scenarios on PostgreSQL 16.8. The artifact includes 198 unit/API, 38 G1, 46 auth, 48 B01, 54 A02, 48 B02, one compiled Sprint 1 journey and 12 runtime cases. The auth result contains the passing STS-32 integration test. The workflow also passed typecheck, build and production Docker image checks.

Retain B's earlier non-UTC finding as a release-readiness item. One A01 cleanup case failed on disposable PostgreSQL 14.23 in `Asia/Bangkok` and passed when the session used `UTC`. A verified that the Cloud SQL instance is PostgreSQL 16 and has no instance timezone override. The effective app-session timezone is still unverified. If the deployed session is non-UTC, reproduce the behavior for the candidate and resolve it or verify the intended UTC configuration before G6 acceptance. [Original finding](https://github.com/zerotwobook/fastTrack/issues/21#issuecomment-7028845827)

## Sprint 3 interface to carry forward

Reuse the pure [`calculateProgress` function](../../server/src/modules/progress/calculation.ts) and its status precedence. Cancellation remains visible and excluded from the numerator and denominator. Status uses feedback on the latest exact version and one database clock for the read. Use `sum(submitted) / sum(total)` for the cross-team percentage, with zero when there are no active milestones. Confirm the shared F-08 contract in [#27](https://github.com/zerotwobook/fastTrack/issues/27).

## Handoff to B

1. Review this A-side evidence and add F-05B/F-06 mappings, exact test results and versioned demo evidence in your own checkout. Use PRs [#118](https://github.com/zerotwobook/fastTrack/pull/118) and [#120](https://github.com/zerotwobook/fastTrack/pull/120), the contract, and the actual database readbacks. Keep Lab 7 approval and maintenance evidence in [#24](https://github.com/zerotwobook/fastTrack/issues/24) and [#25](https://github.com/zerotwobook/fastTrack/issues/25).
2. Using an already authorized read-only session with the app's database role and connection settings, run `SHOW TIME ZONE`. Record the effective setting and runtime version without including credentials or connection strings. If that session is unavailable, record the setting as unverified and identify the missing access.
3. After coordinating the staging evidence PRs, verify the final head and `main` base, review the full file diff, and prepare the release PR as Draft. Report exact SHAs and candidate CI. Include the four `output/documents/` changes in the scope review.
4. Hand A the Draft PR, exact comparison, checks and known issues. Follow the [main release gate](../../../workflow/MAIN_RELEASE_GATE.md). Await explicit authorization of the specific head and base before marking ready or requesting merge review. After an authorized merge and deployment, both roles verify the resulting commit, image digest, Cloud Run revision, workflow, smoke and persistence before tagging and accepting G6.
