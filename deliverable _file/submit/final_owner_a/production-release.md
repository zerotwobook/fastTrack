# Final production release and readback

| Field | Verified release value |
| --- | --- |
| Assessed Git tag | [`v1.0.0-final`](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-final) |
| Released commit | `d0f3f9f8455e5e9c3d2047a2b1e1d1b41920d1af` on `main` from [PR #154](https://github.com/zerotwobook/fastTrack/pull/154) |
| G4 candidate | `046310d288859ee42745a043369498d5d646d6c9`. Git tree `693e8fa617967ac4e8576841ac177f982df01320` is identical to the released commit. [Joint G4 acceptance](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7130293441) |
| Main CI | [45394655337](https://github.com/zerotwobook/fastTrack/actions/runs/45394655337) passed on the released commit. Its isolated runtime report records 483 passes, zero failures and seven passing upgrade cases. |
| Production workflow | [Deploy demo 45394655431](https://github.com/zerotwobook/fastTrack/actions/runs/45394655431) succeeded. `zerotwobook` triggered the push and `Atip-Infa` approved the `demo` environment. |
| Migration and serving revision | `fasttrack-migrate-sht6q` succeeded before rollout. `fasttrack-app-00006-wzh` received 100% of traffic. [Deploy job](https://github.com/zerotwobook/fastTrack/actions/runs/45394655431/job/138449100066) |
| Web image digest | `sha256:1c3c5c63b86906bc233e0a4d958e6e13896960611070f484f9a89d748e59a7ef` |
| Migration jobs image digest | `sha256:719ffd4637e80400611824cfbd976c76b3fd2923975ae0ffeffdc3536a7fb288` |
| Public application | [Production fastTrack](https://fasttrack-app-kpx7au3w2a-as.a.run.app) |

## Production observations

The read-only browser and API check ran on 24 November 2026 at 19:57:23 Asia/Bangkok with synthetic demo accounts. [Machine-readable results](evidence/production-d0f3f9f/production-readback.json)

| Check | Observed result |
| --- | --- |
| Serving identity | `/api/health` and `/api/ready` returned HTTP 200 and the full released SHA. Readiness reported `database: connected` before and after the check. |
| Summary recovery | The filtered request returned five matching milestones at one item per page. Page 6 returned zero rows and showed `Page 6 (5 pages total)`. The recovery link returned to page 1 and preserved Team A, Feedback available and page size 1. Team completion stayed 6/14 (42.9%). [Out-of-range page](evidence/production-d0f3f9f/01-summary-out-of-range.png) · [Recovered page](evidence/production-d0f3f9f/02-summary-page-one.png) |
| Stored record continuity | The assigned supervisor and team student retrieved the same team, milestone, submission and version-specific feedback payloads as the [recorded pre-release baseline](../../../Project_code/docs/evidence/R2-J01-C04-baseline.json). The production browser displayed the original work link and feedback on version 1. [Saved work and feedback](evidence/production-d0f3f9f/03-preserved-work-and-feedback.png) |

The independent Cloud and Local UAT runs remain attributed to the G4 candidate. This production readback confirms the deployed identity, Summary recovery and record continuity for the assessed release. [G5 checkpoint](https://github.com/zerotwobook/fastTrack/issues/152)
