# รอบ 1 — Sprint 1: ระบบหลักที่ใช้งานจริง และ Deliverable 1

> แผนแบ่งงาน fastTrack | จัดทำ 5 พฤศจิกายน 2026 | ทบทวน 6 พฤศจิกายน 2026 | สถานะเริ่มต้น: PLANNED
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

| รายการ | ค่า |
|---|---|
| A: ชื่อ / รหัส / GitHub | TBD — ผู้ใช้เจ้าของคำขอนี้ |
| B: ชื่อ / รหัส / GitHub | TBD — เพื่อนร่วมทีม |
| Repository / access | ตรวจ remote จริง; ต้อง public ตามข้อกำหนด Lab 5 และคงไว้จนตรวจเสร็จ |
| Sprint staging | `staging/sprint-1` |
| Contract baseline commit | TBD หลัง commit/review จริง |
| เวลาว่าง A/B | TBD; ใช้ตรวจ feasibility ของกำหนดภายใน |
| Theme 6 eligibility | ตรวจเลขท้ายรหัสของสมาชิกอย่างน้อยหนึ่งคนตรง Theme 6 หรือมีหลักฐานอนุมัติจากผู้สอน ตาม Group specs §6 หน้า 4; ห้ามถือว่าเลือกชื่อแอปแล้วคืออนุมัติหัวข้อ |

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

### R1-A00: ตั้งโครงและสภาพแวดล้อม

- [ ] ตรวจ tree/versions ที่มีจริงก่อนสร้าง `Project_code/client`, `server`, `e2e`, docs/contracts/evidence/decisions ตาม §7.2
- [ ] ตั้ง TypeScript/build/test scripts และ dependency lockfiles; เลือก versions ที่เข้ากัน ไม่คัด version จากคู่มือแล้วอ้างว่าทดสอบผ่าน
- [ ] ส่งต่อ Node/package manager/DB versions ที่ตรวจจริง, lockfile policy และคำสั่งพร้อม working directory ใน Project_code/README.md; ทั้งคู่ใช้ชุดเดียวกัน ไม่ให้ B เดา runtime หรือสร้าง lockfile อีกแบบ
- [ ] ตั้ง API `/api`, safe error handler/requestId และ config validation; จัด local Vite proxy ให้ browser เรียก same origin
- [ ] กำหนด server module exports ให้ B เพิ่ม milestone/feedback โดยไม่ต้องแก้ app composition พร้อมกัน
- [ ] ทำ `.env.example`/`.gitignore` และ README เริ่มต้น; DATABASE_URL/password อยู่ server เท่านั้น
- [ ] แยก test DB จาก local/production; script reset ต้องตรวจ environment/DB ชัดเจน
- [ ] ระบุคำสั่ง exact install/migrate/seed/dev/build/test หลังสร้างแล้ว; ก่อนนั้นใช้สถานะ planned ไม่อ้างผลสำเร็จ

ส่งให้ B ตรวจ: file tree, manifests/scripts, env names, API bootstrap และวิธีต่อ test DB

### R1-A01: F-01 identity และทีมที่มีสิทธิ์

อ้างอิง project detail §3, §7.5, §9.1–9.4; D1 E.1; AC-01.1–01.5, T-01–T-05, T-23/T-27

- [ ] Implement `/auth/login`, `/auth/me`, `/auth/logout` และ scoped `/teams`, `/teams/:id`
- [ ] Password hash; opaque session token เก็บ hash ใน DB; HttpOnly cookie, secure เมื่อ HTTPS, SameSite และ absolute TTL 8 ชั่วโมงตามแบบ
- [ ] Login protection: JSON/custom header + source origin; mutations ใช้ CSRF; me คืน CSRF สำหรับ reload; no-store; ล้าง cache เมื่อ logout/เปลี่ยน account
- [ ] Invalid/expired/revoked session ถูกปฏิเสธ; logout revoke cookie เดิม; returnTo จำกัด internal route
- [ ] Middleware/queries ตรวจ role และ team ownership จาก DB ไม่มี dev user switch/spoofed user IDs
- [ ] สร้าง login, role-aware shell, dashboard/team context และ empty/error/loading states ใช้ UI skill/§8
- [ ] B1/Supervisor-B อ่านข้อมูล A ไม่ได้; Student ไม่มีทีมเห็น empty state ที่ถูกต้อง
- [ ] Test credentials/origin/CSRF, expiry/replay, cross-team list/detail และ browser account-switch cache; asserts ทั้ง response และ DB/session effects

Reviewer B ต้องลอง login ทั้งสอง role, logout/replay และแก้ URL ไปทีมอื่น ไม่รับเฉพาะ screenshot หน้า login

### R1-A02: F-03 ส่งงานครั้งแรก

อ้างอิง §4.1–4.2, §5 BR-04/05/08, §7.4, §9; D1 E.3; AC-03.1–03.6, T-09–T-16/T-26

- [ ] ทำ POST/GET `/milestones/:id/submissions` และ GET `/submissions/:id`; server กำหนด author/version/time
- [ ] สร้าง form title/description/URL และ saved detail; หลังสำเร็จอ่านกลับด้วย GET ไม่ใช้ form state แทน persistence
- [ ] Transaction ใช้ team → milestone locks; ตรวจ membership/rules ซ้ำภายใน; ใช้ transaction client เดียวกัน
- [ ] อ่าน DB clock หลังได้ lock truncate millisecond ครั้งเดียว; acceptedAt <= dueAt รับได้; เก็บเวลาเดียวกันลง submittedAt
- [ ] S1 บังคับ version=1 และ unique constraint; parallel/duplicate ไม่สร้างเกินหนึ่ง row
- [ ] Error precedence หลัง auth/input/scope: cancelled → duplicate → deadline; ไม่เผยกฎของทีมอื่น
- [ ] Validate Unicode code points/trim/URL ตาม §5; URL http/https ไม่มี credential; backend ไม่ fetch URL
- [ ] จัดการ timeout ด้วย GET เช็กผลก่อน retry ไม่โชว์ success ของตนเมื่อเพื่อนเป็นผู้ส่ง
- [ ] Meaningful TDD deadline: บันทึก RED ก่อน implement rule → GREEN หลัง implement → regression; เก็บ commit/command/output จริง ไม่ปิด tests เพื่อให้ green
- [ ] Tests ก่อน/ตรง/หลัง deadline 1 ms, offset/precision, รอ lock ข้าม due, spoofing/role/scope, invalid payload, duplicate-after-deadline และ no-write assertions
- [ ] Exact boundary tests ใช้ internal test clock; ไม่มี production clock override ใน API; มี integration case DB clock/lock barrier จริง

ส่งให้ B ตรวจ: submission DTO/schema IDs, test assertions, rejection UI, GET persistence และ hooks สำหรับ FeedbackPanel

### R1-A03: เอกสาร/หลักฐานที่ A เป็นเจ้าของ

- [ ] D1 A: requirements/business rules/out-of-scope ตรง app; B: inventory/traceability; D: three-sprint plan และ dependencies
- [ ] หลักฐาน F-01/F-03: normal flow, deadline rejection, auth/logout, commands/results และ TDD RED/GREEN
- [ ] จับคู่ AC → actual test file/name → result → tested commit; NOT RUN ยังเป็น NOT RUN
- [ ] เลือก Issue/PR chain ฝั่ง domain rule ที่มี teammate review จริง
- [ ] Review เอกสาร C/E ของ B และลองทำ setup README บนสภาพแวดล้อมสะอาด

## 8. รายละเอียดงาน B — เพื่อน

### R1-B00: Schema/migration/seed และ UI foundation

- [ ] สร้าง schema users/sessions/teams/team_members/milestones/submissions/feedback ตาม §7.3 พร้อม constraints/indexes/FKs
- [ ] เตรียม submissions.version และ feedback.submissionId ตั้งแต่ S1 เพื่อรักษาประวัติเมื่อทำ revisions ใน S2
- [ ] Seed Supervisor-A/B, Student-A1/A2/B1 และ Team-A/B; รหัสผ่านรับ env ไม่ hard-code/log
- [ ] Seed ซ้ำไม่สร้าง duplicate/ย้ายสมาชิก/reset password/ลบงานเก่า; fixture reset เฉพาะ test DB
- [ ] เตรียม fixture milestones ก่อน/ตรง/หลัง due, records ต่างทีม และ helper สำหรับ tests ของ A/B
- [ ] Implement tokens/fonts/shared field/button/status ตาม §8 และตกลง export กับ A ก่อนใช้
- [ ] ทดสอบ migrate fresh DB, constraints, seed repeat และให้ A ทดลองใช้จริง

### R1-B01: F-02 milestone

อ้างอิง §8.6 B–E, §9.2/9.4; D1 E.2; AC-02.1–02.3, T-06–T-08/T-25

- [ ] POST/GET `/teams/:id/milestones` และ GET `/milestones/:id`
- [ ] Assigned supervisor เท่านั้นสร้าง; dueAt ใหม่อยู่อนาคต; input lengths/timezone/millisecond ตาม contract
- [ ] List/detail ใช้ DTO เดียวกัน มี latestSubmission/feedbackCount/scoped serverTime และ ordering ที่แน่นอน
- [ ] latestSubmission query ไม่รั่วทีมอื่น; ไม่ทำ dashboard ยิง feedback API ทีละ milestone
- [ ] ทำ milestone track, team workspace, create form/detail; Student/Supervisor มี actions ตามสิทธิ์
- [ ] แสดง deadline Asia/Bangkok และความละเอียดวินาที; helper อธิบาย HH:mm หมายถึงวินาที 00
- [ ] S1 ยังไม่มี milestone edit/cancel/team settings; ไม่เปิดปุ่ม S2 เปล่า
- [ ] Tests create→GET/reload, invalid time/length, student forbidden, other supervisor 404, scoped projection และ no-write rejection
- [ ] ขณะ auth ยังไม่ merge ใช้ documented fixture สำหรับ tests ได้ แต่ผ่าน G2 เฉพาะเมื่อต่อ session จริงแล้ว

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
Implementation status: PLANNED | IN PROGRESS | REVIEW | MERGED
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
