# สรุป Lab 5: Cloud Deployment และ CI/CD บน GCP

> สำหรับอ่านทำความเข้าใจ และใช้เป็นบริบทให้ AI / Codex ทำงานต่อ
> สรุปจากเอกสารในโฟลเดอร์นี้เมื่อ 5 พฤศจิกายน 2026 ไม่ใช่รายงานว่าทีมทำ Lab ผ่านแล้ว
> **ยึด handout ภาษาอังกฤษเป็นหลัก** หาก Student Guide, starter kit หรือสรุปนี้ขัดกับโจทย์ ให้ตาม handout และสอบถาม TA

## 1. Lab นี้ต้องทำอะไร

นำแอป Group Project ที่ผ่านการยอมรับใน Sprint 1 จากเครื่องตัวเองขึ้น GCP ให้คนอื่นเปิดใช้งานผ่าน URL สาธารณะได้ แล้วสร้างกระบวนการตรวจและปล่อยเวอร์ชันที่ทำซ้ำได้

ผลลัพธ์หลักมี 5 อย่าง:

1. Clone โปรเจกต์ใหม่แล้ว build และรันด้วย Docker ได้
2. เว็บบน GCP ใช้งานกระบวนการธุรกิจจริงได้ครบ UI → API → ฐานข้อมูล
3. ข้อมูลไม่หายเมื่อแอป restart หรือ redeploy
4. ทุก PR ที่เกี่ยวข้องมี build และ automated tests; check ที่ไม่ผ่านต้องขวางการ merge
5. Release จาก `main` ผ่าน pipeline และตรวจย้อนกลับได้ว่าเวอร์ชันที่ให้บริการมาจาก commit ไหน

| รายการ | รายละเอียดตาม handout |
|---|---|
| รูปแบบ | กลุ่ม 2 คน ใช้ทีม repo และแอปเดียวกับ Group Project |
| จุดเริ่มต้น | Sprint 1 release ที่ยอมรับแล้ว; Deliverable 1 กำหนดส่ง 8 พฤศจิกายน 2026 |
| กำหนดส่ง Lab 5 | **วันอาทิตย์ 15 พฤศจิกายน 2026 เวลา 23:59 น.** |
| คะแนน | 100 คะแนน คิดเป็น 5% ของรายวิชา |
| ส่งที่ไหน | LEB2 ส่ง PDF 1 ไฟล์ต่อทีม |
| ชื่อไฟล์ | `lab5_sec<section>_<group name>.pdf` |
| ใช้ต่อ | แอป GCP project และ pipeline เดิมสำหรับ Lab 6, Lab 7 และ Final Project |
| หลังส่ง | Repo ต้อง public และบริการต้องเปิดจนผู้สอนประกาศสิ้นสุดการตรวจ |

## 2. แผนที่เอกสารและลำดับความสำคัญ

| แหล่งข้อมูล | ใช้อ่านเรื่องอะไร |
|---|---|
| [01_SE_Lab_5_updated.pdf](01_SE_Lab_5_updated.pdf) | **โจทย์และเกณฑ์ตัดสินหลัก**: R-01 ถึง R-12, C-01 ถึง C-06, คะแนนและการส่งงาน; 11 หน้า |
| [03_Student-Guide-GCP-Deployment-and+CI+CD-V1_1.pdf](03_Student-Guide-GCP-Deployment-and+CI+CD-V1_1.pdf) | คู่มือทำงาน Episode 0–10, Version 1.1 วันที่ 28 ตุลาคม 2026; 105 หน้า |
| [Starter kit README](02_lab5-starter-kit/toktickit-lab5-starter/README.md) | รายการไฟล์ วิธีปรับ template ให้ตรง stack และข้อจำกัด |
| [First practice](02_lab5-starter-kit/toktickit-lab5-starter/docs/gcp-first-lab.md) | Cloud Shell, dry run, deploy ครั้งแรก และตรวจ Console |
| [GCP และ CI/CD guide](02_lab5-starter-kit/toktickit-lab5-starter/docs/gcp-cicd-guide.md) | รัน local, CI, deployment, troubleshooting และต้นทุนตัวอย่าง |
| [Auto deploy](02_lab5-starter-kit/toktickit-lab5-starter/docs/auto-deploy.md) | WIF, GitHub environment, merge gate, smoke test และ rollback |

เลขหน้าที่อ้างในสรุปนี้นับจากหน้าแรกของ PDF ส่วนรายละเอียดการคลิก Console ให้เปิด Student Guide ประกอบ

**สำคัญ:** TokTickIT เป็นแอปตัวอย่าง ไม่ใช่ข้อบังคับให้เปลี่ยนโปรเจกต์ของทีมเป็น TokTickIT และ starter kit **ไม่มี source code ของแอปหรือ package manifests ที่จำเป็น** จึงไม่ใช่แอปพร้อมรัน ต้องนำ template ไปปรับใน repo ของทีม

## 3. ข้อกำหนดบังคับ R-01 ถึง R-12

อ้างอิง handout §4.1 หน้า 3–4 และ Definition of Done หน้า 8

| ID | สิ่งที่ต้องทำให้ได้ |
|---|---|
| R-01 | แพ็กแอปด้วย Docker; clean clone แล้ว build เป็น container ที่ใช้งานได้ |
| R-02 | อ่านค่าตั้งค่าจาก environment; อธิบายทุกตัวใน `.env.example` หรือ `deployment.md`; ไม่ commit secret จริง |
| R-03 | Deploy บน GCP มี public URL และ domain workflow ทำงานครบ UI, API และ DB |
| R-04 | ใช้ฐานข้อมูลถาวร; ข้อมูลที่แอปต้องใช้ต้องไม่อยู่เฉพาะใน container และต้องรอดทั้ง restart และ redeploy |
| R-05 | ทุก PR ที่เกี่ยวข้องรัน build และ automated tests ที่มีความหมาย |
| R-06 | ตั้ง passing check เป็น required; พิสูจน์ด้วย PR จาก temporary branch ที่ test fail แล้ว merge ไม่ได้ ห้ามทำให้ release จริงเสีย |
| R-07 | Release ที่ผ่าน review และ CI เข้าสู่ `main` แล้ว deploy ผ่าน pipeline ที่ทำซ้ำได้; มี manual approval ภายใน pipeline ได้ |
| R-08 | ระบุ tag หรือ commit SHA ของแต่ละ release และบันทึกวิธี release ให้ทำตามซ้ำได้ |
| R-09 | ใช้ Issues, project board, feature/fix branches → PR เข้า `staging` ให้เพื่อน review → release PR เข้า `main`; ห้าม approve PR ตัวเอง; review ต้องระบุสิ่งที่ตรวจ คำถาม ข้อพบ หรือเหตุผลอนุมัติ |
| R-10 | ติด label งาน Lab 5 เช่น `lab5` ที่ Issues และ PRs; เก็บ commit, contract revision และ CI run history; CI ยังต้องบังคับใช้หลัง Lab 5 เพราะ Lab 7 ใช้ประวัติ |
| R-11 | ทั้งสองคนมีส่วนร่วมใน requirements, testing, คุม AI, implementation, review และ deployment; มีหลักฐานใน Issue/commit/PR; pair work ระบุชื่อทั้งสองคน ไม่บังคับจำนวน commit เท่ากัน |
| R-12 | Repo เป็น public จนตรวจเสร็จ เพื่อให้ TA และทีมคู่ Lab 6 เปิดดูโค้ด Issues PR และ workflow runs ได้ |

### สิ่งที่แนะนำ แต่ไม่คิดคะแนนแยก

ตาม handout §5: ใช้ Cloud Run + Artifact Registry + Cloud SQL + Secret Manager + GitHub Actions, WIF แทน JSON key, จำกัดสิทธิ์เท่าที่จำเป็น, image tag เป็น SHA เต็มและ deploy ด้วย digest, migration job แยกก่อนอัปเดตแอป, additive migrations, smoke test, rollback/roll-forward, pin Actions ด้วย SHA และ Dependabot

ควรตั้ง budget alert ก่อนสร้าง resource, ให้ Cloud Run min instances = 0 และ max ไม่เกิน 3, เลือก SQL ขนาดเล็กและปิด storage auto-increase, เตรียม demo accounts สำหรับแต่ละ role เพื่อ UAT ใน Lab 6 โดยส่งรหัสผ่านให้ทีมคู่ทางส่วนตัว

หากเลือกแนวทางอื่นให้บันทึกเหตุผลใน `deployment.md` ข้อกำหนดผลลัพธ์ R-01 ถึง R-12 ยังต้องครบ

**ไม่บังคับ:** cloud staging แยกอีกชุด, Kubernetes, Terraform/IaC, custom domain, load balancer, multi-region, canary/blue-green, monitoring dashboard, load test, payment/messaging จริง หรือ feature เกิน Sprint 1 ที่อนุมัติ

## 4. คำศัพท์และภาพรวมระบบ

| คำ | ความหมายใน Lab |
|---|---|
| CI | ตรวจ build และ tests อัตโนมัติเมื่อเปิด/อัปเดต PR |
| CD / release pipeline | นำ release ที่ผ่านเงื่อนไขขึ้นระบบจริงด้วยขั้นตอนที่ทำซ้ำได้ |
| Image / container | Image คือแพ็กเกจแอป; container คือ instance ที่กำลังรัน image |
| Commit SHA / image digest | SHA ระบุ source commit; digest ระบุ image ที่แน่นอน ใช้เทียบกับ revision ที่รับ traffic |
| Migration / seed | Migration ปรับ schema; seed เติมข้อมูลเริ่มต้น ต้องออกแบบให้รันซ้ำได้ |
| Health / readiness | Health เช็กแอปยังตอบ; readiness เช็กพร้อมใช้งานรวมการเชื่อม DB |
| Smoke test | ตรวจขั้นต่ำหลัง deploy ไม่ใช่หลักฐานว่าทุก business flow ผ่าน |
| WIF | ให้ GitHub ใช้ identity token เพื่อเข้าถึง GCP โดยไม่เก็บ service-account JSON key |
| Rollback | กลับไปใช้ image เก่า ไม่ได้ย้อน schema หรือข้อมูลใน DB |

เส้นทางโค้ดตามโจทย์:

```text
Issue + label lab5
  → feature/fix branch จาก staging
  → PR เข้า staging → CI + teammate review
  → release PR: staging → main → CI + review
  → pipeline: test → authenticate → build/push → migrate → deploy → smoke test
  → ตรวจ public URL + revision + digest + commit
```

สถาปัตยกรรมตัวอย่าง:

```text
ผู้ใช้ → HTTPS / Cloud Run [Frontend + API ใน image เดียว]
                            ├─ Cloud SQL: ข้อมูลถาวร
                            └─ Secret Manager: ค่าลับตอน runtime

GitHub Actions ── WIF ──→ Artifact Registry: เก็บ images
                       └→ Cloud Run Job: migrate/seed ก่อนเปลี่ยนแอป
```

`staging` ในที่นี้เป็น Git branch ไม่ได้แปลว่าต้องมี cloud environment อีกชุด

## 5. แผนทำงานตาม Student Guide

เลข Issue #1–#8 เป็นตัวอย่างจากคู่มือ ต้องใช้เลข Issue จริงของทีม

| Episode / หน้า | งานหลัก | จุดตรวจว่าจบแล้ว |
|---|---|---|
| 0 / 2–5 | เข้าใจ architecture, workflow และส่วนที่ต้องปรับจาก kit | แยก required กับ recommended และรู้ stack ของทีม |
| 1 / 6–25 | GCP account, project, teammate access, billing และ budget | ทั้งสองคนเปิด project ได้; ตรวจเครดิต/billing จริง; มี budget alert |
| 2 / 26–29 | ทำแอป cloud-ready และเริ่ม deployment.md | config ครบ, persistence ถูกต้อง, ปิด dev shortcuts, tests ผ่าน |
| 3 / 30–37 | ปรับ Dockerfiles, Compose และ entrypoint | clean build/run ใช้งานกับ DB ได้ |
| 4 / 38–43 | เพิ่ม CI และ deploy scripts ที่ CI ใช้ | PR เข้า staging และ main มี build/tests ผ่าน |
| 5 / 44–55 | ปรับ deploy.sh, dry run แล้ว deploy ครั้งแรกจาก Cloud Shell | public URL ใช้ได้, sign-in ได้, DB พร้อม, ตรวจ resources จริง |
| 6 / 56–80 | WIF, deployer account, environment และ ruleset | GitHub พร้อม deploy แบบไร้ key; PR ที่ test fail ถูกบล็อก |
| 7 / 81–91 | เพิ่ม deploy.yml และ release การเปลี่ยนแปลงที่มองเห็นได้ | merge เข้า main แล้ว pipeline deploy สำเร็จ; commit/digest ตรง revision |
| 8 / 92–95 | ตรวจ persistence; แนะนำ rollback และ roll-forward | record และไฟล์ยังอยู่; เก็บหลักฐาน restart และ redeploy ตามโจทย์ด้วย |
| 9 / 96–101 | Pause/resume เมื่อไม่ใช้งานและไม่กระทบการตรวจ | ปิด public access/หยุด DB ตามขั้นตอน; resume แล้ว readiness และ sign-in ผ่าน |
| 10 / 102–105 | Teardown หลังตรวจเสร็จหรือผู้สอนอนุญาต | เก็บหลักฐานและสำรองข้อมูลก่อนลบ; ตรวจ resources ที่เหลือและ billing |

งาน Console/Settings ก็ต้องมี Issue และหลักฐาน แม้ไม่มี branch ส่วนงานแก้ไฟล์ต้องผ่าน PR/review ตาม workflow

### ก่อนขึ้น cloud ต้องตรวจ 6 จุด

1. Upload อยู่ใน DB หรือ external storage เช่น Cloud Storage ไม่ใช่ดิสก์ใน container
2. Seed รันซ้ำได้; production/demo passwords มาจาก environment หรือ Secret Manager
3. ปิด dev shortcuts เช่นเลือก user โดยไม่ login และไม่แสดง default password บนหน้าเว็บ
4. Session ไม่พึ่ง memory ของ instance เดียว; ตัวอย่างเก็บใน DB
5. Server อ่าน `PORT` และฟังที่ `0.0.0.0` ไม่ใช่เฉพาะ localhost
6. Readiness ตรวจ DB จริง; ตัวอย่างตอบ 503 ถ้า DB ใช้ไม่ได้

GCP access ตาม handout §4.4: สมาชิกหนึ่งคนใช้ Gmail ส่วนตัวที่ยังไม่เคยใช้ Free Trial, ใช้ project เดียวต่อเนื่อง และเพิ่มเพื่อนเป็น Editor ตามคู่มือ **ห้ามจ่าย prepayment หรือกด Upgrade** หากมีปัญหาให้เก็บภาพและแจ้ง TA ตัวเลขเครดิต/ราคาในคู่มือเป็นข้อมูลของเอกสาร ต้องตรวจสถานะบัญชีจริงก่อนใช้งาน

## 6. Starter kit มีอะไร และต้องปรับตรงไหน

ทุก path ในตารางนี้อยู่ใต้ `02_lab5-starter-kit/toktickit-lab5-starter/`

| ไฟล์ | หน้าที่ / สิ่งที่ต้องปรับ |
|---|---|
| `Dockerfile` | Production image แบบ 3 stages รวม React UI + Express API; Node.js 24, port 3000, user `node`; ปรับ runtime, build, copied paths และ start command ให้ตรงแอป |
| `.dockerignore` | กันไฟล์ที่ไม่ควรเข้า build context/image โดยเฉพาะ secrets |
| `docker-compose.yml` | Local มี db, migrate, server, client; API :3000, UI :5173 และ PostgreSQL volume |
| `server/Dockerfile`, `client/Dockerfile`, `client/nginx.conf` | Build แยก API/UI สำหรับ local Compose |
| `server/docker-entrypoint.sh` | เริ่ม server; ไม่ใช้เป็นที่รัน migration ทุกครั้งที่ instance เริ่ม |
| `server/.env.example`, `client/.env.example` | ตัวอย่าง environment ต้องเติมรายการให้ครบกับโค้ดจริง; ห้ามใช้ค่าลับจริง |
| `.github/workflows/ci-docker.yml` | Offline script tests → backend migrate/seed/tests → frontend tests/build → Docker build; ยังไม่ deploy |
| `.github/workflows/deploy.yml` | ใช้ CI ซ้ำ แล้ว auth/build/push/release/smoke; manual image_tag สำหรับ rollback |
| `deploy/deploy.sh` | Provision resources และ deploy ครั้งแรก: APIs, registry, DB, secrets, runtime account, build, migration job, service |
| `deploy/release.sh` | อัปเดต resources ที่มีแล้ว; ตรวจ image → resolve digest → migrate → update service/traffic; rollback ข้าม migration |
| `deploy/smoke_test.py` | เช็ก public URL; ปรับ endpoints และ response expectations ให้ตรงแอป |
| `deploy/tests/` | Offline tests ของ deploy, release และ smoke script; ไม่ใช่การทดสอบ GCP จริง |
| `deploy/teardown.sh` | ลบ resources และ DB; ต้องปรับชื่อให้ตรง และตรวจสิ่งที่เหลือภายหลัง |
| `.github/dependabot.yml` | เสนอ PR อัปเดต GitHub Actions |

ชื่อ service, migration job, registry, image, SQL instance/database, secrets และ service accounts ต้องตรงกันในทุกสคริปต์และ workflow

### จุดที่ตรวจพบจากไฟล์ในโฟลเดอร์นี้

- **CI template ยังเป็น `branches: [main]`** ต้องปรับเป็น `[main, staging]` ตาม workflow/Definition of Done ของ handout และอย่าคัดลอก kit มาทับไฟล์ที่ปรับแล้ว
- `server/.env.example` ใน kit มีแค่ `DATABASE_URL` และ `PORT`; คู่มือ Ep.2 ให้เพิ่มค่าที่โค้ดใช้ เช่น `NODE_ENV`, `ADMIN_PASSWORD`, `SEED_DEMO_DATA`, `DEMO_USER_PASSWORD`, `CORS_ORIGIN`, `ALLOW_LEGACY_REQUESTER_HEADER` รายการสุดท้ายต้องตรวจจากแอปจริง ไม่ใช่เดาว่าครบจากตัวอย่าง
- `client/.env.example` ใช้ localhost สำหรับ local; production Dockerfile ตั้ง `VITE_API_URL` ว่างเพื่อให้ UI เรียก API origin เดียวกัน ต้องปรับตาม architecture ของทีม
- `deploy.sh` ที่แนบมี `--edition=enterprise` แล้ว แต่ยังไม่พบ flag ปิด storage auto-increase ในคำสั่งสร้าง SQL; จึงยังต้องตรวจ/ปิดตาม Ep.5.4
- First deploy ใช้ image tag `latest`; pipeline ใช้ full commit SHA อย่านำ `latest` หรือ short SHA ไปกรอกช่อง rollback ของ kit
- Final image มีไฟล์ที่ migration/seed ต้องใช้ด้วย อย่าลบ `src/`, `prisma/` หรือ dependencies เพียงเพราะดูเหมือนไม่ใช่ runtime โดยไม่ตรวจคำสั่ง seed

## 7. CI, merge gate และ release ที่ควรรู้

### CI และ merge gate

ตั้ง CI ให้รันกับ PR เข้า `staging` และ `main`; คง `workflow_call` เพื่อให้ deploy workflow เรียกใช้ซ้ำ CI ของ kit ใช้ Node.js 24, Python 3.14 และ PostgreSQL 16 ซึ่งเป็นค่าของ template ไม่ใช่ข้อบังคับเรื่อง stack

Ruleset ของ `main` ตามแนวทางคู่มือ:

- Enforcement เป็น Active และ bypass list ว่าง
- Require PR และ teammate approval สำหรับทีมสองคน
- Require status checks โดย **เลือก check จริง `test-and-docker` จาก Add checks**
- Require branches to be up to date, block force pushes และ restrict deletions

หลักฐาน gate ต้องเป็น **PR ปกติ ไม่ใช่ draft** จาก temporary branch ที่มี test ล้มเหลวจริง พร้อม required check และสถานะ merge blocked จากนั้นปิด PR โดยไม่ merge และรักษา PR/CI history ไว้

### GitHub environment และสิทธิ์

Kit ใช้ environment `demo` และจำกัด deploy เฉพาะ `main`

| ชื่อตัวแปร GitHub | ความหมาย |
|---|---|
| `GCP_PROJECT_ID` | Project ID ของทีม ไม่ใช่ชื่อแสดงผล |
| `GCP_REGION` | Region เช่น `asia-southeast1` |
| `WIF_PROVIDER` | `projects/PROJECT_NUMBER/locations/global/workloadIdentityPools/POOL/providers/PROVIDER` |
| `WIF_SERVICE_ACCOUNT` | Email ของ deployer service account |
| `SMOKE_EMAIL` (optional variable) | Dedicated test account สิทธิ์ต่ำ |
| `SMOKE_PASSWORD` (optional secret) | Password ของ test account; ต้องตั้งคู่กับ SMOKE_EMAIL หรือไม่ตั้งทั้งคู่ |

สี่ตัวแรกเป็น variables ไม่ใช่ passwords ห้ามสับสน Project ID กับ Project number

WIF condition ต้องตรง repo ID, owner ID, `main`, `deploy.yml` และ environment ของทีม ตรวจ OIDC subject format ของ repo จริง ไม่คัดลอก IDs ของ TA และอย่าสร้าง JSON key แทนเพื่อแก้ auth error

แยกบัญชีสองหน้าที่:

- **Runtime account:** แอป/งาน migration ใช้ Cloud SQL Client และ Secret Accessor เฉพาะ secrets ของแอป
- **Deployer account:** pipeline ใช้ Cloud Run Developer, Artifact Registry Writer เฉพาะ registry และ Service Account User เฉพาะ runtime account; WIF principal มี Workload Identity User บน deployer ตามการตั้งค่า ไม่ให้ pipeline เป็น Owner หรือสร้าง DB/IAM ผ่าน provisioning script ทุกรอบ

### Release ปกติและ rollback ของ kit

| หัวข้อ | Release ปกติ | Manual rollback / นำ image เดิมกลับมา |
|---|---|---|
| Trigger | Push/merge เข้า main หรือ manual โดย image_tag ว่าง | Run workflow บน main และใส่ SHA เต็ม 40 ตัวของ image ที่มีอยู่ |
| CI / build / push | ทำ | ข้าม ใช้ image เดิม |
| Migration / seed | ทำผ่าน Cloud Run Job ก่อน update service | ข้าม |
| Image | tag ด้วย commit SHA แล้ว resolve เป็น digest | resolve digest ของ image ที่เลือก |
| Deploy / smoke | ทำ | ทำ |
| Database ย้อนกลับไหม | เปลี่ยนตาม migration | **ไม่ย้อน schema/data** |

Migration fail แล้วสคริปต์หยุดก่อน update service แต่ไม่ได้รับประกันว่าการเปลี่ยน DB ที่ทำไปบางส่วนจะถูกย้อนกลับ จึงต้องอ่าน job logs และออกแบบ migration ให้เหมาะสม

Deploys ถูกเข้าคิว (`cancel-in-progress: false`) เพื่อไม่ตัดงาน migration กลางทาง ถ้า smoke fail จะไม่ auto-rollback ต้องตรวจสาเหตุและความเข้ากันได้ของ schema ก่อนเลือก image เก่า

หลักฐาน release ให้เทียบ: **commit SHA → image tag/digest → Cloud Run revision ที่รับ traffic** ไม่ใช่ดูว่า workflow สีเขียวอย่างเดียว

### Smoke test ที่มีจริงใน kit

| Endpoint | สิ่งที่ script คาดหวัง |
|---|---|
| `/api/health` | JSON มี `status: ok` |
| `/api/ready` | JSON มี `db: connected`; HTTP 200 อย่างเดียวไม่พอ |
| `/` | เนื้อหา HTML |
| `/api/categories` | JSON array ที่ไม่ว่าง |
| `/api/auth/login`, `/me`, `/logout` ภายใต้ `/api/auth` | Optional sign-in/profile/sign-out ด้วยบัญชีทดสอบเฉพาะ |

ปรับ endpoint ให้เข้ากับแอปของทีม โดยตรวจข้อมูลแบบไม่แก้ business data และไม่ใช้ administrator การแสดง `SKIP login` หมายถึงไม่ได้ทดสอบ login ไม่ใช่ login ผ่าน

## 8. หลักฐานที่ต้องเก็บ C-01 ถึง C-06

ทุก check ระบุ **ไฟล์หรือ test name + คำสั่งหรือ CI run + ผลจริง + commit ที่ทดสอบ**

| Check | สิ่งที่ต้องพิสูจน์ | หลักฐานหลัก |
|---|---|---|
| C-01 | PR ปกติ build และ automated tests ผ่าน | PR/run link และ test summary ที่มีความหมาย |
| C-02 | Test fail แล้ว merge ไม่ได้ | PR ชั่วคราว, failed required check และภาพ blocked merge |
| C-03 | Clean clone เติม env แล้ว build/run ได้ | คำสั่ง ผล build/container/DB และ commit |
| C-04 | Domain workflow บน public URL | Sign-in, business action หลัก และอย่างน้อย 1 rule rejection/access restriction; ภาพเห็น URL |
| C-05 | Record เดิมรอด restart และ redeploy | Before/after ระบุ record ID เดิมและวิธี restart/redeploy; ถ้ามีไฟล์แนะนำเทียบ SHA256 |
| C-06 | Reviewed release ผ่าน staging → main → pipeline | Issue/PR/review/run links และ revision ที่ยืนยัน release commit |

อย่าใช้ผล dry run แทน deploy จริง, offline tests แทน cloud tests หรือ health/smoke แทน business-flow tests และอย่าระบุผลซ้อมของ TA เป็นผลของทีม

## 9. ไฟล์และ PDF ที่ต้องส่ง

### ไฟล์ใน repo

- `Dockerfile`, `.dockerignore` และ `docker-compose.yml` หากใช้ local DB ผ่าน Compose
- `.env.example` ที่ครอบคลุมค่าที่แอปอ่านและมีแต่ placeholders
- CI workflow และ deploy workflow หรือ equivalent
- **`docs/labs/lab-05/deployment.md`** อธิบาย stack/สิ่งที่ต่างจาก reference, env แต่ละตัว (หน้าที่, secret หรือไม่, แหล่งค่า), คำสั่ง build/test/run/migrate/seed, GCP project/region/resource names, วิธี release และวิธีหา commit ที่กำลังรัน

ไฟล์สรุปนี้ไม่ใช่ `deployment.md` ของทีมและไม่แทนหลักฐานส่งงาน ต้องเติมข้อมูลจาก implementation และผลรันจริง

### โครงสร้าง PDF ตามคะแนน

| หัวข้อที่ต้องใช้ | คะแนน | เนื้อหา |
|---|---:|---|
| Answer Part 0: Team and Evidence Index | ไม่คิดแยก แต่บังคับ | เลขกลุ่ม/หัวข้อ, ชื่อ-รหัสนักศึกษา-GitHub ของทั้งสองคน, public repo, submitted tag/commit, URL และ serving commit, contributions พร้อม Issue/PR links, evidence index |
| Answer Part 1: CI and Quality Gate | 30 | CI file, C-01, required-check setting ของ main และ C-02 |
| Answer Part 2: Docker and Reproducible Configuration | 20 | Dockerfile/.dockerignore, C-03, .env.example และ env table ใน deployment.md |
| Answer Part 3: GCP Deployment and Persistence | 35 | URL, C-04, UI/API/DB, cloud service/database และ C-05 |
| Answer Part 4: Repeatable Release Pipeline | 15 | งานติด label จาก Issue → reviewed PR เข้า staging → release PR → CI/deploy, C-06 และขั้นตอน release |

Evidence index ต้องมีอย่างน้อยหนึ่งแถวต่อ rubric part:

| Rubric part | Artifact / direct link | IDs / version | Verification result |
|---|---|---|---|
| 1 | `<PR URL และ CI run URL>` | `C-02 / <tested commit>` | `<ผลจริงของ failed check และ merge gate>` |
| 3 | `<public URL และภาพก่อน/หลัง>` | `C-05 / <release commit>` | `<record เดิมหลัง restart และ redeploy>` |
| 4 | `<Issue, PR, run และ revision>` | `C-06 / <commit และ digest>` | `<ผลการตรวจ revision ที่รับ traffic>` |

ใช้ direct link + คำอธิบาย 1–2 ประโยคเป็นหลัก ภาพใส่เฉพาะสิ่งที่ลิงก์อย่างเดียวพิสูจน์ไม่ได้ เช่น blocked merge, Console setting และข้อมูลก่อน/หลัง ทุกภาพมีเลข caption ระบุ check/requirement และ commit/run/URL ที่เกี่ยวข้อง ตัดภาพให้ข้อความอ่านได้ที่ซูม 100% และไม่เห็น secrets

คะแนนวัดพฤติกรรมจริง การตรวจสอบย้อนกลับ tests ที่มีความหมาย และหลักฐานที่น่าเชื่อถือ ไม่ใช่จำนวนหน้า prompt หรือ commit

## 10. ค่าใช้จ่าย ความปลอดภัย และจุดที่มักพลาด

- ตามตัวอย่างในเอกสารประมาณ USD 14–18 ต่อ project ต่อเดือนสำหรับการใช้งานเบาในเดือนตุลาคม 2026 **เป็นประมาณการในต้นฉบับ ไม่ใช่ราคาปัจจุบันที่ตรวจใหม่** ต้องเช็กราคา/เครดิต/โควตาจริงก่อนสร้าง resource
- Budget แบบ alerts-only แจ้งเตือน แต่ไม่ได้หยุดใช้เงิน; ปิด browser ไม่ได้หยุด Cloud SQL และการหยุด DB ยังอาจมีค่า storage/backup
- ห้าม pause ระหว่าง pipeline/demo/ช่วงรอตรวจ และต้อง resume ก่อน merge เข้า main
- Teardown ลบ DB และข้อมูลด้วย ให้ทำหลังจบการตรวจหรือผู้สอนอนุญาต พร้อมสำรองข้อมูลและอ่านรายการ resource ก่อนยืนยัน
- `Teardown completed` ไม่รับประกันว่าลบครบ เพราะ script ยอมให้คำสั่งบางอัน fail; ตรวจ Cloud Build buckets, retained resources, deployer account/WIF pool และปิด deploy workflow หลังเลิกใช้ด้วย
- ห้าม commit `.env`, passwords, connection strings หรือ key; secrets ต้องไม่อยู่ใน image, logs, screenshot, PDF หรือ AI chat
- หาก secret หลุด ต้องเปลี่ยนที่ระบบต้นทางด้วย เช่น DB user password แล้วอัปเดต Secret Manager/redeploy และแจ้ง TA การลบไฟล์หรือเพิ่ม secret version อย่างเดียวไม่เพียงพอ
- คำสั่ง Bash ในคู่มือใช้ Cloud Shell/Git Bash/WSL; PowerShell ใช้ `curl.exe` เมื่อต้องการพฤติกรรมของ curl ตามตัวอย่าง

| อาการ | จุดเริ่มตรวจตามเอกสาร |
|---|---|
| PR เข้า staging ไม่มี CI | `pull_request.branches` ยังมีเฉพาะ main หรือ workflow ถูก kit ทับ |
| CI หา deploy scripts ไม่เจอ | ต้องคัดลอกและ commit ทั้ง `deploy/` ตั้งแต่ Ep.4 |
| Merge ยังได้แม้ check fail | Ruleset Active หรือไม่, เพิ่ม check จริงแล้วหรือยัง, มี bypass หรือไม่ |
| WIF ปฏิเสธ token | Repo/owner IDs, ref, workflow, environment และ OIDC subject format ตรงกันหรือไม่ |
| Billing/API precondition error | ตรวจ billingEnabled และแจ้ง TA ตาม handout |
| Health ผ่าน แต่ readiness fail | DB connection, secret mapping และ migration logs |
| Migration fail | อ่าน job execution log ก่อน retry; อย่าแก้ด้วยการเพิ่มสิทธิ์กว้างโดยเดา |
| Rollback หา image ไม่พบ | ใช้ SHA เต็มของ image จาก successful deployment จริง |
| ข้อมูลหายหลัง deploy | เก็บใน container filesystem/memory หรือใช้ DB/volume ผิดหรือไม่ |

## 11. บริบทสำหรับ AI / Codex ที่มาทำงานต่อ

### ขอบเขตที่ต้องรักษา

1. อ่าน handout และตรวจ repo/stack จริงก่อนวางแผน; อย่าสมมติว่าทีมใช้ Node/Prisma/TokTickIT
2. ใช้ R-01–R-12 เป็น requirements และ C-01–C-06 เป็น verification checklist
3. งานโค้ดเดินผ่าน Issue → branch → PR staging → teammate review → release PR main; ห้ามอ้าง review ของ AI แทน teammate review ที่โจทย์กำหนด
4. รักษางานเดิมและ history; ไม่ overwrite customization ด้วย starter kit หรือปิด checks เพื่อให้ผ่าน
5. แยกข้อมูลจากเอกสาร, ข้อเสนอ, ผลที่รันจริง และสิ่งที่ยังไม่ได้ตรวจอย่างชัดเจน ห้ามสร้างหลักฐาน/ผล PASS ขึ้นเอง
6. ตาม handout §9 หน้า 8 ผู้ใช้ต้องอ่านคำสั่ง gcloud/Console changes ก่อนทำ และ AI ต้องไม่เปลี่ยน billing, IAM หรือ DB ด้วยตัวเอง เตรียมการเปลี่ยนแปลงให้ตรวจได้ก่อนดำเนินการตามการอนุญาตของผู้ใช้
7. ไม่ขอให้ผู้ใช้ส่ง secret เข้าแชต; เมื่อ debug ใช้ logs ที่ลบค่าลับแล้วและหาสาเหตุก่อนแก้
8. ก่อนอ้างว่าพร้อมส่ง ต้องตรวจ public URL, business flow, persistence, gate และ release traceability จากหลักฐานจริง ไม่ใช่จากการมีไฟล์ template

### ข้อมูลที่ยังต้องหาเมื่อเริ่ม implementation

เอกสารใน lab5 ไม่ได้ยืนยันข้อมูลต่อไปนี้ของทีม: app/stack จริง, root ของ application repo, repo URL/branch/ruleset, หมายเลข Issue, GCP Project ID/number, region/resources ที่มีจริง, billing status, public URL, release commit/digest และผล C-01–C-06 ต้องตรวจจากไฟล์โปรเจกต์หรือระบบจริงก่อนใช้

### ตัวอย่าง prompt สำหรับเริ่มงานต่อ

```text
อ่าน lab_file/lab5/LAB5_SUMMARY.md และ handout ต้นฉบับ
จากนั้นตรวจโปรเจกต์จริงโดยยังไม่ deploy หรือเปลี่ยน cloud resources
ทำ gap analysis เทียบ R-01 ถึง R-12 และ C-01 ถึง C-06
ระบุสิ่งที่มีแล้ว สิ่งที่ขาด ไฟล์ที่ต้องแก้ และหลักฐานที่ต้องเก็บ
วางงานตาม Issue → feature/fix branch → PR เข้า staging → release PR เข้า main
อย่าสมมติว่าผลทดสอบผ่าน และอย่าอ่าน/แสดง secret ในแชต
```

## 12. Checklist ก่อนส่ง

- [ ] Clean clone แล้ว build/run ได้พร้อม DB และ env ที่อธิบายครบ
- [ ] ไม่มี secret จริงใน repo/image/logs/ภาพ/PDF
- [ ] Public URL แสดง release ล่าสุดจาก main และ domain workflow ผ่าน
- [ ] Record เดิมรอดทั้ง restart และ redeploy พร้อมหลักฐาน
- [ ] CI ตรวจ PR เข้า staging และ main และ failed required check บล็อก merge จริง
- [ ] Release ผ่าน teammate review และ pipeline; commit/image digest/revision ตรงกัน
- [ ] Repo เป็น public และ Issues/PRs งานนี้มี label Lab 5
- [ ] Contributions ของทั้งสองคนตรวจย้อนกลับได้ และทั้งคู่เข้าใจทุกขั้นตอน
- [ ] deployment.md, C-01–C-06 และ evidence index ครบ
- [ ] PDF ใช้ Answer Part 0–4 ชื่อไฟล์ถูกต้อง ภาพอ่านได้ และส่งใน LEB2
- [ ] บริการยังเปิดและ repo ยัง public จนสิ้นสุดการตรวจ
