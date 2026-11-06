## Task / Issue / Owner

Task ID และ Issue:
Owner A/B และ reviewer:
Target staging ของรอบ หรือเหตุผลที่เป็น release/sync PR เข้า main:

## พฤติกรรมที่เปลี่ยน

อธิบายผลลัพธ์ที่ผู้ใช้ได้รับและ source/contract ที่เกี่ยวข้อง

## วิธีตรวจและผลจริง

- Commands / environment / tested commit:
- Actual results (หรือ NOT RUN พร้อมเหตุผล):
- ขั้นตอนให้เพื่อนลอง happy path และ rule/access ที่เกี่ยวข้อง:

## Dependencies และ shared files

ระบุ schema/migrations/DTO/router/lockfile/UI tokens ที่กระทบ และ owner ที่ประสานแล้ว

## Review / Handoff

- [ ] ขอบเขตตรง Issue และ workflow; app code อยู่ใต้ Project_code/
- [ ] อ่าน SKILL_Project และ SKILL_Github; งาน UI ใช้ SKILL_UI และ project detail §8
- [ ] ไม่มี secrets หรือ local env จริง
- [ ] แยก implemented/verified/reviewed/merged ตามจริง; author ไม่ approve ตัวเอง

PR ไป staging ให้ link Issue ด้วย Related #... และตรวจ Development linkage จริง การใช้ Closes บน non-default branch ไม่รับรองว่า Issue จะปิดอัตโนมัติ
