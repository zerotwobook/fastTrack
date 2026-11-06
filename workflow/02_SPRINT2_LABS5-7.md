# รอบ 2 — Sprint 2: ขยายระบบ พร้อม Lab 5, Lab 6 และ Lab 7

> แผนแบ่งงาน fastTrack | จัดทำ 5 พฤศจิกายน 2026 | ทบทวน 6 พฤศจิกายน 2026 | สถานะเริ่มต้น: PLANNED
> A = คุณผู้ใช้, B = เพื่อน; ทั้งสองเขียนโค้ด/tests/review และมีส่วนร่วม delivery
> เป้าหมายภายใน: accepted Sprint 2 ภายใน 24 พฤศจิกายน 2026
> Lab 5: 15 พ.ย.; Lab 6: 22 พ.ย.; Lab 7: 29 พ.ย. ทุกงานเวลา 23:59 น. Asia/Bangkok

เริ่มจาก [README คู่มือใช้แผน](README.md) แล้วเปิด Task ID ของตนในไฟล์นี้ ใช้กติกา bootstrap/sync/review/TDD ร่วมจาก README

ก่อนเริ่มพัฒนาหรือแก้แอป อ่าน [SKILL_Project](../skill/SKILL_Project.md) เพื่อใช้กติกาโฟลเดอร์โค้ด การแบ่งงาน/branch และแบบ UI ร่วมกัน

## 0. รอบนี้อยู่ตรงไหนในแผน

ต่อจาก [รอบ 1 / D1](01_SPRINT1_D1.md) ที่มี accepted F-01–F-04 แล้ว รอบนี้เพิ่ม F-05–F-07 และทำ delivery/UAT/maintenance บนแอปเดิม จากนั้นส่ง accepted S2 ไป [รอบ 3 / D2 และ Final](03_SPRINT3_D2_FINAL.md)

งานส่งทั้งหมดมี 6 ชุด: D1 → Lab 5 → Lab 6 → Lab 7 และ D2 → Final รอบ 2 รับผิดชอบเนื้อหา Lab 5/6/7 และ S2 ส่วนการตรวจส่ง Lab 7 ครั้งสุดท้ายวันที่ 29 พ.ย. อยู่ใน checkpoint ร่วมกับรอบ 3 ไม่เลื่อน approval/implementation ของ maintenance ไปเริ่มวันส่ง

**D2 วันที่ 29 พ.ย. ต้องมีทั้ง S2 ครบและ S3 ที่ทำงาน/ทดสอบจริงแล้ว** จึงตั้งเป้าปิด S2 วันที่ 24 พ.ย. ไม่ใช้วันที่ส่ง D2 เป็นวันที่เริ่ม S3

## 1. เอกสารและ skill ที่ต้องอ่าน

1. [Project detail](../Project_doc/project_detail.md) §5 BR/NFR, §6 F-05–F-07, §7 transactions/schema/session, §8 UI, §9.3–9.5 later APIs/retry, §10 progress และ §11.3 T-28–T-31
2. [แผนรอบ 1](01_SPRINT1_D1.md) และ accepted S1 contracts/tests/known limitations/README ที่เกิดขึ้นจริง
3. [ข้อกำหนดภาพรวม](../deliverable%20_file/summary_final_deliverable.md) §13 Lab 5, §14 Lab 6, §15 Lab 7 และ §16 D2; ดู PDF/ประกาศต้นฉบับที่เกี่ยวข้องเมื่อเตรียมส่ง
4. [Lab 5 summary](../lab_file/lab5/LAB5_SUMMARY.md), [handout Lab 5](../lab_file/lab5/01_SE_Lab_5_updated.pdf), [Student Guide](../lab_file/lab5/03_Student-Guide-GCP-Deployment-and+CI+CD-V1_1.pdf) และ [kit README](../lab_file/lab5/02_lab5-starter-kit/toktickit-lab5-starter/README.md)
5. **[Git skill](../skill/SKILL_Github.md) ทั้งไฟล์ก่อนทำ Git/Issue/PR** และ **[UI skill](../skill/SKILL_UI.md) ทั้งไฟล์ก่อนสร้าง/เปลี่ยนหน้าจอ**
6. อ่าน repository instructions ที่มีจริงและ revisions ที่ทีมอนุมัติหลังจัดแผน

ใช้ F-01–F-08 จาก project detail/D1 ล่าสุด ห้ามใช้ numbering เก่าใน summary เป็น feature map ใหม่ ราคาหรือรายละเอียด cloud ในคู่มือเป็นข้อมูลตามต้นฉบับ ต้องตรวจจริงก่อนสร้าง resources ไม่ถือ dry run เป็นผลตรวจ billing/IAM/quota

## 2. Entry gate และ branch rules

ก่อนเริ่ม dependent implementation ต้องมี accepted S1 release, app/tests ที่รันได้, README/schema/seed/credentials handoff ที่ปลอดภัย และ human review ของรอบ 1 ถ้า source มีเพิ่มแล้ว AI ต้องตรวจ live state ไม่สร้างซ้ำ

- Integration branch: `staging/sprint-2` จาก accepted main release; ทั้งโปรเจกต์มี staging แยก 3 Sprint ไม่เพิ่ม staging ทุก Lab
- **งานใหม่ทุกงานสร้าง branch ใหม่จาก staging/sprint-2 ก่อนแก้** เช่น `build/s2-a-docker`, `ci/s2-b-pipeline`, `feature/s2-a-team-planning`, `feature/s2-b-revisions`, `fix/s2-a-DEF-actual-id`
- Resume Issue/PR เดิมหรือแก้ review ใช้ branch เดิม ตรวจ head/base/current state ก่อน ห้ามเปิด PR ซ้ำเพื่อหลบ review
- ตรวจ status/untracked/staged/remote ก่อน switch; รักษางานคนอื่น ไม่ reset/clean/stash/commit รวมโดยพลการ
- A/B ใช้คนละ clone/worktree จริง; shared schema/router/lockfiles ใช้ผู้รวมคนเดียวต่อช่วง
- Issue → feature/fix branch → teammate-reviewed PR เข้า staging → integration → reviewed release PR main → pipeline deploy
- คง required CI checks; ห้าม direct push main/staging, self-approve หรือ AI merge โดยไม่มีคำสั่งชัดเจนและผ่าน policy จริง
- เปิด PR/ขอ review/ส่ง messages ตาม authorization ที่ให้ไว้เท่านั้น; AI เตรียม handoff ได้ ไม่ปลอมความคิดเห็นของเพื่อน/TA/ทีมคู่

CI ต้องรับ PR ทั้ง `main` และ staging ที่ใช้จริง เช่น pattern `staging/sprint-*` ไม่คง `[main]` หรือ `[main, staging]` หากไม่มี branch ชื่อ staging ตามนั้น ห้ามแก้เงื่อนไข CD ให้ deploy staging เพียงเพื่อให้ผ่าน lab

ก่อน release S1 ขึ้น cloud ครั้งแรก ให้ staging ที่จะ merge มีเฉพาะ delivery/config/bug fixes ที่ตรวจแล้ว อย่าให้ F-05–F-07 ที่ยังไม่จบปะปนใน release นี้ งาน S2 ที่เริ่มขนานให้คงใน task branch แล้ว sync หลัง cloud gate ผ่าน

หลัง release PR เข้า main ต้องตรวจและ sync main กลับ staging ผ่าน sync branch/PR ตาม README ข้อ 3 ก่อนทำ release ถัดไป ไม่แก้ด้วย force push หรือปิด up-to-date check

ติด label `lab5` บน Issues/PRs ของ Lab 5 ตาม R-10; ใช้ `lab6`/`lab7` หรือวิธีแยกหลักฐานที่ชัดตาม board จริงสำหรับงานอีกสอง Lab ระบุ feature/Task ID และ assessment links เมื่อเกี่ยวข้องหลายงาน ไม่สร้างหลักฐานซ้ำเป็นหลายผลทดสอบ และเก็บ CI/PR history ต่อหลังส่ง Lab

## 3. ทิศทางแอปและสิ่งที่รอบนี้เพิ่ม

ยังเป็น fastTrack สอง role, หนึ่งรายวิชา, URL submissions, feedback private ต่อทีม/ผูก version ใช้ UI ขาวดำเทา Inter + Noto Sans Thai และ milestone track ตาม project detail §8

| Feature | งานเพิ่ม | ผู้พัฒนาหลัก |
|---|---|---|
| F-05A Team planning | สร้าง/เปลี่ยนชื่อทีม เพิ่ม/ถอดสมาชิก และ available students | A |
| F-05B Milestone planning | แก้/ยกเลิก milestone ที่ยังไม่มี submission | B |
| F-06 Revisions | ส่งฉบับแก้ไข, expectedVersion, version history, feedback รุ่นที่เลือก | B |
| F-07 Progress | progress API/derived states + team progress page | A |

F-05A/F-05B เป็น task subdivisions ของ **F-05 เดิม** ไม่ใช่เปลี่ยน numbering requirements สมาชิกแต่ละคนทำ UI/API/tests ของส่วนตน B ไม่ต้องรอ A ทำทุกหน้าจอ และ A ไม่ต้องรอ B ทำทั้ง API ยกเว้น interface/dependency ที่ระบุ

## 4. ตารางงาน A/B และจังหวะทำขนาน

| Task | เจ้าของ | Reviewer | สิ่งส่งต่อ / Dependency |
|---|---|---|---|
| R2-J00 | A+B | ร่วม | Accepted S1 tag, cloud context, shared S2 contracts, gate schedule |
| R2-A01 | A | B | Docker/Compose, env/runtime, DB migration job, health/readiness |
| R2-B01 | B | A | CI, merge gate, adapted release/smoke scripts และ GitHub-side settings |
| R2-J01 | A+B | ตรวจร่วม | First cloud deploy + WIF + main release + C-01–C-06; Lab 5 |
| R2-A02 | A | B | F-05A team planning ครบทุกชั้น |
| R2-B02 | B | A | F-05B milestone planning ครบทุกชั้น |
| R2-A03 | A | B | F-07 progress API/UI และ calculation tests |
| R2-B03 | B | A | F-06 revisions/history และ migration/regression tests |
| R2-J02 | A+B | ตรวจข้าม | S2 integration/history/concurrency/authorization |
| R2-A04 | A นำ | B | UAT preparation/own-app findings; ทั้งคู่ทดสอบแอปทีมคู่และร่วม retest |
| R2-B04 | B นำ | A | Defect reproduction/regression/fixes; owner เปลี่ยนตามโมดูลของ defect |
| R2-A05 | A | B | Lab 7 impact + revised contract + new-behavior RED test |
| R2-B05 | B | A | Lab 7 approved implementation + GREEN/regression + release; A ตรวจซ้ำ |
| R2-J03 | A+B | ร่วม | Lab reports, metrics, accepted S2 tag และ D2 handoff |

R2-A05/B05 เริ่มเมื่อมีการอนุมัติจาก instructor/TA จริง ถ้าการเปลี่ยนที่อนุมัติอยู่โมดูลของ A ให้สลับ A/B implement/review โดยบันทึกเจ้าของใหม่ก่อนทำ ไม่ยึดตารางจนทำให้ข้าม ownership/interface

## 5. งานร่วมด้าน delivery และ Lab 5

### 5.1 R2-A01 — คุณ: ทำแอปพร้อม container/cloud

อ้างอิง project detail §13 และ Lab 5 R-01–R-04/R-08

- [ ] อ่าน kit แล้วปรับให้ fastTrack; ไม่คัด endpoint `/api/categories`, bearer-token login หรือ Prisma seed ของ TokTickIT มาใช้ตรง ๆ
- [ ] Docker production รวม API serve built frontend; อ่าน PORT, bind 0.0.0.0, non-root runtime และใช้ persistent DB ภายนอก container
- [ ] สร้าง `.dockerignore`, local Compose หากใช้, env examples/README; ไม่ใส่ .env/password ใน image
- [ ] แยก migration/explicit seed job ออกจาก app startup; seed ซ้ำไม่ reset ผู้ใช้หรือข้อมูลจริง
- [ ] Health/readiness/release identity ตาม §13.1: health บอก version, readiness ตรวจ DB จริงและ 503 เมื่อ DB down
- [ ] ตกลงและ version readiness JSON ให้ตรง smoke test; `/api/health`/`ready` เป็น operational contract ไม่สมมติว่าใช้ `{data}` เหมือน domain APIs
- [ ] กำหนด public login throttling threshold/shared store/429/retention และ tests ก่อนเปิด cloud ตาม open decision ในแบบ ไม่เพิ่ม Redis/service ค่าใช้จ่ายโดยไม่ตกลงทางเลือกก่อน
- [ ] ปรับ provisioning, resource names, connection URL และ runtime IAM scopes; preview dry run และให้ทั้งคู่ตรวจ
- [ ] ตรวจ clean checkout → build/run → restart record/feedback/session คงเดิม; ส่ง digest/commands/results ให้ B ตรวจ

**ตำแหน่ง repo ต้องตกลงก่อน:** source อยู่ `Project_code/` แต่ GitHub workflows ต้องอยู่ repository root `.github/workflows/` ใช้ working-directory/build context ให้ถูก เช่น `Project_code` เมื่อ Dockerfile อยู่ที่นั่น; อย่าย้าย root/copy kit ทับ application โดยไม่ตรวจ layout

เพื่อให้ required document path ชัด ให้ใช้ repo-root `docs/labs/lab-05/deployment.md`; scripts/Dockerfile อาจอยู่ Project_code ตามข้อตกลง แต่ทุก workflow/README ต้องเรียก path เดียวกัน

### 5.2 R2-B01 — เพื่อน: CI/release/smoke และ merge gate

- [ ] CI ติดตั้งจาก lockfile, test DB แยก, migrate/seed/test/build และ Docker build ด้วย paths ของ fastTrack
- [ ] Required check เช่น `test-and-docker` มีจริงและรันบน main/staging PRs ทุก relevant branch
- [ ] Offline deployment-script tests ตรวจ failed migration ไม่ update service และ rollback ไม่ migrate; ปรับ tests เมื่อ scripts เปลี่ยนอย่างมีเหตุผล
- [ ] ตั้ง ruleset main Active, bypass ว่าง, require PR/review/checks/up-to-date ตามโจทย์; ตรวจ check selection จริง
- [ ] พิสูจน์ gate ด้วย normal PR เข้า main จาก temporary branch ใหม่ที่แตกจาก current main และมีเฉพาะ failing-test proof; เป็นข้อยกเว้น base สำหรับการพิสูจน์ gate ตาม README ห้าม merge broken change และเก็บ PR/run history
- [ ] วาง environment `demo` จำกัด main; variables GCP_PROJECT_ID/GCP_REGION/WIF_PROVIDER/WIF_SERVICE_ACCOUNT ตรงจริง
- [ ] ปรับ deploy workflow ให้ CI ก่อน build/push SHA image → resolve digest → migrate → deploy → smoke → summary
- [ ] CD queue ไม่ตัด migration กลางทาง; deployment fail อ่าน step log ก่อนแก้ ไม่ bypass check
- [ ] Smoke ใช้ health/readiness/HTML ของ fastTrack; optional login ใช้ cookie + CSRF + Origin/custom header ตาม auth contract ไม่ใช้ admin/bearer token ของ kit
- [ ] หาก smoke ต้องตรวจข้อมูล private ใช้ dedicated low-privilege test account/read-only business requests และ logout เสมอ; ไม่ตั้ง credentials ต้องรายงาน SKIP login
- [ ] เก็บ commit/image digest/revision/traffic/service URL; ไม่ถือสีเขียวเพียงอย่างเดียวว่า business flow ผ่าน

### 5.3 R2-J01 — A/B ทำ cloud และตรวจร่วม

A นำ provisioning/runtime; B นำ WIF/CI/release แต่ทั้งคู่ต้องอ่านคำสั่งและอธิบายได้ตาม R-11 บัญชี/Project ID/billing/region/resource names ต้องตรวจของทีมจริง

ตาม handout Lab 5 §9: AI ต้องไม่เปลี่ยน billing/IAM/DB ด้วยตัวเอง ให้เตรียมคำสั่ง/diff/dry-run ที่ตรวจได้ก่อน และดำเนินการตามการอนุญาตที่ชัดเจนสำหรับ action นั้น ห้ามส่ง secrets เข้า AI chat และห้ามจ่าย prepayment/กด Upgrade ตามข้อกำหนดการเข้า GCP ของ lab

- [ ] ตรวจบัญชี/project/เครดิต/billing/budget alert; ใช้ project เดิมต่อถึง Final
- [ ] Runtime account แยกจาก deployer; secrets สิทธิ์เฉพาะที่ต้องใช้; WIF ไม่มี JSON key
- [ ] WIF repository/owner IDs, workflow/main/environment และ OIDC subject format ตรงจริง
- [ ] ปรับ cost controls ตาม lab: min=0/max<=3, SQL/storage ที่เหมาะสม, storage auto-increase ตรวจจริง; alerts ไม่ใช่ spending cap
- [ ] First deploy หลัง migration สำเร็จ; เปิด URL จากภายนอก ทดลอง Student/Supervisor workflow และ denied access
- [ ] Deploy visible change ผ่าน reviewed PR/main pipeline และ verify digest/traffic
- [ ] สร้าง record ก่อน restart/redeploy แล้วตรวจ ID/data เดิม; session ที่ควรอยู่ตาม TTL ยังทำงาน
- [ ] แนะนำฝึก rollback/roll-forward ด้วย image SHA เดิมโดยไม่ย้อน schema; ตรวจ compatibility ก่อน ไม่ auto-rollback เพราะ smoke fail
- [ ] ทดสอบ runtime readiness/DB-down อย่างควบคุมบนสภาพแวดล้อมที่ไม่กระทบ grading/UAT; ไม่ปิด production เพื่อทดสอบโดยไม่มีการตกลง

### 5.4 หลักฐานและรายงาน Lab 5

| Check / ส่วน PDF | เจ้าของรวบรวม | อีกคนตรวจ |
|---|---|---|
| C-01/C-02, Answer Part 1 CI/gate (30) | B | A ตรวจ run/normal failed PR และ blocked merge |
| C-03, Answer Part 2 Docker/env (20) | A | B ทำ clean build/run |
| C-04/C-05, Answer Part 3 GCP/persistence (35) | A | B ทำ business/access/restart/redeploy checks |
| C-06, Answer Part 4 release pipeline (15) | B | A เทียบ PR/commit/image/revision |
| Answer Part 0 + deployment.md + contributions | A/B; B รวม PDF | ทั้งคู่ |

`deployment.md` ระบุ stack/env purpose+secret/source, commands, project/region/resources, release/rollback limits และวิธีหา running commit หลักฐานห้ามมี secrets PDF ชื่อ `lab5_sec<section>_<group name>.pdf`, ใช้ Answer Part 0–4, direct links/คำอธิบาย/ภาพ caption ตาม handout ส่ง 15 พ.ย. ก่อน 23:59

## 6. R2-A02 — คุณ: F-05A จัดทีมและสมาชิก

อ้างอิง FR-06, BR-01/02/03/09, §9.3 และ T-28; ทำ contract/AC/STS/DoD ก่อน code

- [ ] POST `/teams`: supervisor จาก session; ทีมไม่มีสมาชิกได้; ไม่ให้กำหนด supervisor คนอื่นผ่าน body
- [ ] PATCH `/teams/:id`: rename เฉพาะทีมตน; เปลี่ยนชื่อได้แม้มี submission เพราะไม่ย้าย ownership
- [ ] GET `/students/available`: supervisor เท่านั้น; แสดงเฉพาะ ID/displayName ของ student ที่ยังไม่มีทีม ไม่เผย email/password/ประวัติทีมอื่น
- [ ] Add/remove membership ตาม scoped routes; reject role candidate ผิด, student อยู่ทีมอื่น และทีมมี submission แล้ว
- [ ] ใช้ team lock เดียวกับ first submission/revision; uniqueness ป้องกันพร้อมกันเพิ่ม student เดียวเข้าหลายทีม
- [ ] UI create team/settings/member picker/empty/locked/conflict ตาม §8.6 G; ไม่ทำ admin/role change/owner transfer เพิ่ม
- [ ] Tests no-session/role/scope, valid/invalid/duplicate assignment, empty team, rename-after-submission, add/remove racing first submission และ no orphan/ownership shift
- [ ] Candidate-list pagination และ error/count semantics ต้อง freeze ก่อนใช้กับ UI หากเพิ่มจาก S1 ไม่ตัดรายการเงียบ ๆ

B ตรวจโดยใช้สอง supervisor และสองคำขอ concurrent; อย่ารับงานจากการเห็นปุ่ม disabled อย่างเดียว

## 7. R2-B02 — เพื่อน: F-05B วางแผน milestone

อ้างอิง FR-07, BR-02/03/09 และ T-28

- [ ] PATCH milestone: active และยังไม่มี submission เท่านั้น; dueAt ใหม่อยู่อนาคต; validation เดิมทุก field
- [ ] Cancel endpoint ทำ soft cancellation เก็บ row/history; cancelled terminal ไม่กลับ active ใน baseline
- [ ] มี submission แล้วห้าม edit/cancel; supervisor ยังสร้าง milestone ใหม่ในทีมเดิมได้
- [ ] ใช้ team→milestone lock order เดียวกับ A; race edit/cancel vs submit ต้องได้ผลตามลำดับจริง ไม่ commit สถานะขัดกัน
- [ ] UI edit form/cancel confirmation และเหตุผล locked; focus เริ่มที่ทางเลือกกลับ; keyboard/Escape/focus restore ถูก
- [ ] Tests before/after submission, cancelled submit rejection, cross-team/role, timestamp/length validation และ concurrency/no-write
- [ ] ไม่เปลี่ยน strict deadline หรือย้ายงานเก่าโดยอ้างว่าเป็น planning หากต้องเปลี่ยน policy ให้ผ่าน change control

A ตรวจจาก API โดยตรงและทดสอบ first submission พร้อม cancel/edit ไม่ดูเฉพาะ happy path

## 8. R2-B03 — เพื่อน: F-06 revisions และประวัติ

อ้างอิง FR-08, BR-04/06/07, §7.4, §9.3–9.5 และ T-29; revise F-03/F-06 contract ก่อน implement

- [ ] POST `/milestones/:id/revisions` รับ title/description/url/expectedVersion แต่ server กำหนด author/time/version
- [ ] ต้องมี first submission; student ของทีมเท่านั้น; active และยังไม่เลย deadline
- [ ] Lock แล้วเทียบ expectedVersion กับ latest; stale คืน 409 VERSION_CONFLICT ไม่มี insert; success เป็น latest+1 แบบ atomic
- [ ] ส่งพร้อมกัน expectedVersion เดียวกัน: หนึ่ง request ได้รุ่นใหม่ อีก request conflict ไม่สร้างสองรุ่นเงียบ ๆ
- [ ] History immutable; feedback ของ version เก่าไม่ถูกย้ายมา latest; เพิ่ม feedback รุ่นเก่ายังได้ตามสิทธิ์
- [ ] UI revision form/version selector/old-version notice และ link latest; stale รักษาร่างใน memory ให้ตรวจและส่งใหม่เอง
- [ ] Timeout เปิด history ตรวจผล ไม่ retry version increment โดย browser อัตโนมัติ
- [ ] Migration จาก DB ที่มี S1 submissions/feedback: IDs/FKs/versions/password/membership เดิมยังอยู่; ไม่แก้ migration ที่ใช้แล้ว
- [ ] Tests upgrade+history, content/URL validation, role/scope, deadline boundary, expectedVersion/race, feedback linkage, refresh/restart/redeploy

A ตรวจจาก fixture ที่มี feedback รุ่น 1 แล้วส่งรุ่น 2: หน้า latest ต้องไม่แสดงว่ารุ่น 2 ได้ feedback เพียงเพราะรุ่น 1 เคยได้

## 9. R2-A03 — คุณ: F-07 progress board

อ้างอิง FR-09, BR-10, §9.4, §10 และส่วน S2 ของ T-30

- [ ] GET `/teams/:id/progress` ตรวจ scope และคืน teamId/asOf/total/submitted/progressPercent/milestones ตาม contract
- [ ] total = milestone ที่ไม่ยกเลิก; submitted = milestone ใน total ที่มีอย่างน้อยหนึ่ง submission ไม่ใช่จำนวน versions
- [ ] total=0 → 0%; อื่น ๆ round(submitted/total*100,1); feedback/revision ไม่เพิ่ม progress
- [ ] Status precedence: CANCELLED → FEEDBACK_AVAILABLE ของ latest → SUBMITTED → OVERDUE เมื่อไม่มีงานและ now>due → PENDING
- [ ] Consistent snapshot/asOf; shared calculation service สำหรับ F-08 รอบหน้า ห้ามเขียนสูตรซ้ำคนละแห่งใน UI
- [ ] UI progress page แถบดำ/เทา + จำนวน/เปอร์เซ็นต์/สถานะ/links และชี้แจงว่าเป็นสัดส่วนการส่งไม่ใช่คะแนน
- [ ] คุยกับ B เรื่อง F-05 cancellation/F-06 latest-feedback projection ก่อน integrate; ใช้ fixtures ระหว่างรอได้
- [ ] Tests zero/all-cancelled, 3/4=75.0%, revisions ไม่เพิ่ม numerator, feedback รุ่นเก่า, equality/overdue, scope และ JSON/UI agreement
- [ ] เตรียม exports ที่ A/B จะใช้ทำ summary/drill-down ในรอบ 3 พร้อมตัวอย่าง response และ tests

B ตรวจค่าด้วยการคำนวณจาก DB fixture แล้วเปรียบ API/UI ไม่รับเปอร์เซ็นต์ที่ hard-code เพื่อ demo

## 10. Shared files, migrations และการทำขนาน

| พื้นที่ | Owner หลัก | กติกา |
|---|---|---|
| teams/available-students/settings | A | B ไม่แก้ membership implementation โดยไม่ประสาน |
| milestones planning + revisions/history | B | A review shared lock interaction |
| progress/calculation service | A | B ส่ง expected fixture/status จาก revisions ให้ตรวจร่วม |
| schema/migrations รอบนี้ | B รวม migrations; A เสนอ diff | Merge ตามลำดับ; migration ล่าสุดต้องทดลองบนทั้ง fresh DB และ S1 DB copy |
| transaction lock/clock helpers | A รวม change; B review | interface เดียวกับ S1; ห้ามต่างคนต่างทำ lock order |
| CI/release/smoke | B | A แก้ Docker/runtime พร้อมแจ้ง paths/env contract |
| Docker/provision/runtime config | A | B ตรวจ permissions/build/migrate/release |
| app routes/lockfiles | ระบุ integrator ใน Issue ก่อนแก้ | หนึ่งคนรวมต่อครั้ง; อีกคนแยก module/component และส่ง exports |
| shared documentation | เจ้าของ feature แก้ section ตน; B รวม report | ทุก merged behavior มี corresponding contract/result update |

ทำขนานได้: A-F05A กับ B-F05B หลัง shared contract ผ่าน; A-F07 unit/UI fixtures กับ B-F06 implementation หลัง DTO ตกลง แต่ **integrated G3 ต้องใช้ API/DB จริงที่รวมทั้งสองฝั่งแล้ว**

## 11. Lab 6 — Independent UAT และ defect loop

ต้องทดสอบ release ที่ระบุ tag/commit/URL แน่นอน; ไม่ให้ทีมคู่ทดสอบ moving main โดยไม่ทราบว่ามีการเปลี่ยนเวอร์ชัน

### งาน A

- [ ] จัด UAT cases ของ fastTrack อย่างน้อย 4 กลุ่ม: normal journey, deadline/rule, role/ownership, state/history/persistence
- [ ] ระบุ ID/goal/preconditions/steps/expected/version และ safe fixture/accounts โดยไม่ใส่ passwords ใน repo/report/chat
- [ ] เตรียม access instructions/known limitations และตรวจ public URL ก่อน handoff; ให้ผู้ใช้ส่งต่อทีมคู่เมื่อพร้อม
- [ ] ทดสอบแอปทีมคู่ด้วยตนเองร่วมกับ B; บันทึก actual/PASS/FAIL/tester/version/evidence จริง
- [ ] นำ triage own-app findings: accepted/duplicate/not defect/enhancement พร้อมเหตุผล/severity

### งาน B

- [ ] ตรวจว่าชุด UAT ของ A ทำตามได้โดยคนที่ไม่ได้พัฒนา; เพิ่มกรณี feedback/version/access ที่สำคัญ
- [ ] ทดสอบแอปทีมคู่ด้วยตนเองร่วมกับ A และเก็บผลแยกตามผู้ทดสอบจริง
- [ ] Reproduce accepted defect; เขียน failing regression test; มอบ fix ให้ owner โมดูลบน branch ใหม่ และอีกคน review
- [ ] Release fix ผ่าน CI/main/deploy; เตรียมข้อมูลให้ทีมคู่ independent re-test
- [ ] รวม defect chain/version ก่อน-หลังและ actual retest outcome สำหรับรายงาน

ทั้งคู่ต้องตรวจอย่างน้อยหนึ่ง accepted defect ที่แก้และ independently retest จริง หากไม่พบ defect ที่ชอบธรรม ให้ติดต่อ TA เพื่อ controlled known-failing exercise บน isolated branch/version ตามกติกา ห้ามประดิษฐ์ defect หรือเรียก baseline feature ที่ขาดว่า bug fix เพียงเพื่อครบคะแนน

Lab 6 submission รวบรวม UAT preparation (20), independent execution (25), triage (20), resolution/retest (35) ตามเอกสารที่มี ก่อนส่งตรวจ handout/ประกาศ Lab 6 ล่าสุดเรื่องชื่อไฟล์/รูปแบบ เนื่องจากโฟลเดอร์ที่ตรวจมีเฉพาะรายละเอียด Lab 5 ไม่สร้างข้อบังคับรูปแบบ Lab 6 ขึ้นเอง

## 12. Lab 7 — Approved maintenance, metrics และ readiness

### 12.1 ก่อนเขียนโค้ดเปลี่ยน behavior

- [ ] เลือกการเปลี่ยน **behavior/business rule ที่ implemented แล้ว** ไม่ใช้ F-05/F-06/F-07 ที่อยู่ backlog เป็น maintenance แทน
- [ ] บันทึก original behavior, release/commit เดิม, change request และหลักฐาน instructor/TA approval จริง
- [ ] วิเคราะห์ผลต่อ FR/BR/features/contracts/UI/API/schema/tests/security/deadline/progress ตามการเปลี่ยนที่เลือก
- [ ] A ร่าง revised contract/AC/STS; B review; version ก่อน implementation
- [ ] Candidate เช่นเปลี่ยน deadline policy เป็นเพียงข้อเสนอ ต้องอนุมัติและแก้แบบ/test ที่เกี่ยวข้องทั้งหมดก่อน ไม่ถือแผนนี้อนุมัติล่วงหน้า

### 12.2 การแบ่งงาน

A ทำ impact analysis + test ใหม่ที่คาด behavior หลังเปลี่ยนและ fail บน pre-change commit; B review assertions แล้ว implement บน task branch ของ maintenance; A review production diff และ rerun affected/regression suite ทั้งคู่ตรวจ deployed behavior และ release identity

R2-A05/B05 เป็นสองช่วงของ maintenance work item เดียว: A/B ส่งต่อ task branch ของ Issue นั้นตามลำดับและระบุ pair work ไม่แก้ working tree เดียวพร้อมกัน A เก็บ RED บน branch ที่ยังไม่ merge; B ตรวจ test แล้วทำ GREEN ต่อใน branch/PR เดิม ก่อนให้ A review implementation การส่งต่องานเดิมไม่ใช่การเริ่ม Issue ใหม่จึงไม่ต้องสร้าง branch ซ้ำ

เก็บ RED/GREEN พร้อม commit/command/output จริง ห้าม merge RED ที่ตั้งใจให้ล้มเข้า protected staging/main เพื่อเก็บ TDD evidence; required checks ต้องผ่านเมื่อขอรับ integration ดู README ข้อ 5 ใช้ PR/CI/history เดิมอย่างตรวจย้อนกลับได้ ไม่ rewrite tests เก่าให้หายเพื่อลดจำนวน fail

### 12.3 Metrics และรายงาน

- A เก็บ 3 ตัวอย่าง metrics: completed Issues, merged PRs, passing tests บอกนิยาม/time window/date/source
- B เก็บอีก 2: UAT defects opened/resolved และ successful/failed CI runs พร้อม source/denominator
- ทั้งคู่ตกลง metric definitions ให้รวม **5 metrics** ที่นับได้จริง; หากใช้ตัวอื่นให้บันทึกเหตุผล ไม่ให้จำนวนอย่างเดียวแทนคุณภาพ
- เขียน interpretation ที่นำไปสู่การลงมือปรับงาน **ไม่เกิน 100 คำ** ตามโจทย์; ไม่ invent ตัวเลขหรือเปลี่ยนวิธีนับกลางช่วงโดยไม่อธิบาย
- Readiness: defects/tests/debt/config/docs/release; retrospective what helped / what hurt / what will change อย่างละ 1–2 ประโยค
- เตรียมหลักฐาน impact (25), implementation/regression (50), metrics (15), readiness/retro (10); ตรวจรูปแบบส่งจาก handout/ประกาศจริง

Lab 7 เนื้อหาหลักควรพร้อมก่อนส่งต่อรอบ 3; final check วันที่ 29 พ.ย. ต้องยังทำ แม้ S2 accepted วันที่ 24 พ.ย. แล้ว

## 13. จุดตรวจร่วมก่อนเดินต่อ

ทุก gate ต้องมี A และ B ตรวจจริง พร้อม version/ผล/ข้อพบใน Issue/PR/evidence ไม่ต้องสร้างไฟล์ reviewer ซ้ำหากมี record ที่อ้างได้แล้ว

| Gate | จุดตรวจร่วม | ผ่านเมื่อ | ยังทำอะไรระหว่างรอได้ |
|---|---|---|---|
| G0 Entry/contracts | S1 tag, open defects, ownership, S2 contracts, cloud plan | Both accept baseline; ไม่มี blocker ที่ทำให้ feature ต่อผิดฐาน | Read-only audit/contract draft |
| G1 Container/CI | A รัน CI equivalent; B clean Docker build; review gate settings | Reproducible app+DB, checks meaningful, migration/seed ไม่ทำลายข้อมูล | S2 spec/unit fixtures; ยังไม่อ้าง cloud pass |
| G2 Lab 5 release | Public flow, gate proof, commit/digest/revision, restart/redeploy | C-01–C-06 มีหลักฐานจริง; current S1 cloud release ชัด; Lab 5 package พร้อม | Feature branches ทำต่อได้หลัง shared contracts; release S2 ต้องคง cloud regression |
| G3 S2 integration | Team/milestone/history/versions/progress และ concurrent requests | F-05–F-07 ครบพร้อม S1 regression; migrate existing DB ผ่าน | Fixes ใน branch; ไม่ประกาศ S2 accepted |
| G4 UAT/defects | ตรวจทีมคู่/ผลจริง/accepted defect chain/retest | Lab 6 requirements ครบ; unresolved ถูกเปิดเผยและวางแผน | งานอิสระทำได้; ไม่ปลอม retest หรือ tester |
| G5 Maintenance | Approval + revised contract + RED/GREEN + regression/deploy | Changed behavior ตาม approval ทำงาน; evidence พร้อม; ห้ามข้าม approval | Metrics/impact/report prep ที่ไม่ทำ implementation ที่ยังไม่อนุมัติ |
| G6 Accepted S2/handoff | Latest app, S1 continuity, S2 DoD, tags/docs และ known gaps | S2 tag คงที่และ deployed; A/B รับรอง; round3 inputs พร้อม | Round3 contract drafts เริ่มได้ แต่ accepted dependency ต้องจริง |

G4/G5 เกิดแทรกตามกำหนด Lab ไม่ต้องรอให้ทุกฟีเจอร์ S2 จบก่อนเริ่ม UAT/approval ใช้ recorded deployed release ที่มีจริง หากสิ่งที่รอเป็น blocker ของอีกงาน ให้หยุดเฉพาะ dependent work และระบุ next action ที่มนุษย์ต้องทำ

**G6 product handoff ไม่ต้องรอ paperwork ภายนอกที่ไม่กระทบผลิตภัณฑ์:** เมื่อ S2 required features/tests/review/release ผ่านแล้ว สามารถเริ่ม S3 จาก accepted S2 ได้ แม้รอคำตอบทีมคู่หรือการรวม Lab 7 report แต่ Lab 6/7 ยังเป็นงานค้างและต้องปิดตามกำหนดเดิม หากมี unresolved critical defect/approved behavior change ที่กระทบ F-08 ให้หยุดเฉพาะส่วนที่พึ่งพา แก้/ปรับ contract และ sync changes ตามจริง ห้ามอ้าง lab complete เพราะเริ่ม S3 แล้ว

## 14. กำหนดภายในที่เสนอ

| ช่วง | A | B | ตรวจร่วม/งานส่ง |
|---|---|---|---|
| 9–12 พ.ย. | Docker/runtime/provisioning plan | CI/gate/WIF/release/smoke plan | G1 และ first deploy ที่อนุญาต |
| 13–15 พ.ย. | Persistence/business checks + เตรียมนัดทีมคู่ UAT | Repeatable release/gate proof + เตรียมข้อมูลขอ Lab 7 approval | G2; ส่ง Lab 5; S2 contracts พร้อม; ผู้ใช้ส่งคำขอประสานงานจริง |
| 16–19 พ.ย. | Team planning + UAT cases/triage | Milestone planning/revisions + UAT | F05 integration; ทีมคู่ทดสอบ recorded release; ตรวจสถานะ Lab 7 approval ตั้งแต่ช่วงนี้ |
| 20–22 พ.ย. | Progress/triage/review/maintenance test design | Revisions/defect fixes/retest evidence | ส่ง Lab 6; ทำ Lab 7 revised contract/RED หลัง approval จริง หากยังรอให้ติดตาม ไม่สมมติว่าผ่าน |
| 23–24 พ.ย. | Progress/regression/maintenance tests | Maintenance implementation/release | G3/G5/G6; accepted S2 และ handoff |
| 25–29 พ.ย. | ส่ง metric sources/แก้ findings | รวม Lab 7 PDF/หลักฐาน | รอบ 3 ตรวจปิด Lab 7 และ D2 วันที่ 29 พ.ย. |

ตรวจเวลาว่างจริงก่อนรับ schedule; แผนไม่รับประกันเวลา cloud/UAT partner/TA approval หากค้างให้แจ้งตั้งแต่เนิ่น ๆ ไม่รอวันส่ง

## 15. เอกสาร/หลักฐานที่ต้องส่งต่อ D2

A รวบรวม F-05A/F-07 contracts/results; B รวบรวม F-05B/F-06 contracts/results และ merged schema/API; ทั้งคู่ตรวจ:

- Accepted S1 tag เดิม และ S2 tag ใหม่ ห้ามเลื่อน tag เดิมไปชี้ latest
- Latest SRS/inventory/system SDS, F-05–F-07 contracts และ updated F-03/F-04 contracts เมื่อ revisions เปลี่ยน behavior
- AC/requirement → planned test → actual file/test → result → commit matrix; NFR และ S1 regression รวมอยู่ด้วย
- Lab 5 deployment.md + pipeline/run/revision evidence; Lab 6 UAT/defects/retests; Lab 7 approval/change/metrics
- Demonstrations S2 อย่างน้อยสองฟีเจอร์ที่มีความหมายสำหรับ D2 เช่น revision history + team planning/progress; recorded version ชัดเจน
- Setup/env/migration/seed/restore compatibility notes, open defects/limitations และ next-round risk list
- Export/interfaces ของ progress/status service และ response data สำหรับ F-08 ของรอบ 3

Path เป้าหมาย เช่น `Project_code/docs/contracts/`, `Project_code/docs/evidence/`, repo-root `docs/labs/lab-05/`, `lab-06/`, `lab-07/`; ใช้ของที่มีจริงก่อนสร้าง และบันทึก canonical path เดียว ไม่เก็บผลต่างกันสองชุด

## 16. คำสั่งสำหรับ AI ของแต่ละคน

Prompt A:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ A ตาม workflow/02_SPRINT2_LABS5-7.md
อ่าน project_detail/accepted S1 contracts และ skill/SKILL_Github.md กับ skill/SKILL_UI.md
ตรวจ live state/dependencies ทุกงานใหม่สร้าง branch จาก staging/sprint-2 ก่อนแก้
ฉันรับ Docker/runtime, F-05A team planning, F-07 progress, UAT preparation และ Lab 7 impact/tests
เพื่อน B รับ CI/release, milestone planning/revisions; แจ้ง shared schema/lock/DTO changes ก่อน
ทำ task ปัจจุบันครบ UI/API/tests/docs แล้วส่งให้ B ตรวจตาม gate
Cloud/IAM/DB changes ต้องเตรียม concrete plan และใช้ authorization ที่ชัดเจน ห้ามแสดง secrets
อย่า merge/approve แทนคนหรือสร้าง UAT/TA approval evidence เอง
```

Prompt B:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ B ตาม workflow/02_SPRINT2_LABS5-7.md
อ่าน sources/skills ตาม §1 แล้วตรวจ branch/Issue/PR/contract/gate จริง
ทุกงานใหม่สร้าง branch จาก staging/sprint-2; งานแก้ review ใช้ branch เดิม
ฉันรับ CI/release/smoke, F-05B milestone planning, F-06 revisions, migration integration และ maintenance implementation หลังอนุมัติ
ใช้ fastTrack cookie/CSRF/response contracts ไม่คัด auth/categories ของ TokTickIT มาใช้ตรง ๆ
คุย A ก่อนแก้ shared schema/locks/progress DTO; ส่งผลจริงให้ A review ก่อน dependent step/release
```

## 17. Exit checklist

แยกสถานะ product handoff กับ assessment submission ตาม G6: งาน Lab ที่ยังรอหลักฐานภายนอกต้องคงเป็น OPEN พร้อม owner/date แต่ไม่ขวางงาน S3 ที่ไม่พึ่งพาเมื่อ accepted S2 พร้อมจริง

- [ ] Lab 5 ส่งแล้วพร้อม C-01–C-06 และ public release ที่ตรวจได้
- [ ] Lab 6 ทั้งสองบทบาท tester/developer มีผลจริง; accepted defect independently re-tested
- [ ] Lab 7 มี approved change, contract history, RED/GREEN, regression/deploy และ metric sources พร้อมตรวจส่ง 29 พ.ย.
- [ ] F-05–F-07 ครบ UI/API/DB/tests และ regression S1 ผ่าน
- [ ] S1→S2 DB upgrade ไม่ทำลาย records/password/history/feedback
- [ ] A/B ตรวจ G6 และมี immutable accepted S2 tag/commit
- [ ] Main/cloud version เทียบได้; service/repo ยังเข้าถึงได้ ไม่ pause ระหว่าง UAT/grading
- [ ] Hand off F-08 contracts/interfaces/risks ให้ [รอบ 3](03_SPRINT3_D2_FINAL.md) ภายในเป้าหมาย 24 พ.ย.
