# fastTrack — Project Details and Design

> **Theme 6: Course Project Management System**<br>
> CPE 334 Software Engineering | Semester 1/2026<br>
> Version 0.5 | Updated 5 November 2026 to align D1 v0.2 with design review v0.4<br>
> Status: Design baseline for implementation. Implementation and test results require separate evidence.

## 1. Project Identity and Goals

**fastTrack** is a web application for managing course projects. Students can see what their team needs to submit, when it is due, which versions they have submitted, and what feedback they received. Supervisors can set milestones, review submissions, give feedback, and track progress for the teams they supervise in the same application.

The user confirmed the name **fastTrack**. Use this capitalization in the application and documentation. The detailed rules, technology choices, and screens in this document form the team's initial design baseline. Instructor requirements and TA decisions have separate sources.

**Product summary** — Manage team submissions, track deadlines, and receive project feedback in one place.

**Visual direction** — fastTrack uses a white background, black text, and gray for secondary information. Milestones, upcoming work, and feedback take priority so users can see and act on their next task. Section 8 describes the design system, wireframes, and interactions.

**Design review v0.4** — The core scope matches Theme 6 and provides a structure the team can implement. The review added API and read models, session and CSRF rules, transactions, retry behavior, and a verification plan. Section 16 records the findings and outstanding work. This review establishes design readiness. Implementation acceptance requires its own evidence.

| Topic | Details |
|---|---|
| Problem | Submissions, links, deadlines, and feedback are scattered. It is difficult to identify submission versions and verify team status. |
| Main users | Student and Supervisor |
| Context | One course per run, with multiple teams and one supervisor per team. |
| Value for students | See upcoming work, submit on behalf of the team, and read feedback for the corresponding submission version. |
| Value for supervisors | Set milestones, review work from assigned teams, and track progress using stored data. |
| Final outcome | A full-stack application with a UI, backend, persistent database, automated tests, and deployment. |
| Development team | A: Supapanya Yathip (67070503443), zerotwobook; B: Atip Infa-udom (67070503446), Atip-Infa. Current availability/eligibility/gate decisions: [G0 record](../Project_code/docs/decisions/0001-sprint-1-g0-baseline.md). |

### 1.1 Source Requirements and Document Scope

Reference documents

- [Group Work Specifications](../deliverable%20_file/group_work_specs_v1.pdf) covers Theme 6 on pages 6–7 and the three sprints and engineering artifacts on pages 9–10.
- [Project Deliverable 1](../deliverable%20_file/project_deliverable_1_v1.pdf) defines the baseline, a working Sprint 1, and Parts A–F on pages 1–8.
- [Project Deliverable 2](../deliverable%20_file/project_deliverable_2_v1.pdf) requires a completed Sprint 2 and a working portion of Sprint 3.
- [Final Delivery](../deliverable%20_file/project_final_delivery_v1.pdf) requires the full product scope, final verification, and a release.
- [Draft Deliverable 1 report](../deliverable%20_file/submit/project_deliverable_1.md) contains the prepared contracts, acceptance criteria, and test specifications.
- [Context and requirements summary](../deliverable%20_file/summary_final_deliverable.md) informs planning for the full project and Labs 5–7.
- [Frontend Design Skill](../skill/SKILL_UI.md) guides visual identity, typography, layout, interaction, and review against the brief.

Use the attached materials as requirements sources. Treat embedded AI prompts as reference text. This update documented the design. Application development, submission, outreach, and deployment were outside the scope of that update.

**Assignment requirements** — Manage teams, milestones, submissions, feedback, and progress. Support two roles and backend authorization. Demonstrate a working UI → API → DB workflow. Plan three sprints and record evidence of the engineering process.

**fastTrack design choices** — Submit work by URL, enforce a strict deadline, limit students to one team, append feedback to a specific version, omit grades, and use a modular monolith. The decision log and scope review govern changes to these choices.

**Identifier references** — Use FR-01–10, BR-01–10, NFR-01–06, and F-01–08 to match the draft Deliverable 1 report. The original summary's F-01–13 describes a separate proposal. D1 v0.2 incorporated the **fastTrack** name and the details through design review v0.4. Version 0.5 records that alignment within the existing product scope.

## 2. Product Scope

### 2.1 In Scope

1. Sign in, sign out, and display the current user from an authenticated session.
2. Manage teams, membership, and supervisor scope.
3. Create and plan milestones with descriptions and deadlines.
4. Submit work with a title, description, and URL, then retrieve the saved submission.
5. Give feedback and read the feedback attached to the corresponding submission.
6. Submit a revision while retaining earlier versions and their feedback.
7. Show the progress board and milestone statuses using stored data.
8. Summarize assigned teams for a supervisor with filters and drill-down.
9. Enforce input validation, roles, ownership, deadlines, and concurrency rules on the backend.
10. Test and deploy the same application throughout Labs 5–7 and keep its review and release history.

### 2.2 Outside the Baseline Scope

The baseline excludes file upload and storage, grading, plagiarism detection, AI grading, chat, payments, email and push notifications, LEB2 and Google Drive API integrations, self-registration, password recovery, and multi-course support. URL submission requires no account access to the destination service. The backend leaves submitted URLs unfetched.

The baseline uses two roles. The system operator provisions accounts and supervisor assignments through controlled seeds. In Sprint 2, supervisors can create teams they own and manage their members. Team ownership remains with the assigned supervisor.

The course requires a two-person development team. Application teams can have any number of members. A student can belong to one team.

## 3. Users and Permissions

| Action | Student | Supervisor | Unauthenticated user |
|---|---|---|---|
| Sign in | Own account | Own account | Allowed |
| View current user or sign out | Own session | Own session | Current user returns 401. Sign-out clears the cookie and can complete. |
| View teams, members, and milestones | Own team | Assigned teams | Denied |
| Create, edit, or cancel a milestone | Denied | Assigned teams, subject to history rules | Denied |
| Submit work or a revision | Member of the team that owns the milestone | Denied | Denied |
| Read submissions and feedback | Own team | Assigned teams | Denied |
| Write feedback | Denied | Assigned teams | Denied |
| Create a team or manage members (S2) | Denied | Own teams. Select students who have no team. | Denied |
| View progress (S2) | Own team | Assigned teams | Denied |
| View multi-team summary (S3) | Denied | Assigned teams only | Denied |

The backend enforces every permission. Hiding a control is a UI behavior. List, detail, mutation, and aggregate requests must use the same authorization scope. The session determines the actor's identity and role regardless of URL and JSON input.

## 4. Primary User Journeys

### 4.1 Sprint 1 — Set a Milestone, Submit Work, and Receive Feedback

1. Seed supervisor-A/B, student-A1/A2/B1, and team-A/B. Assign A1/A2 to team-A and B1 to team-B.
2. Supervisor-A signs in and selects team-A.
3. Create the “Engineering Baseline” milestone with a description and a future deadline.
4. Student-A1 signs in, sees the team-A milestone, and enters a title, description, and link.
5. The backend validates the session, membership, input, and deadline, then saves submission version 1 in a transaction.
6. Open the saved submission through a new GET request and verify that a refresh shows the same data.
7. Supervisor-A opens the submission and adds feedback.
8. Student-A1 or A2 opens the submission and reads the feedback tied to the same submission ID.
9. Restart the application with the database intact and verify that the submission and feedback are still present.

### 4.2 Rejection Cases to Demonstrate

- A submission after the deadline returns 409 `DEADLINE_PASSED` and creates no row.
- A second Sprint 1 submission returns 409 `ALREADY_SUBMITTED` and leaves the original submission intact.
- A student calling a milestone creation or feedback endpoint receives 403.
- Student-B1 or Supervisor-B opening a team-A submission receives a generic 404 without team-A data.
- A missing or expired session returns 401.
- An invalid URL or blank field returns 400 with a field error.
- Reusing the old cookie after sign-out returns 401.

### 4.3 Sprints 2 and 3

Supervisors create teams, select members before submissions begin, and plan and update milestones that have no submissions. Students can submit revisions before the deadline and open previous versions. The UI reflects feedback on a new version in that version's status and retains earlier feedback in the history.

The progress board shows each milestone and the percentage submitted. The supervisor summary aggregates only assigned teams, supports team and status filters, and links counts to the underlying results.

## 5. SRS — fastTrack Requirements

### 5.1 Functional Requirements

| ID | Observable behavior | Feature | Sprint |
|---|---|---|---|
| FR-01 | Sign in, retrieve the current user, and sign out using an authenticated identity | F-01 | 1 |
| FR-02 | View teams, members, and milestones within the actor's scope | F-01, F-02 | 1 |
| FR-03 | A supervisor can create a milestone with a title, description, and `dueAt` and retrieve it afterward | F-02 | 1 |
| FR-04 | A student can submit a title, description, and URL and retrieve the saved submission | F-03 | 1 |
| FR-05 | A supervisor can append feedback, and team members can read it for the corresponding submission | F-04 | 1 |
| FR-06 | A supervisor can create or rename a team and manage membership under the history rules | F-05 | 2 |
| FR-07 | A supervisor can edit plans and deadlines or cancel milestones that have no submissions | F-05 | 2 |
| FR-08 | Create a revision while retaining all earlier versions and feedback | F-06 | 2 |
| FR-09 | View an authorized team's progress board with statuses and a completion percentage | F-07 | 2 |
| FR-10 | A supervisor can view, filter, and drill into a summary of assigned teams | F-08 | 3 |

### 5.2 Business Rules and Test Boundaries

| ID | Baseline design rule |
|---|---|
| BR-01 | Each account has one role. Each student belongs to at most one team. Each team has one supervisor. |
| BR-02 | Students access their own team and supervisors access assigned teams. Every query and mutation checks scope against the database. |
| BR-03 | Supervisors alone can create milestones and feedback. Only student members of the team can submit work. |
| BR-04 | Accept work when the database time captured after acquiring the lock satisfies `acceptedAt <= dueAt`. Reject later submissions. Store UTC and display Asia/Bangkok time. |
| BR-05 | Sprint 1 allows one version 1 submission per milestone. Duplicate or concurrent requests create no extra rows. |
| BR-06 | Sprint 2 revisions increment the version atomically and preserve earlier versions. Feedback references the submission ID of the version it concerns. |
| BR-07 | Feedback supports multiple append-only messages and is private to the team and its supervisor. It carries no grade or approval. |
| BR-08 | Validate after trimming. Title: 1–120 characters. Description and feedback: 1–4,000 characters each. A complete HTTP or HTTPS URL has at most 2,048 characters. |
| BR-09 | Once a submission exists, the milestone cannot be edited or cancelled and membership is locked for the entire team. Preserve history and the assigned supervisor. |
| BR-10 | Progress is the number of non-cancelled milestones with at least one submission divided by all non-cancelled milestones. It measures submission completion. |

The deadline check uses the server's acceptance time inside the transaction. The browser's send time and the commit time are irrelevant to that check. The server determines `submittedAt`, `version`, and `submittedBy`. If a lock wait extends beyond the deadline, reject the request even when the user clicked Submit before the deadline.

**Time and input across layers** — `dueAt` and `submittedAt` use millisecond precision. Timestamps must include an offset and may have up to three fractional second digits. Otherwise return 400. Read `acceptedAt` once in the transaction and store it in `submissions.submitted_at` without reading the clock again between validation and insertion. An HH:mm selection uses seconds `00`. Detail screens and rejection messages display seconds, for example 23:59:00 (Asia/Bangkok). The form helper explains this default.

Count Unicode code points after trimming text with a length limit. Use the same utility and cases on the client and server. Preserve passwords and submission content without trimming passwords or automatically normalizing submission content. URLs must parse, have a hostname, use HTTP or HTTPS, and contain no username or password. The system validates the URL format. Submitters check access to the destination.

**Sprint 2 details** — A new team can have zero members and shows an empty state. Supervisors can select only students with no current team. The picker displays IDs and names and omits email addresses, passwords, and other teams' histories. If two requests add the same student to different teams, the database constraint rejects one. Teams can still be renamed after submissions exist because the team ID and ownership stay the same.

For a milestone with no submission or cancellation, a supervisor can change the title, description, or `dueAt`. A new deadline must be in the future. Cancellation preserves the row. A cancelled milestone accepts no submissions and remains terminal in this baseline. A team with previous submissions can receive a new milestone because its existing history stays intact.

**Sprint 2 concurrency** — A revision sends the `expectedVersion` from the current view. If it is no longer the latest version, return 409 `VERSION_CONFLICT` and ask the user to reload before retrying. This protects a teammate's submission and makes the new version visible before another revision. Update the F-03 and F-06 contracts when Sprint 2 begins.

**Allowed state transitions** — An active milestone with no submission can receive its first submission and later revisions, or it can be cancelled. Cancellation is terminal. Supervisors can add feedback before or after the deadline and can comment on older versions. The same deadline governs revisions, with no grace period or approval workflow. `PENDING`, `OVERDUE`, `SUBMITTED`, and `FEEDBACK_AVAILABLE` are derived states. `cancelledAt` is stored.

### 5.3 Non-Functional Requirements

| ID | Objective or verification criterion | Verification |
|---|---|---|
| NFR-01 | Store password hashes. Reject invalid, expired, or revoked sessions. Keep passwords, password hashes, and raw authentication tokens out of responses and logs. Return CSRF tokens only in the designated authentication responses. | Sprint 1 API and database checks, with review every sprint |
| NFR-02 | Every protected endpoint denies unauthorized reads and writes, including list and summary requests. | Negative API matrix for S1–S3 |
| NFR-03 | Committed submissions and feedback remain readable after restart and, from Lab 5 onward, after redeployment. | System and deployment checks |
| NFR-04 | A clean checkout can install, migrate, seed, build, run, and test using the README without machine-specific source edits. | Sprint 1 and final reproduction |
| NFR-05 | Forms show loading, errors, and success. Invalid fields have explanations, and empty states are clear. Internal errors and stack traces stay private. | Selected UI/E2E cases and manual inspection |
| NFR-06 | A failed required CI check blocks release. The main commit matches the image and deployed release, and smoke checks pass. | Lab 5 onward and final verification |

The team has not agreed on a performance SLA or recorded performance measurements. Report latency and test results only after measurement.

## 6. Feature Inventory and Development Plan

| Feature | Scope | Dependencies | Completion outcome |
|---|---|---|---|
| F-01 — Identity & team context | Login/logout/me, scoped teams/membership | Schema/seed | Both roles use real sessions and read only their authorized scope. |
| F-02 — Milestones | Create, list, and view milestones | F-01 | Supervisors can create milestones and retrieve their stored values. |
| F-03 — First submission | Initial submission, deadline, duplicate protection, and persisted detail | F-01/F-02 | The system records the correct actor and team and rejects invalid submissions. |
| F-04 — Feedback | Write and read feedback for a submission | F-01/F-03 | Feedback stays linked to the correct submission and within its team scope. |
| F-05 — Team & milestone planning | Create and rename teams, manage members, and edit or cancel milestones | F-01–04 | Teams can plan work before submissions begin while preserving history. |
| F-06 — Revisions | Version history, expectedVersion, and feedback association | F-03/F-04 | Earlier versions remain readable and concurrent requests cannot cause lost updates. |
| F-07 — Progress board | Team status and progress | F-05/F-06 | Statuses and progress calculations match stored data. |
| F-08 — Summary | Scoped aggregates, filters, and drill-down | F-07 | Supervisors can track multiple assigned teams within their scope. |

| Sprint | Features / Goal | Checkpoint |
|---|---|---|
| 1 | F-01–F-04: Complete the real workflow for both roles, including database persistence, deadlines, access control, tests, and a reviewed release. | Deliverable 1, 8 November 2026 at 23:59 |
| 2 | F-05–F-07: Complete the core expansion and run Sprint 1 regression tests. | Complete before D2, 29 November 2026 at 23:59 |
| 3 | F-08, integration, error handling, UAT fixes, and final verification | At least one working and tested workflow or rule by 29 November. Complete by 13 December 2026 at 23:59. |

The proposed internal plan completes Sprint 2 before the D2 checkpoint to allow time for working F-08 functionality. Demonstrate executable Sprint 3 progress beyond screens or contracts alone. Aim to finish core work before the 1–11 December exam period.

### 6.1 Internal Delivery Plan and Capacity Estimate

The dates below are the initial estimates from 5 November. For current sequencing and ownership, use sections 5–8 and 12 of the **[Sprint 1 workflow](../workflow/01_SPRINT1_D1.md)**, which revise the scaffold and schema dependencies and the 6–8 November plan. Reassess remaining capacity before starting while retaining the assignment deadline and required scope.

| Target period | Work and checkpoint | Proposed owner |
|---|---|---|
| 5 November | Freeze Sprint 1 contracts and response schemas, set up the repo and seeds, and start F-01. | A leads authentication. B prepares the F-02 contract, database, and UI. Both review. |
| 6 November | Integrate F-01 and F-02. Test valid and invalid sign-in and milestone scope. | A and B review each other's work. |
| 7 November | Integrate F-03 and F-04. Test the normal journey, deadlines, and access. | A leads F-03. B leads F-04 after agreement on the submission schema. |
| 8 November | Run regression, restart, and clean setup checks. Complete peer review, the main release, evidence, and PDF. | Both. Reserve time to assemble evidence before the deadline. |
| 9–15 November | Deliver Lab 5. Prepare the F-05 contract and start expanding once the Sprint 1 release is stable. | Alternate deployment and feature responsibilities. |
| 16–22 November | Implement F-05 and F-06, conduct independent UAT and fixes, and select maintenance work under Lab 7 rules. | Both. Keep the test version separate from features under development. |
| 23–24 November | Finish F-07, obtain an accepted Sprint 2 release, and run Sprint 1–2 regression tests. | Both |
| 25–28 November | Build and test the working F-08 workflow. Prepare Lab 7 evidence and the D2 candidate. | Divide feature and QA work and review each other's work. |
| 29 November | Deploy the candidate and submit D2 and Lab 7. | Both |
| 30 November–13 December | Finish remaining work within the agreed scope. Complete final UAT, retests, video, and release while allowing for exams. | Confirm actual availability before accepting the plan. |

Initial Sprint 1 estimates in person-hours are setup and authentication 6–8, milestones 6–8, submissions and deadline rules 8–12, feedback 5–7, integrated QA 8–12, and review, evidence, and PDF 5–7. The **38–54 person-hour total** is a planning estimate before a 20% contingency. The two team members would need about 46–65 person-hours combined during 5–8 November to make this plan viable.

Team availability is still unknown, so **Sprint 1 carries a high schedule risk**. Defer optional functionality until the main journey passes. If work falls behind, cut unnecessary visual polish and report outstanding scope accurately. Keep authentication, access, and domain tests in scope and disclose any work that moves to a later sprint.

The labs use the same application and repository. Lab 5 covers Docker, CI/CD, and GCP (15 November). Lab 6 covers independent UAT and defects (22 November). Lab 7 covers approved maintenance and metrics (29 November). A deadline grace period is only a candidate for future maintenance after the original system works and the assignment's approval process is complete. Unfinished baseline features remain baseline work.

## 7. System-Level Design

### 7.1 Architecture and Technology

Use a **modular monolith** with distinct frontend, API/application, and database responsibilities in one repository. This fits a two-person team and workflows that share the same data.

```mermaid
flowchart LR
    S[Student / Supervisor] --> WEB[React + TypeScript]
    WEB -->|JSON + session cookie| API[Express API]
    API --> AUTH[Session / Role / Scope]
    AUTH --> APP[Domain services]
    APP --> ORM[Prisma / Transactions]
    ORM --> DB[(PostgreSQL)]
```

| Layer | Proposed choice | Responsibility |
|---|---|---|
| Frontend | React + TypeScript + Vite | Forms, routing, status, error states |
| Backend | Node.js + Express + TypeScript | Auth, validation, domain rules, API |
| Database | PostgreSQL + Prisma | Relations, migrations, transaction, constraints |
| Unit/API tests | Vitest + Supertest | Business rules and real API/database integration |
| Browser tests | Playwright | Critical journeys and UI behavior |
| Delivery | Docker, GitHub Actions, GCP | Traceable builds, tests, and deployment |

The stack follows the approach in the Lab 5 starter. TokTickIT serves as a reference example. fastTrack uses its own source, dependency versions, and lockfile. Build and compatibility results require implementation and verification.

### 7.2 Proposed Module Boundaries and Structure

```text
Project_code/               # Application source
  README.md                 # Verified setup, run, and test instructions once the app exists
  client/
    src/
      app/                  # router, authenticated layout
      features/             # auth, teams, milestones, submissions, feedback, progress
      components/           # shared forms, status badges, error states
      lib/                  # API client / date formatting
  server/
    src/
      modules/              # auth, teams, milestones, submissions, feedback, reports
      middleware/           # session, role, CSRF, validation, error handling
      db/                   # database client / transaction helpers
    prisma/                 # schema, migrations, synthetic seed
    tests/                  # unit and API/database integration
  e2e/                      # browser workflows
  docs/
    contracts/              # feature SDS, AC, STS, revision history
    evidence/               # actual test/demo/release evidence
    decisions/              # ADR / scope changes

Project_doc/
  project_detail.md         # This design document
```

This tree represents the proposed structure. API handlers manage HTTP requests and responses, services enforce business rules, and repositories implement scoped queries and transactions. The service remains authoritative for access decisions.

### 7.3 Data model

```mermaid
erDiagram
    USERS ||--o{ SESSIONS : authenticates
    USERS ||--o{ TEAMS : supervises
    USERS ||--o| TEAM_MEMBERS : joins
    TEAMS ||--o{ TEAM_MEMBERS : contains
    TEAMS ||--o{ MILESTONES : plans
    MILESTONES ||--o{ SUBMISSIONS : receives
    USERS ||--o{ SUBMISSIONS : submits
    SUBMISSIONS ||--o{ FEEDBACK : receives
    USERS ||--o{ FEEDBACK : writes
```

| Table | Main fields | Constraints and meaning |
|---|---|---|
| users | id UUID PK, email, display_name, password_hash, role, created_at | normalized email UNIQUE; role STUDENT/SUPERVISOR |
| sessions | id UUID PK, token_hash, csrf_token, user_id FK, expires_at, revoked_at | token_hash is UNIQUE. Store only the authentication token hash. csrf_token is a separate random synchronizer token. |
| teams | id UUID PK, name, supervisor_id FK, created_at | Name is 1–120 characters. The service checks the supervisor role. |
| team_members | team_id FK, student_id FK, joined_at | PK(team_id,student_id), UNIQUE(student_id). The service checks the student role. |
| milestones | id UUID PK, team_id FK, title, description, due_at, created_by FK, cancelled_at nullable, created_at | Timestamp with time zone. Title and description follow BR-08. |
| submissions | id UUID PK, milestone_id FK, submitted_by FK, version, title, description, url, submitted_at | UNIQUE(milestone_id,version), CHECK version >= 1; immutable |
| feedback | id UUID PK, submission_id FK, supervisor_id FK, client_request_id UUID, content, created_at | The FK identifies the exact submission. UNIQUE(supervisor_id,client_request_id) prevents duplicate retries. Content follows BR-08 and is append-only. |

Use RESTRICT on deletes for all domain foreign keys to preserve history. Index supervisor_id, team_id, milestone_id, submission_id, and session user and expiry fields as queries require. Resolve ownership from submission → milestone → team. The request body carries no redundant team ownership field.

**Grades, courses, and uploaded files are outside this baseline.** Derive progress and status from stored records to keep them consistent with submissions.

All required fields are NOT NULL except cancelled_at and revoked_at. Enforce the role with a database enum or check. The baseline has no role-change endpoint. Services and seeds check the roles behind supervisor and student foreign keys, and integration tests verify those checks. Foreign keys alone confirm identity references. Migrations also enforce text length limits and CHECK version >= 1.

**Schema evolution** — Include a version in submissions from Sprint 1 so Sprint 2 can add revisions while feedback keeps its original version reference. Keep migrations ordered and versioned. Treat migrations used in assessed releases as immutable. Before Sprint 2, test the migration on a database with Sprint 1 submissions and feedback and verify that existing IDs, versions, and associations remain intact.

### 7.4 Transactions, Membership, and Concurrent Requests

Submission transaction order is lock the team → lock the milestone → check membership and status → read the current database time after acquiring the locks → validate the deadline and version → insert → commit. Use this lock order in every related service to reduce deadlocks. Roll back the entire transaction on a rule violation or database error.

Membership changes use the same team lock and check that the team has no submissions before updating. This prevents a membership change from racing with a submission commit. A unique constraint covers concurrent requests to place the same student in different teams. Return 409 for the resulting conflict.

Sprint 1 uses `UNIQUE(milestone_id, version)` and the service always sets version = 1. Sprint 2 compares expectedVersion to the latest version under lock and creates latest+1. A stale request returns 409. For deadline boundary checks, use the database time after the lock wait and disregard browser and transaction-start times.

Check scope before locking, then recheck membership and rules inside the transaction. Every query in the operation uses the same transaction client, including raw SQL row locks if the selected ORM version requires them. Keep external HTTP calls outside the lock. Set a transaction timeout and map known constraint conflicts to domain errors without exposing SQL errors.

Read the actual time after locking, for example with PostgreSQL `clock_timestamp()`, and truncate to milliseconds once before validation and storage. `now()` reflects the transaction start and cannot capture a lock wait that crosses the deadline. [PostgreSQL Date/Time Functions](https://www.postgresql.org/docs/current/functions-datetime.html#FUNCTIONS-DATETIME-CURRENT)

After authentication, scope, and input validation, check cancellation first. Then check an existing first submission, or the revision's missing base or stale expectedVersion. Finally, check the deadline and insert. A duplicate after the deadline therefore still returns ALREADY_SUBMITTED. A late first submission with no existing record returns DEADLINE_PASSED.

Retry a confirmed rolled-back deadlock or serialization failure at most 3 times in total. Reread the clock and rules on every attempt. Return 503 TEMPORARILY_UNAVAILABLE if technical contention persists. Business rejections and unknown commit outcomes require their own recovery paths. Verify error mapping and transaction APIs against the pinned ORM version. [Prisma Transactions](https://www.prisma.io/docs/orm/fundamentals/transactions)

### 7.5 Session Lifecycle and Security Design

On sign-in, use a library to verify the password against its hash. Argon2id is proposed. Generate an opaque random token and store only its hash. Send the token in an `HttpOnly`, `SameSite=Lax` cookie with `Secure` over HTTPS. Sessions expire after an absolute 8 hours. The baseline has no refresh endpoint.

`GET /auth/me` reads identity from the session. Sign-out revokes the session in the database and clears the cookie. Reject expired, revoked, and unknown tokens. Mutations check the CSRF token and allowed Origin. Restrict the HTTP exception and its cookie settings to local development.

**Agreed bootstrap** — In local development, the browser reaches the backend at `/api` through the Vite proxy. Production uses one origin. The API accepts JSON only. Before a session exists, login requires `X-fastTrack-Request: 1` and an allowed source. Check Origin first, or the Referer origin if Origin is absent. Return 403 when both are absent or the origin differs. Disable wildcard credentialed CORS and simple form POST login. On successful credentials, issue new authentication and CSRF tokens and revoke any previous session attached to that browser cookie.

For authenticated mutations, compare `X-CSRF-Token` with `sessions.csrf_token` and apply the same origin check. Login and me return a CSRF token for in-memory frontend use. After reload, call me again. Keep the authentication token in the HttpOnly cookie. A session expires when `expiresAt <= server time`. Sign-out revokes the current session only. Without a session, sign-out checks the source origin, clears the cookie, and returns 204. [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html)

Use `Cache-Control: no-store` for authentication and private API responses. Clear the client query cache on sign-out and account change. Accept only internal app paths as login return destinations and recheck access to the destination.

Keep password hashes, system-wide email lists, and raw tokens out of unnecessary API responses. Keep credentials out of logs and leave passwords and role authority out of localStorage. Use parameterized database access, render descriptions and feedback as text, and use safe attributes for external links.

## 8. UI/UX — fastTrack ในธีมขาวดำ

### 8.1 Design brief และแนวคิดหลัก

ผู้ใช้หลักเป็นนักศึกษาที่ต้องส่งงานให้ทันเวลา และ supervisor ที่ต้องตรวจงานให้ถูกทีม/ถูก version หน้าจอแรกหลัง login จึงควรตอบว่า **“งานไหนต้องทำต่อ”** ด้วยชื่องาน กำหนดส่ง สถานะ และ action ที่ชัดเจน

แนวคิดภาพคือ **เส้นทาง milestone ของทีม**: นำวันส่ง ชื่องาน และสถานะมาจัดเป็นแถวตามเวลา มีเส้นแนวตั้งเชื่อมจุด milestone เพื่อให้เห็นเส้นทางของโครงงาน เป็นองค์ประกอบเด่นเพียงจุดเดียวของระบบ ใช้จุดทึบ/วงกลมโปร่ง/เครื่องหมายประกอบข้อความแยกสถานะ ส่วนแบบฟอร์มและ feedback ใช้พื้นผิวเรียบเพื่อให้อ่านเนื้อหาได้เต็มที่

ใช้สีขาวเป็นพื้นที่หลักและดำแท้เป็นจุดเน้น ปุ่มหลักกับงานที่กำลังดูมีน้ำหนักชัด ไม่ใช้สีอื่นใน chart, error, success หรือ focus และไม่เพิ่ม dark-mode toggle ใน scope ปัจจุบัน

### 8.2 แผนออกแบบและการทบทวนตาม SKILL_UI.md

| แกน | แบบที่เลือก | เหตุผลที่สัมพันธ์กับ fastTrack |
|---|---|---|
| Color | ขาว/ดำ/เทา 6 tokens ตาม 8.3 | ตรงคำขอผู้ใช้; แยกลำดับความสำคัญด้วย contrast และสถานะด้วยข้อความ |
| Type | Inter เป็นฟอนต์หลัก จับคู่ Noto Sans Thai สำหรับข้อความไทย | ตัวอักษรเรียบหรูแบบสไลด์ ใช้ hierarchy และพื้นที่ว่างทำให้ชื่องานเด่น และคงความอ่านง่ายของภาษาไทย |
| Layout | Sidebar เรียบ + milestone track; submission เป็นพื้นที่อ่านงานพร้อม feedback rail | แสดงลำดับการส่งงานและความสัมพันธ์งาน/คำแนะนำโดยตรง |
| Alignment | เนื้อหาและหัวข้อชิดซ้าย; วันที่จัดแนวเดียวกัน; จำนวนในตารางชิดขวา | สแกนชื่อ/กำหนดส่งและเปรียบเทียบยอดได้เร็ว |
| Identity | wordmark fastTrack น้ำหนัก 600 + เส้นทาง milestone | ใช้โครงสร้างของงานจริงเป็นเอกลักษณ์ |

**ทางเลือกที่พิจารณา:** dashboard แบบกล่องตัวเลขเท่ากันหลายใบให้ภาพรวม แต่ทำให้งานที่ต้องส่งถูกดันลง; แบบ milestone track ให้เห็นงานและ action โดยตรง จึงเลือกแบบหลัง ตัวเลข progress จะปรากฏเมื่อมีความหมายจริงใน S2 และอยู่ใต้หัวข้อของทีม ไม่ใช้เป็น hero ที่แย่งพื้นที่จากงาน

**ผลการทบทวน brief:** เปลี่ยน palette เดิมที่ใช้ navy/blue/สีสถานะเป็น monochrome ทั้งระบบ เปลี่ยนจากคำบรรยาย dashboard กว้าง ๆ เป็น layout ที่มีวันส่งและ version จริง ไม่ใช้เลข 01/02 ตกแต่งแถว เพราะ milestone ID ไม่จำเป็นต้องเป็นลำดับขั้น ใช้เลขเฉพาะ version ที่มีความหมาย เช่น “รุ่น 2” และลำดับในประวัติ

### 8.3 Color tokens — 6 สีหลัก

| Token | Hex | ใช้กับ |
|---|---|---|
| `paper` | `#FFFFFF` | canvas, form fields, พื้นผิวอ่านงาน และข้อความบนปุ่มดำ |
| `ink` | `#000000` | primary text, wordmark, primary button, focus ring, เส้น progress ที่เติมแล้ว |
| `wash` | `#F5F5F5` | hover row, selected background แบบอ่อน, feedback rail, disabled surface |
| `divider` | `#E5E5E5` | เส้นแบ่งกลุ่มข้อมูล/แถวและ progress track; ไม่ใช้เป็นขอบเดียวที่บอกว่ามี input |
| `muted` | `#595959` | secondary text, helper text, timestamp, placeholder ที่ยังอ่านได้ |
| `control` | `#8A8A8A` | input border, checkbox outline, ขอบปุ่มรองที่ต้องมองเห็น |

Primary text ใช้ ink บน paper/wash; secondary text ใช้ muted บน paper/wash; primary action ใช้ paper บน ink ห้ามลด opacity ของข้อความสำคัญเพื่อสร้าง hierarchy เส้น divider อ่อนใช้แบ่งกลุ่มเท่านั้น ขอบ interactive control ต้องใช้ control หรือ ink

เกณฑ์ตรวจตอน implementation: text ปกติ contrast อย่างน้อย 4.5:1; large text และ meaningful control boundaries อย่างน้อย 3:1 ทั้ง resting/hover/focus states ตรวจจากสีที่ render จริงรวม opacity ก่อนรับงาน

### 8.4 Typography, spacing และขนาด

**ทิศทางตัวอักษร: เรียบหรูแบบสไลด์ ใช้ Inter เป็นหลัก** หัวข้อมีพื้นที่หายใจ ใช้น้ำหนักปานกลางและระยะห่างที่เป็นระเบียบ ให้ความเด่นเกิดจากขนาด/พื้นที่ว่างมากกว่าตัวหนาหนักทุกตำแหน่ง

ใช้ font stack `Inter, "Noto Sans Thai", Tahoma, sans-serif`: Inter สำหรับชื่อ fastTrack, ข้อความอังกฤษ และตัวเลข; Noto Sans Thai สำหรับข้อความไทย ใช้ font files ภายในแอปเมื่อจัดเตรียม assets พร้อม `font-display: swap` และ fallback ที่อ่านได้ เลือกไฟล์/น้ำหนักที่ต้องใช้จริงคือ 400/500/600 เพื่อควบคุมขนาด assets

Wordmark และหัวข้อภาษาอังกฤษใช้ letter-spacing ประมาณ `-0.025em`; เนื้อหาและภาษาไทยใช้ `normal` ไม่บีบช่องไฟไทย ใช้ sentence case และไม่ใช้ monospace กับวันเวลา/labels

| บทบาท | Desktop / Mobile | Weight / line-height |
|---|---|---|
| Wordmark | 24px / 22px | 600 / 1.2; fastTrack เป็นข้อความเดียว ไม่เน้นบางคำคนละสี |
| Page title | 36px / 28px | 500 / 1.4; เว้นระยะด้านล่าง 24–32px ให้หัวข้อหายใจ |
| Section heading | 24px / 22px | 500 / 1.45 |
| Milestone title | 18px / 18px | 500 / 1.5 |
| Body/input/button | 16px / 16px | 400 หรือ 500 / 1.65 |
| Metadata/helper | 14px / 14px | 400 / 1.6 |

ข้อความยาวจำกัดประมาณ 60–75ch ไม่เกิน 80ch โดยประมาณและทดสอบกับภาษาไทยจริง Feedback และ description ใช้ line-height 1.75; ไม่ justify เนื้อหา วันเวลาและตัวเลขใช้ tabular numerals เมื่อฟอนต์รองรับ

Spacing scale: 4/8/12/16/24/32/48px; ระยะระหว่าง page sections 32px, label ถึง field 8px, field groups 24px Radius มีหน้าที่ต่างกัน: controls 8px, content surfaces ที่จำเป็น 12px, status capsule แบบ pill ไม่ใส่ shadow ให้ทุกกล่อง ใช้เส้นแบ่งและ whitespace เป็นหลัก; shadow จำกัด overlay/dialog

### 8.5 Application shell และ navigation

Desktop ตั้งแต่ 1200px: sidebar กว้าง 224px พื้นขาว ขอบขวา divider; content กว้างไม่เกิน 1184px มี padding 32px และจัดซ้ายภายในพื้นที่ที่เหลือ Header แสดง breadcrumb, ชื่อผู้ใช้/role และ logout; breadcrumb ใช้ชื่อที่อ่านรู้เรื่อง ไม่แสดง UUID

| Role | Navigation S1 | เพิ่ม S2 | เพิ่ม S3 |
|---|---|---|---|
| Student | ภาพรวม / ทีมของฉัน | ความคืบหน้า | ไม่มีเมนู supervisor summary |
| Supervisor | ภาพรวม / ทีมที่ดูแล | การจัดทีมผ่านหน้าทีม และความคืบหน้า | สรุปงาน |

Current navigation ใช้พื้น wash, label weight 600 และแถบดำด้านซ้าย ไม่ใช้สี accent Dropdown ทีมมีเฉพาะ supervisor ที่ดูแลหลายทีม; Student ใช้ทีมจาก session scope ไม่มี dropdown เปลี่ยน role

S1 dashboard ใช้ข้อมูลทีม/milestone ที่ API รองรับและลิงก์เข้ารายละเอียด ยังไม่มี progress percentage หรือ summary ข้ามทีมของ S2/S3 ซ่อนเมนูฟีเจอร์ที่ยังไม่ release ไม่แสดงปุ่มที่กดแล้วเป็นหน้าว่าง

### 8.6 Screen specifications และ wireframes

ตัวอย่างชื่อทีม/ผู้ใช้/งานใน wireframe เป็น synthetic content สำหรับออกแบบ ไม่ใช่ข้อมูลหรือภาพ execution จริง

#### A. Login — F-01 / Sprint 1

พื้นขาว หนึ่งคอลัมน์ form กว้างไม่เกิน 400px มี wordmark ด้านบนและหัวข้อ “เข้าสู่ระบบ” ข้อความสั้น “ติดตามงานส่งและคำแนะนำของทีม” แสดง email/password label ชัดเจน ปุ่มดำ “เข้าสู่ระบบ” เต็มความกว้าง ข้อความท้ายฟอร์ม “ใช้บัญชีที่รายวิชาเตรียมไว้” ไม่มี public registration CTA

```text
fastTrack

              เข้าสู่ระบบ
              ติดตามงานส่งและคำแนะนำของทีม

              อีเมล
              [ name@example.com              ]
              รหัสผ่าน
              [ ••••••••             แสดง     ]
              [          เข้าสู่ระบบ          ]

              ใช้บัญชีที่รายวิชาเตรียมไว้
```

Login invalid แสดง error ใต้หัวข้อ “อีเมลหรือรหัสผ่านไม่ถูกต้อง ตรวจสอบแล้วลองอีกครั้ง” รักษาค่า email; loading เปลี่ยนปุ่มเป็น “กำลังเข้าสู่ระบบ…” และ block double click; show-password button มี accessible label และไม่ส่ง form โดยไม่ตั้งใจ

#### B. Student overview — F-01–F-03 / Sprint 1

เปิดด้วยทีมและ milestone ที่ใกล้ถึงกำหนดที่สุดในรายการที่ยังส่งได้ ไม่ใช้ welcome banner ใหญ่ วางวันส่งด้านซ้าย จุดบนเส้น track ตรงกลาง และชื่องาน/สถานะ/action ด้านขวา รายการอื่นอยู่ถัดลงมาตามกำหนดส่ง งานที่เลยกำหนดและยังไม่ส่งแสดงในกลุ่ม “เลยกำหนด” ให้มองเห็นชัด แสดง absolute date เสมอ แม้มีคำว่า “พรุ่งนี้” ประกอบ

```text
+-------------------+----------------------------------------------------+
| fastTrack         | ภาพรวม                  มิน / นักศึกษา  ออกจากระบบ |
|                   |                                                    |
| ภาพรวม            | ทีม Orbit                                          |
| ทีมของฉัน         | งานที่ต้องส่ง                                      |
|                   |                                                    |
|                   |  08 พ.ย. 2026  o  Engineering Baseline              |
|                   |  23:59         |  ยังไม่ส่ง                         |
|                   |                |  [ ส่งงาน ]                         |
|                   |                |                                    |
|                   |  15 พ.ย. 2026  o  Deployment Checkpoint             |
|                   |  23:59            ยังไม่ส่ง                         |
|                   |                                                    |
|                   | งานที่ส่งแล้ว                                      |
|                   | Research Outline    รุ่น 1   มีคำแนะนำ  [เปิดงาน]   |
+-------------------+----------------------------------------------------+
```

เส้น track แทนกำหนดส่งของงานในทีม ไม่แปลว่างานก่อนหน้าต้องเสร็จก่อนงานถัดไป S1 รายการเกินกำหนดเป็นข้อความที่อ้าง dueAt; progress/status board เต็มรูปแบบเริ่ม S2

#### C. Supervisor overview — F-01/F-02/F-04 / Sprint 1

เริ่มด้วย “ทีมที่ดูแล” เป็น team rows แสดงชื่อทีมและสมาชิก เลือกทีมแล้วเปิด milestone workspace มี action “สร้างงานส่ง” อยู่กับบริบททีมเสมอ S1 ไม่สร้าง inbox ข้ามทีม/ตัวเลขรวมที่ต้องเพิ่ม workflow นอกแผน Summary และการกรองรวมอยู่ F-08 ใน S3

แต่ละทีมมี link เปิดรายละเอียด; ภายในทีมแสดงรายการ milestone และ submission ล่าสุดที่เปิดอ่านได้ เมื่อ supervisor เลือกงานที่มี submission ให้ action “เปิดงานและให้คำแนะนำ” ไม่ใช้คำว่า approve/ผ่าน เพราะระบบนี้ไม่มี grading/approval

#### D. Team workspace และ milestone detail — F-02/F-03

ส่วนหัวแสดงชื่อทีม สมาชิก และ supervisor; ด้านล่างเป็น milestone track เหมือน overview การสร้าง milestone เปิด dedicated form ชัดเจน เมื่อเปิด milestone ให้ชื่อ/รายละเอียดเป็นเนื้อหาหลัก มี deadline rail กว้าง 280px ด้านขวาในจอใหญ่ และสถานะพร้อม action เดียวที่เหมาะกับ role

```text
ทีม Orbit / Engineering Baseline

Engineering Baseline                     กำหนดส่ง
                                         8 พ.ย. 2026 23:59
จัดทำ SRS, System SDS และ                Asia/Bangkok (UTC+07:00)
แผน Sprint 1 ของโครงงาน                  o ยังไม่ส่ง
                                         [ ส่งงาน ]

งานที่ส่ง
ยังไม่มีสมาชิกส่งงานสำหรับ milestone นี้
```

หากส่งแล้ว rail เปลี่ยนเป็น “ส่งแล้ว / รุ่น 1 / [เปิดงานที่ส่ง]”; deadline ผ่านให้ปิด submit พร้อมข้อความเหตุผล; S2 จึงเพิ่ม “ส่งฉบับแก้ไข” เมื่อเงื่อนไขอนุญาต การดูรายการยกเลิกมี label ยกเลิก ไม่ลบจนผู้ใช้ตามประวัติไม่เจอ

#### E. Create milestone และ submission form — F-02/F-03

ใช้ form column ไม่เกิน 680px ชิดซ้าย label อยู่เหนือ field; milestone form มีชื่องาน รายละเอียด และวัน/เวลา/zone ที่ชัดเจน Submission form มี “ชื่อเรื่อง”, “รายละเอียด”, “ลิงก์งาน” พร้อม helper “ใช้ลิงก์ https:// หรือ http:// ที่ผู้ดูแลเปิดดูได้” แสดง deadline และทีมเหนือ form เพื่อลดการส่งผิดบริบท

ปุ่มเรียก action ตรงกันตลอด flow: “สร้างงานส่ง” → “สร้างงานส่งแล้ว”; “ส่งงาน” → “ส่งงานแล้ว” ไม่ใช้ปุ่มชื่อ Submit ลอย ๆ หลังสำเร็จ navigate ไป detail และอ่านค่าที่ persist จาก API พร้อมข้อความยืนยัน ไม่ใช้ client form state แทน saved data

แสดงจำนวนตัวอักษรใกล้ขีดจำกัด; invalid field มี border ink หนา 2px, icon เตือน และข้อความใต้ field เพื่อแยกจาก focused field ที่ใช้ outline ข้างนอก เมื่อ network ล้มเหลวรักษาค่าฟอร์ม; ถ้าผล POST ไม่แน่ชัดให้ GET ประวัติมาตรวจว่าบันทึกแล้วหรือยังก่อน retry ไม่สร้าง success ที่ไม่มีผลจาก server

#### F. Submission และ feedback — F-03/F-04

Desktop แบ่งเนื้อหางานประมาณ 2/3 กับ feedback rail 1/3; title/description/link เป็นพื้นที่อ่านหลัก ส่วน feedback แสดงผู้เขียน วันเวลา และเนื้อหาเรียงตามเวลา Heading ต้องระบุ “คำแนะนำสำหรับรุ่น 1” เสมอ ใน S2 version selector อยู่เหนือเนื้อหาและเปลี่ยน feedback ตาม submissionId ของ version ที่เลือก

```text
ทีม Orbit / Engineering Baseline / งานที่ส่ง

Engineering baseline v1              คำแนะนำสำหรับรุ่น 1
รุ่น 1   ส่งโดย มิน                   อ.กานต์   7 พ.ย. 2026 15:20
7 พ.ย. 2026 14:30 (Asia/Bangkok)      เพิ่มกรณีทดสอบสิทธิ์ข้ามทีม

รายละเอียดงานและลิงก์                [เขียนคำแนะนำ...              ]
[ เปิดลิงก์งาน ]                      [ บันทึกคำแนะนำ ]
```

Feedback form ปรากฏเฉพาะ assigned supervisor; student เห็นข้อความอย่างเดียว รุ่นเก่าแสดง notice “กำลังดูรุ่น 1; รุ่นล่าสุดคือรุ่น 2” พร้อม action “ดูรุ่นล่าสุด” Feedback รุ่นเก่าไม่ย้ายไปแสดงเป็น feedback ของรุ่นใหม่ และไม่ตั้งชื่อส่วนนี้ว่าคะแนน/ผลอนุมัติ

#### G. Team planning — F-05 / Sprint 2

สร้างทีมจาก supervisor overview; team settings แยกกลุ่ม “ข้อมูลทีม”, “สมาชิก”, “แผนงานส่ง” ใช้ list กับ inline actions ไม่ยัดเป็นตารางหลายการ์ด ปุ่มยกเลิก milestone เปิด confirmation ที่บอกชื่องานและผลกระทบชัดเจน ใช้ปุ่มดำ “ยืนยันยกเลิกงานส่ง” และปุ่มขาว “กลับไป” โดย focus เริ่มที่ทางเลือกกลับ

ทีมที่มีงานส่งแล้วแสดง notice “ทีมมีประวัติส่งงานแล้ว จึงเปลี่ยนสมาชิกไม่ได้” แต่ยังแก้ชื่อทีมได้ตาม BR-09 ไม่ทำให้ disabled ทั้งหน้า ส่วน milestone ที่มี submission แล้วไม่มี edit/cancel action และอธิบายเหตุผลข้างข้อมูล

#### H. Progress และ summary — F-07/F-08 / Sprint 2–3

Progress ของทีมเป็นแถบดำบนพื้นเทา พร้อมข้อความ “ส่งแล้ว 3 จาก 4 งาน — 75.0%” มี accessible value และนิยามว่าเป็นสัดส่วนการส่ง ไม่ใช้ radial chart ใหญ่หรือกราฟตกแต่ง

Summary S3 ใช้ตาราง: ทีม / ส่งแล้ว / ทั้งหมดที่นับ / ความคืบหน้า / ยังไม่ส่ง / เลยกำหนด; team/status filters อยู่เหนือรายการ ยอดที่กดได้มี link ชัดเจนและเปิดรายการที่อธิบายยอดนั้นได้ สำหรับ dataset ใหญ่ให้กรอง/แบ่งหน้าตาม contract ก่อน implementation ไม่สมมติว่าดึงทุก record มาไว้ browser

### 8.7 Screen inventory และ UI-to-feature mapping

| Screen / Route | Primary action ตาม role | States สำคัญ | Feature / Sprint |
|---|---|---|---|
| `/login` | เข้าสู่ระบบ | invalid credentials, loading | F-01 / S1 |
| `/dashboard` | Student: เปิดงานที่จะส่ง; supervisor: เลือกทีม | no assigned team, loading/error | F-01–03 / S1 |
| `/teams/:teamId` | supervisor: สร้างงานส่ง; student: เปิด milestone | no milestones, scoped access | F-01/F-02 / S1 |
| `/teams/:teamId/milestones/new` | สร้างงานส่ง | invalid fields/date, save error | F-02 / S1 |
| `/milestones/:id` | ส่งงาน / เปิดงานที่ส่ง | not submitted, duplicate, deadline passed | F-02/F-03 / S1 |
| `/milestones/:id/submit` | ส่งงาน | validation, loading, uncertain response | F-03 / S1 |
| `/submissions/:id` | supervisor: บันทึกคำแนะนำ; student: เปิดลิงก์งาน | no feedback, scope denied | F-03/F-04 / S1 |
| `/teams/:id/settings` | บันทึกชื่อทีม / จัดสมาชิก | history locked, concurrent assignment | F-05 / S2 |
| Version selector / revision form | ดูรุ่นล่าสุด / ส่งฉบับแก้ไข | old version, stale version, due passed | F-06 / S2 |
| `/teams/:id/progress` | เปิดงานตามสถานะ | zero denominator, cancelled | F-07 / S2 |
| `/summary` | กรอง / เปิดรายการต้นทาง | no match, out-of-scope filter | F-08 / S3 |

### 8.8 Component behavior และสถานะขาวดำ

| Component / State | Appearance | Interaction / Meaning |
|---|---|---|
| Primary button | ink background/paper text, radius 8px, min-height 44px | หนึ่ง primary action ต่อส่วนงาน; hover ใช้ inset paper line โดยคง contrast |
| Secondary button | paper, ink text, control border | กลับ/ยกเลิก/เปิดรายละเอียดรอง; hover wash |
| Text link | ink พร้อม underline | ลิงก์ในเนื้อหาคง underline; focus outline ชัด |
| Input | paper, ink text, control border | focus ink 2px outline + offset 2px; labels ไม่หายเมื่อพิมพ์ |
| Pending | open-circle icon + “ยังไม่ส่ง” | label ดำบนขาว; ไม่เรียกงานที่ยังไม่ถึงกำหนดว่า error |
| Submitted | check icon + “ส่งแล้ว” | wash background; text บอกสถานะครบ |
| Feedback available | message icon + “มีคำแนะนำ” | แสดงจำนวนของ version นั้นเมื่อมีข้อมูล |
| Overdue / error | warning icon, ink border/left rule, ข้อความอธิบาย | ไม่พึ่งสีแดง; error ผูก field และมีวิธีแก้ |
| Cancelled | crossed-circle icon + “ยกเลิกแล้ว” | muted label ที่ยัง contrast ผ่าน; รายละเอียดอ่านได้ |
| Success | check icon + ข้อความ เช่น “ส่งงานแล้ว” | ยืนยันจาก server; inline notice และ live announcement |
| Disabled / loading | wash background, muted label และคำอธิบาย | loading มีข้อความและ aria-busy; ไม่ใช้ opacity ลดทั้ง control จนอ่านไม่ออก |

Status icon เป็น SVG แบบ stroke เดียวกันประมาณ 1.75px ขนาด 16–20px ไม่ใช้ emoji หลากสี Icons ที่มีข้อความซ้ำตั้ง decorative; icon-only buttons ต้องมี accessible name และ hit area อย่างน้อย 44×44px

### 8.9 Empty, error และ recovery copy

| Situation | ข้อความที่แสดง | สิ่งที่ทำต่อได้ |
|---|---|---|
| Student ยังไม่มีทีม | “บัญชีนี้ยังไม่ได้รับการจัดทีม ติดต่อผู้ดูแลรายวิชา” | ดูข้อมูลบัญชี / ออกจากระบบ; ไม่มี CTA สร้างทีม |
| Supervisor ไม่มีทีม | S1: “ยังไม่มีทีมที่คุณดูแล”; S2 เพิ่ม “สร้างทีมเพื่อเริ่มกำหนดงานส่ง” | S1 แนะนำตรวจ assignment; S2 สร้างทีม |
| ทีมไม่มี milestone | “ทีมนี้ยังไม่มีงานส่ง” | Supervisor: สร้างงานส่ง; student: รอผู้ดูแลกำหนด |
| ยังไม่มี feedback | “ยังไม่มีคำแนะนำสำหรับงานรุ่นนี้” | Supervisor เห็น form; student เห็นสถานะรอ |
| Deadline passed | “เลยกำหนดส่ง 8 พ.ย. 2026 23:59 (Asia/Bangkok) แล้ว จึงส่งงานไม่ได้” | เปิดรายละเอียดงาน; ไม่แสดง retry submit |
| Invalid URL | “ใช้ลิงก์ที่ขึ้นต้นด้วย https:// หรือ http://” | คงค่าฟอร์มและ focus field |
| Stale revision (S2) | “มีเพื่อนส่งรุ่นใหม่แล้ว เปิดรุ่นล่าสุดก่อนส่งฉบับแก้ไข” | ดูรุ่นล่าสุด; รักษาร่างปัจจุบันในหน้าเพื่อให้คัดลอกได้ |
| Network failure | “เชื่อมต่อไม่สำเร็จ ข้อมูลที่กรอกยังอยู่ในหน้านี้” | ตรวจสถานะล่าสุดก่อน retry mutation |
| Session expired | “เซสชันหมดอายุ เข้าสู่ระบบอีกครั้ง” | Login แล้วกลับ route เดิมเมื่อยังมีสิทธิ์ |
| 404 / out of scope | “ไม่พบรายการนี้ หรือบัญชีนี้ไม่มีสิทธิ์เข้าถึง” | กลับทีม/ภาพรวม; ไม่เผยชื่อทีมอื่น |

กรณีออกจากระบบ/หมดอายุ session ต้องไม่เก็บ private draft ข้าม account แบบอัตโนมัติ หากจะเก็บร่างถาวรต้องออกแบบแยกภายหลัง ส่วน error ทั่วไปขณะ session ยัง valid ให้รักษาร่างใน memory ของหน้าปัจจุบัน

### 8.10 Responsive, accessibility และ motion

- **1200px ขึ้นไป:** sidebar + content; milestone/submission detail ใช้ main/rail; line length จำกัดตาม 8.4
- **768–1199px:** sidebar เป็น drawer เปิดจากปุ่มเมนู; detail stack rail เมื่อพื้นที่อ่านไม่พอ; row actions ไม่บังชื่อ/วันส่ง
- **320–767px:** page padding 16px; layout หนึ่งคอลัมน์; วันที่ใน milestone row ย้ายเหนือ title; feedback อยู่หลังเนื้อหางาน; ปุ่มหลักเต็มความกว้างของ form
- ตาราง summary ใช้ semantic table ที่เลื่อนใน container ได้ พร้อมคำแนะนำการเลื่อน; ทั้งหน้าไม่เกิด horizontal overflow และรายการหลักไม่บังคับ swipe เพื่ออ่านชื่องาน
- ใช้ headings ตามลำดับ, landmark, skip link, visible labels และ keyboard focus; feedback/date/status ต้องอ่านผ่าน screen reader ได้
- Validation ใช้ `aria-invalid`/`aria-describedby`; focus ไป error summary/field แรกเมื่อ submit ผิด; success ใช้ polite live region, blocking errors ใช้ alert ตามความเหมาะสม
- Drawer/dialog trap focus, Escape ปิด, คืน focus ไปปุ่มที่เปิด; ไม่ใช้ hover เป็นทางเดียวในการเข้าถึง action
- Motion มีเฉพาะตอบการกระทำ เช่น drawer 160ms หรือ feedback ใหม่แสดงทันทีหลังบันทึก; ไม่มี page-load stagger, parallax หรือ progress/countdown ที่วิ่งเอง เมื่อ `prefers-reduced-motion` เปิด ให้ตัด transition ที่ไม่จำเป็น

### 8.11 UI acceptance และ design review ก่อนรับ implementation

| Check | เกณฑ์ผ่าน / วิธีตรวจ | เชื่อม verification |
|---|---|---|
| Monochrome | tokens/components/charts/status ทั้งหมดใช้ขาวดำเทา; ไม่มีสีตกค้างจาก theme เดิม | UI inspection / token audit |
| Role correctness | Student ไม่มี supervisor actions; backend cases ยังปฏิเสธแม้เรียก API ตรง | AC-02.2, AC-03.5, AC-04.2 |
| Workflow clarity | Login → milestone → saved submission → feedback ครบและ action ใช้คำตรงกัน | T-21 และ F-01–04 |
| Persistence / version | Refresh อ่านงานเดิมจาก DB; selector ผูก feedback ถูก version | T-09/T-17/T-20; S2 history tests |
| Contrast / keyboard | text 4.5:1, control 3:1, focus ชัดทุก state; form/dialog ใช้ keyboard ได้ | NFR-05 / accessibility check |
| Responsive | ตรวจ 320, 390, 768, 1280, 1440px และ browser zoom 200%; ไม่มี text/action ถูกตัด | screenshot/manual inspection |
| Error recovery | invalid/expired/deadline/duplicate/network states มีทางไปต่อ ไม่แสดง success เท็จ | T-02/T-04/T-08/T-11/T-13/T-15/T-19 |
| Scope discipline | S1 ไม่มี progress/summary/revision buttons ที่ยังไม่ทำ; navigation ตรง release scope | Sprint acceptance review |

เมื่อมี UI implementation ให้จับภาพหน้าที่มีข้อมูลจริงและทุก critical state แล้ววิจารณ์ว่า element ใดแย่งความสนใจจากชื่องาน/กำหนดส่ง/feedback ก่อนลดสิ่งตกแต่งที่ไม่ช่วยใช้งาน Wireframes ในเอกสารนี้เป็นแบบออกแบบ ยังไม่มี screenshots หรือ visual verification ของแอปที่รันจริง

### 8.12 Responsive clarity refinement

The user-requested R1-A-UI-POLISH refinement preserves the six colors, bundled typography, milestone track and role scope above. Shared controls use 8px corners, visible control borders, at least 44px targets and 16px input text. Disabled controls keep readable text rather than fading the entire element. Status badges pair a consistent stroke icon with text; overdue text stays readable without a strike-through.

The content canvas remains left aligned internally and uses equal outer margins within its 1184px maximum width on wider screens. Team boundaries and reading rails use restrained 12px frames; due dates, milestone groups, form actions and feedback entries have clear separators. The desktop login frame contains a form no wider than 400px and becomes an unframed column on mobile. Shadows are reserved for the navigation overlay. Multiple supervisor teams can share balanced columns when space permits; a single team fills the available row.

Creating a milestone opens with a task-specific page heading and fields rather than repeating the team roster. Mobile primary form actions fill their container. The navigation dialog announces its expanded state, cycles Tab and Shift+Tab, closes with Escape, returns focus to its trigger and closes when resized to desktop. Private-session masking and draft/recovery rules remain unchanged. Browser verification and its actual limitations are recorded in [the UI refinement handoff](../Project_code/docs/evidence/R1-A-UI-POLISH.md); this design specification alone is not a verification result.

### 8.13 Sprint 2 status colors and responsive review

The Sprint 2 UI uses white surfaces and navigation, a #FAFAFA workspace, #F3F4F6 for softly shaded areas, and #E5E7EB and #D1D5DB for edges and dividers. Text uses #1E2229 and gray, with near-black primary actions and progress indicators. Status chips have light-gray backgrounds. Green identifies submitted work, blue identifies feedback, amber identifies pending work, and red identifies overdue work, validation errors and destructive confirmation. Cancelled work uses a neutral label. Status text and icons carry the meaning independently of color.

Team cards provide direct links to the workspace and progress. The progress screen groups the percentage, meter and refresh action. Milestone rows place the title and status before the actions. The header and workspace content share their horizontal alignment. Phones use a compact branded app bar, a keyboard-accessible menu, and full-width primary form controls. At narrow widths, breadcrumb links have at least 44px tap targets. Selecting the Teams destination closes the drawer and moves focus to the team list or its empty or recovery state. Sign-in and work with feedback stack on phones and portrait tablets. Wider tablets and desktop screens can show both columns side by side. The existing Inter and Noto Sans Thai typography and Asia/Bangkok deadline display carry through the design.

## 9. API design

### 9.1 Common contract

Prefix `/api`; JSON camelCase; UUID identifiers; ISO 8601 timestamps พร้อม offset; UI แสดง Asia/Bangkok ทุกจุดที่เกี่ยวกับ deadline Success `{ "data": ... }`; error `{ "error": { "code": "...", "message": "...", "fields": {} } }` Logout ใช้ 204 ไม่มี body

| HTTP | Policy |
|---|---|
| 400 | invalid payload/UUID/field หรือส่ง identity field ที่ไม่รับ |
| 401 | no/invalid/expired/revoked session หรือ invalid credentials |
| 403 | role ไม่อนุญาต หรือ CSRF ไม่ผ่าน |
| 404 | record ไม่พบหรืออยู่นอก scope; ใช้ response ทั่วไปเหมือนกัน |
| 409 | deadline, duplicate, stale version, membership conflict, history lock, cancelled milestone |
| 415 | content type ที่ไม่รองรับ เช่น simple form POST แทน JSON API |
| 500 | ข้อผิดพลาดภายใน คืน request ID/ข้อความทั่วไป ไม่เผย SQL/stack trace |
| 503 | DB unavailable หรือ technical transaction contention ที่ retry ครบแล้ว |

ลำดับตรวจโดยทั่วไป session → role → input shape → record scope → domain rule → write ไม่คืน rule-specific errors ของ record ต่างทีมเพราะจะเปิดเผยข้อมูล ชื่อ/role/author/time ที่ authoritative สร้างจาก server

### 9.2 Sprint 1 endpoints

| Method / Path | Request | Success body ภายใน data | Actor / Validation |
|---|---|---|---|
| POST `/auth/login` | `{email,password}` | `{user:{id,displayName,role},csrfToken}` + session cookie | email/password required; invalid credentials ใช้ข้อความเดียวกัน |
| GET `/auth/me` | cookie | `{user:{id,displayName,role},csrfToken}` | session valid |
| POST `/auth/logout` | cookie + CSRF เมื่อมี session | 204 | revoke current session |
| GET `/teams` | — | scoped team array | Student/Supervisor |
| GET `/teams/:id` | — | team, supervisor, members | scoped read |
| GET `/teams/:id/milestones` | — | milestone array | scoped read |
| POST `/teams/:id/milestones` | `{title,description,dueAt}` | created milestone, 201 | assigned supervisor; dueAt อยู่อนาคต |
| GET `/milestones/:id` | — | milestone | scoped read |
| POST `/milestones/:id/submissions` | `{title,description,url}` | submission version 1, 201 | student team; deadline/duplicate/input |
| GET `/milestones/:id/submissions` | — | submission array | scoped read; S1 ไม่เกินหนึ่งรายการ |
| GET `/submissions/:id` | — | submission พร้อม author/time/version | scoped read |
| POST `/submissions/:id/feedback` | `{content,clientRequestId}` | created feedback, 201; same-request replay 200 | assigned supervisor; retry policy 9.5 |
| GET `/submissions/:id/feedback` | — | feedback array | scoped read; createdAt/id order |

ตัวอย่าง request/response สำหรับออกแบบ ไม่ใช่ผลเรียก API จริง:

```json
{
  "title": "Engineering baseline v1",
  "description": "SRS, System SDS และ Sprint 1 contracts ของทีม",
  "url": "https://example.com/team-a/baseline"
}
```

```json
{
  "error": {
    "code": "DEADLINE_PASSED",
    "message": "เลยกำหนดส่งงานแล้ว",
    "fields": {}
  }
}
```

### 9.3 Later endpoints — ต้องทำ contracts ก่อน implementation

| Feature | API responsibility ที่เสนอ | กฎสำคัญ |
|---|---|---|
| F-05 | POST `/teams`, PATCH `/teams/:id`, GET `/students/available` | Supervisor; สร้างทีมโดย supervisorId มาจาก session; candidate list ให้เฉพาะข้อมูลขั้นต่ำ |
| F-05 | POST `/teams/:id/members` `{studentId}`, DELETE `/teams/:id/members/:studentId` | scope + membership uniqueness + team history lock |
| F-05 | PATCH `/milestones/:id`, POST `/milestones/:id/cancel` | scoped supervisor; no submissions; no hard-delete |
| F-06 | POST `/milestones/:id/revisions` `{title,description,url,expectedVersion}` | ต้องมี version เดิม; student scope; deadline; atomic version |
| F-07 | GET `/teams/:id/progress` | scoped aggregates; BR-10 |
| F-08 | GET `/summary?teamId=...&status=...` | supervisor scope intersect filters; invalid filters 400; team นอก scope 404 |

### 9.4 Response models ที่หน้าจอต้องใช้

ชื่อ fields ต่อไปนี้เป็น contract สำหรับ implementation ไม่ใช่ข้อมูลที่ API คืนได้แล้ว ใช้ DTO allowlist และไม่ serialize database model ทั้งตัว:

```text
User = { id, displayName, role }
Team = { id, name, supervisor: { id, displayName }, members: [{ id, displayName }] }
Milestone = { id, teamId, title, description, dueAt, cancelledAt, createdAt,
              latestSubmission: null | { id, version, submittedAt, feedbackCount } }
Submission = { id, milestoneId, submittedBy: { id, displayName }, version,
               title, description, url, submittedAt }
Feedback = { id, submissionId, supervisor: { id, displayName }, content,
             clientRequestId, createdAt }
```

List/detail milestone ใช้ projection เดียวกัน; latestSubmission และ feedbackCount มาจาก scoped DB query แบบ batch/join ไม่ให้ browser ต้อง GET feedback ทีละ milestone เพื่อสร้าง dashboard คืน response `{data: ..., meta:{serverTime}}` สำหรับ domain reads ให้ UI อ้างเวลาจาก server ในการแสดง deadline แต่ write ต้องตรวจเวลาปัจจุบันใหม่ใน transaction เสมอ ปุ่ม/สถานะที่แสดงไม่ให้สิทธิ์ข้าม backend check

Ordering: teams ตาม name/id; milestones ตาม dueAt/id; submissions ตาม version มากไปน้อย; feedback ตาม createdAt/id น้อยไปมาก ห้ามใช้ timestamp อย่างเดียวเป็น tie-breaker S1 ใช้ list ของรายวิชาขนาด demo ทั้งชุดโดยไม่ตัดรายการเงียบ ๆ; S2 ก่อนขยายข้อมูลจริงให้ version list contracts เพิ่ม pagination และ counts พร้อม tests ไม่รายงานว่า S1 รองรับข้อมูลไม่จำกัด

S2 progress response ต้องมี `{teamId, asOf, total, submitted, progressPercent, milestones}`; S3 summary ต้องมี `{asOf, filters, totals, matchedCount, teams, items}` โดย totals ใช้ team scope ทั้งหมดที่เลือก ส่วน matchedCount/items ใช้ status filter ด้วย UI ติดป้ายสองส่วนนี้ต่างกัน Pagination ภายหลังตัดเฉพาะ items ไม่ตัด totals Query summary/progress อ่านข้อมูลที่ใช้คำนวณจาก consistent snapshot เดียว และคืน asOf เพื่อไม่ผสมยอดจากคนละขณะ

Drill-down ใช้ filters และนิยามสถานะเดียวกับ summary แต่ query ใหม่อาจเห็นข้อมูลใหม่จากการส่งงานระหว่างนั้น ให้คืน asOf ใหม่และ refresh ยอดด้วย ไม่สัญญาว่า asOf เป็น historical snapshot token ที่เปิดผลเก่าได้ เพราะ baseline ไม่มี time-travel reporting

### 9.5 Mutation retry และ error recovery

- First submission: retry ไม่ overwrite; unique version 1 ป้องกัน row ซ้ำ หาก POST timeout ให้ GET latest submission ตรวจผลและแสดง author/time จริง หากเพื่อนเป็นผู้ส่งต้องแจ้งว่า “ทีมมีงานที่ส่งแล้ว” ไม่แสดงว่าคำขอของตนสำเร็จ
- Feedback: UI สร้าง `clientRequestId` UUID ต่อเจตนาบันทึกหนึ่งครั้งและใช้ค่าเดิมเมื่อ retry Server ตรวจ role/scope ก่อน lookup; key เดิม+submission/content เดิมคืน existing record 200 โดยไม่สร้าง row; key เดิมแต่ target/content ต่างคืน 409 REQUEST_KEY_REUSED; feedback ข้อความใหม่ใช้ key ใหม่เสมอ
- Milestone/team create: ไม่มี automatic POST retry ใน baseline เมื่อผลไม่แน่ชัดให้ reload รายการและตรวจผลก่อนสร้างอีกครั้ง เพราะ title/name ไม่ได้ unique จึงห้ามเดาว่า record ชื่อเหมือนกันคือคำขอเดิม
- Revision: latest version และ expectedVersion กัน lost update; หลัง timeout เปิด history ตรวจผลก่อนสร้างคำขอใหม่ ไม่มี auto increment/version retry จาก browser

เพิ่ม HTTP 415 สำหรับ content type ที่ไม่รองรับ, 503 สำหรับ technical contention/DB unavailable; domain validation ยังคง 400/409 ตามตาราง ส่วน errors ทุกตัวมี requestId ที่ผูกกับ server log โดยไม่เผย secrets ไม่ส่ง payload/private feedback ลง log โดยอัตโนมัติ

## 10. Progress และ reporting semantics

ให้ `total` = milestone ที่ไม่ยกเลิก และ `submitted` = รายการใน total ที่มี submission อย่างน้อยหนึ่ง version:

```text
progressPercent = total == 0 ? 0 : round(submitted / total * 100, 1)
```

ตัวอย่าง: มี 5 milestone ยกเลิก 1 เหลือ total 4; ส่งแล้ว 3 → 75.0% การส่ง revision ไม่เพิ่ม numerator และการมี feedback ไม่เพิ่ม progress เปอร์เซ็นต์การส่งไม่ใช่คุณภาพงานหรือเปอร์เซ็นต์คะแนน

| Status | กติกาตามลำดับตรวจ | ข้อความ UI |
|---|---|---|
| CANCELLED | cancelledAt มีค่า | ยกเลิกแล้ว; ไม่นับ progress |
| FEEDBACK_AVAILABLE | latest submission มี feedback | รุ่นล่าสุดได้รับ feedback |
| SUBMITTED | มี submission แต่ latest ยังไม่มี feedback | ส่งแล้ว / รอ feedback |
| OVERDUE | ไม่มี submission และเวลาปัจจุบัน > dueAt | เลยกำหนดและยังไม่ส่ง |
| PENDING | กรณีอื่น | ยังไม่ส่ง |

Summary ใช้สูตรเดียวกับ progress service ไม่คำนวณอีกสูตรหนึ่งใน frontend ยอดรวมของหลายทีมคำนวณ `sum(submitted)/sum(total)` ไม่ใช่ค่าเฉลี่ยเปอร์เซ็นต์ทีมที่มีจำนวน milestone ต่างกัน ต้องมี test ตัวอย่างนี้โดยเฉพาะ Filter และ drill-down ต้องคืนรายการที่อธิบายยอดได้; team-filter กำหนด scope ของเปอร์เซ็นต์ ส่วน status-filter กรองรายการ/จำนวนในมุมมองโดยไม่เปลี่ยนนิยาม completion ratio อย่างเงียบ ๆ แสดงชื่อยอดที่ถูกกรองให้ชัด

## 11. Acceptance, testing และ traceability

### 11.1 Sprint 1 acceptance ที่ต้องผ่าน

| Feature / AC family | Outcomes ที่ต้องพิสูจน์ | Planned tests ในรายงาน D1 |
|---|---|---|
| F-01 / AC-01.1–01.5 | valid/invalid login, no/expired session, logout/replay/CSRF, scoped teams | T-01–T-05 |
| F-02 / AC-02.1–02.3 | create/retrieve milestone, forbidden role/team, field/time validation | T-06–T-08 |
| F-03 / AC-03.1–03.6 | persisted submit, exact deadline/offset, duplicate/concurrency, input/spoofing, access, restart | T-09–T-16 |
| F-04 / AC-04.1–04.4 | feedback association, role/scope rejection, validation/orphan prevention, restart | T-17–T-20 |
| Shared NFR | UI journey และ clean reproduction | T-21–T-22 |

รายละเอียด AC/STS ระดับรายกรณีอยู่ใน Part E ของรายงาน D1 ที่ลิงก์ไว้ ต้อง version contract เหล่านั้นก่อนพัฒนา และปรับ contract เมื่อ design เพิ่มข้อกำหนดใหม่ เช่น team lock และ expectedVersion ไม่ถือว่าเอกสารนี้แทน execution evidence

### 11.2 Coverage ของกฎและคุณภาพ

| Requirements | Feature / responsibility | Sprint / Verification |
|---|---|---|
| BR-01 | F-01 seed, F-05 membership | S1 uniqueness; S2 add/remove/concurrent assignment |
| BR-02, BR-03 | F-01–08 authorization | S1–S3 API tests ของทุก method/path รวม list/aggregate |
| BR-04, BR-05 | F-03 | S1 boundary ก่อน/ตรง/หลัง due 1 ms, timezone, duplicate/race |
| BR-06 | F-06 และ F-04 association | S2 history, stale version, feedback รุ่นเก่า |
| BR-07 | F-04 | S1 append/read และ cross-team access |
| BR-08 | F-02–06 validation | S1 min/max/invalid URL; S2 ตรวจ revision ด้วย |
| BR-09 | F-05 / team-milestone transactions | S2 edit/cancel/membership race กับ submit |
| BR-10 | F-07/F-08 | S2 zero/cancelled/revision; S3 weighted aggregate/filter |
| NFR-01, NFR-02 | Auth/access middleware และ scoped repositories | S1 และ regression ทุก Sprint |
| NFR-03, NFR-04 | Persistence/migration/seed/README | S1 restart/clean setup; Lab 5 redeploy; final |
| NFR-05 | Shared UI/forms | S1 และทุกหน้าที่เพิ่ม |
| NFR-06 | Delivery pipeline | Lab 5 onward; final assessed version |

**ระดับทดสอบ:** unit tests สำหรับ validation/deadline/progress; API integration ใช้ PostgreSQL จริงแยก test DB สำหรับ auth/permissions/persistence/transactions; selected browser E2E สำหรับเส้นทางหลัก; manual checks เสริมเรื่อง layout/error/reproduction ไม่ใช้แทน automated domain/access tests

**TDD:** เลือก deadline rejection เป็นกฎแรกที่เขียน test ให้ fail อย่างมีความหมายก่อน implement แล้วเก็บผล pass หลังแก้ พร้อม actual commit IDs ห้ามใช้ syntax error/disabled assertion เป็นหลักฐาน red/green

**สถานะตอนจัดทำ:** ทุกฟีเจอร์เป็น PLANNED; tests เป็น NOT RUN; ไม่มี app build, release, PR review หรือ deployed result ที่ยืนยันในไฟล์นี้

### 11.3 Verification additions จาก design review v0.4

รายการนี้เป็น contract addendum ให้ลง version ก่อน implementation ใช้ T-23 เป็นต้นไปต่อจาก T-01–T-22 เดิม ไม่เปลี่ยนหมายเลขย้อนหลัง `S1-AC-EXT-*` เป็น AC ใหม่ ส่วน later tests ระบุ verification target ไว้ก่อนและต้องมี feature contract เต็มก่อนเริ่มงาน Sprint นั้น

| AC / requirement | Test | Level / Preconditions → Action | Expected result | Sprint |
|---|---|---|---|---|
| S1-AC-EXT-01 / F-01, NFR-01/02 | T-23 | API/DB: pre-login valid/foreign/missing origin, missing custom header; login → me → mutation correct/wrong CSRF | Valid login สร้าง session/CSRF ใหม่; cross-origin/header-invalid 403 ไม่สร้าง session; authenticated CSRF ผิด 403 ไม่ write; reload me ใช้ token เดิมของ session ได้ | 1 |
| S1-AC-EXT-02 / F-04, FR-05 | T-24 | API/DB: feedback request key เดิมส่งซ้ำ/พร้อมกัน, key เดิมต่าง content/target, actor นอก scope | Same intent ได้ record เดียวและ replay 200; changed intent 409; out-of-scope 404 ก่อน lookup key; ไม่มีข้อมูลรั่ว | 1 |
| S1-AC-EXT-03 / F-02–04, FR-02/04/05 | T-25 | API + UI: milestone A/B, submission/feedback ต่างทีม → list/detail/reload | DTO มี latestSubmission/feedbackCount ถูก version และ scoped; empty latest เป็น null; serverTime รูปแบบถูก; dashboard ไม่ต้องดึงทุก feedback ทีละงาน | 1 |
| S1-AC-EXT-04 / F-03, BR-04/05 | T-26 | Unit + API/DB: คำขอรอ lock จนเลย due; clock precision/equality; submit ซ้ำหลัง due | อ่าน clock หลัง lock, late first submission 409 ไม่มี row; duplicate คืน ALREADY_SUBMITTED; เวลา checked/stored เดียวกัน | 1 |
| S1-AC-EXT-05 / F-01, NFR-02/05 | T-27 | E2E: A อ่าน private record → logout → B login browser เดิม; expired session/returnTo ภายนอก | cache A ถูกล้าง ไม่มี flash ข้อมูล A; B API ถูกปฏิเสธ; external returnTo ไม่ redirect; cookie replay ไม่ผ่าน | 1 |
| BR-09 / F-05 | T-28 | API/DB: แก้ membership/cancel milestone พร้อม first submission; role ของ candidate ผิด | lock ทำให้ได้ผลตามลำดับที่เกิดจริง ไม่มี submission orphan/ย้าย ownership; locked edits 409; invalid candidate 400 | 2 |
| BR-06 / F-06; NFR-03/04 | T-29 | Migration + API/DB: upgrade DB มี S1 records → revisions ด้วย expectedVersion เดียวพร้อมกัน | history/FK เดิมอยู่; หนึ่ง revision สำเร็จ อีกคำขอ 409; feedback รุ่นก่อนไม่ปรากฏในรุ่นใหม่ | 2 |
| BR-10 / F-07/F-08 | T-30 | Unit + API: ทีม A 1/1, B 0/9; zero/cancelled; status filters; เปลี่ยนข้อมูลระหว่าง refresh | รวม 10% ไม่ใช่ 50%; total 0 ได้ 0%; filtered items/count ตรงกัน; query ใหม่แสดง asOf ใหม่; no cross-team aggregate | 2–3 |
| NFR-03/04/06 / delivery | T-31 | System: seed ซ้ำ, migrate upgrade, restart/redeploy, DB down readiness | seed ไม่ reset งาน/password เดิม; durable records อยู่; readiness 503 ขณะ DB ใช้งานไม่ได้; logs ไม่มี secrets | 1 local; Lab 5 cloud |

T-26 boundary แบบ exact millisecond ใช้ injectable clock ภายใน test build; test API production ห้ามรับ clock override จาก header/body เพิ่ม integration case ที่ใช้ DB clock จริงกับ lock barrier เพื่อพิสูจน์ตำแหน่งการอ่านเวลา ไม่ใช้การ sleep แบบคาดเดาเพื่ออ้างความถูกต้องที่ boundary

ความครบ coverage ≠ จำนวน tests: reviewer ต้องเห็น assertions ของ status, response data และ DB effects พร้อม tested commit การตรวจเอกสารรอบนี้ยังไม่มี execution result ของ T-01–T-31

## 12. Engineering workflow และการแบ่งงาน

ขั้นตอนต่อหนึ่ง feature:

1. อ่าน requirement และเตรียม feature SDS/UI/API/data, AC, STS, DoD
2. Version contract และสร้าง Issue ที่มี scope/acceptance ชัดเจน
3. สร้าง feature branch จาก sprint staging
4. ทำ meaningful TDD สำหรับ rule/defect และพัฒนา UI/API/DB ตาม contract
5. รัน tests ตรวจ diff และส่ง PR ให้ teammate review
6. รวมเข้า staging และรัน integration/regression/E2E
7. ทำ reviewed release PR เข้า main แล้วระบุ immutable tag/commit
8. ตั้งแต่ Lab 5 deploy main version ผ่าน pipeline และเก็บ post-deploy evidence

ชื่อที่เสนอ: `staging/sprint-1`, `feature/F-03-submission`, `fix/DEF-01-scope`, `sprint-1-v1.0.0` ยังไม่มีการสร้างจริง และไม่แก้ tag ที่ส่งประเมินแล้วให้ชี้ commit ใหม่เงียบ ๆ

| ผู้รับผิดชอบเสนอ | Implementation หลักใน S1 | Review / งานร่วม |
|---|---|---|
| สมาชิก A — รอชื่อ | F-01/F-03 | Review F-02/F-04; ร่วม design/testing/integration |
| สมาชิก B — รอชื่อ | F-02/F-04 | Review F-01/F-03; ร่วม design/testing/integration |

ทั้งสองคนต้องมีส่วนร่วมด้าน requirements, code, tests, review และ delivery ไม่แบ่งถาวรให้คนหนึ่งทำเอกสารอย่างเดียว AI ช่วยร่าง/เขียน/ตรวจได้ แต่ไม่แทน teammate review หรือ independent UAT และไม่ถือคำกล่าวของ AI เป็นผลทดสอบ

## 13. Setup, configuration และ deployment design

Seed ใช้ข้อมูลสมมติสองทีมและสอง supervisor เพื่อทดสอบ cross-team scope ได้จริง ใช้ upsert/transaction ไม่สร้างซ้ำเมื่อรันอีกครั้ง Demo password รับจาก environment และ hash ก่อนเก็บ ไม่ commit/log credentials Tests ใช้ fixture clock แยกเพื่อให้ deadline cases ไม่ขึ้นกับวันรัน

Idempotent seed หมายถึงเพิ่มข้อมูลที่ยังไม่มี โดยไม่ย้ายสมาชิก/เปลี่ยน password/ลบ submission/คืนสถานะ milestone เดิมเมื่อรันซ้ำ การ reset fixture ทำได้เฉพาะ test database ผ่านคำสั่งแยกที่ตรวจ environment และ DB name; production seed ไม่สร้าง demo users โดยอัตโนมัติ บัญชีสำหรับ UAT/cloud demo ใช้ explicit seed mode และ secrets ที่ส่งผ่านช่องทางส่วนตัว

| Configuration | ความหมาย |
|---|---|
| DATABASE_URL | PostgreSQL connection string; secret ฝั่ง server |
| PORT | API port |
| APP_ORIGIN | origin ที่อนุญาตสำหรับ browser/CSRF |
| NODE_ENV | environment mode |
| SESSION_TTL_HOURS | อายุ session; baseline 8 ชั่วโมง |
| DEMO_SEED_PASSWORD | local/test seed credential; ห้ามส่งไป client/log/Git |
| RELEASE_SHA | version identifier ของ build/release |

Local ต้องมี README ระบุ dependency versions, lockfile install, env example, migration/seed, build/run/test และ restart check จาก clean checkout ตอนนี้ยังไม่มีคำสั่ง run ที่ตรวจสอบแล้ว จึงไม่เขียนคำสั่งสมมติเป็น setup สำเร็จ

Lab 5 ออกแบบ app image ให้ API serve built frontend, deploy บน Cloud Run, PostgreSQL บน Cloud SQL, image ใน Artifact Registry, secrets ใน Secret Manager และใช้ GitHub Actions สำหรับ checks/deploy แยก migration job ก่อน rollout; ไม่ reset/seed database ทุก app startup; ไม่เก็บข้อมูลถาวรบน container filesystem

CI ต้องตรวจ build/tests และ failure ต้อง block normal release path เก็บ commit → image → deployed revision ให้ตรวจย้อนกลับได้ Smoke tests ใช้ fastTrack endpoints ที่เหมาะสม ไม่ใช้ endpoint ของ TokTickIT โดยไม่แก้ และต้องตรวจข้อมูลเดิมหลัง restart/redeploy

### 13.1 Operational contract และ readiness ก่อน Lab 5

| เรื่อง | แบบที่ต้องทำ / Verification |
|---|---|
| Health | `GET /api/health` คืน 200 `{status:"ok",version:RELEASE_SHA}` โดยไม่เผย config; ไม่ query private records |
| Readiness | `GET /api/ready` ตรวจ DB connection/query ขั้นต่ำ คืน 200 หรือ 503 แบบ sanitized; ไม่ใช่ข้อมูลทั้งฐาน |
| Release identity | แสดง build SHA ใน technical evidence/health response; ผูก pipeline run, image digest และ deployed revision |
| Migration failure | หยุด rollout เมื่อ migration ล้มเหลว; ห้าม deploy app ใหม่โดยสมมติ schema พร้อม |
| Rollback | เก็บ image release เดิม; schema changes ต้อง compatible กับรุ่นที่จะ rollback; ไม่ reverse migration อัตโนมัติ |
| Data recovery | ก่อน destructive migration ต้องมี backup/restore plan และทดลอง restore บน DB แยก; ไม่ทดลองทำลาย assessed DB |
| Logs | requestId, route, result, timing; ไม่บันทึก password/auth/CSRF token, connection string หรือ full submission/feedback payload |
| Public login | ก่อนเปิด GCP ต้องมี login throttling พร้อม threshold/store ที่ตกลงและ tested 429 behavior; ใช้ shared state เมื่อหลาย instances; รายละเอียดนี้ยังเป็น open Lab 5 decision |

สอง health endpoints เป็น infrastructure responsibility ของ NFR-06 ไม่เพิ่ม Student/Supervisor workflow และไม่มี private data access การยืนยันว่า Docker/Cloud Run ใช้งานจริงต้องอาศัย release/test evidence ภายหลัง

## 14. Definition of Done และสิ่งที่ต้องส่ง

### 14.1 Product/feature DoD

- พฤติกรรมตาม requirement/AC ทำงานจริงครบทั้ง normal/error/access cases
- มี automated tests ที่ assert ผลและข้อมูลจริง ไม่ใช่เพียง HTTP success หรือ mock persistence
- Planned verification ถูก execute พร้อมผล pass/fail/skipped และ tested version
- Teammate review, staging integration และ accepted main release มีหลักฐาน
- Schema/migration/seed/config/README และเอกสารตรงกับ behavior ที่ release
- มี UI/API/DB demo, meaningful rule rejection และ forbidden-operation evidence
- Disclosure งานไม่ครบ/defects ชัดเจน; ไม่เรียก required feature ที่ยังไม่ได้ทำว่า technical debt
- ตั้งแต่ Lab 5 มี delivery/persistence evidence; final มี independent UAT/re-test และ readiness review

### 14.2 Deliverable mapping

| Checkpoint | สิ่งที่ fastTrack ต้องมี |
|---|---|
| D1 A–D | SRS, inventory/traceability, System SDS, whole-product three-sprint plan |
| D1 E | F-01–04 contracts พร้อม AC/STS/DoD และ pre-implementation history |
| D1 F | Working S1, actual build/test counts, AC-to-test results, ภาพ demo, test excerpts สองรายการ, TDD, Issue/PR chains สองรายการ, contributions/setup |
| Lab 5 | Docker + enforced CI + GCP durable data + repeatable release |
| Lab 6 | Independent cross-team UAT, defect log และ re-tests |
| Lab 7 | Approved maintenance ต่อ behavior ที่มีจริง, regression, metrics/readiness |
| D2 | S2 ครบ; S3 มี meaningful working progress; integrated deployed candidate และ remaining-work list |
| Final | ทั้ง baseline ครบ, final verification/UAT/release, เอกสารครบ และ video ที่ทั้งสองคนร่วมอธิบาย |

Project checkpoints ต้องส่ง PDF เดียวที่มีเนื้อหาประเมินและหลักฐานในไฟล์ Markdown นี้เป็นเอกสารออกแบบ ไม่ทดแทน PDF หรือ working app D1 ยังไม่บังคับ GCP URL, completed Docker/CI/CD หรือแยก demo video; ส่วน final มีข้อกำหนดวิดีโอในแหล่งเดิมไม่ตรงกัน 4/10 นาที จึงวางแผนไม่เกิน 4 นาทีและยืนยันประกาศจริงก่อนส่ง

## 15. Decision log, risks และงานถัดไป

| Decision | รายละเอียด | สถานะ |
|---|---|---|
| DEC-00 | ชื่อผลิตภัณฑ์ **fastTrack** | ยืนยันโดยผู้ใช้ 5 พ.ย. 2026 |
| DEC-01 | หนึ่งรายวิชา สอง role หนึ่งทีมต่อ student | แบบออกแบบตั้งต้น |
| DEC-02 | React/Express/TypeScript/PostgreSQL/Prisma modular monolith | แบบออกแบบตั้งต้น; ยังไม่มี lockfile |
| DEC-03 | Strict deadline S1; revision เริ่ม S2 | แบบออกแบบตั้งต้น |
| DEC-04 | Lock membership หลังทีมมีงาน; lock milestone หลังมี submission | แบบออกแบบตั้งต้น; ยอมรับข้อจำกัดการแก้ประวัติ |
| DEC-05 | DB-backed session อายุ 8 ชั่วโมง | แบบออกแบบตั้งต้น |
| DEC-06 | ไม่มีเกรด; private append-only feedback; URL submission | แบบออกแบบตั้งต้น |
| DEC-07 | S2 expectedVersion ป้องกัน stale revision; shared team/milestone locks | รวมใน D1 v0.2 แล้ว; ต้อง commit/review contracts ก่อนพัฒนา |
| DEC-08 | UI เน้นขาวดำเทา ใช้ white canvas/black primary action และ text+icon statuses | ธีมยืนยันโดยผู้ใช้ 5 พ.ย. 2026; tokens/layout เป็นแบบออกแบบ v0.2 |
| DEC-09 | Milestone track เป็นองค์ประกอบหลัก; submission/feedback เป็นพื้นที่อ่านงาน | ตาม SKILL_UI.md; ไม่เพิ่มฟีเจอร์หรือเปลี่ยน Sprint allocation |
| DEC-10 | Inter เป็นฟอนต์หลัก จับคู่ Noto Sans Thai; หัวข้อ weight 500 และมี whitespace แบบสไลด์เรียบหรู | ปรับตามความต้องการผู้ใช้ 5 พ.ย. 2026; typography v0.3 |
| DEC-11 | ชี้แจง CSRF bootstrap/same-origin, response models, feedback retry key, millisecond clock และ error precedence | Design review v0.4; sync D1 v0.2 แล้ว; ต้อง commit/review ก่อน code |
| DEC-12 | ประเมิน S1 38–54 person-hours ก่อน contingency; ตั้งเป้าจบ S2 24 พ.ย. เพื่อมี S3 progress | ประมาณการเสนอ; เวลาว่างสมาชิกยังไม่ยืนยัน |

| ความเสี่ยง / ข้อมูลขาด | วิธีจัดการ |
|---|---|
| ระยะก่อน D1 สั้นและยังไม่มี working app ที่ตรวจสอบได้ | เริ่ม F-01–04 ตาม dependency; ไม่เพิ่ม optional features; ไม่ตัด auth/access/tests |
| การเปลี่ยนแบบภายหลังอาจทำให้เอกสารต่างกัน | D1 v0.2 sync แล้ว; ครั้งต่อไปต้องปรับทั้งสองไฟล์และเก็บ revision history |
| นโยบายสมาชิก/กำหนดส่งเข้มงวดอาจไม่พอกับบริบทจริง | ทีมทบทวนก่อน freeze; เปลี่ยนผ่าน decision log พร้อม tests/ผลกระทบ |
| ชื่อ/รหัสสมาชิก รายวิชาจริง และสิทธิ์หัวข้อยังไม่ทราบ | Remote พบแล้ว: https://github.com/zerotwobook/fastTrack; ยังต้องตรวจ grader access และเติมข้อมูลสมาชิก |
| Cloud resources/teammate review/UAT partner ยังไม่มีหลักฐาน | จัดเตรียมตาม checkpoint และเก็บผู้ดำเนินการ/เวลา/version จริง |

**ลำดับเริ่มพัฒนา:** ทบทวนแบบและ version contracts → เตรียม repo/schema/seed → F-01 identity → F-02 milestone → F-03 submission/deadline → F-04 feedback → integration/access/persistence tests → teammate review/release → เก็บ Part F และจัด PDF

เมื่อเปลี่ยน requirement ให้ระบุเหตุผล affected FR/BR/feature/AC/test และผู้ทบทวน ห้าม rewrite ประวัติให้ดูเหมือนข้อกำหนดมีมาก่อน code เมื่อไม่ได้เกิดขึ้นจริง

## 16. Design review — ความครบและความพร้อมของแผน

ตรวจวันที่ 5 พฤศจิกายน 2026 เทียบ Theme 6, D1 rubric, รายงาน D1 ฉบับร่าง, UI skill และโครงสร้าง workspace เป็นการ review แบบออกแบบและความสอดคล้องของเอกสาร ไม่ใช่ code audit หรือผลรับรอง security/performance

### 16.1 Findings และการแก้ไข

**Priority:** P1 ต้องปิดก่อน implement/release ส่วนที่เกี่ยวข้อง; P2 ต้องปิดก่อน checkpoint ที่ระบุ; P3 ปรับปรุงเมื่อมีข้อมูลใช้งาน สถานะ “แก้ในแบบแล้ว” ยังต้องมี code/tests จริงก่อนถือว่าผ่าน

| ID / Priority | สิ่งที่พบและผลกระทบ | การจัดการ | สถานะ |
|---|---|---|---|
| REV-01 / P1 | API ระบุเพียง “milestone array” แต่ dashboard ต้องรู้ latest version/feedback ทำให้แต่ละฝั่งเดารูปข้อมูลหรือต้องยิงหลาย request | 9.4 DTO/read model + T-25 | แก้ในแบบแล้ว |
| REV-02 / P1 | CSRF token มีใน response แต่ไม่มี lifecycle/storage และ login ยังไม่มี session ให้ตรวจ token | 7.3/7.5 กำหนด bootstrap, csrf_token, cache/logout + T-23/T-27 | แก้ในแบบแล้ว |
| REV-03 / P1 | Feedback append-only รับ retry หลัง timeout อาจเพิ่มข้อความเดิมหลายครั้ง | 9.5 clientRequestId + DB unique + T-24 | แก้ในแบบแล้ว |
| REV-04 / P1 | Lock/clock มีแนวคิดแล้ว แต่ precision และ precedence ของ duplicate-after-deadline ไม่ชัด | 5.2/7.4 อ่าน clock หลัง lock ครั้งเดียว, explicit constraints/errors + T-26 | แก้ในแบบแล้ว |
| REV-05 / P2 | ไม่มี migration/seed safety ที่ยืนยันว่าการใช้งานครั้งต่อไปไม่ reset งานเก่า | 7.3/13 และ T-29/T-31 | แก้ในแบบแล้ว; ต้องทดสอบ |
| REV-06 / P2 | Summary filter/ยอดรวมอาจใช้คนละ denominator และ drill-down ต่างเวลากัน | 9.4/10 แยก totals กับ matchedCount/asOf + T-30 | แก้ในแบบแล้ว |
| REV-07 / P1 | S1 ใกล้ deadline แต่ไม่มี effort/capacity/จุดตรวจรวม review+PDF | 6.1 ประมาณการและ schedule; เวลา A/B ยังไม่ทราบ | ยังต้องยืนยันกำลังคน |
| REV-08 / P1 | พบใน v0.4: รายงาน D1 ใช้ชื่อ/schema/API/locks เดิม และ relative links ไม่ตรงหลังย้ายไฟล์ | D1 v0.2 ปรับชื่อ/schema/API/UI/AC/STS/links และ current Git evidence ให้ตรงแล้ว | ปิดด้านเอกสารใน v0.5; ยังรอ commit/review |
| REV-09 / P2 | หลายหน้าจอมีรายละเอียดครบ แต่ยังไม่มี UI จริงให้ตรวจ typography, mobile, focus และ error recovery | 8.11 ระบุ viewport/state/acceptance; ใช้ Inter+Noto Sans Thai ตามคำขอ | แบบครบ; verification ยังไม่เกิด |
| REV-10 / P2 | Delivery ระบุบริการแล้ว แต่ยังไม่มี health/readiness/rollback contract และ public-login throttle | 13.1; health/rollback ออกแบบแล้ว; throttle ต้องกำหนดก่อนเปิด GCP | ปิดบางส่วนในแบบ |

### 16.2 Coverage ตามมุมมอง

| ด้าน | ผลประเมิน | สิ่งที่ยังขาดก่อนถือว่าพร้อมครบ |
|---|---|---|
| Product scope / Theme 6 | ครบ teams, milestones, submissions, feedback, progress และสอง role | ชื่อสมาชิก/สิทธิ์หัวข้อ/บริบทจริง |
| S1 domain journey | ขอบเขตเหมาะสม มีธุรกรรมและกฎ deadline ไม่จบแค่ login | Working UI/API/DB และ release evidence |
| Business/data integrity | ครอบคลุม ownership/history/deadline/revision และ races ที่สำคัญ | ทดลอง constraints/transactions บน DB จริง |
| Architecture / maintainability | Modular monolith เหมาะกับขนาดทีม; separation และ migrations ชัด | Pin versions/lockfile และ technical spike ทดสอบ auth/DB transaction |
| API / UI integration | มี routes/DTO/error/retry/read models และ S1 contracts ใน D1 v0.2 ที่ sync แล้ว | Commit/review S1 contracts; S2 pagination/feature contracts ก่อนพัฒนา |
| UI/UX / accessibility | มีธีมขาวดำ Inter, role screens, responsive และ states ครบในแบบ | Render จริงและตรวจ contrast/focus/font/zoom/Thai wrapping |
| Testing / traceability | FR/BR/NFR มี feature/sprint mapping; เพิ่ม tests สำหรับ gaps | Automated files/results; expanded feature contracts S2/S3 ตามเวลา |
| Delivery / operations | แผน durable storage/pipeline/health/rollback ครบแกนหลัก | GCP config/secrets, login throttle, migration/restore และ deploy checks |
| Team process / feasibility | Workflow/review/DoD ชัด แต่เวลามีความเสี่ยง | Actual owners/capacity, Issues/PRs/reviews/UAT partner |
| Submission readiness | D1 v0.2 sync กับแบบแล้วและมีรายการหลักฐาน | Actual screenshots/logs/history, review/release และ PDF เดียว |

### 16.3 งานก่อนเริ่ม implementation และก่อนส่ง

1. **ทีมทบทวน scope decisions:** หนึ่งทีมต่อ student, strict deadline, membership lock, ไม่มีเกรด และ feedback append-only เป็นข้อเสนอ baseline ที่มี trade-off; หากเปลี่ยนให้แก้ FR/BR/AC/tests พร้อมกัน ไม่ต้องเพิ่ม admin/file upload เพื่อให้ครบ Theme 6
2. **D1 sync เสร็จแล้ว:** รายงาน v0.2 ใช้ fastTrack, relative links ที่ถูกต้อง, schema/CSRF/lock/time/DTO/retry/UI ล่าสุด และ S1 AC/STS/results matrix ที่ครอบคลุม additions เก็บ v0.1 ไว้ใน revision history พร้อมบันทึกว่าเป็น snapshot เก่า
3. **Version baseline:** ใช้ project detail v0.5 และ D1 v0.2 คู่กัน (แบบผลิตภัณฑ์จาก v0.4) ทั้งสองไฟล์ยังเป็น working-tree edits ต้อง commit/review ก่อน code; HEAD ที่ตรวจพบ `c81381c5c5a0c76b233c7dd974e9b4af892f707c` เป็น baseline เก่า ไม่ใช่ commit ของเอกสารฉบับนี้หรือ working release
4. **เตรียมทีม/repository:** remote พบ `https://github.com/zerotwobook/fastTrack` แล้ว แต่ยังไม่ได้ตรวจ grader access; เติมชื่อ/รหัส/ผู้รับผิดชอบ/เวลาว่างจริง และตั้ง board/staging/review process พร้อมหลักฐานจริง
5. **ก่อน S2/S3:** ทำ contracts/AC/STS เต็มของ F-05–08 ตาม feature ก่อน implement การยังไม่ freeze รายละเอียดทั้งหมดของ later Sprint ณ D1 ไม่ใช่ข้อบกพร่องตามโจทย์ แต่ต้องมี scope/sprint allocation ตอนนี้
6. **ก่อนส่ง D1:** ปิด functional/test/review/release gaps จริงแล้วรวมหลักฐานใน PDF; หากยังมีส่วนไม่ผ่านให้รายงาน incomplete ตามจริง

### 16.4 Review conclusion

**แบบครอบคลุมผลิตภัณฑ์หลักแล้ว และแก้ช่องว่างเชิงออกแบบสำคัญใน v0.4 แต่ยังไม่ควรเรียกว่า “ครบพร้อมส่ง”** D1 v0.2 sync แล้ว สิ่งที่ต้องปิดทันทีคือ commit/review S1 contracts, ยืนยันทีมและกำลังคน, แล้วเริ่ม implementation ตามลำดับ ส่วนรายละเอียด security/deployment ก่อน GCP และ contracts ของ later Sprint มี checkpoint กำกับแล้ว จึงไม่ต้องเพิ่มฟีเจอร์ใหม่จนทำให้ S1 หนักขึ้น

## 17. Revision history

| Version | Date | รายละเอียด |
|---|---|---|
| 0.1 | 2026-11-05 | บันทึกชื่อ fastTrack และแบบผลิตภัณฑ์ทั้งสาม Sprint พร้อม scope, rules, UI/API/data, verification และ delivery; ยังไม่มี implementation/execution evidence |
| 0.2 | 2026-11-05 | ออกแบบ UI ใหม่ตาม SKILL_UI.md และธีมขาวดำ; เพิ่ม tokens/type/layout, role-specific wireframes, component states, recovery copy, responsive/accessibility และ UI acceptance; ปรับตำแหน่งเอกสาร/โครงสร้างที่เสนอให้ตรง Project_doc และ Project_code |
| 0.3 | 2026-11-05 | ปรับ typography เป็น Inter + Noto Sans Thai ในสไตล์สไลด์เรียบหรู; เพิ่มขนาดหัวข้อ ลดน้ำหนักหัวข้อเป็น 500 และกำหนด letter-spacing ตามภาษา |
| 0.4 | 2026-11-05 | Review หลายด้าน; ปิดรายละเอียด auth/CSRF, DTO/read models, feedback retry, deadline/transaction/validation, migration/seed และ operational checks; เพิ่ม T-23–T-31, effort/schedule และ findings/open-work register; ยังไม่มี implementation หรือ test execution |
| 0.5 | 2026-11-05 | Sync D1 v0.2 ให้ตรงแบบจาก v0.4; ปิด REV-08 ด้านเอกสารและอัปเดต local Git/remote status; ไม่เพิ่ม scope หรืออ้าง execution evidence |
