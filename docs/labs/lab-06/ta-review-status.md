# Lab 6 evidence for TA review

Updated 18 November 2026, Asia/Bangkok. **InfaCompany / fastTrack, EN-028, Section 31.** This page presents the returned partner results, confirmed reviewer responsibilities, AI attribution and current deployment identity for TA assessment.

The user reported on **19 November 2026** that the TA confirmed the Lab 6 evidence was OK that day. The original TA message, channel and exact time were not supplied. The [19 November closeout](sessions/2026-11-19-lab6-closeout.md) records the reported joint UAT result and the separately accepted Section 3.5 retest.

## 18 November technical results

**CoursePMS returned all eight fastTrack cases as PASS** on source `8e637e537cd037d630a5fffc1b5672d1b44371a8`, run `L6-CPMS-AI-20261118-144203`. The recorded session spans **18 November 2026, 14:37:42.827-14:50:33.231 UTC+07:00**. The evidence includes **28 screenshots, nine JSON ledgers, 18 active PASS observations and one retained invalidated automation observation**. All 40 checksum entries in the 41-file received archive match the original bytes.

[Read the complete eight-case result and screenshot record](sessions/2026-11-18-coursepms-fasttrack-returned-results.md).

| User-confirmed reviewer | Responsible cases | Assistance and attribution |
| --- | --- | --- |
| Tatchakorn Thamnimitr | UAT-01 through UAT-04 | Milestone/student matching view, submission/feedback, duplicate prevention, deadline rejection |
| Pawarit Wongdang | UAT-05 through UAT-08 | Cross-team access, role/input validation, sign-out/account switch, saved-state persistence |

The user confirms AI assistance in test execution and evidence collection. The returned archive identifies Codex as the recorded browser operator and leaves human review pending at archive creation. The subsequent user confirmation supplies the reviewers and case responsibilities. Individual human action/review times and a new explicit final decision for this particular run have no additional details in that update. Existing user-reported partner acceptance is retained in the [product decision record](acceptance-record.md).

## Current deployed application

At **18 November 2026, 15:19:49 UTC+07:00**, authenticated service/revision reads confirm **fasttrack-app-00003-rc7 at 100% traffic**, ready conditions True, and the matching immutable image digest. Public health/readiness return HTTP 200, source `8e637e5` and database connected. The readback occurred after the UAT session and retains its actual observation time. [Deployment readback and command evidence](sessions/2026-11-18-fasttrack-cloud-run-readback.md).

Assessed scope is Sprint 1 F-01 sign-in/scoped teams, F-02 milestone creation/read, F-03 shared version-1 submission and F-04 private append-only feedback. No confirmed legitimate fastTrack defect is recorded within this returned scope.

## Prior evidence and reciprocal testing

| Record | Actual retained outcome |
| --- | --- |
| [13 November incoming API/selected UI](received/coursepms-fasttrack-lab6-20261113/01-fasttrack-execution.md) | 97 main API PASS across 74 HTTP observations, separate seven post-UI controls |
| [13 November later UI follow-up](sessions/2026-11-13-fasttrack-followup-summary.md) | 26 UI observations, 25 final controls, 11 saved-state comparisons |
| [Consolidated historical case results](sessions/2026-11-18-fasttrack-recorded-results.md) | Original operator/times and procedural differences retained |
| [Outgoing corrected CoursePMS checks](sessions/2026-11-17-coursepms-remaining-checks.md) | Eight deployed targeted PASS plus RT-07 exact-source evidence/isolated replay PASS, source `aeb804ea` |

These are separate runs and denominators. [Contribution/AI attribution](contributions-and-ai.md), [evidence index](evidence-index.md) and [Parts A-D report outline](report-draft.md) provide the wider assessment context.

## Remaining report actions

The [earlier TA feedback](sessions/2026-11-17-ta-human-ui-feedback.md) records the original request. B reviews staging-targeted [PR #114](https://github.com/zerotwobook/fastTrack/pull/114). The report owner submits by 22 November 2026, 23:59 Asia/Bangkok and records the actual receipt.
