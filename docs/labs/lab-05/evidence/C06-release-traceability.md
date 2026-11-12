# C-06 release traceability record

Task R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16), B/10 record, assembled in B/12. Owner B (`Atip-Infa`); cross-check A (`zerotwobook`). All times are UTC on 12 November 2026 unless stated. This record only links and summarizes observations that already exist; it creates no new result.

**Outcome: one labelled change traversed task PR -> staging -> user-authorized release PR -> main -> live WIF pipeline -> new serving revision, and the live service reports the exact main SHA and shows the change. C-06 technical chain: PASSED. A's independent cross-check of the identity is recorded in [C05-redeploy.md](C05-redeploy.md). B's whole-task acceptance of #15/#16 remains PENDING.**

## 1. The labelled change

| Item | Value |
|---|---|
| Change | Sign-in intro sentence changed from `Keep track of your team's work and feedback.` to `Track your team's milestones, submissions, and feedback.` in `Project_code/client/src/App.tsx`. |
| Why this change | It is a small, user-visible, behaviour-neutral copy change, so a single observation proves which source the live service runs. Evidence: [C06-login-copy.md](C06-login-copy.md). |
| Issue | [#16 R2-J01](https://github.com/zerotwobook/fastTrack/issues/16) (label `lab5`) and [#15 R2-B01](https://github.com/zerotwobook/fastTrack/issues/15) (label `lab5`, pipeline owner). |

## 2. Evidence chain

| # | Link | Actual value | What it proves / scope |
|---|---|---|---|
| 1 | Task PR | [PR #99](https://github.com/zerotwobook/fastTrack/pull/99), branch `feat/s2-a-c06-login-copy`, head `4ce9f9345b4fef50027071d53c556deacbc80d83`, CI [run 43176051762](https://github.com/zerotwobook/fastTrack/actions/runs/43176051762) | The change was proposed through a normal reviewed PR with a passing required check. |
| 2 | Specific peer review | B approval [`#pullrequestreview-5913218944`](https://github.com/zerotwobook/fastTrack/pull/99#pullrequestreview-5913218944) | The author (A) did not approve their own change. |
| 3 | Staging merge | PR #99 merged into `staging/sprint-2` as `80ad1df62700c9aba5d1ac84441143b85e19c629`; staging CI [run 43177025988](https://github.com/zerotwobook/fastTrack/actions/runs/43177025988) | The change was integrated before any release. |
| 4 | Release PR into main | [PR #100](https://github.com/zerotwobook/fastTrack/pull/100), `release/s2-c06-visible`, head `80ad1df…` -> base `16ec6d268ac087f3834be7da55dda29e589847ce`; PR CI [run 43179053148](https://github.com/zerotwobook/fastTrack/actions/runs/43179053148) | Exact release candidate under the required `test-and-docker` check. |
| 5 | User authorization | User authorized this concrete candidate at 2026-11-12T15:43:01+07:00 (08:43:01Z) | Main-release gate ([MAIN_RELEASE_GATE.md](../../../../workflow/MAIN_RELEASE_GATE.md)); no generic approval was reused. |
| 6 | Protected peer approval and merge | B approval [`#pullrequestreview-5916420833`](https://github.com/zerotwobook/fastTrack/pull/100#pullrequestreview-5916420833); merged into `main` as `8e637e537cd037d630a5fffc1b5672d1b44371a8` at 08:46:15Z | Protected merge; main SHA differs from the PR head, as expected for a merge commit. |
| 7 | Main CI | [Run 43185680079](https://github.com/zerotwobook/fastTrack/actions/runs/43185680079), SUCCESS | The merged main commit passed the same check. |
| 8 | Automatic deploy run (not the delivery) | [Run 43185679995](https://github.com/zerotwobook/fastTrack/actions/runs/43185679995), cancelled while waiting at the `demo` environment, 0 deploy steps | B merged PR #100 and so initiated the run; the `demo` environment forbids self-review, so B could not approve. The user authorized the bounded cancellation and one replacement. No protection was weakened. |
| 9 | Delivering run | [Run 43186570077](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077), event `workflow_dispatch`, initiator A, exact ref `main` @ `8e637e5`, SUCCESS (deploy job finished 09:06:24Z); `demo` approved by B (approvals API: `Atip-Infa`, `approved`) | Real keyless WIF delivery of accepted main. This is a manually dispatched run, not an automatic-push success claim. |
| 10 | Jobs in that run | CI job [131075102279](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077/job/131075102279) SUCCESS; deploy job [131076031785](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077/job/131076031785) SUCCESS | CI ran before any image was built or deployed. |
| 11 | Web image | `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-app@sha256:d7606d79c068f7e86796e33f2f0872a02954f1c7a7d5b2d2253a43a1a334cb99`, tag = full main SHA | Immutable web artifact built from the main source. |
| 12 | Jobs image | `…/fasttrack-jobs@sha256:5e94cc946c3ec00353048ec598d082eed0fa1814b24e08e3ea057fdeca5df4d4`, tag = full main SHA | Immutable migration artifact from the same source. |
| 13 | Migration | Cloud Run job execution `fasttrack-migrate-dnvqn`, one task, max retries 0, succeeded 1 / failed 0, completed 09:05:39Z | Migration ran before rollout. |
| 14 | Serving revision | `fasttrack-app-00003-rc7`, single 100% traffic assignment (previous: `fasttrack-app-00002-f75`) | The new revision serves public traffic. |
| 15 | Public identity | `/api/health` and `/api/ready` return version `8e637e537cd037d630a5fffc1b5672d1b44371a8`; `/api/ready` reports `database: connected` | The running service reports the exact built source. |
| 16 | Visible change | Served bundle `/assets/index-BLtpMIBu.js` contains the new sentence and not the old one; deployed Sign in screenshot in [C05-redeploy-login.png](C05-redeploy-login.png) | The user-visible change is live, observed independently of job colour. |

## 3. B's independent checks after the run

| Check | Actual result |
|---|---|
| `python deploy/smoke_test.py https://fasttrack-app-kpx7au3w2a-as.a.run.app` with `EXPECTED_RELEASE_SHA=8e637e5…` | 4 public checks PASS (`/api/health`, `/api/ready`, `/`, `/api/nonexistent`). The optional login check was skipped. |
| Direct reads of health/readiness and the served JS bundle at about 09:14Z | Results as in rows 15 and 16. |

The pipeline's own smoke step also printed `SKIP login: optional smoke credentials not configured`. That SKIP is not a PASS. Authenticated role checks were separate checks by A in [C05-redeploy.md](C05-redeploy.md).

## 4. Limits and recovery

- A green job alone is not the proof; rows 14-16 (revision, traffic, reported version, visible change) are.
- The release time (about 09:06Z) separates the three persistence observations: baseline [C04](C04-public-flow.md), distinct restart [C05](C05-persistence.md) and after-redeploy [C05-redeploy](C05-redeploy.md).
- Rollback is a `workflow_dispatch` of `Deploy demo` with the full `image_tag` of an existing compatible image. It re-points the service, skips migration and seed, and needs a fresh `demo` approval from someone other than the initiator. It does not reverse database schema or data. It was documented and covered by offline tests; **no live rollback was executed**.
- The report-source commit is documentation only. It is not a newly built or deployed source; the serving source remains `8e637e5`.
- No tag was created or moved.
