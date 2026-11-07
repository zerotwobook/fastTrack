---
name: fasttrack-project
description: Develop or modify fastTrack using its Project_code directory, sprint workflow, teammate ownership, task branches, established UI and English-only project artifacts. Read before implementation or UI changes.
---

# SKILL_Project — fastTrack project rules

Apply this repository-specific guide before developing or changing fastTrack. A is the project owner (`zerotwobook`); B is the teammate (`Atip-Infa`). Identify the actual task owner instead of assuming every AI session works for A.

## 1. Language policy

**Conversation may be in Thai. All newly authored or revised project content must be English.** A Thai request is not permission to write Thai into project artifacts.

This applies to code comments/docstrings, identifiers and descriptive strings, UI labels/errors/help/empty states, test names/descriptions, README/specifications/contracts/reports, commit messages/branch descriptions, Issues, PRs, review text, labels/milestones and Project descriptions/fields.

Preserve technical identifiers, paths, URLs, proper names and the identity of original external source artifacts. For Unicode tests, use explicit escaped sample values with English descriptions when non-English data is required. Existing Thai source documents are not automatically rewritten: translate the section you actively revise, and keep unrelated legacy content outside the current change. New English UI copy takes precedence over Thai wording in older mockups while preserving their visual direction and behavior.

## 2. Read before starting

1. Read [workflow/README.md](../workflow/README.md), then the current round: [Sprint 1 / D1](../workflow/01_SPRINT1_D1.md), [Sprint 2 / Labs 5-7](../workflow/02_SPRINT2_LABS5-7.md), or [Sprint 3 / D2 / Final](../workflow/03_SPRINT3_D2_FINAL.md).
2. Identify owner A/B, Task ID, scope, dependencies, shared-file owner and checkpoint. Read the actual task checklist, not just its title.
3. Read the relevant [project detail](../Project_doc/project_detail.md): requirements/rules (5), allocation (6), architecture/data (7), UI (8), API (9), progress (10), acceptance (11), and the task's referenced contracts.
4. **Read the complete [Git skill](SKILL_Github.md) before writing code or performing Git operations.** Inspect repository instructions, current branch/tree and the actual Issue/PR state.
5. **Read the complete [UI skill](SKILL_UI.md) before designing or changing UI**, together with project detail section 8 and existing shared components/tokens.

Reuse already-read guidance until it changes or the context requires a refresh. If missing owner/task information prevents safe work allocation, ask only for that missing information and continue independent read-only preparation where useful.

## 3. Code and document locations

**All application code belongs under repository-root `Project_code/`:** frontend, backend, shared contracts, automated tests, schema/migrations/seeds, assets and application build/runtime configuration, following project detail section 7.2 and the workflow.

- Inspect the existing tree before scaffolding; extend one application across all three sprints.
- Do not implement the app in the repository root, workflow, project-design/report folders or the Lab 5 starter kit.
- Keep plans in `workflow/`, product design in `Project_doc/`, and deliverables at their specified paths.
- Use [README.md](../README.md) for the actual application overview and [Project_code/README.md](../Project_code/README.md) for verified code/setup details. Keep team coordination, AI prompts, task allocation and branch procedures in [DEVELOPMENT_README.md](../DEVELOPMENT_README.md), CONTRIBUTING and workflow. Before code exists, leave technical details explicitly pending rather than inventing features or commands.
- Preserve required repository-level paths such as `.github/workflows/`, `.gitignore`, `skill/` and `docs/labs/lab-05/deployment.md`. GitHub Actions do not belong inside Project_code.
- Use real working directories/build contexts for install/build/test/Docker/CI; do not create duplicate root packages or lockfiles unnecessarily.
- The [Lab 5 starter](../lab_file/lab5/02_lab5-starter-kit/toktickit-lab5-starter/README.md) may guide client/server, container and CI/deploy structure. Adapt it to fastTrack under Project_code, the existing workspace/runtime and owned schema/UI; do not replace the accepted app with TokTickIT or claim unverified starter commands work. See [the development guide](../DEVELOPMENT_README.md#lab-5-starter-reference).

## 4. Task ownership and branch isolation

- **Create a new task branch before changing files for new work**, normally from the current sprint staging branch. Use meaningful round/owner/task names such as `feature/s1-a-auth` or `feature/s1-b-milestones`.
- Continue the same branch/PR for the same task or review fixes after verifying current state; do not duplicate branches for every AI session.
- Use `staging/sprint-1`, `staging/sprint-2`, `staging/sprint-3` according to the round. If missing, follow workflow README section 3.2 before feature implementation; do not assume the open branch is the right base.
- A and B use separate clones/worktrees. Never run two sessions on different branches in one working directory simultaneously.
- Each owner handles their assigned feature's UI/API/tests/documentation. Coordinate before taking over the other person's module.
- Separate branches can still conflict: respect shared schema/migration, DTO, auth, routing, shell, token and lockfile owners. Integrate shared-interface changes before dependent features.
- While waiting, prepare agreed specifications/test designs/fixtures. Integrated acceptance still requires the real system, not mocks.
- Fetch/synchronize dependencies safely and sync main back to staging after releases as documented; preserve history and uncommitted work.
- Task PR -> staging -> peer review -> reviewed release PR -> main. Do not implement directly on protected branches, self-approve or merge for the reviewer without the authorization required by the Git skill.

For planning before staging exists, use the agreed docs-branch bootstrap and inspect base/history/scope. Read-only inspection needs no branch change.

## 5. Follow the established product and UI design

Use **project detail section 8 as the fastTrack design brief**, with the UI skill improving that brief rather than inventing a new theme each time.

- Keep fastTrack branding, the white/black/gray palette, white canvas, black primary actions and shared color tokens from section 8.3.
- Keep Inter with Noto Sans Thai fallback and specified weights/spacing from section 8.4. English-only copy does not require discarding the agreed typography system.
- Follow the application shell, role-aware navigation, screen specifications/wireframes and feature mapping in sections 8.5-8.7. Prioritize milestone tracks, due dates, versions and feedback.
- Reuse shared components/tokens; do not invent a competing button/form/status system per feature.
- Implement English loading/empty/error/success/recovery text, mobile behavior, keyboard focus and accessibility from sections 8.8-8.11. Use text/icons and the monochrome palette rather than added status colors/gradients.
- Preserve the Student/Supervisor scope and business rules. Do not add features or weaken authorization to make a mockup attractive.

Before UI implementation, briefly identify the screen, source section, shared components/tokens and required states. Review the rendered result against the brief when possible and report anything not actually verified.

For shared design/API/schema/rule changes, identify impacts and follow the workflow checkpoint before dependent code. Keep source documents synchronized. Use clear existing user authorization instead of repeatedly asking for approval of the same decision.

## 6. Verification and handoff

- Follow task AC/tests/DoD and required evidence. Never invent PASS, review, release or submission claims.
- For TDD, retain RED on the task branch, then GREEN/regression before integration; never merge an intentionally failing change into protected main/staging.
- Follow the [stage protocol](../workflow/GITHUB_PROJECT_AUTOMATION.md) for every new task: Issue Backlog -> Specified after scope review -> Started **before task-file edits** -> PR Review only at verified handoff -> Done after actual acceptance/merge. Use PR Review -> Fixing -> PR Review for real findings only. Read back and log each transition when it happens; never batch earlier stages at handoff or invent history. Preserve past completed cards.
- After the first coherent commit is pushed, open a **Draft PR during Started**, add its Project 3 card immediately and initialize Task ID/Sprint/Owner/Verification/Acceptance with Status Started. Finish remaining work/checks, then mark ready and move both cards to PR Review before requesting peer review. The linked Issue holds the real pre-PR stages; do not fabricate those stages on a PR created later. Native merged-PR -> Done remains enabled; verify its result separately from Issue closure/gate acceptance.
- Have the teammate review at the specified PR/gates before dependent work. Independent work may continue without approval for every file or command.
- For every main-targeted PR, follow [user review and release authorization](../workflow/MAIN_RELEASE_GATE.md). Prepare the concrete candidate/checks first, then keep it Draft until the user reviews and explicitly authorizes the current head/base. AI notification/results, B approval and permission to continue staging work do not replace this decision. Apply this to all future sprints/releases/docs/fixes; renewed authorization is required after the candidate changes.
- End with owner/Task ID, branch, changed behavior/files, actual checks/results, review instructions and next action; include real commits/PRs and distinguish implementation, verification, review and merge.

Product direction comes from project detail, sequencing/owners/deadlines from workflow, and assessment criteria from original handouts. Surface material conflicts before changing affected behavior; do not silently choose the easier requirement.

## 7. Example task request

```text
Read skill/SKILL_Project.md and its relevant references.
I am <A or B>, working on <Task ID> from workflow/<current-round file>.
Check dependencies and the teammate's shared-file ownership before editing.
Read SKILL_Github and create/resume the correct task branch.
Implement the app in Project_code/. For UI, read SKILL_UI and project_detail section 8.
Use English in all project artifacts; conversation with me may be Thai.
Complete this task's checks and provide a factual handoff for peer review.
```

This repository uses the `skill/SKILL_*.md` convention. The file is referenced by root AGENTS.md and workflow entry points; do not assume every AI tool automatically loads it without its own instruction mechanism.
