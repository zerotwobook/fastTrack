# Final QA, product DoD, and release readiness (Part D draft)

Working draft prepared by B (`@Atip-Infa`) for [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38), coordinating with A's traceability and independent UAT worksheet drafts in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148). **Not Ready for Final Release Claim:** Joint independent UAT (`#36`), any resulting defect fixes/retests, final candidate freeze (`G5`), and final `main` deployment readback remain pending.

## Selected access-control automated test excerpt (for Part C/D pairing)

Per [`workflow/03_SPRINT3_D2_FINAL.md`](../../../workflow/03_SPRINT3_D2_FINAL.md) section 10, B supplies the access/ownership automated test excerpt to pair with A's domain excerpt (`T-26` in `submissions.a02.ts`).

- **Requirement / Rule:** `FR-10`, `BR-02`, `NFR-02` (`F08-AC-04` / `F08-STS-04` — cross-team summary and milestone isolation).
- **Source & Line Range:** [`Project_code/server/src/testing/summary-drilldown.b01.ts#L342-L365`](../../../Project_code/server/src/testing/summary-drilldown.b01.ts#L342-L365) (identical server test suite across `staging/sprint-3` `6074f98e` and integrated UAT candidate `046310d2`).
- **Setup & Fixtures:** Isolated disposable PostgreSQL `16.8` test database containing Team A (`teamA`, `milestoneFuture`) supervised by Supervisor A and disjoint Team B (`teamB`) supervised by Supervisor B (`sup-b@test.local`), verified both at repeatable-read service query level and HTTP Express router level.

~~~ts
  it('F08-STS-04: denies cross-team queries and milestone detail reads without revealing foreign data', async () => {
    const asOf = new Date();
    const foreignResult = await prisma.$transaction(
      tx => readSummaryItems({
        tx,
        teamIds: [fixtures.teams.teamB.id],
        asOf,
        filters: { teamId: fixtures.teams.teamA.id, status: null, page: 1, pageSize: 20 },
      }),
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead },
    );
    expect(foreignResult).toEqual({ matchedCount: 0, items: [] });

    const supB = await login('sup-b@test.local');
    const detailRes = await request(app())
      .get(`/api/milestones/${fixtures.milestones.milestoneFuture.id}`)
      .set('Cookie', supB.cookie)
      .expect(404);
    expect(detailRes.body.error.code).toBe('NOT_FOUND');

    await request(app())
      .get(`/api/milestones/${fixtures.milestones.milestoneFuture.id}`)
      .expect(401);
  });
~~~

- **Observed Execution Result (Integrated Staging Candidate `046310d2`):** `PASS` inside `npm run test:b01:isolated` (`57 passed, 0 failed, 0 skipped` within the `483`-case `test:runtime:isolated` run on [A CI `45022169276`](https://github.com/zerotwobook/fastTrack/actions/runs/45022169276), [B CI `45027976730`](https://github.com/zerotwobook/fastTrack/actions/runs/45027976730), and integrated `staging/sprint-3` [CI `45039631042`](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)). **Final `main` Assessed Re-run:** `[PENDING Final release PR -> main]`.

## Pre-UAT regression evidence summary (integrated `staging/sprint-3` at `046310d2`)

| Regression Track | Owner & PR Status | Tested Source / Commit | Verified Results (`PASS / FAIL / SKIPPED`) | Follow-up / Final Gate Status |
| --- | --- | --- | --- | --- |
| `R3-A03` Domain, data integrity & concurrency | A ([Issue #34](https://github.com/zerotwobook/fastTrack/issues/34) **Closed / Done**, [PR #146](https://github.com/zerotwobook/fastTrack/pull/146) **Merged**) | Candidate `6074f98e` / PR `017811c` -> merged `046310d2` ([CI `45022169276`](https://github.com/zerotwobook/fastTrack/actions/runs/45022169276), [Staging CI `45039631042`](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042); [A03 evidence](../../../Project_code/docs/evidence/R3-A03-final-regression.md)) | **`483` passed, `0` failed, `0` skipped** across `14/14` stages + **`7/7`** legacy upgrades; `v1.0.0-sprint-1` (`ae7a60a6`) & `v1.0.0-sprint-2` (`f3ff8d97`) tag migration replays preserved hashes, ledger checksums, and SHA-256 fingerprints; **`17/17`** Unix-socket checks | Merged cleanly to `staging/sprint-3`; included in integrated candidate `046310d2`. |
| `R3-B03` Access, UI, responsiveness & operations | B ([Issue #35](https://github.com/zerotwobook/fastTrack/issues/35) **Closed / Done**, [PR #147](https://github.com/zerotwobook/fastTrack/pull/147) **Merged**) | Base `6074f98e` + B fix `d3b07ba` (`Page 2 (1 page total)`), PR `b323d4e` -> merged `055f3a4d` ([CI `45027976730`](https://github.com/zerotwobook/fastTrack/actions/runs/45027976730), [Staging CI `45037942835`](https://github.com/zerotwobook/fastTrack/actions/runs/45037942835); [B03 evidence](../../../Project_code/docs/evidence/R3-B03-final-regression.md)) | Clean checkout: `214/214` unit (`DrilldownList.test.ts`), **`483` passed, `0` failed, `0` skipped** + **`7/7`** upgrades, **`13/13`** container, **`17/17`** socket, **`9/9` / `10/10` / `16/16` / `10/10`** offline `deploy/` & `test_smoke.py`; custom harness: **`11/11`** API role/team/origin/CSRF/session matrix, **`2/2`** `TRUST_PROXY_HOPS=1` `429`/cleanup checks, **`3/3`** health/ready + invalid-DB fail-closed, **`12/12`** Chromium UX/focus/account-switch checks, **`54/54`** layout checks (`320/390/768/1280/1440px` + `200%` zoom), **`17/17`** WCAG contrast | Merged to `staging/sprint-3`; `d3b07ba` included in UAT candidate `046310d2` (pending Final `main` rollout). |

## Independent UAT readiness & intake ledger (`R3-J03 / #36` — In Preparation)

| Gate / Environment | Target / Topology | Observed Pre-Execution Readback (`2026-11-24`) |
| --- | --- | --- |
| Candidate & Staging CI ([`#36`](https://github.com/zerotwobook/fastTrack/issues/36)) | `staging/sprint-3` @ `046310d288859ee42745a043369498d5d646d6c9` ([Staging CI `45039631042`](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)); 8 cases `UAT-FINAL-01`..`08` ([PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) | Both `#34` (`PR #146`) and `#35` (`PR #147`) merged cleanly; Issue `#36` is `Started`, with **`Verification = NOT RUN`** and **`Acceptance = PENDING`**. |
| Isolated Local UAT Env (B Workstation) | Loopback `http://127.0.0.1:8080`, detached build at `046310d2`, DB `fasttrack_uat_046310d` ([B comment #7082113643](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7082113643)) | Verified `200 ok`/`ready` (`database: connected`), matching SHA, seeded `fa99f858` fixtures (`Team A` `0` milestones, `Team A Planning` + `ELIGIBLE`, `SB` / `Team B`, `SUM_SUP` `1/10 = 10.0%` + `Page 10 (9 pages total)` Chrome recovery, Case 07 `v1` feedback `0`), and restart persistence. **Pending:** confirmed independent local tester & independent execution. |
| Isolated Cloud Run UAT Preview (A Provisioned) | `https://fasttrack-uat-046310d-970128017651.asia-southeast1.run.app`, revision `fasttrack-uat-046310d-candidate` (`100%` traffic), migration `fasttrack-uat-046310d-migrate-mfndb` ([A comment #7103065175](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7103065175)) | Verified live read-only GET probes (`2026-11-24`): `/api/health` -> `200 ok` (`version: 046310d2...`), `/api/ready` -> `200 ready` (`database: connected`, `version: 046310d2...`), `/` -> `200 text/html`. Image index `sha256:7784bdbb8fd824afd90a5cdebb7644f7af44debeb743b3d1e9731f07b15077f9`, linux/amd64 `sha256:b00e45a19b8072647ae8aac34644ab56d74ba2140a6c2c1c250d1d40ccc78b2b`. A confirmed Pawarit Wongdaeng for Cloud execution (`session & results pending`). |
| Hosted Cloud Run D2 baseline (`7872a739`) | Production `https://fasttrack-app-kpx7au3w2a-as.a.run.app`, revision `fasttrack-app-00005-rkz`, migration `fasttrack-migrate-4lvx5` | Preserved intact for grading continuity (`6/14 = 42.9%` Summary & S1 records). **No `046310d2` promotion to `main` until G4 UAT and explicit user release authorization.** |

### Independent UAT case intake & defect triage schedule (`UAT-FINAL-01`..`08`)

Every row below starts `Pending independent execution` and records **only** verified independent tester outcomes, linked defects, and independent retests when returned:

| Case ID | Covered Scope & Worksheet Target (`fa99f858`) | Seeded Baseline Check (`046310d2`) | Triage Lead | Tester / Env / SHA | Observed Outcome & Defect / Retest |
| --- | --- | --- | --- | --- | --- |
| `UAT-FINAL-01` | Scoped milestone creation & SA/A1 reload readback (`FR-01/02/03`) | `Team A` (`ac0a6e34-...`) initialized with `0` milestones | **A** (domain) / **B** (UI/auth) | Pending assignment | **Pending independent execution** |
| `UAT-FINAL-02` | `v1` submit, `SA` exact-version feedback, `v2` revision & `v1` history check (`FR-04/05/08`, `BR-06/07`) | Starts clean from Case `01` milestone | **A** (domain) | Pending assignment | **Pending independent execution** |
| `UAT-FINAL-03` | Distinct deadline milestone late submit rejection & no-write reload (`BR-04/05`, `T-26`) | Fresh milestone created ~3 min before expiry per run | **A** (domain/clock) | Pending assignment | **Pending independent execution** |
| `UAT-FINAL-04` | Team rename, unassigned `ELIGIBLE` student add, unsubmitted edit vs submitted history lock (`FR-06/07`, `BR-09`) | `Team A Planning` (`2a70231b-...`), milestone `964aa2af-...`, `student.uat.eligible@fasttrack.local` | **A** (locks) / **B** (UI/auth) | Pending assignment | **Pending independent execution** |
| `UAT-FINAL-05` | Same-browser `SA -> SB` account change & cross-team `404` non-disclosure (`BR-02`, `NFR-01/02`, `F08-STS-04/07`) | Disjoint `Team B` (`0afd7f5e-...`), control milestone `82c543c6-...` | **B** (access/UI) | Pending Cloud execution (`Pawarit Wongdaeng` confirmed by A) | **Pending independent execution** |
| `UAT-FINAL-06` | `SUM_SUP` Progress vs Summary `1/10 (10%)`, filter return, `page=10&pageSize=1` -> `Page 10 (9 pages total)` recovery (`FR-09/10`, `BR-10`) | `UAT Summary Alpha` (`1/1`) + `UAT Summary Beta` (`0/9`), out-of-range recovery pre-checked via Chrome | **A** (totals) / **B** (drilldown/UI) | Pending Cloud execution | **Pending independent execution** |
| `UAT-FINAL-07` | Approved `6,000`-code-point feedback boundary (`5,999` / `6,000` pass, `6,001` reject, trimmed emoji + spaces, exact `v1` binding) (`BR-08`, `L7-STS-05`) | Local `v1` `5bbddea8-...` / Cloud Preview `v1` `eddaa588-...` (`0` initial feedback) | **A** (validation) / **B** (UI/ops) | Pending Cloud execution | **Pending independent execution** |
| `UAT-FINAL-08` | Coordinated restart/redeploy persistence check reading `UAT-FINAL-02` IDs/versions/feedback (`NFR-03`, `T-31`) | Server/container restart persistence verified pre-handoff | **B** (ops) / **A** (records) | Pending coordinated restart & readback | **Pending independent execution** |

## Product Definition of Done (DoD) review against evidence

Evaluated per `project_final_delivery_v1.pdf` §3.4 against current `staging/sprint-3@046310d2` and `main@7872a739` artifacts:

| DoD Dimension | Evidence Basis on `046310d2` / `7872a739` | Current Readiness Status |
| --- | --- | --- |
| **1. Complete behavior (`F-01`–`F-08` + `CR-L7-01`)** | All Sprints 1–3 workflows, DB-clock locks, version history, 6,000-code-point feedback, F-07 Progress, and F-08 scoped Summary & drilldown/recovery implemented in `Project_code/`. Zero baseline features deferred as debt. | **Staging Ready (`046310d2`); Final `main` pending G4/G5** |
| **2. Automated tests & regressions** | `npm run test:runtime:isolated`: **`483` passed, `0` failed, `0` skipped** + `7/7` legacy upgrades + `13/13` container + `17/17` socket + `54/54` responsive/200% zoom + `17/17` WCAG contrast ([A03](../../../Project_code/docs/evidence/R3-A03-final-regression.md), [B03](../../../Project_code/docs/evidence/R3-B03-final-regression.md)). | **Pre-UAT Passed (`046310d2`); Final `main` CI pending** |
| **3. Peer review & staging integration** | Feature/regression PRs reviewed non-author & merged (`#133`, `#134`, `#135`, `#138`, `#146`, `#147`); `PR #148` (A) and `PR #149` (B) remain Draft pending `#36`/`G5`. | **Staging Integrated; Final package review pending** |
| **4. Independent UAT & retests (`#36`)** | Dual candidate environments prepared on `046310d2` (Local + Cloud Preview). Independent execution & defect/retest sign-off not yet complete. | **OPEN (`#36` `Started / NOT RUN / PENDING`)** |
| **5. Pipeline deployment & durable DB** | `Deploy demo` WIF/Docker/migrate-first/smoke pipeline verified at D2 (`Run 44888588070`, `fasttrack-app-00005-rkz`, `7872a739`) and Cloud Preview (`fasttrack-uat-046310d-candidate`). Final `main` release & readback gated behind [`MAIN_RELEASE_GATE.md`](../../../workflow/MAIN_RELEASE_GATE.md). | **Pipeline Proven; Final `main` rollout pending** |
| **6. Documentation & reproducible configuration** | `Project_code/README.md`, `server/.env.example`, `compose.yaml`, `compose.env.example`, contracts, and Final Part A–E drafts aligned cleanly with zero secret leaks. | **Drafts in Progress (`PR #148`, `PR #149`)** |

## Known defects, limitations, and technical debt register

No unfinished baseline requirement is disguised as technical debt. Active items are tracked explicitly below:

| Item / ID | Classification & Severity | Observed Impact | Target / Next Action & Owner |
| --- | --- | --- | --- |
| **Advisory `GHSA-7589-6fvf-x4pw` (`effect@3.20.0`, 3 `npm audit` highs)** | Dependency hygiene (`Low runtime risk`) | `effect@3.20.0` is pulled strictly as a `devOptional: true` transitive dependency of `@prisma/config@7.10.1` (`prisma` CLI). Static audit confirmed zero imports in `client/`, `server/`, or the pruned production `runner` image. | Re-check `npm audit` if upgrading Prisma CLI prior to `G5` freeze; keep lockfile untouched otherwise (**Owner: B**). |
| **Summary out-of-range label (`"Page 2 of 1"`) on production `7872a739`** | Resolved in staging (`Minor UI wording`, `d3b07ba`) | Hosted `main@7872a739` still labels empty out-of-range pages `"Page N of M"` until `046310d2` promotes to `main`. Fix `d3b07ba` (`"Page 2 (1 page total)"`) is already merged in `staging/sprint-3` via `PR #147`. | Verify in `UAT-FINAL-06` and ship with Final `main` release (**Owner: B**). |
| **Final video duration conflict (`4 min` vs `10 min`)** | Course specification ambiguity (`Docs / Process`) | `project_final_delivery_v1.pdf` states `10 min` on p.2 and `Maximum 4 minutes` on p.4 (`summary_final_deliverable.md §17.4`). | Confirm official course clarification before Final video cut; follow provisional `<= 4:00` pacing plan unless clarified (**Owners: A + B**). |
| **Production Cloud SQL inspection boundary (B workstation)** | Environmental access limit (`Operational readback`) | B's workstation has no `gcloud` CLI or Cloud SQL Proxy access to `fasttrack_prod`, so hosted database totals are reconciled via `/api/teams/:id/progress`, `/api/summary`, and A's revision/job outputs (`deploy.yml` job logs). | Owner A (`@zerotwobook`) confirms Cloud Run migration execution ID & serving revision at `G5`; B verifies HTTPS endpoints and readback (**Owners: A + B**). |
| **`#36` Independent UAT execution & Cloud/Local test coordination** | Active release blocker (`G4 Gate`) | Final `main` freeze cannot proceed until `UAT-FINAL-01`..`08` finish with real independent testers and any accepted defects are fixed and retested. | Execute on `fasttrack-uat-046310d-candidate` & local `http://127.0.0.1:8080`, triage findings, and log results in `#36` (**Owners: A + B + Testers**). |

## Concise reproducible setup, configuration & deployment summary

Full step-by-step instructions live in [`Project_code/README.md`](../../../Project_code/README.md) and [`docs/labs/lab-05/deployment.md`](../../../docs/labs/lab-05/deployment.md).

- **Verified Toolchain:** `Node.js 26.13.0`, `npm 11.20.0`, `Prisma 7.10.1` (`@prisma/adapter-pg`), `React 19.3.1`, `Express 5.3.0`, isolated audit DB `postgres:16.8@sha256:301bcb60b8a3ee4ab7e147932723e3abd1cef53516ce5210b39fd9fe5e3602ae` (one root workspace lockfile in `Project_code/package-lock.json`).
- **Configuration Variables (placeholders only — never commit secrets):**
  - Server runtime ([`server/.env.example`](../../../Project_code/server/.env.example)): `NODE_ENV`, `PORT` (`3000` dev / `8080` container), `APP_ORIGIN` (`http://127.0.0.1:5173` dev / canonical HTTPS in production), `DATABASE_URL`, `TEST_DATABASE_URL` (distinct guarded DB), `SESSION_TTL_HOURS=8`, `RELEASE_SHA` (`40`-char hex in production), bounded timeouts (`DB_POOL_MAX`, `DB_CONNECT_TIMEOUT_MS`, `DB_STATEMENT_TIMEOUT_MS`, `DB_QUERY_TIMEOUT_MS`, `READINESS_TIMEOUT_MS`), `TRUST_PROXY_HOPS` (`0` local / `1` verified proxy), login throttle (`LOGIN_RATE_LIMIT_*`), and explicit-only `DEMO_SEED_PASSWORD` / `CONFIRM_RATE_LIMIT_CLEANUP`.
  - Docker Compose ([`compose.yaml`](../../../Project_code/compose.yaml), [`compose.env.example`](../../../Project_code/compose.env.example)): `LOCAL_DB_PASSWORD`, `DEMO_SEED_PASSWORD`, `RELEASE_SHA` for explicit `jobs` (`db:migrate` / `db:seed`) + `app` containers over named volume `local-db` on loopback `127.0.0.1:8080`.
- **Clean-Checkout Verification & Build Commands (from `Project_code/`):**
  - Install & verify: `npm ci`, `npm run db:generate --workspace @fasttrack/server`, `npm run typecheck`, `npm test`, `npm run build`
  - Full disposable-container suite (`483` cases + `7` upgrades): `npm run test:runtime:isolated`, plus production image/socket checks `npm run verify:container` and `npm run verify:socket`.
  - Manual DB deploy/seed against provisioned `DATABASE_URL`: `npm run db:migrate --workspace @fasttrack/server`, optional add-only `npm run db:seed --workspace @fasttrack/server`.
- **Cloud Run Release Pipeline ([`deploy.yml`](../../../.github/workflows/deploy.yml)):** Runs strictly on `main` push (or authorized `workflow_dispatch` with `demo` environment peer approval): executes `test-and-docker` CI -> Workload Identity Federation (`GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`) -> pushes `RELEASE_SHA`-tagged `web` & `jobs` images -> `deploy/release.sh` runs Cloud Run migration job **before** updating Cloud Run traffic -> runs `deploy/smoke_test.py` against `/api/health`, `/api/ready`, `/`, and JSON `404`.

## Final release manifest template (`G5`)

Fill every row below strictly from observed Final execution before user `main`-release sign-off ([`MAIN_RELEASE_GATE.md`](../../../workflow/MAIN_RELEASE_GATE.md)):

| Release Manifest Field | Current D2 Baseline (Reference Only) | Final Assessed Release Value (`[PENDING G4/G5]`) |
| --- | --- | --- |
| Release purpose | D2 accepted baseline (`v1.0.0-d2`) | `Final assessed` (`[PENDING]`) |
| Final `main` commit SHA & immutable Git tag | `7872a739147f7553e16e05a4d40b5d0de0c21f27` / `v1.0.0-d2` | `[PENDING Final PR -> main]` |
| Required `main` CI run & test counts (`PASS/FAIL/SKIPPED`) | Run `44885899889` (`483/0/0`, `7/7` upgrades) | `[PENDING]` |
| Protected `Deploy demo` run, migration job & serving revision | Run `44888588070`, `fasttrack-migrate-4lvx5`, `fasttrack-app-00005-rkz` (`100%`) | `[PENDING]` |
| Pushed `web` & `jobs` image digests (`sha256:...`) | `web`: `sha256:7b868cd...`; `jobs`: `sha256:b49829f...` | `[PENDING]` |
| Hosted `/api/health` & `/api/ready` readback matching final SHA | HTTP `200` (`version: 7872a739...`, `database: connected`) | `[PENDING]` |
| Joint `R3-J03` (`#36`) tester handle, date & UAT result | Separate Lab 6 historical UAT (`2026-11-19`) | `[PENDING]` |
| Reviewer A & Reviewer B gate sign-off (`G4`/`G5`/`G6`) | `#33` D2 closed | `[PENDING]` |
