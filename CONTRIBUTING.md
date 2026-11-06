# ทำงานร่วมกันบน GitHub

A = [zerotwobook](https://github.com/zerotwobook) / B = [Atip-Infa](https://github.com/Atip-Infa) ทั้งคู่พัฒนา feature และ review งานของกันและกัน อ่าน [SKILL_Project](skill/SKILL_Project.md), [Git skill](skill/SKILL_Github.md) และ [workflow](workflow/README.md) ก่อนเริ่ม

## เริ่มจากงานที่มีอยู่

- [Issues ทั้งหมด](https://github.com/zerotwobook/fastTrack/issues): สร้างจาก Task IDs ทั้ง 3 รอบแล้ว ใช้ Issue เดิมของ task ไม่เปิดซ้ำ
- [Milestones](https://github.com/zerotwobook/fastTrack/milestones): D1, Lab 5, Lab 6, Lab 7, D2 และ Final; วันส่งแสดงใน milestone ส่วนเวลา 23:59 Asia/Bangkok อยู่ใน description/workflow
- [R1-J00 / G0](https://github.com/zerotwobook/fastTrack/issues/2): งานเริ่มต้นร่วมกัน ต้องบันทึกการยอมรับ baseline/เวลาว่าง/eligibility จริง
- A รับ [R1-A00 scaffold](https://github.com/zerotwobook/fastTrack/issues/3); B เตรียมแบบและรับ [R1-B00 schema/UI foundation](https://github.com/zerotwobook/fastTrack/issues/4) หลัง scaffold merge ตามแผน

Issues ถูก assign ให้ owner จริงแล้ว งานร่วม assign ทั้งสองคน Labels `sprint:1/2/3`, `owner:A/B/shared`, `lab5/6/7` ใช้กรองงาน โดย `blocked` หมายถึงยังรอ dependency/gate ก่อน implementation ให้เอาออกเมื่อเงื่อนไขผ่านจริง Native dependency graph แสดงงานที่ต้องรอเพิ่มเติมใน Issue

## Branch และ PR

มี `staging/sprint-1` เตรียมจาก planning baseline บน main แล้ว การสร้าง branch ไม่ถือว่า G0 หรือ working Sprint 1 ผ่าน ตรวจ shared baseline จริงก่อนเริ่ม ไม่สร้าง staging ชื่อเดียวกันซ้ำหรือ reset งานเพื่อน

```bash
git fetch origin
git status --short --branch
# งานใหม่และ working tree ที่ตรวจแล้วเท่านั้น: แทน <task-branch> ด้วยชื่อของตน
git switch -c <task-branch> origin/staging/sprint-1
```

A/B ใช้คนละ clone/worktree App code อยู่ใน `Project_code/` ดู shared-file owners ในแผน ก่อนแก้ schema/router/DTO/lockfile ต้องตกลงผู้รวมและ sync dependency ไม่แก้พร้อมกันโดยไม่ประสาน

Task PR → staging → เพื่อน review/approve → merge commit เมื่อผ่าน integration จึง release PR → main ผู้เขียนไม่ approve ตัวเอง งานเก็บ RED/GREEN และ sync main กลับ staging ต้องรักษา history ตาม workflow

Ruleset ของ repo บังคับ PR พร้อม approval 1 คนบน main และ `staging/sprint-*`, ยกเลิก approval เมื่อมี code changes ใหม่, resolve review conversations และห้าม force push/ลบ branch ไม่มี bypass actor ที่ตั้งไว้ Merge ใช้ merge commit และไม่เปิด auto-delete branch เพื่อรักษา staging หลัง release

ยังไม่ผูก required CI context ที่ไม่มีจริง เมื่อทำ [R2-B01 / Lab 5](https://github.com/zerotwobook/fastTrack/issues/15) ต้องสร้าง meaningful build/tests/Docker workflow ให้รันจริงก่อน แล้วเพิ่ม required checks/up-to-date policy พร้อม failed-gate proof ตาม handout ห้ามถือ PR approval ปัจจุบันแทน CI gate ของ Lab 5

## สถานะและการรับงาน

ใช้ PLANNED → IN PROGRESS → REVIEW → MERGED ตาม workflow; แยก verification NOT RUN/FAILED/PASSED กับ acceptance PENDING/ACCEPTED ไม่ถือปิด Issue ว่าผ่านทุก gate

Author ส่ง Task/Issue/PR, commit, สิ่งที่เปลี่ยน, วิธีลอง, actual tests/results และจุดให้เพื่อน review ก่อน merge บน staging ให้ตรวจ Issue linkage และปิด Issue ด้วยผลจริงเมื่อเข้าเกณฑ์ ไม่สมมติว่า Closes จะปิดบน non-default branch ให้เอง

งานเอกสาร/แบบไม่ได้ยืนยัน app ทำงานแล้ว เวลาว่าง/ชื่อรหัส/สิทธิ์หัวข้อ/TA approval/UAT ต้องมีหลักฐานจริงตาม checkpoint ที่เกี่ยวข้อง
