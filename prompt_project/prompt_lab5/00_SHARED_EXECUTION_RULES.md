# Mandatory execution rules for every Lab 5 task prompt

Read this complete file whenever a task prompt refers to it. Apply the selected task prompt **and** these rules. If they conflict with a current user instruction or repository rule, identify the conflict and follow the higher-priority instruction. Do not execute every task in this pack.

## 1. Understand the outcome before acting

You are working on **fastTrack**, not TokTickIT. The assessed cloud increment is the accepted S1 Student/Supervisor application: milestones, first URL submissions, exact-submission feedback, scoped access and persistent sessions/data. Keep unaccepted F-05-F-07 work out of the initial release. Do not scaffold another application or replace the existing architecture/UI.

The selected prompt defines one owner and bounded phase. Work autonomously through its authorized preparation, code, meaningful tests, documentation, commits and PR handoff. Do not merely describe a plan and stop when implementation is authorized and dependencies are satisfied. Conversely, a request to prepare does not authorize a protected merge, human approval or unspecified cloud mutation.

Read before implementation:

- Root `AGENTS.md`, any applicable nested instructions, `skill/SKILL_Project.md`, complete `skill/SKILL_Github.md`, `CONTRIBUTING.md` and `DEVELOPMENT_README.md`.
- `workflow/README.md`, `workflow/02_SPRINT2_LABS5-7.md`, `workflow/04_LAB5_DELIVERY_PLAN.md`, `workflow/GITHUB_PROJECT_AUTOMATION.md` and `workflow/MAIN_RELEASE_GATE.md`.
- The actual Issue, all relevant comments, linked dependencies, current PR/review/checks and relevant accepted contracts. Existing tasks: R2-J00=#13, R2-A01=#14, R2-B01=#15, R2-J01=#16.
- Relevant `Project_doc/project_detail.md` sections: 5 requirements, 7 architecture/data/auth, 9 API, 11 tests and 13 deployment. Use current implemented contracts when older design prose is stale; surface material conflicts before changing behavior.
- `lab_file/lab5/LAB5_SUMMARY.md` and the relevant pages of `lab_file/lab5/01_SE_Lab_5_updated.pdf`; English handout requirements outrank starter/summary. Read only the necessary Student Guide/starter sections for your phase.
- `Project_code/README.md`, actual package scripts, lockfile, server config, schema, test guards and task-owned source. Do not assume commands from the starter work here.

Before UI changes also read complete `skill/SKILL_UI.md`, project-detail section 8 and existing components/tokens. Explain screen, states and source briefly; preserve monochrome design, bundled typography, roles, keyboard/mobile behavior and English copy. Do not redesign the app to make a cloud demo look different.

## 2. Language, paths and evidence

All new/revised code comments, UI, docs, tests, commits, Issues/PRs/reviews and Project metadata must be **English**. Conversation may be Thai. Translate only a legacy section you actually revise; preserve unrelated historical/instructor artifacts.

Application code/tests/schema/assets/runtime configuration belong in `Project_code/`. Workflows belong at root `.github/workflows/`. Deployment guidance belongs at root `docs/labs/lab-05/deployment.md`. Use existing result/contract conventions; root Lab 5 evidence/report Markdown links to real outputs rather than duplicating conflicting records.

Prepare narrative evidence, reports and handoffs as `.md`. Preserve actual JSON/JUnit/etc results and original instructor PDFs. **Do not generate, rebuild or export any PDF**, including through a verifier, unless explicitly requested. Never upload/submit coursework or send email/chat/review comments without explicit relevant instructions. A prompt's handoff request permits preparing the handoff, not impersonating its author or recipient.

Each real result needs test/file name, command or CI run, environment, actual result and tested commit. Preserve stdout/result files where appropriate and redact secrets. Label unknowns NOT RUN/PENDING with a reason; do not infer success from a file existing, mock test, green job, old evidence, plan or user silence.

## 3. Live-state discovery before edits

Find the actual repo root. Inspect owner/account, remote, branch/upstream, staged/unstaged/untracked files, existing task worktrees, branch divergence, Issue/PR and Project state. Use read-only commands such as these, adapting only after inspecting results:

```powershell
git status --short --branch
git remote -v
git branch -vv
git diff --stat
git diff --cached --stat
git log -6 --oneline
git fetch origin
gh repo view zerotwobook/fastTrack --json nameWithOwner,defaultBranchRef,visibility
gh issue view <ACTUAL_ISSUE> --repo zerotwobook/fastTrack
gh pr list --repo zerotwobook/fastTrack --state open
gh project view 3 --owner zerotwobook --format json
gh project field-list 3 --owner zerotwobook --format json
gh project item-list 3 --owner zerotwobook --limit 100 --format json
```

Placeholders in examples must be replaced with values discovered from current state. Never execute angle-bracket tokens literally, invent PR numbers, reuse stale Project IDs or print credentials while inspecting authentication. Prefer available connected tools when sufficient; otherwise use authenticated GitHub CLI. If access fails, report the exact missing capability and continue unaffected local preparation without pretending a remote change occurred.

Resume the existing branch/PR for an active task or review fix; do not create duplicates. A and B use separate clones/worktrees. Do not switch an owner's shared worktree under another session. Preserve unrelated changes: no hard reset, clean, arbitrary stash, force push, rebasing shared history, branch deletion or mass staging. New application tasks branch from agreed `staging/sprint-2`, not main. If it is absent, perform the documented baseline/bootstrap decision first. Only documentation planning uses the documented pre-staging bootstrap exception.

## 4. Scope, dependencies and shared ownership

Before editing, state: owner, task/Issue, exact branch/base, acceptance criteria, dependencies, owned paths, shared-file integrator and planned checks. Inspect actual predecessor acceptance, not just Issue closure. If #13 has an explicitly accepted Lab 5 delivery subset while broader S2 contracts remain pending, reference that exact recorded decision; do not declare the whole Issue/gate complete.

A leads Docker/runtime/config/auth/readiness/provisioning plans. B leads CI/release/smoke and remains migration/schema integrator. Coordinate ordered migrations, manifests/lockfile, app composition, operational JSON, script interfaces and deployment guide sections. Do not silently take over the teammate's module. Present the proposed shared-interface diff and impact before dependent implementation; independent fixtures/specification work may continue while a necessary decision waits.

## 5. Project lifecycle: save/read back milestones when they happen

Use Project 3, actual Task ID, Sprint 2, correct Owner, real assignee/reviewer, `lab5` and applicable labels/milestone. Reuse existing cards. Status, Verification and Acceptance mean different things.

1. **Backlog:** real task registered/reused; Verification NOT RUN and Acceptance PENDING for new unverified work.
2. **Specified:** after scope/contracts/AC/dependencies/file ownership/checks are understood, update/read back now, before implementation. Append the actual timestamp/reason in the Issue body.
3. **Started:** once required dependencies/gates and safe branch are ready, update/read back **before task-file edits**. Blocked work stays at its actual stage with the exact reason. Do not create fictional past transitions.
4. **Early Draft:** after the first coherent real commit is pushed, open a Draft PR **during Started**. Add its Project card immediately as Started with Task ID/Sprint/Owner/Verification/Acceptance. Continue remaining work/checks on that PR; no empty commit for timing.
5. **PR Review:** after real staging-handoff criteria pass, mark ready, update/read back both cards and request the actual non-author peer. A main-targeted PR stays Draft until section 7's user gate is satisfied.
6. **Fixing:** use only for actual review findings or a failing handed-off check; fix the same branch/PR and return to PR Review after affected checks. Pre-handoff development failures stay Started with Verification FAILED.
7. **Done:** only after actual current-head peer acceptance, criteria and intended integration merge. Read back native merged-PR -> Done, then separately reconcile Issue closure/Acceptance and remaining gate scope. A closed-unmerged proof PR is not an accepted implementation merge.

Record real current timestamp, observed prior state, reason/evidence and branch/PR/commit in the Issue body, preserving others' text. Do not post comments as the user. Do not batch early states at final handoff, replay previous completed cards or reset an ongoing joint Issue for each prompt phase. If native automation moved a card unexpectedly, inspect and record the real observation before reconciling it; do not fabricate a manual transition.

## 6. Implement, verify and prepare the staging PR

Use existing project scripts/version pins and accepted contracts. Write a small design/AC before changing behavior. Add meaningful tests for new runtime/security/release behavior; do not write tests that merely mirror a trivial documentation edit. Preserve genuine RED/GREEN history when using TDD, but never merge an intentional failing change into staging/main.

Relevant existing commands from `Project_code/` include `npm ci`, `npm run typecheck`, `npm test`, `npm run build` and `npm run test:j03:isolated`. Inspect their real current implementation and environment before use. The isolated chain uses Docker/disposable PostgreSQL and test guards; do not point cleanup-capable fixtures at cloud/shared data. Do not copy historical expected case counts into a fresh result.

Review scoped source/diff/secrets, run relevant checks and record actual results. Use `git diff --check`, stage explicit owned paths, inspect staged diff, commit in English, push to the intended remote and verify remote SHA. Never `git add .` to capture unrelated work. Use a structured body or `--body-file` for multiline Issues/PRs; shell-quote safely and preserve real newlines. Do not expose secrets through command substitution, command text or logs.

At handoff provide current Task/Issue/PR, head/base, changed behavior/files, safe reproduction, actual checks, findings/limits and specific review focus. A model's independent analysis is **assisted review**, not the human teammate's approval. Do not self-approve, approve as another user or merge without explicit authorization and protection. Review fixes return to the existing task owner/branch; a separately authorized correction task may be used only with explicit scope/ownership.

## 7. Main release gate and the C-02 exception

For **every main-targeted PR**, including docs/fixes, keep Draft with auto-merge disabled until the user has reviewed and explicitly authorized the concrete current head/base. Prepare candidate/diff/checks/risks and a practical review route first. Generic continuation, prior approval of another candidate, B approval, AI checks or silence does not grant main release permission. If head/base changes, reassess and obtain renewed authorization. Do not ask again for an unchanged valid authorization.

After authorization, real non-author peer review, required checks and an authorized maintainer merge still apply. Verify actual merge before claiming it, then verify main pipeline and serving identity separately. Sync new main ancestry back to staging through a reviewed sync PR preserving history when needed.

**C-02 is a narrowly controlled evidence exception:** fresh current-main temporary branch, one real failing test, normal **non-Draft** PR into main, actual required-check failure and blocked merge, then close without merging. First prepare as Draft; obtain explicit authorization for that exact controlled proof/head/base before lifting Draft. This authorizes observation, never a release/merge or self-approval. An absent review or Draft restriction alone does not prove a failed check blocks merging. Preserve proof history and record closed-unmerged disposition; do not weaken protection or mark broken implementation accepted.

## 8. Cloud and secret boundaries

Read proposed gcloud/Console changes before execution. Inspect existing resources and prepare concrete commands/diff/resource identities/permission scope/cost impact first. Billing, IAM and DB changes require explicit applicable user authorization; do not assume a broad task prompt is authorization for unspecified changes. Honor valid already-recorded authorization for the exact unchanged action. Read-only inspection and independent local preparation may continue while a required decision waits.

Use the handout's GCP access method; never pay a prepayment/click Upgrade. Report account/billing errors to account holder/TA with sanitized evidence. Verify current pricing/credits/quotas before creating paid resources; old guide estimates are not current quotes. Budget alerts are not a spending cap. Do not pause/tear down services during grading/UAT/active release obligations.

Never ask users to paste passwords, connection strings, cookies, CSRF tokens, API keys or service-account key files into chat. Keep private values in approved local secret input, GitHub secrets or Secret Manager. Runtime/deployer identities are distinct and scoped; use agreed WIF, not JSON-key shortcuts. Do not print secret reads, full env dumps or private request payloads. Redact screenshots/logs before saving. If a secret leaks, stop exposure, arrange authorized rotation at its source, redeploy relevant references and inform TA; deleting a file is insufficient.

Never run production reset/schema-push/development migrations or destructive seed. Run explicit migration before rollout, validate seed preservation, and stop rollout on migration failure. Inspect partially applied changes before retry; no blind repair or automatic DB reversal. Rollback uses an existing compatible image and does not reverse schema/data. Runtime health, DB readiness, public business flow and persistence are separate checks.

## 9. Pause, resume and final response

Do not stop for routine reversible choices you can resolve from the repo. At a real gate, complete all independent authorized work first, prepare the concrete reviewable action and state the exact missing dependency/decision, its source and next human action. Do not treat elapsed time as approval. If permissions/tools prevent an action, report actual failure and safe alternatives, not a fabricated result.

On resume, re-read live task/branch/head/base/checks/authorizations and the latest durable checkpoint. Continue only unfinished items, use the same task branch/PR where appropriate, and do not repeat provisioning, seed, deployment or workflow runs unnecessarily. Revalidate evidence identity when the candidate changes. Do not advance to another numbered prompt automatically.

End with: owner/phase/Issue; branch/PR/head/base; files and behavior changed or inspected; actual tests/results and evidence; Status/Verification/Acceptance separately; authorization/peer/merge/deploy state; unresolved items; exact next prompt/human action. Keep project artifacts English. Never claim an execution task complete merely because its prompt was written or a Draft exists.
