# Lab 5 evidence index

Owner B (`Atip-Infa`) integrates; A (`zerotwobook`) cross-checks under A/13. This index points to existing artifacts and states each result with its limits. It creates no new test result. A link or file existing is not a pass; the result column says what was actually observed. Dates are 2026; times are UTC unless marked.

**Identities kept separate**

| Identity | Value |
|---|---|
| Serving application source | `8e637e537cd037d630a5fffc1b5672d1b44371a8` (main, [PR #100](https://github.com/zerotwobook/fastTrack/pull/100)), revision `fasttrack-app-00003-rc7`, 100% traffic |
| Public URL | https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| Report-source candidate | The head of the PR that carries this file (recorded in that PR, not self-referenced here). Documentation only; not built or deployed. |
| Submitted tag / commit | PENDING. No tag has been created. Chosen with the user at submission time. |
| Tested sources | Each row names its own source. They differ by design (see C-03, C-04). |

## 1. Required checks C-01 to C-06

Result vocabulary: PASSED, FAILED, NOT RUN, PENDING. "Assisted" means AI-assisted automated observation, not separate manual human testing.

| ID | Exact claim | Artifact / direct link | Source and event | Actual result | Actor | Limits / gaps |
|---|---|---|---|---|---|---|
| C-01 | A normal PR runs meaningful build and tests and passes. | [PR #100 CI run 43179053148](https://github.com/zerotwobook/fastTrack/actions/runs/43179053148), job [131050263173](https://github.com/zerotwobook/fastTrack/actions/runs/43179053148/job/131050263173) `test-and-docker` | `pull_request` on `80ad1df62700c9aba5d1ac84441143b85e19c629`, 2026-11-12 07:57-07:59Z | PASSED. Steps: script checks, `npm ci`, Prisma generate, typecheck, unit tests, production build, isolated PostgreSQL regression, runner and jobs Docker builds. Counts from the job log: 10 Python deploy tests; 166 unit; isolated suites 166 + 38 (G1) + 28 (auth) + 39 + 48 + 42 + 1 (S1 system) + 12 (runtime) = 374 cases, 0 failed. First CI PR: [#85 run 42847201049](https://github.com/zerotwobook/fastTrack/actions/runs/42847201049), SUCCESS. | CI (B-authored workflow), B | Counts are read from the log lines; a test-name list is in the artifact `ci-runtime-report`. |
| C-02 | A failing required test blocks a normal PR from merging. | [PR #95](https://github.com/zerotwobook/fastTrack/pull/95), failed [run 43144813896](https://github.com/zerotwobook/fastTrack/actions/runs/43144813896); [C02-gate-witness.md](evidence/C02-gate-witness.md) | Head `2d90a186927adcc3ede482d9b3e8beeeccefe5e0` on main `16ec6d2`; non-Draft; ruleset `26666182` | PASSED. Required `test-and-docker` FAILED (`AssertionError: 4 != 5`); `mergeStateStatus: BLOCKED`; closed unmerged (`mergedAt: null`). | B; A assisted witness ([review](https://github.com/zerotwobook/fastTrack/pull/95#pullrequestreview-5868601890)) | A's witness is assisted automation, not separate human testing. Proof is never released. The Done automation fired on close and the card was reconciled. |
| C-03 | A fresh clone builds and runs with real PostgreSQL. | [R2-A01-runtime.md](../../../Project_code/docs/evidence/R2-A01-runtime.md), [container result](../../../Project_code/docs/evidence/R2-A01-container-results.json), [regression](../../../Project_code/docs/evidence/R2-A01-regression.json); B's reproduction in the [PR #84 review](https://github.com/zerotwobook/fastTrack/pull/84) | A's clean-clone verifier on `11e6c73fba391cce15f416c9b686cecd6bdb8e88`, 2026-11-10; B's run on PR #84 head `0301f6f459ed9e243d861232a5d962183aeefc56` | PASSED locally. Verifier `passed: true`. Regression 374 cases, 0 failed. B's review states `test:runtime:isolated` (374 cases) and `verify:container` (13 checks) passed. | A (author), B (independent) | Local Docker, not cloud or TLS. B's run is recorded only in the review text; no separate artifact. The tested sources predate the served source. |
| C-04 | Public Supervisor -> Student submission -> exact-submission feedback, plus a role/team rejection. | [C04-public-flow.md](evidence/C04-public-flow.md), [baseline](../../../Project_code/docs/evidence/R2-J01-C04-baseline.json), [results](../../../Project_code/docs/evidence/R2-J01-C04-results.json), three screenshots | Public URL, source `16ec6d2`, revision `fasttrack-app-00002-f75`, run `C04-20261112T040407Z` | PASSED (C04-01..05). Supervisor B reading Team A's submission: 404 `NOT_FOUND`; foreign-origin and missing-CSRF feedback probes: 403, no data change. | A (assisted, isolated real browsers) | Assisted verification. B's independent record readback is PENDING. Milestone POST body capture was lost; its 201 was observed in the request summary. |
| C-05 | The same original records survive a distinct restart and a later redeploy. | [C05-persistence.md](evidence/C05-persistence.md), [R2-J01-C05-restart.json](../../../Project_code/docs/evidence/R2-J01-C05-restart.json), [C05-redeploy.md](evidence/C05-redeploy.md), [R2-J01-C05-redeploy.json](../../../Project_code/docs/evidence/R2-J01-C05-redeploy.json) | Restart: same revision, scale-zero then auto, 06:13:10-06:15:03Z. Redeploy: `8e637e5`, revision `fasttrack-app-00003-rc7`, read 09:12-09:13Z | Domain persistence PASSED. Original milestone `b19ae7d5…`, submission `baa3eb8d…` v1, feedback `b9ebf7f7…` equal in all three stages (canonical SHA-256 `c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e`), both roles. Platform zero-instance sample (active=0, idle=0 at 06:14:00Z) and a new instance ID are recorded. | A; B reviewed and merged restart (PR #98) and redeploy (PR #101) evidence | Session survival NOT ESTABLISHED; eight-hour test NOT RUN. B's own post-release record readback PENDING (needs the private test accounts). |
| C-06 | A labelled change traverses staging -> main -> pipeline and the serving revision matches the built source. | [C06-release-traceability.md](evidence/C06-release-traceability.md) | Main `8e637e5`, [run 43186570077](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077) | PASSED. Chain, digests, migration, revision/traffic, reported version and visible change recorded and independently re-read. | B; A cross-check in C05-redeploy.md | The delivering run was manually dispatched after the automatic push run was cancelled (self-review control). No live rollback was executed. |

## 2. Requirements R-01 to R-12

| ID | Evidence focus | Primary artifacts | Result and limit |
|---|---|---|---|
| R-01 | Reproducible production Docker build/run | [Dockerfile](../../../Project_code/Dockerfile), [.dockerignore](../../../Project_code/.dockerignore), [compose.yaml](../../../Project_code/compose.yaml), C-03, CI Docker step | PASSED locally and in CI (both `runner` and `jobs` targets). |
| R-02 | Environment inventory and secret separation | [deployment.md section 2](deployment.md), [server env example](../../../Project_code/server/.env.example), [compose env example](../../../Project_code/compose.env.example) | PASSED for the documented inventory. No secret value is committed. |
| R-03 | Public GCP workflow | C-04, public URL | PASSED (assisted). |
| R-04 | Persistent external database and record continuity | Cloud SQL `fasttrack-db` attachment in [C05-redeploy.md](evidence/C05-redeploy.md), C-05 | PASSED for domain records. Session survival NOT ESTABLISHED. |
| R-05 | Meaningful PR CI | C-01 | PASSED. |
| R-06 | Required check and blocked-merge proof | C-02, ruleset `26666182` | PASSED. |
| R-07 | Repeatable reviewed main-only pipeline | [deploy.yml](../../../.github/workflows/deploy.yml), C-06 | PASSED once, through `workflow_dispatch` on main. Repeatability beyond this one live run and the offline tests is not shown. |
| R-08 | Source -> digest -> revision/traffic -> version | C-06 rows 9-16 | PASSED. |
| R-09 | Issues, branches, staging, reviews, release history | Issues [#13](https://github.com/zerotwobook/fastTrack/issues/13), [#14](https://github.com/zerotwobook/fastTrack/issues/14), [#15](https://github.com/zerotwobook/fastTrack/issues/15), [#16](https://github.com/zerotwobook/fastTrack/issues/16); PRs [#84](https://github.com/zerotwobook/fastTrack/pull/84), [#85](https://github.com/zerotwobook/fastTrack/pull/85), [#93](https://github.com/zerotwobook/fastTrack/pull/93), [#95](https://github.com/zerotwobook/fastTrack/pull/95)-[#101](https://github.com/zerotwobook/fastTrack/pull/101) | PASSED as a collaboration record for the Lab 5 PRs listed (peer reviews are linked in each row of the C-checks and in C06). Earlier Sprint 1 history is not re-audited here. |
| R-10 | Lab labels and retained CI/contract history | Issues #15 and #16 carry `lab5`; CI runs above | PASSED for the labels observed on #15 and #16. |
| R-11 | Real A/B technical contributions and ability to explain | Section 3 below | PARTIAL. Contribution links exist. Ability-to-explain evidence is the team's own and is PENDING. |
| R-12 | Public repository and artifact access | Public repository `zerotwobook/fastTrack` | PASSED for repository visibility as far as checked: 27 cited GitHub pages returned HTTP 200 without signing in (see [report.md Validation](report.md#validation)). Cloud Console links are not used. |

## 3. Contribution links (no commit-count quota)

| Member | Examples of real, linked work |
|---|---|
| A (`zerotwobook`) | Runtime/container task [#14](https://github.com/zerotwobook/fastTrack/issues/14) / [PR #84](https://github.com/zerotwobook/fastTrack/pull/84); cloud provisioning and first bootstrap (Issue #16); C-04 public flow [PR #96](https://github.com/zerotwobook/fastTrack/pull/96); C-05 restart [PR #97](https://github.com/zerotwobook/fastTrack/pull/97), [#98](https://github.com/zerotwobook/fastTrack/pull/98); visible change [PR #99](https://github.com/zerotwobook/fastTrack/pull/99); post-release readback [PR #101](https://github.com/zerotwobook/fastTrack/pull/101); the delivering `workflow_dispatch` run. |
| B (`Atip-Infa`) | CI and release pipeline task [#15](https://github.com/zerotwobook/fastTrack/issues/15) / [PR #85](https://github.com/zerotwobook/fastTrack/pull/85); live gate plan [PR #88](https://github.com/zerotwobook/fastTrack/pull/88); C-02 proof [PR #95](https://github.com/zerotwobook/fastTrack/pull/95); baseline release [PR #93](https://github.com/zerotwobook/fastTrack/pull/93); peer reviews of #84, #96-#99, #101; release PR [#100](https://github.com/zerotwobook/fastTrack/pull/100) review and merge; the `demo` approval; this evidence and report source. |

## 4. Open items and owners

| Item | Owner | Type |
|---|---|---|
| B's independent exact-record readback with the private test accounts | B (user supplies the private channel) | Missing execution evidence. |
| Optional authenticated smoke credentials in the `demo` environment, so the pipeline login check stops being a SKIP | B / A | Optional hardening. |
| Eight-hour session survival | A / B | NOT RUN; reported as such. |
| Submitted tag or commit; final export and upload (file name per the handout pattern: `lab5_sec31_InfaCompany.pdf`) | User | Submission step. |
| Teammate cross-check of this package | A | A/13. |
