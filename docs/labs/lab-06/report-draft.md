# Lab 6: independent UAT and defect management

**Status: product decisions recorded from current user confirmation; TA disposition, peer integration and final submission remain open.** R2-A04 / Issue #22. This public outline uses roles A/B and Partner 1/2. Full student identities, original private evidence and selected figures are confined to the separate private identified Markdown kit. No submitted PDF or acceptance is claimed.

## Contents and version control

| Section | Assessed material | Final exported pages |
| --- | --- | --- |
| Part A | Complete case plan, applicable contracts and safe handoff | PENDING actual user export |
| Part B | Both directions' actual execution, results and deviations | PENDING actual user export |
| Part C | Original findings, dispositions, severity and status | PENDING actual user export |
| Part D | Correction/retest chains, own-product dependency, actual contributions/AI/decisions | PENDING actual user export |
| Appendices | Complete applicable source cases/contracts, selected outputs/review text and readable figures | PENDING actual user export |

The private kit embeds assessed source material and selected images in its Markdown report. Links supplement that material. The user assigns final page ranges only after the actual PDF export, then submits via LEB2 by 22 November 2026, 23:59 Asia/Bangkok.

| Version role | Exact recorded identity | Meaning |
| --- | --- | --- |
| fastTrack original Sprint 1 | v1.0.0-sprint-1 -> ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8 | Preserved baseline tag |
| fastTrack tested later release | 8e637e537cd037d630a5fffc1b5672d1b44371a8 | Assessed Sprint 1 F-01-F-04, release PR #100 |
| fastTrack dated serving metadata | fasttrack-app-00003-rc7, 100% on 14 November | Historical readback, not a new cloud observation |
| CoursePMS exploratory version | 150dc5db3de5c829a7d9ef1adb545191cc37542d | 13 November bounded exploration |
| CoursePMS original official run | 9c22735995c985aaa0622b6b179de1ac9c1f80ca | 14 November original run with session-state failure |
| Original isolation RED / GREEN | d3ea0116006c7338f6d7f54aaf7c7b3f4e9ffb63 / 3b7de94040f8944aae2db3b751f4c91cdf8907fb | Partner automated correction evidence |
| Follow-up RED / GREEN | 9834080 / 6de3c9a8b3404b831041a9b9fe855d1d52f9cac3 | Partner stale-login/banner/unsaved-input corrections |
| Privacy/routing RED / GREEN | dd45d9e / b29109d531ca47eace1b13f55076dbcbb9509c14 | Partner contract corrections; later integrated guards included |
| Reviewed release head | 54ac5ee7678900bde9969b3c0aeac39635aea484 | CoursePMS staging release candidate |
| Corrected main/deployed source | aeb804ea5bc667399b00cf54df10046a6ded46e0 | Normal merge of reviewed release #76; differs legitimately from staging head |
| Corrected serving identity | course-pms-00009-mk2, 100%; digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0 | Dated deploy 44074859743 CLI output |
| Accepted fastTrack evidence integration | PR #113 head baab0b2, staging merge 01f61a9 | Account-reviewed evidence integration; no main release or UAT signature |

## Part A: UAT preparation and handoff

fastTrack's delivered Sprint 1 scope is F-01 sign-in/out and scoped teams, F-02 milestone creation/read, F-03 one shared version-1 submission before deadline, and F-04 private append-only feedback on that exact submission/version. Sprint 2/3 unfinished behavior is excluded from this acceptance. The eight executable cases use stable IDs and requirement/AC references, role/preconditions, safe synthetic inputs, numbered actions and specific expected outcomes.

| Case | Required category / purpose | Traceability |
| --- | --- | --- |
| UAT-01 | Normal milestone creation/read | FR-01/02/03; AC-01.1/01.5, AC-02.1 |
| UAT-02 | Normal submission and append-only exact-version feedback | FR-04/05; BR-07; AC-03.1, AC-04.1/04.4 |
| UAT-03 | One shared submission boundary | BR-05; AC-03.3 |
| UAT-04 | Real server-confirmed deadline rejection | BR-04; AC-03.2 |
| UAT-05 | Foreign ownership reads denied | BR-02; AC-01.5/02.2/03.5/04.2 |
| UAT-06 | Forbidden role and invalid input | BR-03/08; AC-02.2/02.3/03.4/04.3 |
| UAT-07 | Session/account-switch state | FR-01; AC-01.1-01.5 |
| UAT-08 | Saved state/version/feedback persistence | FR-04/05; BR-07; AC-03.1/04.1/04.4; NFR-03 |

[Full cases](uat-cases.md), [handoff](partner-handoff.md) and the tested contracts are included in the private report appendices. Credentials are delivered privately, not printed. Role profiles, exact source/revision, sequential case dependencies, fixture IDs and retained synthetic data must be verified for actual execution. Preserve original records; no reset/deletion is implied by test cleanup. Prepared expected outcomes are not actual results.

## Part B: independent execution in both directions

### CoursePMS testing fastTrack

Original incoming source 8e637e5: 97 PASS / 0 FAIL main API assertions across 74 HTTP observations. Seven post-UI controls are a separate set. Later UI follow-up: 26 observations, 25 final controls and 11 saved-state comparisons, all with original operator attribution. No confirmed fastTrack product defect is established in this bounded evidence. Initial setup attempts are separate, not added to completed totals.

The follow-up performs meaningful UI writes/readbacks and a stale-form deadline path, while preserving disclosed procedural differences: sequential role profiles, isolated API denial checks outside the DevTools recipe, approximately 4m10s deadline lead rather than the proposed five minutes, validation on the normal fixture, and limited browser-history/session-replay coverage. Existing results are reused. The user reports CoursePMS acceptance of fastTrack and confirms shared A/B checking; original partner metadata and historical individual case times/signatures are not inferred from AI logs.

### fastTrack testing CoursePMS

The official CPMS-UAT-01-08 packet was exercised on 14 November, approximately 22:54-23:14 Asia/Bangkok, source 9c227359. Core official assertions: 36 PASS. Actual full machine ledger: 56 PASS / 1 FAIL / 57 records, 70 HTTP and 26 UI observations; 32 original screenshots. The original narrative says 57 PASS / 1 FAIL / 58 and includes absent CPMS-A-058. Preserve source bytes and document the discrepancy; do not invent another assertion or product bug.

| Official case | Actual covered path | Core PASS assertions |
| --- | --- | --- |
| CPMS-UAT-01 | Authentication/session; Back reached about:blank then actual return/reload required sign-in | 7 |
| CPMS-UAT-02 | New team/member creation and persistence | 2 |
| CPMS-UAT-03 | Duplicate membership/capacity denial with unchanged-state controls | 3 |
| CPMS-UAT-04 | Incomplete draft saved; submit rejected without change | 2 |
| CPMS-UAT-05 | Submitted state and edit/repeat-submit locks | 2 |
| CPMS-UAT-06 | Foreign private read/write and student-review denial on the original synthetic fixture | 6 |
| CPMS-UAT-07 | Review/revision/resubmit/approve and terminal-state denial | 8 |
| CPMS-UAT-08 | Saved-state comparison across roles/reload/relogin | 6 |

Passing original guarded paths do not cancel the separate stale-client-memory failure. The later corrected-release retest is distinct, source-bound and non-destructive. Detailed original and retest evidence is indexed separately.

## Part C: reporting and triage

| Finding / issue | Original impact and assessment | Partner disposition / current independent state |
| --- | --- | --- |
| L6-OUT-EXP-001 / #71 | Four prior-account private draft fields visible in the next account's empty editor without reload. Client-side exposure; no API bypass or saved copying established. Reload was only a workaround | Major accepted defect; reviewed/deployed correction. Original A -> B reproduction now passes in actual AI retest; accepted by the user using completed targeted evidence |
| Directory summary visibility / #74 | Foreign proposal title/status/revision/time metadata conflicted with roster-only privacy | Partner resolved roster-only contract; Major accepted privacy defect. Assigned/own, foreign, unassigned Student and Instructor paths pass in the completed targeted checks; accepted by the user within recorded scope |
| L6-OUT-EXP-002 / #75 | Unsupported proposal namespace returned SPA HTML rather than intended protected JSON semantics; no private body disclosure shown | Minor routing defect; auth then JSON 404, other unknown API JSON 404. Recorded anonymous/authenticated routing passes |
| Original report arithmetic | Source narrative differs from actual 57-entry JSON ledger | Evidence correction acknowledged; not a product defect |
| Received fastTrack findings | No confirmed defect in bounded AI evidence | Existing independent evidence retained; user reports CoursePMS acceptance. No exhaustive zero-defect guarantee inferred |

The original raw exploratory 25 PASS / 12 FAIL checker results were source-reviewed as 34 matching outcomes, two policy questions and one routing discrepancy. Nine strict TOKEN_REVOKED expectation mismatches were successful rejections, not nine defects. Those historical denominators/interpretations remain separate from official cases and later dispositions.

## Part D: resolution, delivery and independent retest

### Partner correction chain: supporting evidence

The original isolation reproducing test yields 5 failed / 4 passed at the defective RED snapshot; original GREEN yields nine client PASS. Follow-up RED yields 3 failed / 11 passed, then GREEN 14 client PASS. Later roster/routing RED yields six failed / two passed HTTP tests and one failed / 14 passed client tests. Final reviewed release CI reports 41 backend / 16 frontend / 3 E2E PASS, zero skipped, plus production/Docker builds. These are partner-provided or public CI outcomes, not new local test executions by fastTrack.

Corrections #72/#73 were reviewed/integrated, release #76 reviewed and merged as aeb804ea, then deploy 44074859743 records digest/revision/100% traffic and smoke results. Optional authenticated pipeline smoke was skipped; that limitation is separate from the later actual fastTrack browser retest. Private appendices embed representative regression/assertion/diff/output and readable review/release excerpts, not a green icon alone.

### Actual corrected-deployment targeted retest

AI-operated run: 17 November 19:11-19:15 Asia/Bangkok, source aeb804ea at start/end. Updated private A/B/Instructor accounts authenticate. The original same-document no-refresh A -> logout -> B path clears all four fields/private text. Reverse A restores canonical fields; explicit subsequent reload preserves saved values. A/Instructor temporary token replay is rejected, B foreign GET denied, observed own/foreign/Instructor directory behavior and JSON routing pass. Team 5 remains three members, Proposal 3 APPROVED revision 2. No business writes performed; sessions signed out/browser closed.

| RT cases | Current status |
| --- | --- |
| RT-01-06, RT-08-09 | Eight deployed targeted case PASS, including later no-team destination and bounded review denial |
| RT-07 | PASS by exact-source evidence inspection plus independent isolated local replay; no live race claim |

The later 21:30-21:33 follow-up resolves no-team/unassigned privacy and safe Student-review denial. A -> R -> A without refresh restores original A data; invalid-input POST to ID 0 returns 403 BR06_INSTRUCTOR_ROLE_REQUIRED, and the complete authorized directory is unchanged. Team 5 / Proposal 3 APPROVED revision 2 is retained. [Latest detailed results](sessions/2026-11-17-coursepms-remaining-checks.md) distinguish eight deployed PASS from RT-07 evidence/local PASS. Independent isolated replay passes 16 client and 19 selected/mocked server tests; initial Node 26 localStorage runner failures are retained, followed by unchanged client-suite PASS on Node 20. Seven anonymous, eight earlier authenticated and fourteen additional records remain separate evidence sets. No new confirmed product failure is observed; exhaustive product acceptance and human signatures are not claimed.

### TA clarification: no confirmed legitimate fastTrack defect

The user plans to ask the TA what fastTrack must provide for the defect-resolution requirement given its existing independent API/UI evidence and reported acceptance without a confirmed legitimate defect. CoursePMS has a genuine defect/correction/independent-retest chain; the question asks whether that satisfies the assessed role or whether an approved isolated fastTrack exercise is required. No TA answer, approved exercise or deliberate live defect is supplied. Incorporate the actual guidance and resulting evidence before final submission.

### Shared contributions, AI use and product decisions

[Current responsibility and AI record](contributions-and-ai.md) records user-confirmed joint A/B checking. A owns plan/normal/state/coordination and TA follow-up; B owns rule/access/privacy/defect/retest evidence and report review. These are responsibility assignments recorded now, not invented historical individual case executions or dates. Actual AI browser/API operation and verified B-account PR #113 review/merge remain separately attributed.

[Product decisions](acceptance-record.md): CoursePMS ACCEPTED by the user's instruction; CoursePMS acceptance of fastTrack is reported by the user. [Confirmation provenance](sessions/2026-11-17-user-acceptance-confirmation.md) records the current confirmation time separately from unsupplied original partner metadata. No separate B/partner signature, external delivery or exhaustive coverage is inferred.

## Final assembly state

[Evidence index](evidence-index.md) maps complete original case/contract sources, findings, outputs, review/delivery facts and private figures to Parts A-D. [Remaining-input handoff](handoffs/2026-11-17-remaining-lab6-inputs.md) supplies concrete unsent partner/human/conditional-TA requests. The private identified report embeds applicable material; the public outline omits all student names/IDs and private source/images. Remaining: B peer review/integration, actual TA guidance and any resulting approved work, final export/page ranges and actual LEB2 receipt. Shared participation/product decisions are recorded with their confirmation scope. No PDF, course upload, external message, application change, main release or human signature is performed by this assembly.
