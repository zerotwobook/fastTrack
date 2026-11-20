# Sprint 2 integration review from A

Issue [#21](https://github.com/zerotwobook/fastTrack/issues/21) (R2-J02) and PR [#123](https://github.com/zerotwobook/fastTrack/pull/123). A verified the shared staging baseline on 20 November 2026 (Asia/Bangkok).

- Shared baseline for A and B: `staging/sprint-2@fef3593ce44f722b579aaba307b5b2e4cfab9747`. [Baseline CI](https://github.com/zerotwobook/fastTrack/actions/runs/44590514541)
- Verified source: `0ac247b781369f2694ac96eb76176fe52813cd59`. The only source change from the shared baseline is the [authenticated integration test](../../server/src/testing/integrated-s2.auth.ts). [Test commit CI](https://github.com/zerotwobook/fastTrack/actions/runs/44657570531)
- PostgreSQL 16.8 was disposable and cleaned up after the run. The compiled client used the same local API and database. A's browser run used synthetic supervisor, teammate and foreign-team accounts. [Browser results](R2-J02-A-browser.json)

## Observed results

| Check | Expected | Observed |
| --- | --- | --- |
| Progress after cancellation and first submissions | Five rows remain visible. One cancelled milestone is excluded from the total. | Three of four active milestones submitted, 75.0%. The cancelled row remained visible. API `asOf` matched `meta.serverTime`. |
| Revision and exact-version feedback | Feedback on v1 remains attached to v1. A new v2 without feedback shows Submitted. | A saved v2 from the browser, opened v1 to verify its original feedback, and returned to v2 to see its empty feedback panel. The PostgreSQL test confirmed original v1 and feedback rows were unchanged. The API and progress meter stayed at 75.0%. |
| Concurrent revisions with the same expected version | One HTTP 201, one HTTP 409, and exactly one new version in history. | The two real student requests returned 201 and 409 `VERSION_CONFLICT`. Persisted rows were v2 and v1, with the winning author's original account ID on v2. |
| Browser recovery after a teammate saves a revision | The old draft stays open, and accepting the new base requires user action. | The teammate saved v3 and the browser received 409. The same draft title and description remained. Confirming the base by keyboard returned focus to the title. Zero automatic POST retries. History was v3, v2, v1. The form fit at 375 CSS pixels. |
| Foreign team access | Return the same generic 404 as a missing resource, without private work, feedback, or metrics. | The database-backed HTTP test confirmed 404 parity for a foreign student and supervisor, and a foreign revision created no rows. Switching to a foreign student in Chromium hid older feedback and the progress meter. Zero uncaught browser errors. |
| Fresh install, upgrade and Sprint 1 regression | Normal auth, milestone, first-submission and feedback behavior continues after integration. Existing records survive migration. | Typecheck and production build passed. All 445 test executions and seven migration upgrade scenarios passed. The compiled Sprint 1 journey preserved records after an explicit repeat seed and process restart. |

## Reproduce locally

Run these from `Project_code` in a separate checkout with Docker running.

```powershell
npm ci
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
foreach ($suite in @('AUTH', 'B01', 'A02', 'B02', 'J03', 'A01')) {
    Set-Item -Path "Env:G1_${suite}_CHECKS" -Value '1'
}
npm run test:g1:isolated
```

The run recorded 198 unit/API, 38 G1, 46 auth (including STS-32), 48 B01, 54 A02, 48 B02, one compiled Sprint 1 journey and 12 runtime cases. A's first local attempt stopped before running tests because Docker Desktop was stopped. The totals above come from the completed rerun after Docker was started.

For the browser, set a disposable-only `AUTH_REVIEW_PASSWORD` and run `npm run review:auth`. Open the printed loopback URL. As the seeded Team A supervisor, create five milestones with future deadlines and cancel an unsubmitted one. Submit v1 on three active milestones and add supervisor feedback on one. As a student, open **View progress**, inspect the reviewed milestone, and submit a revision. Open v1 through the history and verify its feedback, then visit the latest version. To verify stale draft recovery, leave the revision form open in one session and save the next revision from another authorized student session before submitting. Sign out and use a Team B student to check denial on the previously used submission and progress links. Stop with `npm run review:auth:stop`.

## Handoff to B

Independently verify team planning and progress on the shared staging SHA above. Check membership changes before and after first submission, supervisor scope, and the PostgreSQL, API and browser agreement for 3 out of 4 active milestones and exact-version feedback. Record the tested SHA, steps, actual results and any defects under [#21](https://github.com/zerotwobook/fastTrack/issues/21). B's independent pass and the joint G3 decision remain pending.
