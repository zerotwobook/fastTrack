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

## Required author/AI workflow

1. Read SKILL_Project, SKILL_Github and the current task. Use the assigned task branch and shared-file owners.
2. Implement and run the relevant checks. Open or update the existing PR with the correct Issue linkage and target branch.
3. **Add every project PR to Project 3 before requesting review**, then set Status to PR Review when it is ready. Reuse an existing Project card rather than duplicating it.
4. Set Sprint, Owner and Task ID from the actual task. Keep assignees/reviewer and test results truthful. Draft or unfinished PRs remain Started rather than claiming readiness.
5. Have the other member review. Requested changes use Fixing -> PR Review; never self-approve or bypass branch rules.
6. After an authorized merge, the native workflow moves the tracked PR card to Done. Read back the PR merge and Project state before reporting completion.
7. Check related Issues separately: a non-default staging merge does not guarantee automatic Issue closure. Close/complete a task only when its own criteria and authorization are satisfied.

Example handoff commands, after replacing the PR URL and verifying the real state:

```bash
gh project item-add 3 --owner zerotwobook --url <PR_URL>
gh project item-edit 3 --owner zerotwobook --url <PR_URL> --field Status --value "PR Review"
```

These commands add/update metadata only; they do not merge the PR. Never create a new card for a PR that already has one. Metadata initialization and intermediate status changes are part of the author/AI handoff, not an automatically configured repository auto-add rule.

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
gh project item-edit 3 --owner zerotwobook --url <PR_URL> --field Status --value Done
```

A manual repair is a recovery action, not proof that the automation fired. Do not change Verification/Acceptance or move unrelated cards as part of a repair.

## Setup record — 6 November 2026

- PR #40 was confirmed MERGED into main by Atip-Infa and its stale card was repaired from PR Review to Done.
- The owner enabled Pull request merged -> Status: Done in the Project UI.
- A GraphQL read-back confirmed that the merge workflow is enabled and PR #40 is Done. The other 38 task cards retain their prior states.
- The repair happened before enabling the rule. A subsequent tracked PR merge is the end-to-end check for the newly enabled native event rule; no synthetic approval or merge was performed for a test.
