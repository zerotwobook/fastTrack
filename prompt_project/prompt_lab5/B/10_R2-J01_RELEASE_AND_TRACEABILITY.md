# B / 10: release the reviewed visible change and establish C-06 traceability

## Invocation, responsibility and hold

I am B (`Atip-Infa`), release captain for **R2-J01 / Issue #16**. A (`zerotwobook`) is the non-author peer for B-authored release work and performs the subsequent persistence read-back. This prompt governs the **later visible-change release**, not the initial delivery bootstrap in B/08.

**An authoring-only request does not execute this prompt.** When only expanding Markdown, do not create/change a release candidate, modify #16, request a main approval, deploy or mutate cloud/DB/IAM. Preserve the existing hold.

When explicitly invoked, select preparation, resume, or execution of a separately authorized exact candidate/action subset. Complete all independent authorized preparation first. Keep the main candidate Draft until the user reviews and explicitly authorizes its current head/base under [the main-release gate](../../../workflow/MAIN_RELEASE_GATE.md).

Project artifacts and handoffs must be English Markdown. Do not export PDFs, submit coursework, send external messages or start A/11 automatically.

## 1. Required reads and evidence gate

Read [all shared rules](../00_SHARED_EXECUTION_RULES.md), project/Git instructions, Lab 5 plan sections 8-11, actual #15/#16 scope/state, current main gate, [B/08](08_R2-B01_J01_WIF_GATE_AND_RELEASE_PREP.md) release/settings handoff and [A/09](../A/09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md) original-record/restart evidence.

Inspect current root workflows/scripts/tests, runtime/job/env contracts, actual main/staging/candidate refs and changes, reviews/checks, WIF/environment settings, cloud resources and existing action-specific authorizations. Preserve accepted root `deploy/` paths and `Project_code/` build context.

Use this entry matrix before any later deployment:

| Prerequisite | Evidence required | If missing |
|---|---|---|
| Initial working release | Actual accepted main source, public HTTPS URL, real readiness and runtime identity | Coordinate A/07/B/08; do not call the later release a first bootstrap |
| Container/CI integration | Actual relevant source/run/build/DB/image results and accepted scope | Finish independent candidate review; keep release blocked |
| Merge gate | Observed required check/up-to-date/review rules and valid C-02 proof | Record the actual live-gate blocker; do not substitute Draft-only proof |
| Deployment prerequisites | Verified WIF/environment/resources/secret references and applicable cloud authorization | Prepare concrete missing actions; do not broaden permissions |
| A/09 baseline | Durable original milestone/submission/feedback IDs and pre-release values/source/time | Hold release; do not backfill a before-state after deploy |
| Distinct restart | Real method/provenance and original-record read-back, with actual witness status | Keep C-05 prerequisite incomplete and return the precise dependency |
| Visible change | Agreed accepted-S1 behavior, task/AC, actual staging integration and current evidence | Prepare through its proper owner/PR workflow |

A Draft PR, local build, intended restart or historical green run is not an executed prerequisite. Keep missing items PENDING/NOT RUN with the owner and exact next action.

## 2. Establish safe workspace and release ownership

Use B's separate clone/worktree, inspect clean/staged/untracked state and preserve unrelated work. Resume the actual open visible-change/release branch/PR. A merged old PR cannot receive a new release under its old approval; create a scoped new candidate when required.

Keep the joint #16 lifecycle and historical acceptance intact. Follow real early-Draft/card timing for newly created work; do not manufacture Backlog/Specified stages for each phase or move past completed cards. Record actual transitions/read-backs in the appropriate Issue body.

Agree which owner edits the visible change and who reviews it. If UI copy is involved, read the UI skill/project brief and preserve the monochrome shared design and English copy. Do not add unfinished F-05-F-07 work or alter a business rule merely to obtain a visible difference.

## 3. Define and integrate the visible change

If no accepted change exists, specify a small concrete S1-compatible change with an actual Issue, owner, expected before/after behavior and acceptance case. Prefer a change whose public result can be verified without touching the original persistence records. Coordinate file ownership before implementation.

Use task branch -> early Draft staging PR -> affected verification -> real current-head peer acceptance -> authorized staging merge. Record the real commits/review/merge and source identity. Do not implement on main or treat an AI review as a separate human acceptance.

If the change is already integrated, inspect its exact diff/history and reuse valid evidence. Do not repeat edits/tests/releases just to generate fresh-looking output. New differences, missing proof or failures justify affected revalidation.

## 4. Assemble the exact main candidate

1. Fetch actual refs and inspect the full candidate-to-main commits/files/source tree, not just the visible-change commit. Identify unrelated docs/config/scripts, generated artifacts and unfinished features.
2. Check ancestry and current up-to-date policy. If main must be synchronized back into staging, use a reviewed sync branch/PR preserving main ancestry; no protected direct push, force push or history-erasing squash/rebase.
3. Reuse a matching Draft release PR from the agreed staging/release branch into main. If staging contains unrelated unfinished work, agree a scoped release branch and inspect the full resulting diff instead of silently shipping everything.
4. Verify current relevant type/unit/build/real-DB/migration/image/CI evidence, runtime/source propagation and rollback compatibility. Bind each result to its tested source; explain applicability of earlier unchanged-code evidence.
5. Read the release workflow's actual triggers, environment/permissions, concurrency and manual-input behavior. Main merge can automatically mutate cloud resources; ensure the intended pipeline/actions are within recorded authorization before requesting the release decision.
6. Confirm A/09's original ledger and actual serving environment still match the pre-release target. Coordinate against concurrent writes/releases; do not overwrite its baseline.

## 5. Prepare the user review package

Present a concrete inspectable candidate using this schema:

| Field | Required value |
|---|---|
| Release/task | Actual Issue and task/staging/release PR URLs; labels and owner |
| Exact candidate | Full current head and full main base SHA; source branch and full diff |
| Visible behavior | Before/after and how to inspect it at a local/preview route before release |
| Current evidence | Relevant runs/checks/artifacts, tested sources, actual outcomes and limitations |
| Persistence prerequisite | A/09 ledger/commit, original IDs, actual restart/witness result and target environment |
| Cloud scope | Approved service/job/image/resources and actual action authorization references |
| Compatibility/recovery | Migration impact, old-image/new-schema compatibility and proposed bounded recovery |
| User decision | PENDING or actual decision/reference/time bound to this exact head/base |
| Peer/protection | Actual requested/reviewed state, required checks and unresolved threads |

Keep Draft and auto-merge off while the user's current-candidate decision is pending. Notification, a green build, earlier bootstrap approval, generic continuation or silence is not permission to release. If the unchanged candidate already has valid authorization, read back that record rather than asking again.

If head or base changes, show the delta, reassess affected checks and obtain renewed candidate authorization before lifting Draft. The release PR head is not necessarily the source SHA later built from the main merge.

## 6. Authorized peer/protected merge

Only after valid current-candidate user authorization, record the actual decision/head/base and make the ready/peer handoff permitted by the repository. Obtain the required real non-author review and checks, with resolved findings. User release authorization does not itself provide peer approval or self-merge permission.

Leave integration to the authorized maintainer unless an explicit applicable instruction and policy permit the action. Preserve all protection; do not use an admin bypass or alter rules to recover time. Immediately before integration, read current head/base/checks/reviews again and reject a moved candidate.

Afterward verify actual MERGED state, actor/time, target main branch, main merge SHA and source tree. A marked-ready/approved PR or queued auto-merge is not an actual merge. Read back native Project PR Done separately from overall #16 acceptance.

## 7. Observe the real main pipeline once

Find the workflow run for the actual main source merge. Inspect current running/completed runs before considering a manual dispatch; do not trigger a duplicate deployment because a page is stale or a job has not started. If an automatic run is absent, identify the actual trigger/permission problem and coordinate an explicitly scoped recovery, recording its event/source honestly.

Observe and record each actual stage:

| Stage | Evidence and failure rule |
|---|---|
| Source/ref | Main ref, actual checked-out SHA and correct approved workflow; reject stale/wrong source |
| CI | Meaningful current-source tests/build/DB/image checks passed; no skipped dependency masquerading as success |
| Images | Web/jobs built from the same actual main SHA, full source tags and resolved immutable digests |
| Migration | Intended jobs image/command, one task, zero automatic retries, awaited actual success; failure blocks rollout |
| Rollout | Selected web digest and runtime RELEASE_SHA; no unapproved env/secret changes |
| Traffic | Actual serving revision and intended single 100% assignment, not merely latest-ready metadata |
| Smoke | Expected source version, DB readiness, HTML and exact safe API error; private auth result PASS/FAIL/SKIP as actually configured |
| Summary | Source/run/image/job/revision/traffic/URL/results agree with observations |

Keep command output sanitized. Do not dump environment, secret payloads, DB URLs, cookies or CSRF values. Capture migration execution identity/result without retaining sensitive logs.

## 8. Verify the public result independently of job color

Open the real HTTPS URL and establish observed time, canonical origin, health version/readiness, served image/revision/traffic and the visible change. Distinguish stale browser caches, an old revision or a different host from the intended new result. Do not disable security or alter expected identity to make the check pass.

Correlate the chain explicitly:

`task change -> staging integration -> user-reviewed release head/base -> actual main merge SHA -> build/run -> web/jobs digests -> migration -> serving revision/traffic -> health version + visible result`.

If optional private smoke has no configured credentials, retain SKIP; it is not public business-flow proof. A/09's earlier business test and A/11's later original-record read-back remain separate. Do not declare C-05 complete in this phase.

## 9. Failure and recovery decision table

| Actual failure | Immediate action | Recovery boundary |
|---|---|---|
| CI or image/digest failure | Stop release, retain actual failed step/source and inspect service still serving | Fix on proper task branch; current candidate authorization may need renewal |
| Migration failed/partially applied | Preserve actual execution/schema status; do not roll out or blindly rerun | Owner inspects partial state; explicit reviewed DB recovery only |
| Rollout/readiness/traffic mismatch | Read current revision/image/traffic safely; retain source identity | Prepare compatible bounded rollback/roll-forward with applicable authorization |
| Smoke/visible change wrong | Record real endpoint/result/cache/source context; do not label the release healthy | Inspect actual service; no automatic schema/data reversal or secret dump |
| Concurrent or duplicate deployment | Identify both sources/runs and current traffic before acting | Coordinate owners; do not cancel an active migration blindly |

Image rollback is only for a known compatible existing SHA/digest and skips migration/seed as implemented. It does not restore DB/schema/data. A future rollback plan is not authorization to execute it now. Do not tear down resources to repair evidence.

## 10. C-06 record, handoff and stop

Create/reuse one English Markdown release record with the actual labelled Issue/task PR/specific peer review/staging merge/user-authorized main PR/CI-deploy run/source/image/job/revision/traffic/URL chain. Each link gets a short explanation of what it proves and its scope. Preserve proof/history and original outputs; no fabricated actor/time/result.

Hand A the exact original ledger reference, new main SHA, run/job links, web/jobs digests, migration result, public URL, serving revision/traffic, actual visible/smoke result and recovery limitations. Record the actual release time so A can distinguish baseline/restart/redeploy observations.

Keep #16 active for [A/11](../A/11_R2-J01_POST_RELEASE_PERSISTENCE.md), report-source preparation and final acceptance. A native merged PR Done does not close these remaining criteria. Prepare reviewed main-to-staging sync only when ancestry requires it. Stop here; A/11's readback is a separate invocation and no persistence result, PDF export, upload or Lab 6/7 work is implied.
