# B / 08: prepare WIF, required checks and the initial main release

## Invocation and current hold

This file is a reusable task prompt for B (`Atip-Infa`). It continues **R2-B01 / Issue #15** for live CI/merge gates and **R2-J01 / Issue #16** for cloud/release coordination. A (`zerotwobook`) reviews B's work. Keep the two scopes and their acceptance separate.

**Writing, editing or reviewing this prompt does not start its execution.** Under a prompt-authoring-only request, edit Markdown and stop: do not change #13/#15/#16, GitHub protection/environment settings or GCP, create a release/proof candidate, deploy, or run the deliberately failing experiment.

When later explicitly asked to execute B/08, start with preparation unless the user selected a later phase and applicable approvals already exist. Complete one bounded phase per invocation:

| Phase | Outcome | Boundary |
|---|---|---|
| A: discovery and plans | Current settings/run/resource snapshot, proposed rules/environment/WIF changes and A/B handoff | No unapproved configuration or cloud mutation |
| B: authorized settings | Apply the specifically authorized GitHub/cloud subset and verify read-back | Does not authorize a main merge or C-02 |
| C: initial delivery candidate | Concrete Draft main PR and review package, with actual current checks | Keep Draft until current-candidate user authorization |
| D: authorized initial release | Real peer/protected merge and coordinated first-deploy trace, if separately authorized | A/07 verifies runtime; this is not the later visible-change proof |
| E: C-02 proof | Specifically authorized failing required-check experiment, closed without merge | Never merge or enable auto-merge on the broken candidate |
| F: later candidate preparation | Agreed small visible-change Draft candidate, only when selected | Do not release; A/09 precedes B/10 |

Use English for project artifacts and Markdown for narrative handoffs. Conversation may be Thai. The user handles final PDF assembly/export.

## 1. Required sources, ownership and historical checkpoint

Read [the complete shared rules](../00_SHARED_EXECUTION_RULES.md), `AGENTS.md`, project/Git skills, contributing/development guides, Sprint 2 sections 5.2/5.3/10, Lab 5 plan sections 7-10/12/13, Project automation and the complete main-release gate.

Read live #13/#14/#15/#16 and their actual comments/reviews/acceptance; the accepted delivery contract, current runtime guide/evidence, `Project_code/README.md`, root `.github/workflows/ci-docker.yml` and `deploy.yml`, `deploy/deploy.sh`, `deploy/release.sh`, `deploy/smoke_test.py` and their offline tests. Read original handout and relevant Student Guide WIF/environment/ruleset/release sections. Verify current official provider/CLI documentation when preparing actual IAM/OIDC settings.

Historical checkpoint from 10 November 2026, to recheck before execution:

- #13: delivery subset accepted through PR #83 (`490fe8b` -> staging `09caaa8`); broader F-05-F-07/shared-interface work remains open.
- #14: B approved runtime head `0301f6f`; PR #84 merged as `0bb2309`; R2-A01 accepted.
- #15 code phase: PR #85 corrected head `048d412`, staging merge `cb9b969`, under user-authorized assisted review. Preserve that attribution; do not invent another human execution.
- CI run `42846580997` at `048d412` and staging push run `42847298597` at `cb9b969` succeeded. Neither proves WIF, required-check enforcement, C-02 or cloud deployment.
- Main was `b7174a7` at that checkpoint and lacked the new delivery increment. Discover actual main/staging now; a past successful staging run is not current-main release evidence.

B owns Actions, required checks, GitHub deployment environment, deployer/WIF trust and release orchestration. A owns runtime/provisioning/DB/secret-consumer/origin design in [A/07](../A/07_R2-J01_CLOUD_RUNTIME.md). B remains schema integrator, but this task does not introduce schema changes. Coordinate before editing A's runtime or shared guide sections.

Keep accepted root `deploy/` paths and `Project_code/` build context. Do not copy starter admin/bearer/category flows or add unfinished S2 features.

## 2. Establish real workspace and phase state

1. Inspect authenticated user, repository/permissions, current branch/upstream, uncommitted/staged/untracked work, worktrees, live Issues/Project cards and open/merged PRs. Use B's separate clone/worktree.
2. Fetch current refs and inspect head/base/diff/checks/reviews. Resume an open matching branch/PR. If an earlier PR is merged, do not reopen it or append a new feature and claim the old approval still applies: use a new scoped branch/PR from current staging, linked to the continuing Issue.
3. Preserve the real #15/#16 history; do not recreate their Backlog/Specified stages for every prompt. Register only genuinely new documentation/implementation work where required. Record actual phase/transition time and read-back; keep old completed cards unchanged.
4. For actual new edits follow the repository's early-Draft lifecycle: scoped branch, first coherent commit/push, Draft PR during Started, Project card initialized immediately, then remaining work/checks. Do not create an empty PR solely to claim progress.
5. Keep Verification and Acceptance scoped. A code PR can be Done while #15's live gate criteria remain PENDING. Do not close #13/#15/#16 from partial success.

During an actual execution invocation, discover current state with read-only tools or commands such as:

```powershell
git status --short --branch
git remote -v
git worktree list
git fetch origin
gh repo view zerotwobook/fastTrack --json nameWithOwner,defaultBranchRef,visibility
gh issue view 15 --repo zerotwobook/fastTrack
gh issue view 16 --repo zerotwobook/fastTrack
gh pr list --repo zerotwobook/fastTrack --state open
gh run list --repo zerotwobook/fastTrack --limit 10
gh api repos/zerotwobook/fastTrack/rulesets
gh api repos/zerotwobook/fastTrack/environments
```

Use filtered non-secret output. A 403 is a permission gap, not evidence that a rule/environment is absent. Prefer connected tools when sufficient; if writes are unavailable, use an already authenticated authorized CLI or report the missing capability without pretending success.

## 3. Phase A: prepare a settings and CI gate plan

Inspect ruleset definitions and effective rules separately for actual `main` and `staging/sprint-*` branches. Read existing selectors, enforcement, bypass actors, required reviews, stale-approval dismissal, resolved discussions, deletion/force-push blocks, merge method and up-to-date policy. Preserve intended restrictions. Do not replace an entire policy from memory.

Inspect representative real PR and push runs. Identify workflow, emitted job/check name, check producer, event, head SHA and conclusion. The expected standalone context was `test-and-docker`, but select the observed current context, not a guessed reusable-job display name. Review both CI and deploy-workflow calling behavior.

Check all of the following before proposing a required check:

- Meaningful lockfile install, generation/typecheck/unit/build, guarded real PostgreSQL/migration/S1/runtime checks and runner/jobs Docker builds actually execute with the pinned toolchain.
- PR triggers cover main and the actual sprint staging pattern. Path filters, skipped/cancelled jobs or failed dependencies cannot leave a falsely passing/missing required result.
- PR jobs use minimal read permissions and no cloud secrets or privileged untrusted checkout. Reports/artifacts do not contain credentials or private payloads.
- Required status and up-to-date policy are viable for new main/staging PRs. Preserve actual peer review/no-bypass restrictions; never disable a required check to make a candidate mergeable.
- A passing workflow proves its actual assertions at its source; it does not prove branch protection is configured or that a failed required result blocks a normal PR.

Prepare a before/after settings table with current evidence, exact selector/context/producer, proposed delta, permission needed, verification and recovery plan. If GitHub administration changes are outside existing authorization, present this concrete delta first; do not invent an extra gate when the unchanged action is already authorized.

## 4. Phase A: prepare the environment and WIF plan with A

Obtain A's verified runtime/resource/action plan. Recorded project/number/region or resource names are leads to verify, not resource existence, account access or mutation permission. Coordinate first-deploy ordering and identify unknowns rather than filling them with examples.

Use a variable/secret inventory:

| Setting | Kind | Source and verification |
|---|---|---|
| `GCP_PROJECT_ID` | Environment variable | Real project ID; distinguish numeric project number |
| `GCP_REGION` | Environment variable | Actual approved runtime/registry region |
| `WIF_PROVIDER` | Environment variable | Verified full provider resource identifier |
| `WIF_SERVICE_ACCOUNT` | Environment variable | Verified deployer service-account email |
| `SMOKE_EMAIL` | Optional variable | Dedicated low-privilege synthetic account; coordinate privately |
| `SMOKE_PASSWORD` | Optional secret | Approved private input; never read back or print |

Inspect and propose environment `demo` with main-only deployment policy. Verify whether a branch-only policy would also admit a tag named main; enforce the intended ref type and reject non-main dispatches. Preserve any existing real environment-review requirements; do not claim review exists if it does not.

Prepare an exact WIF/IAM change matrix covering:

1. Actual repository/owner numeric IDs and names; pool/provider/project identities and current bindings.
2. Attribute mapping/condition and intended OIDC issuer/audience. Check the **actual environment subject format**; a job using `environment: demo` does not automatically have the same subject as a ref-only job.
3. Repository, main ref, deployment environment, allowed event/workflow and any reusable-workflow claims needed by the current design. Explain how wrong repository/ref/workflow/environment claims are rejected.
4. Intended GitHub principal -> deployer impersonation relationship. Separate runtime from deployer; scope registry/service/job update and runtime impersonation to required resources. Verify actual permissions instead of granting Owner/Editor or generating JSON keys.
5. A's DB/Secret Manager consumers and bindings. Avoid duplicating or broadening runtime permissions from the release pipeline.
6. Exact apply/read-back commands, owner authorization, cost/DB/secret impacts and failure/recovery limits. Publish identifiers and policy structure only, never tokens or secret payloads.

Use current official documentation when selecting exact claims/permissions; this prompt is not an IAM policy to apply unchanged. Keep private inputs in the approved secret channel. If account access is missing, prepare the plan and identify the account holder's precise action; do not request passwords or credentials in chat.

## 5. Verify the accepted release contract before configuration

Trace current source end to end and note actual gaps:

`accepted main commit -> CI -> SHA-tagged web/jobs build -> immutable digest -> explicit migration -> service update -> actual revision/traffic -> health/readiness/HTML/auth smoke -> factual summary`.

Check the PR #85 corrections remain present:

- Wrong-ref guard and validated full source SHA; accepted main source rather than a staging or dirty checkout.
- Bootstrap validates both digests and updates an existing migration job to the intended jobs image/command.
- Migration uses one task, zero automatic retries and awaited success before rollout. Failure stops service update and requires inspection before retry.
- Normal release validates full 64-hex digests and actual ready revision/100% traffic; rollback uses an existing compatible web image and skips job/build/migration/seed changes as implemented.
- Expected runtime SHA comes from the actual commit built by the release run. Do not label an old rollback image as the new workflow source or confuse PR head with main merge SHA.
- Smoke uses implemented health/readiness/404 envelopes and cookie/custom-header/origin/CSRF flow, read-only scoped teams request and logout; missing optional credentials is SKIP, configured failure is failure.
- Release concurrency preserves active migrations. Inspect actual pending-run behavior before promising that every queued release is retained; do not invent stronger ordering guarantees than the workflow provides.

If code changes are necessary, prepare a focused diff on the correct open/new task PR with meaningful offline failure/rollback tests and applicable current CI. Do not rewrite accepted app behavior to hide a configuration problem.

## 6. Required preparation output and first stop

Prepare/reuse an English Markdown record such as `workflow/handoffs/R2-B01_B_LIVE_GATE_PLAN.md`; coordinate the shared #16 release record with A. These are future output suggestions, not files to create during a prompt-authoring request.

Use the following row structure for each proposed change:

| Action ID | Issue scope | Current verified state/time | Exact resource/selector | Proposed delta/command | Permission/impact | Authorization reference | Read-back evidence | Status |
|---|---|---|---|---|---|---|---|---|
| B08-01 | #15 or #16 | UNKNOWN until inspected | Verified value required | Concrete delta required | Explain | PENDING or actual decision | Safe command/result | PLANNED |

The preparation handoff must contain actual CI context/run/head evidence, proposed ruleset delta, environment inventory, WIF/identity policy, A/B interface dependencies, initial bootstrap ordering, existing approvals and exact remaining decisions. Label unavailable checks NOT RUN with a reason.

**Stop before unapproved changes.** Complete independent authorized preparation first. Billing/IAM/DB mutation authorization and current-candidate main authorization are separate; approval for one does not grant the other. Resume only the selected bounded phase and retain valid unchanged approvals without asking again.

## 7. Phase B: apply specifically authorized settings

Reread current state and map the actual user decision to the prepared action IDs. Apply the authorized subset sequentially; inspect the result after each change. Record sanitized policy/configuration read-back, actor, timestamp and actual errors.

For rules, verify active enforcement, intended main/staging selectors, empty intended bypass list, required peer review/context/up-to-date settings and retained deletion/force-push/thread/stale-review restrictions. For environment/WIF, verify exact identities/ref/environment policy, actual variable names and scoped trust. Do not read back secret values.

If an operation fails, preserve protection and credentials. Investigate the real error; do not delete rules, grant broad roles, mint a key or blindly rerun partially applied actions. Finish unaffected work and return the exact missing capability/decision. Successful API calls alone are not C-02 or live deployment acceptance.

## 8. Phase C: prepare the initial delivery main candidate

When A/07 cannot deploy because delivery code is only on staging, discover/reuse the actual initial-delivery release branch/PR under #16. Review the **entire** current main-to-candidate diff, including docs/config/scripts, source ancestry and unrelated features. Keep unfinished F-05-F-07 work out. If staging is mixed, prepare a scoped release branch through the agreed workflow rather than silently releasing everything.

Open the initial main candidate as Draft, keep auto-merge off and follow `workflow/MAIN_RELEASE_GATE.md`. Do not repurpose an unrelated planning PR, reuse PR #85's staging approval as release permission, or request final peer/merge action before the user gate.

Present this concrete review package:

| Item | Required content |
|---|---|
| Candidate | PR URL, source branch, full current head SHA and full main base SHA |
| Resulting behavior | Exact S1/runtime/CI/deploy increment and any excluded pending features |
| Scope | Full diff and actual findings, including inherited/new documentation changes |
| Verification | Current relevant checks/runs/artifacts with source/event; distinguish old evidence |
| Review route | Practical local/preview inspection route and known limits before a public URL exists |
| Cloud prerequisites | A's verified resource plan, authorized action subset, WIF/environment readiness and first-release ordering |
| Decision | User review/main-release authorization PENDING, or actual decision/time/reference bound to this head/base |

Do not require a nonexistent public URL as proof before the first deployment; provide the available local review route and identify what will be verified afterward. Conversely, a local preview does not certify public cloud behavior.

A main merge may automatically trigger deployment. Coordinate resources, credentials, environment restrictions and explicit action authorization **before** requesting that release decision. Identify any separately authorized resource-only bootstrap or documented manual first-deploy step; do not silently create a release that will mutate unapproved cloud resources.

**Stop with the Draft review package until the user actually reviews and authorizes this current candidate.** Notification, silence, a green run, B's approval or permission to continue staging are insufficient. If head/base changes, show the delta and renew the candidate decision.

## 9. Phase D: authorized initial merge and deployment coordination

After valid exact-candidate authorization, record it in the release PR/task Issue and obtain the real non-author peer/protection checks. Do not self-approve or claim an AI review is separate manual human testing. Leave merge to the authorized maintainer unless explicit applicable user permission and repository policy permit the action; never bypass protection.

Verify actual MERGED state, actor, main merge SHA and resulting source tree. Observe only the authorized pipeline/bootstrap. Confirm source SHA/image tags/digests, successful migration, serving revision/traffic, public URL and smoke outcome. A/07 verifies runtime externally. If failure occurs, report the failed step and actual partial state; do not call a green CI run a successful deployment or silently retry migrations.

This is the **initial** deployment. It is separate from the later visible-change release needed after A/09 records persistent business data. Keep overall #16 acceptance pending and sync main ancestry back to staging through the reviewed workflow where needed.

## 10. Phase E: controlled C-02 failed-check proof

Run this phase only after a stable working main release, a real passing required CI context and explicit authorization for this exact experiment. Do not begin it automatically while preparing settings or a release candidate.

1. Agree scope with A. Inspect current main and the test actually executed by the required check. Prepare a fresh temporary branch from current main containing only one deliberately failing assertion; no deploy/config/DB/domain changes.
2. Open an early Draft proof PR **into main** with honest task/Issue/evidence linkage and normal lifecycle metadata. Inspect the complete diff and record exact head/base plus test/check identity.
3. Present the never-merge proof package and obtain the specific authorization required to lift Draft for this exact candidate. A normal release approval does not authorize this separate exception.
4. After that decision, use a normal non-Draft PR and observe the named required test actually fail. Capture run/job/test output and effective rules plus the merge-blocked state. Explain that required-check failure is itself blocking; Draft or a missing review alone does not prove this. Use read-only status/UI evidence, not an attempted merge.
5. A independently checks/witnesses the actual evidence. Do not fabricate an approval, turn off a rule, enable auto-merge or merge the broken code to demonstrate anything.
6. Close the proof without merging. Verify CLOSED/unmerged and preserve its branch, commits, PR, run and sanitized evidence. Do not label a closed-unmerged broken implementation as an accepted Done release; record the experiment's actual disposition.
7. Reconcile #15 only after all its actual live criteria and peer acceptance are satisfied. #16 and broader #13 remain separate; do not close them as a side effect.

If the failed check is not actually required or a policy is bypassable, record the finding and correct the authorized configuration before repeating a meaningful proof. Never claim C-02 from a simulated status or screenshot of a Draft-only restriction.

## 11. Phase F: prepare, but do not release, the later visible change

Only when separately selected, agree a small visible change within accepted S1 with A and follow its real Issue/owner/UI-contract/task-PR review workflow into staging. Do not introduce an unapproved business rule or unfinished S2 feature as a shortcut.

Prepare/reuse its later main Draft candidate with exact head/base and current checks. **Do not release it in B/08.** [A/09](../A/09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md) must first record original milestone/submission/feedback IDs and the distinct restart evidence. [B/10](10_R2-J01_RELEASE_AND_TRACEABILITY.md) then reassesses that evidence, the exact candidate and separate user/peer/protection authorization before the visible-change release/C-06 work.

## 12. Final output and resume point

Return a concise conversation update and durable English Markdown handoff with:

- Selected phase, actor/owner, Issue scope and real branch/PR/head/base.
- Observed current settings/resources and the exact proposed/applied action IDs.
- Actual checks, events, runs, tested SHAs, failures and NOT RUN items with reasons.
- Configuration authorization, main-candidate authorization and C-02 authorization as separate records.
- WIF/environment/ruleset read-back without secrets; release source/image/revision/traffic/URL only if actually established.
- #15 and #16 Status / Verification / Acceptance separately, remaining criteria and exact human/peer/tool prerequisite.
- What the next invocation should resume, including approved unchanged actions and work that must not be repeated.

Stop after the selected phase. Do not run A/09, B/10, persistence tests or report assembly automatically. Prompt preparation, passing CI, first deployment, C-02 and final Lab 5 acceptance are distinct outcomes.
