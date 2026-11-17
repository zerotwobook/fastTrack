# Independent Sprint 1 decision records

Updated after accepted evidence PR #113, merged at 01f61a9 on 17 November 2026. **Both actual human decisions remain PENDING.** The tables below contain dated evidence and explicit missing decision inputs; they are not signatures. AI operations, account-level PR review and integration approval do not establish personally executed UAT or independent acceptance.

## 1. fastTrack: decision reserved for CoursePMS

| Field | Current factual record |
| --- | --- |
| Product / independent team | fastTrack / CoursePMS |
| Recorded tested scope | Sprint 1 F-01 sign-in/scoped teams; F-02 milestones; F-03 one shared version-1 submission before deadline; F-04 private append-only exact-version feedback |
| Recorded tested source | 8e637e537cd037d630a5fffc1b5672d1b44371a8 |
| Baseline distinction | Original v1.0.0-sprint-1 peels to ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8; later tested source does not move that tag |
| Serving metadata | Dated 14 November readback: fasttrack-app-00003-rc7, 100% traffic; not a fresh serving observation |
| Actual incoming AI evidence | 97 main API PASS assertions across 74 HTTP observations; seven separate post-UI controls; follow-up 26 UI observations, 25 final controls and 11 saved-state comparisons |
| Coverage / limitations | No confirmed product defect in bounded evidence; sequential profiles and other documented procedural limits still require actual tester review |
| Actual personal execution/review | Per-member case/time/result confirmation PENDING; account-level events and AI logs do not fill it |
| Independent final decision | PENDING: CoursePMS's actual decision-makers select and confirm for the exact tested release |
| Accepted minor limitations | None personally confirmed; do not infer that no limitations exist |
| Own-product defect workflow | No legitimate fastTrack defect established by bounded evidence. Complete human UAT; if none arises, obtain TA-approved isolated own-product exercise. No approval/exercise currently supplied |

Sources: [initial incoming run](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md), [reciprocal follow-up summary](sessions/2026-11-13-fasttrack-followup-summary.md), [contributions and AI attribution](contributions-and-ai.md).

## 2. CoursePMS: decision reserved for fastTrack

| Field | Current factual record |
| --- | --- |
| Product / independent team | CoursePMS / fastTrack |
| Original assessed run | Eight official CPMS-UAT-01-08 paths, 14 November, source 9c22735995c985aaa0622b6b179de1ac9c1f80ca |
| Original evidence totals | 36 core PASS; actual complete ledger 56 PASS / 1 FAIL / 57. Original 58-total narrative and Back-navigation deviation preserved |
| Partner dispositions | #71 Major client-state isolation; #74 Major roster privacy; #75 Minor protected JSON routing. This does not establish API body bypass or saved copying |
| Reviewed correction / release | Corrections #72/#73 integrated; release #76 merged as aeb804ea5bc667399b00cf54df10046a6ded46e0; deploy run 44074859743 succeeded |
| Identified corrected serving target | course-pms-00009-mk2, 100% traffic, digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0 per dated workflow CLI; no fresh console screenshot claimed |
| Actual corrected AI execution | 17 November 19:11-19:15 Asia/Bangkok. Source matches at start/end. Original same-document A -> logout -> B reproduction PASS; reverse/reload, observed revocation, foreign GET, directory roles and routing results recorded |
| Retest mapping | Eight deployed targeted case PASS; RT-07 PASS by evidence review plus isolated automated replay. Seven anonymous / eight earlier authenticated / fourteen additional records and local 16 client / 19 server PASS remain separate sets |
| Later technical completion | 21:30-21:33 follow-up verifies no-team Student and safe invalid-input review denial on ID 0 with unchanged authorized directory. RT-07 independently replayed in isolation. No pending technical prerequisite in the requested targeted plan; human suitability/decision still pending |
| Preservation | Read back Team 5, three members, Proposal 3 APPROVED revision 2; A canonical proposal and bounded instructor directory unchanged; no business writes |
| Human contribution / decision | Actual personal per-member cases/time/results and exact-version decision remain PENDING |

Sources: [original case summary](sessions/2026-11-14-coursepms-case-summary.md), [initial targeted results](sessions/2026-11-17-coursepms-retest-results.md), [later completion](sessions/2026-11-17-coursepms-remaining-checks.md), [remaining-input handoff](handoffs/2026-11-17-remaining-lab6-inputs.md).

## 3. Uncompleted decision form: one actual decision per product

| Required field | Current state |
| --- | --- |
| Product / exact tested scope / source / serving revision | Use the dated evidence above; reverify if another session/release is chosen |
| Actual deciding people and real confirming identity | PENDING; names/student IDs recorded privately in the identified report |
| Actual decision date/time / timezone / channel | PENDING; no backdating to an AI run |
| Cases executed/reviewed personally and evidence references | PENDING actual per-member confirmation |
| Outstanding findings, blocked cases and minor conditions | Record explicitly; do not mark a blocked requirement as an accepted minor product limitation without an actual justified decision |
| Decision and reason | PENDING; no option selected |
| Actual personal confirmation | PENDING; no AI signature |

Available outcomes: Accepted; Accepted with explicitly documented minor limitations; Not Accepted. Required blocked work or unresolved Critical/Major findings prevent an unsupported Accepted result. Only the independent UAT team for the product decides. A partner's own-product decision cannot sign for the opposite direction.

## 4. Assembly and submission state

The [public outline](report-draft.md) and [evidence index](evidence-index.md) support a separate private identified Markdown assembly kit. It includes original case/contract/output excerpts and selected private images. User export/assembly/page ranges, actual contributions/decisions, any applicable TA exercise and the actual LEB2 submission receipt are still incomplete. Deadline: 22 November 2026, 23:59 Asia/Bangkok. No PDF, course upload, main release or decision is performed by this record.
