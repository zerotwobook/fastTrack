# Part A — SRS and product scope

CPE 334 Software Engineering, Semester 1/2026. Theme 6: Course Project Management System. Product: **fastTrack**. Prepared 7 November 2026, Asia/Bangkok.

| Team and baseline | Value |
| --- | --- |
| A | Supapanya Yathip, 67070503443, GitHub zerotwobook |
| B | Atip Infa-udom, 67070503446, GitHub Atip-Infa |
| Repository | https://github.com/zerotwobook/fastTrack |
| Accepted engineering baseline used here | staging/sprint-1 at 3365a36e4cd1fcdd7410cca2086447ec4ae5dc33 |
| Submitted working S1 release | PENDING; the accepted staging increments are not a main release |
| D1 deadline | 8 November 2026, 23:59 Asia/Bangkok |

This SRS defines the whole three-sprint product. It distinguishes adopted product decisions from instructor requirements and future behavior from implemented features. At this baseline, F-01/F-02/F-03 are peer-accepted; F-04 is B's separate active task. The complete feedback journey, final verification, main release and submitted PDF are pending.

## A.1 Problem, context and actors

Student teams need to know what to deliver, when it is due, which work the team actually submitted and which supervisor feedback belongs to that work. Supervisors need to follow only their assigned teams. Informal links and messages make deadlines, version history and private feedback difficult to verify.

fastTrack provides one course-project context with explicit Student and Supervisor roles. A team follows a chronological milestone track; students submit work links and supervisors comment on the exact saved submission. The system records identity, version and acceptance time on the server. The course title shown in a future assessed deployment remains a presentation/configuration decision; a multi-course administration system is outside this baseline.

| Actor | Responsibilities and record scope |
| --- | --- |
| Student | Sign in/out; read their team, milestones, saved submissions and feedback; submit/revise work when permitted. At most one team. |
| Supervisor | Sign in/out; create milestones, read work and add feedback for assigned teams; later manage team membership/planning and scoped progress/summary. May supervise multiple teams. |
| Delivery maintainers, A and B | Maintain code, migrations, synthetic seed data, tests and reviewed releases. This is a team responsibility, not another application role or an authorization bypass. |

## A.2 Scope and exclusions

Sprint 1 covers real identity, scoped team context, milestone creation/read, one first submission per milestone and version-specific supervisor feedback. Sprint 2 adds team/planning management, revisions/history and team progress. Sprint 3 adds supervisor summary/filter/drill-down and completes hardening/verification. All continue the same application, repository and persistent history.

Work is submitted as a URL; the backend validates its syntax and never fetches it. The sender must check sharing permissions. There is no file upload, grading/approval workflow, chat, email notification, self-registration, password recovery, multi-course platform, public team directory, hard deletion of academic history or optional dark mode. Seeded accounts/team assignments are sufficient for S1; team-management behavior is still required in S2.

## A.3 Functional requirements

| ID | Observable required behavior | Feature / sprint |
| --- | --- | --- |
| FR-01 | Both roles can log in, retrieve current identity and log out; expired/revoked sessions cannot be replayed. | F-01 / 1 |
| FR-02 | Users can read only their assigned team context, milestones and related work. Foreign/missing private records are indistinguishable. | F-01/F-02, maintained by all features / 1-3 |
| FR-03 | Assigned supervisors create a milestone with required title/description and a future deadline, then retrieve the persisted values. | F-02 / 1 |
| FR-04 | A student team member submits title/description/work URL under the first-submission rules and retrieves saved author/version/time. | F-03 / 1 |
| FR-05 | An assigned supervisor appends feedback to an exact submission; that team's members read it without cross-team leakage. | F-04 / 1 |
| FR-06 | Supervisors create/rename teams and assign eligible students while preserving membership/history rules. | F-05 / 2 |
| FR-07 | Supervisors edit or cancel eligible unsubmitted milestones without destroying history or accepting an invalid deadline. | F-05 / 2 |
| FR-08 | Students create atomic revisions with expectedVersion; old submissions and their original feedback remain readable. | F-06 / 2 |
| FR-09 | Authorized users see team milestone status and progress derived from the same underlying records. | F-07 / 2 |
| FR-10 | Supervisors filter and drill into summary results from their assigned teams only. | F-08 / 3 |

## A.4 Business rules

| ID | Adopted, testable rule |
| --- | --- |
| BR-01 | Each account has one role; a student belongs to at most one team; each team has one supervisor. Supervisor-to-team assignment is one-to-many. |
| BR-02 | Server-side DB membership/assignment governs every protected read and write, including lists and aggregates. UI visibility is supplementary. |
| BR-03 | Only assigned supervisors create milestones/feedback. Only student members submit/revise work. |
| BR-04 | Read the database wall clock after required locks, truncate once to milliseconds and accept acceptedAt <= dueAt. Persist that same submittedAt. A request delayed past due is rejected even if the user clicked earlier. |
| BR-05 | S1 creates only version 1, with at most one submission per milestone. Sequential/concurrent duplicate requests cannot overwrite or add a second S1 record. |
| BR-06 | S2 increments the version atomically after checking expectedVersion; preserve all old versions and each version's feedback. |
| BR-07 | Feedback is private, append-only and associated with an exact submission ID. It is neither a grade nor an approval decision. |
| BR-08 | Trim text; count Unicode code points. Title 1-120, description/feedback 1-4,000; work URL <=2,048, complete HTTP(S), hostname present, no embedded credentials. Passwords are not trimmed. No automatic work-content normalization. |
| BR-09 | After any team submission, membership is history-locked. A submitted milestone cannot be edited/cancelled. No hard deletion or supervisor reassignment. A team rename and creation of additional milestones remain possible without changing ownership/history. |
| BR-10 | Team progress is submitted non-cancelled milestones divided by all non-cancelled milestones. Zero denominator gives 0%. Aggregate progress uses summed counts, not an average of team percentages. It is not a score. |

Timestamp inputs need an explicit zone and at most three fractional digits. HH:mm means seconds 00; deadline and rejection context display seconds in Asia/Bangkok, with UTC storage. First-submission errors after authentication/input/scope follow cancelled -> duplicate -> deadline precedence. A duplicate after due still returns ALREADY_SUBMITTED.

Mutation transactions share team -> milestone lock order, recheck scope with the same transaction client and perform no external HTTP calls while holding locks. Retry at most three times only for confirmed rolled-back technical contention, reading rules/time again. Unknown outcomes are checked through GET before an explicit retry. Feedback uses a clientRequestId per intent: replay with the same target/content returns the existing record; a changed intent with the same key returns 409 after scope checking. No automatic first-submission POST retry is permitted.

## A.5 Non-functional requirements

These are measurable behavior/verification targets, not invented latency or throughput promises.

| ID | Target and practical verification | Establish / repeat |
| --- | --- | --- |
| NFR-01 | Store password hashes and opaque session-token hashes; reject missing/expired/revoked sessions and invalid source/CSRF; responses/logs exclude secrets. Inspect real session/DB/negative API tests and safe logs. | S1; every sprint |
| NFR-02 | Every protected operation rejects unauthorized access without exposing/changing foreign data. Enumerate methods/paths and assert scoped DTOs, equal 404s and no-write effects. | S1-S3 as routes expand |
| NFR-03 | Committed work/feedback survives app restart, and after Lab 5 survives redeployment. Compare IDs/content/associations through fresh reads; retain DB while replacing processes. | S1 local; Lab 5 cloud; final |
| NFR-04 | A clean checkout installs, generates, migrates, seeds, builds, runs and tests using documented commands without source edits. Use new reserved databases and record source/output. | S1; final and packaging changes |
| NFR-05 | Forms expose loading/empty/error/recovery states, meaningful field labels and keyboard focus; mobile layout remains usable at 320px. Check real browser behavior, safe rendering, actual persisted reads and representative viewport/keyboard scenarios. | S1 and every new screen |
| NFR-06 | Failed required CI checks block release; release SHA, image and deployed revision agree; smoke and persistence checks pass. Verify a deliberately failed gate and deployed identifiers. | Lab 5 onward; final |

F-01/F-03 checks and clean-setup records exist at accepted sources. Feedback persistence/full S1 journeys and later delivery targets still need execution. There is no agreed performance SLA or measured load result.

## A.6 Decisions, assumptions and open matters

| Decision / question | Adopted resolution or remaining action |
| --- | --- |
| Theme and identity | Theme 6; B's ID ends in 6, matching the documented eligibility rule. Team names/IDs above are the actual provided identities. |
| Architecture | React/TypeScript/Vite and Express/TypeScript modular monolith with Prisma/PostgreSQL; shared pure validation, real backend scope, one continuous app. |
| Authentication implementation | Accepted seed-compatible scrypt hashes, DB-backed opaque eight-hour absolute sessions, memory-only CSRF/private client state and same-origin HTTP API. Do not silently replace the hash format with the older report's proposed Argon2id wording. |
| UI | English copy, existing white/black/gray milestone-track design and Inter with Noto Sans Thai fallback. |
| Scope versus later change | No grace period in the accepted deadline baseline. A future maintenance change needs its own approved revised contract and real RED/GREEN. |
| Release and assessment | Staging increments are accepted individually. F-04/G3/G4/G5, immutable main release, final PDF pagination/assembly and LEB2 receipt remain pending. |
| Public operations | Hosting, durable cloud DB, enforced CI and public-login throttling belong to Lab 5 design/implementation; no public deployment is claimed here. |
| Source conflicts | The original final-video sources differ; retain the decision to target <=4 minutes pending actual instructor clarification. This does not add a video requirement to D1. |

Sources: instructor D1 pages 1-8 and Group specifications retained in the supplied [source handoff](../../summary_final_deliverable.md); adopted design [project detail](../../../Project_doc/project_detail.md); [current task/gate workflow](../../../workflow/01_SPRINT1_D1.md). The final assessed PDF must contain this substantive content, not substitute these links for it.
