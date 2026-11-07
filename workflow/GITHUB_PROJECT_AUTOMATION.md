# GitHub Project merge automation

## Project and rule

Use [fastTrack — Team Delivery](https://github.com/users/zerotwobook/projects/3), owned by `zerotwobook`, Project number `3`.

The native **Pull request merged** workflow is enabled and targets **Status = Done**. It runs when a pull request already in this Project is merged, including task PRs into sprint staging and release PRs into main. GitHub handles the event; no repository Actions workflow or stored personal token is needed for this native rule.

| Event | Board behavior |
|---|---|
| A tracked PR is actually merged | Native workflow sets that PR card to Done. |
| A PR is closed without merging | This rule does not mark it Done; review/cancel its card explicitly. |
| A PR is ready for peer review | Add its card and set PR Review as part of the author handoff. |
| A review requests changes | Move to Fixing, then back to PR Review when ready. |
| An Issue/task is accepted or rejected | Follow its task criteria and human gate; PR automation does not decide acceptance. |

Only Status is automated here. Verification and Acceptance retain their actual evidence-based values. Merging one PR does not automatically complete every related task, approve G0, pass tests, remove blocked labels, close Issues or certify a release.

## Required stage progression from 6 November 2026

The task **Issue is the full work lifecycle**. Move it as the work happens:

```text
Backlog -> Specified -> Started -> PR Review -> Done
                                  |     ^
                                  v     |
                                  Fixing
```

Fixing is used only for actual review corrections or failed checks on work already handed off. A successful first review does not need a fabricated Fixing stage.

| Transition | Required evidence and timing |
|---|---|
| New -> Backlog | Register/reuse the real Task ID, owner, reviewer and sprint. New work is not automatically specified or started. |
| Backlog -> Specified | Read the task and source contracts; record clear scope, acceptance/checks, dependencies and shared-file owners. Update/read back the card now, before implementation. |
| Specified -> Started | Verify predecessor/gate acceptance, safe staging sync and the owner's task branch/clone. Update/read back the card **before editing task files**. Keep a blocked task in its real current stage with the blocked label/reason. |
| Started -> PR Review | Implementation and relevant checks are complete, actual results/limits are recorded, the linked PR is ready and the real peer review is requested. Update/read back both Issue and PR cards at handoff. |
| PR Review -> Fixing | Actual review requests changes, or a handed-off check fails. Record the finding and fix the same branch/PR. |
| Fixing -> PR Review | Resolve the findings, rerun affected checks, update evidence and request re-review. |
| PR Review -> Done | Confirm actual peer acceptance at the current head, task criteria and the intended integration merge. The native rule handles the PR card; reconcile Issue closure/Done/Acceptance separately. |

**Do not skip Specified or Started on a new task. Do not move Backlog directly to PR Review. Do not queue all stage updates until the final handoff.** API calls cycling through earlier states after implementation do not establish a truthful work history. There is no arbitrary waiting period: each state must represent an actual milestone and be saved/read back when it occurs.

Before a transition, read the current live card. If it does not match the expected stage, inspect why and preserve other members' work instead of overwriting it. Existing active tasks continue from their verified current stage. Leave previous completed cards/history unchanged; this prospective correction does not replay them.

## Draft PR timing and the two cards

A PR exists only after a branch has a real change to compare. The Issue therefore carries Backlog and Specified before the PR exists.

1. Start the Issue as above, edit on its branch, then push the first coherent, reviewable commit.
2. **Open the PR as a draft during Started**, before completing the remaining work/verification. Add it to Project 3 immediately, initialize Sprint/Owner/Task ID/Verification/Acceptance and read back **Status = Started**. Do not request final peer approval yet. Do not make empty commits just to create an earlier PR.
3. Keep the Issue and draft PR in Started while implementing/checking. Failed pre-handoff checks stay Started with Verification FAILED until corrected; they do not create a review finding that never happened.
4. After the actual handoff criteria pass, update the PR evidence, mark it ready, move both cards to PR Review and request the other member's review. A new ready PR must not first appear only at final handoff.
5. For actual corrections, keep both existing cards/branch/PR in sync through Fixing -> PR Review. After merge, let native automation move the PR card to Done; verify before updating the accepted Issue.

This applies to documentation/process work as well as application code. A PR card starts at Started because it did not exist during task specification; do not manufacture Backlog/Specified events for an already-created PR. Its linked Issue provides those real earlier stages.

For an already-existing PR, preserve its verified current state rather than recreating it to manufacture this new history. Closed/unmerged work is not completed implementation; record cancellation without using a false Done claim.

## Transition evidence

For each new transition, maintain a concise English progress log in the task Issue body (or link an existing durable record). Preserve other authors' text and previous rows. Use a structured body update or body file; this policy does not authorize posting comments/messages as the user.

```text
Time (UTC or Asia/Bangkok) | From -> To | Actual reason/evidence | Branch / PR / commit if available
```

Record the real current time, the live prior state and the actual reason. Before code, reference reviewed scope/dependencies; when starting, reference the branch/base; for handoff, reference the PR/commit/checks; for Done, reference actual reviewer/head/merge. A missing past row is not permission to invent a timestamp or replay card movements.

Verification (NOT RUN/FAILED/PASSED), Acceptance (PENDING/ACCEPTED) and human gates remain independent of Status. A draft is not acceptance, a passing build is not G1, and a merged PR does not approve all linked tasks.

## Commands and automation boundary

Use the actual current IDs; discover them with `gh project item-list 3 --owner zerotwobook --format json` and `gh project field-list 3 --owner zerotwobook --format json`. Reuse existing cards.

```bash
# After the first coherent commit is pushed; replace the placeholders.
gh pr create --draft --base staging/sprint-1 --head <TASK_BRANCH> --title <TITLE> --body-file <BODY_FILE>
gh project item-add 3 --owner zerotwobook --url <PR_URL>
# Set Started immediately, using IDs read from the live Project.
gh project item-edit --project-id <PROJECT_NODE_ID> --id <ITEM_NODE_ID> --field-id <STATUS_FIELD_ID> --single-select-option-id <STARTED_OPTION_ID>
```

At handoff, after checks/evidence are complete, use `gh pr ready <PR_NUMBER> --repo zerotwobook/fastTrack`, update the actual Issue/PR cards to PR Review and request the reviewer. Commands do not imply that a check, gate or merge passed; verify the resulting state.

The stage sequence is a required team/agent procedure with a recorded checklist/log. GitHub's current native rule only automates merged PR -> Done; it does **not** reject arbitrary manual/API intermediate transitions. No new Actions workflow, PAT, token scope or hard transition validator is installed by this policy. Do not claim technical enforcement that has not been implemented.

## Enable or repair the native rule

1. Open the Project and select Workflows.
2. Select Pull request merged, then Edit.
3. Choose Status and the existing Done option as the action.
4. Save and turn on the workflow.
5. Recheck after changing/deleting Status options; a rule must point to an existing option.

Keep Item closed and Auto-close issue disabled unless the team separately defines and approves their semantics. A closed, unmerged PR or a rejected Issue must not silently count as completed implementation. The existing sub-issue auto-add rule is separate from this merge rule.

Built-in workflows are documented in [GitHub's automation guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-built-in-automations).

## Verification and recovery

Check that Pull request merged is enabled in Project Workflows, the card belongs to Project 3, the PR is actually MERGED, and the Status action targets Done. Native processing may not be immediate; refresh/read back the card before assuming failure.

If a merged card is still stale, inspect the configuration first. Only after verifying the actual merge may an authorized maintainer repair the status:

```bash
gh pr view <PR_NUMBER> --repo zerotwobook/fastTrack --json state,mergedAt,mergeCommit,baseRefName
gh project item-edit --project-id <PROJECT_NODE_ID> --id <ITEM_NODE_ID> --field-id <STATUS_FIELD_ID> --single-select-option-id <DONE_OPTION_ID>
```

A manual repair is a recovery action, not proof that the automation fired. Do not change Verification/Acceptance or move unrelated cards as part of a repair.

## Setup record — 6 November 2026

- PR #40 was confirmed MERGED into main by Atip-Infa and its stale card was repaired from PR Review to Done.
- The owner enabled Pull request merged -> Status: Done in the Project UI.
- A GraphQL read-back confirmed that the merge workflow is enabled and PR #40 is Done. The other 38 task cards retain their prior states.
- The repair happened before enabling the rule. A subsequent tracked PR merge is the end-to-end check for the newly enabled native event rule; no synthetic approval or merge was performed for a test.
