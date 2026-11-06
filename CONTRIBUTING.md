# Contributing to fastTrack

A = [zerotwobook](https://github.com/zerotwobook); B = [Atip-Infa](https://github.com/Atip-Infa). Both implement features and review each other's work. Read [SKILL_Project](skill/SKILL_Project.md), the [Git skill](skill/SKILL_Github.md) and the [workflow](workflow/README.md) first.

## Language policy

Conversation with the user may be Thai. **All newly authored or revised project content must be English**, including code comments/docstrings, UI text, documentation, tests, commits, Issues, PRs, reviews and Project metadata. Translate the legacy section being edited; do not rewrite unrelated legacy files or instructor source artifacts automatically. Follow [SKILL_Project section 1](skill/SKILL_Project.md) for details.

## Project board

Use [fastTrack — Team Delivery](https://github.com/users/zerotwobook/projects/3), linked to this repository. Atip-Infa has WRITER access. Views include all work, Sprints 1-3, A, B and blocked dependencies.

- A/B views include jointly assigned work. Sprint views narrow the round.
- Task ID refers to the workflow. Owner means A/B/SHARED; Assignees are real GitHub accounts.
- Status: Backlog -> Specified -> Started -> PR Review -> Fixing -> Done. Update Verification and Acceptance only from actual results.
- Initially, implementation tasks are Backlog / NOT RUN / PENDING. The setup PR is in PR Review until approved and merged.
- Check native dependencies, the blocked label and actual gate decisions; a closed Issue does not prove acceptance.
- Add new tasks/defects/PRs to this Project and populate Sprint/Owner/Task ID. Do not assume automatic addition or status movement.

Requested changes follow PR Review -> Fixing -> PR Review. A review that passes immediately can proceed to Done after the actual merge; Fixing is not mandatory when there are no changes to make.

## Existing work

- [Issues](https://github.com/zerotwobook/fastTrack/issues): 38 planned task Issues across three sprints; reuse the existing Task ID instead of creating duplicates.
- [Milestones](https://github.com/zerotwobook/fastTrack/milestones): D1, Lab 5, Lab 6, Lab 7, D2 and Final. Official 23:59 Asia/Bangkok cutoffs are in descriptions/workflow; GitHub milestone fields display dates.
- [R1-J00 / G0, Issue #2](https://github.com/zerotwobook/fastTrack/issues/2): jointly accept the real baseline, availability and topic eligibility.
- A owns [R1-A00 scaffold, #3](https://github.com/zerotwobook/fastTrack/issues/3). B prepares [R1-B00 schema/UI, #4](https://github.com/zerotwobook/fastTrack/issues/4), then implements after syncing A's reviewed/merged scaffold.

Issues are assigned to their actual owners; shared work is assigned to both. Filter with sprint:1/2/3, owner:A/B/shared and lab5/6/7. Remove blocked only when the relevant dependency/gate is genuinely satisfied.

## Branches and PRs

staging/sprint-1 has been prepared from the main planning baseline. Branch creation does not accept G0 or a working S1 release. Verify the actual shared baseline rather than resetting or recreating a teammate's staging branch.

```bash
git fetch origin
git status --short --branch
# New task only, after inspecting the working tree and replacing the placeholder:
git switch -c <task-branch> origin/staging/sprint-1
```

Use separate clones/worktrees and keep app code under Project_code/. Coordinate shared schema/router/DTO/lockfile changes with the designated owner.

Task PR -> staging -> peer review/approval -> merge commit. After integration, use a reviewed release PR into main. The author does not approve their own PR. Preserve RED/GREEN and main-to-staging synchronization history.

The active ruleset requires one peer approval on main and staging/sprint-*, dismisses stale approvals after reviewable changes, requires resolved conversations and blocks force pushes/deletion. No bypass actors are configured. Merge commits are enabled; automatic branch deletion stays off to preserve staging after a release.

No nonexistent CI context is required. [R2-B01 / Lab 5, #15](https://github.com/zerotwobook/fastTrack/issues/15) must create meaningful tests/build/Docker checks, then require the real check/up-to-date policy and prove a failing check blocks merge. Current peer approval is not the Lab 5 CI gate.

## Handoff and acceptance

Keep board Status separate from Verification NOT RUN/FAILED/PASSED and Acceptance PENDING/ACCEPTED. Done means task criteria plus an actual integration merge, not all release/assessment gates.

Provide Task/Issue/PR, commit, changed behavior, reproduction instructions, actual checks/results and review focus. Verify Issue linkage for staging PRs; do not assume Closes automatically closes an Issue on a non-default branch.

Plans/designs do not prove working software. Member details, availability, eligibility, TA approval, UAT, tests and submission receipts require real evidence.
