# Findings, correction chains and independent retests

Working templates for both teams. No finding, bug count, correction, RED/GREEN run or retest exists merely because this file is prepared. Link each actual record to [execution-results.md](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/docs/labs/lab-06/execution-results.md) and the exact Sprint 1 contract.

## 1. Finding report template

- Finding / actual GitHub Issue ID:
- Direction: received about fastTrack / sent about partner product:
- Product owner/team; reporter name/team; report date/time/channel:
- Tested URL, source commit and deployed revision:
- Case ID; violated requirement/AC; relevant contract text:
- Preconditions, safe synthetic data IDs and exact inputs:
- Numbered reproduction steps:
- Expected result:
- Actual result and sanitized evidence IDs:
- Severity and concrete user impact:
- Proposed owner; actual disposition and reason after triage:
- Delivery/receipt reference:

Use Critical for severe loss/exposure or unusable core behavior, Major for an important required journey/rule/access failure, and Minor for a limited-impact defect. Explain the actual impact rather than selecting severity from appearance alone. A missing planned Sprint 2 feature is not automatically a Sprint 1 defect.

## 2. All received findings about fastTrack

Classifications: accepted defect, duplicate (link original), not-defect, enhancement. Reproduce/clarify before dismissing; tie every disposition to Sprint 1 scope and evidence. Do not relabel a failing agreed requirement as an enhancement. If independent execution finds none, explicitly record zero received findings with the completed session/tester reference; the blank row below is not a zero-findings result.

| Finding / case | Reporter / tested version | Classification and evidence-based reason | Severity / impact | Module owner | Fix / disposition status | Linked original / PR / retest |
| --- | --- | --- | --- | --- | --- | --- |
| NOT YET REPORTED | NOT RECORDED | NOT TRIAGED | NOT ASSESSED | NOT ASSIGNED | NOT RUN | None recorded |

Critical/Major defects block acceptance until corrected and independently retested. Minor defects must be fixed or explicitly accepted by the UAT Team as documented limitations. Enhancements outside the agreed scope need not be implemented for Sprint 1 acceptance.

## 3. Outgoing findings about the partner product

Use the same finding template. The partner owns triage/correction; A/B independently retest its corrected release and give an evidence-based decision. Record both members' actual contributions.

| Finding / partner case | Reporter / date / tested version | Expected versus actual / evidence | Proposed severity and impact | Partner disposition / owner | Corrected release / retest result |
| --- | --- | --- | --- | --- | --- |
| NOT YET REPORTED | NOT RECORDED | NOT OBSERVED | NOT ASSESSED | NOT RECEIVED | NOT RUN |

## 4. Traceable correction chain for each accepted defect fixed by fastTrack

1. Reproduce the reported behavior at the recorded defective commit. Add a meaningful automated regression test that asserts the correct behavior and fails for that defect (RED). Preserve the actual command, test/assertion excerpt, commit, output and counts. A syntax/fixture failure is not evidence of the reported defect.
2. Fix the owning module on a new scoped branch from synchronized sprint staging. Keep RED off protected branches. Run the same test GREEN and relevant existing regression suites; preserve actual outputs/counts/skips.
3. Obtain substantive non-author peer review and passing CI; integrate through the normal protected staging PR. Do not invent an approval or delete a failing test to hide unrelated failures.
4. Prepare the concrete release candidate. Follow [MAIN_RELEASE_GATE.md](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/workflow/MAIN_RELEASE_GATE.md): the user reviews and explicitly authorizes its current head/base before lifting a main PR's Draft, and required peer/protection still apply. This preparation itself authorizes no main release or cloud operation.
5. After the actual reviewed main release/deployment, record merge/source/image/revision and post-deploy smoke checks. Give the independent team the exact corrected version and original failed cases. Multiple fixes may share a clearly reviewed release, with each Issue traceable to its own correction.

| Evidence field | Actual entry |
| --- | --- |
| Issue / case / requirement | NOT RECORDED |
| Defective baseline source / deployed revision | NOT RECORDED |
| RED commit / command / test and assertion / actual failure and counts | NOT RUN |
| Fix commit / relevant production diff | NOT IMPLEMENTED |
| GREEN and broader regression commands / results / counts | NOT RUN |
| Peer review author / text / reviewed head / decision / time | NOT PERFORMED |
| CI run / exact tested commit / result | NOT RUN |
| Staging merge / release authorization / main PR and merge | NOT PERFORMED |
| Corrected deployment source / image / revision / smoke outcome | NOT DEPLOYED |
| Partner receipt / independent retest reference | NOT RECORDED |

## 5. Independent retest template

- Finding and original failed case(s):
- Independent tester name/team; actual time/time zone:
- Corrected URL/source/revision and original defective baseline:
- Preconditions/inputs and original steps actually repeated:
- Expected result; actual result; PASS/FAIL/BLOCKED:
- Before/after protected state and evidence IDs:
- Affected UAT cases rerun, actual results and unresolved findings:
- Retest decision/conditions and actual tester confirmation:

A developer saying the fix passed CI is not the independent retest. Keep an original failure, correction and later retest as separate dated observations.

## 6. If no legitimate defect is found

Complete independent UAT and obtain the actual decision on the healthy release. Ask the instructor/TA for a controlled defect exercise on an isolated version/branch, then apply the same report/triage/RED/GREEN/review/release/retest process to that exercise. Record the real approval/scope and keep the exercise separate from the healthy assessed release. Do not deliberately break the live release, invent findings or substitute a planned enhancement.

If a controlled exercise or replacement tester is not supplied after timely notification, retain the completed work, real notification and unresolved dependency for the report; do not claim unperformed work. The independent [acceptance record](https://github.com/zerotwobook/fastTrack/blob/749e5676a44b014b8c070ee2c5ba1bf4b03b245f/docs/labs/lab-06/acceptance-record.md) must still reflect actual blockers and conditions.
