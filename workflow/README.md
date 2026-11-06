# fastTrack workflow — เริ่มใช้แผนจากหน้านี้

> Language policy: conversation may be Thai; all newly authored or revised project content must be English. Read [SKILL_Project](../skill/SKILL_Project.md) and [AGENTS.md](../AGENTS.md). Translate legacy sections when editing them; unrelated existing sources are outside this change.

> ทบทวน 6 พฤศจิกายน 2026 | A = คุณ / B = เพื่อน
> มีแผนพัฒนา 3 รอบ และงานส่ง 6 ชุด; README นี้เป็นคู่มือใช้งาน ไม่ใช่รอบที่ 4
> แผนพร้อมใช้เป็นรายการงาน แต่การอนุมัติ การพัฒนา tests และ submission ต้องมีหลักฐานจริงก่อนระบุว่าเสร็จ

ก่อนพัฒนาหรือแก้แอป ให้อ่าน [SKILL_Project — กติกากลางของโปรเจกต์](../skill/SKILL_Project.md) ซึ่งเชื่อมกติกา Project_code, workflow, Git และ UI เข้าด้วยกัน

สำหรับเพื่อนที่เพิ่ง clone ให้เริ่มจาก [README หน้าแรกของ repository](../README.md) ซึ่งมีลำดับวันแรกและ prompt แยก A/B ก่อนอ่านรายละเอียดด้านล่าง

[Project board ของทีม](https://github.com/users/zerotwobook/projects/3) เชื่อม Issues และมีมุมมอง A/B/Sprint แล้ว GitHub setup และลิงก์รับงานจริงดู [CONTRIBUTING.md](../CONTRIBUTING.md); A = `zerotwobook`, B = `Atip-Infa` ใช้ Issues เดิมตาม Task ID ไม่สร้างซ้ำ

## 1. เปิดไฟล์ไหน และวันนี้เริ่มตรงไหน

| อยู่ช่วงไหน | เปิดแผน | คุณ A ทำหลัก | เพื่อน B ทำหลัก |
|---|---|---|---|
| เริ่มโปรเจกต์ → D1 | [รอบ 1](01_SPRINT1_D1.md) | Scaffold, F-01 login/สิทธิ์, F-03 submission/deadline | Schema/seed/shared UI, F-02 milestone, F-04 feedback |
| D1 → S2 และ Labs | [รอบ 2](02_SPRINT2_LABS5-7.md) | Docker/runtime, F-05A teams, F-07 progress, UAT/impact tests | CI/release, F-05B milestone planning, F-06 revisions, maintenance implementation |
| S3 → D2 → Final | [รอบ 3](03_SPRINT3_D2_FINAL.md) | F-08A summary/filter/totals, domain/data QA และ traceability | F-08B drill-down/items/navigation, access/UI/operations QA และ package assembly |

**เริ่มตอนนี้:** ทั้งคู่ทำ `R1-J00 / G0` ในรอบ 1 ให้ตกลง baseline/สิทธิ์หัวข้อ/เจ้าของ/เวลาว่างก่อน จากนั้น A ทำ `R1-A00` scaffold ขนาดเล็ก; B เตรียม schema/UI contract และ tests design ของ `R1-B00` เมื่อ scaffold ผ่าน review/merge แล้ว B จึง sync ไปทำ migration/seed จริง และทั้งคู่ตรวจ G1

เมื่อ G1 ผ่าน A ทำ F-01 และ B ทำ F-02 ขนาน เมื่อ G2 ผ่าน A ทำ F-03 และ B ทำ F-04 ขนาน ใช้ fixtures ที่ตกลงเพื่อเตรียมงานได้ แต่ผ่าน checkpoint ด้วยระบบจริงเท่านั้น

วิธีใช้แต่ละวัน:

1. เลือก **หนึ่ง Task ID ต่อคน** ที่ dependencies ผ่านแล้ว เช่น `R1-A01` / `R1-B01`
2. อ่านหัวข้องานของตน, source sections ที่อ้าง และ [Git skill](../skill/SKILL_Github.md); งาน UI อ่าน [UI skill](../skill/SKILL_UI.md)
3. ตรวจ Git/Issue/PR จริงและสร้าง task branch ใหม่ก่อนแก้งานใหม่
4. ทำ code + tests + document updates ของงานนั้นให้ตรวจได้ แล้วส่งให้เพื่อน review
5. เพื่อนบันทึกผลจริงและ merge ตามสิทธิ์/กติกา เมื่อผ่าน gate จึงเริ่ม dependent task ถัดไป

ไม่ต้องคัดลอกเอกสารทั้งหมดเข้า prompt ซ้ำ ให้ระบุ owner/Task ID/ไฟล์แผนและให้ AI อ่าน source ที่เกี่ยวข้อง หากยังไม่มี Task ID ที่พร้อม ให้แก้ dependency หรือทำ contract/evidence ที่อิสระก่อน

## 2. หลักแบ่งงานให้ทำพร้อมกันได้จริง

- แต่ละคนทำ feature ของตนครบ UI/API/tests/เอกสาร ไม่แบ่งถาวรให้คนหนึ่งเป็นผู้ทำเอกสารเท่านั้น
- แต่ละ task มี owner หลักคนเดียวและ reviewer เป็นอีกคน; pair work ระบุ contribution ทั้งสองจริง
- Shared DTO/auth/schema/router/lockfile ต้องมีผู้รวมตามตารางในไฟล์แต่ละรอบ ตกลง interface ก่อนแยกทำ
- งานที่ต้องรอเพื่อนให้แยกส่วนเตรียม spec/unit/component fixtures ออกจาก integration กับของจริง ไม่ปิด auth เพื่อให้ demo ผ่าน
- ไม่วัดความเท่ากันด้วยจำนวน features/commits เพราะ auth, deadline, revisions และ delivery มีความยากต่างกัน ตรวจภาระจริงตอนจบ gate และย้าย task ที่ยังไม่เริ่มได้โดยแก้ owner ใน Issue/แผนก่อน
- จำกัดงาน code ที่ active คนละหนึ่ง task เป็นค่าเริ่มต้น; หากงานใหญ่ให้แตก subtask/PR ตามผลลัพธ์ที่ตรวจได้ ไม่เปิดหลาย feature ที่แก้ shared files พร้อมกัน
- การรวม PDF เป็นบทบาทรวบรวม ไม่แปลว่า B ต้องเขียนเอกสารของ A ให้: A ต้องส่ง section/ภาพ/results ของงานตัวเองพร้อมใช้ก่อนรวมเสมอ

## 3. กติกา branch ที่ใช้ร่วมกันทั้งสามรอบ

### 3.1 จำนวนและหน้าที่

**แนะนำ 3 staging branches** ชื่อ `staging/sprint-1`, `staging/sprint-2`, `staging/sprint-3` สร้างเมื่อเริ่มรอบนั้น ไม่ต้องเปิดพร้อมกันทั้งหมด มี `main` หนึ่ง branch สำหรับ reviewed planning baseline ในช่วงตั้งต้น และ accepted releases หลังเริ่มพัฒนา และ task branches แยกตามงาน ชื่อ branches เป็นแนวทางของทีม ส่วนโจทย์บังคับกระบวนการ sprint staging/review/release

```text
main (planning baseline ก่อนมีแอป; accepted release เมื่อพัฒนาแล้ว)
  └─ staging/sprint-N
       ├─ feature/sN-a-<task>  → PR → เพื่อน B review → staging
       └─ feature/sN-b-<task>  → PR → คุณ A review   → staging

staging ผ่าน integration → release PR → main → tag/commit
ตั้งแต่ Lab 5: main → CI/deploy → ตรวจ public app/commit/image/revision
```

**Branch ต่อ task ไม่ใช่ branch ส่วนตัวถาวรชื่อ A หรือ B** งานใหม่ใช้ branch ใหม่; กลับมาแก้ review ของ Issue เดิมใช้ branch/PR เดิม ให้ตรวจ branch/PR ปัจจุบันจริง ไม่ยึดชื่อ docs branch จากข้อความในแผนเป็นสถานะสด

A/B ต้องใช้คนละ clone หรือ worktree จริง เพราะ working directory เดียวสลับ branch จะกระทบกัน ห้ามให้ AI สอง session ทำคนละ branch ใน directory เดียวกันพร้อมกัน

### 3.2 เริ่มครั้งแรก: แชร์แผนบน main แล้วตั้ง staging กลาง

สำหรับทีมนี้ใช้ **docs task branch → reviewed planning PR เข้า main → staging/sprint-1 → task branches ของ A/B** เป็นทางเริ่มต้น การนำเอกสารเข้า main ครั้งนี้เป็น planning baseline ไม่ใช่ release ของ working S1

1. ตรวจ local/remote/status/permissions และ main ที่มีจริง รวบรวมชุดเอกสารตามข้อ 10 ด้านล่างให้ครบ ห้าม reset/clean/stash หรือ commit งานอื่นทั้งหมดเพื่อให้ tree สะอาด
2. ส่งชุดเอกสารผ่าน docs branch และ PR เข้า main ให้ B review; merge โดยผู้มีสิทธิ์ตาม authorization และ protection ที่มีจริง ตรวจว่าไฟล์ปลายทางบน main ครบ ไม่ถือว่า push branch อย่างเดียวคือเข้า main แล้ว
3. ทั้งคู่ตรวจ `R1-J00 / G0` และบันทึก baseline commit/ข้อตกลงจริง A เป็นผู้ประสานสร้าง/publish `staging/sprint-1` **ครั้งเดียวจาก main commit ของ planning baseline ที่ยอมรับ** แล้วส่งชื่อ branch/commit ให้ B
4. B fetch staging นั้นและตรวจว่ามี baseline ที่ตกลงก่อนแตก task branch ของ B; A ทำเช่นเดียวกัน ไม่สร้าง staging คนละฐาน และไม่ต้อง cherry-pick เอกสารซ้ำที่ staging มีอยู่แล้ว
5. หาก staging มีอยู่ก่อนแล้ว ให้ตรวจ ancestry/diff/active work; นำ baseline เข้าผ่าน docs/sync PR ตามกรณี ไม่ลบหรือสร้าง staging ทับของเพื่อน
6. การปรับ contracts หลัง bootstrap ให้ผ่าน docs task branch → teammate review → staging ก่อน dependent code ตามปกติ G0 อ้าง reviewed contract commit ได้ แต่ต้องมีหลักฐานการยอมรับร่วม ไม่ถือ merge เอกสารแทน acceptance ทุกข้อ

ตัวอย่างสร้าง staging **ใช้เฉพาะ A ผู้ประสาน หลัง main baseline ผ่าน review/merge และตรวจว่า staging ยังไม่มีทั้ง local/remote**; กรณีมี branch เดิมหรือมีงานค้างให้ตรวจสถานะและทำตาม Git skill ไม่รันตัวอย่างซ้ำ:

```bash
git fetch origin
git status --short --branch
git branch --list staging/sprint-1
git branch -r --list origin/staging/sprint-1
# ตรวจ origin/main และ baseline commit ที่ตกลงก่อนคำสั่งสร้าง
git switch -c staging/sprint-1 origin/main
git push -u origin staging/sprint-1
```

คำสั่ง publish ต้องอยู่ในขอบเขตที่อนุญาตและผ่าน repository policy ถ้ามี branch protection/ruleset ขวาง ให้จัดการสิทธิ์ตามจริง ไม่ปิด checks หรือ force push

ไฟล์ untracked/unstaged ในเครื่องไม่ไปถึงเพื่อนจากการสร้าง branch เพียงอย่างเดียว หลัง commit/push/merge ต้องตรวจไฟล์จาก main และ fresh clone อีกครั้ง

### 3.3 เริ่มงานใหม่ / รับงานเพื่อน

| สถานการณ์ | ทำอย่างไร |
|---|---|
| งานใหม่ | Fetch, ตรวจ latest staging, สร้าง `feature/`, `fix/`, `docs/`, `build/`, `ci/` task branch ใหม่จาก staging ของรอบ |
| แก้ review/ทำ Issue เดิมต่อ | ตรวจ branch/PR head แล้วทำบน branch เดิม |
| เพื่อน merge dependency เข้า staging แล้ว | Fetch; merge latest staging เข้าสู่ task branch อย่างไม่ rewrite shared history; แก้ conflicts ร่วม owner; รัน affected tests |
| ต้องแก้ shared schema/router/contracts | แจ้ง proposed diff/ผลกระทบใน handoff ให้ owner อีกคนตรวจ; รวม shared change ก่อน dependent feature |
| งานเสร็จ | Peer review + checks → merge staging; update status ตามจริง แล้วเริ่มงานใหม่จาก staging ที่อัปเดต |
| Failed-check proof Lab 5 | สร้าง temporary branch ใหม่จาก current main → normal PR เข้า main → เก็บ blocked merge → ปิดโดยไม่ merge; เป็นข้อยกเว้น base สำหรับ proof เท่านั้น |

อย่าแก้ protected main/staging ตรง ๆ อย่า force-push/rebase shared history/ลบ evidence หรือข้าม required check เพื่อแก้ merge conflict ใช้ merge commit เป็นแนวทางสำหรับ staging/main/sync และ branch ที่ต้องรักษา TDD history

### 3.4 หลัง release ทุกครั้ง: sync main กลับ staging

เมื่อ release PR เข้า main อาจมี main merge commit ใหม่ที่ staging ยังไม่มี ทำให้ release ถัดไปถูกบล็อกด้วย up-to-date rule:

1. Release captain ตรวจ merged PR/main SHA/CI/deploy จริง
2. ถ้า current main เป็น ancestor ของ staging แล้วไม่ต้องสร้าง sync ซ้ำ; ถ้ายังไม่ใช่ ให้สร้าง task branch ใหม่ เช่น `chore/s1-a-sync-main-01` จาก latest staging
3. Merge latest main เข้าสู่ sync branch; inspect diff/conflicts และรัน checks ที่ได้รับผลกระทบ
4. เปิด PR sync branch → staging ให้เพื่อน review แล้ว **merge แบบคง ancestry ของ main**; อย่า squash/rebase sync PR จน main ancestry หาย
5. A/B fetch แล้ว merge latest staging เข้าสู่ active task branches ก่อน dependent work/release ถัดไป

นี่เป็นการปรับ history ให้ตาม release ผ่าน PR ไม่ใช่การ push main กลับ staging โดยตรง และไม่สร้าง release PR อีกรอบเพียงเพื่อ sync ทำ sync ตามความจำเป็นเมื่อมี main changes ที่ยังไม่ได้รวม

เริ่ม Sprint ถัดไปสร้าง staging ใหม่จาก accepted main release ที่ระบุจริง ใช้ tags เก็บ S1/S2/D2/Final ไม่ย้าย assessed tag ไปชี้ commit ใหม่เงียบ ๆ

## 4. ทำงานและตรวจงานแบบไม่ต้องรอกันทุกคำสั่ง

ใช้ **PR review หนึ่งครั้งต่อชุดงานที่ตรวจได้** และ **gate ตรวจร่วมเมื่อรวมหลายส่วน** ไม่ต้องขออนุมัติทุก function/file/test run

| ต้องหยุดรออะไร | เมื่อไร |
|---|---|
| Teammate review | ก่อน merge PR เข้า staging/release main; author ห้าม approve ตัวเอง |
| Gate ตามรอบ | ก่อน dependent task ที่ระบุในตาราง; ทั้งคู่ลองใช้งานข้ามส่วนและบันทึกผลจริง |
| Shared contract decision | ก่อนเปลี่ยน DTO/schema/rules ที่อีกคนใช้อยู่ |
| TA approval | Lab 7 changed behavior และข้อกำหนดที่ต้นฉบับให้ขอคำชี้แจง |
| Cloud permission | ก่อน billing/IAM/DB changes ตาม handout Lab 5 และขอบเขตที่ผู้ใช้อนุญาต |

งานอิสระที่ไม่พึ่ง gate ทำต่อได้ ไม่ถือการเงียบเป็น approval หาก evidence review มีอยู่แล้วให้อ้างกลับ ไม่ต้องถามยืนยันเรื่องเดิมซ้ำ

Author ส่ง handoff สั้น ๆ 6 อย่าง: **Task/Issue/PR + commit + สิ่งที่เปลี่ยน + วิธีลอง + actual tests/results + จุดที่ขอ review** เพื่อนทดลองอย่างน้อย happy path และ rule/access ที่เกี่ยวข้อง แล้วบันทึก specific finding/reason for approval พร้อม version

Release captain เลือกหนึ่งคนต่อ release: รอบ 1 A นำ/B review, รอบ 2 B นำ/A review, รอบ 3 A นำ D2 และ B นำ Final โดยอีกคน review ทั้งคู่ช่วยตรวจ integration เสมอ ถ้าต้องสลับให้บันทึกก่อน ไม่ต้องสร้าง release PR สองใบแข่งกัน

สถานะที่ใช้ใน board/Issue ที่มีจริง: Backlog → Specified → Started → PR Review → Fixing → Done ส่วน verification ใช้ NOT RUN/FAILED/PASSED และ acceptance gate ใช้ PENDING/ACCEPTED แยกกัน **Done หมายถึงงานผ่านเกณฑ์ของ task และ merge เข้า branch ถัดไปจริง ไม่เท่ากับผ่านทุก acceptance หรือส่งงานแล้ว**

คอลัมน์เรียงตามที่ทีมกำหนด โดยเดินงานหลัก Backlog → Specified → Started → PR Review → Done ถ้า review/checks ต้องแก้ ให้เข้า Fixing แล้วส่งกลับ PR Review ก่อน Done ไม่จำเป็นต้องผ่าน Fixing เมื่อไม่มีข้อแก้ไข

| Status | ความหมาย / เงื่อนไข |
|---|---|
| Backlog | รับงานเข้าหรือยังไม่พร้อมเริ่ม ไม่อ้างว่าสเปกผ่าน review แล้ว |
| Specified | Scope/contracts/acceptance ชัดและทบทวนแล้ว; ยังต้องตรวจ dependency/gate ก่อนเริ่ม |
| Started | กำลังพัฒนาบน task branch ของ owner |
| PR Review | เปิด PR ให้เพื่อนตรวจ behavior/tests และผลจริง |
| Fixing | แก้ review comments หรือ checks ที่ไม่ผ่าน แล้วส่งกลับ PR Review |
| Done | ผ่านเกณฑ์ task และ merge เข้า staging/main ตามประเภท PR จริง; ไม่แทน final release acceptance |

ข้อความสถานะเดิมใน Issue ที่สร้างก่อนปรับบอร์ดใช้ mapping: PLANNED = Backlog, IN PROGRESS = Started, REVIEW = PR Review, MERGED = Done ให้ใช้ค่าบนบอร์ดปัจจุบัน ไม่สร้าง Issue ใหม่เพียงเพื่อเปลี่ยนชื่อสถานะ

## 5. TDD, CI และหลักฐาน

เขียน test ของพฤติกรรมที่ต้องการบน task branch → รันให้เห็น RED ที่เกิดจาก behavior ยังไม่ถูกต้อง → เก็บ commit/command/output → implement → GREEN → regression → peer review → merge เมื่อ required checks ผ่าน

**อย่า merge RED เข้า staging/main เพื่อสร้างหลักฐาน** failed check บน feature branch เป็น evidence ได้ ต้องรักษา history และทำให้ปลาย PR ผ่านก่อนรับงาน ส่วน Lab 5 failed-gate proof เป็น PR ชั่วคราวที่ตั้งใจไม่ merge

งาน pair maintenance ให้ส่งต่อ branch ของ Issue เดิมตามลำดับ คนเขียน testให้เพื่อน review test และคนเขียน implementation ให้เพื่อน review implementation ห้ามใช้ AI แทน human review หรือทำงานพร้อมกันใน working directory เดียว

ทุกผลทดสอบมี file/test name + command/run + result/counts + commit; ทุกภาพมี feature/AC/role/precondition/steps/expected/actual/version; ทุก assessment มี evidence index เชื่อม rubric → artifact/page/link → IDs/version → result

## 6. ตรวจว่าครอบคลุมงานส่งอะไรแล้ว

ตารางนี้ตรวจ **ความครอบคลุมของแผน** กับเอกสารใน workspace ไม่ใช่สถานะการทำงานผ่านแล้ว ทุกกำหนดเป็นปี 2026 เวลา 23:59 น.

| งานส่ง / กำหนด | สิ่งที่แผนกำหนดให้ทำ | จุดเปิดอ่าน |
|---|---|---|
| D1 / 8 พ.ย. | A–F, SRS/SDS/inventory/3-sprint plan/contracts ก่อน code, F01–04, normal/rule/access/persistence, test results/AC mapping, excerpts 2/TDD/chains 2, setup/release/PDF | รอบ 1 ข้อ 7–14 |
| Lab 5 / 15 พ.ย. | R01–R12/C01–C06, Docker/env/CI/gate/GCP/persistence/main release, deployment.md, labels/history และ PDF Parts 0–4 | รอบ 2 ข้อ 2/5 |
| Lab 6 / 22 พ.ย. | UAT อย่างน้อย 4 กลุ่ม, ทดสอบทีมคู่จริง, triage, accepted defect อย่างน้อย 1 ที่แก้และ independent retest | รอบ 2 ข้อ 11 |
| Lab 7 / 29 พ.ย. | TA-approved maintenance ต่อ behavior เดิม, impact/revised contract, RED/GREEN/regression/deploy, metrics 5 + interpretation <=100 words, readiness/retro | รอบ 2 ข้อ 12; รอบ 3 ข้อ 8 ปิด submission |
| D2 / 29 พ.ย. | S2 ครบ, S3 contracts และ meaningful working progress, updated traceability, deployed candidate, excerpts 2/TDD/chains 2 และ PDF A–E | รอบ 3 ข้อ 8 |
| Final / 13 ธ.ค. | F01–08/approved changes ครบ, final tests/NFR/UAT/retests/defects/DoD, CI/deploy, chains จากคนละ Sprint, PDF A–E และ video | รอบ 3 ข้อ 9–15 |

เอกสารที่ใช้ตรวจตรง: [Group specs](../deliverable%20_file/group_work_specs_v1.pdf) §5–12; [D1](../deliverable%20_file/project_deliverable_1_v1.pdf) §3–5; [D2](../deliverable%20_file/project_deliverable_2_v1.pdf) §3–5; [Final](../deliverable%20_file/project_final_delivery_v1.pdf) §3–5; [Lab 5](../lab_file/lab5/01_SE_Lab_5_updated.pdf) §4–12 และ [project detail](../Project_doc/project_detail.md) §5–14

Lab 6/7 ตรวจจาก Group specs หน้า 14–15; ยังไม่มี standalone Lab 6/7 handouts ในโฟลเดอร์ที่ตรวจ ต้องตรวจประกาศ/handout ใหม่เมื่อได้รับโดยไม่เปลี่ยนแผนเงียบ ๆ Final มีความต่าง 4/10 นาทีในต้นฉบับ จึงวาง demo <=4 นาทีและยืนยันประกาศจริงก่อนส่ง

## 7. สิ่งที่ปรับจากการทบทวน 6 พฤศจิกายน

| จุดที่พบ | การปรับ |
|---|---|
| เอกสารละเอียดแต่เริ่มอ่านยาก | เพิ่มหน้านี้เป็นจุดเริ่ม เลือก owner/Task แล้วอ่านเฉพาะรอบปัจจุบัน |
| Scaffold/schema/auth อาจเริ่มทับ dependencies | ให้ minimal scaffold ผ่าน review ก่อน runnable schema; ระหว่างรอทำ contracts/design ได้; feature integration หลัง G1 |
| รู้ว่าต้องแยก branch แต่ยังไม่บอก bootstrap/sync | เพิ่มกติกา initial staging, branch ต่อ task, peer review และ main→sync PR→staging |
| D2 ยังไม่ย้ำ selected evidence ทุกข้อ | เพิ่มเจ้าของ excerpts 2, TDD, PR chains 2 และ captions/counts ตาม PDF หน้า 4–5 |
| RED test อาจถูกตีความว่าต้อง merge ก่อนเพื่อน implement | ย้ำเก็บ RED บน task branch และ GREEN ก่อนรับ integration; pair work ส่งต่อ Issue เดิม |
| Lab evidence อาจปนกับฟีเจอร์/เริ่มรอ TA ช้า | ย้ำ lab5 labels และเตรียม UAT partner/Lab7 approval ตั้งแต่ช่วง Lab 5 |
| งานเอกสาร Lab อาจขวาง S3 ทั้งหมด | แยก product handoff กับ assessment closure; S3 อิสระทำต่อได้เมื่อ accepted S2 พร้อม แต่ lab ยังต้องปิดตามกำหนด |
| ตาราง S1 เดิมเริ่ม 5 พ.ย. | ปรับแผน 6–8 พ.ย. และระบุความเสี่ยงตามการตรวจว่า Project_code ยังว่าง |

การแบ่งงานมีขอบเขตและจุด review ชัด แต่ยังสรุปว่า workload สมดุลในชั่วโมงจริงไม่ได้จนทราบทักษะ/เวลาว่างของ A/B ต้องตรวจและปรับเจ้าของของงานที่ยังไม่เริ่มตอนจบแต่ละ gate

## 8. ข้อมูลที่ต้องเติมก่อนใช้จริง

- [ ] ชื่อ/รหัส/GitHub ของ A และ B และสิทธิ์ Theme 6 ตามรหัสนักศึกษาหรือหลักฐานอนุมัติ
- [ ] เวลาว่างจริงวันที่ 6–8 พ.ย.; ตรวจ feasibility ก่อนรับแผน D1 เพราะ source app ยังไม่เกิดในการตรวจครั้งนี้
- [ ] Confirm baseline decisions จาก project detail และ contract commit ที่ทั้งคู่ review แล้ว
- [ ] Remote access/board/Issues/staging/required checks ที่มีจริง; ไฟล์แผนไม่ได้สร้างสิ่งเหล่านี้ให้โดยอัตโนมัติ
- [ ] หลัง commit/push แผนและ baseline ที่ได้รับอนุญาต ให้เพื่อน fetch version เดียวกันก่อนแยกทำ

## 9. Prompt สั้นสำหรับใช้งานทุกวัน

```text
อ่าน skill/SKILL_Project.md
อ่าน workflow/README.md และ workflow/<ไฟล์รอบปัจจุบัน>
ฉันคือ A หรือ B: <ระบุ>
วันนี้ทำ Task ID: <ระบุจากตาราง>
อ่าน skill/SKILL_Github.md และถ้ามี UI ให้อ่าน skill/SKILL_UI.md
อ่าน project_detail/contract เฉพาะส่วนที่ task อ้างและตรวจ live Git/Issue/PR state
ทุกงานใหม่สร้าง task branch จาก staging ของรอบ; งานเดิมใช้ branch/PR เดิม
ทำเฉพาะ task นี้พร้อม tests/documentation และประสาน shared files ตาม owner
จบด้วย handoff ให้เพื่อนตรวจ; อย่าเดินข้าม human gate หรือ merge/approve แทนคนเอง
รายงานผลจริง ข้อค้าง และ next action ไม่สร้างผล PASS/approval ขึ้นเอง
```

## 10. Checklist ชุดเอกสารที่จะนำเข้า main ให้เพื่อนเริ่มได้

ขอบเขตนี้คือ planning handoff ก่อน code; ไม่ใช่การส่ง D1 หรือการรับรอง working app

- [ ] หน้าแรก `README.md` และ `Project_code/README.md` อยู่ใน commit เพื่อให้เพื่อนรู้จุดเริ่มและเห็นพื้นที่โค้ด; Git ไม่เก็บ empty directory เปล่า ๆ
- [ ] `workflow/README.md` และแผน `01`, `02`, `03` ครบ พร้อม `skill/SKILL_Project.md`, `skill/SKILL_Github.md`, `skill/SKILL_UI.md`
- [ ] `Project_doc/project_detail.md`, `deliverable _file/submit/project_deliverable_1.md`, summary และ `lab_file/lab5/LAB5_SUMMARY.md` เป็นชุดเดียวกับที่ workflow อ้าง พร้อม PDF/kit ต้นฉบับที่มีใน repository
- [ ] ตรวจ diff ของการย้าย `Project/project_detail.md` → `Project_doc/project_detail.md` และการแทนที่ `skill/SKILL.md` เดิมด้วย skills ที่ตั้งชื่อใหม่; stage ทั้งด้านเก่า/ใหม่เฉพาะที่ตรวจแล้ว ไม่ปล่อยเอกสารเก่าเป็น current source สองชุด
- [ ] ตรวจลิงก์แบบ relative จากไฟล์ในชุดที่จะ commit จริง ไม่ใช้เพียงไฟล์ untracked ในเครื่องเป็นหลักฐานว่า fresh clone ครบ; ไม่มีลิงก์เอกสารที่ต้องเปิดผ่านบัญชี ChatGPT ส่วนตัว
- [ ] ตรวจไฟล์ที่จะ commit ว่าไม่มี secrets, `.env` จริง หรือ runtime outputs และไม่ใช้ `git add .` เหมารวมงานอื่น
- [ ] PR ระบุชัดว่า docs/planning only, app ยังไม่เริ่ม, G0/ชื่อ/เวลาว่าง/สิทธิ์เพื่อนใดยังค้าง และผลตรวจที่ทำจริง ให้ reviewer อ่านชุดสุดท้ายก่อน merge
- [ ] หลัง merge ตรวจ merged PR/main SHA และให้เพื่อน clone/fetch main แล้วเปิด README → skill → workflow → project detail/D1/PDF ได้ครบ
- [ ] A/B บันทึก G0 จริงและ A publish staging จาก baseline; B เข้าถึง repo/สร้าง branch/push/เปิด PR ไป staging ได้ตามสิทธิ์ที่ให้ ก่อนแยก implementation

การมีแผนที่ตรวจได้ครบถือว่าพร้อมส่งให้เพื่อนทบทวนและเริ่ม kickoff ส่วนชื่อบัญชี/เวลาว่าง/eligibility/approval และผล setup ต้องเกิดจริงในขั้นตอนข้างต้น ไม่เติมสถานะ PASSED แทนการตรวจ
