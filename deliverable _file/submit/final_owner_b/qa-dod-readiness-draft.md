# Final QA, product DoD, and release readiness (Part D draft)

Working draft prepared by B (`@Atip-Infa`) for [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38), coordinating with A's traceability and independent UAT worksheet drafts in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148). **Not Ready for Final Release Claim:** Joint independent UAT (`#36`), any resulting defect fixes/retests, final candidate freeze (`G5`), and final `main` deployment readback remain pending.

## Selected access-control automated test excerpt (for Part C/D pairing)

Per `workflow/03_SPRINT3_D2_FINAL.md` section 10, B supplies the access/ownership automated test excerpt to pair with A's domain excerpt (`T-26` in `submissions.a02.ts`).

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

## Independent UAT, advisory disposition & defect ledger (`R3-J03 / #36` — In Preparation)

| Gate / Item | Target | Current Status |
| --- | --- | --- |
| Joint Final UAT ([`#36`](https://github.com/zerotwobook/fastTrack/issues/36)) candidate & test environment | Candidate `staging/sprint-3` @ `046310d288859ee42745a043369498d5d646d6c9` ([Staging CI `45039631042`](https://github.com/zerotwobook/fastTrack/actions/runs/45039631042)); 8 cases `UAT-FINAL-01`..`08` ([PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) | **Local UAT environment verified (`http://127.0.0.1:8080`, DB `fasttrack_uat_046310d`)**: `/api/health` & `/api/ready` (`200`, matching SHA), synthetic accounts (`SA`, `A1`, `A2`, `SB`, `B1`, unassigned `ELIGIBLE`, dedicated `SUM_SUP` with `1/10 (10%)` & `Page 10 (9 pages total)` recovery verified via headless Chrome), and restart persistence verified. **Pending:** independent tester assignment, remote public preview exposure (if testers are remote), and independent execution (`Verification = NOT RUN`). |
| Accepted critical defects & dependency advisory disposition | Zero open critical/blocking baseline defects at `G5` freeze; explicit disposition of `npm audit` advisory on `effect@3.20.0` (`GHSA-7589-6fvf-x4pw`) | None open in `staging/sprint-3`; `"Page 2 (1 page total)"` fix merged in `055f3a4d` (under UAT verification in `UAT-FINAL-06`). **Advisory disposition (`GHSA-7589-6fvf-x4pw`):** `effect@3.20.0` enters solely as a transitive `devOptional: true` dependency of `@prisma/config@7.10.1` (`prisma` CLI devDependency); static inspection confirmed zero imports in `Project_code/client`, `Project_code/server`, or production `runner` image runtime dependencies (documented follow-up if Prisma CLI upgrades prior to freeze). |
| Hosted Cloud Run D2 baseline (`7872a739`) | Revision `fasttrack-app-00005-rkz`, migration `fasttrack-migrate-4lvx5`, `https://fasttrack-app-kpx7au3w2a-as.a.run.app` (`/api/health`, `/api/ready`, `6/14 (42.9%)` Summary, S1 continuity preserved) | Active pre-Final `main` baseline; **Final candidate `main` deploy/readback pending G4 UAT & user authorization** |

## Clean setup verification & Final release manifest template (`G5`)

Clean-checkout reproduction steps remain pinned in [`Project_code/README.md`](../../../Project_code/README.md) (`Node 26.13.0`, `npm 11.20.0`, `npm ci`, `npx prisma generate`, `npm run typecheck`, `npm test`, `npm run build`, `npm run test:runtime:isolated`, `npm run verify:container`, `npm run verify:socket`). Fill every row below strictly from observed Final execution before user `main`-release sign-off (`workflow/MAIN_RELEASE_GATE.md`):

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
