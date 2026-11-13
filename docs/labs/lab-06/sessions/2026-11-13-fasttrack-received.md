# Received CoursePMS evidence for fastTrack - 13 November 2026

R2-A04 / Issue #22; A receives and reconciles, B reviews through PR #110. The user supplied `coursepms-fasttrack-lab6-20261113/` and requested that new files and the pending PR become current. The canonical retained copy is [received/coursepms-fasttrack-lab6-20261113](../received/coursepms-fasttrack-lab6-20261113/README.md). Original bytes and source attribution are preserved.

## Actual reported execution

The operator recorded in this package is **Codex AI, acting for CoursePMS**. Planned students Tatchakorn Thamnimitr and Pawarit Wongdaeng have no recorded personal case allocation/execution or final decision in it. This intake adds no student signature or live test run.

- Product: fastTrack / InfaCompany / EN-028 / Section 31.
- Source: `8e637e537cd037d630a5fffc1b5672d1b44371a8`.
- Completed API run: `L6-CPMS-20261113-194706`, 12:47:06-12:54:06 UTC on 13 November 2026 (19:47:06-19:54:06 Asia/Bangkok).
- Main ledger: 97 passing assertions, zero failing assertions, 74 HTTP observations. Setup/readiness/logout assertions are included; this is not a count of complete independent UAT cases.
- Browser evidence: 11 narrow passing observations and 11 original PNGs; creation of normal milestone/work/feedback was through API and then read in the browser.
- Post-UI controls: seven passing observations in a separate ledger. They do not change the main 97/74 denominators.
- Temporary API/browser sessions were signed out according to the retained ledgers. New prefixed synthetic records remain for review; historical Lab 5 records were preserved.

## Per-case interpretation

| Supplied case | Completed main API assertions | Remaining limit |
| --- | --- | --- |
| UAT-01 milestone create/read | 7 PASS | Native date-picker/UI creation not completed; API-created record read through UI. |
| UAT-02 submit and feedback | 9 PASS | API created work and two messages; saved record/messages were observed through UI. Full UI write journey remains unrecorded. |
| UAT-03 duplicate submission | 4 PASS | API duplicate denial and unchanged saved work; UI notice/disabled button observed. Full written case not signed off. |
| UAT-04 deadline | 6 PASS | Late API rejection and post-deadline disabled form observed; form opened before deadline and submitted afterward was not exercised. |
| UAT-05 foreign-team reads | 19 PASS | Server denials and one exact saved-work UI denial observed; not every written UI route was traversed. |
| UAT-06 role/input rejection | 14 PASS | Selected browser errors and before/after controls; whitespace milestone title was API-only. |
| UAT-07 session/account switch | 9 PASS | Selected logout/account-switch UI and API revocation checks; complete human procedure remains unrecorded. |
| UAT-08 persisted records | 6 PASS | New-session API equality and selected SA/A1 UI reads; full human navigation not recorded. |

The remaining 23 main assertions cover readiness (8), setup (10) and cleanup (5). The [original execution report](../received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md) maps each assertion to sanitized HTTP evidence. The [browser report](../received/coursepms-fasttrack-lab6-20261113/05-browser-observations.md) maps screenshots to actual actions and limitations.

## Findings, versions and decision

No confirmed fastTrack product defect is reported in this bounded run. Correct 400/401/403/404/409 denials are intended negative outcomes. The [stopped setup attempt](../received/coursepms-fasttrack-lab6-20261113/setup-attempt-01/README.md) used an unsupported six-digit fractional timestamp; its 22 passing assertions and one incorrect runner expectation are preserved separately, not treated as a product defect or added to the main totals.

Actual Cloud Run revision/traffic, complete independent UI execution, both students' participation, accepted minor limitations and final decision remain PENDING/NOT CONFIRMED. Exact millisecond boundary, eight-hour expiry, restart/redeploy and performance were outside this run. The received outgoing CoursePMS files reproduce existing PR #110 observations; they do not establish new triage, correction, acknowledgement or retest.

## Intake verification

The [actual intake verification](../evidence/received-intake-verification.json) records successful byte equality for all 56 archived files against the user-supplied folder, all 55 original SHA-256 manifest entries, all 15 disclosed source-export hashes, parseable retained JSON, decodable original PNGs, unique main HTTP evidence IDs, resolved assertion references and the separate 97/74 and seven-control denominators. Current and archived Markdown local links/fences, runner syntax and scoped credential-pattern/raw-authentication-field checks also passed. A contact-sheet inspection confirmed the screenshots show the described application states without a filled credential form; the original PNGs remain unchanged. No claim is made to know or scan for the actual privately supplied password. Exact-head CI and B review remain tracked on PR #110; no new authenticated test run is claimed.

The original package's `package-verification.json` is its export-time record, not a newly authored acceptance claim. This intake does not rewrite archived hashes or silently update historical templates. Use [current-status.md](../current-status.md) for ongoing status and next actions, and retain future tester decisions as separate dated records.
