---
name: fasttrack-project
description: Develop or modify the fastTrack project using its Project_code directory, sprint workflow, teammate ownership, Git branches, and established UI design. Read before implementing project features or changing its UI.
---

# SKILL_Project — กติกาพัฒนา fastTrack

ใช้ไฟล์นี้เป็นจุดเริ่มก่อนพัฒนาหรือแก้ไขแอป fastTrack ทั้งสำหรับคุณ เพื่อน และ AI ที่รับงานต่อ กติกานี้ใช้กับ repository นี้โดยเฉพาะ โดย **A = คุณ / B = เพื่อน** ตาม workflow; ตรวจตัวตนผู้รับงานจริง ไม่สมมติว่าทุก session เป็น A

## 1. อ่านก่อนเริ่มงาน

1. อ่าน [workflow/README.md](../workflow/README.md) เพื่อเข้าใจกติกากลาง แล้วอ่านแผนรอบปัจจุบัน:
   - [รอบ 1 — Sprint 1 / D1](../workflow/01_SPRINT1_D1.md)
   - [รอบ 2 — Sprint 2 / Labs 5–7](../workflow/02_SPRINT2_LABS5-7.md)
   - [รอบ 3 — Sprint 3 / D2 / Final](../workflow/03_SPRINT3_D2_FINAL.md)
2. ระบุ **owner A/B, Task ID, scope, dependencies, shared-file owner และ checkpoint** จากแผนก่อนแก้ไฟล์ อ่านรายละเอียดของ task ไม่อาศัยชื่อ feature อย่างเดียว
3. อ่าน [Project_doc/project_detail.md](../Project_doc/project_detail.md) ส่วนที่เกี่ยวข้องกับงาน: §5 requirements/rules, §6 feature allocation, §7 architecture/data, §8 UI, §9 API, §10 progress, §11 acceptance และ contracts ที่ task อ้าง
4. **ก่อนเริ่มเขียนโค้ดหรือทำ Git อ่าน [SKILL_Github.md](SKILL_Github.md) ทั้งไฟล์** แล้วตรวจ repository instructions, current branch, working tree และ Issue/PR ที่เกี่ยวข้องจริง
5. **ก่อนออกแบบหรือแก้หน้าจอ อ่าน [SKILL_UI.md](SKILL_UI.md) ทั้งไฟล์** พร้อม project detail §8 และ component/token ที่มีอยู่จริง

อ่านไฟล์ที่ยังไม่อ่านหรือที่เปลี่ยนจากครั้งล่าสุด ไม่ต้องอ่านซ้ำทุกคำสั่ง หากไม่ทราบ owner/task จนแบ่งงานไม่ได้ ให้ถามเฉพาะข้อมูลที่ขาด; ระหว่างรอทำการตรวจเอกสารหรือ dependencies ที่ไม่เสี่ยงแก้ทับงานเพื่อนได้

## 2. ที่อยู่โค้ดและเอกสาร

**โค้ดแอปทั้งหมดต้องพัฒนาใน `Project_code/` ที่ repo root** ได้แก่ frontend, backend, shared contracts, automated tests, schema/migrations/seed, app assets และ app build/runtime configuration ตามโครงสร้างที่ตกลงใน project detail §7.2 และ workflow

- ตรวจโครงสร้างที่มีจริงก่อนสร้าง scaffold; ใช้แอปเดิมต่อยอดทั้งสามรอบ ไม่สร้างแอปซ้ำในแต่ละ Sprint
- ไม่วาง source app ที่ repo root, `workflow/`, `Project_doc/`, `deliverable _file/` หรือแก้ starter ใน `lab_file/` แทนแอปจริง
- วางเอกสารแผนใน `workflow/`, แบบผลิตภัณฑ์ใน `Project_doc/` และงานส่งตาม path ที่แผนกำหนด
- ไฟล์ระดับ repository ที่ต้องอยู่นอกโฟลเดอร์แอปให้คง path ที่ถูกต้อง เช่น `.github/workflows/`, `.gitignore`, `skill/` และ `docs/labs/lab-05/deployment.md` ตาม Lab 5; ไม่ย้าย GitHub Actions เข้า `Project_code/`
- ทุกคำสั่ง install/build/test/Docker/CI ต้องใช้ working directory และ paths ที่ตรงโครงสร้างจริง ไม่สร้าง package/lockfile ซ้ำที่ root โดยไม่จำเป็น

## 3. แยกงานและ branch เพื่อไม่แก้ทับกัน

- **งานใหม่ต้องมี task branch ใหม่ก่อนแก้ไฟล์** แตกจาก staging ของรอบตาม workflow เช่น `feature/s1-a-auth`, `feature/s1-b-milestones`; ใช้ชื่อที่บอก round/owner/task เมื่อเหมาะสม
- แก้ review หรือทำ task เดิมต่อใช้ branch/PR เดิม หลังตรวจสถานะจริง ไม่เปิด branch ซ้ำทุกครั้งที่ AI เริ่ม session
- ใช้ `staging/sprint-1`, `staging/sprint-2`, `staging/sprint-3` ตามรอบ; ถ้ายังไม่มี staging ให้ทำ bootstrap ตาม workflow/README §3.2 ก่อนเริ่ม feature implementation ไม่เดาฐานจาก branch ที่บังเอิญเปิดอยู่
- A และ B ใช้ **คนละ clone หรือ worktree**; ห้ามสอง session สลับ branch ไปมาใน working directory เดียวกันพร้อมกัน
- ทำเฉพาะ feature/task ที่ได้รับมอบหมายครบ UI/API/tests ตามขอบเขต ไม่หยิบงานเพื่อนมาแก้พร้อมกันโดยไม่ตกลงเจ้าของ
- Branch แยกกันยังแก้ไฟล์เดียวกันชนกันได้: ตรวจตาราง shared files ของรอบ โดยเฉพาะ schema/migrations, DTO, auth, router, app shell, tokens และ lockfile ให้ owner รวมการเปลี่ยน shared interface ก่อน dependent feature
- ระหว่างรอ dependency ทำ spec/test design/fixtures ที่ตกลงได้; การรับงานต้องตรวจ integration กับระบบจริง ไม่ใช้ mocks เป็นหลักฐานว่าระบบครบแล้ว
- ก่อนรับงานเพื่อนให้ fetch และ sync ตาม workflow; หลัง release sync main กลับ staging ผ่านขั้นตอนที่กำหนด รักษา commit history และงานที่ยังไม่ commit ของทุกคน
- ส่ง PR เข้า staging ให้เพื่อน review ก่อนรวม และใช้ reviewed release PR เข้า main ตามแผน ไม่เขียน feature ลง main/staging โดยตรง ไม่ self-approve หรือ merge แทน reviewer โดยไม่มีสิทธิ์อนุญาตตาม Git skill

สำหรับงานเอกสารก่อนตั้ง staging ให้ใช้ docs branch ตาม bootstrap ที่ตกลง ตรวจ base/history และจำกัด diff ให้เฉพาะงานนั้น; งานตรวจอ่านอย่างเดียวไม่ต้องสร้าง branch หรือแก้ไฟล์

## 4. ออกแบบตามแบบที่กำหนดไว้

ใช้ **project detail §8 เป็น design brief ของ fastTrack** และใช้ SKILL_UI ช่วยทำแบบนั้นให้ดีขึ้น ไม่ตีความว่าให้คิดธีมใหม่ทุกครั้ง

- คงชื่อ **fastTrack**, ธีม **ขาว–ดำ–เทา**, white canvas และ black primary action; ใช้ color tokens จาก §8.3 ร่วมกันทั้งแอป
- ใช้ **Inter + Noto Sans Thai** ตาม typography/weights/spacing ที่กำหนดใน §8.4 ไม่เปลี่ยนฟอนต์เองเพียงเพราะ UI skill แนะนำให้มีเอกลักษณ์
- ยึด application shell, role-specific navigation, screen specifications/wireframes และ feature mapping ใน §8.5–8.7; ให้ milestone track, กำหนดส่ง, version และ feedback เป็นข้อมูลหลัก
- ใช้ components/tokens ร่วมที่มีอยู่แล้ว ไม่สร้างชุดปุ่ม ฟอร์ม หรือสถานะอีกมาตรฐานหนึ่งใน feature ของตน
- ทำ loading/empty/error/success, mobile layout, keyboard focus และ accessibility ตาม §8.8–8.11; status ใช้ข้อความ/ไอคอนตามแบบ ไม่เติมสีแดง/เขียวหรือ gradient นอกธีม
- รักษาขอบเขตผลิตภัณฑ์และสิทธิ์ของ Student/Supervisor ตาม project detail; ไม่เพิ่ม feature หรือเปลี่ยนกฎธุรกิจเพื่อให้ mockup สวยขึ้น

ก่อนลง UI ให้สรุปหน้าที่จะแก้, source section, components/tokens ที่ใช้ และ states ที่ต้องรองรับ แล้วตรวจเทียบ brief เมื่อทำเสร็จ ตรวจ UI ที่รันจริงเมื่อ environment รองรับ และรายงานส่วนที่ยังตรวจไม่ได้

หากต้องเปลี่ยน shared design/API/schema/rule ให้บอกผลกระทบและทำตาม checkpoint ของ workflow ก่อนเขียน dependent code ปรับเอกสารที่เป็นแหล่งอ้างอิงให้ตรงกัน ไม่แก้แบบเงียบ ๆ; หากผู้ใช้ให้คำสั่งใหม่ชัดเจนแล้ว ให้ใช้ authorization นั้น ไม่ถามอนุมัติเรื่องเดิมซ้ำ

## 5. ตรวจงานก่อนส่งต่อ

- ทำตาม acceptance criteria/tests/DoD ของ task และเก็บผลตามที่รอบนั้นต้องใช้ ไม่สร้างผล PASS, review หรือ submission evidence ที่ยังไม่เกิด
- TDD เก็บ RED บน task branch แล้วทำ GREEN/regression ก่อนรับ integration ตาม workflow ไม่ merge test ที่ตั้งใจล้มเข้า protected staging/main
- ส่งให้เพื่อนตรวจเมื่อถึง PR/gate ที่กำหนด ก่อนเริ่มงานถัดไปที่พึ่งพาผลนั้น; งานอิสระทำต่อได้ ไม่ต้องขออนุมัติทุกไฟล์หรือทุกคำสั่ง
- จบงานด้วย **owner + Task ID, branch, ไฟล์/พฤติกรรมที่เปลี่ยน, actual checks/results, จุดให้เพื่อนลอง และ next action**; ระบุ commit/PR เมื่อมีจริง และแยก implemented/verified/reviewed/merged ออกจากกัน

ใช้ project detail สำหรับทิศทางผลิตภัณฑ์ ใช้ workflow สำหรับลำดับ/เจ้าของ/กำหนดส่ง และใช้ต้นฉบับโจทย์สำหรับเกณฑ์งานส่ง ถ้าเอกสารขัดกันจนเปลี่ยนพฤติกรรมหรือการประเมิน ให้ชี้จุดขัดแย้งก่อนแก้ส่วนที่เกี่ยวข้อง ไม่เลือกข้อที่ง่ายกว่าเอง

## 6. คำสั่งเริ่มงานตัวอย่าง

```text
อ่าน skill/SKILL_Project.md และทำตามลิงก์ที่เกี่ยวข้อง
ฉันคือ <A หรือ B> ทำ Task <Task ID> จาก workflow/<ไฟล์รอบ>
ตรวจ dependencies และไฟล์ที่เพื่อนรับผิดชอบก่อนเริ่ม
อ่าน SKILL_Github ก่อนเขียนโค้ด งานใหม่แยก task branch ตาม workflow
พัฒนาแอปใน Project_code/ ถ้ามีงาน UI อ่าน SKILL_UI และยึด project_detail §8
ทำเฉพาะ task นี้พร้อมตรวจ acceptance แล้วส่ง handoff ให้เพื่อน review ตาม checkpoint
```

ไฟล์นี้เป็นกติกาใน repository ตามรูปแบบ `skill/SKILL_*.md` ที่ทีมใช้ การวางไฟล์อย่างเดียวไม่ได้รับรองว่า AI ทุกเครื่องจะโหลดให้อัตโนมัติ ให้เริ่มจาก workflow หรือระบุให้อ่านไฟล์นี้ในคำสั่งเริ่มงาน
