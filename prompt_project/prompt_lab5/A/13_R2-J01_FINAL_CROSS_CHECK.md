# A / 13: independently audit Lab 5 readiness and prepare the final user handoff

## Invocation, scope and hold

I am A (`zerotwobook`), auditing B's concrete Lab 5 evidence/report-source candidate under **R2-J01 / Issue #16**. Perform assisted independent checks, record actual findings and prepare a reviewable final handoff. Do not manufacture a teammate's human approval, a merge, public test, PDF, submission or receipt.

**Prompt authoring does not start this audit.** If asked to improve these instructions only, edit Markdown and stop. Do not inspect private accounts/live records, change execution Issues, approve/release anything, export files or contact a partner under that authoring request.

When explicitly invoked, select audit preparation, authorized read-only verification, correction read-back or final handoff. Do not silently turn an audit finding into production mutation or a new release. Use English Markdown for project artifacts and preserve original evidence.

## 1. Read and pin the actual candidate

Read [all shared rules](../00_SHARED_EXECUTION_RULES.md), project/Git instructions, `workflow/04_LAB5_DELIVERY_PLAN.md` sections 3/9-11/15, current [main-release gate](../../../workflow/MAIN_RELEASE_GATE.md), original English handout/rubric and actual current submission instructions.

Read [B/12](../B/12_R2-J01_EVIDENCE_AND_REPORT_SOURCE.md)'s committed report/index/guide, source/evidence list, validation output, unresolved findings and current PR/head/base. Inspect live #13-#16 and the real task/release/proof PRs, reviews/authorizations/runs and original persistence ledger.

Use A's separate clone/worktree. Preserve unrelated or uncommitted work. Identify exactly what is being reviewed:

| Candidate identity | Required record |
|---|---|
| Documentation | Branch/PR, full head/base and report/index/guide/assets at that source |
| Application tests | Actual tested commits, events, commands/runs and environment |
| Main release | Actual authorized head/base, non-author review and merged main SHA |
| Serving environment | Canonical public URL, built source SHA, image digests, revision and traffic/time |
| Submission | Intended submitted tag/commit and actual export/upload/receipt state, if established |

These identities may differ for a report-only commit. Explain the relationship; do not describe the report commit as the deployed binary. An editor tab, a Draft PR or an old passing run is not the current committed/served candidate.

If the candidate changes during audit, preserve the old result with its source and revalidate the changed claims. A new main head/base needs renewed user candidate authorization; do not silently reuse the earlier decision.

## 2. Audit with a claim-to-evidence ledger

Inspect each factual claim against the actual artifact or observation, not only B's prose. Use this row structure:

| Audit ID | R/C/Part | Claim and expected evidence | Exact artifact/source | Check actually performed | Actual result/time | Finding/severity | Owner/next action |
|---|---|---|---|---|---|---|---|
| Unique entry | Actual mapping | Narrow verifiable claim | Direct source required | Observed action or NOT RUN | Honest outcome | Blocking/optional/none | Real owner |

Separate documentation validation, source analysis, offline mocks, prior tests, new public observations, authorized assisted review and actual independent human action. Do not credit yourself or B with a check performed only by an agent or copied from an earlier report.

Prioritize missing core proof, unsafe behavior, wrong source/identity, privacy leaks and invalid authorization as blocking findings for the affected readiness claim. Readability/wording issues can be optional when they do not change meaning or required coverage. Do not invent defects just to create a Fixing stage.

## 3. Verify all six checks directly

| Check | Independent audit questions | Required disposition |
|---|---|---|
| C-01 | Is it a real relevant normal PR/run? Which exact source/event/check/test/build/DB/image assertions passed? Do reported counts match actual output? | Record applicable evidence and limitations; workflow presence alone is insufficient |
| C-02 | Was the proof non-Draft at observation, the failing test actually required, and merge blocked by that failure? Are head/base/rules/run and closed-unmerged history retained? | Reject Draft-only/missing-review-only substitutes and any claim the broken code was an accepted release |
| C-03 | Was there an actual fresh clone/private env setup/build/run with real DB and recorded toolchain/source/image? Does later changed code affect applicability? | Reproduce only when a material difference or missing proof justifies it; do not invent a fresh run |
| C-04 | Did both roles complete the real public domain journey with exact-submission feedback and a meaningful safe rejection? Is UI/API/DB source/time clear? | Health or local-only output cannot certify the public business flow |
| C-05 | Are original IDs/values/relationships linked across before, distinct restart and later redeploy, with actual operation provenance and witness attribution? | Matching names/counts/reseeded replacements or backfilled before-state are incomplete |
| C-06 | Can one labelled task/review/staging/user-authorized main/run/image/revision/traffic/version chain be followed? Does public identity match the actual main source built? | Distinguish initial bootstrap, later visible change, report commit and served source |

Open the relevant direct artifacts and inspect their actual content. Preserve failed attempts and limits rather than relying on a summary badge. A successful agent-assisted review may be documented with its actual user authorization and scope; never relabel it as separate manual human testing.

## 4. Verify R-01-R-12 and report Parts 0-4

Use B's requirement index as a starting point and compare it with the original handout/plan. Confirm every R-01-R-12 row has actual support or an explicit gap, including Docker/env, public business/data persistence, meaningful CI/required-check proof, repeatable main release/source identity, collaboration/labels/history, real A/B participation and continued public access.

Confirm these ordered report headings and content:

- **Answer Part 0: Team and Evidence Index**: real team/topic/section, names/student IDs/GitHub, public repo, intended submitted identity versus served identity, direct evidence index and actual contribution links.
- **Answer Part 1: CI and Quality Gate**: 30-point CI/gate scope with actual normal passing PR, required rules and failed-check blocked proof.
- **Answer Part 2: Docker and Reproducible Configuration**: 20-point image/env/clean-run evidence, exact prerequisites/context/source and private secret handling.
- **Answer Part 3: GCP Deployment and Persistence**: 35-point actual public service/business/rejection plus same-record distinct restart and later redeploy.
- **Answer Part 4: Repeatable Release Pipeline**: 15-point real labelled reviewed staging-to-main-to-serving chain and repeatable procedure/recovery limits.

Check contribution attribution using real Issue/commit/PR/review/result links. Do not use equal commit counts as proof of equal contribution or invent student details. A missing non-secret fact requires the real owner/user's answer and remains PENDING.

## 5. Perform only the justified safe live checks

Inspect the actual public repo and relevant public artifacts without assuming authenticated-owner access proves availability. Do not change repository visibility or publish a private artifact as an audit shortcut.

For the service, use approved private synthetic access and the agreed read-only cases. Pin URL/health/source/revision/traffic/readiness and inspect the visible released behavior. Read original milestone/submission/feedback IDs and the safe role/team rejection as justified by the audit plan. Record exactly which checks were newly performed and which remain prior evidence.

Do not use destructive fixtures against production, create replacement baseline data, reset passwords or rerun migration/seed/deploy to obtain a missing screenshot. If current private access or a public endpoint is unavailable, record NOT RUN/FAILED/UNKNOWN according to the actual observation and name the missing capability. A blocked login is not proof of authorization correctness.

Keep cookie/token/CSRF/DB/secret values out of screenshots, logs and conversation. If evidence exposes an actual secret, identify the location/category without repeating the value and route authorized source rotation/recovery to the owner; silently deleting a screenshot does not resolve exposure.

## 6. Audit the guide, source package and evidence presentation

Read `deployment.md` against the actual source. Check real runtime pins/context/layout, environment purpose/secret/source/consumer, private configuration steps, clean build/run, DB connectivity, explicit migration/add-only seed, main-only release/WIF roles, source/digest/revision/traffic lookup, distinct restart, failure diagnosis and compatible rollback limits.

Inspect claims about secret separation and runtime/tool packaging without dumping real environments or rebuilding unchanged images only to make the audit look fresh. Proposed/unexecuted commands must remain labelled as such. Existing root `deploy/` scripts are accepted paths; do not move them during an audit to satisfy an older generic layout description.

Validate local links/assets/anchors, balanced Markdown fences/tables and readable Markdown preview. Confirm direct PR/review/run/job links support the nearby claim. Numbered captions must identify actual case/result/source/time/actor and preserve enough URL/record/version context to prove the observation. Redaction must not conceal a failed outcome or merge unrelated releases into one story.

Do not generate, rebuild, render or export a PDF as a verification side effect. Review the Markdown source and retained evidence directly. Keep historical instructor/PDF artifacts and real machine-readable results unchanged.

## 7. Check authorization, reviews and lifecycle separately

For each actual main release, read the concrete user decision/head/base and the actual non-author review/protected merge. Notification, silence, green CI or staging acceptance does not satisfy the current main gate. Changed candidates require their own reassessment/renewed decision. No self-approval or protection bypass is authorized by this audit.

Read actual Project/Issue states and scope. A merged release/docs PR may be native Done while #16 still has acceptance/report/submission work. A closed-unmerged C-02 proof is never an accepted broken implementation release. Broader #13 contracts and #15 live gates must be reconciled only from their own criteria, not closed as collateral cleanup.

Use Fixing only for genuine handed-off findings; preserve the actual previous state/timestamp and read back changes when made. Do not recreate old Backlog/Specified history or alter unrelated completed cards.

## 8. Findings, corrections and targeted revalidation

Prepare an English audit record at an existing agreed path, or a future scoped path such as `docs/labs/lab-05/final-audit.md`. This suggested path is not an artifact claimed to exist by the prompt.

Each finding needs category/severity, exact file/line or direct artifact/case, expected versus observed behavior, affected R/C/Part/source, owner, concrete correction and required retest. Distinguish evidence invalidity from application failure and wording corrections from missing real experiments.

Return report/index/guide corrections to B's actual branch/PR; route runtime/auth/data/release findings to the actual owner and scoped correction process. Routine authorized small documentation corrections may be made without an extra approval gate, but do not silently take over a teammate's module or substantive application work.

After a correction, revalidate changed claims and affected links/source relationships. A successful retest is a new attributed observation; it does not erase the earlier failure. New application/main candidates must pass their actual checks/user/peer gates. No blind DB repair, unapproved cloud mutation or fabricated human acceptance.

## 9. Final readiness matrix and human decision

Present the exact current candidate and a compact disposition:

| Dimension | Actual state/evidence | Remaining owner action |
|---|---|---|
| Implementation integration | Accepted scope/PR/merge, or actual gaps | Owner/correction |
| Automated verification | Tested source/run/check outcomes and applicability | Affected recheck if needed |
| Public runtime/business | Actual URL/served identity/C-04 result | Runtime/business owner |
| Persistence | Original-ID restart and redeploy results, session limitation and witness status | Legitimate missing experiment/read-back |
| CI gate/release chain | C-02 and C-06 actual evidence | Gate/release owner |
| Report-source readiness | Exact report/index/guide head and validation/findings | B corrections or review |
| Human acceptance | Actual current-source user/peer decisions; do not invent them | Named real decision still needed |
| Export/submission | Actual file/upload/receipt only if separately performed | User-controlled pending action |
| Availability/handoff | Public repo/service and retained CI/proof/history obligations | Named maintenance/contact owner |

Declare a narrow READY/BLOCKED/PENDING result for the audited scope, with blocking and optional findings separately. Readiness is not a merge, release authorization or submission receipt. Only reconcile #16 closure/Acceptance when all applicable real criteria and required human acceptance are satisfied; do not mark it Done from an author check alone.

## 10. User export/submission and later-lab handoff

The recorded target is one team PDF named `lab5_sec<section>_<group name>.pdf` on LEB2 by **15 November 2026, 23:59 Asia/Bangkok**. Recheck actual instructor updates/current local date when executing; do not invent an extension or claim timely submission without evidence.

The user assembles/exports/uploads the final report unless explicitly requesting separate assistance. Provide exact Markdown source/index/assets and unresolved facts, not a generated PDF. A later explicit export/upload request has its own scope and actual result; do not claim a file was submitted merely because the source is ready or an upload page opened. Record a receipt only when it actually exists.

Prepare a non-secret Lab 6 handoff containing fixed source/version, public URL, role/access setup instructions, known limitations, evidence/reproduction links and availability owner. The user shares credentials privately and sends partner/TA messages; this prompt does not authorize sending them. Preserve the same project/repo/pipeline/history for later labs.

Keep public repo/service available through announced grading/UAT obligations; do not pause, rotate, delete, tear down resources or remove failed proof history to finish the checklist. Stop after this bounded final audit/handoff. Do not start F-05-F-07 implementation, Lab 6/7, cleanup, main release or submission automatically.
