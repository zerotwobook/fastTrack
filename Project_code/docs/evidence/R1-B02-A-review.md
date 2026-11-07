# R1-B02 independent review and A correction

Owner B originally implemented feedback in PR #58; A reviewed head `687c5687a683737d17b0bc0af51316f80bffe67a` and the user authorized repairs. A correction is #60 / PR #61, branch `fix/s1-a-b02-review`, preserving B history by merge from accepted staging `5b35fc1`. A authored the repairs; B reviews the current correction head. Main remains unchanged.

## Findings and corrections

| Finding at the original head | Correction and verification |
| --- | --- |
| FeedbackPanel was not mounted in the application. | App composes the accepted exact-submission/version slot. Real supervisor create -> student submit -> supervisor feedback -> student read was exercised through the UI. |
| database() masked P2002 before the concurrent-retry handler. | One transaction uses scoped access, team lock/recheck, key decision and insert. Only the actual feedback unique constraint or confirmed rolled-back contention permits bounded fresh transactions. Real HTTP duplicate races and a forced two-team PostgreSQL key collision pass. |
| Default npm test required TEST_DATABASE_URL and failed during collection. | DB files use *.b02.ts and a reserved-database config/isolated runner. Ordinary tests run without DB. Retained B cases explicitly stub guards; A cases use actual sessions/source/CSRF. |
| Uncertain saves kept an editable draft with the old key. | UI freezes a UUID/body intent, GETs saved feedback, confirms matching existing records or offers manual same-intent retry. Recovery failure blocks saves until a successful check. Real saved-response loss and controlled unsent/recovery-outage scenarios pass. |
| NUL/unpaired Unicode produced database errors rather than field validation. | Shared validation rejects invalid PostgreSQL text and consistently counts Unicode code points; 4,000 astral characters work in API tests, while UI rejects 4,001 with a focused field error. |
| Original panel had red error styling, custom controls and UTF-16 length limits. | Shared monochrome Field/Textarea/Button, established tokens, visible labels, exact version heading, code-point counter, keyboard focus and narrow-screen layout. |
| Repeating the same invalid save did not restore field focus. | Browser review caught this after correcting an initial harness copy mismatch. UI commit 7b755ce explicitly focuses the textarea for every failed local validation; repeated checks pass. |

## Reproduction and actual automated results

Original clean clone: npm ci installed 316 packages; generation/typecheck/build passed. Default npm test without a database failed collection (116 passed assertions, one failed suite). With a disposable PostgreSQL DB, original suites passed 129 ordinary / 38 G1 / 28 auth / 33 B01 / 48 A02 and seven upgrade scenarios. These results did not cover the missing UI integration or concurrent race. A review-only service lookup barrier forced identical requests past the absent-key lookup: PostgreSQL stored one row but returned 201/503 instead of 201/200. NUL input returned 503.

The correction retains RED commit 22149cd and [actual RED details](R1-B02-A-red.json): 117 ordinary passed / 3 failed; feedback group 31 passed / 5 failed. The initial harness also had a corrected TypeScript unknown-body error; it is not a product defect. Later transaction tests were strengthened and are reported only in GREEN.

Final server/test/harness source corresponds to 44cac63. Final UI code is 7b755ce1e0f20271a66bdec0102827d0f4ca0d8f. The isolated runner completed generation, fresh dev/test migrations, repeat deploy, typecheck/build, **120 ordinary / 38 G1 / 28 auth / 33 B01 / 48 A02 / 42 B02**, and **seven upgrade scenarios**. All passed, with its own disposable container removed. B02 includes 13 retained actor-stub service cases and 29 independent real-session/transaction regressions. A clean HTTPS clone installed 316 packages, generated the client and passed typecheck/120 ordinary/build; after fast-forwarding the UI-only focus change, typecheck/120 ordinary/build passed again. No schema/migration/seed/lockfile changes.

Commands from Project_code:

```powershell
npm ci
npm run db:generate --workspace @fasttrack/server
npm run typecheck
npm test
npm run build
npm run test:b02:isolated
```

The isolated command provisions PostgreSQL at a random loopback port and runs the full inherited regression chain. For browser review, set a synthetic AUTH_REVIEW_PASSWORD, run `npm run review:b02`, then stop it with `npm run review:auth:stop` in that same clone. Do not use an existing development/assessment database for destructive fixtures.

## Actual browser results

A used Playwright against the real compiled app and disposable PostgreSQL, with development configuration on loopback. The separate review child was actually terminated and restarted on the same origin/DB. It used compiled application factories and the built client; this is not a public production/TLS deployment claim.

- Supervisor A created a milestone through the UI; Student A1 submitted immutable version 1 through the UI. Supervisor A opened that exact record and saved feedback; Student A1 read it without a write form.
- Normal save returned real 201 and a persisted DTO. Empty/repeated-invalid/4,001-code-point errors retained values and focused the field. Script-like text rendered as text without executing.
- Controlled response loss occurred after a real POST committed 201. UI recovery GET found its existing ID: one POST, one GET, one new row and a cleared draft. The two earlier normal UI saves with identical text were separate deliberate intents; their different keys are not a retry duplicate.
- Controlled unsent POST plus a recovery GET 503 left the draft read-only and save disabled. A later successful check showed no row, offered manual Retry save, and used the exact same body/key. No automatic POST retry occurred; one row was finally added.
- Controlled initial GET delay/error showed loading and recoverable error without a false empty state; Retry loading feedback loaded real data.
- Supervisor B received generic API 404 and the unavailable submission UI, with no feedback content/form. Student A1 POST returned 403 with a real session/CSRF; its read returned four saved entries.
- Browser timezone America/New_York still displayed every timestamp in Asia/Bangkok. Widths 320/390/768/1280/1440 had no horizontal overflow; keyboard Tab/Shift+Tab reached the save control/textarea with a visible 2px focus ring. Native browser 200% zoom is still a later G4 check.
- Actual compiled child PID changed 7432 -> 2692. The same student session restored after reload, and both the original submission DTO and all four feedback DTOs were byte-for-byte equal. The browser rendered all four entries and no student form after that process restart.

This directly exercises the combined UI-after-process-restart gap recorded for AC-03.6/T-16 at the older A03 baseline. It is current candidate evidence; it does not retroactively rewrite the accepted A03 snapshot or certify G4/release.

[Machine-readable results and exact case names](R1-B02-A-results.json) and [image hashes/dimensions](R1-B02-A-assets.json) preserve the actual checks. Images were visually inspected and copied without editing:

- [Supervisor desktop](assets/b02-feedback/b02-supervisor-1440.png)
- [Supervisor at 320px](assets/b02-feedback/b02-supervisor-320.png)
- [Student after actual process restart](assets/b02-feedback/b02-student-after-restart-1440.png)

## Accepted integration and remaining gates

B (Atip-Infa) approved exact f516b1704af67b367f1e6ec09657134645b8eeed at 2026-11-07 02:36:37 UTC, reporting typecheck, 120 ordinary, 42 B02 and build plus architectural/UI-state review. B merged PR #61 into staging/sprint-1 at 02:40:23 UTC as 514f34cbdb95f2141d2c7f3159a1c36a0bd236a6. Approved and merged trees are identical. #8/#60 and PR #61 are Done/PASSED/ACCEPTED. Original PR #58 stays closed unmerged and archived Fixing/FAILED/PENDING; its rejected head was not accepted unchanged.

[Shared R1-J03 / #9](R1-J03-system-verification.md) now covers integrated verification and the actual G3/G4 handoff. Earlier candidate evidence and source versions above remain historical facts. G3/G4 joint acceptance, G5/main, final PDF and submission remain separate. B still owns C/E/F and PDF assembly; accepted A03 content is not a final PDF.
