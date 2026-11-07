# fastTrack agent instructions

- Conversation with the user may be in Thai. All newly authored or revised project content must be English.
- This includes code comments/docstrings, documentation, UI messages, test descriptions, commit messages, Issues, PRs, review text and Project metadata. Use English in artifacts even when the request is Thai.
- Read `skill/SKILL_Project.md` before project work and `workflow/README.md` plus the current sprint/task before implementation.
- Read `skill/SKILL_Github.md` before code/Git work. Identify owner A/B, dependencies and shared-file ownership; use a separate task branch and clone/worktree for each developer.
- Keep `README.md` focused on the actual application, and `Project_code/README.md` on verified code/setup details. Put team/AI/task/branch instructions in `DEVELOPMENT_README.md`, `CONTRIBUTING.md` and `workflow/`. Do not mix planning claims into implemented-feature documentation.
- Write application code under `Project_code/`. Keep repository configuration at its required root paths.
- Before UI work, read `skill/SKILL_UI.md` and `Project_doc/project_detail.md` section 8. Preserve the established visual design while writing new UI copy in English.
- For every new task, follow `workflow/GITHUB_PROJECT_AUTOMATION.md`: move the Issue Backlog -> Specified after scope review, then Started before edits; open a Draft PR during Started after the first real commit; move both cards to PR Review only at verified handoff. Record/read back transitions as they happen; never batch or fabricate earlier steps. Fixing is conditional on actual findings; Done requires the accepted merge. Leave past completed cards unchanged.
- Record only actual test/review/acceptance results. Follow human gates and repository protection; do not self-approve or merge without authorization.
- Before any change enters `main`, follow `workflow/MAIN_RELEASE_GATE.md`: the user must review the concrete current candidate and explicitly authorize that release. Keep main-targeted PRs Draft until then; AI checks/notification, B approval, a staging merge or a generic request to continue do not grant main-release permission. This applies to every sprint and future main change, including documentation and fixes. Reassess and obtain renewed authorization when the candidate head/base changes.

The language policy applies from this change onward. When editing a legacy Thai section, translate the section you change into English. Do not silently rewrite unrelated legacy documents or instructor-provided source artifacts.
