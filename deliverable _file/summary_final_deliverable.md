# CPE 334 — Summary & Codex Handoff: Theme 6, Course Project Management System

> สำหรับ fastTrack: เอกสารนี้สรุปเกณฑ์รายวิชาและมีตัวอย่างแผนเก่า บางส่วนใช้ F-01–F-13; ให้ใช้ **F-01–F-08 และแบบผลิตภัณฑ์ปัจจุบันจาก [project detail](../Project_doc/project_detail.md)** และใช้ [workflow](../workflow/README.md) สำหรับเจ้าของ/ลำดับงาน ไม่ผสมเลข feature จากตัวอย่างเก่ากับ contracts จริง

> เอกสารรวมข้อกำหนดสำหรับโปรเจกต์หัวข้อ 6 จาก PDF ที่ผู้ใช้แนบทั้ง 4 ไฟล์ พร้อมแผนงานเสนอ กำหนดส่ง Rubrics หลักฐาน และเช็กลิสต์ เพื่อให้ Codex อ่านต่อได้โดยไม่ต้องพึ่งบทสนทนาเดิม
>
> จัดทำ: 29 ตุลาคม 2026 (พ.ศ. 2569) | ภาคเรียน 1/2026
> หัวข้อที่ผู้ใช้เลือกแล้ว: **6. Course Project Management System**
> สถานะเอกสารนี้: **ข้อกำหนดและแผนส่งต่องาน ไม่ใช่หลักฐานว่าโปรแกรมหรือการทดสอบทำเสร็จแล้ว**

## 0. Instructions for Codex / วิธีใช้เอกสารนี้

1. The user selected Theme 6. Build one continuous full-stack course-project management product for a two-student team, with the same repository/application across Deliverables 1, 2, Final and Labs 5–7.
2. **MUST / ข้อบังคับ** means a requirement supported by the supplied handouts. **PROPOSED / ข้อเสนอ** means an implementation or scope choice suggested in this handoff, not an instructor mandate or a confirmed user decision. **TBD / ต้องยืนยัน** means unknown or contradictory information.
3. Do not silently convert proposed rules, schema, feature IDs, sprint allocations, routes or NFR targets into instructor requirements. Record adopted decisions in the project's SRS/decision log before implementation.
4. Plan the complete product before Sprint 1. Version each feature contract and test design before implementing that feature. Preserve actual chronology and meaningful TDD red/green evidence. Never fabricate past commits, reviews, test runs, UAT testers, TA approvals or deployment results.
5. Build actual UI → backend/API → persistent database workflows. Enforce identity, role and team ownership on the server. Authentication alone is not sufficient Sprint 1 scope.
6. Respect the course Git workflow: Issue → feature/fix branch from sprint staging → teammate-reviewed PR into staging → integrated verification → reviewed release PR into main → immutable tag/commit → deployment after Lab 5.
7. Do not remove required features, disable required tests, relabel incomplete work as technical debt, or claim a planned test passed. Track implementation and verification separately.
8. Student teammate review and independent cross-team UAT must actually occur. An AI review or developer self-test does not replace them.
9. Preserve Sprint 1 and Sprint 2 accepted releases even while later candidates evolve. Final evidence must be from the final assessed version.
10. Detailed submission handouts require **complete assessed documents inside one self-contained PDF per project checkpoint**. A repository link or this Markdown file alone is not the required PDF submission.
11. Read §3 for source conflicts before preparing final video/report. Do not claim that the instructor has resolved them.
12. Start by inspecting the actual repository/current state, if supplied. At the time this file was prepared, no repository, stack, teammate, implementation, real test output or cloud resource was verified in this task.
13. This request authorizes creation of the handoff Markdown. It does not mean the six assessments have been submitted, a website deployed, or classmates contacted.

## 1. Sources and navigation

Source references use physical PDF page numbers, beginning at 1. File names are preserved for locating the originals. Appendix A includes extracted source text page by page, so this file remains useful when transferred alone.

| Code | Original file | Pages | Role |
|---|---|---:|---|
| G | `group_work_specs_v1.pdf` | 15 | Master scope, theme assignment, team process, technical requirements, sprint model, schedule, lab rubrics |
| D1 | `project_deliverable_1_v1.pdf` | 8 | Detailed Deliverable 1 requirements and PDF Parts A–F |
| D2 | `project_deliverable_2_v1.pdf` | 5 | Detailed Sprint 2 completion / Sprint 3 progress and PDF Parts A–E |
| F | `project_final_delivery_v1.pdf` | 6 | Detailed final product, QA, PDF and demo video requirements |

Original source links:
- [G — Group specification](group_work_specs_v1.pdf)
- [D1 — Deliverable 1](project_deliverable_1_v1.pdf)
- [D2 — Deliverable 2](project_deliverable_2_v1.pdf)
- [F — Final delivery](project_final_delivery_v1.pdf)

Navigation by section:
- §2 project/team scope; §3 conflicts and open decisions; §4 dates/weights.
- §5 common technical requirements; §6 Theme 6 domain; §7 proposed functional backlog and sprint plan.
- §8 proposed rules/UI/data/API; §9 engineering documents; §10 testing and evidence.
- §11 Git/team/AI workflow; §12 Deliverable 1; §13 Lab 5; §14 Lab 6; §15 Lab 7.
- §16 Deliverable 2; §17 Final; §18 common submission rules; §19 working templates.
- §20 suggested working sequence; §21 master checklist; Appendix A source excerpts; Appendix B source coverage.

## 2. Project purpose, team and confirmed state

### 2.1 Required outcome [G pp.1–4, 9–11]

พัฒนา Full-stack software product ใน problem domain ใหม่ ใช้ความรู้ SDD, TDD, Git, automated testing และ review จาก TokTickIT Labs 1–4 ในการวางแผน ออกแบบ สร้าง ทดสอบ Deploy บำรุงรักษา และ Release ระบบเดียวอย่างต่อเนื่อง

- สมาชิก **2 คน** ใช้คู่เดิม repository เดิม และแอปเดิมในโปรเจกต์และ Labs 5–7.
- ทั้งสองคนต้องร่วม requirements/design, testing, AI-agent supervision, implementation, review, deployment และ maintenance.
- แบ่งงานได้ แต่ห้ามแบ่งถาวรว่า “คนหนึ่งทำเอกสาร อีกคนทำโค้ด” จนไม่ได้เรียนรู้ครบ.
- หลักฐานการมีส่วนร่วม: Issues, commits, PR authorship/review และ contribution table สั้น ๆ.
- Pair work ได้ ให้ระบุผู้ร่วมทั้งสองใน Issue/PR. ไม่ต้องมี commit จำนวนเท่ากัน.
- ทั้งสองคนต้องอธิบาย requirement/test/design decision/release step ที่ผู้ตรวจสุ่มถามได้.
- ปกติให้คะแนนทีมร่วมกัน; กรณีสงสัยไม่ร่วมงานให้ผู้สอนพิจารณา.
- ใช้ AI ช่วยได้ แต่ทีมรับผิดชอบความถูกต้องและต้องเข้าใจผลลัพธ์.

### 2.2 Theme assignment [G p.4]

ผู้ใช้เลือกหัวข้อ 6 แล้ว. กติกาวิชากำหนดให้เลือกจากเลขท้ายรหัสนักศึกษาของคนใดคนหนึ่งในทีม (หัวข้อ 10 ตรงเลข 0). ยังไม่มีรหัสสมาชิกในงานนี้ให้ตรวจสอบ จึงให้บันทึกสถานะสิทธิ์เลือกหัวข้อเป็น **TBD** ไม่อ้างว่าได้รับอนุญาตแล้ว. ถ้าเลขไม่ตรง ต้องหารือผู้สอน/TA.

ทีมที่เลือกหัวข้อเดียวกันต้องออกแบบและพัฒนางานของตนเอง. Brief เป็นข้อมูลจาก stakeholder ไม่ใช่ SRS สำเร็จรูป. ประเด็นกำกวมให้กำหนดและบันทึกคำตัดสิน; ปรึกษาผู้สอน/TA เมื่อจำเป็น.

### 2.3 State at handoff

| Item | Status |
|---|---|
| Theme | Confirmed by user: 6 |
| Names/student IDs/teammate | TBD; do not infer a full team from conversation memory |
| Theme eligibility | TBD |
| Product name/context/course | PROPOSED: course team milestone submission and feedback portal; exact course/name TBD |
| Stack/repository/remote URLs | TBD |
| Code/tests/CI/deployment | Not inspected or verified in this task |
| Adopted deadline/revision/membership policies | TBD; proposals in §8 |
| GCP allocation and lab-specific detailed instructions | Not supplied among these four PDFs |
| Accepted releases, UAT partner and TA change approval | Not yet evidenced |

## 3. Source conflicts and decisions that remain open

The following are real differences in the supplied files. The practical handling below is a recommendation, not an official resolution.

| ID | Conflict / uncertainty | Exact source | Working approach until clarified |
|---|---|---|---|
| C-01 | Video limit says 10 minutes vs 4 minutes | G p.13: max 10; F p.2: at most 10; F p.4 §3.5: max 4 | Prepare ≤4 minutes, which fits both limits; confirm intended limit with instructor/TA |
| C-02 | Final rubric has video 8 + one-page release summary 2 vs video 10 | G p.13 vs F pp.1,4 | Structure final report around detailed F Parts A–E (35/15/20/20/10), also include ≤1-page release summary to cover G; do not claim both as extra points |
| C-03 | Master describes concise evidence index; detailed handouts demand full documents in PDF | G pp.11,13,15 vs D1 pp.5–7, D2 p.4, F p.5 | Supply complete self-contained documents and selected evidence in PDF, with a concise navigation/evidence index. Links alone are insufficient |
| C-04 | G cover is “Draft for instructor review”, issued 6 Oct 2026 | G p.1 | These are the supplied v1 requirements; check later instructor announcements if available, do not invent revisions |
| C-05 | D1 references `group_work_specs.docx` | D1 p.1; supplied master is PDF | Use supplied G PDF as current evidence; no DOCX was attached |
| C-06 | Deadline time zone not explicitly printed in handouts | Dates say 23:59; course context is Thailand | Schedule using Asia/Bangkok (UTC+07:00) as an explicit working assumption; verify if LEB2 differs |
| C-07 | Detailed Lab 5–7 handouts are announced separately | G p.15 §12 | Use G lab requirements now; do not invent submission formats or cloud configuration from missing handouts |

Open product decisions to document before related implementation:
- One or multiple teams per student; who creates/changes membership and whether changes affect old records.
- One or multiple supervisors per team; assignment scope and access after reassignment.
- Deadline semantics: server time, displayed zone, exact boundary, late submissions, extensions.
- Revision policy: allowed window, version numbering, duplicate requests, concurrent team submissions, history retention.
- Feedback visibility: all current team members vs other policy; whether feedback is attached to a version; editing feedback.
- Whether grades exist. The brief says clarify who may see feedback or grades; it does not explicitly require a full grading system. Do not silently add public grade access.
- Milestone modification/deletion after submissions; how historical deadlines and submitted work are preserved.
- Meaning and formula of progress/status; zero-milestone handling.
- Final scope for managing teams (seeding is explicitly enough for Sprint 1; final scope must fulfil the team-management brief).
- Stack, hosting resources, UI language, app name and safe test account handoff.

## 4. Official schedule and assessment weights

### 4.1 Calendar [G pp.2–3]

All due dates below are **2026 (พ.ศ. 2569), 23:59**. Working local zone: **Asia/Bangkok**. ISO dates are provided for Codex; they are not calendar events already created.

| Date / period | Activity | Notes |
|---|---|---|
| 6, 8 Oct | Midterm review and project launch | Topics, scope, team workflow, engineering baseline |
| 12–25 Oct | Examination period | Plan around exams |
| 26 Oct–1 Nov | Midterm break | Independent project work |
| 3, 5 Nov | Workshop + Lab 5 | SRS, system SDS, Sprint 1 contract/tests/integration; CI/CD, Docker, GCP |
| **Sun 8 Nov / 2026-11-08T23:59:00+07:00** | **Deliverable 1** | Whole-product baseline + working local Sprint 1 |
| 10, 12 Nov | Lab 6 sessions | Cross-team UAT and defect management |
| **Sun 15 Nov / 2026-11-15T23:59:00+07:00** | **Lab 5 due** | Deployed Sprint 1 and repeatable delivery |
| 17, 19 Nov | Lab 7 sessions | Maintenance, metrics and readiness |
| **Sun 22 Nov / 2026-11-22T23:59:00+07:00** | **Lab 6 due** | Independent UAT, defects and re-test |
| 24, 26 Nov | Final exam review; D2 discussion | Prepare D2 |
| **Sun 29 Nov / 2026-11-29T23:59:00+07:00** | **Deliverable 2 AND Lab 7 due** | Separate assessments on same application |
| 1–11 Dec | Final examination period | Avoid leaving main workflows until afterward |
| **Sun 13 Dec / 2026-12-13T23:59:00+07:00** | **Final product/report/demo video due** | Complete final release |

By **29 Nov**, product should be substantially complete. Remaining post-exam time is for bounded completion, integration, fixes, verification and submission preparation; do not postpone the main workflows to 12–13 Dec.

### 4.2 Grade pools [G p.2]

| Assessment | Raw points | Course grade |
|---|---:|---:|
| Individual Labs 1–4 (existing aggregate) | 400 | 20% |
| Group Lab 5 | 100 | 5% |
| Group Lab 6 | 100 | 5% |
| Group Lab 7 | 100 | 5% |
| **All labs** | **700** | **35%** |
| Project Deliverable 1 | 80 | 8% |
| Project Deliverable 2 | 70 | 7% |
| Final Project Delivery | 100 | 10% |
| **Group project** | **250** | **25%** |

New group work discussed here is project 25% + Labs 5–7 15% = **40% of course grade**. Lab and project points are separate scoring pools; do not combine them as one raw-score conversion.

## 5. Mandatory product and technical foundation

### 5.1 Full-stack and data [G p.3]

- Real UI → API/application → persistent database workflow.
- Choose stack and explain components/choice in System-Level SDS; using the Labs 1–4 stack is encouraged, not mandatory.
- Modular monolith is acceptable. Microservices are not required. Three logical layers do not imply three servers/containers.
- Static website, mock-up, generic CRUD-only demonstration or browser-memory-only data does not satisfy the project.
- Document schema, fields, relationships, constraints, setup/migrations and reproducible synthetic seed/demo data.
- Data survives application restart or redeployment.
- Design for Docker and GCP deployment from the beginning; cloud resources are not required before Lab 5 guidance.

### 5.2 Authentication and authorization from Sprint 1 [G pp.3–4; D1 pp.1–5]

- Real login/logout/current-user identity; documented session/token creation, expiry and logout lifecycle.
- At least two meaningful roles: **Student** and **Supervisor** for Theme 6.
- Backend-enforced permissions and team ownership on protected operations.
- Password hashing when managing passwords; no plaintext password storage.
- Test valid/invalid login, unauthenticated access, forbidden role and another user's/team's protected records.
- Seeded demo accounts are enough for Sprint 1. Self-registration, password recovery, email verification, sophisticated account administration and multiple roles per account are not required in Sprint 1.
- Framework authentication libraries may be used.
- Role matrix required. A role dropdown, client-supplied user ID or hidden button is not authorization.

### 5.3 Delivery [G p.4]

- GitHub Issues + project board + feature/fix branches + PRs + teammate review + sprint staging/integration.
- Automated tests and versioned engineering documents.
- Docker and GCP mandatory beginning Lab 5 and maintained afterward.
- Relevant PRs run build/automated-test checks; a failed required check must block normal release path.
- Deploy accepted `main` releases via repeatable pipeline. Documented manual approval inside pipeline is allowed.
- Separate cloud staging environment not required; a sprint staging branch still is part of the course workflow.
- Document environment variables/configuration without real secrets in Git, client code or PDF.
- No real payment gateway, external messaging service or external API required. Use synthetic data.

## 6. Theme 6 — authoritative domain scope

Source: **G pp.6–7, §6 theme 6**.

### 6.1 Stakeholder problem and finished product

A course/supervision program needs teams to submit milestone work and receive feedback. Finished product should manage:
1. **Teams** — teams and membership/access relationships.
2. **Milestones** — planned deliverables and relevant rules/deadlines.
3. **Submissions** — work submitted by a team member.
4. **Feedback** — supervisor responses linked to submitted work.
5. **Progress** — progress tracking and summaries.

Clarify membership, deadlines, revision policy, supervision scope and visibility of feedback/grades.

### 6.2 Sprint 1 reference journey

1. Seed teams and membership.
2. Supervisor logs in.
3. Supervisor creates a milestone for a team they supervise.
4. Student team member logs in.
5. Student submits **title / description / link**.
6. Student opens the persisted submission.
7. Supervisor records feedback.
8. Apply the specified **deadline OR revision rule**, and preserve submission/feedback association.

The handout says deadline **or** revision rule. Earlier conversation recommended a deadline rule, which is an implementation proposal; do not claim the source requires both rules fully in Sprint 1.

This is a minimum depth example, not a mandatory screen count or exact feature count. Alternative vertical slices require instructor/TA agreement and equivalent authentication, authorization, persistence, domain transaction/transition and tested business-rule depth.

### 6.3 Role and ownership requirements

| Operation | Student | Supervisor |
|---|---|---|
| Authenticate / identify current user / logout | Own account | Own account |
| Access team submissions | Only their own team's/team(s)' submissions, according to defined membership policy | Only assigned teams |
| Create milestone | Denied | Allowed only for supervised team |
| Submit work | Team member according to policy | Not assumed; define explicitly if ever needed |
| Record supervisor feedback | Denied | Only assigned team's submissions |
| Access another unrelated team's records | Denied | Denied |
| View feedback/grades | Define explicitly; protected team scope | Define explicitly; assigned-team scope |

Required negative tests explicitly include another team's submission access and student attempts to create milestones or supervisor feedback.

### 6.4 Later sprint scope in brief

- Revision history.
- Richer milestone planning.
- Progress boards.
- Summary/report views.

The team must turn this brief into concrete requirements. Do not replace this domain with generic CRUD or claim optional extra features are mandated.

## 7. Proposed feature inventory and three-sprint plan

**PROPOSED, not yet accepted baseline.** These IDs are draft IDs for this handoff; inspect any real repo IDs before adopting them. All rows start as **PLANNED / NOT VERIFIED**.

| Feature ID | Feature | Proposed sprint | Key dependency / outcome |
|---|---|---|---|
| F-01 | Authentication, identity and logout | 1 | Users, password hashing/session policy |
| F-02 | Team membership / supervision access foundation; seeded teams; scoped team lists | 1 | F-01; server-side membership/assignment checks |
| F-03 | Supervisor creates milestone; students list/view their team's milestones | 1 | F-02; title, description, deadline, ownership |
| F-04 | Submit first version using title/description/link; retrieve persisted submission | 1 | F-03; chosen deadline/revision policy |
| F-05 | Supervisor writes feedback; team reads linked feedback | 1 | F-04; role and ownership restrictions |
| F-06 | Revision submission with immutable previous versions/history | 2 | F-04; revision/window/concurrency policy |
| F-07 | Feedback correctly associated with submission version; version navigation | 2 | F-05/F-06; old feedback remains interpretable |
| F-08 | Richer milestone planning/editing under defined rules | 2 | F-03; prevent damaging existing submissions |
| F-09 | Progress board/status per team and milestone | 2 | F-03/F-04/F-06; documented status semantics |
| F-10 | Bounded team management beyond seed-only demo | 2 | Proposed: supervisor manages their authorized teams/members; assignment authority must be defined |
| F-11 | Summary/report views and meaningful progress calculation | 3 | F-09; denominator/status/privacy rules |
| F-12 | Useful filtering/search for milestones/submissions | 3 | Proposed usability feature, not explicit mandatory exact feature |
| F-13 | Final hardening, integration, failure handling, authorization and regression | 3 | All changed paths; not a substitute for feature completion |
| SYS-DELIVERY | Docker/CI/CD/GCP and persistence | Lab 5 onward | Applies across sprints |
| SYS-UAT | Cross-team UAT and re-tests | Lab 6 onward | Recorded deployed release |
| SYS-MAINT | Approved maintenance change and metrics | Lab 7 | Change to implemented behavior, not merely baseline backlog |

### 7.1 Sprint outcomes

- **Sprint 1 / D1 8 Nov:** F-01–F-05 with real UI/API/DB, automated checks, normal journey + rule rejection + forbidden access, local runnable release on main.
- **Sprint 2 / complete by D2 29 Nov:** adopted F-06–F-10 scope fully implemented, reviewed, integrated and verified. Do not quietly move unfinished Sprint 2 requirements to Sprint 3 to label Sprint 2 complete.
- **Sprint 3 / D2 checkpoint:** contracts/AC/STS for all remaining work; at least one meaningful workflow/rule implemented and tested (e.g. F-11 progress summary with correct calculation and scoped access).
- **Sprint 3 / Final 13 Dec:** complete remaining baseline features and approved changes, re-test, independent acceptance, final deployed release and final documents/video.

### 7.2 Scope control

Suggested exclusions unless the team deliberately includes them: actual file storage/upload, email/push notifications, LEB2 integration, plagiarism checking, chat, AI grading, complex grading/rubric engine, public registration, password reset and advanced administration. These are proposed exclusions, not automatic course exemptions from any subsequently adopted baseline.

Submission by URL is explicitly consistent with the theme's Sprint 1 example. Do not require live Google Drive/GitHub API integration merely to store a link. Do not auto-fetch arbitrary submission URLs unless required and designed safely.

## 8. Proposed domain decisions, screens, database and API

This section is implementation guidance. The final SRS/SDS must record actual adopted choices.

### 8.1 Suggested policy choices (must be recorded)

| Policy ID | Proposed policy | Decision still needed |
|---|---|---|
| P-01 | Seed at least two teams, students and supervisors to demonstrate allowed/forbidden access | Exact member count and whether multi-team membership is allowed |
| P-02 | Any authorized member submits on behalf of the team; record submitting user | Ownership of revisions and member departure policy |
| P-03 | Use server time; store absolute timestamps; display Asia/Bangkok | Boundary rule, recommended `submitted_at <= due_at` allowed |
| P-04 | Initial rule rejects late submission | Whether to allow late flag/extension instead; this is not mandated |
| P-05 | Sprint 1 handles first submission; Sprint 2 adds revisions without overwriting earlier versions | Revision numbering, allowed window, duplicate/concurrent requests |
| P-06 | Feedback references exact submission version | Whether editing feedback preserves history; visibility to team |
| P-07 | Supervisor may modify milestones only within authorized team and defined lifecycle rules | Deadline edits, archive vs delete, preserving submission history |
| P-08 | Student sees only authorized team records; supervisor only assigned teams | Every list/detail/write/summary path must enforce scope |
| P-09 | Progress = milestones with qualifying submission / relevant milestones × 100 | Zero denominator, cancelled milestones, whether “submitted” means “approved” (do not conflate) |
| P-10 | No grades in initial proposed scope; feedback remains private to authorized team/supervisor | Confirm final scope if grades are desired |

Example maintenance candidate for Lab 7: change P-04 from strict rejection to supervisor-authorized grace period with late flag. **Only use after instructor/TA approval and after original behavior exists.** Do not pre-label a planned baseline feature as maintenance.

### 8.2 Proposed screens

1. Login and logout/current user indicator.
2. Role-scoped dashboard.
3. Team list/details and membership display/management according to adopted scope.
4. Milestone list/details; supervisor create/edit form.
5. Submission form with title, description and URL.
6. Submission details + version history.
7. Feedback form (supervisor) and feedback display (authorized team).
8. Progress board + summary/report with filters if adopted.

Define loading, empty, validation, error and successful states; useful feedback on denied/late/invalid submissions. Screen count is not a rubric quota.

### 8.3 Proposed logical data model

| Entity | Example fields | Constraints / relationships to design |
|---|---|---|
| users | id, name, login identifier, password_hash, role | Unique login; no plaintext password; actual authentication library conventions |
| teams | id, name, supervisor_id if one supervisor | Supervisor relation; if many supervisors use team_supervisors relation instead |
| team_members | team_id, student_id, membership dates if needed | FK and unique membership; ensure account role/policy |
| milestones | id, team_id, title, description, due_at, created_by, lifecycle status | Authorized creator; valid dates; data/history impact of edits |
| submissions | id, milestone_id, submitted_by, version, title, description, url, submitted_at | Unique (milestone_id, version) for a per-team milestone model; concurrency/first-submission policy |
| feedback | id, submission_id, supervisor_id, content, created_at, updated_at if supported | FK to exact submission version; scoped writer and reader |

This model assumes each milestone belongs to one team, matching the seed example. Shared assignment templates across many teams require a deliberate model extension, not an accidental ownership leak. Add migration/seed scripts; define deletion behavior and index/unique constraints. Status/progress may be computed; do not invent stored fields that can disagree with actual history without a synchronization design.

### 8.4 Proposed API responsibilities (routes illustrative)

| Responsibility | Example route | Core server checks |
|---|---|---|
| Login/current user/logout | POST /auth/login; GET /auth/me; POST /auth/logout | Real credentials/session; logout semantics |
| Scoped teams | GET /teams; GET /teams/:id | Membership/supervision filters |
| Milestones | GET /teams/:id/milestones; POST /teams/:id/milestones | Student read scope; supervisor write scope |
| Milestone detail/update | GET/PATCH /milestones/:id | Ownership, lifecycle, validation, deadline edit policy |
| Submit/list history | POST/GET /milestones/:id/submissions | Team membership; deadline/revision; reject spoofed user/team |
| Submission detail | GET /submissions/:id | Traverse milestone→team ownership |
| Feedback | POST /submissions/:id/feedback; GET scoped feedback | Supervisor-only write; assigned team; exact version |
| Progress/report | GET /teams/:id/progress | Scoped aggregate; correct status/denominator |

Define actual request/response/error schemas in feature contracts. Use documented HTTP errors consistently. Never trust caller-supplied role or team ownership; infer from authenticated identity and database relationships. Plan authentication and cookie/token protections appropriate to selected stack.

## 9. Required engineering documents

### 9.1 Product baseline [G p.10; D1 pp.2–3]

**SRS** must contain problem/context/stakeholders, actors/responsibilities, scope/exclusions, stable numbered FR/BR/NFR, assumptions, decisions, questions/resolutions. FR = Functional Requirement; BR = Business Rule; NFR = Non-Functional Requirement. Avoid vague “manage records”; describe observable behavior.

**Feature Inventory** must list stable IDs, descriptions, linked requirements, dependencies and allocated sprint. Cover every baseline FR/BR and important NFR; cross-cutting NFR can link to multiple features or named system responsibilities.

**Traceability** must evolve from requirement → feature → sprint at D1 into requirement → feature/responsibility → sprint → AC or NFR target → planned test → actual test file/name or measurement → result → version. Show gaps and approved changes explicitly.

**System-Level SDS** must define stack/components, communication and business-rule enforcement, major data entities/fields/relationships/constraints/ownership, migrations/seed, UI/navigation/conventions, API approach/errors, role matrix, authentication lifecycle, configuration/secrets and planned deployment. Diagrams are useful where they clarify decisions; no fixed UML diagram quota.

**Three-sprint plan**: goals, feature IDs, dependencies and completion outcomes across the complete baseline. Later sprint detailed contracts need not be frozen on day one, but their scope/sprint allocation must be planned.

### 9.2 Feature engineering contract before implementation [G p.10; D1 p.4; D2 pp.2–3]

For each feature:
- ID, linked FR/BR/NFR, purpose, actors, dependencies.
- Feature-Level SDS: workflow, state/transaction behavior, business rules, validation, errors, boundary cases and permissions.
- Applicable UI specification: screen behavior, inputs, loading/empty/error states.
- API methods/paths, request/response/error shapes.
- Data fields/constraints/migrations/ownership. Explicitly say when a layer needs no change.
- Numbered **Acceptance Criteria (AC)**: stable IDs, observable outcomes, relevant failure and access cases.
- **Software Test Specification (STS)**: test ID, AC mapping, level, preconditions/input, action, expected result.
- **Definition of Done (DoD)** and completion evidence.
- Versioned pre-implementation history; record justified revisions rather than rewriting old specifications/history.

### 9.3 Proposed measurable NFRs

These are draft verification targets, not measured results or fixed instructor metrics:
- NFR-AUTH: protected requests without authenticated identity return no protected team data.
- NFR-SCOPE: unrelated students/supervisors cannot read/write/aggregate private team records across protected routes.
- NFR-PERSIST: committed submission/feedback survives the documented restart/redeployment operation.
- NFR-REPRO: a fresh environment can install/build/migrate/seed/run/test using documented commands.
- NFR-DELIVERY: required failing CI checks block normal integration/release path (from Lab 5).

If adding performance/availability targets, define method, environment, threshold and sprint in advance. Do not invent arbitrary performance numbers for the final report when the SRS did not require them. Actual access checks may be valid NFR verification.

### 9.4 Product DoD

- Required behavior implemented and observable.
- Planned meaningful verification executed; results and failures disclosed.
- Appropriate tests passing with useful assertions.
- Review and sprint integration complete.
- Accepted release identifiable on main.
- Current setup/configuration/documents and synthetic demo data.
- From Lab 5: CI/deployment/persistence checks current.
- Final: independent UAT/re-tests, defects/readiness assessment and complete handoff.
- Incomplete requirements, failed/skipped tests, limitations and blockers disclosed; disclosure does not count as completing missing behavior.

## 10. Tests and evidence specific to Theme 6

### 10.1 Levels and negative cases

Use unit tests for important logic; real API/database integration for persistence/permissions; selected UI/end-to-end journeys for critical workflows. Manual checks can supplement, not replace required automation. Mock-only database demonstrations, trivial assertions and “AI says tests pass” do not constitute execution evidence.

### 10.2 Proposed test inventory (all PLANNED; map to final AC IDs)

| Test ID | Scenario | Level | Expected behavior / verification |
|---|---|---|---|
| T-01 | Valid login | API/integration | Authenticated identity and correct role |
| T-02 | Wrong credentials | API/integration | Denied; no session/private data |
| T-03 | Unauthenticated protected request | API/integration | Denied |
| T-04 | Logout / expiry | API/integration + selected UI | Matches chosen session/token lifecycle |
| T-05 | Assigned supervisor creates milestone | API/DB + UI | Correct team persisted; retrievable |
| T-06 | Student attempts milestone creation | API | Denied; no write |
| T-07 | Unassigned supervisor creates/edits milestone | API | Denied; no cross-team write |
| T-08 | Authorized student submits before deadline | API/DB + UI | Title/description/link/identity/time saved and retrievable |
| T-09 | Submission after deadline | Unit + API/DB | Chosen rule enforced without partial write |
| T-10 | Exact deadline boundary / time zone | Unit + API | Defined inclusive/exclusive boundary matches spec |
| T-11 | Missing/invalid input | API + UI | Safe validation; no malformed record |
| T-12 | Another team reads/writes a submission | API | Denied; no private data exposure |
| T-13 | Forged submitted_by/team/role in payload | API | Backend identity/ownership remains authoritative |
| T-14 | Assigned supervisor gives feedback | API/DB + UI | Feedback saved against correct submission/version |
| T-15 | Student writes supervisor feedback | API | Denied |
| T-16 | Unassigned supervisor accesses feedback/submission | API | Denied |
| T-17 | Restart/redeployment | System/deployment | Existing submission and feedback still retrievable |
| T-18 | Revision and previous version | Unit + API/DB + selected UI | New version; previous work/feedback remains traceable |
| T-19 | Duplicate or concurrent team submission | Integration if policy requires | No corrupt/duplicate version state; defined outcome |
| T-20 | Milestone edit after submission | API/DB | Chosen edit/history rules upheld |
| T-21 | Progress/report counts and zero denominator | Unit + integration | Defined calculation; no divide-by-zero or mislabelled completion |
| T-22 | Progress/report access | API | No aggregation leakage from unrelated teams |
| T-23 | Original Sprint 1 after new features/change | Regression + E2E | Original domain journey still works |
| T-24 | Maintenance changed rule | TDD + regression | New expected behavior fails before change, passes after; old unaffected paths still pass |

Do not treat this list as a claim that 24 tests already exist or as the complete future STS. Expand/adjust from adopted AC and actual endpoints. Every Sprint 1 AC needs appropriate verification; later additions must not bypass access tests.

### 10.3 Demonstration evidence captions

Each selected screenshot/screen dump scenario records:
- Feature ID(s), AC ID(s), role and starting conditions.
- Brief steps and expected vs actual result.
- Tested release/commit (once per set allowed with explicit exceptions).
- Normal UI→API→DB journey and retrieval of stored result.
- Meaningful rule/boundary rejection.
- Backend/API evidence for forbidden role or ownership; UI screenshot alone is insufficient.

### 10.4 Execution and process evidence

- Actual build/test commands; tested commit; readable output; PASS/FAIL/SKIPPED counts.
- AC → planned test ID → actual file/test name → result. Distinguish manual from automated checks.
- Two short actual automated-test excerpts in each project checkpoint: one domain/cross-feature rule and one role/ownership restriction; show setup/assertions and execution results, not whole source files.
- Meaningful TDD red/green evidence with before/after versions; not a deliberately unrelated syntax error or disabled assertion.
- Two completed Issue/PR chains with IDs, dates, feature/contracts, branch, author, teammate reviewer, substantive review, staging integration and main release history. Final samples must be from different sprints.
- History showing sampled contracts/test designs existed before implementation; board status; release reference; contribution table; brief AI-use declaration.
- Retain raw logs and snapshots tied to versions. Do not backfill imaginary evidence.

## 11. Git, team and AI workflow

### 11.1 Mandatory release flow [G p.11]

1. Create bounded Issue linked to requirement/feature/contract.
2. Create feature/fix branch from current sprint staging branch.
3. Implement bounded change; run tests; inspect diff; update documents.
4. Open PR into staging; teammate reviews behavior/tests/diff.
5. Integrate features; run integration/system tests and acceptance checks.
6. Open reviewed release PR staging → main only when checks pass.
7. Tag or record accepted commit; after Lab 5 deploy accepted release through pipeline.

Failed integration goes back through Issue/fix branch and re-testing. Authors must not approve their own PR. Review must include a specific check/question/finding/reason, not empty “LGTM” evidence. Equal commit count is not required. Before Lab 5, local test results tied to commit suffice; CI becomes mandatory in Lab 5.

### 11.2 Suggested branch/tag names (not mandated)

- `main`, `staging/sprint-1`, `staging/sprint-2`, `staging/sprint-3`.
- `feature/F-03-create-milestone`, `fix/DEF-01-team-access`.
- `sprint-1-v1.0.0`, `sprint-2-v1.0.0`, `d2-candidate-v1`, `final-v1.0.0`.

Do not move an assessed tag silently to a new commit. A D2 candidate can contain Sprint 3 progress while original Sprint 2 accepted release remains identifiable.

### 11.3 AI-use declaration

List tools used and tasks assisted (e.g. specification drafting, code suggestions, test generation, review assistance), and how students verified outputs. Full prompt transcripts and long reflection essays not required. AI must work from relevant contracts and bounded Issues; inspect, test and review before accepting. Both students remain responsible and must explain the result.

## 12. Deliverable 1 — due 8 November 2026, 23:59

**80 points / 8% course grade. Sources: D1 pp.1–8; G pp.11–12.**

### 12.1 Required outcome

Whole-product engineering baseline plus working, tested Sprint 1 increment on main. Real auth and at least two roles; complete domain journey; persistence; meaningful rule/transition; automated tests and selected UI/E2E verification; teammate-reviewed integration.

### 12.2 PDF rubric — preserve A–F order

| Part | Points | Required PDF contents |
|---|---:|---|
| A SRS and scope | 10 | Complete context/stakeholders/actors, scope/exclusions, numbered FR/BR/NFR, assumptions and decisions |
| B Feature inventory/traceability | 10 | Complete inventory, requirement→feature→sprint mapping, gaps and approved changes |
| C System-Level SDS | 15 | Architecture/stack/data model/diagrams where useful, UI/API, roles/ownership/auth, configuration and deployment plan |
| D Three-sprint plan | 5 | Goals, feature IDs, dependencies, completion outcomes and justification of feasible Sprint 1 scope |
| E Sprint 1 contracts | 20 | All feature SDS/UI/API/data specs, AC, STS, DoD and versioned pre-implementation history |
| F Working Sprint 1/verification | 20 | Program demos, build/tests/results coverage table, Git/process evidence, contributions, AI-use declaration, limitations and setup summary |
| **Total** | **80** | |

A–D describe the **whole product**. E–F specify and verify **Sprint 1**. Later requirements need scope/sprint allocation now, but not every later AC/test fully elaborated.

### 12.3 Submission and evidence

- One self-contained PDF per team via LEB2; complete documents inside PDF, not only external links.
- Front: names/IDs of both students, theme/context, one repository URL, immutable release tag/commit.
- Contents plus navigation table A–F with actual pages and relevant IDs; internal page references.
- Clear screenshots: normal domain journey with persisted retrieval, meaningful rule rejection, login/logout and forbidden operation with backend evidence.
- Actual build/test command, commit, counts and AC→actual-test results.
- Two actual test excerpts and meaningful red/green evidence.
- Two completed Issue/PR/review chains, final board and release; contribution table and AI use.
- README and setup summary: dependencies, environment-variable examples, DB migration/seed, application/build/test commands.
- Safe synthetic accounts via private course handoff or documented local seed procedure; no real passwords/tokens/production secrets in PDF/Git.
- No fixed page limit; readability at normal size matters. Repo accessible for targeted verification; later commits do not replace submitted release.

### 12.4 Not due at D1

Separate demo video, GCP URL, completed Docker and finished CI/CD are **not required at this checkpoint**. Design for deployment now; deliver actual Docker/CI/CD/GCP in Lab 5.

### 12.5 D1 checklist

- [ ] Whole-product SRS/inventory/SDS/sprint plan complete.
- [ ] Every Sprint 1 contract/AC/STS/DoD written and versioned before implementation.
- [ ] Theme 6 create milestone → submit → retrieve → feedback journey works.
- [ ] Deadline/revision rule, login/logout, unauthorized/other-team tests run.
- [ ] Build/tests and actual results linked to release commit.
- [ ] Two test excerpts and two substantive reviewed Issue/PR chains included.
- [ ] Main release runnable locally with README/migration/seed.
- [ ] PDF Parts A–F, navigation, team IDs, repository/release reference complete.
- [ ] Failed/skipped/incomplete work disclosed; safe test access and no real secrets.

## 13. Lab 5 — Docker, CI/CD, GCP

**Due 15 November 2026, 23:59. 100 lab points / 5%. Source G p.13.**

Use accepted Sprint 1. Containerize app, establish CI/CD, deploy GCP and maintain afterward.

| Rubric | Points | Evidence |
|---|---:|---|
| CI and quality gate | 30 | Relevant PR build/tests; meaningful results; failed required check; enforced blocking gate |
| Docker/reproducible configuration | 20 | Fresh build, working container, build/run configuration, externalized config |
| GCP deployment/persistence | 35 | URL, deployed Theme 6 journey, UI/API/DB connectivity, durable data after restart/redeployment |
| Repeatable release pipeline | 15 | Reviewed change → CI → merge → deployment; release commit identity and repeatable procedure |

Tasks:
- [ ] Docker build/run and configuration documented; migration/seed behavior reproducible.
- [ ] Required CI build/test checks on relevant PRs.
- [ ] Demonstrate controlled failing check on **temporary branch**, not by breaking released app.
- [ ] Show failed check prevents normal merge/release path; document configured enforcement.
- [ ] Deploy GCP and run create/submit/feedback or equivalent critical journey.
- [ ] Prove existing records survive documented restart/redeployment.
- [ ] Trace deployed version to accepted main commit/tag and CI run.
- [ ] Repeat accepted release procedure with reviewed change.

No separate cloud staging required; manual approval within repeatable pipeline permitted. Do not choose volatile container-local DB storage without a durable persistence design. Exact cloud resources/access will be given in lab guidance, not specified here.

## 14. Lab 6 — Cross-team UAT and defect management

**Due 22 November 2026, 23:59. 100 lab points / 5%. Source G p.14.**

Pair with another project team. Each team prepares UAT for its own app, tests partner app, and triages/fixes its own app. Both tester and developer responsibilities are assessed. Test a recorded release, not an unidentified moving target.

| Rubric | Points | Evidence |
|---|---:|---|
| UAT preparation/handoff | 20 | Executable cases, safe data/accounts, access, release/version |
| Independent execution | 25 | Partner-app results, identified testers/versions, evidence for findings |
| Defect reporting/triage | 20 | Reproduction, expected/actual, severity and accepted/duplicate/not-defect/enhancement rationale |
| Resolution/independent re-test | 35 | Accepted defect → regression test → fix → reviewed PR/CI/deploy → partner re-test |

At least four user-facing cases:
1. Normal journey — supervisor creates milestone, student submits, feedback visible.
2. Domain-rule/boundary — chosen late submission/revision rule.
3. Role/ownership — unrelated team/student cannot perform protected operation.
4. State/history/persistence — saved submission and linked feedback/history remains retrievable.

UAT record must contain ID, user goal, preconditions, steps, expected/actual, PASS/FAIL, tester, version, defect link if applicable.

- [ ] Prepare and hand off at least four cases and safe access.
- [ ] Actually test partner application and keep results.
- [ ] Triage findings on own app with severity and decision rationale.
- [ ] Resolve and independently re-test **at least one accepted defect**.
- [ ] If no legitimate defect exists, ask TA for controlled known-failing exercise on isolated branch/version. Do not fabricate a defect or count new feature as defect fix.
- [ ] Report partner delay/access problems promptly for reassignment/help.
- [ ] Preserve relevant UAT cases for re-tests after subsequent changes and final release.

## 15. Lab 7 — Maintenance, metrics and release readiness

**Due 29 November 2026, 23:59. 100 lab points / 5%. Sources G pp.14–15.**

One **instructor/TA-approved change to already implemented behavior/business rule**. A baseline backlog feature alone is not this maintenance exercise.

| Rubric | Points | Evidence |
|---|---:|---|
| Change impact/updated contract | 25 | Request → affected requirements/features/SDS/AC/tests/code; reviewed contract revision |
| Implementation/regression-safe delivery | 50 | Changed-behavior test fails before implementation; change; passing/regression results; review/CI/deployment |
| Objective engineering metrics | 15 | **Five dated metrics with sources** and one action-oriented interpretation, **maximum 100 words** |
| Readiness/short retrospective | 10 | Defects/tests/debt/config/docs/release checks; three retrospective answers |

Workflow:
- [ ] Obtain and record approval, original behavior and requested change.
- [ ] Analyze impact on requirements, contracts, UI/API/data, tests and permissions.
- [ ] Update/review contract before code change.
- [ ] Show meaningful new expected behavior test failing on pre-change version.
- [ ] Implement; run affected and regression tests.
- [ ] Teammate review; CI; release/deploy; post-deployment checks.
- [ ] Record five metrics with dates/time window/source and interpretation ≤100 words.
- [ ] Record readiness decision and retrospective: what helped, what hurt, what will change; 1–2 sentences each.

Possible metrics: completed Issues; merged PRs; passing tests; UAT defects opened/resolved; successful/failed CI runs. Large counts do not earn points by themselves. Report real numbers only. Candidate Theme 6 change in §8.1 remains unapproved until evidence exists.

## 16. Deliverable 2 — Sprint 2 complete + Sprint 3 progress

**Due 29 November 2026, 23:59. 70 points / 7%. Source D2 pp.1–5.**

### 16.1 Mandatory checkpoint outcome

- All planned Sprint 2 features complete, reviewed, integrated and verified against contracts.
- Sprint 3 contracts cover all remaining baseline features.
- At least **one meaningful Sprint 3 workflow/rule implemented and tested** in candidate. Empty screens/unexecuted tests insufficient.
- Main candidate integrates Sprint 1 + Sprint 2 + implemented Sprint 3 and is deployed on GCP via Lab 5 delivery process.
- Earlier behavior/authentication/backend role and ownership still work after additions/lab changes.
- Remaining work identifies exact feature/AC, defects, owner, dependencies, next action, target completion by 13 Dec.

### 16.2 PDF Parts A–E / rubric

| Part | Points | Required content |
|---|---:|---|
| A Sprint 1 continuity/change status | 5 | Identify Sprint 1 release; demonstrate original critical journey on candidate; baseline revisions and relevant Labs 5–7 findings/change/defect register |
| B Sprint 2 contracts/working increment | 25 | All contracts/AC/STS/DoD, complete feature completion table, actual new workflows/persistence/tests and reviewed releases |
| C Sprint 3 contracts/progress | 15 | All remaining feature contracts/AC/STS; at least one meaningful implemented/tested workflow/rule; explicit remaining-work plan |
| D Updated requirements/test traceability | 10 | Complete current SRS, inventory, system SDS and requirement→feature→sprint→AC/NFR→planned test→actual verification→result/version matrix; changes/gaps |
| E Integrated release candidate | 15 | Integrated demonstrations, build/regression/CI/deployment, post-deploy journey/persistence, setup/readiness and dated final completion plan |
| **Total** | **70** | |

### 16.3 Required details

Part A change/defect register: ID, source, affected requirement/feature, accepted decision, resolved/remaining, fix/change release and re-test outcome; preserve baseline revision rationale.

Part B: contract/test-design history before implementation; validation/errors/boundaries/permissions; actual AC tests; unit/API-DB/selected UI-E2E; preserve original Sprint 2 accepted release even if D2 candidate includes later work. Cannot move required features to Sprint 3 without approved scope revision simply to claim Sprint 2 complete.

Part C: distinguish planned/in-progress/implemented/tested/accepted. For each unfinished item specify achieved AC/tested commit, missing AC/verification/fix, owner/date. Keep justified revisions visible.

Part D: implementation status and executed verification status separate. Planned Sprint 3 checks can remain planned at this checkpoint. Unrelated green test does not cover an AC.

Part E: candidate build/automated suite/integration-system/selected acceptance checks on identified commit; cross-feature data/roles/calculations; failed/skipped/unresolved disclosed. GCP deployment matches tag/commit/CI. Docker/env/migrations/setup current. Completion plan includes remaining features/tests/UAT re-tests/video/final release.

### 16.4 Submission/evidence

- One self-contained PDF via LEB2 with complete documents and selected evidence inside.
- Front: both names/IDs, theme/context, repo URL, immutable assessed tag/commit, deployed URL/version; navigation table A–E with pages and IDs.
- Program samples: **two meaningful Sprint 2 features + at least one implemented Sprint 3 workflow/rule + short original Sprint 1 continuity demo**.
- Samples support, not replace, complete completion/status tables.
- Required demo captions, persisted retrieval, rule rejection and backend access evidence.
- Build/test/CI commands/commit/counts, two actual test excerpts (domain/cross-feature + access), TDD history, two substantive reviewed Issue/PR chains with staging/release history.
- Current README plus concise setup/deploy summary; safe accounts; no secrets; repo/deployment accessible through grading.
- No separate demo video required here; video required only final checkpoint.

## 17. Final Delivery — complete verified release

**Due 13 December 2026, 23:59. 100 points / 10%. Source F pp.1–6.**

### 17.1 Required final outcome

Complete agreed baseline across all three sprints and approved changes. Every requirement/feature has explicit status. Accepted product on main and same version deployed GCP with durable data. Verify integrated workflows/rules/errors/persistence/auth/access including endpoints added after Sprint 1. Complete regression and relevant independent UAT/re-tests; resolve accepted critical defects and disclose any remaining blockers.

Earlier evidence may show history, but an old passing run alone cannot prove final release works. Final results must be from the final version.

### 17.2 Detailed final rubric and PDF structure

| Part | Points | What to deliver |
|---|---:|---|
| A Final working product | 35 | Complete feature table; major journeys across 3-sprint scope; transitions/calculations/related records; negative/boundary/invalid transition cases; persistence, permissions, errors/recovery |
| B Engineering/team evidence | 15 | Credible 3-sprint requirements/contracts→Issues→branches→tests→teammate review→staging→release history; two chains from **different sprints**; contributions and brief AI use |
| C Final requirements/verification traceability | 20 | Complete final SRS/inventory/system SDS/all feature contracts AC/STS; full baseline→actual final verification matrix including NFR target/result and approved changes |
| D Final QA/Product DoD | 20 | Final build/tests/regression/integration/acceptance, actual test excerpts, independent UAT/re-tests, defect/debt status, DoD review, CI/deploy/persistence and reproducible setup |
| E Demonstration video | 10 | Actual running final product, both students present together, assessed version, workflows/rule rejection, accessible YouTube link and timestamps |
| **Total** | **100** | See C-02 for master rubric discrepancy |

### 17.3 Final traceability and QA

- Trace every FR/BR/important NFR to feature/system responsibility, sprint, AC/verification target, planned test, actual file/name/measurement, execution result and **final commit**.
- Record PASS/FAIL/SKIPPED/INCOMPLETE honestly. No silently deleted requirements or hidden coverage gaps.
- Compare actual NFR outcomes to defined measurable targets. Do not fabricate performance measurements that were not required.
- Final build/meaningful automated/regression suite enabled; relevant assertions and integration/system/acceptance results.
- Reuse Lab 6 UAT cases where relevant; re-test affected journeys after fixes/changes with tester, expected/actual, version.
- Developer self-check does not replace independent UAT.
- Final defects: severity, affected behavior, fix/re-test version, status and blockers.
- Deploy final release via pipeline; retain post-deploy journey and durable-data checks.
- Docker/setup/env examples/migration/seed/build/test/deployment must be reproducible.
- Review Product DoD with evidence, including documentation/configuration.
- List known defects, limitations and technical debt with impact/next action. Technical debt is a compromise that makes future work harder, not an alias for unfinished required features.

### 17.4 Video

- Actual running product, not only slides.
- Both students must appear presenting work **together**, not separately on a video conference call (F p.4 wording).
- Identify deployed assessed version; show major workflows, important business rule and rejected/failure case.
- Suggested sequence: introduction/team/theme/version → product journey/persisted result/rule rejection → completion/limitations.
- Master additionally mentions brief architecture, test/CI and one requirement-to-test chain (G p.13); include concisely if possible.
- Upload as YouTube link that people with link can view; include title, assessed release, access reference and timestamp index in PDF Part E.
- Only final requires separate video.
- **Duration conflict: use ≤4 minutes as provisional safe plan; source also says 10. Seek clarification, do not erase conflict.**
- Clarity/evidence matter, not cinematic editing, accent or presentation polish.

### 17.5 One-page release summary (to cover G p.13)

Include at most one page with scope, team, version/tag/commit, repo/deployment/video links, completion and known limitations. Detailed F rubric gives video 10; do not independently add 2 points on top.

### 17.6 Final submission

- One self-contained PDF per team via LEB2 plus actual video as separate YouTube link.
- Front team names/IDs/theme/context/repository/immutable release/deployed URL/version.
- Contents/navigation table by rubric Part A–E, page references and IDs.
- Full source documents in PDF appendices; avoid duplicate copies using internal references. Source documents/code/tests also remain in repository.
- Two actual test excerpts (domain/cross-feature, access); real commands/commits/readable counts; meaningful TDD red/green.
- Two selected reviewed Issue/PR chains from different sprints, with IDs/dates/authors/reviewers/staging/release.
- Final NFR results, latest independent UAT/re-test records and release IDs.
- Contribution/AI-use/limitations once, refer to pages elsewhere.
- PDF no fixed page limit; evidence readable at normal zoom.
- Keep repository and assessed deployment accessible until instructor announces end of grading access. Do not silently replace submitted version.

## 18. Common evidence and submission conventions

1. One team submission per assessment on LEB2. D1, D2, Final each explicitly require a self-contained PDF. Lab exact submission packaging may be specified in separate handouts; these four files establish lab work/rubrics and common evidence index.
2. Include team, both students, assessment, theme, repo, assessed tag/commit and deployed version when applicable.
3. Navigation table maps rubric → actual PDF pages → relevant IDs. Use internal pages for documents/evidence; external links for repository/deployment/video where required.
4. Embed complete assessed engineering docs and selected execution evidence; document links do not replace full PDF contents.
5. No fixed PDF page limit. Readable diagrams/tables/logs/screenshots at normal viewing size.
6. Selected screenshots supplement real execution, persistence and backend access evidence.
7. Actual command/CI run, test names/files, counts, results and tested commit. Label planned vs implemented vs executed.
8. No secrets. Provide safe synthetic/demo accounts through private course handoff or local seed procedure. Environment examples use placeholders, not real passwords/tokens.
9. Keep README current and include concise setup summary in PDF: prerequisites/dependencies/env/config, DB migration/seed, app/Docker/build/test/deployment.
10. Keep assessed repo/releases/deployment accessible; graders may inspect unclear/inconsistent claims.
11. Evidence quality, traceability, behavior and meaningful tests determine quality. Page length, prompt count, commit count and visual polish alone do not establish engineering quality.

## 19. Suggested repository structure and record templates

Paths are suggestions, not required names. Use existing repo organization if equivalent and clear.

```text
README.md
summary_final_deliverable.md
docs/srs.md
docs/features.md
docs/traceability.md
docs/system-sds.md
docs/decisions.md
docs/role-permission-matrix.md
docs/sprints/plan.md
docs/sprints/sprint-1/
docs/sprints/sprint-2/
docs/sprints/sprint-3/
docs/labs/lab-5/
docs/labs/lab-6/
docs/labs/lab-7/
docs/uat/
docs/defects.md
docs/change-log.md
docs/metrics.md
docs/contributions.md
docs/ai-use.md
docs/releases/
evidence/<release-tag>/build/
evidence/<release-tag>/tests/
evidence/<release-tag>/program/
evidence/<release-tag>/ci-deployment/
evidence/<release-tag>/uat/
```

### 19.1 Full traceability template

| Requirement ID | Feature/system responsibility | Sprint | AC or NFR target | Planned test ID | Actual file/test or measurement | Implemented? | Verification result | Commit/release | Evidence/PDF page |
|---|---|---|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | Not yet implemented | No | NOT RUN | None | None |

### 19.2 Feature completion table

| Feature | AC | Implementation state | Executed verification | Result | Review/integration | Accepted release | Remaining work |
|---|---|---|---|---|---|---|---|
| TBD | TBD | Planned | None | NOT RUN | Pending | None | TBD |

### 19.3 UAT record

| UAT ID | User goal | Preconditions/account role | Steps | Expected | Actual | PASS/FAIL | Independent tester | Release/version | Defect link |
|---|---|---|---|---|---|---|---|---|---|
| TBD | TBD | Synthetic account | TBD | TBD | Not executed | NOT RUN | Not assigned | None | None |

### 19.4 Defect/change register

| ID | Source/date | Requirement/feature affected | Reproduction / request | Expected vs actual | Severity/impact | Triage/approval and rationale | Owner | Status | Fix/change release | Re-test tester/result/version |
|---|---|---|---|---|---|---|---|---|---|---|
| TBD | TBD | TBD | TBD | TBD | TBD | No approval claimed | TBD | Open | None | Not run |

### 19.5 Remaining-work plan for D2

| Feature/defect | Achieved AC and tested commit | Missing AC/test/fix | Dependency | Owner | Next action | Target date before final |
|---|---|---|---|---|---|---|
| TBD | No verified work | TBD | TBD | TBD | TBD | TBD |

### 19.6 Release evidence index

| Assessment/rubric | Document or evidence | IDs | Assessed commit/tag | Verification status | PDF page |
|---|---|---|---|---|---|
| TBD | TBD | TBD | None | Pending | Set after rendering |

### 19.7 Contribution and AI declaration templates

| Student | Requirements/design | Implementation/tests | Review | Deployment/UAT/maintenance | Evidence Issue/PR IDs |
|---|---|---|---|---|---|
| Member 1 — TBD | TBD | TBD | TBD | TBD | TBD |
| Member 2 — TBD | TBD | TBD | TBD | TBD | TBD |

| AI tool | Assisted task | Contract/Issue scope | Human validation | Evidence |
|---|---|---|---|---|
| TBD | TBD | TBD | Actual review/tests to be recorded | TBD |

### 19.8 Five-metric record

| Metric | Time window | Value | Date measured | Source/URL/query | Interpretation/action |
|---|---|---|---|---|---|
| Completed Issues | TBD | Not measured | TBD | TBD | TBD |
| Merged PRs | TBD | Not measured | TBD | TBD | TBD |
| Passing tests | TBD | Not measured | TBD | TBD | TBD |
| UAT defects opened/resolved | TBD | Not measured | TBD | TBD | TBD |
| Successful/failed CI runs | TBD | Not measured | TBD | TBD | TBD |

Lab 7 interpretation across the metrics: max 100 words. Retrospective separately answers helped/hurt/change, 1–2 sentences each.

## 20. Suggested execution sequence for Codex and the team

This sequence is a proposal, not additional official dates.

1. Inspect actual repo/README/AGENTS and current work; preserve user changes. Fill team/eligibility/stack/repo unknowns.
2. Resolve bounded domain decisions: membership/supervision, deadline/revision, feedback/privacy, progress and final team management.
3. Draft whole-product SRS with stable IDs; inventory, traceability, system SDS and sprint plan covering full brief.
4. Set GitHub project/Issues and staging workflow; divide work so both students participate meaningfully across disciplines.
5. Prepare/version Sprint 1 feature contracts and tests before implementation; seed multiple teams to expose access mistakes.
6. Implement/test auth, scoped teams, milestone, submission/retrieval, feedback and chosen rule. Retain real TDD evidence.
7. Teammate review and integration; accepted local release; produce D1 self-contained PDF and evidence.
8. Containerize, CI gate, GCP deploy/persistence/repeatable pipeline; Lab 5 evidence.
9. Sprint 2 feature contracts/implementation in parallel with group-lab schedule; arrange UAT partner and perform actual two-way UAT.
10. Resolve real defect with regression test and independent re-test; complete Lab 6.
11. Obtain Lab 7 change approval; analyze, revise contract, red/green/regression/review/deploy; collect five metrics/readiness/retrospective.
12. Finish all Sprint 2 features; specify all Sprint 3 work and implement/test at least one meaningful part; deploy integrated D2 candidate and report before 29 Nov.
13. Complete remaining baseline/approved changes; final build/regression/NFR/UAT re-tests on final release; update all docs.
14. Create final PDF, one-page release summary, ≤4-minute provisional video with both presenters, accessible YouTube link and timestamps. Verify exact submitted tag/deployment/evidence align.
15. Keep repo/deployment accessible for grading. Do not claim LEB2 submission, user communication, approvals or video creation until actually performed.

## 21. Master readiness checklist

### Baseline and Theme 6

- [ ] Two-person team and topic eligibility documented.
- [ ] Chosen course context, actors, membership and supervision defined.
- [ ] Full brief covered: teams, milestones, submissions, feedback, progress, revisions/planning/boards/reports.
- [ ] FR/BR/NFR IDs and exclusions/decisions recorded.
- [ ] Whole-product inventory, traceability, system SDS and three-sprint plan exist.
- [ ] Roles/ownership enforced server-side, including all later endpoints and reports.
- [ ] Real DB, migrations/constraints/seed, durable data design.

### Every feature and sprint

- [ ] Versioned contract/test design before implementation.
- [ ] UI/API/data specs and observable AC; actual meaningful tests.
- [ ] Normal/failure/boundary/access/persistence cases as applicable.
- [ ] TDD red/green evidence for meaningful rule/defect/change work.
- [ ] Issue/branch/teammate PR review/staging/integration/release history.
- [ ] Implementation and verification statuses separate; no invented results.

### Every project submission

- [ ] Complete PDF docs and selected evidence, correct rubric structure and page navigation.
- [ ] Both students' identities, theme, repo, immutable assessed tag/commit.
- [ ] Deployed URL/version for D2/Final; local runnable release enough for D1.
- [ ] Actual commands/versions/counts; two test excerpts; two reviewed Issue/PR chains.
- [ ] Contribution table, AI-use declaration, known limitations and setup summary.
- [ ] Secrets excluded; safe accounts provided; repo/deployment accessible.

### Specific milestones

- [ ] D1 8 Nov: A–F (80), Sprint 1 functional and verified.
- [ ] Lab 5 15 Nov: CI gate/Docker/GCP/persistence/repeatable delivery (100).
- [ ] Lab 6 22 Nov: ≥4 UAT cases, two-way independent testing, ≥1 accepted defect fixed/retested (100).
- [ ] Lab 7 29 Nov: approved change, impact, changed test red/green, regression, metrics/retro (100).
- [ ] D2 29 Nov: A–E (70), Sprint 2 complete, genuine tested Sprint 3 progress, deployed candidate.
- [ ] Final 13 Dec: A–E (100), full baseline, final evidence/UAT, deployed release, PDF/YouTube video.
- [ ] Resolve or explicitly retain video/rubric conflicts; provisional ≤4 min video and ≤1-page release summary.

## Appendix A. Source text for standalone Codex reference

The following text is extracted from the supplied PDFs, page by page. It is included to preserve details beyond the structured handoff. PDF table columns may become separate lines; use the normalized rubric tables above for readability and the PDFs for visual layout. No new requirements are created by extraction.

G: all common material and Theme 6 are retained. Other themes (1–5 and 7–10) are deliberately excluded because this project selected Theme 6. D1, D2 and F: all pages retained. Differences between source documents remain visible and are not silently reconciled.


### Appendix A — G — `group_work_specs_v1.pdf`

#### G PDF page 1 — full page

```text
CPE 334 Group Work Specification 
Introduction to Software Engineering in the Age of AI Agents
Semester 1/2026 | Draft for instructor review | Issued: 6 October 2026 
1. Purpose 
Work in a team of two to plan, engineer, build, test, deploy, maintain, and release a full-stack software 
product in a new problem domain. Apply the SDD, TDD, Git, testing, and review practices learned through 
the individual TokTickIT labs 1-4. Use AI agents to assist with engineering work while remaining responsible 
for its correctness. 
The project is one continuous development effort with three project submissions and three group labs 
performed on the same application. 
Assessment 
What it demonstrates 
Project Deliverable 1 
You can plan the product and engineer/build Sprint 1. 
Project Deliverable 2 
You continued the engineering discipline through Sprint 2 and into Sprint 3. 
Final Delivery 
You can finish, integrate, verify, and release the complete product. 
Lab 5 
Can you ship it? Containerize the application, establish CI/CD, and deploy it. 
Lab 6 
Can somebody else verify it? Obtain independent UAT and manage defects. 
Lab 7 
Can you change it without breaking it? Analyze and implement a change, run 
regression tests, and assess release readiness. 
Each stage adds a new engineering responsibility. The later labs begin with your Sprint 1 release and use the 
evolving application as development continues. 
2. Team arrangements 
Unlike Labs 1–4, Labs 5, 6, and 7 are group labs. Use the same two students, repository, and application as 
your group project.  
The purpose of a pair is to discuss decisions, challenge assumptions, review each other's work, and solve 
problems together. Both students must participate in requirements/design, testing, AI-agent supervision, 
implementation, review, deployment, and maintenance. You may distribute tasks, but you must not divide the 
learning outcomes into permanent roles such as “one writes specifications and the other writes code.”
```

#### G PDF page 2 — full page

```text
Record contributions using Issues, commits, PR authorship/review, and a short contribution table. Pair work 
is acceptable: identify both participants in the relevant Issue or PR. Equal commit counts are not required. 
Both students must be able to explain a sampled requirement, test, design decision, or release step. 
The default assessment is a shared team score. Suspected non-participation is referred to the instructor for 
review. 
3. Assessment points and course weights 
The course allocates 35% to labs/assignments and 25% to the group project. These categories have separate 
scoring pools. 
Category / assessment 
Raw points 
Course Grade % 
Individual Labs 1–4, existing aggregate 
400 
20% 
Group Lab 5: CI/CD, Docker, and GCP deployment 
100 
5% 
Group Lab 6: Cross-team UAT and defect management 
100 
5% 
Group Lab 7: Maintenance, metrics, and release readiness 
100 
5% 
All labs combined 
700 
35% 
Project Deliverable 1 
80 
8% 
Project Deliverable 2 
70 
7% 
Final Project Delivery 
100 
10% 
Group project subtotal 
250 
25% 
4. Schedule 
Submission deadlines are 23:59 on the given date. 
Date 
Activity / milestone 
Points 
6, 8 Oct 
Miterm Exam Review 
Project launch: topics, scope, team workflow, engineering baseline 
 
12 - 25 Oct 
Exam period; plan around your examination commitments 
 
26 Oct - 1 Nov 
Midterm break; independent project work 
 
3, 5 Nov 
Workshop: SRS, system SDS, Sprint 1 contract, tests, integration 
Lab 5: CI/CD, Docker, GCP deployment.  
 
8 Nov Sunday 
Project Deliverable 1 due: baseline + working Sprint 1 
80 project 
10, 12 Nov 
Lab 6: cross-team UAT and defect management 
 
15 Nov Sunday 
Lab 5 due: deployed Sprint 1 and repeatable delivery 
100 lab 
17, 19 Nov 
Lab 7: maintenance, metrics, release readiness 
 
22 Nov Sunday 
Lab 6 due 
100 lab
```

#### G PDF page 3 — full page

```text
24, 26 Nov 
Final Exam Review.  Project Deliverable 2 Discussion.  
 
29 Nov Sunday 
Deliverable 2 due 
Lab 7 due 
70 project 
100 lab   
 
 
1 - 11 Dec 
Final examination period 
 
13 Dec Sunday 
Final product, report, and demo video due 
100 project 
By 29 November your product should be substantially complete; use the period after your examinations for 
final fixes, verification, and submission preparation. 
5. Common product and technical requirements 
5.1. Full-stack architecture 
Every application must have a real UI → API/application layer → persistent database workflow. You may 
choose your stack, although you are encouraged to use the same stack as you did for Labs 1-4. Document the 
components and explain the choice in the System-Level SDS. A modular monolith is acceptable; 
microservices are not required. Three logical layers do not require three servers or three containers. 
The product must support meaningful domain rules and workflows. A static site, UI mock-up, generic CRUD 
demonstration, or application that stores all data only in browser memory does not meet the project 
requirements. 
Use a persistent database with documented schema, relationships, constraints, migrations/setup, and 
reproducible demo data. Data must survive an application restart or redeployment. Choose an architecture 
that can be packaged with Docker and deployed on GCP. 
5.2. Authentication and authorization from Sprint 1 
Every topic must include real authentication and basic server-side authorization in Sprint 1. Include: 
●
Login, logout, and current-user identity with a documented session/token lifecycle. 
●
At least two meaningful roles, as specified in the topic examples below. 
●
Backend enforcement of role permissions. 
●
Password hashing when your application manages passwords; no plaintext password storage. 
●
Tests for valid/invalid login, unauthenticated access, forbidden role access, and access to another 
user's protected data where applicable. 
Seeded demo accounts are sufficient. Self-registration, password recovery, email verification, sophisticated 
account administration, and multiple roles per account are not required in Sprint 1. You may use suitable 
framework authentication libraries.
```

#### G PDF page 4 — common requirements/theme-assignment rules only

```text
Define the role/permission matrix in your system design. Keep this foundation small enough to build 
alongside the domain workflow. Authentication alone is not a sufficient Sprint 1 product. 
5.3. Delivery and engineering requirements 
All teams must use GitHub Issues and a project board, feature/fix branches, PRs, teammate review, sprint 
staging/integration, automated tests, and versioned engineering documents. Docker and GCP deployment are 
mandatory, established through Lab 5 and maintained afterward. 
The delivery process must run build and automated-test checks on relevant PRs and prevent a failed required 
check from entering the normal release path. Deploy accepted releases from main through a repeatable 
pipeline; a documented manual approval within the pipeline is acceptable. A separate cloud staging 
environment is not required. 
Document environment variables and configuration without committing real secrets. No real payment 
gateway, external messaging service, or external API is required - Use synthetic data.  
Ways to access GCP resources will be provided in Lab 5 instructions. Design for deployment now; students 
are not required to have cloud resources before that guidance. 
6. Ten project themes and Sprint 1 examples 
We have provided 10 themes numbered 1 to 10.  You are assigned to the theme whose last digit in the theme 
number matches the last digit of your student ID. Since you will be working with a partner, you may be 
fortunate to be able to choose from 2 themes.  If you are unlucky to partner with someone who’s got the same 
last digit ID, you will have a forced choice. Using your theme, specialize its context, users, and business rules. 
Teams with the same theme should produce independently engineered products. The descriptions of each 
theme provided are stakeholder briefs, not finished SRS documents. Identify ambiguities, resolve them with 
the instructor/TA when necessary, and record decisions. 
Each example below establishes the minimum level of Sprint 1 scope and engineering, not a mandatory 
screen layout or exact feature count. An alternative vertical slice requires instructor/TA agreement and must 
provide equivalent depth: authentication, authorization, UI/API/database persistence, a meaningful domain 
transaction or transition, and a tested business rule.
```

#### G PDF page 6 — Theme 6 only

```text
6. Course Project Management System 
Stakeholder brief: A course or supervision program needs teams to submit milestone work and receive 
feedback. The finished product should manage teams, milestones, submissions, feedback, and progress. 
Clarify membership, deadlines, revision policy, supervision scope, and who may view feedback or grades. 
Sprint 1 example: Seed teams and membership. A supervisor logs in and creates a milestone for a supervised 
team. A student team member logs in, submits a title/description/link, and views the persisted submission.
```

#### G PDF page 7 — Theme 6 continuation only

```text
The supervisor records feedback. Apply the specified deadline or revision rule and preserve the 
submission/feedback association. 
Sprint 1 identity/access: Student and Supervisor roles. Students access only their teams' submissions; 
supervisors access only assigned teams. Test another team's submission access and student attempts to 
create milestones or supervisor feedback. 
Later sprints: Revision history, richer milestone planning, progress boards, and summary/report views.
```

#### G PDF page 9 — three-sprint development model only

```text
7. The three-sprint development model 
Sprint 1: Small deployable product 
Deliver a working increment by 8 November. Include the authentication/authorization foundation and an 
end-to-end domain slice comparable to Section 6. Demonstrate a normal workflow, a meaningful 
business-rule rejection, and access restrictions with tests. 
The release must run locally with documented setup and be suitable for containerization. GCP deployment 
and the completed Docker/CI/CD setup are due in Lab 5, not Deliverable 1. Continue using this increment as 
the starting point for delivery, UAT, and maintenance labs. 
Sprint 2: Core expansion 
Implement the major remaining product workflows under feature engineering contracts. Produce an 
integrated, tested working increment. Sprint 2 must be complete by Deliverable 2 on 29 November. 
Sprint 3: Completion and hardening 
Complete remaining planned features, integration, failure handling, usability, authorization, regression tests, 
and defect correction. By 29 November, provide Sprint 3 contracts, working progress, and an explicit 
remaining-work list. Complete and release Sprint 3 by 13 December.
```

#### G PDF page 10 — full page

```text
Plan the whole product's scope, architecture, and three-sprint allocation before Sprint 1 implementation. 
Elaborate each feature contract before implementing that feature; you do not need every Sprint 3 screen/API 
detail fully frozen on launch day. Record justified changes instead of silently shrinking scope or rewriting 
history. 
8. Engineering workflow and artifacts 
8.1. Product baseline 
Maintain a concise SRS with uniquely identified Functional Requirements (FR), Business Rules (BR), and 
measurable important Non-Functional Requirements (NFR). Record actors, scope/exclusions, assumptions, 
and decisions. Build a Feature Inventory and requirements-to-feature-to-sprint traceability matrix. 
Your System-Level SDS defines architecture/stack, major data model, UI structure/conventions, API 
approach, roles/permissions, configuration, and planned deployment. Use diagrams where they clarify a 
decision; no fixed quota of UML diagrams is required. 
8.2. Feature engineering contract 
For each feature, prepare before implementation: 
●
Feature-Level SDS: behavior, workflow, business rules, validation, errors, permissions, and 
dependencies. 
●
UI/API/data specifications where applicable: screen behavior, endpoint request/response/error shapes, 
schema/constraints/migrations. 
●
Acceptance Criteria (AC) with stable IDs and observable outcomes. 
●
Software Test Specification (STS): test IDs, inputs/preconditions, expected results, level, and AC 
coverage. 
●
Definition of Done and evidence required to demonstrate completion. 
Link each AC to planned and actual tests. Use  
-
unit tests for important logic 
-
API/database integration tests for persistence and permissions 
-
UI/end-to-end tests for selected critical journeys.  
Include negative/boundary tests. A stub assertion, mock-only persistence demonstration, screenshot, or AI 
statement that “all tests pass” is not execution evidence. 
Use TDD for meaningful rule/defect/change work: show a failing test for the intended behavior, then 
implementation and passing tests. Do not weaken tests to make incorrect behavior pass. Document justified 
manual checks, but do not substitute them for the required automated coverage.
```

#### G PDF page 11 — full page

```text
8.3. Git and release workflow 
Use the course workflow: 
1. Create an Issue linked to the requirement/feature and contract. 
2. Create a feature/fix branch from the current sprint staging branch. 
3. Implement the bounded change, run tests, inspect the diff, and update documents. 
4. Open a PR into sprint staging; the teammate reviews behavior, tests, and changes. 
5. Integrate features and run sprint integration/system tests and acceptance checks. 
6. Open a reviewed release PR from sprint staging to main when checks pass. 
7. Tag/record the accepted release and, after Lab 5, deploy it through the delivery pipeline. 
Failed integration returns to an Issue/fix branch and re-testing. Reviews must contain a specific check, 
question, finding, or reason for approval. Authors do not approve their own PRs. Preserve contract revisions 
and implementation history so the sequence can be verified. CI becomes mandatory in Lab 5; before that, 
retain local test results tied to the submitted commit. 
Cross-team UAT begins in Lab 6 and re-tests the relevant released version after fixes. Lab changes may be 
part of a planned sprint, but identify their assessment evidence clearly and keep it separate from unrelated 
feature work. 
8.4. AI use 
You may use specification and coding agents. Supply the relevant engineering contract, work on bounded 
Issues, inspect output, run tests, and review changes before accepting them. Both students must understand 
the result. Keep a short AI-use declaration listing tools and tasks assisted; full transcripts and long reflection 
essays are not required.  
9. Project deliverables and rubrics 
Detailed assessment instructions will use these categories and points. The master specification establishes 
the required scope. Submit a concise evidence index rather than reproducing the repository as a report. 
Project Deliverable 1: Engineering baseline + working Sprint 1 
Due 8 November | 80 project points | Proves you can plan the product and engineer/build Sprint 1. 
Part 
Points 
Required evidence 
SRS and product scope 
10 Actors, FR/BR/NFR, scope, exclusions, assumptions, resolved 
decisions. 
Feature inventory and 
traceability 
10 Requirement → feature → planned sprint; coverage of the 
baseline.
```

#### G PDF page 12 — full page

```text
System-Level SDS 
15 Architecture/stack, data model, UI/API structure, role matrix, 
configuration/deployment plan. 
Three-sprint plan 
5 Goals, feature allocation, dependencies, feasible Sprint 1 and 
remaining work. 
Sprint 1 engineering contracts 
20 Feature SDS, applicable UI/API/data specs, AC, STS, DoD, 
pre-implementation history. 
Working Sprint 1 and 
verification 
20 Domain journey, persistence, authentication/access tests, 
business-rule tests, Issue/PR/review/integration evidence. 
Total 
80  
Provide a runnable release on main, its tag/commit, setup instructions, test command/results, and a brief 
reproducible demo sequence. Cloud deployment is not required yet. 
Project Deliverable 2: Sprint 2 completion + Sprint 3 progress 
Due 29 November | 70 project points | Proves you continued the discipline of Sprint 2 → Sprint 3. 
Part 
Points Required evidence 
Sprint 1 continuity and 
change status 
5 Released baseline, change/defect status, resolved and remaining 
work. 
Sprint 2 contracts and 
working increment 
25 Pre-implementation contracts, AC/tests, working new workflows, 
reviewed Issues/PRs, increment release. 
Sprint 3 contracts and 
working progress 
15 Specified remaining features, tests, demonstrated implemented 
progress, explicit remaining-work list. 
Updated requirements/test 
traceability 
10 FR/BR/NFR → feature → sprint → AC/verification → actual 
test/result, with honest completion status. 
Integrated release candidate 
15 Sprint 1 + 2 + implemented Sprint 3, CI/deployment tied to 
commit, regression evidence, exam-period completion plan. 
Total 
70  
Submit a deployed integrated release candidate. All Sprint 2 features must be complete. Sprint 3 may have 
bounded unfinished work, clearly identified; placeholders do not count as implemented progress. 
Final Project Delivery: Complete verified release 
Due 13 Dec. | 100 project points | Proves you can integrate, verify, and release the complete product. 
Part 
Points Required evidence 
Final working product 
35 Completed major workflows and domain rules across all three sprints; 
failure handling, persistence, permissions. 
Engineering process and 
team evidence 
15 Traceable Issues/PRs/reviews/integration/releases and both students' 
participation.
```

#### G PDF page 13 — full page

```text
Part 
Points Required evidence 
Final requirements and 
verification traceability 
20 Complete baseline coverage; requirement → feature → AC/verification 
→ test → final result. 
Final QA and Product 
Definition of Done 
20 Passing automated/regression tests, UAT/re-tests, critical defect status, 
deployed release, reproducible setup, known debt. 
Demonstration video 
8 Maximum 10 minutes; both students participate; live product 
workflows, a rejected case, brief architecture, test/CI and traceability 
example. 
Final release summary 
2 Maximum one page: scope, version/commit, links, completion, 
limitations, team. 
Total 
100  
Submit one concise final PDF report, repository/release reference, deployed application URL, and 
demonstration video. The PDF serves as an evidence index and includes the release summary. Show the 
running product in the video, with one important business rule, one failure/access case, and one 
requirement-to-test chain.  
10. Group labs using the Sprint 1 release 
Lab 5: CI/CD, Docker, and GCP deployment 
Due 15 November | 100 lab points | Can you ship it? 
Containerize the accepted Sprint 1 release, establish CI/CD, and deploy it on GCP. Demonstrate a successful 
release and a controlled failing check that blocks the normal merge/release path. Use a temporary branch for 
the failure demonstration; do not deliberately break the released application. 
Part 
Points 
Evidence 
CI and quality gate 
30 PR build/tests, meaningful test results, failed required check, 
enforced gate. 
Docker and reproducible 
configuration 
20 Build/run configuration, fresh build, working container, externalized 
configuration. 
GCP deployment and 
persistence 
35 URL, deployed domain workflow, UI/API/DB connectivity, data 
survives restart/redeployment. 
Repeatable release pipeline 
15 Reviewed change → CI → merge → deployment; release commit 
identification and repeatable procedure. 
Total 
100
```

#### G PDF page 14 — full page

```text
Lab 6: Cross-team UAT and defect management 
Due 22 November | 100 lab points | Can somebody else verify it? 
Find another project team to pair with. Each team prepares UAT cases for its own released application, tests 
the partner's application, and triages/fixes findings on its own application. Each team is graded on both its 
tester and developer responsibilities. Test a recorded release, not a changing unidentified version. 
Provide at least four user-facing cases: a normal journey, a domain-rule/boundary case, a role/ownership 
restriction, and a state/history/persistence check. Record UAT ID, user goal, preconditions, steps, 
expected/actual results, PASS/FAIL, tester, version, and defect link when applicable. 
Part 
Points 
Evidence 
UAT preparation and 
handoff 
20 Executable cases, safe accounts/data, release/version, access 
handoff. 
Independent execution 
25 Partner application results, identified testers/version, evidence for 
findings. 
Defect reporting and 
triage 
20 Reproduction, expected/actual, severity; 
accepted/duplicate/not-defect/enhancement with rationale. 
Resolution and 
independent re-test 
35 Accepted defect → regression test → fix → reviewed 
PR/CI/deployment → partner re-test. 
Total 
100  
Resolve and independently re-test at least one accepted defect. If no legitimate defect is found, the TA 
provides a controlled defect exercise with a known failing behavior on an isolated version/branch. Do not 
fabricate findings or substitute a new feature for a defect fix. Partner delays or access problems should be 
reported promptly for reassignment/assistance. 
Lab 7: Maintenance, metrics, and release readiness 
Due 29 November | 100 lab points | Can you change it without breaking it? 
Apply one instructor/TA-approved change to an already implemented behavior or business rule. A feature 
already in the baseline backlog does not by itself constitute this maintenance exercise. Trace the impact, 
update the contract, demonstrate the changed test failing before implementation, implement the change, run 
regression tests, review, and redeploy. 
Part 
Points 
Evidence 
Change impact analysis and 
updated contract 
25 Change request → affected 
requirement/feature/SDS/AC/tests/code; reviewed contract 
revision. 
Implementation and 
regression-safe delivery 
50 Failing changed-behavior test, implementation, passing/regression 
results, review/CI/deployment. 
Objective engineering 
metrics 
15 Five dated metrics with sources and one action-oriented 
interpretation, maximum 100 words. 
Release readiness and short 
retrospective 
10 Defect/test/debt/configuration/doc/release checks plus three short 
retrospective answers.
```

#### G PDF page 15 — full page

```text
Total 
100  
Use metrics such as completed Issues, merged PRs, passing tests, UAT defects opened/resolved, and 
successful/failed CI runs. Counts do not earn points for being large. State the time window and source. 
Retrospective: what helped, what hurt, and what will change, one or two sentences each. 
11. Submission and evidence conventions 
Use LEB2 with one submission per team for each assessment. Identify the team, both students, assessment, 
repository, submitted tag/commit, deployed version where applicable, and evidence links. Maintain 
documents in the repository; suggested locations are docs/srs.md,   docs/features.md,  docs/traceability.md, 
 docs/system-sds.md,  docs/sprints/,  and docs/labs/.  Equivalent clear organization is acceptable. 
Every assessment must have a short evidence index: 
Rubric part 
Artifact / direct 
link 
IDs / selected version 
Verification result or status 
Example: Sprint 
contract 
Repository 
document 
F-03, AC-07, TEST-12, 
submitted commit 
Planned then implemented; test 
passing 
For tests, identify the file/test name, command or CI run, result, and tested commit. Screenshots supplement 
direct evidence. Keep links accessible to graders and partner testers. Keep the final deployment available 
through grading; the instructor will announce the end of the access period. 
TAs will sample requirements, AC/tests, Issues/PRs, and deployed journeys. You must maintain complete 
evidence even though not every row will be inspected. Marks reward observable behavior, traceability, 
meaningful tests, and credible execution evidence. Document length, prompt count, commit count, and visual 
polish alone do not establish engineering quality. 
12. Companion assessment documents 
Detailed student handouts for each Project deliverable 1–3 and Lab 5–7 will be issued separately.
```


### Appendix A — D1 — `project_deliverable_1_v1.pdf`

#### D1 PDF page 1 — full page

```text
CPE 334 Project Deliverable 1 
Engineering baseline and working Sprint 1
Due 8 November 2026 at 23:59 | 80 points (8% of Grade) | Semester 1/2026 
1. Purpose and assessment 
This deliverable proves that your team can plan the product and engineer/build Sprint 1. Establish the 
engineering baseline for the whole product, then implement a small, useful, tested vertical slice. This release 
becomes the starting point for Labs 5–7. 
Work with the same two students and repository used for the group project. Use group_work_specs.docx as 
the master specification, including its theme assignment and Sprint 1 examples.  
Part 
Points 
What you must demonstrate 
A. SRS and product scope 
10 Actors, scope, FR/BR/NFR and decisions 
B. Feature inventory and traceability 
10 Requirements mapped to features and sprints 
C. System-Level SDS 
15 Architecture, data, UI/API, access and 
deployment plan 
D. Three-sprint plan 
5 Goals, allocation, dependencies and feasible 
scope 
E. Sprint 1 engineering contracts 
20 Feature design, AC, STS, DoD and version history 
F. Working Sprint 1 and verification 
20 Domain workflow, tests, access and reviewed 
integration 
Total 
80  
2. Required Sprint 1 outcome 
By the deadline, release a working increment on main with documented local setup. It must include: 
●
A complete domain journey through the UI, API/application layer and database.  
●
Real login, logout and current-user identity, and at least two meaningful user roles. 
●
A meaningful domain transaction or state transition and business-rule validation, comparable to your 
theme’s Sprint 1 example. 
●
Automated tests for the domain rules, persistence and access restrictions, plus selected UI/end-to-end 
journeys. 
●
GitHub Issues, feature branches, teammate-reviewed PRs, sprint staging/integration and an accepted 
release on main.
```

#### D1 PDF page 2 — full page

```text
Docker, completed CI/CD and GCP deployment are due in Lab 5. At this checkpoint, retain local build/test 
results linked to the release commit and design the application for later deployment. Seeded test accounts are 
sufficient. Self-registration, password recovery and advanced account administration are not required. 
3. Required engineering work 
Parts A–D describe the whole product. Parts E–F specify and verify the Sprint 1 increment.. 
3.1. Part A SRS and product scope 
10 points | Suggested artifact: docs/srs.md 
●
Describe the stakeholder problem, chosen context, actors and their responsibilities. State the product 
scope and explicit exclusions. 
●
Identify Functional Requirements (FR) and Business Rules (BR) with stable IDs. Define observable 
behavior and meaningful domain rules, rather than generic claims such as “manage records.” 
●
Define important Non-Functional Requirements (NFR) with measurable targets and a practical 
verification method. Allocate their verification to an appropriate sprint. 
●
Record significant assumptions, design decisions, questions and their resolution.  
Example of a testable rule: “A customer cannot create a second active booking for an occupied exclusive 
slot.” Example of measurable verification: “An unauthenticated request to a protected endpoint is rejected 
without returning private data,” verified by an API test.  
3.2. Part B Feature inventory and traceability 
10 points | Suggested artifacts: docs/features.md and docs/traceability.md 
List the features with stable IDs, short descriptions, related requirements, dependencies and planned sprints. 
Cover every baseline FR, BR and important NFR. A cross-cutting requirement may link to several features or 
a named system responsibility; identify which sprint establishes and verifies it. 
Requirement 
Feature or responsibility 
Sprint and verification 
FR-01 
F-01 Create booking 
Sprint 1; AC-01 / TEST-01 
BR-01 
F-01 Prevent duplicate booking 
Sprint 1; AC-02 / TEST-02 
NFR-01 
F-02 Protect private booking data 
Sprint 1; AC-03 / TEST-03 
 
This is an illustrative appointment-system table. Use your own IDs and rules. Requirements in later sprints 
need a feature/responsibility and sprint allocation now; they do not yet need fully elaborated feature AC and 
executable tests. Show uncovered requirements and approved changes explicitly.
```

#### D1 PDF page 3 — full page

```text
3.3. Part C System-Level SDS 
15 points | Suggested artifact: docs/system-sds.md 
Architecture and data 
●
Explain the selected stack and component responsibilities across UI, API/application layer and 
database. Identify how they communicate and where business rules are enforced. 
●
Define the major data entities, fields, relationships, important constraints and ownership links. 
Describe database setup, migrations and reproducible seed data. 
●
Use a diagram when it clarifies the architecture or data model. There is no required quota of UML 
diagrams. 
UI API and access conventions 
●
Define the main screens/navigation and shared UI behavior, including validation, loading, empty and 
error states. 
●
Define the API approach: endpoint conventions, request/response structure, validation and safe error 
handling. Feature contracts provide the detailed endpoints. 
●
Provide a role/permission matrix showing who may perform each protected operation and which 
records they may access. A hidden frontend control is not backend authorization. 
●
Describe credential handling, password hashing if passwords are managed locally, session/token 
creation and expiry, current-user retrieval and logout behavior. 
Configuration and delivery design 
Explain environment variables, secret handling, database configuration and the planned GCP deployment 
components. The product must be suitable for Docker packaging and durable storage; actual cloud setup 
comes in Lab 5. Keep real secrets out of Git and client code. 
3.4. Part D Three-sprint plan 
5 points | Suggested artifact: docs/sprints/plan.md 
For each sprint, state its goal, included feature IDs, dependencies and completion outcome. Collectively, the 
three sprints must cover the product baseline. 
Sprint 
Required outcome 
Checkpoint 
1 
Small working domain slice with authentication, permissions 
and persistence 
Deliverable 1; 8 Nov 
2 
Completed core expansion under engineering contracts 
Deliverable 2; 29 Nov 
3 
Remaining features, integration and product hardening 
Progress at 29 Nov; complete 
by 13 Dec
```

#### D1 PDF page 4 — full page

```text
3.5. Part E Sprint 1 engineering contracts 
20 points | Suggested artifacts: docs/sprints/sprint-1/ with feature specifications and STS 
Prepare and version the engineering contract for each Sprint 1 feature before implementing it. The contract is 
the feature design, acceptance criteria, test specification and completion evidence. Specifications may evolve, 
but revisions must remain visible and justified. 
Feature design and acceptance criteria 
●
Identify the feature and linked FR/BR/NFR. Describe behavior, workflow, dependencies, business 
rules, validation, failure/boundary cases and permissions. 
●
Specify applicable UI behavior, API methods/paths and request/response/error shapes, and data 
fields/constraints/migrations. State when a layer needs no change. 
●
Give acceptance criteria stable IDs and observable expected outcomes. Include relevant negative and 
boundary behavior, and role restrictions. 
Software Test Specification and Definition of Done 
For each planned test, record its ID, linked AC, test level, preconditions/input, action and expected result. 
Map all Sprint 1 AC to suitable verification. Unit tests should cover important logic; API/database integration 
tests should cover persistence and permissions; selected UI/end-to-end tests should cover critical user 
journeys. 
Test and AC 
Input or precondition 
Expected result 
TEST-02 / AC-02 
Exclusive slot already has an active 
booking; submit another booking 
Reject the request; no second active 
booking is stored. 
TEST-03 / AC-03 
User A requests User B’s private 
booking through the API 
Reject access without returning private 
booking data. 
Define the Product Definition of Done: required behavior implemented; planned verification executed; 
meaningful tests passing; review and integration complete; setup/documents current; and incomplete work 
disclosed. Completion must be supported by evidence, not an AI agent’s claim. 
Keep specification, test-design and implementation history. Use TDD for meaningful rule work: retain 
evidence that the intended behavior test failed before correction and passed afterward. A specification-only 
commit followed by implementation is a useful way to make the sequence visible; no special commit-count 
requirement applies.
```

#### D1 PDF page 5 — full page

```text
3.6. Part F Working Sprint 1 and verification 
20 points | Artifacts: released application, tests, README, GitHub Issues and reviewed PRs 
Product behavior and tests 
Demonstrate the complete Sprint 1 domain journey, then retrieve its persisted result. Demonstrate a 
meaningful rule rejection and a forbidden operation. Test actual API/database integration.  
Include automated checks for valid/invalid login, unauthenticated protected requests, and forbidden role 
operations. Demonstrate logout according to the chosen session/token design. Use real backend 
enforcement, not a client-selected user ID or role selector. 
Run the required build and test commands on the submitted release. Retain test names/files, counts, results, 
command and tested commit. Inspect assertions and failures yourself. Report failed/skipped tests; do not 
disable or weaken required tests to make the result appear complete. Manual checks may supplement 
meaningful automated verification. 
Reviewed integration and team participation 
●
Link each completed Issue to its feature/contract, branch and PR. Implement features on branches 
from sprint staging. 
●
Have the teammate review the PR into sprint staging. Record a specific check, question, finding or 
reason for approval; authors do not approve their own work. 
●
Integrate the increment, run integration/system tests and acceptance checks, then merge the reviewed 
staging release PR into main. 
●
Record the release tag/commit. Both students must have meaningful participation; identify pair work 
in Issues/PRs and a short contribution table. 
An equal number of commits is not required. Both students must understand the design, tests and released 
behavior. 
4. What to submit 
Submit one self-contained PDF per team through LEB2 by 8 November 2026 at 23:59. Put the complete 
engineering documents and selected execution evidence directly in the PDF. A TA should be able to grade 
Parts A–F without opening separate specification files. 
Keep the engineering documents, source code and tests in the GitHub repository as well. At the beginning of 
the PDF, provide both students’ names and IDs, the selected theme/context, one repository URL and the 
submitted release tag/commit. The repository is available for targeted verification; it is not a substitute for the 
required PDF contents.
```

#### D1 PDF page 6 — full page

```text
4.1. Organize the PDF into Parts A to F 
Use the headings below in the same order as shown here. Include a table of contents with page numbers and 
keep text, diagrams, tables and screenshots readable at normal viewing size. There is no fixed page limit; 
include complete engineering content without duplicating it unnecessarily. 
Part 
Points 
Include directly in the PDF 
A 
10 
Complete SRS: stakeholder/context, actors, scope/exclusions, numbered FR/BR/NFR, 
assumptions and decisions. 
B 
10 
Complete feature inventory and requirements-to-feature-to-sprint traceability table. 
Show coverage gaps and approved changes. 
C 
15 
Complete System-Level SDS: architecture/stack, major data model/diagrams, UI/API 
conventions, roles/ownership, authentication, configuration and deployment plan. 
D 
5 
Three-sprint plan: goals, feature IDs, dependencies and completion outcomes. Explain 
the scope of Sprint 1. 
E 
20 
All Sprint 1 feature engineering contracts: feature SDS, applicable UI/API/data 
specifications, AC, STS and Product Definition of Done. 
F 
20 
Selected program demonstrations, build/test results, test coverage/results table, Git 
workflow/history evidence, contribution table, and known limitations. 
Total 
80 
 
4.2. Show selected execution evidence in Part F 
Program demonstrations 
Include selected screenshots or screen dumps showing the following scenarios: 
●
A complete normal domain journey through the UI, API and database, followed by retrieval of the 
saved result. 
●
A meaningful business-rule or boundary rejection, with the expected failure shown. 
●
Login/logout and a forbidden role or ownership operation. Include backend/API test evidence for 
protected operations; hiding a button does not prove authorization. 
Label each scenario with its feature/AC IDs, user role, starting conditions, brief steps, expected result and 
actual result. Identify the release commit once for the demonstration set, and state any exception. 
Screenshots should show the relevant content clearly. A short sequence may demonstrate several related 
criteria. 
Build and automated test results 
Include the build/test commands, tested commit and readable execution output showing the passing, failing 
and skipped counts. Provide a results table mapping each Sprint 1 AC to its planned test ID, actual test 
file/name and result. Clearly distinguish automated tests from manual checks.
```

#### D1 PDF page 7 — full page

```text
Embed two short excerpts of actual automated tests: one for an important domain rule and one for a 
role/ownership restriction. Show the relevant setup and assertion, not entire source files. Include their 
execution results. For meaningful TDD work, show the intended behavior test failing before 
implementation/correction and passing afterward, with the relevant versions identified. 
Engineering workflow and history 
Include selected evidence for two completed Issues and their PRs, showing the feature/contract IDs, branch 
names, author/reviewer, a substantive review, and integration into sprint staging and main. A compact table 
plus readable GitHub/history screenshots is sufficient. Include the final board status and release reference. 
Show a concise history sequence identifying when the sampled contracts/test design were recorded and 
when implementation followed. Preserve commit IDs and dates. Include both students’ contributions, a brief 
AI-use declaration, and known incomplete work or failed/skipped tests. Full prompt transcripts and long 
reflections are not required. 
4.3. Include a short navigation table 
At the beginning of the PDF, provide one navigation row for each part A–F with its page range and relevant 
IDs. Use page references within the PDF rather than external artifact links. For example: “Part E, pages 
12–18: F-01, AC-02, TEST-02; execution evidence in Part F, page 22.” Use your actual page numbers. 
TAs will read and sample evidence from the PDF. They may open the repository to investigate unclear or 
inconsistent evidence or verify a selected claim. Keep the repository accessible and tied to the submitted 
release. Later commits must not silently replace the assessed version. 
4.4. Retain reproduction instructions and safe test access 
Keep the README current with dependencies, environment-variable examples, database 
setup/migrations/seed, and application/build/test commands. Include a brief setup summary in Part F so the 
assessment is understandable without opening the README. Use synthetic demo data. Provide safe local test 
accounts through the private course handoff or documented local seed procedure; do not put real passwords, 
tokens or production secrets in the PDF or Git. 
A separate demo video, GCP URL, completed Docker setup and CI/CD pipeline are not required for 
Deliverable 1. Deployment is assessed in Lab 5; the final project requires its own demonstration video. The 
selected screenshots and test evidence above document the local Sprint 1 release. 
5. Submission checklist 
●
The PDF contains complete Parts A–E and selected execution/process evidence in Part F. 
●
The contents/navigation table identifies A–F and their page ranges. 
●
All Sprint 1 contracts, AC, STS and DoD appear directly in the PDF.
```

#### D1 PDF page 8 — full page

```text
●
Program screenshots demonstrate the normal workflow, persisted retrieval, rejection and access 
restrictions with captions. 
●
Build/test output, the AC-to-test results table and selected test excerpts identify the tested versions. 
●
Selected Issue/PR/review/history evidence and both students’ contributions are readable in the PDF. 
●
The PDF identifies the repository and immutable release; the repository remains accessible and 
reproducible. 
●
Incomplete work and failed/skipped tests are disclosed; no real secrets are included.
```


### Appendix A — D2 — `project_deliverable_2_v1.pdf`

#### D2 PDF page 1 — full page

```text
CPE 334 Project Deliverable 2 
Sprint 2 completion and Sprint 3 progress
Due 29 November 2026  | 70 points | Semester 1/2026 
1 Purpose and assessment 
This deliverable proves that your team continued the engineering discipline through Sprint 2 and into Sprint 
3. Complete the core expansion, demonstrate genuine Sprint 3 progress, and submit a deployed integrated 
release candidate with a controlled plan to finish the product. 
Use the same two students, repository and assigned theme as Deliverable 1 and Labs 5–7. Follow the product 
scope in the Group Work Specifications document and retain approved scope changes. This assessment is 
worth 70 points and 7% of the course grade, within the project total of 250 points and 25%. 
Part 
Points 
What you must demonstrate 
A Sprint 1 continuity and change status 
5 Original slice still works; findings and changes 
tracked 
B Sprint 2 contracts and working increment 
25 Completed new workflows with contracts and 
verification 
C Sprint 3 contracts and working progress 
15 Specified remaining features and genuine tested 
progress 
D Updated requirements and test traceability 
10 Current baseline mapped to actual tests and 
honest status 
E Integrated release candidate 
15 Coherent deployed candidate with regression 
and finish plan 
Total 
70  
 
2 Required checkpoint outcome 
●
All planned Sprint 2 features are complete, reviewed, integrated and verified against their contracts. 
●
Sprint 3 contracts cover the remaining baseline features. At least one meaningful Sprint 3 workflow or 
rule is implemented and tested in the candidate; empty screens or unexecuted tests are insufficient. 
●
The candidate on main integrates Sprint 1, Sprint 2 and implemented Sprint 3 work, and is deployed 
on GCP through the delivery process established in Lab 5. 
●
Earlier behavior, authentication, backend permissions and record ownership still work after new 
features and lab changes. 
●
The remaining-work list identifies exact features/AC, defects, owners, dependencies, next actions and 
planned completion by 13 December.
```

#### D2 PDF page 2 — full page

```text
3 Required engineering work 
3.1 Part A Sprint 1 continuity and change status 
5 points 
Identify the accepted Sprint 1 tag/commit and demonstrate that its original critical domain journey still works 
on the candidate. Provide a change/defect register for relevant deployment, UAT and maintenance findings: 
ID, source, affected requirement/feature, accepted decision, resolved or remaining status, fix/change release 
and re-test outcome. Record approved baseline revisions and their rationale. 
3.2 Part B Sprint 2 contracts and working increment 
25 points 
Contracts before implementation 
Include the complete contract for every Sprint 2 feature: linked FR/BR/NFR; feature SDS and workflow; 
applicable UI/API/data definitions; validation, errors, boundaries and permissions; numbered acceptance 
criteria; STS with test IDs, levels, inputs and expected outcomes; and Definition of Done. State when a layer 
needs no change. Preserve versioned contract/test-design history before implementation, justified revisions 
and meaningful TDD evidence. 
Working core expansion 
Implement the major remaining workflows allocated to Sprint 2. Demonstrate meaningful domain 
transactions or transitions with real database persistence. Include a completion table for every Sprint 2 
feature showing AC, implementation, executed verification, result and accepted release. Required features 
cannot be moved to Sprint 3 simply to mark the sprint complete without approved scope revision. 
Verification and reviewed release 
Map AC to actual tests and results. Cover important business rules, negative/boundary behavior, persistence 
and new access paths. Use unit, API/database integration and selected UI/end-to-end tests as appropriate. 
Trace completed work through Issues, feature branches, teammate-reviewed PRs, sprint integration checks 
and the accepted Sprint 2 release on main. Keep the original Sprint 2 release identifiable even if the current 
candidate includes later changes. 
3.3 Part C Sprint 3 contracts and working progress 
15 points 
Define contracts, AC and STS for all remaining Sprint 3 features with enough UI/API/data detail to control 
implementation. Implement and test at least one meaningful domain workflow or rule. Distinguish planned, in 
progress, implemented, tested and accepted work. Record revisions without rewriting the history.
```

#### D2 PDF page 3 — full page

```text
Feature or 
defect 
Current status 
Remaining action 
Owner and target 
Use your 
actual ID 
State achieved AC and 
tested commit 
State missing AC, verification or fix 
Student name; date 
before final 
submission 
 
Plan around the final examination period of 1–11 December. By 29 November, the product should be 
substantially complete. Use the remaining period for bounded completion, integration, defects and final 
verification; do not reserve the main product workflows for the last two days. 
3.4 Part D Updated requirements and test traceability 
10 points 
Update the complete SRS, feature inventory and System-Level SDS to match the current product. Provide one 
complete traceability matrix for all baseline FR/BR and important NFR, including approved changes. Record 
requirement → feature/responsibility → sprint → AC or NFR verification → planned test → actual file/test or 
measurement → result and version. A cross-cutting NFR may map to several features or a system 
responsibility. 
Show uncovered requirements and planned final verification explicitly. For each AC, identify whether it is 
implemented and whether its verification has run and passed. Do not use “done” for an unexecuted test or 
use an unrelated green test as coverage. Later Sprint 3 checks may remain planned at this checkpoint. 
3.5 Part E Integrated release candidate 
15 points 
Integrated behavior and regression 
Release a coherent candidate on main. Run the build, automated suite, integration/system checks and 
selected acceptance journeys on its commit. Include cross-feature checks where new work affects older 
behavior, shared data, roles or calculations. Disclose failed/skipped tests and unresolved defects; do not 
weaken tests to conceal incomplete behavior. 
Deployment and completion readiness 
Deploy the candidate on GCP and match the deployed version to the tag/commit and CI run. Retain 
post-deployment checks of a critical journey and persistence. Keep Docker configuration, environment 
variables, migrations and setup current. Provide a brief readiness review and dated plan to complete the 
remaining features, tests, UAT re-tests, final video and release by 13 December.
```

#### D2 PDF page 4 — full page

```text
4 What to submit 
Submit one self-contained PDF per team through LEB2 by 29 November 2026 at 23:59. Include the complete 
documents required below and selected execution evidence. Maintain source documents, code and tests in 
the repository as well. Graders should be able to read the assessed engineering work without opening 
separate specification files. 
At the beginning, identify both students and IDs, the theme/context, one repository URL, the immutable 
submitted tag/commit, the deployed application URL and its version. Include a contents/navigation table 
mapping each rubric part to PDF pages and IDs. Use internal page references for evidence; keep external 
links for the repository, and deployment where required. 
4.1 PDF contents 
Part 
Include directly in the PDF 
A 
Sprint 1 release/continuity evidence, baseline change log and the current status of relevant Lab 
5–7 findings. 
B 
All Sprint 2 contracts/AC/STS/DoD, complete Sprint 2 feature completion table and selected 
program, test and reviewed integration evidence. 
C 
All Sprint 3 contracts/AC/STS, implemented progress with tests, and the explicit remaining-work 
plan. 
D 
Complete current SRS, feature inventory, System-Level SDS and 
requirements-to-feature-to-sprint-to-verification results matrix. Include baseline changes and 
coverage gaps. 
E 
Integrated candidate demonstrations, build/regression/CI/deployment output, release readiness, 
setup summary and completion plan for 13 December. 
 
Appendices are part of the same PDF. There is no fixed PDF page limit. Keep diagrams, tables, logs and 
screenshots readable at normal viewing size; a document link does not replace the required document.  
4.2 Selected execution and process evidence 
Program demonstrations 
Use captioned screenshots or screen dumps of the selected running workflows. Give feature/AC IDs, role, 
starting conditions, brief steps, expected and actual results, and tested version. Show retrieval of saved data, 
a meaningful rule rejection, and backend/API evidence for a forbidden role or ownership operation. A UI 
screenshot alone does not establish persistence or backend protection.
```

#### D2 PDF page 5 — full page

```text
Tests and history 
Include actual commands, commit IDs and readable build/test/CI output with passing, failing and skipped 
counts. Embed two short actual automated test excerpts with the relevant setup/assertions and execution 
results: one domain or cross-feature rule and one access restriction. Show meaningful TDD red/green 
evidence and the associated versions. Include two selected Issue/PR chains with branch, author/reviewer, 
substantive review, staging integration and release history; preserve IDs and dates. 
Choose two meaningful Sprint 2 features and at least one implemented Sprint 3 workflow/rule for the 
program evidence. Include a short continuity demonstration of the original Sprint 1 journey. The selected 
evidence must support the full completion/status tables, not replace them. 
Reproduction and safe access 
Include a concise setup summary: dependencies, environment-variable names/examples, 
Docker/build/run/test commands, database migration/seed and deployment procedure. Keep the detailed 
README current. Use synthetic data and provide safe test accounts through the private course handoff or 
local seed procedure. Do not include real passwords, tokens or production secrets in the PDF or Git. 
Keep the assessed deployment and repository available through grading; the instructor will announce the end 
of the access period. Graders may make targeted checks when embedded evidence is unclear or inconsistent. 
Later commits must not silently replace the submitted version. 
5 Submission checklist 
●
The PDF contains every required part and a page-based navigation table; the rubric totals 70 points. 
●
The full required engineering documents and selected evidence appear inside the PDF. 
●
Feature and requirement statuses disclose incomplete, failed and skipped work. 
●
Program, test, CI and deployment evidence identify the assessed versions. 
●
The submitted release is on main, accessible, deployed and reproducible. 
●
Relevant UAT/change findings and known defects or debt are accounted for. 
●
All Sprint 2 features are complete; Sprint 3 working progress and bounded remaining work are 
demonstrated.
```


### Appendix A — F — `project_final_delivery_v1.pdf`

#### F PDF page 1 — full page

```text
CPE 334 Final Project Delivery 
Complete integrated and verified product release
Due 13 December 2026 | 100 points | Semester 1/2026 
1 Purpose and assessment 
Final Delivery proves that your team can finish, integrate, verify and release the complete product. Deliver 
the agreed product scope across all three sprints, demonstrate its behavior on the final deployed version, and 
provide a clear engineering handoff supported by tests and independent verification. 
Use the same two students, assigned theme and repository. The product scope is established by the Group 
Work Specifications document and recorded approved changes. This assessment is worth 100 points and 10% 
of the course grade, completing the 250 project points and 25% course weight. Labs 5–7 retain their separate 
100-point assessments. 
Part 
Points 
What you must demonstrate 
A Final working product 
35 Complete major workflows and correct 
integrated behavior 
B Engineering process and team evidence 
15 Credible history and meaningful participation by 
both students 
C Final requirements and verification 
traceability 
20 Entire baseline mapped to final verification 
results 
D Final QA and Product Definition of Done 
20 Final tests, UAT, defect status and reproducible 
deployment 
E Demonstration video 
10 Actual running product explained by both 
students 
Total 
100  
 
2 Required final outcome 
●
Complete the required baseline features across Sprints 1–3, including approved changes. Provide an 
explicit status for every requirement and feature. 
●
Release the accepted product on main and deploy the same version on GCP with durable data and 
current setup instructions. 
●
Verify major workflows, business rules, errors, persistence, authentication and backend permissions 
on the integrated product. 
●
Finish automated regression verification and relevant independent UAT/re-tests; resolve accepted 
critical defects and disclose any remaining blockers.
```

#### F PDF page 2 — full page

```text
●
Submit one self-contained final PDF and a demonstration video of at most 10 minutes with meaningful 
participation by both students. 
This is a complete-product assessment. Final results must come from the final version. Earlier lab or sprint 
evidence may explain history, but an old passing test run alone does not prove that the final release still 
works. 
3 Required engineering work 
3.1 Part A Final working product 
35 points 
Complete workflows and domain rules 
Provide a complete feature/completion table, then demonstrate major journeys that span the product’s 
three-sprint scope. Show the relevant transitions, calculations and effects on related records. Verify 
important negative/boundary cases and invalid transitions. The product must fulfil its stakeholder brief; basic 
CRUD pages without the specified domain behavior are insufficient. 
Persistence access and error handling 
Demonstrate retrieval of persisted results, useful validation/error feedback and recovery from expected 
failures. Use real backend authentication, role permissions and record ownership for every protected 
workflow. Check unauthenticated requests, forbidden roles and cross-user records where applicable, 
including endpoints added after Sprint 1. A role selector or hidden UI control does not establish access 
protection.
```

#### F PDF page 3 — full page

```text
3.2 Part B Engineering process and team evidence 
15 points 
Maintain the engineering chain over all three sprints: requirements/contracts before implementation, Issues, 
bounded feature/fix branches, meaningful tests, teammate reviews, staging integration, release PRs and 
recorded main releases. Preserve justified contract changes and meaningful TDD evidence for rule, defect or 
change work. Provide a concise release/history table and two selected Issue/PR chains from different sprints. 
3.3 Part C Final requirements and verification traceability 
20 points 
Include the complete final SRS, feature inventory, System-Level SDS and feature contracts with AC/STS. They 
must describe the released behavior, including approved scope changes and final data/access/deployment 
design. Put detailed documents in appendices within the same PDF and refer to their pages. 
Account for every baseline FR/BR and important NFR through feature/responsibility, sprint, AC or 
verification target, planned test, actual file/test or measurement, execution result and final version. Compare 
NFR results with the specified measurable targets. Where appropriate, include an actual access check rather 
than inventing a performance measurement that your SRS never required. 
Requirement and 
feature 
AC or target 
Actual verification 
Final result and version 
Use stable IDs 
Observable outcome 
or measured target 
Test ID; file/name or 
measurement method 
PASS/FAIL/SKIPPED/I
NCOMPLETE; commit 
 
Do not silently delete requirements, conceal coverage gaps or label a planned check as passing. Record 
approved changes and all failed, skipped or incomplete work explicitly. Honest disclosure helps assess 
readiness but does not establish missing functionality.
```

#### F PDF page 4 — full page

```text
3.4 Part D Final QA and Product Definition of Done 
20 points 
Final tests and independent acceptance 
Run the final build and meaningful automated/regression suite against the final commit. Include execution 
counts/results, relevant test assertions, integration/system checks and acceptance results. Required tests 
must remain enabled and their assertions meaningful. Reuse the independent UAT cases from Lab 6 where 
relevant, then re-test affected journeys after fixes and changes; record tester, expected/actual result and 
version. A developer’s self-check does not replace independent acceptance. 
Defects deployment and handoff 
Provide final defect status, severity, affected behavior, fix/re-test version and any blockers. Deploy the 
assessed final release through the delivery pipeline and retain post-deployment checks. Include reproducible 
Docker/setup, configuration examples, migration/seed and build/test/deployment procedures. Confirm the 
application can retrieve durable data after the expected restart/redeployment operation. 
Definition of Done and remaining debt 
Review the Product Definition of Done against evidence: required behavior, tests, review/integration, 
independent acceptance, deployment, documents and configuration. List known defects, limitations and 
technical debt with impact and a sensible next action. Technical debt is a design or implementation 
compromise that makes future work harder; it is not a substitute label for unfinished required features. 
Identify unresolved blockers plainly. 
3.5 Part E Demonstration video 
10 points | Maximum 4 minutes 
Record a demo of the actual running final product. Both students must appear to be presenting the work 
together, not working separately on a video conference call.  Identify the deployed version and show the 
major workflows, an important business rule, and a rejected/failure case. Slides may introduce context but 
cannot replace program execution. 
Suggested segment 
Content 
Introduction 
Team, theme and final version 
Product demonstration 
Major journeys, persisted result, and rule rejection 
Closing 
Completion and any known limitations 
The assessment rewards clear evidence rather than cinematic editing, accents or presentation polish. Provide 
video access and timestamps in PDF Part E; a separate demo video is required only at this final checkpoint.
```

#### F PDF page 5 — full page

```text
4 What to submit 
Submit one self-contained PDF per team through LEB2 by 13 December 2026 at 23:59. Include the complete 
documents required below and selected execution evidence. Maintain source documents, code and tests in 
the repository as well. Graders should be able to read the assessed engineering work without opening 
separate specification files. 
At the beginning, identify both students and IDs, the theme/context, one repository URL, the immutable 
submitted tag/commit, the deployed application URL and its version. Include a contents/navigation table 
mapping each rubric part to PDF pages and IDs. Use internal page references for evidence; keep external 
links for the repository, deployment and final video where required. 
4.1 PDF contents 
Part 
Include directly in the PDF 
A 
Complete product completion table and selected final program demonstrations, including 
persistence, a rule rejection and access restrictions. 
B 
Selected workflow/history evidence across all three sprints, two reviewed Issue/PR chains, both 
students’ contributions and brief AI-use declaration. 
C 
Complete final SRS, feature inventory, System-Level SDS, all feature contracts/AC/STS, and final 
requirement-to-verification results matrix. Use appendices and internal page references to avoid 
duplication. 
D 
Final build/test/CI output, selected test excerpts, UAT and re-test records, defect/debt register, 
DoD review, deployment evidence and reproducible setup summary. 
E 
Video title, access reference, assessed release and a short timestamp index. The actual video is 
submitted separately as a YouTube link. Make sure to allow viewing for those with a link. 
Appendices are part of the same PDF. There is no fixed PDF page limit. Keep diagrams, tables, logs and 
screenshots readable at normal viewing size; a document link does not replace the required document. 
Include a short contribution table, AI-use declaration and known limitations once, then refer to their pages. 
4.2 Selected execution and process evidence 
Program demonstrations 
Use captioned screenshots or screen dumps of the selected running workflows. Give feature/AC IDs, role, 
starting conditions, brief steps, expected and actual results, and tested version. Show retrieval of saved data, 
a meaningful rule rejection, and backend/API evidence for a forbidden role or ownership operation. A UI 
screenshot alone does not establish persistence or backend protection.
```

#### F PDF page 6 — full page

```text
Tests and history 
Include actual commands, commit IDs and readable build/test/CI output with passing, failing and skipped 
counts. Embed two short actual automated test excerpts with the relevant setup/assertions and execution 
results: one domain or cross-feature rule and one access restriction. Show meaningful TDD red/green 
evidence and the associated versions. Include two selected Issue/PR chains with branch, author/reviewer, 
substantive review, staging integration and release history; preserve IDs and dates. 
For the final assessment, choose the two workflow/history samples from different sprints. Include actual final 
NFR measurements or access checks against their defined targets, and the latest relevant independent 
UAT/re-test records with tester and release IDs. 
Reproduction and safe access 
Include a concise setup summary: dependencies, environment-variable names/examples, 
Docker/build/run/test commands, database migration/seed and deployment procedure. Keep the detailed 
README current. Use synthetic data and provide safe test accounts through the private course handoff or 
local seed procedure. Do not include real passwords, tokens or production secrets in the PDF or Git. 
Keep the assessed deployment and repository available through grading; the instructor will announce the end 
of the access period. Graders may make targeted checks when embedded evidence is unclear or inconsistent. 
Later commits must not silently replace the submitted version. 
5 Submission checklist 
●
The PDF contains every required part and a page-based navigation table; the rubric totals 100 points. 
●
The full required engineering documents and selected evidence appear inside the PDF. 
●
Feature and requirement statuses disclose incomplete, failed and skipped work. 
●
Program, test, CI and deployment evidence identify the assessed versions. 
●
The submitted release is on main, accessible, deployed and reproducible. 
●
Relevant UAT/change findings and known defects or debt are accounted for. 
●
The YouTube video link that has view permissions for those with a link.
```


## Appendix B. Coverage and provenance check

| Source | PDF pages | Retained pages | Coverage |
|---|---:|---|---|
| G: `group_work_specs_v1.pdf` | 15 | 1, 2, 3, 4, 6, 7, 9, 10, 11, 12, 13, 14, 15 | All common requirements + Theme 6; unrelated themes omitted |
| D1: `project_deliverable_1_v1.pdf` | 8 | 1, 2, 3, 4, 5, 6, 7, 8 | All pages, full extracted text |
| D2: `project_deliverable_2_v1.pdf` | 5 | 1, 2, 3, 4, 5 | All pages, full extracted text |
| F: `project_final_delivery_v1.pdf` | 6 | 1, 2, 3, 4, 5, 6 | All pages, full extracted text |

### Key source-to-handoff mapping

| Requirement group | Source pages | Main sections |
|---|---|---|
| Purpose/team/weights/schedule | G 1–3 | 2,4 |
| Technical/auth/delivery/theme eligibility | G 3–4 | 2,5 |
| Theme 6 exact brief | G 6–7 | 6 |
| Sprint model/contracts/Git/AI | G 9–11 | 7,9–11 |
| Project rubric overview | G 11–13 | 12,16,17 |
| Labs 5–7 | G 13–15 | 13–15 |
| Submission/evidence conventions | G 15 | 18–19 |
| Complete D1 | D1 1–8 | 9–12,18 |
| Complete D2 | D2 1–5 | 10,16,18 |
| Complete Final | F 1–6 | 10,17–18 |
| Video/rubric/report differences | G 11,13,15; F 1,2,4,5; D1 5–7; D2 4 | 3,17 |

### Original PDF SHA-256 hashes

Hashes identify these exact supplied source bytes; they do not prove instructor approval or later version freshness.

- `group_work_specs_v1.pdf`: `ec2476f85df139cab5bd78b937364149baf5b16f5f16adb2a27e1030451cda6b`
- `project_deliverable_1_v1.pdf`: `0ad89f372309904fafd96fd5d376ff020f771f11a47264338629306d122dc03c`
- `project_deliverable_2_v1.pdf`: `6c1372855c3600d75344adcfc9ce342f119e738f476420e00b5d127f6cc8581e`
- `project_final_delivery_v1.pdf`: `3833f72dcd7de509e7dc6e048e0f6fe42df7223c5af7c1206f9cf4c874ed8757`

### Completion of this handoff

- This file consolidates all shared requirements relevant to Theme 6 from the four supplied PDFs.
- The proposed feature plan, schema, routes, test IDs and policy choices are explicitly marked as proposals.
- No actual product implementation, passing tests, PR review, UAT execution, TA approval, cloud deployment or course submission is claimed.
- Reconcile later official announcements with this baseline and preserve a change log.
