# fastTrack development guide

Team coordination, task allocation, AI instructions, GitHub collaboration and assessment workflow for fastTrack.

For the application overview, use [README.md](README.md). For verified code setup, configuration and commands, use [Project_code/README.md](Project_code/README.md).

Start with [SKILL_Project](skill/SKILL_Project.md), [workflow](workflow/README.md) and the [team Project board](https://github.com/users/zerotwobook/projects/3). Use [CONTRIBUTING.md](CONTRIBUTING.md) for real Issues, A/B ownership and GitHub review rules.

## Language policy

Conversation with the user may be Thai. **All newly authored or revised project content must be English**: code/comments, UI copy, documentation, tests, commits, Issues, PRs, review text and Project metadata. Root [AGENTS.md](AGENTS.md) and the project skill carry this rule into later AI sessions. Translate the legacy sections being edited; unrelated existing source documents are not automatically rewritten.

## Documentation format preference

User instruction recorded on 7 November 2026: write and maintain project documentation, evidence narratives and handoffs in **Markdown (`.md`)**. The user will assemble and export the final reports. Generate or rebuild a PDF only after an explicit user request, including when a verifier would rebuild it as a side effect. Existing PDF snapshots, instructor handouts and machine-readable execution evidence retain their original identities.

Use [the D1 Markdown source](deliverable%20_file/submit/d1_release/report.md) for D1 content and [the Lab 6 current status](docs/labs/lab-06/current-status.md) for current reciprocal UAT evidence and next actions. The [D1 pre-main handoff](workflow/handoffs/R1-J04_REFRESH_PRE_MAIN.md) retains its historical candidate context; inspect live GitHub state before any release. The instructor's required final submission format is unchanged; the user handles final assembly/export. This preference does not authorize main integration or course submission.

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

## Current delivery and Lab 6 checkpoint

As of 13 November 2026, the accepted serving fastTrack source is `8e637e537cd037d630a5fffc1b5672d1b44371a8` (release PR #100); original S1 tag `v1.0.0-sprint-1` remains unchanged. Sprint 2 staging includes accepted Lab 5 evidence and the Lab 6 preparation PR #108, with integration baseline `6bf85d7` after PR #109. The current Lab 6 evidence increment is [PR #110](https://github.com/zerotwobook/fastTrack/pull/110), owner A / reviewer B, on `docs/s2-a-coursepms-live-uat`. It consolidates outgoing CoursePMS observations and the newly received fastTrack package. Its exact current head, CI, review and merge state are obtained live; this document does not grant peer acceptance or a main release.

Read [Lab 6 current status](docs/labs/lab-06/current-status.md) before continuing. AI-operated checks exist in both directions; full personal A/B/partner execution, current deployed revisions, finding dispositions, independent retests and final decisions remain pending or blocked as recorded. Historical blank templates and source snapshots are preserved. The user handles final report assembly/export and actual course submission; no receipt or signature is inferred from a document/PR merge.

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

## Daily task progression

Use the [Project stage protocol](workflow/GITHUB_PROJECT_AUTOMATION.md) for application and documentation tasks. The task Issue is the complete lifecycle:

1. Backlog: register/reuse the real task and owner.
2. Specified: finish scope/contracts/acceptance/dependency review and update the card now.
3. Started: verify dependencies and the isolated task branch, then update the card **before editing task files**.
4. Push the first coherent commit, open a Draft PR and add its Project card as Started while remaining work/checks continue. Keep the Issue Started too.
5. PR Review: finish implementation/checks/evidence, mark the PR ready, move both cards and request the peer. Real requested changes use Fixing -> PR Review.
6. Done: verify actual peer acceptance and integration merge; native automation moves the PR card, while Issue closure/Acceptance are reconciled from evidence.

Save/read back each transition when it happens and append real timestamp/reason/branch-PR-commit evidence in the Issue body. Never update all earlier statuses at final handoff or fabricate a PR's pre-creation history. Past completed cards are unchanged. These steps are required team/AI rules; current native automation does not block arbitrary manual intermediate transitions.

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

## Lab 5 starter reference

The user permits using the [original Lab 5 starter](lab_file/lab5/02_lab5-starter-kit/toktickit-lab5-starter/README.md) as a structural reference. Its README explicitly says to adapt the example to the team's own app and notes that application code is not included. Keep that instructor source unchanged; develop fastTrack under Project_code rather than editing or running the example as the product.

| Starter example | fastTrack adaptation |
|---|---|
| `client/` and `server/` | Use the existing Project_code/client and Project_code/server; do not create a second scaffold or replace product routes/UI with TokTickIT. |
| Separate client/server package installs | fastTrack has npm workspaces and one Project_code/package-lock.json. Future Docker/CI installs must include the workspace manifests and use the actual workspace root; do not invent child lockfiles. |
| Node 24 Alpine images | The currently verified app pins Node 26.13.0/npm 11.20.0. Adapt and verify a compatible image/toolchain, or review a deliberate runtime change; do not silently copy an incompatible Node 24 image. |
| Prisma generation, migration and seed commands | B owns B00 Prisma 7 config/schema/adapter/client/migrations/seed. Adopt only implemented/reproduced commands and actual generated paths. No second schema or unguarded reset. |
| Unified production image and local Compose | Preserve the client/API same-origin arrangement and separate PostgreSQL/migration responsibilities. Dockerfiles/Compose/runtime readiness are still R2-A01 work, not completed by this policy. |
| `.github/workflows/` and deployment scripts | Adapt working directories/build context to Project_code, actual tests and fastTrack resources. GitHub Actions remain at repository-root .github/workflows; CI/release belongs to R2-B01 and the lab gates. |
| Health/readiness/smoke examples | `/api/health` is implemented liveness only. Future readiness must check the real DB; smoke checks must use implemented fastTrack endpoints rather than `/api/categories` or other TokTickIT behavior. |

Retain the starter's sound separation of app startup from migration jobs, runtime-injected secrets, same-origin access and reviewed deployment controls when implementing the corresponding tasks. Supply fastTrack-specific .dockerignore/env names/commands/resources and verify the result; permission to use the example does not authorize cloud provisioning or prove Docker/CI/deployment success now.
