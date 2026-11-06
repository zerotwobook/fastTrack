# Sprint 1 G0 baseline review

Date: 6 November 2026 (Asia/Bangkok). Task: R1-J00 / Issue #2. Prepared for A; peer reviewer: B.

**Decision status: PROPOSED - B review pending.** This is a preimplementation review record. R1-A00 must not start until G0 is accepted. A branch, a documentation check or a merge that does not accept this decision is not G0 approval.

## 1. People, availability and eligibility

| Role | Name | Student ID | GitHub | Source |
|---|---|---|---|---|
| A | Supapanya Yathip | 67070503443 | zerotwobook | Supplied directly by A in this task |
| B | Atip Infa-udom | 67070503446 | Atip-Infa | Supplied directly by A in this task; B reviews the record |

A reports full-day availability for both members on **6-7 November 2026**. Exact daily/net hours have not been measured. Target completion is by the end of 7 November; the official D1 deadline remains **8 November 2026 at 23:59 Asia/Bangkok**. Do not assume additional availability on 8 November or claim that the earlier 38-54 person-hour estimate is already satisfied. Reassess remaining work at each gate, preserving required scope and verification.

Theme 6 is eligible through B: the last digit of 67070503446 is 6. [Group Work Specifications](../../../deliverable%20_file/group_work_specs_v1.pdf), section 6, physical page 4, permits either partner's matching theme. A's ID ends in 3; no special exception is required to select B's Theme 6.

## 2. Immutable source baseline

- Starting branch: `staging/sprint-1` at `c049d69b0ed8801ed5f30a5dfd3a77869b2d890b`.
- The starting staging and main file trees match; the staging merge commit retains main ancestry.
- Product design: [project detail](../../../Project_doc/project_detail.md), version 0.5, especially sections 2-11.
- S1 contracts: [D1 draft](../../../deliverable%20_file/submit/project_deliverable_1.md), version 0.2, Parts C/E, including E.1-E.6 and T-01-T-27/T-31 local coverage.
- Execution plan: [Sprint 1 workflow](../../../workflow/01_SPRINT1_D1.md), sections 5-10 and G0-G5.
- Rules: [AGENTS](../../../AGENTS.md), [project skill](../../../skill/SKILL_Project.md), [Git skill](../../../skill/SKILL_Github.md), [UI skill](../../../skill/SKILL_UI.md), [contribution guide](../../../CONTRIBUTING.md) and [Project automation](../../../workflow/GITHUB_PROJECT_AUTOMATION.md).
- Feature identifiers are F-01-F-08, not the older F-01-F-13 examples in the course summary.

Contracts already exist in committed history before application code. Historical paragraphs saying they were uncommitted describe the 5 November snapshot; they do not prove current gate acceptance. This record and its reviewed commit provide the new acceptance trail without rewriting that history.

## 3. Scope being reviewed

Sprint 1 delivers F-01 identity/team context, F-02 create/list/detail milestones, F-03 first submission/retrieval/deadline enforcement and F-04 exact-version feedback. The actual product journey must span both roles and UI -> API -> PostgreSQL. A scaffold or login alone does not complete S1.

Preserve one course, Student/Supervisor roles, one team per student, supervisor-owned team scope, URL-only submissions, strict deadlines, immutable submission history and append-only feedback. No upload, grades, chat, self-registration, password recovery, messaging, multicourse administration or new external integrations are added.

F-05-F-07 remain S2 and F-08 remains S3. Do not expose empty later-sprint navigation in S1. Labs, cloud deployment and final evidence retain their existing later checkpoints.

## 4. Reviewed technical invariants

| Area | Baseline |
|---|---|
| Architecture | React/TypeScript/Vite frontend; Express/TypeScript modular-monolith API; PostgreSQL/Prisma; Vitest/Supertest and Playwright |
| API | /api prefix, camelCase JSON, UUIDs, data/error envelopes, explicit 204 logout; domain reads include meta.serverTime; DTO allowlists and deterministic tie-breakers |
| Session | Hashed opaque tokens in DB, HttpOnly cookie, absolute eight-hour expiry, logout revocation and private-cache clearing |
| Request protection | Same-origin proxy; login JSON/custom header/origin checks; authenticated mutations use session CSRF/origin checks; no wildcard credentialed CORS or browser authority |
| Authorization | Server session -> role -> input -> record scope -> domain rule; no identity/role/author/time accepted from body |
| Transactions | One transaction client; team lock before milestone lock; recheck membership/rules; no partial writes or external HTTP under lock |
| Time | Read DB clock after locks once, truncate milliseconds, persist that checked time; equality accepted, +1ms rejected; UTC storage and Asia/Bangkok display |
| Duplicate/error order | After auth/input/scope, cancelled -> duplicate (or revision base/stale checks in S2) -> deadline; S1 version 1 has a unique constraint |
| Feedback retry | Exact submission/version; UUID clientRequestId per intent; identical retry returns existing record, changed intent conflicts; scope before key lookup |
| Validation | Trim content then count code points; no password trimming; specified text/URL limits, HTTP(S), hostname and no embedded credentials; server does not fetch submitted URLs |
| Data safety | RESTRICT/uniqueness/FKs/indexes and non-destructive ordered migrations; safe repeat seeds; fixture resets only against a separately guarded test DB |
| UI | Existing monochrome tokens, Inter with Noto Sans Thai fallback, milestone track and accessible states; newly authored UI text is English |
| Evidence | Real AC/assertion/database effects; real deadline RED/GREEN; no fabricated PASS, peer review, release or submission records |

Detailed routes/DTOs/AC remain in the original contracts rather than a second competing specification. [Module-boundary proposal](../contracts/sprint-1-module-boundaries.md) makes the parallel-work seams explicit for this review.

## 5. Ownership and branch plan

| Area/task | Owner | Reviewer/integration |
|---|---|---|
| G0 audit and source/ownership proposals | A prepares; A+B decide | B reviews this baseline before implementation |
| R1-A00 scaffold, config/scripts, API composition and package/lockfile integration | A | B reviews the small scaffold PR |
| R1-B00 schema/migrations/seed/fixtures and shared UI tokens/components | B | A reproduces and reviews before G1 |
| F-01 auth/session/CSRF, team scoped reads, API client/cache | A | B reviews |
| F-02 milestones and F-04 feedback | B | A reviews; B exports module interfaces |
| F-03 submissions/deadlines/shared lock-clock interface | A | B reviews; coordinate any schema changes with B |

All app source is under Project_code/. Repository-level workflows remain at .github/workflows/. Keep product README, technical README and development instructions separate and use English in authored artifacts.

A's current branch is `docs/s1-a-g0-baseline`, based on the staging commit above. B's prepared branch is `feature/s1-b-foundation` from that same staging baseline; no B implementation is claimed. Each member uses their own clone/worktree. After this baseline is accepted and merged, both fetch/sync staging before starting their next task; A creates a new `build/s1-a-scaffold` branch for A00.

Every task PR targets **staging/sprint-1**. No main PR/release is authorized for this work until S1 requirements and G0-G5 are actually complete. The existing main/staging protection and real peer review remain in force.

## 6. A00 boundary and readiness

A00 is a small scaffold with manifests/lockfiles, TypeScript/build/test harnesses, safe config/errors/request IDs, /api composition and the local Vite proxy. It must document reproducible setup and guarded test-DB settings, leaving schema/seed/shared UI to B and business/authentication implementation to later tasks.

Observed tools: Node 26.13.0, npm 11.20.0, and a Docker executable. This is tool discovery, not a claim of package compatibility, a running Docker daemon or a usable database. A00 will verify and pin compatible package/runtime versions and exact commands. No installation/build/migration/test commands are claimed to work yet.

Do not create fake authenticated routes or placeholder middleware that silently permits production access. Fixtures may support documented isolated preparation, but G1/G2 acceptance needs the real database/session integration.

## 7. Review evidence and remaining decision

- Source/route/DTO/rule/AC consistency has been inspected against the listed files and GitHub Issues #2-#12.
- Member details and availability were supplied by A; Theme 6 was checked against the original matching-digit rule.
- The starting branch has no application implementation; G0 acceptance, A00 execution and app tests remain separate states.
- A authorized proceeding with this scoped audit and conditionally with A00 using the established design. This is not a claim that B has reviewed the contracts.
- **B must review the scope, shared interfaces, ownership, availability and identified risks at this PR's actual head, then record approval or requested changes.** A review request or silence is not approval.
- Gate outcome remains **PENDING** until that real decision is present and the accepted baseline is integrated into Sprint 1 staging.

Once accepted: record the exact reviewer/decision/commit/PR and allow R1-A00; keep R1-B00 implementation blocked until the scaffold dependency is merged. A00's next gate is B review/G1 foundation work, not immediate F-01 implementation or a main release.
