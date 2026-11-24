# Final QA, product DoD, and release readiness (Part D draft)

Working draft prepared by B (`@Atip-Infa`) for [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38), coordinating with A's traceability and UAT records in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148). Joint G4 Final QA ([Issue #36](https://github.com/zerotwobook/fastTrack/issues/36)) is **ACCEPTED & CLOSED** (`8/8 PASS` on both Cloud and Local against `staging/sprint-3@046310d2`). **Not Yet Released to `main`:** User release authorization & `main` freeze (`G5`), joint `Part E` video recording, and final PDF export/submission (`G6` / `#39`) remain pending.

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

## Independent UAT & joint G4 acceptance (`R3-J03 / #36` — Closed / PASSED / ACCEPTED)

| Gate / Environment | Target / Topology | Verified Execution & G4 Sign-off (`2026-11-24`) |
| --- | --- | --- |
| Joint G4 Decision ([`#36`](https://github.com/zerotwobook/fastTrack/issues/36)) | `staging/sprint-3` @ `046310d288859ee42745a043369498d5d646d6c9` ([Staging CI `45039631042`](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)); 8 cases `UAT-FINAL-01`..`08` ([PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) | **CLOSED (`Done / Verification: PASSED / Acceptance: ACCEPTED`, `2026-11-24T11:35:33Z`).** Co-signed by **A** (`@zerotwobook`, [`#7130219625`](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7130219625)) and **B** (`@Atip-Infa`, [`#7130293441`](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7130293441)): **Cloud `8/8 PASS` + Local `8/8 PASS` (`0` open defects)**. `main` promotion remains a separate user-authorized gate (`MAIN_RELEASE_GATE.md`). |
| Isolated Cloud Run UAT Preview (A Provisioned) | `https://fasttrack-uat-046310d-970128017651.asia-southeast1.run.app`, revision `fasttrack-uat-046310d-candidate` (`100%` traffic), migration `fasttrack-uat-046310d-migrate-mfndb` ([A handoff #7103065175](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7103065175)) | **`8 PASS, 0 FAIL, 0 BLOCKED`** confirmed personally by **Pawarit Wongdaeng** (`2026-11-23 22:14:53 Asia/Bangkok`, [`#7127973707`](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7127973707)), documented in [PR #148@3806ead2](https://github.com/zerotwobook/fastTrack/pull/148) (`cloud-uat-results.md`, `11` Edge Playwright PNGs, `persistence/result.json` across `fasttrack-uat-046310d-persist-20261123` at `2026-11-23T15:08:19.703Z`; [CI `45369038180`](https://github.com/zerotwobook/fastTrack/actions/runs/45369038180) `SUCCESS`). B verified live read-only `200 ok`/`ready` (`database: connected`, SHA `046310d2...`) and spot-checked artifacts. Image index `sha256:7784bdbb8fd824afd90a5cdebb7644f7af44debeb743b3d1e9731f07b15077f9`, linux/amd64 `sha256:b00e45a19b8072647ae8aac34644ab56d74ba2140a6c2c1c250d1d40ccc78b2b`. |
| Isolated Local UAT Env (B Workstation) | Loopback `http://127.0.0.1:8080`, detached build at `046310d2`, DB `fasttrack_uat_046310d` / disposable `postgres:16.8` ([B prep #7082113643](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7082113643)) | **`8 PASS, 0 FAIL, 0 BLOCKED`** confirmed personally by **Tatchakorn Thamnimitr** (`67070503415`, `@Magiciancat9`, `2026-11-24 16:28:39 Asia/Bangkok`, [`#7127873421`](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7127873421)), supported by Codex Chrome `157.0.8103.79` runs `FT-UAT-20261124162131` (`16:21:32–16:25:07 +07:00`) & `FT-UAT-20261124162508` (`16:25:09–16:25:23 +07:00` resolving initial Case 06 locator heading timeout; Case 08 restart PID `35732 -> 27140` & PostgreSQL readback) plus earlier `2026-11-23` local dry-run readback [`#7125122349`](https://github.com/zerotwobook/fastTrack/issues/36#issuecomment-7125122349). |
| Hosted Cloud Run D2 baseline (`7872a739`) | Production `https://fasttrack-app-kpx7au3w2a-as.a.run.app`, revision `fasttrack-app-00005-rkz`, migration `fasttrack-migrate-4lvx5` | Preserved intact for grading continuity (`6/14 = 42.9%` Summary & S1 records). **No `046310d2` promotion to `main` until explicit user release authorization (`G5`).** |

### Independent UAT case results & triage summary (`UAT-FINAL-01`..`08` on `046310d2`)

All eight cases passed across both independent runs with **`0` open product defects** (`0 FAIL, 0 BLOCKED`):

| Case ID | Covered Scope & Worksheet Target (`fa99f858`) | Cloud Preview Outcome (`Pawarit`, `2026-11-23 22:14 +07:00`) | Local Env Outcome (`Tatchakorn`, `2026-11-24 16:28 +07:00`) | Triage / Defect Disposition |
| --- | --- | --- | --- | --- |
| `UAT-FINAL-01` | Scoped milestone creation & SA/A1 reload readback (`FR-01/02/03`) | **PASS** — SA & A1 matched title, description & Bangkok deadline (`01-milestone-reload.png`). | **PASS** — SA milestone `36ba8bb0-...` & A1 reload matched (`25 Nov 2026, 16:21:00`). | None (`0` defects). |
| `UAT-FINAL-02` | `v1` submit, `SA` exact-version feedback, `v2` revision & `v1` history check (`FR-04/05/08`, `BR-06/07`) | **PASS** — Reopening `v1` retained link & feedback while `v2` held `0` feedback (`02-version-history.png`). | **PASS** — `v1` (`166cccd3-...`, `1` note) & `v2` (`191a787b-...`, `0` notes) verified after reload. | None (`0` defects). |
| `UAT-FINAL-03` | Distinct deadline milestone late submit rejection & no-write reload (`BR-04/05`, `T-26`) | **PASS** — Stale form rejected post-due with HTTP `409 DEADLINE_PASSED`, `0` saved (`03-deadline-rejection.png`). | **PASS** — Stale submit `+60s` past due rejected (`409 DEADLINE_PASSED`); reload & DB showed `0` saved (`4b8e7036-...`). | None (`0` defects). |
| `UAT-FINAL-04` | Team rename, unassigned `ELIGIBLE` student add, unsubmitted edit vs submitted history lock (`FR-06/07`, `BR-09`) | **PASS** — Planning edits persisted; submission history locked membership & milestone mutations (`04-submitted-milestone-lock.png`). | **PASS** — Planning edits persisted; submitted `Team A` (`b5bdc8bf-...`) membership & edit/cancel controls locked. | None (`0` defects). |
| `UAT-FINAL-05` | Same-browser `SA -> SB` account change & cross-team `404` non-disclosure (`BR-02`, `NFR-01/02`, `F08-STS-04/07`) | **PASS** — Same-browser `SA -> SB` switch returned `404` for Team A & scoped SB to Team B (`05-cross-team-denial.png`). | **PASS** — Same-browser logout/switch to SB returned `404` on Team A (`b5bdc8bf-...`) with zero disclosure; Team B readable. | None (`0` defects). |
| `UAT-FINAL-06` | `SUM_SUP` Progress vs Summary `1/10 (10%)`, filter return, `page=10&pageSize=1` -> `Page 10 (9 pages total)` recovery (`FR-09/10`, `BR-10`) | **PASS** — `1/10 (10.0%)`, filter preserved via return, out-of-range recovery restored `page=1` with `Pending` & `pageSize=1` (`06-summary-recovery.png`). | **PASS** — `1/1` & `0/9` -> `1/10 (10.0%)`, `"No milestones on page 10"` / `"Page 10 (9 pages total)"` -> `Go to page 1` preserved `status=PENDING&pageSize=1` (`FT-UAT-20261124162508` after fixing initial automation locator). | Script locator fixed cleanly (`0` app defects; `d3b07ba` verified). |
| `UAT-FINAL-07` | Approved `6,000`-code-point feedback boundary (`5,999` / `6,000` pass, `6,001` reject, trimmed emoji + spaces, exact `v1` binding) (`BR-08`, `L7-STS-05`) | **PASS** — `5,999` & `6,000` saved cleanly on `v1`, `6,001` rejected cleanly (`07-feedback-length-rejection.png`). | **PASS** — `5,999` & `6,000` trimmed emoji notes persisted on exact `v1`; `6,001` rejected (`"Feedback content cannot exceed 6000 characters."`) before submit & A1 read back both notes. | None (`0` defects). |
| `UAT-FINAL-08` | Coordinated restart/redeploy persistence check reading `UAT-FINAL-02` IDs/versions/feedback (`NFR-03`, `T-31`) | **PASS** — Same submission IDs, versions, links & `v1` feedback persisted across new tagged Cloud Run revision `fasttrack-uat-046310d-persist-20261123` sharing `sha256:b00e45a1...` (`2026-11-23T15:08:19.703Z`, `persistence/result.json`). | **PASS** — Server restarted across PID `35732 -> 27140` (observed `503`/outage recovery -> `200 ready`); preserved `SA`/`A1` sessions, `1` feedback on `v1` (`166cccd3-...`), and `0` on `v2` (`191a787b-...`) with `8` distinct request IDs & DB readback. | None (`0` defects). |

## Product Definition of Done (DoD) review against evidence

Evaluated per `project_final_delivery_v1.pdf` §3.4 against current `staging/sprint-3@046310d2` and `main@7872a739` artifacts:

| DoD Dimension | Evidence Basis on `046310d2` / `7872a739` | Current Readiness Status |
| --- | --- | --- |
| **1. Complete behavior (`F-01`–`F-08` + `CR-L7-01`)** | All Sprints 1–3 workflows, DB-clock locks, version history, 6,000-code-point feedback, F-07 Progress, and F-08 scoped Summary & drilldown/recovery implemented in `Project_code/`. Zero baseline features deferred as debt. | **Staging & G4 Ready (`046310d2`); Final `main` pending G5** |
| **2. Automated tests & regressions** | `npm run test:runtime:isolated`: **`483` passed, `0` failed, `0` skipped** + `7/7` legacy upgrades + `13/13` container + `17/17` socket + `54/54` responsive/200% zoom + `17/17` WCAG contrast ([A03](../../../Project_code/docs/evidence/R3-A03-final-regression.md), [B03](../../../Project_code/docs/evidence/R3-B03-final-regression.md)). | **Pre-UAT Passed (`046310d2`); Final `main` CI pending** |
| **3. Peer review & staging integration** | Feature/regression PRs reviewed non-author & merged (`#133`, `#134`, `#135`, `#138`, `#146`, `#147`); `PR #148` (A) and `PR #149` (B) remain Draft pending `G5`/`G6`. | **Staging Integrated; Final package review pending** |
| **4. Independent UAT & retests (`#36`)** | Cloud (`Pawarit Wongdaeng`, `8/8 PASS`) & Local (`Tatchakorn Thamnimitr`, `8/8 PASS`) runs on `046310d2` co-signed by A (`#7130219625`) & B (`#7130293441`); `0` open product defects. | **PASSED & ACCEPTED (`#36` Closed, `G4` Complete)** |
| **5. Pipeline deployment & durable DB** | `Deploy demo` WIF/Docker/migrate-first/smoke pipeline verified at D2 (`Run 44888588070`, `fasttrack-app-00005-rkz`, `7872a739`) and Cloud Preview (`fasttrack-uat-046310d-candidate`). Final `main` release & readback gated behind [`MAIN_RELEASE_GATE.md`](../../../workflow/MAIN_RELEASE_GATE.md). | **Pipeline Proven; Final `main` rollout pending** |
| **6. Documentation & reproducible configuration** | `Project_code/README.md`, `server/.env.example`, `compose.yaml`, `compose.env.example`, contracts, and Final Part A–E drafts aligned cleanly with zero secret leaks. | **Drafts in Progress (`PR #148`, `PR #149`)** |

## Known defects, limitations, and technical debt register

No unfinished baseline requirement is disguised as technical debt. Active items are tracked explicitly below:

| Item / ID | Classification & Severity | Observed Impact | Target / Next Action & Owner |
| --- | --- | --- | --- |
| **Advisory `GHSA-7589-6fvf-x4pw` (`effect@3.20.0`, 3 `npm audit` highs)** | Dependency hygiene (`Non-blocking for G4/release`, jointly accepted A & B) | Live `npm audit --json` & `--omit=dev` report 3 highs (`prisma@7.10.1` -> `@prisma/config@7.10.1` -> `effect@3.20.0`). `prisma` is under `devDependencies`, `@prisma/config` & `effect` are `devOptional: true` in `package-lock.json`, `0` imports exist in `client/src`/`server/src`/`shared`, and `Dockerfile` `runner` runs `npm prune --omit=dev`. Suggested `prisma@6.12.0` downgrade is a breaking major change. | Track as post-G4 dependency maintenance item; re-check if upgrading Prisma CLI safely (**Owner: B**). |
| **Summary out-of-range label (`"Page 2 of 1"`) on production `7872a739`** | Resolved in staging & UAT (`Minor UI wording`, `d3b07ba`) | Hosted `main@7872a739` still labels empty out-of-range pages `"Page N of M"` until `046310d2` promotes to `main`. Fix `d3b07ba` (`"Page 10 (9 pages total)"`) passed `UAT-FINAL-06` on both Cloud and Local UAT. | Ship with Final `main` release after user `G5` approval (**Owner: B**). |
| **Final video duration conflict (`4 min` vs `10 min`)** | Course specification ambiguity (`Docs / Process`) | `project_final_delivery_v1.pdf` states `10 min` on p.2 and `Maximum 4 minutes` on p.4 (`summary_final_deliverable.md §17.4`). | Confirm official course clarification before Final video cut; follow provisional `<= 4:00` pacing plan unless clarified (**Owners: A + B**). |
| **Production Cloud SQL inspection boundary (B workstation)** | Environmental access limit (`Operational readback`) | B's workstation has no `gcloud` CLI or Cloud SQL Proxy access to `fasttrack_prod`, so hosted database totals are reconciled via `/api/teams/:id/progress`, `/api/summary`, and A's revision/job outputs (`deploy.yml` job logs). | Owner A (`@zerotwobook`) confirms Cloud Run migration execution ID & serving revision at `G5`; B verifies HTTPS endpoints and readback (**Owners: A + B**). |
| **`G5` Final `main` release freeze & `G6` package assembly (`#37`/`#38`/`#39`)** | Active release & submission gates | Joint G4 (`#36`) is complete; `046310d2` still awaits explicit user `main` release authorization, `Deploy demo` rollout, joint Final video capture, and PDF export/LEB2 submission. | User authorizes `main` release PR -> `Deploy demo` + readback -> record video & assemble Final PDF (**Owners: User + A + B**). |

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

| Release Manifest Field | Current D2 Baseline (Reference Only) | Final Assessed Release Value (`[PENDING G5]`) |
| --- | --- | --- |
| Release purpose | D2 accepted baseline (`v1.0.0-d2`) | `Final assessed` (`[PENDING]`) |
| Final `main` commit SHA & immutable Git tag | `7872a739147f7553e16e05a4d40b5d0de0c21f27` / `v1.0.0-d2` | `[PENDING Final PR -> main]` |
| Required `main` CI run & test counts (`PASS/FAIL/SKIPPED`) | Run `44885899889` (`483/0/0`, `7/7` upgrades) | `[PENDING]` |
| Protected `Deploy demo` run, migration job & serving revision | Run `44888588070`, `fasttrack-migrate-4lvx5`, `fasttrack-app-00005-rkz` (`100%`) | `[PENDING]` |
| Pushed `web` & `jobs` image digests (`sha256:...`) | `web`: `sha256:7b868cd...`; `jobs`: `sha256:b49829f...` | `[PENDING]` |
| Hosted `/api/health` & `/api/ready` readback matching final SHA | HTTP `200` (`version: 7872a739...`, `database: connected`) | `[PENDING]` |
| Joint `R3-J03` (`#36`) tester handle, date & UAT result | Separate Lab 6 historical UAT (`2026-11-19`) | **`8/8 PASS` (`0 FAIL, 0 BLOCKED`) on `046310d2` (`G4 ACCEPTED`):** Cloud `Pawarit Wongdaeng` (`2026-11-23`), Local `Tatchakorn Thamnimitr` (`2026-11-24`) |
| Reviewer A & Reviewer B gate sign-off (`G4`/`G5`/`G6`) | `#33` D2 closed | **`G4 ACCEPTED` (`#36` Closed `2026-11-24T11:35:33Z`: A `#7130219625` & B `#7130293441`); `G5`/`G6` `[PENDING]`** |
