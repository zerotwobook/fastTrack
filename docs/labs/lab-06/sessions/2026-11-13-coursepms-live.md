# CoursePMS live exploratory session — 13 November 2026

Task R2-A04 / Issue #22. Owner A (`zerotwobook`); reviewer B (`Atip-Infa`). Status: IN PROGRESS. This record contains actual AI-operated browser checks requested by the user; it does not establish either student's personal participation or an independent acceptance decision.

## Release and sources

- Application: https://course-pms-859617270560.asia-southeast1.run.app/
- Intended source: `150dc5db3de5c829a7d9ef1adb545191cc37542d`.
- Historical Sprint 1 tag supplied by the partner: `v1.0.0-sprint1`, commit `5979f5870e8e28277996dc3045cbf4be5f7236ad`.
- Partner-supplied handoff: user-provided `message.txt`; statements in it remain partner reports until independently observed.
- Auth contract v1.1 and team/proposal contract v1.0 were read at the intended source under `docs/sprints/sprint-1/` in Magiciancat9/Course_management.
- Official `CoursePMS_Send_to_UAT_Team.zip` and CPMS-UAT-01 through CPMS-UAT-08 steps have not been supplied. This session uses separate exploratory IDs and cannot count as completion of those official cases.
- Current Cloud Run revision and traffic allocation have not been independently confirmed. The handoff reports `course-pms-00006-sbx` at deployment time only.

## Actual observations so far

| ID | Observation | Result and limit |
| --- | --- | --- |
| EXP-00A | Opened `/api/health` in Chrome. Response timestamp `2026-11-13T11:56:47.178Z` (18:56:47 Asia/Bangkok). | Visible JSON: `status: ok`, `service: course-pms-api`, `commitSha` exactly matches intended source. HTTP status not inspected in browser Network. |
| EXP-00B | Opened `/api/ready` in the same Chrome tab before sign-in. | Visible JSON: `status: ready`, `db: connected`. HTTP status not inspected. |

## Execution boundary

Three test accounts were supplied directly by the user. Passwords and session tokens are excluded from this file and Git. Account-to-official-alias mapping, clean starting memberships and safe repeat-run fixtures remain unconfirmed. Preserve existing partner records; no seed/reset, deletion, deployment or historical-record modification is authorized by this session.

Further case results will be appended after actual execution. No PASS is claimed for unobserved business behavior. No partner notification has been sent. Final acceptance remains PENDING.
