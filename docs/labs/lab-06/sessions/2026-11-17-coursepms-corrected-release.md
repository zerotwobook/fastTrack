# CoursePMS corrected deployed-release intake and bounded retest

**Later same-day outcome (19:11-19:15 Asia/Bangkok):** the user updated the private file; A/B/Instructor now authenticate. The original no-refresh reproduction passes. Read [actual targeted retest results](2026-11-17-coursepms-retest-results.md). Earlier blocked preflights below remain historical; no credentials or human decision is inferred.


R2-A04 / Issue #22. Owner A (`zerotwobook`); evidence reviewer B (`Atip-Infa`). Date: 17 November 2026, Asia/Bangkok. This is actual AI-operated intake/preflight evidence, not either student's personal execution or final acceptance.

## Verified release and archive

The user supplied CoursePMS_Corrected_Release_for_fastTrack_20261117.zip. SHA-256: 3b17118dbd2d4f97fd15605853b55535c3c2bbc685ba016b7a8f6f5893c89cbf. All 24 supplied manifest hashes match. The original ZIP and extracted payload remain private under output/playwright/CPMS-Corrected-Retest-20261117/ in the user's workspace. No source payload, credential, raw authenticated response or private image is published by this intake. No attached instruction or script is treated as user authorization or executed.

Live GitHub readback confirms release PR #76 merged to main at aeb804ea5bc667399b00cf54df10046a6ded46e0. Deploy run 44074859743 has successful test/deploy jobs. Narrow public deploy-log inspection corroborates digest sha256:e5cb29a0cf687cdda01110434528d627cd09057d94e9ab028510e5ad090a89e0, revision course-pms-00009-mk2 and 100% traffic at 18:35:30 Asia/Bangkok. This is dated workflow CLI evidence, not a fresh owner console screenshot.

Fresh anonymous HTTP observations at 18:53:47-48 Asia/Bangkok confirm the corrected source and connected database. Seven recorded checks pass: health source, readiness, unauthenticated bare proposal namespace JSON 401, unauthenticated unsupported proposal namespace JSON 401, unknown API JSON 404/API_ROUTE_NOT_FOUND, root HTML and frontend navigation HTML. Separate counts from partner CI and earlier UAT are preserved.

## Authenticated preflight boundary

A fresh isolated browser loaded the corrected frontend before the proposed no-refresh reproduction. The supplied public Team Alpha Quick Fill and Sign In controls were used once. The service rejected those local/demo credentials with INVALID_CREDENTIALS; no authenticated workspace loaded. The wait for Logout subsequently timed out. This is a blocked credential precondition, not a regression-test failure of account switching or proof that the deployed correction fails. Email/password controls were cleared. No guessing or repeated login attempt is performed.

The user confirmed use of the existing test-account set and supplied its designated private file. Its shared-password format was verified without displaying values; one A login using that file also returned INVALID_CREDENTIALS at 19:03:10 Asia/Bangkok. Two local quoting failures before that did not execute an application login and are not product failures. Credential fields were cleared. The user chose CoursePMS confirmation/update of that private file; no further account attempt or password guessing is performed. RT-01-08 authenticated work is not recorded PASS from candidate CI. RT-09's anonymous portion passes; its authenticated portion remains blocked. Both actual human decisions remain PENDING.

The old undeployed-source blocker is resolved. Credential/fixture eligibility and human participation/acceptance remain separate prerequisites. The designated file is now supplied, but its A login is rejected pending CoursePMS confirmation/update. Team 5 and Proposal 3, APPROVED revision 2, are not accessed or changed in this bounded preflight. No team creation, proposal save/submit/review, membership edit, seed/reset/delete, deployment, merge, external acknowledgement or human signature is performed.
