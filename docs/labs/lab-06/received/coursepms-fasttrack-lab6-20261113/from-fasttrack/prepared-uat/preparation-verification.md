# Preparation verification and remaining readiness

Task R2-A04 / Issue #22; A prepares, B reviews. This record separates document preparation, anonymous service checks, owner access/dry-run, independent execution and release acceptance. Only actual observations are labelled as completed.

## Sources and preparation scope

The instructor handout at [Lab 6](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/lab_file/Lab6/Lab_6_Sprint_1_UAT.pdf) sections 2-5 is the assessment source. It requires delivered Sprint 1 UAT, both teams' Product/UAT roles, at least four cases/categories, traceable findings/correction/retest and an independent decision. The repository's earlier workflow predates the standalone handout; its unqualified one-defect wording is read with the handout's explicit no-legitimate-defect controlled-exercise path.

The user supplied these facts in the current preparation conversation: partner testers Tatchakorn Thamnimitr, 67070503415 (Magiciancat9), and Pawarit Wongdaeng, 67070503466 (martinvadre); initial test on 13 November 2026 from 17:30 Asia/Bangkok; reuse existing Lab 5 test accounts and create new synthetic UAT records. A subsequent reply identified Section 31 / Group EN-022_P6, CoursePMS, its public URL/repository and reported main/release commit `150dc5db3de5c829a7d9ef1adb545191cc37542d`. The user then proposed retesting on 14 November 2026 at 13:30 Asia/Bangkok (06:30 UTC). These are user-provided arrangements; partner confirmation of the proposed retest and private credential delivery remain pending. The anonymous identity checks below add their own actual observations, not independent case execution.

Historical prerequisite: B approved PR #104 at exact head `c0fabac` and merged it into staging at `4f3102a` on 13 November 2026. PR #107 then integrated the supplied report/handout/skill artifacts at `0578251`. Whole Lab 5 Issue #16 remains open for its actual final member/export/submission steps. This scoped document/test-design preparation is independent of those submission actions and does not close their gate.

## Verification ledger

| Check | Actual status / scope |
| --- | --- |
| Requirements and UI/source review | Read accepted S1 auth/milestone/submission/feedback contracts, D1AC references and actual App/MilestoneTrack/Submission/FeedbackPanel/session source. Case labels, role routes, fields, status recovery, time semantics and CSRF request shape are source-aligned; this is not live browser execution. |
| Participant and appointment attribution | Copied the user's names/IDs/handles, Section 31 / EN-022_P6, CoursePMS URL/repository/reported source, initial start, account choice and proposed retest on 14 November 2026 at 13:30 Asia/Bangkok. No partner confirmation or signature is invented. |
| Anonymous source/readiness | Actual curl GET observations are retained in [preparation-public-readback.json](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/docs/labs/lab-06/evidence/preparation-public-readback.json), with actual UTC times, HTTP status, expected/observed source and command scope. No login, domain write, traffic inspection or cloud CLI action. |
| Partner anonymous source/readiness | Actual curl GETs at 07:27 UTC on 13 November 2026 returned health/ready HTTP 200, commitSha 150dc5db3de5c829a7d9ef1adb545191cc37542d and db connected. [partner-public-readback.json](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/docs/labs/lab-06/evidence/partner-public-readback.json) preserves exact observations. Web-reader access failed; direct curl with normal TLS verification succeeded. No authentication/domain action, repository-main ancestry check or independent partner case was performed. |
| Package Markdown, links, tables, English and fenced recipe | PASS: 7 English Markdown files, 35 resolving local links, 17 structurally consistent tables, balanced fences, no trailing whitespace and 8 unique numbered executable cases. The fenced browser recipe passes Node syntax checking; origin/student/synthetic-fixture/deadline guards and CSRF shape were checked against source. Both readback JSON files parse and retain four actual anonymous endpoint observations across the two products. No live authenticated recipe execution occurred. |
| Required exact-head CI | Track the actual candidate/run/result in [PR #108](https://github.com/zerotwobook/fastTrack/pull/108); an earlier checkpoint run is not evidence for a later head. This static document does not assert a future CI result. |
| B written-procedure dry-run | NOT RUN by this preparation. B must record its actual scope/results and findings; no peer reproduction inferred from author checks. |
| Current SA/A1/SB access, assignment and private credential delivery | NOT RUN / NOT CONFIRMED by this preparation. Existing Lab5 evidence is historical; this package does not re-login or distribute secrets. |
| New NORMAL/DEADLINE/VALIDATION records | NOT CREATED by this preparation. The session's explicit setup/cases create and record new prefixed synthetic records through the normal UI. |
| Independent incoming/outgoing UAT | NOT RUN. Every actual-result field remains blank or NOT OBSERVED. |
| Findings/RED/GREEN/independent retest/acceptance | NOT PERFORMED / PENDING; the templates are not evidence of these milestones. |
| Main/cloud/schema/app changes and report export | No such operation is part of this preparation. Author Markdown only; user handles final PDF assembly/upload. |

## Session release-to-partner gates

The package can be peer-reviewed with open coordination fields, but do not describe it as access-verified or fully executed. Before the planned session, A/B must record:

1. B's actual written-procedure dry-run/feedback, current deployed revision and matching anonymous source/readiness.
2. Current SA/A1/SB sign-in/assignment and actual private credential delivery to the named testers.
3. Agreed setup/run ID and permission for the new synthetic records; no original Lab5 evidence changes.
4. Evidence/communication channel and the team's retest appointment.
5. Partner cases/accepted scope, private accounts, setup/cleanup and deployed revision for A/B reciprocal testing. Team, product URL/repository and selected source are now supplied; missing execution prerequisites block reciprocal execution, not preparation of fastTrack's incoming case sheet.

No further secret value is needed in chat or GitHub. Remaining unknown coordination facts can be filled by the user from the actual agreement. Keep all execution statuses truthful if a precondition remains blocked.

## Report and review boundary

The package PR targets `staging/sprint-2` only. Peer review covers this document package; whole Issue #22 remains open for actual independent UAT, triage, corrections/retests and decisions. All future correction releases into main retain the user's concrete-candidate release gate. The original Sprint 1 branch/tag, root checkout's untracked Lab 5 PDF, historical evidence and all application/configuration/schema files are preserved.
