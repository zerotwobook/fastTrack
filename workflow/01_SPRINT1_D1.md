# รอบ 1 — Sprint 1: ระบบหลักที่ใช้งานจริง และ Deliverable 1

> Language policy: conversation may be Thai; all newly authored or revised project content must be English. Read [SKILL_Project](../skill/SKILL_Project.md) and [AGENTS.md](../AGENTS.md). Translate legacy sections when editing them; unrelated existing sources are outside this change.

> แผนแบ่งงาน fastTrack | จัดทำ 5 พฤศจิกายน 2026 | ทบทวน 6 พฤศจิกายน 2026 | สถานะเริ่มต้น: Backlog
> A = คุณผู้ใช้, B = เพื่อนร่วมทีม ทั้งสองเป็นนักพัฒนาและ reviewer สลับกัน
> วันส่ง D1: 8 พฤศจิกายน 2026 เวลา 23:59 น. (Asia/Bangkok)
> ไฟล์นี้เป็นคำสั่งทำงานและเกณฑ์ตรวจ ไม่ใช่หลักฐานว่าทำเสร็จแล้ว

เริ่มใช้งานจาก [คู่มือเริ่มต้นและกติกาทำงานร่วมกัน](README.md) แล้วเลือก Task ID ในไฟล์นี้ ทำครั้งละหนึ่งงานต่อคน ไม่ต้องอ่านทั้งสามรอบใหม่ทุกครั้ง

ก่อนเริ่มพัฒนาหรือแก้แอป อ่าน [SKILL_Project](../skill/SKILL_Project.md) เพื่อใช้กติกาโฟลเดอร์โค้ด การแบ่งงาน/branch และแบบ UI ร่วมกัน

## 0. อ่านก่อนเริ่ม: ภาพรวมทั้งโปรเจกต์

ใช้แอปและ repository เดียวต่อเนื่อง แบ่งเป็น 3 รอบตาม Sprint แต่ในแต่ละรอบมีงานย่อยและจุดตรวจร่วมหลายครั้ง

| รอบ | งานพัฒนาหลัก | งานส่งที่เกี่ยวข้อง | ไฟล์แผน |
|---|---|---|---|
| 1 | F-01–F-04: identity, milestone, first submission, feedback | D1 วันที่ 8 พ.ย. | ไฟล์นี้ |
| 2 | F-05–F-07: planning, revisions, progress; delivery/UAT/maintenance | Lab 5 วันที่ 15 พ.ย.; Lab 6 วันที่ 22 พ.ย.; เตรียม Lab 7 วันที่ 29 พ.ย.; S2 สำหรับ D2 | [รอบ 2](02_SPRINT2_LABS5-7.md) |
| 3 | F-08: summary/filter/drill-down; final integration/QA | D2 และปิดการส่ง Lab 7 วันที่ 29 พ.ย.; Final วันที่ 13 ธ.ค. | [รอบ 3](03_SPRINT3_D2_FINAL.md) |

กำหนดส่งทุกวันเป็นปี 2026 เวลา 23:59 น. แผนภายในตั้งเป้าจบ S2 ภายใน 24 พ.ย. เพื่อให้ S3 มี workflow ที่ทำงานและทดสอบจริงก่อน D2 ไม่เลื่อนเริ่ม S3 ไปหลังส่ง D2

มีงานส่ง 6 ชุด: D1, Lab 5, Lab 6, Lab 7, D2 และ Final ทั้งหมดต้องเก็บ version/หลักฐานของตน แม้บางงานใช้ release เดียวกัน

## 1. Source of truth และ skill ที่ AI ต้องอ่าน

อ่านตามลำดับก่อนเริ่มงานหรือเมื่อบริบทเปลี่ยน:

1. [Project detail](../Project_doc/project_detail.md) โดยเฉพาะ §2–7, §8 UI, §9 API, §11 tests, §12 workflow และ §14–16 readiness
2. [D1 ฉบับร่าง](../deliverable%20_file/submit/project_deliverable_1.md) Parts A–F; Part E เป็น S1 contracts/AC/STS ที่ต้องใช้
3. [ข้อกำหนดภาพรวม](../deliverable%20_file/summary_final_deliverable.md) §4 schedule, §11 workflow, §12 D1 และต้นฉบับที่อ้างถึง
4. **[Git/GitHub skill](../skill/SKILL_Github.md) อ่านทั้งไฟล์ก่อนทำ Git/Issue/PR**
5. **[UI skill](../skill/SKILL_UI.md) อ่านทั้งไฟล์ก่อนสร้างหรือแก้ UI** และใช้ brief fastTrack ใน project detail §8 เป็นทิศทางหลัก
6. อ่าน `AGENTS.md`/`CONTRIBUTING.md` ที่มีจริงและเกี่ยวกับ path งาน หากมีเพิ่มภายหลัง

ใช้ Feature IDs ของ project detail v0.5 และ D1 v0.2: F-01–F-08; summary เก่าบางส่วนใช้ F-01–F-13 ห้ามนำเลขคนละชุดมาปะปน หากแบบ/รายงานเปลี่ยนให้ตรวจ revision ล่าสุด ไม่ถือเลข version ในแผนนี้เป็นเหตุให้ละเลยการเปลี่ยนแปลงที่อนุมัติแล้ว

โจทย์ต้นฉบับกำหนดสิ่งที่ต้องส่ง; project detail กำหนด baseline ของ fastTrack; ไฟล์ workflow กำหนดเจ้าของ/ลำดับ/การตรวจร่วม หากขัดกันให้บันทึกข้อขัดแย้งและผลกระทบก่อนเปลี่ยน scope ห้ามเพิ่ม scope จากตัวอย่าง TokTickIT เอง

## 2. สถานะเริ่มต้นและการใช้แผน

ตรวจเมื่อจัดแผน: `Project_code/` ยังไม่มี app files; มีเอกสารแบบและ D1 draft; ยังไม่มี execution evidence ที่พิสูจน์ working Sprint 1 ในการตรวจครั้งนี้ AI ในอนาคตต้องตรวจสถานะใหม่ก่อนลงมือ ห้ามเขียนทับงานที่เกิดขึ้นหลัง snapshot นี้

เติมข้อมูลจริงใน Issue หรือ PR แรกของรอบ:

| Item | Current information |
|---|---|
| A / GitHub | Supapanya Yathip / 67070503443 / zerotwobook |
| B / GitHub | Atip Infa-udom / 67070503446 / Atip-Infa |
| Availability | A reports both members are available full days on 6-7 November 2026; exact net hours are not measured |
| Repository | zerotwobook/fastTrack; public; both accounts have verified access |
| Sprint integration | staging/sprint-1; all task PRs target this branch until S1 is accepted |
| Source baseline | G0 head d57b3eca4c60092667291ac314d5255dc09f137f; accepted staging merge 30fc5ef9fa6e0aa39332a0127541341f5b5e1fcf |
| Theme eligibility | B's ID ends in 6, matching Theme 6 under Group specs section 6, page 4 |
| Gate record | G0/G1 and A01/B01/A02 accepted. B approved #57 at f6c4988 and merged staging as 3365a36; #7 is closed Done/PASSED/ACCEPTED. G2 was accepted under the recorded task-specific user delegation. A prepared R1-A03 in #59 for peer review while B owns F-04 separately. G3/G4/G5 and the main release remain pending. |

AI ต้องเริ่ม session โดยระบุว่าทำงานให้ A หรือ B และ Task ID ใด หาก prompt ระบุไว้แล้วให้ใช้ตามนั้น หากยังไม่ทราบ owner ให้ทำได้เฉพาะการตรวจ/เตรียมขอบเขตที่ไม่ชนงาน แล้วถาม owner ก่อนเริ่ม implementation ของคนใดคนหนึ่ง

## 3. Branch และกติกาการทำงานทุกงาน

### 3.1 โครง branch

- `main`: reviewed planning baseline ช่วงเริ่มต้น แล้วใช้ accepted releases เมื่อมีแอป; bootstrap ตาม README ข้อ 3.2
- `staging/sprint-1`, `staging/sprint-2`, `staging/sprint-3`: integration branch ของแต่ละรอบ ใช้ทีละรอบเป็นหลัก; สร้างรอบถัดไปจาก accepted main release
- **ทุกงานใหม่ต้องสร้าง task branch ใหม่ก่อนแก้ไฟล์** เช่น `feature/s1-a-f01-auth`, `feature/s1-b-f02-milestones`, `docs/s1-a-contracts`, `fix/s1-b-feedback-validation`
- ใช้ชื่อ Task ID/Issue จริงเมื่อมี; `R1-A01` ในแผนเป็นรหัสแผน ไม่ใช่ GitHub Issue number
- ไม่พัฒนาโดยตรงบน main/staging ไม่สร้าง staging เพิ่มต่อทุก Lab หรือทุก PDF
- การแก้ review หรือกลับมาทำ Issue เดิมให้ใช้ branch/PR เดิม ตรวจว่าตรงงานจริงก่อน resume ไม่แตก branch ซ้ำทุกข้อความ

### 3.2 ก่อนเริ่มแก้ทุกครั้ง

1. อ่าน skill; ตรวจ current branch, status, staged/untracked files, remote/upstream และ base ล่าสุด
2. ตรวจ Issue/PR/dependencies และผล checkpoint ที่เกี่ยวข้องจากหลักฐานจริง
3. หากมีงานที่ยังไม่ commit ห้าม reset/clean/stash ทั้งชุดหรือ commit งานคนอื่นเพื่อให้ tree สะอาด แยกเฉพาะไฟล์ที่ได้รับมอบหมาย หรือใช้ checkout/worktree แยกเมื่อเหมาะสม
4. งานใหม่ให้สร้าง branch จาก staging ปัจจุบันที่ sync แล้วอย่างไม่ทำลายงาน; bootstrap ครั้งแรกต้องตรวจและสร้าง staging จาก baseline ที่ทีมยอมรับก่อน
5. หากเป็นงานต่อเนื่อง ให้ยืนยัน branch/PR เดิมและทำต่อบน branch นั้น

คำสั่งตัวอย่างสำหรับ clean working tree เท่านั้น; แทนค่าและตรวจ state ก่อนใช้:

```bash
git status --short --branch
git fetch origin
git switch staging/sprint-1
git pull --ff-only origin staging/sprint-1
git switch -c feature/s1-a-f01-auth
```

การสร้าง staging ครั้งแรก การ sync main กลับ staging หลัง release และการใช้ branch แยก A/B ดู [README กติกา branch ข้อ 3](README.md) ให้ทำตามกติกาเดียวกันทุกไฟล์

### 3.3 PR/review/release

Author รัน checks และส่ง diff/ผลจริงให้ reviewer อีกคน; reviewer ตรวจ behavior, assertions, scope และผลกระทบ พร้อมระบุสิ่งที่ตรวจอย่างเจาะจง ห้าม author approve งานตนเอง และ AI review ไม่แทน teammate review

AI เตรียม commit/PR ได้ตามคำสั่งและสิทธิ์ที่ให้ แต่แผนนี้ไม่อนุญาตให้ AI อนุมัติแทนคนหรือ merge เองตาม skill ผู้มีสิทธิ์/เพื่อน reviewer เป็นผู้อนุมัติและ merge หรือให้คำสั่ง merge ที่ชัดเจนภายหลัง พร้อมผ่าน protection จริงก่อนเสมอ การส่งข้อความ/comment ถึงคนอื่นให้ทำเมื่อได้รับคำสั่งส่งอย่างชัดเจน

PR เข้า staging ต้องตรวจ Issue linkage จริง อย่าสมมติว่า `Closes #...` จะปิด Issue บน non-default branch อัตโนมัติ เก็บ milestone/tag/commit ของ accepted release แบบไม่ย้ายย้อนหลัง

## 4. ทิศทางแอปที่ต้องรักษาทั้ง A และ B

fastTrack เป็นระบบจัดการโครงงานรายวิชาเดียว มี Student และ Supervisor ใช้งานจริงผ่าน UI → API → PostgreSQL

- Student อยู่ได้หนึ่งทีม; Supervisor เห็นเฉพาะทีมที่ตนดูแล
- ส่งงานด้วย URL; ไม่มี file upload, grades, chat, self-registration, password recovery, email notification หรือระบบหลายรายวิชาใน baseline
- S1 มี submission version 1 ได้หนึ่งรายการต่อ milestone; deadline เข้มงวด; revisions เริ่ม S2
- Feedback เป็น append-only ผูก submission ID ของ version นั้น ไม่ใช่การให้คะแนนหรือ approve งาน
- UI ขาว/ดำ/เทา ใช้ Inter + Noto Sans Thai; milestone track เป็นองค์ประกอบหลัก; ไม่เพิ่มเมนู S2/S3 ที่ยังใช้งานไม่ได้
- สถาปัตยกรรมเสนอ: React/TypeScript/Vite, Express/TypeScript, PostgreSQL/Prisma, Vitest/Supertest และ Playwright ให้ pin versions/lockfile ที่ตรวจได้จริงตอน setup
- Role/ownership/deadline ตรวจที่ backend; UI ซ่อนปุ่มเพื่อการใช้งานเท่านั้น

Read models/error envelopes, ลำดับ validation, เวลาระดับ millisecond, CSRF/session และ retry semantics ให้ตาม project detail §5, §7 และ §9 ไม่ใช้ทางลัดที่เปลี่ยนกฎโดยไม่อัปเดต contract

## 5. ภาพรวมเจ้าของงานและลำดับร่วม

| Task | เจ้าของหลัก | Reviewer | งาน | Dependency |
|---|---|---|---|---|
| R1-J00 | A+B | ตรวจร่วม | ตกลง baseline, identities, scope/branches/DTO และเวลาว่าง | ไม่มี |
| R1-A00 | A | B | Project scaffolding, scripts, env contract, API app/router skeleton | G0 |
| R1-B00 | B | A | Schema/migrations/seed/test fixtures และ migration safety | G0; ออกแบบ schema/fixtures ได้ทันที แต่เริ่ม runnable implementation หลัง scaffold/scripts ของ R1-A00 merge และ sync แล้ว |
| R1-A01 | A | B | F-01 auth/session/team context ครบ UI/API/tests | G1 |
| R1-B01 | B | A | F-02 milestone create/list/detail ครบ UI/API/tests | G1; integrate กับ A01 ที่ G2 |
| R1-A02 | A | B | F-03 submission/deadline/duplicate/retrieval ครบ UI/API/tests | G2 |
| R1-B02 | B | A | F-04 feedback/retry/association ครบ UI/API/tests | G2; submission contract ที่ freeze แล้ว |
| R1-J03 | A+B | ตรวจข้าม | Integrated tests, clean setup, restart และ UX | G3 |
| R1-A03 | A | B | D1 Parts A/B/D และ domain/TDD evidence | เก็บระหว่างงาน |
| R1-B03 | B | A | D1 Parts C/E และ access/feedback/UI evidence | เก็บระหว่างงาน |
| R1-J04 | A+B | ตรวจร่วม | Part F, main release, PDF และ submission checklist | G4 |

แต่ละคนรับฟีเจอร์ครบทั้ง UI/API/tests/documentation ของตน ไม่แบ่งถาวรเป็นคนหนึ่งเขียน backend อีกคนทำเอกสาร สมาชิกอีกคนต้องลองใช้งานและ review ของเพื่อนทุกช่วง

```text
G0 baseline agreed
    ├─ A minimal scaffold/scripts       └─ B schema/UI contract และ test design
    → B review + merge scaffold → B sync แล้วทำ schema/seed/shared UI
    → A review migration/seed; B review scripts → G1 foundation
    ├─ A F-01 auth/team context         └─ B F-02 milestones
    → รวม auth จริง + milestones → G2
    ├─ A F-03 submission/deadline       └─ B F-04 feedback
    → G3 full journey → G4 verification → G5 accepted D1 release/PDF
```

Scaffold เป็น PR เล็กที่รัน build/test harness ได้ ยังไม่ต้องมี auth หรือ business feature จึงไม่รอ schema/auth จนเกิด dependency วน ระหว่าง B ทำ schema A เตรียม auth tests/design บน contract ที่ตกลงได้; การรับ F-01/F-02 ต้องรันกับ schema/session จริงหลัง G1

## 6. ขอบเขตไฟล์และข้อตกลงก่อนทำขนาน

Path ต่อไปนี้เป็นพื้นที่เป้าหมายจากแบบ ยังต้องสร้างจริงและยืนยันตอน G0; paths `client/`, `server/`, `e2e/` และ app root/package/lockfiles ในตารางนี้อยู่ภายใต้ `Project_code/` ยกเว้น path ระดับ repository ที่ระบุเต็ม:

| พื้นที่ | ผู้แก้หลักในรอบนี้ | วิธีประสาน |
|---|---|---|
| `Project_code/client/src/features/auth/`, `server/src/modules/auth/`, session/role/CSRF middleware | A | B ใช้ public interface ที่ตกลง ไม่คัดลอก auth อีกชุด |
| `server/src/modules/teams/` ส่วน scoped reads และ UI team context | A | B ใช้ Team DTO/queries; planning ยังไม่ทำ |
| `client/src/features/milestones/`, `server/src/modules/milestones/` | B | A ใช้ milestone DTO และร่วมกำหนด submission integration |
| `client/src/features/submissions/`, `server/src/modules/submissions/` | A | B แยก FeedbackPanel/component ของตนให้ A ประกอบในหน้าหลัก |
| `client/src/features/feedback/`, `server/src/modules/feedback/` | B | อ่าน exact submission ID ไม่ผูก latest แบบลอย ๆ |
| `server/prisma/` | B เป็นผู้รวม schema/migration | A เสนอ schema diff ก่อน; serialize migration PRs และทดสอบบนฐานใหม่ |
| Root/package manifests, lockfiles, API/router composition | A เป็นผู้รวม | B ขอ dependencies/routes ผ่าน PR ที่ตกลง; ห้ามแก้ lockfile คนละชุดโดยไม่ sync |
| Shared UI tokens/components | B เป็นผู้รวม | A ใช้ tokens เดียวกัน; shared API client/session cache A ดูแล |
| `Project_doc/project_detail.md`, รายงาน D1 | แบ่ง section ตาม §5; B รวมเอกสารรอบสุดท้าย | แจ้งก่อนแก้ section เดียวกัน; ห้ามใช้ไฟล์เอกสารเป็น status ที่สองชุดขัดกัน |

ใช้คนละ clone/working directory สำหรับ A/B ห้ามทำคนละ branch พร้อมกันใน working directory เดียว หากอยู่เครื่องเดียวให้ใช้ worktrees ที่แยกจริงและตรวจ path/branch ก่อนทุกครั้ง

Freeze ที่ G0: envelope `{data}`/`{error}`, UUID, field names, API prefix `/api`, auth middleware signature, team scope queries, DB transaction client, shared clock/lock helpers, route composition, DTOs และ local same-origin proxy

ผู้พัฒนา dependent feature เริ่ม contract/unit/component/fixtures ได้เมื่อ interface ตกลง แต่ต้องระบุว่าใช้ fixture และยังไม่ผ่าน integrated acceptance ห้ามข้าม auth จริงเพื่อทำให้ demo ดูเสร็จ

## 7. รายละเอียดงาน A — คุณ

### R1-A00: Scaffold and environment

Owner A; reviewer B. Dependency: accepted G0, [PR #44](https://github.com/zerotwobook/fastTrack/pull/44). Task branch: `build/s1-a-scaffold` from accepted staging merge `30fc5ef`. App source remains under `Project_code/`.

- [x] Inspect the actual tree/runtime before creating client, server, e2e and docs/contracts/evidence/decisions.
- [x] Set up compatible pinned TypeScript/build/test scripts and one npm workspace lockfile; no authentication or business feature in this task.
- [x] Document verified Node/npm/package versions, observed PostgreSQL image version, exact working directories and commands in [the technical README](../Project_code/README.md). Actual DB integration remains B00.
- [x] Configure `/api`, safe errors/generated request IDs, environment validation and the same-origin Vite proxy. Keep JSON parsing behind each protected route's session/role/source checks.
- [x] Record explicit module export/composition seams in [the contract](../Project_code/docs/contracts/sprint-1-module-boundaries.md); A owns composition/manifests/lockfile and B owns milestone/feedback modules.
- [x] Add server `.env.example` and ignore rules; no real credentials, local env or generated files enter Git.
- [x] Add and unit-test the distinct test-database guard. No reset, schema, migrate or seed command is invented before B00.
- [x] Run install/typecheck/test/build in a fresh clone and verify dev/proxy/compiled-server/browser smoke. Record actual checks and limits in [A00 evidence](../Project_code/docs/evidence/R1-A00-scaffold.md).
- [x] B reproduced the scaffold and approved PR #45 at 292934b; actual review/merge is recorded on GitHub.
- [x] The reviewed scaffold merged into staging/sprint-1 as 1a5e063 and unblocked B00. This acceptance does not pass G1 or authorize F-01/F-02 before the joint foundation check.

B's review covers the file tree, manifests/lockfile, runtime, env names, API bootstrap, parser order, safe errors, test-DB guard and source ownership. The native tracked-PR merge rule moves its card to Done only after an actual merge; task-Issue completion and gate acceptance must be reconciled from evidence separately.

### G1 audit before dependent implementation

A's independent audit is [Issue #49](https://github.com/zerotwobook/fastTrack/issues/49), branch `test/s1-a-g1-foundation`, [PR #50](https://github.com/zerotwobook/fastTrack/pull/50). B00 was approved/merged in PR #48, with foundation reproduction explicitly deferred to G1.

A's original audit reproduced eight foundation failures. B's PR #53 candidate fixed the original checks, but independent review found three blocking groups: canonical bounds, fixture-client isolation and migration atomicity. The user authorized A to finish those corrections, with B as the real peer reviewer. A incorporated B's commits into PR #50 without rewriting B's branch, then retained RED regression evidence before fixing the failures.

The combined executable source at `6f3601ec1af3f0b7039bce175251642d1920c40c` passes a clean-clone install, generation, fresh/repeat migrations, typecheck, 51 unit tests, production build, 38 G1 tests and seven upgrade/rejection scenarios. See [the audit evidence](../Project_code/docs/evidence/R1-G1-A-foundation.md) and [migration adoption note](../Project_code/docs/decisions/0002-g1-migration-adoption.md).

Corrective [Issue #51](https://github.com/zerotwobook/fastTrack/issues/51) transferred to A by explicit authorization. The actual handoff moved #49/#50 Started -> PR Review and #51 Fixing -> PR Review. B approved the current PR #50 head 6a5de5f and merged it into staging as ff5975c. A verified that merge tree against the tested source and accepted G1; #49/#51 are closed Done/PASSED/ACCEPTED. B's earlier scaffold reproduction remains the recorded B command evidence; do not invent a new B run. PR #53 is closed unmerged/archived as superseded. A01/B01's G1 dependency is removed; G2 and main release remain separate.

### R1-A01: F-01 identity and authorized team context

References: project detail 3/7.5/8/9.1-9.4; D1 E.1; AC-01.1-01.5, T-01-T-05/T-23/T-27. Owner A; reviewer B. Issue #5, PR #54, branch feature/s1-a-auth from accepted staging ff5975c. Implementation/tested source: 2899d1b. [Contract](../Project_code/docs/contracts/sprint-1-auth.md); [evidence](../Project_code/docs/evidence/R1-A01-auth.md).

- [x] Implement login/me/logout and scoped team list/detail with allowlisted DTOs.
- [x] Verify existing scrypt hashes; store only opaque token hashes; use HttpOnly/SameSite host-only cookies, Secure for HTTPS and absolute eight-hour expiration.
- [x] Enforce JSON/custom-header/source login protection, source/CSRF mutation protection, me bootstrap and no-store responses.
- [x] Reject invalid/expired/revoked sessions; revoke the current browser session on re-login/logout; constrain return-to and clear account/private state including stale requests/history restoration.
- [x] Derive immutable identity/role/team scope from DB sessions, with reusable fail-closed middleware and explicit transaction-client scope helpers. No identity-header bypass.
- [x] Implement the established monochrome login, role-aware shell, team list/detail and loading/empty/error/retry/mobile/keyboard states; do not expose unintegrated milestone actions.
- [x] Verify no-team students, foreign-team denial, session effects and browser account switch/replay/history/expiry/recovery. Clean-clone checks pass 67 ordinary tests, 28 auth/DB tests, 38 G1 tests and seven migration scenarios.
- [x] B approved/reproduced A01 head 70dd0ce and merged #54 as 0b99a28. #5/#54 are Done/PASSED/ACCEPTED; #5 closed. G2 was subsequently accepted under the recorded user delegation; A02 may proceed.

B's recorded A01 review covers both roles, logout/replay, session/CSRF and role isolation at the approved head. That increment is accepted. B subsequently approved/merged A's B01 correction in #56; the remaining G2 UI check/acceptance was explicitly delegated by the user to A/AI and accepted using the actual recorded results. Native merged-PR Done and Issue closure/Acceptance remain separate.

### R1-A02: F-03 first submission

Owner A; reviewer B. Issue #7, branch feature/s1-a-submissions from accepted staging 78d0cca. References: project detail 4/5/7.4/8/9; D1 E.3; AC-03.1-03.6; T-09-T-16/T-25/T-26/T-31 local. [G2 acceptance](../Project_code/docs/evidence/R1-G2-acceptance.md); [concrete contract/test plan](../Project_code/docs/contracts/sprint-1-submissions.md).

- [x] Implement protected POST/GET milestone submissions and GET saved submission detail with server-derived author/version/time.
- [x] Reuse shared strict code-point/URL validation, real session guards and safe scoped DTOs; no client authority or clock override.
- [x] Use one transaction client with team -> milestone locks and membership/rule rechecks. Enforce cancelled -> duplicate -> deadline before insert.
- [x] Read the DB wall clock once after locks, truncated to milliseconds. Accept acceptedAt <= dueAt and persist the same submittedAt.
- [x] Enforce S1 version 1 and unique concurrency protection; map only known conflicts and retry confirmed rolled-back technical contention at most three attempts.
- [x] Implement form and persisted GET-backed detail, Bangkok times, safe external link, preserved values/error focus and truthful uncertain-result/teammate recovery. Add real milestone actions only where allowed.
- [x] Retain meaningful deadline RED -> GREEN/regression history; no disabled tests or false acceptance.
- [x] Verify exact before/equal/after 1ms, offsets/precision, real DB lock wait across dueAt, role/scope/CSRF, spoofing, validation, duplicates/precedence, no-write failures, app restart and browser persistence.
- [x] Publish the scoped-submission helper/DTO and version-specific FeedbackPanel slot for B; preserve B schema/fixtures/shared primitives/feedback branch.
- [x] B approved/reproduced current #57 head f6c4988 and merged as 3365a36; #7 closed Done/PASSED/ACCEPTED. G3/main release remain separate.

Technical verification at 1bf8d63 passes 111 ordinary, 48 A02, 33 B01, 28 auth, 38 G1 and seven upgrade cases from a fresh clone. Actual Chromium checks include persisted submit/reload, safe external links, host-zone-independent Bangkok time, supervisor/foreign denial, own/teammate uncertain-result recovery, explicit checked retry and a real deadline crossed in the open form. See [actual evidence](../Project_code/docs/evidence/R1-A02-submissions.md). B peer acceptance is recorded at merge 3365a36; earlier JSON snapshots remain historical.

### R1-A03: Owner A documentation and evidence

Owner A; reviewer B. Issue #10, branch docs/s1-a-d1-evidence from accepted staging 3365a36. [Package scope/assembly handoff](handoffs/R1-A03_D1_A_PACKAGE.md). This independent documentation task may proceed while B owns F-04; it does not accept G3 or release main.

- [x] Prepare English D1 A context/requirements/rules/exclusions, B full-product inventory/traceability and D three-sprint plan with real dependencies.
- [x] Package actual F-01/F-03 normal, deadline, auth/logout, build/test and genuine RED/GREEN evidence with exact tested sources.
- [x] Map AC -> actual file/name -> result -> commit; preserve NOT RUN/PARTIAL and release limitations.
- [x] Select the substantive domain-rule Issue/PR chain and real B peer review; record contract/test/implementation chronology.
- [x] Review current B C/E source and accepted clean-setup results; identify remaining assembly updates instead of claiming unreviewed final content is accepted.
- [x] Give B ready-to-use owned sections/captions/source images/results; B owns final C/E updates and PDF assembly.
- [ ] Complete actual B peer review/merge of this package in PR #59; final G3/G4/G5 and submission remain separate.

Document checks pass: full FR/BR/NFR/F coverage, 13 AC rows with 27 exact reported-case references, four byte-identical source images/hashes, local links, English, no secret-like values and exact test-excerpt/source match. Application code is unchanged from accepted staging; existing actual clean-clone results are reused. B reviews this package before acceptance; no final PDF or full S1 release is claimed.

## 8. รายละเอียดงาน B — เพื่อน

### R1-B00: Schema/migration/seed และ UI foundation

- [ ] สร้าง schema users/sessions/teams/team_members/milestones/submissions/feedback ตาม §7.3 พร้อม constraints/indexes/FKs
- [ ] เตรียม submissions.version และ feedback.submissionId ตั้งแต่ S1 เพื่อรักษาประวัติเมื่อทำ revisions ใน S2
- [ ] Seed Supervisor-A/B, Student-A1/A2/B1 และ Team-A/B; รหัสผ่านรับ env ไม่ hard-code/log
- [ ] Seed ซ้ำไม่สร้าง duplicate/ย้ายสมาชิก/reset password/ลบงานเก่า; fixture reset เฉพาะ test DB
- [ ] เตรียม fixture milestones ก่อน/ตรง/หลัง due, records ต่างทีม และ helper สำหรับ tests ของ A/B
- [ ] Implement tokens/fonts/shared field/button/status ตาม §8 และตกลง export กับ A ก่อนใช้
- [ ] ทดสอบ migrate fresh DB, constraints, seed repeat และให้ A ทดลองใช้จริง

### R1-B01: F-02 milestones

References: project detail 8.6 B-E/9.2/9.4; D1 E.2; AC-02.1-02.3; T-06-T-08/T-25. Original owner B / PR #52; independent reviewer and authorized correction author A / Issue #55, PR #56. B reviews A-authored corrections before merge. See [findings/results](../Project_code/docs/evidence/R1-B01-A-review.md) and [contract](../Project_code/docs/contracts/sprint-1-milestones.md).

- [x] Implement protected POST/GET team milestones and GET milestone detail with mandatory real session/role/source/CSRF dependencies.
- [x] Validate strict payload allowlist, trimmed Unicode title 1-120 and description 1-4,000; valid calendar/explicit zone/millisecond precision. Check future database time after the scoped team lock and scope recheck in the same transaction.
- [x] Return identical scoped list/detail DTOs with batch latestSubmission/feedbackCount, serverTime and deterministic dueAt/id order; foreign/missing records share a generic 404.
- [x] Integrate the real milestone track, dedicated create form and persisted detail into A01's authenticated shell. Use explicit Bangkok input conversion and second-level display; hide unreleased actions.
- [x] Verify actual candidate API/DB/browser flows: supervisor create/read/reload, student read with 403/no-write create denial, foreign-supervisor privacy, host-zone independence and 320px layout. Clean clone: 83 ordinary, 33 milestone DB, 28 auth, 38 G1 and seven upgrade cases pass.
- [x] B approved/reproduced current PR #56 head 2d3576e and merged staging as 78d0cca. #6/#55 are closed Done/PASSED/ACCEPTED. The user explicitly delegated the remaining G2 UI check/acceptance to A/AI; [actual accepted evidence](../Project_code/docs/evidence/R1-G2-acceptance.md) clears A02/B02. G3/main release remain separate.

Original #52's reviewed head is superseded by the corrected candidate, not approved/merged as if fixed. Preserve B's history/branch, close/archive superseded work without a false Done claim and keep Verification separate from peer Acceptance. A01 is now accepted; fixture-only tests do not establish G2.

### R1-B02: F-04 feedback

อ้างอิง §8.6 F, §9.2/9.5; D1 E.4; AC-04.1–04.4, T-17–T-20/T-24

- [ ] POST/GET `/submissions/:id/feedback`; scope ตาม submission → milestone → team
- [ ] Assigned supervisor เขียนได้ Student อ่านได้ตามทีม; author/time จาก server
- [ ] Append-only; validate content และไม่สร้าง orphan; feedback อ่านได้แม้พ้น deadline
- [ ] UI FeedbackPanel ระบุ version ชัด มี empty/loading/error/saving state และลำดับเวลา/id
- [ ] clientRequestId ต่อหนึ่ง intent; retry key เดิม/content+target เดิมคืน record เดิม 200; intent ต่างคืน 409 REQUEST_KEY_REUSED
- [ ] ตรวจ role/scope ก่อนค้น key เพื่อไม่เปิดข้อมูลทีมอื่น; concurrent retry ได้ record เดียว
- [ ] เตรียม fixtures ตาม submission contract ขณะ A ทำ F-03; integrated result ต้องทดสอบกับ submission จริงที่ A สร้าง
- [ ] Tests association, append/read, cross-team/role, empty/max content, key replay/conflict/race และ persistence

### R1-B03: เอกสาร/หลักฐานที่ B เป็นเจ้าของ

- [ ] D1 C: system SDS/schema/API/UI/config; E: รวม F-01–F-04 contracts/AC/STS/DoD ที่ทั้งคู่เขียนและ review ก่อน code
- [ ] หลักฐาน F-02/F-04, UI/API denied access, feedback association และ screenshots ของ flow
- [ ] เลือก actual test excerpt access restriction; A เลือก deadline excerpt รวมเป็น 2 รายการตาม D1
- [ ] เลือก Issue/PR chain ฝั่ง access restriction ที่มี teammate review จริง
- [ ] รวม PDF หลัง A review content; ตรวจ page references/readability/secret redaction และ navigation A–F

## 9. Checkpoints: ต้องตรวจร่วมก่อนเดินงานที่พึ่งพากัน

ใช้ PR review เป็นหลักฐานย่อยตาม [README ข้อ 4](README.md) ไม่ต้องขออนุมัติทุกไฟล์หรือทุกคำสั่ง หยุดเพื่อ human check เฉพาะ gate/การเปลี่ยน shared contract/ขั้นตอนที่ระบุไว้

ทุก gate เริ่มเป็น PENDING; ผ่านได้เมื่อ A และ B ตรวจจริง มีชื่อ/วันเวลา/commit/result ที่อ้างกลับได้ AI ห้ามถือว่าการเงียบหรือเวลาผ่านไปคืออนุมัติ ระหว่างรอทำได้เฉพาะงานอิสระที่ระบุ ไม่เริ่ม dependent implementation ที่ยังไม่ผ่าน gate

| Gate | สิ่งที่ A/B ต้องทำร่วม | เกณฑ์ผ่าน | เมื่อไม่ผ่าน/งานที่ทำระหว่างรอ |
|---|---|---|---|
| G0 Baseline | อ่าน scope/BR/AC, ตกลง stack/interfaces/ownership และบันทึก contracts ก่อน code | ระบุ baseline commit และคำยืนยันจากทั้งคู่; Issue list/เจ้าของชัด | แก้แบบ/แผนก่อน; ยังไม่ implement feature ที่ contract ไม่ตกลง |
| G1 Foundation | A รัน migration/seed ของ B; B รัน scripts/API skeleton ของ A | Fresh setup/DB ใช้ได้, fixtures/DTO/middleware interface ตรง, shared paths มีผู้รวม | แก้ setup; เขียน contract/test design ต่อได้ |
| G2 Identity + milestone | ทั้งคู่ลอง supervisor create → student list/detail และ unauthorized requests | F-01/F-02 integrated tests ผ่าน; UI อ่าน DB จริง; role/scope ถูก | แก้บน branch เดิม; F03/F04 เตรียม fixtures/spec ได้แต่ไม่อ้าง integrated pass |
| G3 Submission + feedback | A ลอง feedback ของ B; B ลอง submission/deadline ของ A; ทำ full journey | Valid flow + deadline/duplicate + cross-team rejection + retry ผ่าน | เปิด fix Issue; ไม่ release เมื่อ critical journey ยัง fail |
| G4 Verification | Clean setup, restart app, DB integrity, browser mobile/keyboard และ regression | Required S1 AC/extended checks มีผลจริงครบ; gaps เปิดเผย; test excerpts/TDD/history พร้อม | แก้และรันส่วนที่ได้รับผลกระทบใหม่; ไม่เปลี่ยน test ให้หลบ requirement |
| G5 D1 release | ตรวจ release PR, immutable commit/tag, D1 PDF A–F และ contributions | Teammate review, accepted main release, report/ภาพ/results ตรง version; PDF พร้อมส่ง | หยุดส่งจนแก้สิ่งจำเป็น หรือรายงาน incomplete ตรงจริงหากเวลาไม่พอ |

วิธีส่งงานให้เพื่อนตรวจในแต่ละ gate: แจ้ง Task/Issue/PR, branch+commit, สิ่งที่เปลี่ยน, วิธีลองแบบสั้น, expected behavior, ผล tests จริง และจุดที่ขอให้ตรวจ จากนั้นเพื่อนบันทึกผ่าน/ต้องแก้พร้อมข้อสังเกต ไม่ใช้คำว่า LGTM อย่างเดียว

## 10. Verification checklist และเจ้าของ

| กลุ่ม | คนรันหลัก | คนตรวจซ้ำ | สิ่งที่ต้องยืนยัน |
|---|---|---|---|
| Auth/session/CSRF/cache | A | B | T-01–05, T-23/T-27; no secrets/private cache leak |
| Milestone/DTO | B | A | T-06–08/T-25; timestamps/role/scope |
| Submission/deadline/duplicate | A | B | T-09–16/T-26; response + DB no-write + real lock timing |
| Feedback/retry | B | A | T-17–20/T-24; same key same intent ไม่เพิ่ม row |
| E2E domain journey | A+B | สลับ role | T-21; login/create/submit/GET/reload/feedback/read |
| Clean setup/restart/seed safety | B เตรียม, A รัน clean setup | ทั้งคู่ | T-22/T-31 local; record IDs/feedback คงเดิม |
| UI acceptance | B นำ | A ใช้งานจริง | 320/390/768/1280/1440px, zoom 200%, keyboard/focus, loading/empty/error; monochrome/fonts |

Unit tests ใช้ rule/validation assertions; API integration ใช้ PostgreSQL test DB จริง; browser tests ใช้ระบบที่เชื่อม API จริง ห้ามนับ mock screenshot เป็น persistence/access evidence

## 11. D1: งานส่งและผู้รวมหลักฐาน

| Part | เจ้าของรวบรวม | Reviewer | ของที่ต้องใส่ |
|---|---|---|---|
| A SRS | A | B | Context/actors/scope/FR/BR/NFR/decisions |
| B Inventory | A | B | Requirement → feature → sprint mapping |
| C System SDS | B | A | Architecture/data/UI/API/security/config |
| D Sprint plan | A | B | ทั้ง 3 Sprint, dependencies และเป้าหมายส่ง |
| E Contracts | B รวม; A/B เขียนของตน | ตรวจข้าม | F-01–04 SDS/AC/STS/DoD และ pre-implementation history |
| F Working S1 | A tests/history; B visuals/setup/PDF; ทั้งคู่รับรอง | ตรวจร่วม | Normal/rejection/access/persistence demos, results+coverage, test excerpts 2, TDD, PR chains 2, contribution/AI-use/limitations |

D1 ต้องเป็น PDF เดียวที่มีเนื้อหาและหลักฐานประเมินครบ มีสารบัญ/Part A–F/page references, ชื่อ/รหัสทั้งสองคน, repo และ immutable submitted release ไม่ใช้ลิงก์ภายนอกแทนเนื้อหาทั้งหมด ชื่อไฟล์/ช่องส่งตรวจตามโจทย์ D1 หรือประกาศจริง ไม่ยืมรูปแบบชื่อไฟล์ Lab 5 มาใช้เอง

AI ช่วยเตรียม artifact ได้ แต่ไม่ upload ไป LEB2/ส่งข้อความแทนสมาชิกโดยไม่มีคำสั่งส่ง ผู้ส่งงานจริงบันทึกชื่อ/เวลา/หลักฐานรับส่งเมื่อเกิดขึ้น

## 12. กำหนดภายในและ capacity

| เป้าหมาย | งาน |
|---|---|
| 6 พ.ย. ช่วงเริ่มงาน | ทวน G0 และ capacity จริง; A minimal scaffold; B schema/UI contracts แล้วลง schema/seed หลัง scaffold รวม |
| 6 พ.ย. เป้าหมายถัดไป | ผ่าน G1 แล้วทำ F-01/F-02 ขนาน; ตรวจ G2 เมื่อสองฝั่งพร้อมจริง |
| 7 พ.ย. | ปิด G2 หากค้าง แล้วทำ F-03/F-04/tests ขนาน; เป้าหมาย G3 full journey |
| 8 พ.ย. ก่อนส่ง | G4/G5; regression/clean setup/review/release/PDF และส่งก่อน 23:59 |

ทบทวนวันที่ 6 พ.ย. ยังไม่พบ app files จึงเลิกใช้วันที่ 5 พ.ย. เป็นงานที่สมมติว่าผ่านแล้ว แผน 6–8 พ.ย. มีความเสี่ยงสูง ต้องให้ A/B ยืนยันเวลาว่างและลดงานตกแต่งที่ไม่จำเป็นโดยไม่ลด required behavior หาก G1 ไม่เสร็จในวันที่ 6 ให้ทบทวนกำลังคน/เวลาและบันทึกความเสี่ยงทันที

เป็นแผนเป้าหมาย ไม่ใช่ผลสำเร็จหรือเวลารับประกัน แบบเดิมประเมิน 38–54 person-hours ก่อน contingency; ต้องตรวจเวลาว่างรวมของ A/B ถ้าล่าช้าให้ลดงานตกแต่งที่ไม่กระทบ requirements และรายงานส่วนไม่ครบตามจริง ไม่ตัด auth/ownership/meaningful tests หรือสร้างประวัติย้อนหลัง

## 13. Handoff และคำสั่งเริ่มต้นสำหรับ AI

ทุกครั้งที่จบ task ให้รายงาน: owner/task, branch, files, related FR/BR/AC, contract version, commands/results ที่รันจริง, Issue/PR/commit, reviewer state, known gaps และ gate ถัดไป ถ้ายังไม่มี Issue/PR ให้ระบุว่าไม่มี ไม่สร้างเลขสมมติ

แม่แบบบันทึกใน Issue/PR หรือ evidence ที่มีอยู่แล้ว:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
Task / owner:
Branch / commit / PR:
Contract baseline / affected requirements:
Implementation status: Backlog | Specified | Started | PR Review | Fixing | Done
Verification: NOT RUN | FAILED | PASSED (command + output link)
Human check: PENDING | A checked ... | B checked ...
Gate / finding / follow-up:
Next task allowed after:
```

Prompt สำหรับ A:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ A ตาม workflow/01_SPRINT1_D1.md เริ่มจาก Task ที่ยังไม่เสร็จและ dependencies ผ่าน
อ่าน skill/SKILL_Github.md, skill/SKILL_UI.md, project_detail และ D1 Part E ก่อน
ตรวจ branch/status และงานเดิม ทุกงานใหม่สร้าง task branch จาก staging/sprint-1 ก่อนแก้
ฉันรับ scaffold/F-01/F-03 และ D1 A/B/D; อย่าแก้โมดูลของ B โดยไม่ประสาน
ทำ task ปัจจุบันพร้อม tests/เอกสาร แล้วส่ง handoff ให้ B ตรวจตาม gate ก่อนเดิน dependent task
อย่าอ้างผลผ่านหรือ teammate approval ที่ยังไม่มี และอย่า merge แทนคนโดยไม่มีคำสั่ง
```

Prompt สำหรับ B:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ B ตาม workflow/01_SPRINT1_D1.md เริ่มจาก Task ที่ยังไม่เสร็จและ dependencies ผ่าน
อ่าน skills และ sources ตาม §1; ตรวจ state แล้วสร้าง branch ใหม่สำหรับงานใหม่
ฉันรับ schema/seed/shared UI/F-02/F-04 และ D1 C/E/การรวม PDF
ใช้ auth/submission contracts ของ A; ทำ fixture ได้แต่ต้องตรวจ integration จริงก่อนผ่าน gate
ส่ง tests/หลักฐาน/PR ให้ A ตรวจ ไม่เดินข้าม gate หรือเปลี่ยน shared contract เอง
```

## 14. Exit checklist ก่อนเข้ารอบ 2

- [ ] G0–G5 มีผลตรวจจริงและชื่อ A/B
- [ ] F-01–F-04 ทำงานครบ UI/API/DB; required domain/access/persistence checks ผ่าน
- [ ] Baseline/contract commits มาก่อน implementation ตามลำดับจริง
- [ ] Accepted S1 tag/commit ระบุได้; main ไม่ใช่ต้นแบบที่ยังไม่มีแอป
- [ ] README/env/migration/seed/test commands ทำตามได้
- [ ] D1 PDF/ส่งงาน/ข้อจำกัดมีหลักฐานจริง
- [ ] ส่งรายการ known defects, contracts, schema, test commands และ release SHA ให้รอบ 2
- [ ] เปิด [รอบ 2](02_SPRINT2_LABS5-7.md) แล้วสร้าง staging/sprint-2 จาก accepted main เมื่อทีมยอมรับจุดเริ่มต้น
