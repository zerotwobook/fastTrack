# Lab 6 independent UAT evidence and report assembly

R2-A04 / Issue #22. Owner A, reviewer B. Scope: the delivered Sprint 1 product, with product-owner and independent-tester responsibilities recorded separately. This public navigation page uses role aliases; full identified report and private images remain in the local assembly kit.

## Current state after PR #113 merge

B-associated account approved PR #113 head baab0b2 and merged into staging at 01f61a9 on 17 November, 20:07:44 Asia/Bangkok. Whole Lab 6 remains OPEN/PENDING. Current report/closure preparation is [PR #114](https://github.com/zerotwobook/fastTrack/pull/114), staging-only; inspect live head/checks/review.

CoursePMS corrected source aeb804ea is deployed through release #76. The actual AI-operated 19:11-19:15 retest passes the original no-refresh account-switch path. Later 21:30-21:33 execution resolves the no-team/unassigned and safe review-denial subchecks. Current mapping: eight deployed targeted case PASS; RT-07 PASS by evidence review and isolated automated replay (16 client / 19 selected server PASS). See [completion details](sessions/2026-11-17-coursepms-remaining-checks.md). The user now accepts CoursePMS, reports CoursePMS acceptance of fastTrack, and confirms shared A/B checking; see [decision provenance](sessions/2026-11-17-user-acceptance-confirmation.md). Individual historical case times/signatures are not inferred. Earlier dated preflights/candidate statuses are historical.

## Read in this order

1. [Current evidence and owners](current-status.md).
2. [Public Parts A-D outline](report-draft.md) and [evidence/assembly index](evidence-index.md).
3. [Actual targeted results](sessions/2026-11-17-coursepms-retest-results.md), with separate original/anonymous/authenticated totals.
4. [Current decision records](acceptance-record.md) and [actual/proposed contribution distinction](contributions-and-ai.md).
5. [Concrete remaining-input request and conditional TA draft](handoffs/2026-11-17-remaining-lab6-inputs.md).
6. [Original eight-case plan](uat-cases.md), [private-access/fixture handoff](partner-handoff.md), reusable [execution](execution-results.md) and [finding/retest](findings-and-retest.md) templates.

## Evidence directions

| Direction | Actual retained evidence | Remaining limit |
| --- | --- | --- |
| CoursePMS testing fastTrack | Initial 97 main API PASS, separate seven post-UI controls; follow-up 26 UI observations, 25 final controls, 11 state comparisons | Separate denominators; no confirmed defect in bounded evidence; acceptance reported by user; original partner metadata not attached |
| fastTrack testing CoursePMS | 14 November eight official paths: 36 core PASS; actual full ledger 56 PASS / 1 FAIL / 57. Corrected deployed 17 November retest recorded | Original arithmetic/Back deviation retained; eight deployed targeted PASS plus RT-07 evidence/local PASS; accepted by the user within recorded evidence scope |
| Evidence integration | PRs #108/#110/#112/#113 integrated through actual B-associated reviews/merges | Integration does not sign either product's independent human decision |

## Final report handling

Prepare English Markdown; the user assembles/exports the single self-contained PDF and submits via LEB2 by 22 November 2026, 23:59 Asia/Bangkok. Include Parts A-D, full applicable cases/contracts, readable original/negative/correction evidence, actual contributions, AI use, limitations and exact-version decisions. Page ranges and submission receipt are filled after actual export/submission. No fixed video or page-count requirement is invented.

The private kit retains source hashes and selected private images; new source/screenshot/credential payloads are not published with this increment. Actual later live and isolated test execution is recorded separately from assembly. No PDF, external message, main release or human signature is performed. Preserve historical instructor artifacts and original ledgers unchanged.
