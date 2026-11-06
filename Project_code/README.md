# Project_code — พื้นที่พัฒนาแอป fastTrack

โค้ดแอป frontend/backend/tests/schema/migrations/seed/assets ต้องอยู่ใต้โฟลเดอร์นี้ ตาม [Project skill](../skill/SKILL_Project.md) และโครงสร้างใน [project detail §7.2](../Project_doc/project_detail.md)

ชุดเอกสารเริ่มต้นยังไม่มีแอปให้รัน ไฟล์นี้ทำให้พื้นที่โค้ดปรากฏใน checkout ของทั้งสองคน; ไม่ใช่ scaffold หรือผลทดสอบที่ผ่านแล้ว

- A ทำ `R1-A00` scaffold/scripts/env/README ตาม [รอบ 1](../workflow/01_SPRINT1_D1.md)
- B เตรียม schema/UI contract แล้ว sync scaffold ที่ review/merge ก่อนทำ `R1-B00`
- ไม่สร้างแอปไว้ใน Lab 5 starter kit หรือที่ repo root

เมื่อ A สร้าง scaffold ให้ปรับหน้านี้เป็นคู่มือที่ทดสอบได้จริง: versions/package manager/lockfile ที่ใช้, prerequisites, คำสั่งและ working directory สำหรับ install/dev/build/test, env names พร้อมตัวอย่างที่ไม่มี secrets และวิธีตั้ง test DB

B เติม migration/seed/reset safety หลังทำ schema พร้อมคำสั่งและผลทดลองจริง แยกคำสั่งที่ยังรอ dependency เป็น NOT READY ไม่แสดงคำสั่งสมมติว่าใช้งานได้แล้ว ให้แต่ละคนลอง setup ของอีกคนก่อน G1
