# CoursePMS-assisted fastTrack Lab 6 execution

Recorded completion UTC: 2026-11-13T12:54:06.453652+00:00. Operator: Codex AI, at the user's request while acting for CoursePMS. Independent students' personal participation and final acceptance remain PENDING.

## Version and scope

| Field | Observation |
| --- | --- |
| Product | fastTrack / InfaCompany / EN-028 / Section 31 |
| Independent team context | CoursePMS / EN-022_P6 / Section 31 |
| URL | https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| Selected and observed source | 8e637e537cd037d630a5fffc1b5672d1b44371a8 |
| Original Sprint 1 tag / source | v1.0.0-sprint-1 / ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8, supplied in accepted handoff |
| Current deployed revision / traffic | NOT CONFIRMED; historical fasttrack-app-00003-rc7 is not a new observation |
| Tested scope | F-01 sign-in/out/scoped teams; F-02 milestone create/read; F-03 one shared version-1 submission before deadline; F-04 private append-only exact-version feedback |
| Excluded scope | Sprint 2/3 feature acceptance; restart/redeploy; exact +/-1 ms boundary; 8-hour expiry; load/performance |
| Run | L6-CPMS-20261113-194706 |
| Started UTC | 2026-11-13T12:47:06.951229+00:00 |
| HTTP observations | 74 in completed main ledger; initial setup attempt counted separately |
| Assertion totals | 97 PASS / 0 FAIL; assertions include intended rejection, setup/readiness/cleanup |

The final AI report groups live API assertions under the supplied eight case IDs. It does not claim all eight complete UI procedures passed. Selected actual browser observations and screenshots support the persisted normal record, validation, session and access checks. See the evidence inventory and human continuation document.

## Case results and precise execution limits

| Case | Goal | Actual API result | UI / acceptance limit |
| --- | --- | --- | --- |
| UAT-01 | Milestone create/read | PASS (API assertions); 7 PASS / 0 FAIL | UI date-picker creation not completed; API-created saved record read through UI. |
| UAT-02 | Submit and append/read feedback | PASS (API assertions); 9 PASS / 0 FAIL | Saved version 1 and feedback read in SA/A1 UI (UI-01/02/05); create/submit/append performed through API. |
| UAT-03 | Duplicate first submission | PASS (API assertions); 4 PASS / 0 FAIL | UI-06 shows existing-work notice, saved link and disabled submit. |
| UAT-04 | Real-time late submission | PASS (API assertions); 6 PASS / 0 FAIL | UI-08 shows deadline-passed state and disabled submit; pre-deadline stale form not exercised. |
| UAT-05 | Foreign-team reads | PASS (API assertions); 19 PASS / 0 FAIL | SB/B1 server denials plus UI-11 SB generic unavailable page; all original UI paths not individually exercised. |
| UAT-06 | Role and input rejection | PASS (API assertions); 14 PASS / 0 FAIL | UI-03/07/09/10 cover blank feedback, forbidden milestone create, blank title and FTP link; milestone title field error API-only. |
| UAT-07 | Session/logout/account switch | PASS (API assertions); 9 PASS / 0 FAIL | UI-04 sign-out and UI-11 account-switch denial observed; API verifies wrong credentials, 401 and revocation. |
| UAT-08 | Saved state after relogin | PASS (API assertions); 6 PASS / 0 FAIL | API new-session reread plus UI SA/A1 reads; full human navigation not recorded. |

Read the [full supplied case sheet](from-fasttrack/prepared-uat/uat-cases.md) and the [current fixture ledger](evidence/fixture-ledger.json) for exact inputs/IDs. Every HTTP observation below links to actual sanitized input and response bodies in [http-observations.json](evidence/http-observations.json); assertions include expected versus actual outcomes in [assertions.json](evidence/assertions.json). Passwords, cookies, CSRF/authentication tokens and authentication headers are omitted.

## Actual saved data and negative-write controls

- Team A: 7c600ee0-a595-4c52-a093-f0ed5e08fded.
- NORMAL milestone: 646bf021-20f6-49e0-9296-7b6da18556f3; title L6-CPMS-20261113-194706-NORMAL.
- Saved work: 7e290379-cb6c-40e4-a22f-1f2073e3fe6c, version 1, author Student A1, submitted 2026-11-13T12:47:08.830Z.
- DEADLINE milestone: b001b3df-25cf-4073-b418-d8fabf9b0c8c; exact dueAt 2026-11-13T12:53:00.000Z; runner waits until 2026-11-13T12:54:00+00:00 and reads fresh serverTime before its late request.
- VALIDATION milestone: e2b312f8-8311-40c4-a394-ff52630a3fad; invalid submissions were followed by an authorized empty-list read.
- Two original feedback messages were appended once and compared across roles/new session. Duplicate requests by A1 and A2 were followed by an unchanged single-work read. Rejected role/input writes were followed by authorized before/after list/content comparisons. SB and B1 reads were denied with generic 404; anonymous/signed-out/revoked-session reads were denied with 401.

No historical Lab 5 record was edited. New prefixed synthetic records are retained for review/grading; Sprint 1 has no deletion UI. Do not delete directly from DB. The separate first-attempt deadline fixture is documented in setup-attempt-01/README.md. Browser UI actions and cleanup are recorded separately in evidence/browser-session.json when present.

## Assertion-by-assertion results

| ID | Case | Action | Result | Actual | HTTP evidence |
| --- | --- | --- | --- | --- | --- |
| L6-CPMS-A-001 | READINESS | Read serving source and readiness | PASS | HTTP 200 | L6-CPMS-HTTP-001 |
| L6-CPMS-A-002 | READINESS | Selected source matches public service | PASS | 8e637e537cd037d630a5fffc1b5672d1b44371a8 | L6-CPMS-HTTP-001 |
| L6-CPMS-A-003 | READINESS | Read serving source and readiness | PASS | HTTP 200 | L6-CPMS-HTTP-002 |
| L6-CPMS-A-004 | READINESS | Selected source matches public service | PASS | 8e637e537cd037d630a5fffc1b5672d1b44371a8 | L6-CPMS-HTTP-002 |
| L6-CPMS-A-005 | SETUP | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-003 |
| L6-CPMS-A-006 | SETUP | SA supplied role | PASS | supervisor |  |
| L6-CPMS-A-007 | SETUP | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-004 |
| L6-CPMS-A-008 | SETUP | A1 supplied role | PASS | student |  |
| L6-CPMS-A-009 | SETUP | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-005 |
| L6-CPMS-A-010 | SETUP | A2 supplied role | PASS | student |  |
| L6-CPMS-A-011 | SETUP | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-006 |
| L6-CPMS-A-012 | SETUP | SB supplied role | PASS | supervisor |  |
| L6-CPMS-A-013 | SETUP | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-007 |
| L6-CPMS-A-014 | SETUP | B1 supplied role | PASS | student |  |
| L6-CPMS-A-015 | UAT-01 | Supervisor assigned teams | PASS | HTTP 200 | L6-CPMS-HTTP-008 |
| L6-CPMS-A-016 | UAT-01 | Student assigned teams | PASS | HTTP 200 | L6-CPMS-HTTP-009 |
| L6-CPMS-A-017 | UAT-04 | Create synthetic milestone | PASS | HTTP 201 | L6-CPMS-HTTP-010 |
| L6-CPMS-A-018 | UAT-01 | Create synthetic milestone | PASS | HTTP 201 | L6-CPMS-HTTP-011 |
| L6-CPMS-A-019 | UAT-01 | Student rereads newly created milestone | PASS | HTTP 200 | L6-CPMS-HTTP-012 |
| L6-CPMS-A-020 | UAT-01 | Student sees persisted milestone fields | PASS | All fields match | L6-CPMS-HTTP-011, L6-CPMS-HTTP-012 |
| L6-CPMS-A-021 | UAT-01 | Reread saved milestone list | PASS | HTTP 200 | L6-CPMS-HTTP-013 |
| L6-CPMS-A-022 | UAT-01 | NORMAL milestone appears exactly once | PASS | 1 | L6-CPMS-HTTP-013 |
| L6-CPMS-A-023 | UAT-02 | Student submits work before deadline | PASS | HTTP 201 | L6-CPMS-HTTP-014 |
| L6-CPMS-A-024 | UAT-02 | Student reloads saved work | PASS | HTTP 200 | L6-CPMS-HTTP-015 |
| L6-CPMS-A-025 | UAT-02 | Version-1 saved content persists | PASS | Canonical DTO equality: True | L6-CPMS-HTTP-014, L6-CPMS-HTTP-015 |
| L6-CPMS-A-026 | UAT-02 | Initial feedback count | PASS | HTTP 200 | L6-CPMS-HTTP-016 |
| L6-CPMS-A-027 | UAT-02 | Supervisor appends feedback | PASS | HTTP 201 | L6-CPMS-HTTP-017 |
| L6-CPMS-A-028 | UAT-02 | Supervisor appends feedback | PASS | HTTP 201 | L6-CPMS-HTTP-018 |
| L6-CPMS-A-029 | UAT-02 | Supervisor reloads exact-version feedback | PASS | HTTP 200 | L6-CPMS-HTTP-019 |
| L6-CPMS-A-030 | UAT-02 | Student reads the same feedback | PASS | HTTP 200 | L6-CPMS-HTTP-020 |
| L6-CPMS-A-031 | UAT-02 | Two messages appended once in order for exact saved version | PASS | Matching lists: True; count=2 | L6-CPMS-HTTP-019, L6-CPMS-HTTP-020 |
| L6-CPMS-A-032 | UAT-03 | A1 duplicate first submission rejected | PASS | HTTP 409 / ALREADY_SUBMITTED | L6-CPMS-HTTP-021 |
| L6-CPMS-A-033 | UAT-03 | A2 duplicate first submission rejected | PASS | HTTP 409 / ALREADY_SUBMITTED | L6-CPMS-HTTP-022 |
| L6-CPMS-A-034 | UAT-03 | Read work after duplicate attempts | PASS | HTTP 200 | L6-CPMS-HTTP-023 |
| L6-CPMS-A-035 | UAT-03 | Duplicate attempts preserve one unchanged saved work | PASS | Count=1; unchanged=True | L6-CPMS-HTTP-023 |
| L6-CPMS-A-036 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-024 |
| L6-CPMS-A-037 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-025 |
| L6-CPMS-A-038 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-026 |
| L6-CPMS-A-039 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-027 |
| L6-CPMS-A-040 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-028 |
| L6-CPMS-A-041 | UAT-05 | SB foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-029 |
| L6-CPMS-A-042 | UAT-05 | SB own team list | PASS | HTTP 200 | L6-CPMS-HTTP-030 |
| L6-CPMS-A-043 | UAT-05 | SB list hides Team A | PASS | Team A absent: True | L6-CPMS-HTTP-030 |
| L6-CPMS-A-044 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-031 |
| L6-CPMS-A-045 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-032 |
| L6-CPMS-A-046 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-033 |
| L6-CPMS-A-047 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-034 |
| L6-CPMS-A-048 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-035 |
| L6-CPMS-A-049 | UAT-05 | B1 foreign resource denial | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-036 |
| L6-CPMS-A-050 | UAT-05 | B1 own team list | PASS | HTTP 200 | L6-CPMS-HTTP-037 |
| L6-CPMS-A-051 | UAT-05 | B1 list hides Team A | PASS | Team A absent: True | L6-CPMS-HTTP-037 |
| L6-CPMS-A-052 | UAT-05 | Authorized control after foreign reads | PASS | HTTP 200 | L6-CPMS-HTTP-038 |
| L6-CPMS-A-053 | UAT-05 | Authorized feedback control after foreign reads | PASS | HTTP 200 | L6-CPMS-HTTP-039 |
| L6-CPMS-A-054 | UAT-05 | Foreign requests preserve protected work and feedback | PASS | Canonical snapshots unchanged: True | L6-CPMS-HTTP-038, L6-CPMS-HTTP-039 |
| L6-CPMS-A-055 | UAT-06 | Create synthetic milestone | PASS | HTTP 201 | L6-CPMS-HTTP-040 |
| L6-CPMS-A-056 | UAT-06 | Count milestones before denied writes | PASS | HTTP 200 | L6-CPMS-HTTP-041 |
| L6-CPMS-A-057 | UAT-06 | Student cannot create milestones | PASS | HTTP 403 / FORBIDDEN | L6-CPMS-HTTP-042 |
| L6-CPMS-A-058 | UAT-06 | Whitespace-only milestone rejected | PASS | HTTP 400 / INVALID_INPUT | L6-CPMS-HTTP-043 |
| L6-CPMS-A-059 | UAT-06 | Count milestones after denied writes | PASS | HTTP 200 | L6-CPMS-HTTP-044 |
| L6-CPMS-A-060 | UAT-06 | Denied milestone writes do not alter saved list | PASS | Unchanged: True | L6-CPMS-HTTP-044 |
| L6-CPMS-A-061 | UAT-06 | Whitespace-only submission title rejected | PASS | HTTP 400 / INVALID_INPUT | L6-CPMS-HTTP-045 |
| L6-CPMS-A-062 | UAT-06 | Non-HTTP work link rejected | PASS | HTTP 400 / INVALID_INPUT | L6-CPMS-HTTP-046 |
| L6-CPMS-A-063 | UAT-06 | Read submissions after input rejection | PASS | HTTP 200 | L6-CPMS-HTTP-047 |
| L6-CPMS-A-064 | UAT-06 | Invalid submissions create no work | PASS | [] | L6-CPMS-HTTP-047 |
| L6-CPMS-A-065 | UAT-06 | Whitespace-only feedback rejected | PASS | HTTP 400 / INVALID_INPUT | L6-CPMS-HTTP-048 |
| L6-CPMS-A-066 | UAT-06 | Student cannot write supervisor feedback | PASS | HTTP 403 / FORBIDDEN | L6-CPMS-HTTP-049 |
| L6-CPMS-A-067 | UAT-06 | Read feedback after rejected writes | PASS | HTTP 200 | L6-CPMS-HTTP-050 |
| L6-CPMS-A-068 | UAT-06 | Rejected feedback does not append/change existing messages | PASS | Unchanged: True | L6-CPMS-HTTP-050 |
| L6-CPMS-A-069 | UAT-07 | Anonymous private read rejected | PASS | HTTP 401 / UNAUTHENTICATED | L6-CPMS-HTTP-051 |
| L6-CPMS-A-070 | UAT-07 | Single wrong-password attempt rejected | PASS | HTTP 401 / INVALID_CREDENTIALS | L6-CPMS-HTTP-052 |
| L6-CPMS-A-071 | UAT-07 | Failed sign-in creates no usable session | PASS | HTTP 401 / UNAUTHENTICATED | L6-CPMS-HTTP-053 |
| L6-CPMS-A-072 | UAT-07 | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-054 |
| L6-CPMS-A-073 | UAT-07 | Signed-out private read rejected | PASS | HTTP 401 / UNAUTHENTICATED | L6-CPMS-HTTP-055 |
| L6-CPMS-A-074 | UAT-07 | Revoked session replay rejected | PASS | HTTP 401 / UNAUTHENTICATED | L6-CPMS-HTTP-056 |
| L6-CPMS-A-075 | UAT-07 | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-057 |
| L6-CPMS-A-076 | UAT-07 | Same cookie jar switched to SB cannot read Team A | PASS | HTTP 404 / NOT_FOUND | L6-CPMS-HTTP-058 |
| L6-CPMS-A-077 | UAT-07 | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-059 |
| L6-CPMS-A-078 | UAT-08 | Authenticate supplied test alias | PASS | HTTP 200 | L6-CPMS-HTTP-060 |
| L6-CPMS-A-079 | UAT-08 | Student rereads work after logout and relogin | PASS | HTTP 200 | L6-CPMS-HTTP-061 |
| L6-CPMS-A-080 | UAT-08 | Student rereads exact-version feedback after relogin | PASS | HTTP 200 | L6-CPMS-HTTP-062 |
| L6-CPMS-A-081 | UAT-08 | Second team student reads shared saved work | PASS | HTTP 200 | L6-CPMS-HTTP-063 |
| L6-CPMS-A-082 | UAT-08 | Supervisor independently rereads saved work | PASS | HTTP 200 | L6-CPMS-HTTP-064 |
| L6-CPMS-A-083 | UAT-08 | Work and feedback survive new session and role reads | PASS | All canonical snapshots unchanged: True | L6-CPMS-HTTP-061, L6-CPMS-HTTP-062, L6-CPMS-HTTP-063, L6-CPMS-HTTP-064 |
| L6-CPMS-A-084 | UAT-04 | Fresh server clock after deadline | PASS | HTTP 200 | L6-CPMS-HTTP-065 |
| L6-CPMS-A-085 | UAT-04 | Fresh server time is beyond saved deadline plus 60 seconds | PASS | 2026-11-13 12:54:05.954000+00:00 >= 2026-11-13 12:54:00+00:00 | L6-CPMS-HTTP-065 |
| L6-CPMS-A-086 | UAT-04 | Late first submission rejected | PASS | HTTP 409 / DEADLINE_PASSED | L6-CPMS-HTTP-066 |
| L6-CPMS-A-087 | UAT-04 | Authorized read after late rejection | PASS | HTTP 200 | L6-CPMS-HTTP-067 |
| L6-CPMS-A-088 | UAT-04 | Late rejection creates no work | PASS | [] | L6-CPMS-HTTP-067 |
| L6-CPMS-A-089 | READINESS | End-of-run serving source check | PASS | HTTP 200 | L6-CPMS-HTTP-068 |
| L6-CPMS-A-090 | READINESS | Serving source unchanged at completion | PASS | 8e637e537cd037d630a5fffc1b5672d1b44371a8 | L6-CPMS-HTTP-068 |
| L6-CPMS-A-091 | READINESS | End-of-run serving source check | PASS | HTTP 200 | L6-CPMS-HTTP-069 |
| L6-CPMS-A-092 | READINESS | Serving source unchanged at completion | PASS | 8e637e537cd037d630a5fffc1b5672d1b44371a8 | L6-CPMS-HTTP-069 |
| L6-CPMS-A-093 | CLEANUP | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-070 |
| L6-CPMS-A-094 | CLEANUP | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-071 |
| L6-CPMS-A-095 | CLEANUP | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-072 |
| L6-CPMS-A-096 | CLEANUP | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-073 |
| L6-CPMS-A-097 | CLEANUP | Sign out temporary API session | PASS | HTTP 204 | L6-CPMS-HTTP-074 |

## HTTP evidence inventory

| Evidence ID | Case / alias | Actual start UTC | Request | Observed response |
| --- | --- | --- | --- | --- |
| L6-CPMS-HTTP-001 | READINESS / ANONYMOUS | 2026-11-13T12:47:06.684716+00:00 | GET /api/health | HTTP 200 |
| L6-CPMS-HTTP-002 | READINESS / ANONYMOUS | 2026-11-13T12:47:06.802985+00:00 | GET /api/ready | HTTP 200 |
| L6-CPMS-HTTP-003 | SETUP / SA | 2026-11-13T12:47:06.962292+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-004 | SETUP / A1 | 2026-11-13T12:47:07.158599+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-005 | SETUP / A2 | 2026-11-13T12:47:07.332412+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-006 | SETUP / SB | 2026-11-13T12:47:07.544174+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-007 | SETUP / B1 | 2026-11-13T12:47:07.751891+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-008 | UAT-01 / SA | 2026-11-13T12:47:07.950597+00:00 | GET /api/teams | HTTP 200 |
| L6-CPMS-HTTP-009 | UAT-01 / A1 | 2026-11-13T12:47:08.079548+00:00 | GET /api/teams | HTTP 200 |
| L6-CPMS-HTTP-010 | UAT-04 / SA | 2026-11-13T12:47:08.182861+00:00 | POST /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 201 |
| L6-CPMS-HTTP-011 | UAT-01 / SA | 2026-11-13T12:47:08.314252+00:00 | POST /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 201 |
| L6-CPMS-HTTP-012 | UAT-01 / A1 | 2026-11-13T12:47:08.443466+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3 | HTTP 200 |
| L6-CPMS-HTTP-013 | UAT-01 / SA | 2026-11-13T12:47:08.579206+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 200 |
| L6-CPMS-HTTP-014 | UAT-02 / A1 | 2026-11-13T12:47:08.722722+00:00 | POST /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 201 |
| L6-CPMS-HTTP-015 | UAT-02 / A1 | 2026-11-13T12:47:08.848129+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 200 |
| L6-CPMS-HTTP-016 | UAT-02 / A1 | 2026-11-13T12:47:09.203956+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-017 | UAT-02 / SA | 2026-11-13T12:47:09.342873+00:00 | POST /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 201 |
| L6-CPMS-HTTP-018 | UAT-02 / SA | 2026-11-13T12:47:09.467183+00:00 | POST /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 201 |
| L6-CPMS-HTTP-019 | UAT-02 / SA | 2026-11-13T12:47:09.611474+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-020 | UAT-02 / A1 | 2026-11-13T12:47:09.714048+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-021 | UAT-03 / A1 | 2026-11-13T12:47:09.843571+00:00 | POST /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 409 |
| L6-CPMS-HTTP-022 | UAT-03 / A2 | 2026-11-13T12:47:09.961336+00:00 | POST /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 409 |
| L6-CPMS-HTTP-023 | UAT-03 / A1 | 2026-11-13T12:47:10.106155+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 200 |
| L6-CPMS-HTTP-024 | UAT-05 / SB | 2026-11-13T12:47:10.236791+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded | HTTP 404 |
| L6-CPMS-HTTP-025 | UAT-05 / SB | 2026-11-13T12:47:10.367218+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 404 |
| L6-CPMS-HTTP-026 | UAT-05 / SB | 2026-11-13T12:47:10.464300+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3 | HTTP 404 |
| L6-CPMS-HTTP-027 | UAT-05 / SB | 2026-11-13T12:47:10.568450+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 404 |
| L6-CPMS-HTTP-028 | UAT-05 / SB | 2026-11-13T12:47:10.690694+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 404 |
| L6-CPMS-HTTP-029 | UAT-05 / SB | 2026-11-13T12:47:10.819313+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 404 |
| L6-CPMS-HTTP-030 | UAT-05 / SB | 2026-11-13T12:47:10.968411+00:00 | GET /api/teams | HTTP 200 |
| L6-CPMS-HTTP-031 | UAT-05 / B1 | 2026-11-13T12:47:11.099713+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded | HTTP 404 |
| L6-CPMS-HTTP-032 | UAT-05 / B1 | 2026-11-13T12:47:11.221933+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 404 |
| L6-CPMS-HTTP-033 | UAT-05 / B1 | 2026-11-13T12:47:11.337950+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3 | HTTP 404 |
| L6-CPMS-HTTP-034 | UAT-05 / B1 | 2026-11-13T12:47:11.463477+00:00 | GET /api/milestones/646bf021-20f6-49e0-9296-7b6da18556f3/submissions | HTTP 404 |
| L6-CPMS-HTTP-035 | UAT-05 / B1 | 2026-11-13T12:47:11.583632+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 404 |
| L6-CPMS-HTTP-036 | UAT-05 / B1 | 2026-11-13T12:47:11.706549+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 404 |
| L6-CPMS-HTTP-037 | UAT-05 / B1 | 2026-11-13T12:47:12.037081+00:00 | GET /api/teams | HTTP 200 |
| L6-CPMS-HTTP-038 | UAT-05 / SA | 2026-11-13T12:47:12.138550+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 200 |
| L6-CPMS-HTTP-039 | UAT-05 / SA | 2026-11-13T12:47:12.243296+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-040 | UAT-06 / SA | 2026-11-13T12:47:12.369376+00:00 | POST /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 201 |
| L6-CPMS-HTTP-041 | UAT-06 / SA | 2026-11-13T12:47:12.478776+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 200 |
| L6-CPMS-HTTP-042 | UAT-06 / A1 | 2026-11-13T12:47:12.607997+00:00 | POST /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 403 |
| L6-CPMS-HTTP-043 | UAT-06 / SA | 2026-11-13T12:47:12.697857+00:00 | POST /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 400 |
| L6-CPMS-HTTP-044 | UAT-06 / SA | 2026-11-13T12:47:12.809400+00:00 | GET /api/teams/7c600ee0-a595-4c52-a093-f0ed5e08fded/milestones | HTTP 200 |
| L6-CPMS-HTTP-045 | UAT-06 / A1 | 2026-11-13T12:47:12.938396+00:00 | POST /api/milestones/e2b312f8-8311-40c4-a394-ff52630a3fad/submissions | HTTP 400 |
| L6-CPMS-HTTP-046 | UAT-06 / A1 | 2026-11-13T12:47:13.237025+00:00 | POST /api/milestones/e2b312f8-8311-40c4-a394-ff52630a3fad/submissions | HTTP 400 |
| L6-CPMS-HTTP-047 | UAT-06 / A1 | 2026-11-13T12:47:13.339471+00:00 | GET /api/milestones/e2b312f8-8311-40c4-a394-ff52630a3fad/submissions | HTTP 200 |
| L6-CPMS-HTTP-048 | UAT-06 / SA | 2026-11-13T12:47:13.469580+00:00 | POST /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 400 |
| L6-CPMS-HTTP-049 | UAT-06 / A1 | 2026-11-13T12:47:13.584300+00:00 | POST /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 403 |
| L6-CPMS-HTTP-050 | UAT-06 / SA | 2026-11-13T12:47:13.693990+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-051 | UAT-07 / ANONYMOUS | 2026-11-13T12:47:13.826125+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 401 |
| L6-CPMS-HTTP-052 | UAT-07 / ANONYMOUS | 2026-11-13T12:47:13.937326+00:00 | POST /api/auth/login | HTTP 401 |
| L6-CPMS-HTTP-053 | UAT-07 / ANONYMOUS | 2026-11-13T12:47:14.115798+00:00 | GET /api/auth/me | HTTP 401 |
| L6-CPMS-HTTP-054 | UAT-07 / A1 | 2026-11-13T12:47:14.223760+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-055 | UAT-07 / A1 | 2026-11-13T12:47:14.328232+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 401 |
| L6-CPMS-HTTP-056 | UAT-07 / REVOKED_SESSION | 2026-11-13T12:47:14.438991+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 401 |
| L6-CPMS-HTTP-057 | UAT-07 / A1 | 2026-11-13T12:47:14.532420+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-058 | UAT-07 / A1 | 2026-11-13T12:47:14.714273+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 404 |
| L6-CPMS-HTTP-059 | UAT-07 / A1 | 2026-11-13T12:47:14.834116+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-060 | UAT-08 / A1 | 2026-11-13T12:47:14.945881+00:00 | POST /api/auth/login | HTTP 200 |
| L6-CPMS-HTTP-061 | UAT-08 / A1 | 2026-11-13T12:47:15.154408+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 200 |
| L6-CPMS-HTTP-062 | UAT-08 / A1 | 2026-11-13T12:47:15.280243+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c/feedback | HTTP 200 |
| L6-CPMS-HTTP-063 | UAT-08 / A2 | 2026-11-13T12:47:15.464170+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 200 |
| L6-CPMS-HTTP-064 | UAT-08 / SA | 2026-11-13T12:47:15.616817+00:00 | GET /api/submissions/7e290379-cb6c-40e4-a22f-1f2073e3fe6c | HTTP 200 |
| L6-CPMS-HTTP-065 | UAT-04 / A1 | 2026-11-13T12:54:05.762127+00:00 | GET /api/milestones/b001b3df-25cf-4073-b418-d8fabf9b0c8c | HTTP 200 |
| L6-CPMS-HTTP-066 | UAT-04 / A1 | 2026-11-13T12:54:05.958862+00:00 | POST /api/milestones/b001b3df-25cf-4073-b418-d8fabf9b0c8c/submissions | HTTP 409 |
| L6-CPMS-HTTP-067 | UAT-04 / A1 | 2026-11-13T12:54:06.121691+00:00 | GET /api/milestones/b001b3df-25cf-4073-b418-d8fabf9b0c8c/submissions | HTTP 200 |
| L6-CPMS-HTTP-068 | READINESS / ANONYMOUS | 2026-11-13T12:54:06.255107+00:00 | GET /api/health | HTTP 200 |
| L6-CPMS-HTTP-069 | READINESS / ANONYMOUS | 2026-11-13T12:54:06.360849+00:00 | GET /api/ready | HTTP 200 |
| L6-CPMS-HTTP-070 | CLEANUP / SA | 2026-11-13T12:54:06.453722+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-071 | CLEANUP / A1 | 2026-11-13T12:54:06.568706+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-072 | CLEANUP / A2 | 2026-11-13T12:54:06.684992+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-073 | CLEANUP / SB | 2026-11-13T12:54:06.788967+00:00 | POST /api/auth/logout | HTTP 204 |
| L6-CPMS-HTTP-074 | CLEANUP / B1 | 2026-11-13T12:54:06.906760+00:00 | POST /api/auth/logout | HTTP 204 |

## Findings and acceptance

No confirmed fastTrack product defect is established by the completed main-run assertions. The stopped setup attempt used an invalid timestamp and is retained as a runner error; it must not be reported as a natural application defect. Remaining full UI/human/revision-confirmation work prevents an independent acceptance sign-off. Final decision: PENDING. The imported CoursePMS findings belong to the opposite testing direction and are described separately.


## Browser and post-UI controls

The [actual browser observations](05-browser-observations.md) contain 11 captured observations and original screenshots. These cover saved normal work/feedback, rejection and access paths. They supplement API execution and do not establish personal student participation. The [post-UI ledger](evidence/post-ui-state-controls.json) records seven additional passing assertions and zero failures, separately counted. Temporary API and browser sessions were signed out; the final private URL displayed an empty sign-in form.
