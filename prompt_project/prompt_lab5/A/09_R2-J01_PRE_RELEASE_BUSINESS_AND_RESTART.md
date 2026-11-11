# A / 09: verify the public business flow and preserve original records across restart

## Invocation, scope and hold

I am A (`zerotwobook`), responsible for **C-04 and the restart half of C-05** under **R2-J01 / Issue #16**. B (`Atip-Infa`) cross-checks the actual evidence. This phase establishes the original public records before B's later visible-change release.

**Prompt authoring is not execution.** If asked only to write or improve this Markdown, stop after the documentation work. Do not access production, create test records, restart anything, change #16, release code or begin later prompts.

When explicitly invoked for execution, select one bounded mode:

| Mode | Work and endpoint |
|---|---|
| Prepare | Verify the entry conditions, specify safe cases/evidence and prepare an exact restart plan. Stop before missing access or an unapproved disruptive operation. |
| Execute the agreed cases | Run only the specified public synthetic business/rejection cases and persist their real original baseline. |
| Execute an authorized restart | Recheck applicable approval, perform the exact operation and compare the same original records. |
| Resume | Read the durable checkpoint and continue incomplete cases without duplicating records or restarting again for convenience. |

Use English for project artifacts and Markdown for narratives. The user exports final PDFs. Do not run B/10 automatically from this prompt.

## 1. Required reads and entry gate

Read [all shared execution rules](../00_SHARED_EXECUTION_RULES.md), root project/Git instructions, `workflow/04_LAB5_DELIVERY_PLAN.md` sections 8.2/8.3/10/11 and the current #16 lifecycle. Inspect [A/07](07_R2-J01_CLOUD_RUNTIME.md) and [B/08](../B/08_R2-B01_J01_WIF_GATE_AND_RELEASE_PREP.md) handoffs, actual main/CI/deployment results and the canonical `docs/labs/lab-05/deployment.md`.

Read the implemented milestone/submission/feedback/auth contracts, relevant project-detail rules and existing test fixture conventions. Check actual UI/API routes and response envelopes before specifying expected behavior. Reuse the accepted S1 application; do not implement F-05-F-07 here.

Require a genuinely working first public deployment, the intended persistent DB and accepted runtime/security setup. Verify the current HTTPS URL, actual served source SHA, image digest, revision and traffic. A local build, deployment plan or green PR CI does not satisfy this gate.

Inspect current users/teams only within approved access. Confirm dedicated synthetic Student A, assigned Supervisor A and a real different-team/role actor. Obtain credentials through the approved private input channel, never chat, Git, screenshots or retained request headers. If suitable accounts/fixtures are absent, prepare their explicit provisioning/seed request with the owners; do not run an arbitrary seed/reset.

## 2. Workspace, coordination and evidence ownership

Use A's isolated task/evidence branch and the real joint #16 history. Resume an appropriate open PR; use a new scoped branch from synchronized staging for genuinely new evidence work. Follow early-Draft timing for real edits, without replaying #16's old Backlog/Specified stages or inventing acceptance.

Coordinate a hold with B on the **later visible-change release** until the baseline/restart record is complete. Read current candidate/run state before testing so that another deployment cannot silently change the experiment. This hold is an execution dependency, not permission to disable CI or change protected settings.

A owns the public cases, original-record ledger and restart observation. B independently reads the actual artifacts/records when access permits. Prepared handoff text is not permission to message B or the partner team automatically. Record a witness only after that person actually performs a check.

Reuse existing evidence paths. If none exist, future outputs may be `docs/labs/lab-05/evidence/C04-public-flow.md` and `C05-persistence.md`. These are suggested output paths for execution, not evidence claimed to exist now. Keep actual machine-readable results under established conventions and link them instead of duplicating conflicting versions.

## 3. Plan the test session before business writes

Record a run ID, tester, selected mode, current UTC and Asia/Bangkok time, target URL/environment and release identity. Choose a milestone deadline that is genuinely in the future at execution and remains usable through the planned restart/redeploy window. Do not copy dates or user IDs from this prompt.

Use synthetic titles, descriptions and a safe HTTP(S) submission URL. Avoid real student work, external credentials and accidental notifications/integrations. Only create the records needed for the agreed scenario. An ordinary case invocation permits its specified synthetic UI writes; it does not authorize arbitrary cloud/DB mutation or unrelated data cleanup.

Complete this case sheet first:

| Case ID | Actor and scope | Preconditions | Exact UI/API steps | Expected result from current contract | Saved IDs/unchanged-state check | Evidence |
|---|---|---|---|---|---|---|
| C04-01 | Assigned Supervisor A, Team A | Future due time; correct ownership | Create and reload one milestone | Persisted milestone with intended team/due time | Capture actual milestone ID | Pending execution |
| C04-02 | Student A in Team A | C04-01 visible and open | Submit one synthetic URL and reload | Exactly one saved first submission/version | Capture submission ID and link to milestone | Pending execution |
| C04-03 | Assigned Supervisor A, then Student A | C04-02 exists | Add feedback to the exact submission; read as Student | Same feedback/content visible within scope | Capture feedback ID and exact submission association | Pending execution |
| C04-04 | Different-team actor or Student role | Verified unauthorized relation | Attempt one specified forbidden read or mutation | Contract-specific denial without private data/write | Original records unchanged; no unintended new record | Pending execution |
| C04-05 | Agreed valid roles | Original records reloaded | Refresh/deep-link/read the saved journey | UI/API remain consistent | Compare original IDs and values | Pending execution |

Choose the exact rejection before execution. If expected denial is 403 or concealed 404, derive it from the implemented route/contract rather than guessing. A failed login for an unrelated account is not a team/role authorization test.

Optional duplicate/deadline/CSRF cases require dedicated safe fixtures and clear expected behavior. Do not change system clocks, shorten a real deadline, disable security or brute-force shared accounts to manufacture rejection evidence. Do not turn this bounded public check into a full production mutation suite.

## 4. Pin the initial service and browser state

Before the first case, record actual main/source SHA, web/jobs image digests where relevant, service/revision, traffic, health version and DB-readiness result from accepted filtered read-back. Do not dump full environment/connection strings. Verify the browser is at the intended HTTPS origin and distinguish expected canonical aliases from stale/wrong hosts.

Use separate role sessions/profiles so cached credentials cannot masquerade as a cross-role check. Keep any baseline session needed for survival testing private and separate from short-lived smoke sessions. Logout/revocation tests must not revoke the very baseline session whose restart/redeploy continuity is being measured.

Observe production cookie flags, custom request header, same-origin source and independent CSRF behavior through the actual implemented flow. Record attributes/status only, never cookie/token values. Browser screenshots need the public URL and relevant state, not a private network-header dump.

## 5. Execute C-04 and save each actual outcome

1. As assigned Supervisor A, create the planned future milestone for Team A through the public UI. Reload/read it and record the saved ID, due time, team and creator/supervisor association.
2. As Student A, open that milestone and submit the planned title/description/URL once. Confirm saved success, reload and record immutable submission ID, milestone/team, version, author, saved values and timestamps. Do not use direct DB insertion as the business action.
3. As the assigned Supervisor, select that exact saved submission and add the planned feedback. Read the result as the Student; verify feedback ID, content, author and submission association after reload.
4. Execute the single planned unauthorized attempt using the genuinely wrong team/role. Record actual status/error or visible denial and verify the protected state did not change. Sanitize any response; do not retain unauthorized private payloads as evidence.
5. Confirm the same saved journey through normal navigation/deep links. Readiness alone cannot substitute for a working business flow. If API verification is used, pair it with the actual UI operation and its same-origin session contracts.
6. Record PASS/FAIL/NOT RUN per case immediately, with steps, expected/actual result, current release, tester/time and evidence reference. If an operation times out, read the persisted result before retrying a create or submission to avoid duplicates.

If identity changes mid-session because a release occurs, stop comparisons, preserve the actual timestamps and re-establish the source boundary with B. Do not pretend all observations came from one release.

## 6. Persist the immutable baseline before disruption

Commit/save a sanitized original-record ledger before the restart and later release. Record real values rather than placeholders or newly seeded lookalikes:

| Entity | Immutable identity and relationship | Values to preserve |
|---|---|---|
| Milestone | Milestone ID, Team A ID, supervisor/creator identity | Title, due timestamp/timezone, state and relevant creation time |
| Submission | Submission ID -> milestone/team, author, exact version | URL/title/description, submitted timestamp and saved association |
| Feedback | Feedback ID -> exact submission ID/version, author | Content/association and relevant saved timestamps |
| Session, if claimed | Private retained session reference only; public evidence has no token | Actor, issue/observation time and whether within the absolute eight-hour TTL |
| Environment | Public URL, service and persistent DB identity without connection string | Source SHA, digest, revision, traffic and observation time |

Include case IDs, direct evidence links and the evidence commit separately from the served application commit. Ask B to confirm the ledger can identify the exact original records; do not credit that read-back until it occurs.

A screenshot of a name alone cannot establish identity. Use safely redacted UI/API detail, actual record references and retained result files where needed. Do not overwrite the baseline when writing after-state observations.

## 7. Prepare a distinct supported restart experiment

Cloud Run is not assumed to expose a generic restart button. Specify the actual supported method and what observation proves the old application process/container stopped and a new one served the same persistent data. Check current platform documentation and available permissions when selecting the method.

Use this reviewable operation plan:

| Field | Required content |
|---|---|
| Target | Exact project/region/service/revision and current persistent DB identity |
| Mechanism | Concrete supported command/Console operation and necessary temporary settings |
| Provenance | Observable old/new instance/process/event identity; limits of what the platform exposes |
| Distinction | Why this is a restart experiment and is separate from B/10's new release/revision |
| Impact | Expected availability window, active-user/UAT/grading constraints and owner |
| Authorization | Actual decision covering these unchanged actions, or PENDING |
| Preservation | External DB unchanged; no reset, deletion, seed or replacement records |
| Recovery | How to restore any temporarily approved runtime setting and verify availability |
| Success checks | Same original IDs/content/relationships plus honest session-TTL result |

Do not claim a scale-setting change proves an instance actually restarted without provenance. An env/image update creating a revision cannot be counted twice as both the required distinct restart and the later redeploy. Do not add a public terminate endpoint or delete DB/storage/resources as a restart shortcut.

If a safe supported method cannot establish the requirement, finish the baseline/plan and report the precise missing platform evidence or user/TA clarification. Mark restart proof INCOMPLETE; do not replace it with an invented event.

## 8. Execute only the authorized restart and compare

Recheck the real user authorization, service identity, traffic, baseline ledger, release hold and current availability constraints immediately before the operation. Retain valid unchanged approval without asking again. A changed target or materially changed operation requires a revised concrete plan.

Perform only the approved restart steps. Record command/Console action, actor, actual start/end times and old/new provenance. Restore any approved temporary settings and verify health/readiness/availability without exposing secrets. On failure inspect the actual state before recovery; no blind migration rerun, resource deletion, seed or unapproved rollback.

Read the same milestone, submission and feedback IDs through the public app/API. Compare all preserved values/relationships and record actual differences. Check the retained session only if still within its original eight-hour absolute TTL. Natural expiry is an honest session limitation, not evidence that domain data vanished; never extend TTL or reuse a new session as the old one.

Use a comparison table with columns `Baseline / After restart / After later redeploy / Expected / Result / Evidence`. Leave the redeploy column NOT RUN until A/11 executes after B/10. A successful restart half does not complete C-05.

## 9. Failure handling, handoff and stop

| Observation | Required response |
|---|---|
| Missing/wrong original record or relationship | Preserve baseline/observations; mark FAILED and identify the runtime/data owner. Do not recreate the record to hide loss. |
| Wrong URL/release/traffic or concurrent deploy | Mark identity INCOMPLETE and establish the actual boundary before comparing. |
| Denial exposes data or performs a write | Record a security finding with sanitized evidence; use the owner's actual correction/review process. |
| Restart provenance absent or method unapproved | Keep that proof PENDING/INCOMPLETE; finish independent evidence and name the exact prerequisite. |
| Credentials/fixture access unavailable | Mark affected cases NOT RUN; do not reset passwords or invent results. |

Publish only the intended sanitized Markdown/assets/results through the actual branch/PR workflow. Distinguish authored preparation, executed C-04, restart half, session claim and pending redeploy. A/B human acceptance is recorded only when real; do not mark #16 Done.

The handoff to B/10 must identify case outcomes, original IDs/ledger path and commit, baseline served SHA/digest/revision/URL, distinct restart method/provenance/results, B's actual witness status and unresolved blockers. Keep the later release on hold if required baseline/restart proof is missing. Stop here; [B/10](../B/10_R2-J01_RELEASE_AND_TRACEABILITY.md) is a separate invocation and A/11 must later compare these same original IDs.
