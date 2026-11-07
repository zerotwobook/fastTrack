# User review and authorization before main

This fastTrack project rule records the user's explicit clarification on 7 November 2026. It applies to every PR targeting `main`, across all sprints, D2/Final, documentation and fixes.

**Keep a main-targeted PR as Draft until the user has reviewed the concrete current candidate and explicitly authorized its release into main.** Notifying the user does not complete this gate. Do not mark ready, request peer approval/merge, enable auto-merge or merge while this authorization is pending.

## Prepare a reviewable candidate

1. Complete authorized preparation and relevant checks on the task/sprint branches. A Draft release PR may be opened early; do not implement directly on main.
2. Give the user the release PR, exact head/base SHAs, resulting behavior, actual checks, findings and limitations. Provide the relevant code/documentation and a practical way to inspect the application when applicable. Distinguish existing test evidence from a new run.
3. Wait for the user's actual review and explicit release authorization for that candidate. Do not claim the user reviewed something because the AI checked it. A short reply can authorize release when its context unambiguously refers to the presented main candidate; no fixed approval phrase is required.
4. Record the real user decision, conversation reference/time, PR and approved head/base in the PR/task Issue. Preserve pending status when no authorization exists. Once valid authorization is recorded, do not ask again for the unchanged candidate unless the user withdraws it.
5. Obtain the required real peer review and satisfy repository protection before the authorized merge. User release authorization does not replace peer approval or the existing prohibition on self-approval/self-merge. Verify the actual resulting main merge before claiming release completion.

## Decisions that do not authorize main

- Generic instructions to continue working, prepare a release or fix an issue.
- A teammate merging a task or documentation PR into sprint staging.
- B approving the code/report, passing AI checks, a green build or a Project card moving forward.
- Sending a pre-main notification, the user's silence, elapsed time or approval of an earlier candidate.

These events may permit their own scoped work. They do not lift the main-release gate.

## Changed candidates and holds

If the head or base changes, show the change, reassess affected checks and obtain renewed user review/authorization for the new candidate before lifting Draft. Do not reuse approval silently, even for a documentation-only change. Preserve previous review results with their original source identities.

If the user asks to wait or review first, keep/return the main PR to Draft, ensure auto-merge is disabled and withdraw any outstanding request made by the agent to proceed with peer approval/merge. Record the hold and keep release Acceptance PENDING. Existing passing checks remain evidence; do not invent a code failure or mark the release Done. Resume only after explicit authorization of the current candidate.

## Scope and enforcement

Ordinary task work, tests and PRs into sprint staging retain their existing workflow; they do not require main-release authorization. This rule does not authorize a merge, force push, protection change, tag or course submission by itself.

This is a team/agent procedure using the Draft state. It does not install a custom GitHub approval check or claim that automation verifies the user's chat decision. Follow [Project stage timing](GITHUB_PROJECT_AUTOMATION.md), [the Git skill](../skill/SKILL_Github.md) and the actual repository protection as well.
