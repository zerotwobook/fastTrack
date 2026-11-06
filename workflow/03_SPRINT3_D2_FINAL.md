# รอบ 3 — Sprint 3: Summary, Deliverable 2 และ Final Delivery

> Language policy: conversation may be Thai; all newly authored or revised project content must be English. Read [SKILL_Project](../skill/SKILL_Project.md) and [AGENTS.md](../AGENTS.md). Translate legacy sections when editing them; unrelated existing sources are outside this change.

> แผนแบ่งงาน fastTrack | จัดทำ 5 พฤศจิกายน 2026 | ทบทวน 6 พฤศจิกายน 2026 | สถานะเริ่มต้น: Backlog
> A = คุณผู้ใช้, B = เพื่อน; ทั้งสองพัฒนา feature slices, tests, review และ release
> เริ่มเป้าหมาย 25 พฤศจิกายน หลัง accepted S2; เตรียม contracts อิสระล่วงหน้าได้
> D2 และ Lab 7: 29 พฤศจิกายน 2026 เวลา 23:59 น. | Final: 13 ธันวาคม 2026 เวลา 23:59 น.
> เวลา Asia/Bangkok; ช่วงสอบ 1–11 ธันวาคม ต้องวางแผนกำลังคนจริง

เริ่มจาก [README คู่มือใช้แผน](README.md) แล้วเลือก Task ID ของ A/B กติกา branch/sync/PR/TDD ใช้ร่วมกันทั้งสามรอบ

ก่อนเริ่มพัฒนาหรือแก้แอป อ่าน [SKILL_Project](../skill/SKILL_Project.md) เพื่อใช้กติกาโฟลเดอร์โค้ด การแบ่งงาน/branch และแบบ UI ร่วมกัน

## 0. เป้าหมายรอบนี้และการส่งงาน

รอบนี้ต่อจาก [รอบ 1](01_SPRINT1_D1.md) และ [รอบ 2](02_SPRINT2_LABS5-7.md) บนแอป/repository เดิม มีสอง checkpoint ใหญ่:

1. **ก่อน D2 29 พ.ย.:** S2 ต้องครบ, S3 contracts ครอบคลุมงานที่เหลือ และอย่างน้อยหนึ่ง workflow/rule ของ S3 ใช้งาน/ทดสอบจริงบน integrated candidate ที่ deploy แล้ว
2. **ก่อน Final 13 ธ.ค.:** ทั้ง baseline F-01–F-08 และ approved changes ครบ พร้อม final verification/UAT/re-tests, release, PDF และวิดีโอ

เป้าหมายภายในของแผนนี้คือทำ F-08 ทั้ง summary และ drill-down ให้ครบก่อน D2 เพื่อเหลือเวลาแก้ findings/ตรวจ final หากยังไม่ครบต้องระบุ completion กับ verification แยกกัน ห้ามอ้างว่าหน้าว่าง/mock data/contracts เท่ากับ meaningful implemented S3 progress

Lab 7 งาน implementation/approval อยู่รอบ 2 แต่การตรวจ submission ครั้งสุดท้ายวันที่ 29 พ.ย. ต้องทำในรอบนี้ด้วย D2 และ Lab 7 เป็นคนละ artifact/งานส่ง แม้ใช้ deployment บางส่วนร่วมกัน

## 1. Sources และ skill ที่ต้องอ่าน

1. [Project detail](../Project_doc/project_detail.md) §3 scope, §5 BR-10/NFR, §6 F-08, §8.6 H/8.10–11 UI, §9.3–9.5 APIs/read models, §10 reporting, §11 tests, §13 operations และ §14 final DoD
2. Accepted contracts/tests/decision log/S1/S2 release manifests ที่เกิดขึ้นจริง และ [แผนรอบ 2](02_SPRINT2_LABS5-7.md)
3. [ข้อกำหนดภาพรวม](../deliverable%20_file/summary_final_deliverable.md) §15 Lab 7, §16 D2, §17 Final และข้อขัดแย้งต้นฉบับที่บันทึกไว้
4. [D2 ต้นฉบับ](../deliverable%20_file/project_deliverable_2_v1.pdf), [Final ต้นฉบับ](../deliverable%20_file/project_final_delivery_v1.pdf), [Group specifications](../deliverable%20_file/group_work_specs_v1.pdf) และประกาศใหม่จากผู้สอนถ้ามี
5. **[Git skill](../skill/SKILL_Github.md) ทั้งไฟล์ก่อน Git/Issue/PR**; **[UI skill](../skill/SKILL_UI.md) ทั้งไฟล์ก่อน UI work**
6. [Lab 5 summary](../lab_file/lab5/LAB5_SUMMARY.md) และ deployment.md ของ fastTrack เพื่อรักษา delivery/persistence requirements
7. เมื่อทำ PDF ให้อ่าน skill PDF/document ที่มีจริงใน session และตรวจ render/page readability ตาม workflow ของ skill นั้น ไม่ส่ง Markdown แล้วถือว่าแทน PDF สำเร็จ

ใช้ F-01–F-08 และ approved revisions ล่าสุด ห้ามย้อนกลับไปใช้ feature numbering เก่าของ summary หรือถือข้อเสนอในแผนว่าเป็น TA approval

## 2. Branch และกติกาประสานงาน

- ใช้ `staging/sprint-3` จาก accepted S2 main release ไม่เริ่มจาก development branch ที่ยังมีงานค้างโดยไม่รู้ scope
- **ทุกงานใหม่สร้าง branch ใหม่จาก staging ก่อนแก้ไฟล์** เช่น `feature/s3-a-summary-overview`, `feature/s3-b-summary-drilldown`, `fix/s3-a-DEF-actual-id`, `docs/s3-b-final-report`
- Resume/review fixes ของงานเดิมใช้ branch/PR เดิม ไม่สร้าง duplicate; ตรวจ current head/base/reviews/checks จริงทุกครั้ง
- อ่าน Git skill, repository instructions, working tree และ pending human gates ก่อนลงมือ รักษา uncommitted work ของผู้ใช้/เพื่อน
- A/B ใช้คนละ clone/worktree; shared files มีเจ้าของรวม; ไม่เขียน implementation บน main/staging โดยตรง
- Feature PR → teammate review → staging integration → reviewed release PR main → CI/deploy → post-deploy checks
- CI ครอบคลุม `main` และ `staging/sprint-*`; CD จาก main ตาม policy เดิม ห้ามปิด checks เพื่อเร่ง Final
- ห้าม self-approve; AI เตรียม PR/หลักฐานได้ตาม authorization แต่ไม่แทน teammate approval/independent UAT/TA approval และไม่ merge เองหากไม่มีคำสั่งชัดเจน
- เก็บ `sprint-1-*`, `sprint-2-*`, `d2-candidate-*`, `final-*` เป็น immutable tags/commit references; ชื่อเป็นข้อเสนอ ไม่รายงานว่าสร้างแล้วก่อนตรวจจริง
- หาก final candidate เปลี่ยนโค้ด/ข้อมูลตั้งค่าที่มีผล ให้สร้าง candidate ใหม่และรัน checks ที่ได้รับผลกระทบ ไม่ใช้ screenshots/results ของเวอร์ชันเก่าอ้างแทน

หลัง release เข้า main ให้ sync กลับ `staging/sprint-3` ผ่าน sync branch/PR ตาม README ข้อ 3 ก่อนรับงาน dependent/release ถัดไป ไม่แก้ history หรือปิด up-to-date check งาน sync เป็นงานใหม่ต้องมี branch ใหม่เช่นเดียวกับงานพัฒนา

## 3. Entry checklist ก่อนเริ่ม feature implementation

- [ ] ระบุ accepted S2 tag/commit, deployed URL/image digest และ release run จริง
- [ ] F-05–F-07 ครบและ S1 regression ผ่าน; gaps ที่ยังมีระบุอย่างตรงจริง
- [ ] Progress/status service ของ F-07 มีสูตร/fixtures/exports ที่ A/B เข้าใจตรงกัน
- [ ] มี S2 upgrade/history/feedback association evidence; ไม่เริ่ม F-08 บน DB mock ที่ไม่ตรงของจริง
- [ ] สรุป UAT findings/approved Lab 7 change และผลต่อ semantics ล่าสุด เช่น deadline/status ที่เปลี่ยนแล้ว
- [ ] Lab 7 PDF/metrics/approval links อยู่ไหน ใครยังต้องเติมอะไร ระบุชัดก่อน 29 พ.ย.
- [ ] เติมชื่อ/GitHub/time capacity A/B จริง และ assigned Issues ของรอบนี้

หากยังรอ S2 integration สามารถเตรียม F-08 contract/UI design/test fixtures ได้ แต่ห้ามประกาศ integrated progress/release ผ่านจาก fixtures เพียงอย่างเดียว

## 4. แบ่งงานพัฒนาให้ทำขนานได้

F-08 เป็น feature หลักหนึ่งชุดของ baseline แผนนี้แยกเป็นสอง functional slices ที่แต่ละคนทำ UI/API/tests ของตน โดยยังคง parent requirement FR-10/F-08 เดิม:

| Slice | เจ้าของ | ขอบเขต full-stack | Reviewer |
|---|---|---|---|
| **F-08A Summary overview + filters** | **A / คุณ** | Scoped summary queries/totals/team rows, overview/filter UI และ weighted calculation/access tests | B |
| **F-08B Drill-down + result navigation** | **B / เพื่อน** | Scoped filtered item queries/pagination ตาม contract, result list/drill-down UI, links/empty/refresh และ access/consistency tests | A |

A ไม่ต้องรอ B สร้างทั้งหน้าจอ และ B ไม่ต้องรับงานทดสอบอย่างเดียว ทั้งคู่มีโค้ด feature จริง แต่ต้อง freeze shared contract ที่ G1 ก่อนแยก branch implementation

| Task | Owner | Reviewer | Dependency / output |
|---|---|---|---|
| R3-J00 | A+B | ร่วม | S2 handoff, final scope/risks, F-08 contract/AC/STS และ shared interfaces |
| R3-A01 | A | B | F-08A overview/filter/totals ครบ UI/API/tests |
| R3-B01 | B | A | F-08B drill-down/items/navigation ครบ UI/API/tests |
| R3-J01 | A+B | ตรวจข้าม | F-08 integration + S1/S2 regression + candidate deploy |
| R3-A02 | A | B | D2 A/C/D และ actual domain/release traceability |
| R3-B02 | B | A | D2 B/E, PDF assembly และ Lab 7 final submission checklist |
| R3-J02 | A+B | ร่วม | D2 candidate acceptance; ส่ง D2 และ Lab 7 แยกกัน |
| R3-A03 | A | B | Final domain/data/concurrency regression; fixes ใน feature ที่รับผิดชอบ |
| R3-B03 | B | A | Final auth/access/UI/operational regression; fixes ใน feature ที่รับผิดชอบ |
| R3-J03 | A+B + independent testers จริง | ตรวจร่วม | Final UAT/re-tests, readiness, immutable release |
| R3-A04 | A | B | Final requirements/contracts/test matrix และส่วน demo ของตน |
| R3-B04 | B | A | Final engineering/QA/PDF/video assembly และส่วน demo ของตน |
| R3-J04 | A+B | ร่วม | Final package/version/video/access และ submission receipt |

## 5. Freeze contract ก่อนแบ่ง F-08A/F-08B

อ้าง project detail §9.4/§10 เป็นฐาน และ version feature contract ก่อนเขียน implementation:

- Route หลักเสนอไว้คือ GET `/api/summary?teamId=...&status=...`; actor เป็น Supervisor เท่านั้น
- Response มี `asOf`, `filters`, `totals`, `matchedCount`, `teams`, `items` ภายใน envelope ที่ระบบใช้
- `totals` คิดจาก team scope ที่เลือก; `matchedCount/items` ใช้ status filter เพิ่ม; label UI ต้องสื่อว่าเป็นคนละยอด
- ถ้าทำ pagination ให้ตกลง `page/pageSize` หรือ cursor, limits/defaults, invalid-input errors, sort/tie-breaker, count และ response metadata ก่อนเขียนโค้ด ไม่ใช้คนละแบบระหว่าง A/B
- Filter teamId ต้อง intersect กับ supervisor scope ไม่ใช่ overwrite scope; invalid filter 400; ทีมที่ไม่มีสิทธิ์ 404; Student 403; no session 401
- Query totals/teams/items ภายใน **consistent snapshot เดียวและ asOf เดียว**; service ของ A และ B รับ transaction client/scope/clock context จาก coordinator เดียวกัน ไม่เปิด transaction คนละชุดให้ยอดต่างเวลา
- Drill-down ทำคำขอใหม่ด้วย filters นิยามเดียวกัน; asOf ใหม่ได้เมื่อข้อมูลเปลี่ยน ไม่อ้างว่า asOf เป็น historical snapshot token
- ตกลงว่าจะใช้ route เดียวกับ projection หรือ route เพิ่ม หากเพิ่มต้องเขียน contract/permission/tests ให้ครบก่อน ไม่สร้าง endpoint ใหม่โดยไม่อธิบาย
- Shared formula/status ใช้ F-07 service เดิม; response มีเฉพาะข้อมูลที่ UI ต้องใช้ ไม่ serialize raw DB models/private session fields

**Contract artifact ที่ต้องส่งให้กัน:** request/response examples แบบ synthetic, parameter validation, field names/types, status enum, query ordering, pagination behavior, empty states, error cases, expected fixtures และ module export signatures

### เจ้าของไฟล์และ integration seam

| พื้นที่เป้าหมาย | Owner | ข้อตกลง |
|---|---|---|
| `server/src/modules/reports/summary-service.*` / summary coordinator/router | A | B ส่ง item-query export; coordinator คุม scope/transaction snapshot |
| `server/src/modules/reports/summary-items.*` | B | รับ validated filters/scope/transaction ไม่เปิด scope ใหม่; ไม่คำนวณ totals อีกสูตร |
| `client/src/features/summary/SummaryPage*`, filters/totals/team table | A | รับ DrilldownList component จาก B; shared URL state contract เดียวกัน |
| `client/src/features/summary/Drilldown*`, item list/pagination/navigation | B | ไม่สร้าง filter state แยกที่ไม่ sync กับ URL/page |
| shared DTO/query keys/status helpers | A รวม PR; B review | ทั้งคู่เสนอ changes ก่อน; ไม่แก้สอง branch พร้อมกันโดยไม่ sync |
| schema/migrations ถ้าจำเป็นจริง | B รวมหลัง A review | F-08 ควรอ่านข้อมูลเดิม; หากต้องเพิ่ม index/migration ต้องทดสอบ upgrade และไม่ลบ history |
| root router/manifests/lockfiles | ระบุ integrator คนเดียวต่อ Issue | แก้เฉพาะ dependencies/routes ที่ตกลง |

Paths เป็นขอบเขตการทำงาน ไม่บังคับ extension ที่ยังไม่ยืนยัน ให้ใช้โครงสร้างจริงที่มีแล้วและลงชื่อไฟล์จริงใน Issue ก่อนแก้

## 6. R3-A01 — คุณ: Summary overview/filter

อ้าง FR-10/BR-02/BR-10, NFR-02/05, §10 และ T-30 ส่วน S3

### Backend และ data

- [ ] ใช้ authenticated supervisor identity ค้นเฉพาะ assigned teams ทุก aggregate/query รวมกรณีไม่มี team filter
- [ ] Implement scoped totals และ per-team rows ด้วย counts จาก milestone/submission จริง ไม่ใช้ browser counters
- [ ] สูตรรวม `sum(submitted)/sum(total)` ไม่เฉลี่ยเปอร์เซ็นต์รายทีม; total=0 เป็น 0 และ round ตาม shared policy
- [ ] Cancelled ตัด denominator; revision/feedback ไม่เพิ่ม submitted count
- [ ] Status filter เปลี่ยน matched items/count ไม่เปลี่ยน completion ratio แบบเงียบ ๆ
- [ ] Coordinator เรียก shared F07 semantics และ item-query ของ B ใน snapshot/context เดียว
- [ ] Query ordering มี tie-breaker; params ไม่ถูกต้องคืน safe error; no private fields/SQL leaks

### UI

- [ ] `/summary` เฉพาะ Supervisor; Student ไม่เห็นเมนูและ API ยังปฏิเสธเมื่อเรียกตรง
- [ ] Team/status filters อยู่เหนือรายการ; selected filters สะท้อน URL/query state ตาม contract
- [ ] ตารางทีม/ส่งแล้ว/ทั้งหมดที่นับ/เปอร์เซ็นต์/ยังไม่ส่ง/เลยกำหนด ตามข้อมูลจริง
- [ ] Totals กับ filtered result count มีคำอธิบายชัด; percentage คือสัดส่วนการส่ง ไม่ใช่คะแนน
- [ ] Click จำนวน/ทีมแล้วเปิด drill-down ของ B ด้วย filters ที่ตรง ไม่ส่ง raw authority/team scope จาก browser
- [ ] Empty/no teams/no match/loading/error/retry สื่อความหมายต่างกัน; แสดง asOf ที่อ่านเข้าใจได้
- [ ] Monochrome/fonts/table accessibility/responsive ตาม §8 ไม่เพิ่ม hero chart หรือฟีเจอร์ grading

### Tests และ review handoff

- [ ] ทีม A 1/1 และทีม B 0/9 → รวม 10.0% ไม่ใช่ 50.0%; fixture ทั้งคู่ต้องอยู่ใต้ supervisor ที่มีสิทธิ์เพื่อทดสอบสูตร และมี supervisor/ทีมอื่นแยกไว้ทดสอบ scope
- [ ] Zero denominator, cancelled-only, multiple revisions, feedback latest/old, status/team filter และ boundary time
- [ ] ไม่มี filter แล้วไม่รั่ว counts ของทีมอื่น; out-of-scope filter/list/count/drill-down ทุกชั้นถูกปฏิเสธ
- [ ] Assertions totals/count/rows ตรง DB snapshot; browser renders response ถูกและ refresh ไม่คงค่าเก่า
- [ ] ส่ง actual commands/results, API samples แบบไม่เผย private data และ UI screenshots ของทุก critical state ให้ B ตรวจ

## 7. R3-B01 — เพื่อน: Drill-down/result navigation

อ้าง FR-10, BR-02/10, §9.4/§10, NFR-02/05 และ T-30

### Backend และ data

- [ ] Implement item query จาก filters/scope/asOf/transaction ที่ตกลงกับ A; ใช้ status function เดียวกับ progress/summary
- [ ] matchedCount/items เป็นชุดข้อมูลเดียวกันก่อน pagination; หน้าแต่ละหน้าตัดเฉพาะ items ไม่ตัด totals
- [ ] Stable ordering + tie-breaker และ page/cursor validation ที่ version แล้ว; ไม่คืนแถวซ้ำ/หายเพราะ sort ไม่แน่นอน
- [ ] Item references กลับไป milestone/submission ที่ scoped API ตรวจซ้ำ; ไม่ให้ list เปิดเผยชื่อทีม/feedback ที่ไม่อยู่ใน scope
- [ ] New fetch เมื่อข้อมูลเปลี่ยนคืน asOf ใหม่และแจ้งให้ overview refresh ไม่สัญญา snapshot เก่าที่ backend ไม่รองรับ

### UI

- [ ] Result list/drill-down component รับ filter state ที่ตรงกับ overview/URL; back/forward/refresh เปิดบริบทเดิมได้
- [ ] Click ยอด pending/overdue/submitted แล้วรายการอธิบายยอดนั้นได้; เกณฑ์ status ล่าสุดตรง F07
- [ ] เปิด milestone/submission detail ด้วย ID ที่ถูกต้องและกลับ summary ได้โดยไม่ทิ้ง filters โดยไม่จำเป็น
- [ ] ปุ่ม pagination/filter change จัดการ empty last page/new count ตาม contract ไม่โชว์หน้าว่างลวงว่าข้อมูลหาย
- [ ] Accessible semantic table/list, keyboard links, focus, mobile horizontal scroll เฉพาะ table container และ zoom 200%
- [ ] Account/session change ล้าง private query/draft state; ไม่ flash ทีมของคนก่อน

### Tests และ review handoff

- [ ] Filter tuple ใน overview ตรง request/result ของ drill-down; matchedCount และแถวก่อน pagination ตรงกัน
- [ ] Empty/no-match/all-cancelled, invalid pagination/filter, tie timestamps และ counts ไม่ขึ้นกับ page size
- [ ] เปลี่ยน submission ระหว่างสอง fetch: แสดง asOf ใหม่/refresh totals; ไม่อ้างผลต่างเวลาเป็น bug ของสูตร
- [ ] Direct deep-link ของ supervisor-B ไป team-A ถูกปฏิเสธ; Student API summary ถูกปฏิเสธ
- [ ] Browser journey summary → filtered items → detail → back/refresh พร้อม session จริง
- [ ] ส่ง fixtures/queries/components/export changes และ actual tests ให้ A review ก่อน G2

## 8. งานร่วมเพื่อ D2: ห้ามตกหล่น

D2 ต้องอ้าง candidate ที่รวม S1+S2+ส่วน S3 ที่ implemented แล้ว โดยคง accepted S1/S2 tags ไว้แยกจาก candidate

### ขอบเขต Part A–E และเจ้าของ

| D2 Part | Owner รวม | Reviewer | ของที่ต้องมี |
|---|---|---|---|
| A S1 continuity/change (5) | A | B | S1 tag เดิม, original journey บน candidate, changes/defects จาก Labs 5–7 |
| B S2 contracts/working increment (25) | B | A | F-05–07 contracts/AC/STS/DoD, completion/results, working demos อย่างน้อยสองฟีเจอร์, reviews/releases |
| C S3 contracts/progress (15) | A รวม; B ส่ง F08B | B ตรวจรวม | Contracts งานเหลือทั้งหมด, อย่างน้อยหนึ่ง S3 workflow/rule ทำงานและทดสอบจริง, explicit remaining work |
| D Updated traceability (10) | A | B | SRS/inventory/system SDS ล่าสุด; requirements→feature→Sprint→AC/NFR→tests→result/version |
| E Integrated release candidate (15) | B | A | Integrated demos/build/regression/CI/deploy/post-deploy/persistence/setup/readiness และ dated final completion plan |

### หลักฐานที่ A ต้องส่ง B

- [ ] Original S1 flow บน D2 candidate พร้อม deadline/access case และ version
- [ ] F-08A actual test/output และอย่างน้อยหนึ่ง rule/flow ของ S3 ที่ใช้ได้จริง
- [ ] Requirement/test matrix ระบุ planned/implemented/verified แยก; tests ของงานที่ยังไม่ทำไม่ใส่เป็น PASS
- [ ] Scope/decision changes และ impact ต่อ S1/S2 จาก approved maintenance
- [ ] Remaining-work list: task/owner/dependency/target date/acceptance ไม่ใช้ข้อความกว้างว่าเก็บงานต่อ

### หลักฐานที่ B ต้องส่ง A

- [ ] Accepted S2 tag + two meaningful S2 demos และ actual assertions/files/results
- [ ] F-08B integrated navigation/data access results
- [ ] CI/run/image digest/deployed revision/traffic และ public URL ของ candidate
- [ ] Post-deploy business flow/persistence/README reproduction และ safe account handoff
- [ ] PDF draft มี Parts A–E, version/front matter/navigation/page references และรูปอ่านได้

### D2 selected evidence ที่ต้องอยู่ใน PDF ด้วย

ตาม D2 ต้นฉบับ §4.2 หน้า 4–5 ต้องเก็บรายการต่อไปนี้สำหรับ D2 ด้วย ไม่รอจนถึง Final:

- [ ] **A:** actual automated test excerpt 1 ชุดด้าน domain/cross-feature rule มี setup/assertions และผล execution บน version ที่ระบุ
- [ ] **B:** actual automated test excerpt 1 ชุดด้าน role/ownership restriction พร้อมผล execution รวมเป็น **2 excerpts**
- [ ] **A รวบรวม/B ตรวจ:** meaningful TDD RED/GREEN + commits/commands/output จริงของงาน sampled; ไม่ merge failing test เข้า main เพื่อสร้างหลักฐาน
- [ ] **A และ B คนละ chain:** รวม **2 selected Issue/PR chains** มี feature/contract IDs, branch, author/reviewer, substantive review, staging/release linkage และวันที่จริง
- [ ] **B รวม/A ตรวจ:** build/test/CI output มี PASS/FAIL/SKIPPED counts จริง, original S1 continuity demo, อย่างน้อย 2 meaningful S2 features และอย่างน้อย 1 implemented/tested S3 workflow/rule
- [ ] ภาพแต่ละ scenario มี feature/AC, role, preconditions, steps, expected/actual และ tested version; persistence/access มี API/DB evidence ประกอบ
- [ ] Front matter มีสมาชิก/theme/repo/tag/URL/version; contribution/AI-use/limitations และ evidence/navigation index อ่านได้ใน PDF
- [ ] ตรวจทุกข้อก่อนผ่าน G3; ไม่ใช้ generic คำว่า tests/history พร้อม แล้วข้าม excerpts หรือ chains

### ตรวจ Lab 7 พร้อม D2 แต่ส่งแยก

- [ ] A ตรวจ approval, before/after contract, RED/GREEN และ metric definitions/sources จากรอบ 2
- [ ] B ตรวจ implementation/regression/CI/deploy/readiness/retro และรวม report
- [ ] ทั้งคู่ตรวจว่ามี **5 dated metrics** พร้อม interpretation ไม่เกิน 100 คำ และข้อจำกัดจริง
- [ ] ตรวจชื่อไฟล์/รูปแบบจาก handout/ประกาศจริง; ไม่เอา D2 PDF แทน submission Lab 7
- [ ] ผู้ส่งบันทึกหลักฐานรับส่งทั้งสองงานก่อน 29 พ.ย. 23:59; AI ไม่ส่ง LEB2 หรือข้อความเองหากไม่ได้รับคำสั่ง

## 9. Final QA และการแบ่งงานแก้ปัญหา

หลัง D2 ให้เปิดรายการ gaps/defects ของ candidate แล้วมอบตามโมดูลและความเสี่ยง แต่ยังใช้ branch ใหม่ต่อ fix Issue และ cross-review เสมอ ห้ามยก baseline feature ที่ยังขาดเป็น technical debt แล้วประกาศ complete

### R3-A03 — คุณนำ domain/data checks

- [ ] Re-run domain journey F-01–F-08 แบบ integrated และ tests ตาม approved baseline ล่าสุด
- [ ] Deadline/duplicate/revision/version conflict; field boundaries/Unicode/URL/timezones/clock precision
- [ ] Membership/history locks, edit/cancel vs submission races, feedback retry และ association ทุก version
- [ ] Progress/weighted summary/status/filter/drill-down สูตรเดียวกันและ scope ถูก
- [ ] Fresh DB migration/seed ซ้ำ + upgrade จาก accepted S1/S2 DB copy ไม่ reset history/password
- [ ] Data persistence หลัง restart/redeploy/compatible rollback และ roll-forward หากใช้ใน evidence
- [ ] แก้ defects ใน owned modules; หากกระทบ B ให้ตกลง shared change ก่อนและ B review assertions/data effects

### R3-B03 — เพื่อนนำ access/UI/operations checks

- [ ] Auth/session expiry/revocation/CSRF/origin/content type และ role/ownership matrix ของ **ทุก endpoint ใหม่ด้วย**
- [ ] Browser account switch/cache clearing/deep links/returnTo; no data leak ใน errors/logs/UI
- [ ] Public-login throttling/429 ที่ตกลงใน Lab 5 ทำงานกับ topology จริง; secret/config ไม่อยู่ client/image/log/report
- [ ] Keyboard/focus/labels/contrast/loading/empty/error/recovery; 320/390/768/1280/1440px และ zoom 200%
- [ ] Health/readiness/version, migration failure stops rollout, main SHA/image digest/serving revision ตรง
- [ ] Clean checkout/run/test จาก README บน environment อิสระของเพื่อนโดยไม่แก้ source เฉพาะเครื่อง
- [ ] แก้ UI/access/operational defects ในโมดูลที่รับผิดชอบ; A review behavior จริง

### Independent acceptance และ defect closure

ทั้งคู่จัด case/data/version ให้ independent testers จริง ไม่ใช้ผู้พัฒนาหรือ AI แทนผู้ทดสอบอิสระ เก็บ tester/date/version/steps/expected/actual/PASS/FAIL/defect link

Accepted critical defects ต้องแก้และ re-test บน final candidate; relevant UAT cases จาก Lab 6 ต้องทวนหลัง changes ไม่ยกผล S1 เก่ามาอ้างว่า final ผ่าน เมื่อไม่ผ่านให้บันทึก severity/impact/owner/fix/retest และไม่ประกาศ final ready จน required checks ปิดครบ

**Full final verification ใช้ final assessed version:** รวบรวมผล unit/API-DB/browser/system/NFR/regression ตาม scope ที่เกี่ยวข้อง พร้อม commit/commands/counts จริง ตรวจ assertions มากกว่าจำนวน tests และห้ามเพิ่ม performance SLA/ผลวัดที่ไม่เคยตกลง

## 10. Final package และเจ้าของแต่ละส่วน

| Final Part | Owner รวม | Reviewer | เนื้อหา |
|---|---|---|---|
| A Final working product (35) | A domain/demo; B UI/access/demo | ตรวจข้าม | Complete feature table, journeys/rules/errors/boundaries/persistence/permissions |
| B Engineering/team evidence (15) | B | A | History ครบ 3 Sprint, contract→Issue→branch→test→review→release, สอง chains จากคนละ Sprint, contributions/AI-use |
| C Requirements/verification traceability (20) | A | B | Final SRS/inventory/system SDS/all feature contracts AC/STS และ actual final verification/NFR matrix |
| D QA/Product DoD (20) | B รวมผล A+B | A | Tests/regression/integration/acceptance/UAT/retests/defect-debt/readiness/CI/deploy/setup |
| E Demonstration video (10) | B ตัดต่อ/รวม; A+B นำเสนอร่วมกัน | ตรวจร่วม | Actual deployed product/assessed version/workflows/rule rejection, YouTube link/timestamps |

คะแนนในตารางยึด detailed Final handout ที่อ้างใน summary หาก master/ประกาศใหม่ต่างกัน ให้ตรวจข้อขัดแย้งกับผู้สอน ไม่สร้างคะแนนเพิ่มหรือซ่อนความต่าง

### PDF และเอกสาร

- [ ] PDF เดียวมีเนื้อหา SRS/SDS/contracts/verification และหลักฐานครบในไฟล์/appendices; ใช้ internal references ลดสำเนาซ้ำ
- [ ] Cover: ชื่อ/รหัสทั้งคู่, theme/fastTrack, repo, immutable release, public URL/version
- [ ] Contents/navigation table Parts A–E, page references และ requirement/test/evidence IDs ที่ตรงจริง
- [ ] Actual test excerpts อย่างน้อยสองตัวอย่าง: domain/cross-feature และ access; build/test commands/commit/counts อ่านได้
- [ ] Two real Issue/PR/review chains จาก **คนละ Sprint** มี author/reviewer/วันที่และ merge/release linkage
- [ ] One-page release summary ตาม master: scope/team/version/links/completion/limitations โดยไม่บวก rubric เพิ่มเอง
- [ ] AI-use และ contribution ของแต่ละคนตรงงานจริง ไม่เท่ากับจำนวน commit และไม่แต่ง review/TDD ย้อนหลัง
- [ ] Render PDF ตรวจทุกหน้า: ภาพไม่เล็กจนอ่านไม่ได้, no clipping, page refs/links/captions ถูก, secrets ถูกตัดก่อนใส่
- [ ] ตรวจรูปแบบชื่อไฟล์/ช่องส่งจากประกาศจริง; ชื่อ report Markdown ที่เสนอ เช่น `deliverable _file/submit/project_deliverable_2.md` / `project_final_delivery.md` เป็น planned artifacts ไม่ใช่ไฟล์ที่มีแล้ว

### Video แบ่งหน้าที่ A/B

A นำ product goal/Student submit/domain rejection; B นำ Supervisor milestone/feedback/history/summary และ release/test evidence ทั้งคู่ปรากฏนำเสนอร่วมกันตาม wording ของ Final handout ไม่แทนด้วยการบันทึก call แยกคนโดยไม่ตรวจข้อกำหนด

โครงเวลาเสนอให้วางได้ภายใน 4 นาที:

| ช่วง | เนื้อหา | ผู้พูดหลัก |
|---|---|---|
| 0:00–0:20 | ทีม/fastTrack/assessed version และเป้าหมาย | A+B |
| 0:20–1:30 | Milestone → submit → saved retrieval → feedback | A/B สลับตาม role |
| 1:30–2:25 | Revision/history/planning/progress/summary ที่สำคัญ | B แล้ว A |
| 2:25–3:10 | Rule rejection/unauthorized case และ persistence | A |
| 3:10–3:45 | Architecture ย่อ, test/CI และ requirement-to-test chain | B |
| 3:45–4:00 | Completion/ข้อจำกัดและ release reference | A+B |

มีข้อขัดแย้งระยะเวลาวิดีโอ 4/10 นาทีในแหล่งเดิม แผน <=4 นาทีเป็นข้อเสนอชั่วคราว ต้องตรวจประกาศ/คำชี้แจงจริงก่อนส่ง ไม่อ้างว่าข้อขัดแย้งหายไปแล้ว

ถ่ายจาก running final product ที่ตรง release และไม่เผย passwords/token/private information ตรวจ YouTube access/timestamps/title/version ตามข้อกำหนด Upload/publish หรือส่งแทนผู้ใช้ทำเฉพาะเมื่อมีคำสั่งชัดเจน

## 11. Human checkpoints และเงื่อนไขไปต่อ

ทุก gate เริ่ม PENDING ทั้งคู่ต้องระบุชื่อ/เวลา/branch+commit/สิ่งที่ลอง/ผล/ข้อพบใน Issue/PR/evidence AI สรุปให้ตรวจได้ แต่ไม่ tick human approval จากการไม่มีคำตอบ

| Gate | จุดตรวจร่วม | ต้องเห็นก่อนผ่าน | ถ้ายังไม่ผ่าน |
|---|---|---|---|
| G0 S2 handoff | ทวน S1/S2 tags, deployed app, Lab 7 changes และ gaps | Accepted S2 และ shared progress semantics จริง | ทำ contract draft อิสระ; ไม่อ้าง integrated S3 pass |
| G1 F08 contract | A/B ตกลง filters/DTO/pagination/snapshot/scope/ownership | Versioned contract/AC/STS และ exports/interface ที่เข้าใจตรงกัน | แก้ contract ก่อน dependent implementation |
| G2 F08 integration | A ใช้ drilldown ของ B; B เทียบ overview/totals ของ A กับ DB | Real UI/API/DB, weighted/filter/scope tests และ S1/S2 regression | Fix บน task branch; ไม่ใช้ mock demo แทน |
| G3 D2 candidate | ตรวจ S2 completion, actual S3 progress, deployment และ D2/Lab7 packages | Immutable candidate, D2 excerpts 2/TDD/chains 2 พร้อม และทั้งสอง PDF พร้อมส่งแยก | เปิด remaining work/risks; ไม่ประกาศครบหากยังขาด |
| G4 Final QA | A/B รันข้ามหน้าที่ + independent testers/retests | Required features/checks/NFR ผ่าน, critical defects ปิด, clean setup/release traceability | แก้แล้ว rerun affected checks; ไม่มี release ready claim |
| G5 Final release freeze | เทียบ final source/tag/config/image/revision/test results | Same assessed version ทุกหลักฐาน; ไม่มี pending change ที่ปะปน | สร้าง candidate ใหม่เมื่อมี fix; รักษา tag/evidence เดิม |
| G6 Package/submission | เปิด PDF/video/links ด้วยมุมมองผู้ตรวจ | Parts A–E ครบ, video/version/readability/access ถูก, A/B รับรอง | แก้ artifact และตรวจส่วนที่เปลี่ยนก่อนส่ง |

ระหว่างรอเพื่อนตรวจ ให้ทำงานอิสระที่ไม่เปลี่ยน interface/scope ที่รออนุมัติ เช่นเตรียม traceability หรืออ่านผล tests ไม่ merge/เริ่ม dependent task เพียงเพราะอยากเดินเร็วขึ้น

## 12. กำหนดภายในที่เสนอ

| วัน/ช่วง | A | B | Checkpoint |
|---|---|---|---|
| ก่อน/ภายใน 24 พ.ย. | รับ progress/contract interfaces จาก S2 | ตรวจ migration/release/known gaps | เตรียม G0; S2 ต้องไม่ค้างไปวันส่ง D2 |
| 25 พ.ย. | F08A contract/query/test design | F08B contract/query/test design | G1 ก่อน code ตาม slice |
| 26–27 พ.ย. | Overview/filter/weighted tests | Drilldown/items/navigation tests | Cross-review และ G2 |
| 28 พ.ย. | D2 continuity/traceability/S3 results | Candidate deploy/PDF/Lab7 package | G3 draft/readiness |
| 29 พ.ย. | ตรวจ PDF/version/remaining-work | ตรวจ PDF/links และแยกแพ็กเกจ Lab 7 | ส่ง D2 และ Lab 7 แยกก่อน 23:59 |
| 30 พ.ย. | ปิด critical findings ตาม owner | Final test/evidence prep | อย่าเก็บ main workflow ไว้หลังสอบ |
| 1–11 ธ.ค. | งานแก้จำกัดขอบเขตตามเวลาว่างจริง | QA/retests/docs ตามเวลาว่างจริง | ระบุ capacity; ไม่รับ scope เพิ่มโดยเงียบ |
| เป้าหมาย 12 ธ.ค. | Final QA/freeze/demo | PDF/video/access check | G4/G5/G6 ให้มี buffer |
| 13 ธ.ค. | ตรวจส่งร่วม | ตรวจส่งร่วม | Final ก่อน 23:59 |

ตารางนี้เป็นเป้าหมาย ไม่ใช่ตารางเรียน/เวลาว่างที่ยืนยันแล้ว หากทำ S3 ไม่ครบก่อน D2 ต้องมี actual meaningful progress และ dated completion plan ตามโจทย์ ไม่ย้ายงาน S2 ที่ค้างมาเรียก S3

## 13. Release manifest และการเก็บหลักฐานให้ตรง version

เก็บใน existing evidence location/Issue ที่ทีมใช้ หรือเพิ่ม release manifest เมื่อยังไม่มีโดยไม่สร้างเอกสารซ้ำหลายชุด:

```text
Release purpose: D2 candidate | Final candidate | Final assessed
Tag / full commit SHA:
Contract/baseline revision:
Build/test commands + output references + PASS/FAIL/SKIPPED:
CI/deploy run:
Image digest / serving revision / traffic:
Public URL / health version:
Migration execution / data-persistence evidence:
UAT testers/version/retest references:
Known limitations / open defects:
Reviewer A / Reviewer B / date / gate result:
PDF/video artifact versions:
Submission by / time / receipt: (เติมหลังส่งจริง)
```

ไม่ใส่ password, cookie, auth/CSRF token, connection string หรือ service-account keys ใน manifest หากไฟล์อ้าง relative links ให้ตรวจว่ามีจริงและเปิดได้ก่อน release

## 14. คำสั่งเริ่มงานสำหรับ AI

Prompt A:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ A ตาม workflow/03_SPRINT3_D2_FINAL.md
อ่าน project_detail §9–10/accepted S2 contracts และ skill/SKILL_Github.md กับ skill/SKILL_UI.md
ตรวจ entry gate/live repo ทุกงานใหม่สร้าง branch จาก staging/sprint-3 ก่อนแก้
ฉันรับ F08A overview/filter/totals แบบ full-stack, domain/data QA และ requirements/traceability
เพื่อน B รับ drilldown/items/navigation; freeze DTO/pagination/snapshot/query context ก่อนแยกทำ
ใช้ F07 formula/status เดิมและจริงจาก DB ห้ามเฉลี่ยเปอร์เซ็นต์รายทีม/ให้ filters ข้าม authorization
ทำ task ปัจจุบันพร้อม tests แล้วส่งให้ B ตรวจตาม gate; ไม่ merge หรืออ้าง human/UAT approval เอง
```

Prompt B:

```text
อ่าน skill/SKILL_Project.md ก่อนเริ่มงาน
ทำงานให้ B ตาม workflow/03_SPRINT3_D2_FINAL.md
อ่าน sources/skills/accepted contracts ก่อน ตรวจ branch/Issue/PR และ human gates จริง
ทุกงานใหม่สร้าง branch จาก staging/sprint-3; งาน review fixes ใช้ branch เดิม
ฉันรับ F08B drilldown/items/navigation แบบ full-stack, access/UI/operational QA และ PDF/video assembly
ประสาน A เรื่อง coordinator/totals/filters/asOf; query items ต้องใช้ scope/transaction เดียวกัน
ทำ integrated tests ด้วย API/DB จริงและให้ A ตรวจ ก่อนส่ง D2 หรือ final candidate
ห้ามสร้างผล PASS, tester, TA approval, release/submission receipt ที่ยังไม่เกิด
```

## 15. Checklist จบรอบและหลังส่ง

### D2 / Lab 7

- [ ] S2 ครบและ accepted tag เดิมยังอ้างได้
- [ ] S3 contracts ครบงานเหลือ และมี workflow/rule implemented/tested จริง
- [ ] Candidate รวม S1–S3 progress, deployed และ business/persistence checks ผ่านตาม scope
- [ ] D2 Parts A–E + actual evidence + dated remaining-work plan ครบ
- [ ] Lab 7 approval/change/RED-GREEN/metrics/readiness ครบและส่งแยก
- [ ] A/B ตรวจ G3 และบันทึกหลักฐานส่งจริงวันที่ 29 พ.ย.

### Final

- [ ] F-01–F-08 และ approved changes ครบพร้อม final requirements/test coverage
- [ ] Domain/access/history/persistence/error/recovery/UX checks ของ final version ผ่าน
- [ ] Independent UAT/retests และ accepted critical defect closure จริง
- [ ] Clean setup/CI/deploy/main commit/image/revision ตรง; no secret leakage
- [ ] ทั้งสองร่วม code/tests/review/delivery และมี evidence 3 Sprint; selected chains จากคนละ Sprint
- [ ] Final PDF A–E/appendices/page refs/actual tests/NFR/limitations ครบและ render ตรวจแล้ว
- [ ] Video actual app/both presenters/version/link/timestamps ตรงและตรวจระยะเวลาตามประกาศจริง
- [ ] A/B ตรวจ G4–G6; final tag คงที่และ submission receipt เติมหลังส่งจริง
- [ ] Repo และ deployed assessed version ยังเปิดจนผู้สอนประกาศจบการตรวจ
- [ ] หลังตรวจเสร็จจึงพิจารณา teardown ตาม Lab 5: เก็บ evidence/backup, preview รายการ, อนุญาตการลบชัดเจน และตรวจค่าใช้จ่าย/resources ที่เหลือ; ไม่ปิดระบบทันทีที่ส่ง Final
