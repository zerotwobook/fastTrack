---
name: github-workflow
description: Manage Git repositories and GitHub collaboration through verified branches, commits, Issues, Pull Requests, reviews, and merges. Focus only on Git/GitHub operations; do not generate academic reports or documentation deliverables.
---

# Git & GitHub Workflow

Use this skill for Git and GitHub work in any repository. Read it before acting. Ground every action in the **current repository and live GitHub state**, not assumptions from an earlier project. This guide covers version control and GitHub collaboration only; it does **not** prescribe reports, PDFs, screenshots, reflections, or other documentation deliverables.

## 1. Priorities and operating rules

1. Follow the user's latest direct instruction first.
2. Follow the current repository's `CONTRIBUTING.md`, branch protection, and GitHub workflow rules where applicable.
3. Check the actual Issue, PR, Git configuration, and GitHub state before relying on this guide.
4. If instructions conflict, explain the material conflict and follow the higher-priority instruction.
5. If asked to inspect or explain only, **make no changes**.

Routine, reversible operations within the user's requested scope may proceed without repeated confirmation: inspect state, create/switch work branches, stage scoped changes, commit, push, open/update PRs, and set applicable Issue/PR metadata. **Do not** merge PRs, approve on behalf of a reviewer, post comments as the user, force-push, rewrite shared history, delete branches, discard work, or modify protected branches without explicit authorization. Respect repository permissions and protection rules.

## 2. Inspect before changing anything

Establish the actual values of these items when relevant:

- Repository name, remote URL, authenticated GitHub account, default branch, and protection rules.
- Current branch, upstream, working tree, untracked files, staged changes, and local/remote divergence.
- Target base branch, working branch, open Issue(s), open PR(s), dependencies, and reviewers.
- PR head/base, latest commits, review decisions, review threads, checks, mergeability, and whether a merge already happened.
- Existing GitHub Project, labels, milestones, and other fields **only when the repository uses them**.

Useful read-only commands:

```bash
git status --short --branch
git remote -v
git branch -vv
git log --oneline --decorate -8
git diff --stat
git diff --cached --stat
gh auth status
gh repo view --json nameWithOwner,defaultBranchRef
gh issue list --state open
gh pr list --state open
```

For a specific item, inspect its actual number, not a guessed one:

```bash
gh issue view <ISSUE_NUMBER> --json title,body,state,assignees,labels,milestone,projectItems,comments
gh pr view <PR_NUMBER> --json state,headRefName,baseRefName,headRefOid,mergedAt,mergedBy,mergeCommit,reviewRequests,reviews,comments,closingIssuesReferences,statusCheckRollup
```

**Resume existing work:** if the task already has an Issue, branch, or PR, continue it rather than creating duplicates. Preserve unrelated and uncommitted user changes.

## 3. Issue and work planning

- Use a GitHub Issue when the user or repository workflow calls for one; do not create Issues just to satisfy a template.
- Read the full Issue, including scope, acceptance criteria, dependencies, and latest comments.
- If the work is ambiguous, propose small, independently reviewable tasks; do not invent Issue numbers or dependencies.
- Link the work branch and PR to the correct Issue. Use the repository's existing naming rules when available.
- When a GitHub Project is in use, update its status to match reality; do not invent or duplicate Project boards.
- Default to one active dependent task at a time unless parallel work is requested or safe.

Example Project statuses, **only if the existing board uses them**:

| Status | Meaning |
| --- | --- |
| `Backlog` | Issue is queued |
| `Specified` | Scope and acceptance criteria are clear |
| `Started` | Work is underway |
| `PR Review` | PR is ready for review |
| `Fixing` | Feedback or failed checks are being addressed |
| `Done` | Changes are merged and the Issue is complete |

### fastTrack stage timing

For this repository, follow [Project stage progression](../workflow/GITHUB_PROJECT_AUTOMATION.md). The linked Issue must move Backlog -> Specified after scope review, then Started before editing task files. Read back and record each transition at that milestone; never skip stages or cycle through them only when the work is finished. Preserve past completed cards.

After the first coherent commit is pushed, open a **Draft PR while work is Started** and immediately add its Project card as Started with the actual metadata. Complete the remaining work/checks, update evidence, mark ready and move both cards to PR Review before requesting the peer. The Issue holds the real Backlog/Specified history before a PR exists; do not fabricate that history on the PR card. Real findings use PR Review -> Fixing -> PR Review; accepted integration permits Done. Keep Status, Verification and Acceptance separate.

Maintain the concise progress log in the Issue body, preserving other authors' text. This is not permission to post comments/messages. The native merged-PR rule does not technically enforce intermediate transitions; follow the procedure and verify the live states.

## 4. Branch, commit, and push

1. Confirm the intended base branch and that the working tree can be changed safely.
2. Fetch remote updates. Update the local base with a **non-destructive** method (for example, `git pull --ff-only` when appropriate).
3. Create or resume a task-specific branch. Prefer repository conventions; otherwise use `feature/<issue>-<topic>`, `fix/<issue>-<topic>`, or `<type>/<topic>`.
4. Make only the changes requested for that task. Never overwrite unrelated work.
5. Review the diff before staging and committing; stage selected files, not automatically everything.
6. Check `git diff --check` and any relevant project checks already required by the task. Report actual results, never inferred results.
7. Write a concise, meaningful commit message. Push the intended branch to the correct remote.
8. Verify the remote branch and pushed commit SHA. For fastTrack, open/add the Started Draft PR after the first coherent push, before finishing remaining task work/checks; continue that same PR.

Example commands (replace placeholders):

```bash
git fetch origin
git switch -c feature/<issue>-<topic> <BASE_BRANCH>
git status --short
git diff --check
git add <FILES_FOR_THIS_TASK>
git diff --cached
git commit -m "feat: <short change>"
git push -u origin HEAD
```

Do not run these blindly. If a branch already exists, switch to it instead of creating a replacement. Do not force-push, hard-reset, clean untracked files, or delete branches without express permission. Check for secrets, `.env` files, credentials, and accidental large/generated files before committing.

## 5. Pull Requests

Before opening or updating a PR, verify its base/head branches, changed files, commits, issue linkage, and actual check status. In fastTrack, open the initial PR as a draft during Started and record incomplete checks honestly; do not wait for final handoff to create its first card. Reuse an existing PR when continuing or responding to feedback. Use the repository's PR template if one exists; otherwise keep the PR body focused on GitHub review:

```md
## Related Issue
Closes #<ISSUE_NUMBER>  <!-- only if this PR should close the Issue -->

## Summary
- <What changed>

## Verification
- <Actual commands/checks and results, or "Not run" with reason>

## Review Focus
- <Risks, trade-offs, or areas needing attention>
```

- Request the real intended reviewer if known and permitted.
- Populate applicable Assignee, Label, Milestone, and Project fields **only if relevant and available**.
- Verify the Issue appears in the PR's Development relationship when that linkage is required. For non-default target branches, a closing keyword alone may not link or close it as expected.
- Do not claim a PR is merged merely because it is marked ready or approved. Confirm its actual state.

## 6. Reviews, feedback, and merge verification

**fastTrack main-release requirement:** Follow [the user review gate](../workflow/MAIN_RELEASE_GATE.md) for every PR targeting main. Keep it Draft until the user has reviewed the concrete current candidate and explicitly authorized that release; only then make the ready/peer/merge handoff. AI checks/notification, B approval, a staging merge or generic continuation do not authorize main. Record the actual decision and head/base; changed candidates require renewed authorization. This project-specific user requirement is additional to peer review/protection and does not block ordinary staging work.

- Read review decisions, general comments, inline threads, CI checks, and the latest PR head before responding.
- If changes are requested, fix them on the **same branch and PR**, review the diff, commit/push, and rerun affected checks where possible.
- Prepare concise English replies explaining what changed, including commit references. **Only post comments when explicitly asked.** Do not invent reviewer feedback or claim to have replied when no reply was posted.
- Request re-review when appropriate and check whether approval still applies to the current commit.
- **Do not self-approve or self-merge.** Leave the merge for the authorized reviewer/maintainer unless the user explicitly changes this rule and repository policy permits it.
- After a merge, verify `MERGED`, `mergedBy`, merge commit, target branch, and relevant Issue/Project state. Close an Issue manually only if appropriate and authorized; do not assume an integration-branch PR auto-closes it.
- Safely synchronize the local base before starting the next dependent task.

Provide a ready-to-copy English GitHub comment when a handoff actually needs one (ready for review, response to feedback, re-review, or post-merge). Keep the text factual and short.

## 7. End-of-task GitHub handoff

Briefly report:

- Repository and current branch.
- Related Issue/PR numbers and links when available.
- Commit SHA and whether the push succeeded.
- Checks actually run (or not run).
- Reviewer/PR/merge state and any Project status change.
- Blockers and the **next actionable Git/GitHub step**.

Do not say a task is completed if the relevant PR is still waiting for review or merge.

## 8. Scope exclusions

This skill is **Git/GitHub only**. Do not independently create or require:

- Academic or project reports, PDF deliverables, screenshots, submission packages, or presentation files.
- `reviewer.md`, `ai-use.md`, `tests.md`, reflections, or other evidence logs solely because an older workflow used them.
- A pre-`main` documentation approval question or any lab-specific review gate.
- A fixed number of Issues, special branch scheme, assigned reviewer, or board statuses from an old lab.

If the user directly requests documentation or the current repository explicitly requires a particular file for the requested change, handle that as a **separate, explicit requirement**, not as an automatic part of this skill.

## Suggested instruction for a new session

```text
Read skill.md completely. Inspect the current Git repository and live GitHub state. Continue the existing Issue/branch/PR where appropriate. Follow the Git & GitHub workflow for safe commits, pushes, PR metadata, review, and merge verification. Do not create reports or documentation deliverables unless explicitly requested.
```
