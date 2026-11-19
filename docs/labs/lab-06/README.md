# Lab 6 independent UAT evidence and report assembly

Start with the [19 November closeout evidence](sessions/2026-11-19-lab6-closeout.md) for the returned Sprint 1 decision, the Section 3.5 retest and the TA disposition reported by the user. The [Section 3.5 implementation record](simulation-3.5/README.md) preserves the isolated exercise procedure.

R2-A04 / Issue #22. Owner A, reviewer B. Scope: the delivered Sprint 1 product, with product-owner and independent-tester responsibilities recorded separately. This public navigation links the user-confirmed reviewer names and reviewed synthetic-data screenshots for the latest return. Student IDs, credentials and earlier private source/report payloads remain in the local kit.

## Current state

B approved and merged the Section 3.5 [PR #115](https://github.com/zerotwobook/fastTrack/pull/115) into staging as `03d5b13`. CoursePMS returned UAT-01–08 PASS and Accepted for the assessed Sprint 1 scope, and separately accepted the Section 3.5 retest. [PR #114](https://github.com/zerotwobook/fastTrack/pull/114) carries the report evidence for peer review into staging. Assessment export, submission and receipt are tracked separately.

CoursePMS corrected source aeb804ea is deployed through release #76. The actual AI-operated 19:11-19:15 retest passes the original no-refresh account-switch path. Later 21:30-21:33 execution resolves the no-team/unassigned and safe review-denial subchecks. Current mapping: eight deployed targeted case PASS; RT-07 PASS by evidence review and isolated automated replay (16 client / 19 selected server PASS). See [completion details](sessions/2026-11-17-coursepms-remaining-checks.md). The user now accepts CoursePMS, reports CoursePMS acceptance of fastTrack, and confirms shared A/B checking; see [decision provenance](sessions/2026-11-17-user-acceptance-confirmation.md). Individual historical case times/signatures are not inferred. Earlier dated preflights/candidate statuses are historical.

The [18 November technical evidence](sessions/2026-11-18-coursepms-fasttrack-returned-results.md) preserves its Codex operator and 28 original screenshots. The [owner deployment readback](sessions/2026-11-18-fasttrack-cloud-run-readback.md) at 15:19:49 confirms `fasttrack-app-00003-rc7` at 100% traffic on that date. The [TA evidence page](ta-review-status.md) explains the newer reported joint human session, its limitations and the 19 November user-relayed TA response.

Earlier API/UI outcomes retain their original operators, dates and separate counts in [the consolidated historical result](sessions/2026-11-18-fasttrack-recorded-results.md).

## Read in this order

1. [Current evidence and owners](current-status.md).
2. [Public Parts A-D outline](report-draft.md) and [evidence/assembly index](evidence-index.md).
3. [CoursePMS targeted retest completion](sessions/2026-11-17-coursepms-remaining-checks.md), with separate deployed and isolated results.
4. [Current decision records](acceptance-record.md) and [actual/proposed contribution distinction](contributions-and-ai.md).
5. [19 November Section 3.5 retest and database evidence](sessions/2026-11-19-lab6-closeout.md#section-35-simulated-deadline-exercise).
6. [Original eight-case plan](uat-cases.md), [private-access/fixture handoff](partner-handoff.md), reusable [execution](execution-results.md) and [finding/retest](findings-and-retest.md) templates.

## Evidence directions

| Direction | Actual retained evidence | Remaining limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | 19 November joint human session reports UAT-01–08 PASS and Accepted. 18 November Codex evidence supports the technical results. | Human per-case timestamps, fixture IDs and images were not retained. User reported the TA accepted the evidence on 19 November. |
| fastTrack testing CoursePMS | 14 November eight official paths: 36 core PASS; actual full ledger 56 PASS / 1 FAIL / 57. Corrected deployed 17 November retest recorded | Original arithmetic/Back deviation retained; eight deployed targeted PASS plus RT-07 evidence/local PASS; accepted by the user within recorded evidence scope |
| Section 3.5 exercise | PR #115 merged at `03d5b13`. Partner retest accepted, with 16/16 evidence comparisons and matching DB snapshots. | Separate from the assessed Sprint 1 deployment. |
| Evidence integration | PRs #108/#110/#112/#113 integrated through recorded reviews/merges. | PR #114 carries the current closeout evidence for review. |

## Final report handling

Prepare English Markdown; the user assembles/exports the single self-contained PDF and submits via LEB2 by 22 November 2026, 23:59 Asia/Bangkok. Include Parts A-D, full applicable cases/contracts, readable original/negative/correction evidence, actual contributions, AI use, limitations and exact-version decisions. Page ranges and submission receipt are filled after actual export/submission. No fixed video or page-count requirement is invented.

The private kit retains original source archives, credentials, student IDs and earlier private images. The latest reviewed synthetic-data PNGs and JSON evidence are published with explicit source hashes and transformations. Actual later live and isolated test execution is recorded separately from assembly. No PDF, external message, main release or human signature is performed. Preserve historical instructor artifacts and original ledgers unchanged.
