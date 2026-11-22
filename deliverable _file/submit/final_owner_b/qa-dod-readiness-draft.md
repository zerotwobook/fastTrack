# Final QA, product DoD, and release readiness (Part D draft)

Working draft prepared by B (`@Atip-Infa`) for [Issue #38 (`R3-B04`)](https://github.com/zerotwobook/fastTrack/issues/38), coordinating with A's traceability and independent UAT worksheet drafts in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148). **Not Ready for Final Release Claim:** Final merges (`#146`, `#147`), joint independent UAT (`#36`), final candidate freeze (`G5`), and final deployment readback remain pending.

## Selected access-control automated test excerpt (for Part C/D pairing)

Per `workflow/03_SPRINT3_D2_FINAL.md` section 10, B supplies the access/ownership automated test excerpt to pair with A's domain excerpt (`T-26` in `submissions.a02.ts`).

- **Requirement / Rule:** `FR-10`, `BR-02`, `NFR-02` (`F08-AC-04` / `F08-STS-04` — cross-team summary and milestone isolation).
- **Source & Line Range:** [`Project_code/server/src/testing/summary-drilldown.b01.ts#L342-L365`](../../../Project_code/server/src/testing/summary-drilldown.b01.ts#L342-L365) (at `staging/sprint-3` `6074f98e` and identical server test suite on `PR #146` `017811c` / `PR #147` `b323d4e`).
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

- **Observed Execution Result (Staging QA Branches):** `PASS` inside `npm run test:b01:isolated` (`57 passed, 0 failed, 0 skipped` within the `483`-case `test:runtime:isolated` run on [A CI `45022169276`](https://github.com/zerotwobook/fastTrack/actions/runs/45022169276) and [B CI `45027976730`](https://github.com/zerotwobook/fastTrack/actions/runs/45027976730)). **Final Assessed Re-run:** `[PENDING final candidate after #146/#147 merge]`.

## Pre-UAT regression evidence summary (staging candidate + B pager fix)

| Regression Track | Owner & PR Status | Tested Source / Commit | Verified Results (`PASS / FAIL / SKIPPED`) | Open / Pending Items |
| --- | --- | --- | --- | --- |
| `R3-A03` Domain, data integrity & concurrency | A ([Issue #34](https://github.com/zerotwobook/fastTrack/issues/34), [PR #146](https://github.com/zerotwobook/fastTrack/pull/146) — **Approved by `@Atip-Infa`**, pending merge) | Source `6074f98e`; PR head `017811c` ([CI `45022169276`](https://github.com/zerotwobook/fastTrack/actions/runs/45022169276)) | **`483` passed, `0` failed, `0` skipped** across `14/14` stages + **`7/7`** legacy upgrades; `v1.0.0-sprint-1` (`ae7a60a6`) & `v1.0.0-sprint-2` (`f3ff8d97`) tag migration replays preserved hashes, ledger checksums, and SHA-256 fingerprints; **`17/17`** Unix-socket checks | Merge `#146` to `staging/sprint-3`; re-verify on final assessed release. |
| `R3-B03` Access, UI, responsiveness & operations | B ([Issue #35](https://github.com/zerotwobook/fastTrack/issues/35), [PR #147](https://github.com/zerotwobook/fastTrack/pull/147) — **Ready for `@zerotwobook` review**) | Base `6074f98e` + B fix `d3b07ba` (`Page 2 (1 page total)`), PR head `b323d4e` ([CI `45027976730`](https://github.com/zerotwobook/fastTrack/actions/runs/45027976730)) | Clean checkout: `214/214` unit (`DrilldownList.test.ts`), **`483` passed, `0` failed, `0` skipped** + **`7/7`** upgrades, **`13/13`** container, **`17/17`** socket, **`9/9` / `10/10` / `16/16` / `10/10`** offline `deploy/` & `test_smoke.py`; custom harness: **`11/11`** API role/team/origin/CSRF/session matrix, **`2/2`** `TRUST_PROXY_HOPS=1` `429`/cleanup checks, **`3/3`** health/ready + invalid-DB fail-closed, **`12/12`** Chromium UX/focus/account-switch checks, **`54/54`** layout checks (`320/390/768/1280/1440px` + `200%` zoom), **`17/17`** WCAG contrast | Await A peer review & merge of `#147`; deploy `d3b07ba` before Final UAT if `#147` ships in Final. |

## Independent UAT & defect ledger (`R3-J03 / #36` — Pending)

| Gate / Item | Target | Current Status |
| --- | --- | --- |
| Joint Final UAT execution ([`#36`](https://github.com/zerotwobook/fastTrack/issues/36)) | Run `UAT-FINAL-01`..`08` (draft worksheet in [PR #148](https://github.com/zerotwobook/fastTrack/pull/148)) with independent tester(s) on the frozen final candidate (`G4`) | **Blocked pending `#146` & `#147` merge** |
| Accepted critical defects & retests | Zero open critical/blocking baseline defects at `G5` freeze | None open in staging; `Page 2 (1 page total)` fix ready in `PR #147`; `GHSA-7589-6fvf-x4pw` (`effect@3.20.0`, `devOptional` CLI dependency) tracked transparently |
| Hosted Cloud Run D2 baseline (`7872a739`) | Revision `fasttrack-app-00005-rkz`, migration `fasttrack-migrate-4lvx5`, `https://fasttrack-app-kpx7au3w2a-as.a.run.app` (`/api/health`, `/api/ready`, `6/14 (42.9%)` Summary, S1 continuity preserved) | Active pre-Final baseline; **Final candidate deploy/readback pending** |

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
