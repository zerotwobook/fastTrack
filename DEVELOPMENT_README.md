# fastTrack development guide

Team coordination, task allocation, AI instructions, GitHub collaboration and assessment workflow for fastTrack.

For the application overview, use [README.md](README.md). For verified code setup, configuration and commands, use [Project_code/README.md](Project_code/README.md).

Start with [SKILL_Project](skill/SKILL_Project.md), [workflow](workflow/README.md) and the [team Project board](https://github.com/users/zerotwobook/projects/3). Use [CONTRIBUTING.md](CONTRIBUTING.md) for real Issues, A/B ownership and GitHub review rules.

## Language policy

Conversation with the user may be Thai. **All newly authored or revised project content must be English**: code/comments, UI copy, documentation, tests, commits, Issues, PRs, review text and Project metadata. Root [AGENTS.md](AGENTS.md) and the project skill carry this rule into later AI sessions. Translate the legacy sections being edited; unrelated existing source documents are not automatically rewritten.

## Planning baseline

These documents define work and acceptance, not a verified working application. Publishing planning documents to main does not accept G0, Sprint 1 or the product. Inspect the live repository, Issues and PRs before starting.

| Information | Reference |
|---|---|
| Product scope, data/API rules and UI design | [Project detail](Project_doc/project_detail.md) |
| Owners, dependencies, gates and assessments | [Workflow](workflow/README.md) |
| Project/Git/UI rules | [Project skill](skill/SKILL_Project.md), [Git skill](skill/SKILL_Github.md), [UI skill](skill/SKILL_UI.md) |
| Application code and verified setup commands | [Project_code](Project_code/README.md) |
| D1 report and S1 contracts | [D1 draft](deliverable%20_file/submit/project_deliverable_1.md) |
| Original assessment criteria | [Group specs](deliverable%20_file/group_work_specs_v1.pdf), [D1](deliverable%20_file/project_deliverable_1_v1.pdf), [D2](deliverable%20_file/project_deliverable_2_v1.pdf), [Final](deliverable%20_file/project_final_delivery_v1.pdf) |

For tracked PRs, the enabled native Project workflow moves the card to Done after merge. Follow [Project merge automation](workflow/GITHUB_PROJECT_AUTOMATION.md) when opening/reviewing PRs.

## First-day allocation

A is `zerotwobook`; B is `Atip-Infa`. Each member uses a separate clone/worktree and records real names/student IDs, availability, topic eligibility and baseline acceptance in [R1-J00 / G0, Issue #2](https://github.com/zerotwobook/fastTrack/issues/2).

staging/sprint-1 has been prepared from main. Verify its actual baseline rather than recreating/resetting it. After G0, use a separate task branch for each owner; do not develop on main/staging directly.

| Stage | A | B | Required handoff |
|---|---|---|---|
| G0 | Review scope/contracts/ownership | Review with A | Actual shared baseline decision |
| Scaffold | R1-A00: scripts/env/API skeleton | Prepare R1-B00 schema/UI/test design and review A's scaffold | Scaffold reviewed/merged into staging |
| Foundation | Review schema; prepare auth tests | Sync scaffold; implement migrations/seed/shared UI | G1: both reproduce setup and agree on interfaces |
| First features | R1-A01: auth/session/team context | R1-B01: milestones | G2: real combined auth/milestone flow |
| Next features | R1-A02: first submission/deadline | R1-B02: feedback | G3, then regression/review/D1 acceptance |

Read [Sprint 1 sections 5-8](workflow/01_SPRINT1_D1.md) for exact paths/checklists. B does not create a second scaffold. Coordinate schema/router/DTO/lockfile/token changes with the shared owner.

## Clone and start a task

For a new machine without an existing fastTrack directory:

```bash
git clone https://github.com/zerotwobook/fastTrack.git
cd fastTrack
git status --short --branch
git fetch origin
git branch -r --list origin/staging/sprint-1
```

If staging is absent, resolve bootstrap first. After verifying a safe working tree and the required gate, choose only your own command for a new task:

```bash
# A: scaffold
git switch -c build/s1-a-scaffold origin/staging/sprint-1
# B: foundation design; runnable implementation waits for the merged scaffold
git switch -c feature/s1-b-foundation origin/staging/sprint-1
```

Continue the existing branch for the same task/review. Preserve uncommitted work rather than using reset/clean to force the example commands to run.

## Example AI requests

```text
I am A. Read AGENTS.md, skill/SKILL_Project.md and the Sprint 1 workflow.
Verify actual R1-J00/G0 acceptance first, then do only R1-A00 on A's task branch.
Write the scaffold in Project_code/ and coordinate interfaces with B, who owns schema/seed/shared UI.
Use English in project artifacts; conversation with me may be Thai.
Provide a small reviewable scaffold and actual checks for B. Do not start F01 before its dependencies pass.
```

```text
I am B. Read AGENTS.md, skill/SKILL_Project.md and the Sprint 1 workflow.
Verify actual R1-J00/G0 acceptance, then prepare R1-B00 schema/fixtures/UI contracts and review A's scaffold.
Do not scaffold a second app. Sync A's merged scaffold before runnable implementation on B's branch.
Read SKILL_UI and project_detail section 8 before UI work; author all project content in English.
Provide actual results for A's G1 review. Conversation with me may be Thai.
```

Move to the next Task ID only when its dependency/gate requirements are satisfied. Do not recreate first-day work or invent missing human approvals.

## Documentation responsibilities

| File | Purpose | Update rule |
|---|---|---|
| README.md | Application overview, implemented capabilities and links to technical documentation | Describe real implementation status; keep team/AI/sprint instructions in this guide. |
| Project_code/README.md | Verified prerequisites, runtime versions, environment setup, installation, run/build/test commands and source layout | Add instructions only after implementing and reproducing them; do not publish guessed commands. |
| DEVELOPMENT_README.md | Team onboarding, A/B allocation, skills, AI prompts, branches, reviews and delivery workflow | Maintain this guide when the development process changes. |
| CONTRIBUTING.md and workflow/ | Detailed collaboration rules, sprint task checklists and acceptance gates | Keep references consistent without duplicating entire guides. |

During R1-A00, A documents verified Node/package-manager/database versions, lockfile policy, exact working directories and install/dev/build/test commands. B adds migration/seed instructions and reset safeguards during R1-B00. Each member reproduces the other's setup before G1. Until implementation exists, application-facing README files state that the relevant documentation is pending.
