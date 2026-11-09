# B / 10: user-reviewed visible-change release and C-06

I am B (`Atip-Infa`), release captain for **R2-J01 / Issue #16**. Prepare and, only when the exact user/peer/protection/action gates allow it, verify the later visible-change release. A (`zerotwobook`) is the non-author peer for B-authored release work. Do not self-approve/merge or skip the pre-release record baseline.

## Required reads and hard entry conditions

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely, current `workflow/MAIN_RELEASE_GATE.md`, Lab 5 plan sections 8-11, live #16 and #15 accepted scope, actual release workflow/scripts and A/09's durable public-flow/original-ID/restart evidence. Inspect current main/staging/candidate PR/head/base/reviews/checks, WIF/environment, cloud resources and existing authorizations.

Before any later release: initial main delivery/first URL is actually established, accepted container/CI exists, live required-check proof is real or explicitly pending as a blocker, applicable WIF/cloud permissions are ready, and A/09 has created the exact original records and restart evidence. If these are missing, keep the candidate Draft, complete independent reviewable preparation and name the exact blocking action. Never recreate a before-release timestamp after deploy.

## 1. Build the concrete candidate

1. Find/reuse the existing visible-change Issue/task PR and main release Draft. If a justified change has not been implemented, define a small accepted-S1 visible change with owner/AC, follow its own branch/early-Draft/staging peer process, and coordinate UI design/English copy. No unapproved business-rule/S2 feature expansion.
2. Inspect full staging-to-main commits/files and ancestry. Synchronize main through a reviewed history-preserving sync PR if required. Ensure no unfinished S2 changes, unrelated planning PR or stale generated artifact contaminates the release.
3. Verify actual current build/type/unit/real-DB/image/CI results, migration/job commands, schema compatibility, secret references, main-only environment, queue behavior, safe smoke and rollback limits. Reuse exact applicable evidence with attribution; run affected checks after new changes.
4. Prepare/reuse Draft release PR `staging/sprint-2` -> main. Add real Project card/metadata during Started when newly created. Record exact head/base, resulting behavior, diff, case/results, pending limits and a practical way for the user to review it. Keep auto-merge disabled.
5. Verify A/09's baseline/IDs/restart evidence corresponds to the actual pre-release service and persistent DB. Coordinate A to avoid racing changes during the comparison.

## 2. User authorization, then real peer/protected integration

Present the concrete exact candidate **before** requesting main approval/merge. Keep Draft until the user actually reviews and explicitly authorizes this current head/base; notification, generic continuation, A's approval, CI green or earlier bootstrap authorization is insufficient. Do not ask again for unchanged valid authorization already recorded. If the candidate head/base changes, show the delta/reassess checks and obtain renewed authorization.

Once authorization is valid, record the actual decision/reference/time/head/base. Only then lift Draft and make the real peer-review handoff under the repository protocol. Obtain required non-author human review and pass protection. The AI's analysis is not A's human approval, and user main authorization does not by itself authorize self-merge. Leave integration to the authorized maintainer unless an explicit applicable instruction and policy permit the action. Verify actual MERGED/actor/merge commit/base before claiming release.

## 3. Observe the actual main release pipeline

1. Identify the workflow run triggered by the actual main source merge. Do not trigger a duplicate run just because it has not yet been inspected. Confirm the run checks out the intended main SHA and uses accepted permissions/environment.
2. Observe CI -> image build/push -> tag/digest resolution -> migration execution -> service rollout -> smoke/summary. Record real outcomes and links. If fail, inspect the exact failed step and current schema/traffic; do not blindly retry partial migration or auto-rollback incompatible code.
3. Verify source SHA -> image tag/digest -> serving Cloud Run revision/traffic -> `/api/health` version, with actual service URL and time. The deployed main merge SHA may differ from the release PR head. A green Actions job is not enough.
4. Open the live public URL and verify the visible change plus healthy DB readiness/HTML. Distinguish bootstrap result, smoke, business flow and persistence; do not declare C-05 complete here.
5. If configured optional private smoke ran, verify low-privilege cookie/source/CSRF/read/logout outcome without retaining credentials. Missing optional account stays SKIP, not successful login evidence.
6. If rollout/smoke fails, record actual serving traffic and recovery needs; present a compatible authorized rollback/roll-forward plan. No secret dump, broad IAM workaround or automatic DB reversal.

## 4. C-06 record and next handoff

Write/link one real labelled chain: Issue -> feature/task PR -> specific current-head teammate review -> staging integration -> user-authorized main release PR -> CI/deploy run -> actual main SHA/image/digest/revision/traffic/version. Include tested source, timestamps, responsible humans and unresolved limits. Preserve CI/contract/history; no deletion/rewrite to clean evidence.

Update Project states only to actual milestones, with current-head peer acceptance and intended merge verified separately. A release PR may be Done from native merge automation while #16 remains active for post-deploy data checks/report/submission. Reconcile Issue closure/Acceptance separately, not automatically.

Prepare the reviewed main-to-staging sync when ancestry requires it; no direct protected push or squash/rebase that removes main ancestry. Hand A the exact URL/main/image/digest/serving revision and A/09 original evidence reference. Next: A/11_R2-J01_POST_RELEASE_PERSISTENCE.md. Stop with truthful pending/failure status if user, peer, merge or pipeline action is not complete.
