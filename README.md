# fastTrack — เริ่มทำงานร่วมกัน

ระบบติดตามโครงงานรายวิชาสำหรับ Student และ Supervisor ใช้แอปเดียวพัฒนาต่อเนื่อง 3 Sprint

**เริ่มที่ [workflow/README.md](workflow/README.md) และ [SKILL_Project](skill/SKILL_Project.md)** แล้วเลือกงานของตัวเองจากแผนรอบปัจจุบัน

## สถานะของชุดเอกสารเริ่มต้น

ชุดนี้เป็น planning baseline สำหรับแบ่งงาน ยังไม่มี working app หรือผลทดสอบแอปที่รับรองแล้ว การนำเอกสารเข้า main ไม่ถือว่า Sprint 1 ผ่าน และไม่ถือว่า checkpoint ได้รับ human review แล้ว ตรวจ Git/Issue/PR ล่าสุดก่อนเริ่มเสมอ

| ต้องการรู้อะไร | เปิดอ่าน |
|---|---|
| แอปทำอะไร กฎข้อมูล/API และหน้าตาต้องเป็นอย่างไร | [Project detail](Project_doc/project_detail.md) |
| งานใคร เริ่มเมื่อไร ต้องตรวจอะไร และส่งงานอะไร | [Workflow](workflow/README.md) |
| กติกาก่อนเขียนโค้ด/ออกแบบ | [Project skill](skill/SKILL_Project.md), [Git skill](skill/SKILL_Github.md), [UI skill](skill/SKILL_UI.md) |
| โค้ดและคำสั่งรันแอปเมื่อพัฒนาแล้ว | [Project_code](Project_code/README.md) |
| รายงาน D1 และ S1 feature contracts | [D1 draft](deliverable%20_file/submit/project_deliverable_1.md) |
| ต้นฉบับเกณฑ์งานส่ง | [Group specs](deliverable%20_file/group_work_specs_v1.pdf), [D1](deliverable%20_file/project_deliverable_1_v1.pdf), [D2](deliverable%20_file/project_deliverable_2_v1.pdf), [Final](deliverable%20_file/project_final_delivery_v1.pdf) |

## วันแรกของคุณและเพื่อน

A = ผู้ใช้ที่วางแผนนี้; B = เพื่อนร่วมทีม ให้จับคู่ A/B กับชื่อและ GitHub จริงใน Issue/PR ของ `R1-J00` เพื่อไม่ให้ AI ของเพื่อนคิดว่าตัวเองเป็น A

1. ทั้งคู่ clone คนละ directory และอ่าน skill/workflow/source เดียวกัน ตรวจว่าเห็นไฟล์ในตารางข้างบนครบ
2. ทำ `R1-J00 / G0` ร่วมกัน: ยืนยัน scope/contracts, เจ้าของ shared files, บัญชีทีม, เวลาว่าง, สิทธิ์หัวข้อ และ baseline commit พร้อมหลักฐานการทบทวน
3. A เป็นผู้ประสานตั้ง `staging/sprint-1` หนึ่งครั้งจาก planning baseline บน main ตาม [ขั้นตอน bootstrap](workflow/README.md) ข้อ 3.2; ถ้ามี staging อยู่แล้วให้ตรวจและใช้ของเดิม
4. แต่ละคนแตก task branch จาก staging กลาง ไม่แตกโค้ดจาก main คนละฐาน และไม่ใช้ branch ส่วนตัวถาวร
5. เริ่มงานตามตารางนี้ โดยงานที่รอ dependency เตรียม design/tests ได้ก่อน แต่รับ integration ด้วยระบบจริง

| ลำดับ | คุณ A | เพื่อน B | ก่อนเดินต่อ |
|---|---|---|---|
| G0 | ตกลง baseline กับ B | ตกลง baseline กับ A | บันทึกข้อตกลงและ commit ที่ทบทวนจริง |
| ตั้งโครง | `R1-A00`: scaffold/scripts/env/API skeleton | เตรียมแบบ schema/fixtures/UI ของ `R1-B00` และ review scaffold | Scaffold ผ่าน review และ merge เข้า staging |
| วางฐานข้อมูล/UI | Review schema; เตรียม auth contract/test design | Sync scaffold แล้วทำ `R1-B00`: migrations/seed/shared UI | G1: ทั้งคู่ setup ได้และ interfaces ตรงกัน |
| ฟีเจอร์ชุดแรก | `R1-A01`: auth/session/team context | `R1-B01`: milestones | G2: auth + milestone รวมกันทำงานจริง |
| ฟีเจอร์ชุดถัดไป | `R1-A02`: first submission/deadline | `R1-B02`: feedback | G3 แล้ว regression/review/D1 ตามรอบ 1 |

รายละเอียดไฟล์ที่รับผิดชอบและ checklist อยู่ใน [รอบ 1](workflow/01_SPRINT1_D1.md) ข้อ 5–8 ไม่สร้าง scaffold ซ้ำฝั่ง B และไม่แก้ schema/router/lockfile ของกันและกันโดยไม่ประสาน owner

## รับ repository และสร้าง branch แรก

สำหรับเครื่องใหม่และยังไม่มีโฟลเดอร์ fastTrack เท่านั้น:

```bash
git clone https://github.com/zerotwobook/fastTrack.git
cd fastTrack
git status --short --branch
```

หลัง A สร้าง/publish staging และ G0 ผ่านแล้ว ทั้งคู่ fetch ใน clone ของตัวเอง:

```bash
git fetch origin
git branch -r --list origin/staging/sprint-1
```

ถ้าไม่พบ branch ให้กลับไปตรวจ bootstrap ก่อน ไม่สร้าง branch ชื่อเดียวกันคนละ commit เมื่อพบ staging แล้วเลือกคำสั่ง **ของตนเพียงบรรทัดเดียว** สำหรับ task ใหม่:

```bash
# A: scaffold
git switch -c build/s1-a-scaffold origin/staging/sprint-1
# B: schema/UI foundation; เตรียม design ได้ก่อน แต่รอ scaffold merge ก่อน implementation
git switch -c feature/s1-b-foundation origin/staging/sprint-1
```

งานเดิมใช้ branch เดิม หาก working tree มีงานค้างให้ตรวจและรักษางานนั้นก่อน ไม่ใช้ reset/clean เพื่อให้คำสั่งตัวอย่างรันได้ ดูวิธี sync dependency และ PR review ใน workflow

## ส่งคำสั่งนี้ให้ AI ของแต่ละคน

**คุณ A:**

```text
ฉันคือ A ของ fastTrack อ่าน skill/SKILL_Project.md, workflow/README.md
และ workflow/01_SPRINT1_D1.md ตรวจ R1-J00/G0 จากหลักฐานจริงก่อน
เมื่อ G0 ผ่าน ทำเฉพาะ R1-A00 บน branch งานของ A ใน Project_code/
เพื่อน B รับ schema/seed/shared UI ให้ตกลง interfaces และส่ง scaffold เล็กให้ B review
อย่าเริ่ม F01 จน dependencies ผ่าน รายงานผลจริงและสิ่งที่ส่งต่อให้ B
```

**เพื่อน B:**

```text
ฉันคือ B ของ fastTrack อ่าน skill/SKILL_Project.md, workflow/README.md
และ workflow/01_SPRINT1_D1.md ตรวจ R1-J00/G0 จากหลักฐานจริงก่อน
รับ R1-B00: schema/migrations/seed/fixtures/shared UI ใน Project_code/
ระหว่างรอ R1-A00 ให้เตรียมแบบและ review scaffold ของ A ไม่สร้าง scaffold อีกชุด
ก่อน implementation ให้ sync scaffold ที่ merge แล้วบน branch งานของ B
อ่าน SKILL_UI และ project_detail §8 ก่อนทำ UI ส่งผลจริงให้ A ตรวจ G1
```

หลังเริ่มแล้วใช้ Task ID ถัดไปตาม gate ห้ามใช้ prompt วันแรกนี้สร้างงานเดิมใหม่ ข้อมูลชื่อ/เวลาว่าง/approval ที่ยังไม่ทราบต้องเติมตามจริง ไม่ถือว่าเอกสารนี้ยืนยันแทนสมาชิกแล้ว
