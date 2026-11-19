# Lab 6 final evidence intake — 19 November 2026

This record updates R2-A04 and R2-B04 with the latest CoursePMS return, accepted staging integration and the user's report of TA feedback. Times are Asia/Bangkok unless explicitly marked UTC.

## Partner return verification

The received `FastTrack-Lab6-Return-20261119.zip` contains 76 files. Archive integrity passed, all 75 top-level SHA-256 entries matched, and all 25 checksums in the nested Section 3.5 manifest matched. All 26 nested Section 3.5 files match the previous return byte for byte. The full return, identified report, credentials and private Canva editing link remain in the local evidence package. This record carries the test results and two original synthetic-data database projections.

## Sprint 1 fastTrack UAT

CoursePMS reports **UAT-01 through UAT-08 PASS, no outstanding defects, and a joint Accepted decision** on 19 November. Partner 1 was responsible for UAT-01–04 and Partner 2 for UAT-05–08. The reported joint human session was approximately 09:00–11:44. The return records receipt of the final confirmation at 11:46:32. Per-case times, human-session screenshots, fixture IDs and start-source observation at 09:00 were not retained. Health and readiness returned HTTP 200 and expected source `8e637e537cd037d630a5fffc1b5672d1b44371a8` at 11:24:56 and 11:45:02. Those timestamps identify the observed version during those checks.

| Case | Reported human result | Separate Codex evidence from 18 November |
| --- | --- | --- |
| UAT-01 | PASS | Supervisor creates a milestone, reload shows one row and student reads the same fields. |
| UAT-02 | PASS | Authorized student and supervisor views show version 1 and two persisted feedback messages. |
| UAT-03 | PASS | The teammate sees the same saved work. Duplicate POST returns `409 ALREADY_SUBMITTED` without changing the original. |
| UAT-04 | PASS | The stale form's late request returns `409 DEADLINE_PASSED` and the saved list is empty. |
| UAT-05 | PASS | Foreign team, milestone, submission and feedback reads return `404`. |
| UAT-06 | PASS | Forbidden role writes return `403`. Invalid input is rejected and saved state is unchanged. |
| UAT-07 | PASS | Anonymous and signed-out private requests return `401`. Same-profile identity switching preserves scope. |
| UAT-08 | PASS | Four readbacks preserve the same submission and feedback across reload and relogin. |

The 18 November technical run, its 28 screenshots, original fixture IDs and machine timestamps retain Codex attribution. The independently reported 19 November human session and joint decision have their own provenance. [18 November evidence](2026-11-18-coursepms-fasttrack-returned-results.md) · [Sprint 1 acceptance record](../acceptance-record.md)

The user reported on **19 November 2026** that the TA confirmed the Lab 6 evidence was OK that day, after the discussion about the human UI record and its limitations. The original message, channel and exact time were not supplied. This closes the previously reported Lab 6 TA evidence wait for report assembly. The decision applies to Lab 6. [Earlier TA feedback](2026-11-17-ta-human-ui-feedback.md)

## Section 3.5 simulated deadline exercise

`Atip-Infa` approved exact PR #115 head `2b1a1f61b8c1d18adcdbc3d4219033627840604d` at 11:16:36 on 19 November and merged it into `staging/sprint-2` at 11:16:45 as `03d5b13fb38b09dc7f13eedafa469a3904c5cbf8`. Required CI `44367887177` passed. The published exercise record retains the deliberate defective commit `94d2032`, RED `ab632a2`, restored guard `1771ca1`, 379 passing regression cases and the dedicated preview at source `1bbe187c088b86d104a16e420058f17425f18828`, revision `fasttrack-lab6-00001-74k`. The preview deployed directly from its verified source to isolated cloud resources. [Merged PR #115](https://github.com/zerotwobook/fastTrack/pull/115) · [Required CI](https://github.com/zerotwobook/fastTrack/actions/runs/44367887177) · [Implementation and deployment evidence](../simulation-3.5/execution-report.md)

CoursePMS run `20261119-103240-7a83`, recorded at 10:32:39–10:49:46, returned CPMS-S35-01, CPMS-S35-02 and CPMS-S35-03 PASS. Original browser operation was by Codex on behalf of the independent team. The reviewers jointly reviewed the original Cloud Logging outputs with Codex assistance at approximately 11:23 on 19 November. They returned **Accepted for this exact Section 3.5 retest**, with 16/16 comparison checks passing. The compare step used original snapshot and redacted HTTP evidence. The dedicated revision was provided by fastTrack. [Partner retest procedure](../simulation-3.5/coursepms-retest.md)

| Check | Actual result |
| --- | --- |
| On-time work | HTTP `201`. Same version 1 submission `e464cfe7-3c6e-4a9d-835c-310fe20b4ede` after reload. |
| Stale late form | HTTP `409 DEADLINE_PASSED` and preserved draft. |
| One late retry | HTTP `409 DEADLINE_PASSED`. The recorded late saved-state reads were empty. |
| BEFORE DB snapshot | 10:42:36.820, execution `fasttrack-lab6-migrate-g2b9l`. One on-time version 1 submission and zero late rows. |
| AFTER DB snapshot | 10:51:57.192, execution `fasttrack-lab6-migrate-xwqcm`. Same submission ID, version, title, URL and time, with zero late rows. |

Both archived JSON payloads byte-match the owner copies. The test/HTTP sequence is bracketed by the two database times, and the selected database rows are identical before and after. The database projection covers those selected rows. Original browser/API evidence retains additional fields and separate clock observations. [BEFORE original JSON](../evidence/coursepms-s35-20261119/before.json) · [AFTER original JSON](../evidence/coursepms-s35-20261119/after.json) · [Comparison and provenance](../evidence/coursepms-s35-20261119/comparison.json)

## Handoff and next work

- B reviews the current report PR candidate. The report owner assembles the identified report and records the actual LEB2 submission and receipt. The Lab 6 deadline is 22 November 2026, 23:59 Asia/Bangkok. [PR #114](https://github.com/zerotwobook/fastTrack/pull/114)
- The next lab is Lab 7, due 29 November 2026, 23:59 Asia/Bangkok. A prepares a precise old-to-new change request for one implemented Sprint 1 behavior and obtains approval for that specific change. Once approved, A drafts impact and updated contract/STS, and captures RED before B implements GREEN. [A / #24](https://github.com/zerotwobook/fastTrack/issues/24) · [B / #25](https://github.com/zerotwobook/fastTrack/issues/25)
- For Sprint 2 product work, A/B reconcile the pending joint entry decision before dependent work. F-05A and F-05B are next after that decision. [Joint checkpoint #13](https://github.com/zerotwobook/fastTrack/issues/13) · [A / F-05A #17](https://github.com/zerotwobook/fastTrack/issues/17) · [B / F-05B #18](https://github.com/zerotwobook/fastTrack/issues/18)
