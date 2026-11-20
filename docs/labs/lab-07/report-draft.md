# CPE334 Lab 7 Software Maintenance, Metrics, and Release Readiness

**fastTrack** · InfaCompany · EN-028 · Section 31 · Semester 1/2026

| Field | Value |
| --- | --- |
| Topic and theme | Theme 6. fastTrack tracks team milestones, submissions, and supervisor feedback. |
| Member A | Supapanya Yathip · 67070503443 · [zerotwobook](https://github.com/zerotwobook) |
| Member B | Atip Infa-udom · 67070503446 · [Atip-Infa](https://github.com/Atip-Infa) |
| Repository | [zerotwobook/fastTrack](https://github.com/zerotwobook/fastTrack) |
| Application | [fastTrack on Cloud Run](https://fasttrack-app-kpx7au3w2a-as.a.run.app) |
| Submission | One Lab 7 team report in LEB2 by 29 November 2026 at 23:59 Asia/Bangkok. |
| Evidence snapshot | 20 November 2026. Times in the evidence tables are UTC unless stated otherwise. |

Team and theme details match the [Lab 5 team record](../lab-05/report.md#answer-part-0-team-and-evidence-index). The assessment requirements come from the [Lab 7 handout](../../../lab_file/Lab7/Lab_7_Sprint_1_Maintenance.pdf).

## Contents

| Part | Section | Evidence IDs |
| --- | --- | --- |
| A | [Change impact and updated contract](#part-a-change-impact-and-updated-contract) | L7-A01, L7-A02, L7-AC-01 to L7-AC-05 |
| B | [Implementation and regression-safe delivery](#part-b-implementation-and-regression-safe-delivery) | L7-B01 to L7-B05, L7-STS-01 to L7-STS-05 |
| C | [Objective engineering metrics](#part-c-objective-engineering-metrics) | L7-M01 to L7-M05 |
| D | [Release readiness and retrospective](#part-d-release-readiness-and-retrospective) | L7-D01, L7-D02 |

Add page ranges after final PDF layout.

## Version record

| Role | Version | Evidence |
| --- | --- | --- |
| Accepted Sprint 1 tag | `v1.0.0-sprint-1` at `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` | [Tag](https://github.com/zerotwobook/fastTrack/tree/v1.0.0-sprint-1) |
| Accepted deployed behavior reference | `main@8e637e537cd037d630a5fffc1b5672d1b44371a8`, last recorded Cloud Run revision `fasttrack-app-00003-rc7` | [Lab 6 closeout](../lab-06/sessions/2026-11-19-lab6-closeout.md) · [Recorded revision and UTC preflight](https://github.com/zerotwobook/fastTrack/issues/26) |
| Actual pre-change implementation | `staging/sprint-2@63e81d1a91f7f288825100b47786823460943e5c` | [Baseline CI 44663918612](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612) |
| RED test source | `e3758fb541e48716545868c6f435907b83a67aec` | [RED CI 44672187909](https://github.com/zerotwobook/fastTrack/actions/runs/44672187909) · [Local result](../../../Project_code/docs/evidence/R2-A05-lab7-red-results.json) |
| GREEN implementation and staging integration | `2368d71813541bacc0bc9b9ecba58b3ae9ea7c86` → approved merge `7357fd2f3e172120af39e32a1ed4fd1284844aa0` | [PR #128](https://github.com/zerotwobook/fastTrack/pull/128) · [Exact-head CI 44679245716](https://github.com/zerotwobook/fastTrack/actions/runs/44679245716) |
| Sprint 2 candidate at snapshot | `1185f3ffc3954a18dd883e451767dc6ad8a3ee6f` → `main@8e637e537cd037d630a5fffc1b5672d1b44371a8` | [Draft PR #129](https://github.com/zerotwobook/fastTrack/pull/129) · [Candidate CI 44697610558](https://github.com/zerotwobook/fastTrack/actions/runs/44697610558) |
| Submitted Lab 7 main commit or tag and serving revision | Pending authorized release and deployment. | [G6 release record](https://github.com/zerotwobook/fastTrack/issues/26) |

The baseline `63e81d1` includes intervening Sprint 2 planning, revisions, progress, and integration work. The feedback validator, form, Prisma schema, and migrations matched the deployed rule in the pre-change comparison. The RED commit added the revised contract and test cases. The staging merge packages the reviewed maintenance alongside Sprint 2, and the later [PR #131](https://github.com/zerotwobook/fastTrack/pull/131) contributes UI work to the current candidate. Compare the final main merge SHA and image digests with Cloud Run in L7-B05. [Pre-change comparison and RED evidence](../../../Project_code/docs/evidence/R2-A05-lab7-red.md)

## Part A. Change impact and updated contract

### L7-A01 Approved change request

**CR-L7-01, F-04.** The implemented Sprint 1 rule permitted the assigned supervisor to save 1–4,000 Unicode code points of feedback after trimming outer whitespace. The approved revision permits **1–6,000 Unicode code points after the same trim** so supervisors can include more detailed guidance. Interior whitespace counts. A single astral emoji counts as one code point and a compound emoji counts by its constituent code points. Empty or whitespace-only content, NUL and unpaired surrogate characters are invalid. A 6,001-point input receives a content error and produces zero rows. Existing access checks and the link to the exact submission version still apply.

**Approval record.** The course TA accepted the request in chat and asked the team to verify **5,999, 6,000 and 6,001**, including emoji and surrounding whitespace. A supplied the approval screenshot on 20 November 2026, Asia/Bangkok. The image shows 10:48 AM. The visible crop leaves the approver's name and calendar date unconfirmed. Insert the original screenshot from the team conversation in the final report under L7-A01. [Approved change record](https://github.com/zerotwobook/fastTrack/issues/24) · [Approval transcription and limitations](../../../Project_code/docs/contracts/lab-7-feedback-limit.md#approval-and-baseline)

### L7-A02 Contract and impact trace

| Requirement and design source | Change and affected module | Acceptance and tests |
| --- | --- | --- |
| FR-05, BR-08 · F-04 · SRS and feedback input validation | Replace the 4,000-point maximum with 6,000 after trim in [shared feedback validation](../../../Project_code/shared/feedback.mjs). The existing minimum and rules for title, description and work-link fields still apply. | L7-AC-01 and 02 · L7-STS-01 and 02 |
| FR-05, NFR-05 · F-04 Feature SDS | The [Feedback panel](../../../Project_code/client/src/features/feedback/FeedbackPanel.tsx) uses the shared counter and limit. Render the saved body with its exact version. | L7-AC-01 and 02 · L7-STS-01, 02 and 05 |
| FR-05, BR-07, NFR-02 · F-04 API and authorization | The [feedback router](../../../Project_code/server/src/modules/feedback/router.ts) accepts `{content, clientRequestId}`. Apply the bounded feedback POST parser after session, supervisor, source/CSRF and JSON checks. Assigned supervisors write. Authorized team members read. | L7-AC-03 and 04 · L7-STS-03 and 04 |
| BR-07, BR-08, NFR-03 · System-Level SDS and persistence | [Prisma schema](../../../Project_code/server/prisma/schema.prisma) and the [forward migration](../../../Project_code/server/prisma/migrations/20261120042000_lab7_feedback_content_6000/migration.sql) widen the column and named bounds check. Existing IDs, times, uniqueness, indexes and the submission foreign key carry forward. | L7-AC-03 and 04 · L7-STS-03 and 04 |
| FR-05, BR-07 · F-04 with submission history | Exact-version feedback, replay handling and team scope remain the regression targets. Deadline and progress calculations are outside the approved rule because the change only concerns feedback body length. | L7-AC-04 and 05 · L7-STS-04 and 05 |

Design sources are the [project SRS and SDS](../../../Project_doc/project_detail.md), the [original Sprint 1 F-04 contract](../../../Project_code/docs/contracts/sprint-1-feedback.md), and the [versioned Lab 7 contract and STS](../../../Project_code/docs/contracts/lab-7-feedback-limit.md). The Lab 7 contract records the revised requirements in relation to those baselines.

| AC / STS | Preconditions and input | Expected behavior |
| --- | --- | --- |
| L7-AC-01 / L7-STS-01 | Assigned supervisor and a saved submission. Plain text, astral emoji and outer-whitespace forms at 5,999 and 6,000 points after trim. | New feedback returns 201. The counter, stored text and authorized readback agree. |
| L7-AC-02 / L7-STS-02 | Same fixture at 6,001 points and invalid empty, NUL or unpaired-surrogate controls. | Validation identifies the content field. HTTP 400 `INVALID_INPUT` when the request reaches the API, with zero new rows. |
| L7-AC-03 / L7-STS-03 | A valid 6,000-point payload represented by escaped surrogate pairs. Direct SQL boundary and seeded upgrade checks. | Transport admits the valid input. SQL admits 6,000, rejects overflow, and preserves the seeded rows and links on upgrade. |
| L7-AC-04 / L7-STS-04 | Assigned and foreign supervisors, students, repeated request keys, and v1/v2 history. | Foreign scope and forbidden writes are denied. Same-input replay returns the same record. Conflicting key reuse fails. v1 feedback remains on v1. |
| L7-AC-05 / L7-STS-05 | Authorized deployed candidate and synthetic team, roles and submission versions. | Browser/API boundary results and the preserved access/persistence journey are recorded against the serving revision. |

**Pre-implementation review sequence.** A committed the contract and STS at `b46b7de` at 04:04:04, then committed the RED cases at `e3758fb` at 04:06:31. B recorded review of the contract and RED baseline at 04:17:00 before checking out the handoff at 04:19:20. B committed the implementation at `2368d71` at 04:40:02. [B's review checkpoint](https://github.com/zerotwobook/fastTrack/issues/25) · [PR commit timeline](https://github.com/zerotwobook/fastTrack/pull/128/commits)

## Part B. Implementation and regression-safe delivery

### L7-B01 RED on the old rule

From `Project_code/`, run `npm run test:b02:isolated` on the tested source. The runner started disposable PostgreSQL 16.8, created an actual student submission and authenticated its assigned supervisor. The test compared HTTP status, exact trimmed content, stored author/submission identity, and student readback. The local run on 20 November ran from 04:06:48 to 04:08:43 and exited 1. The feedback suite returned **51 passed and eight expected failures**, with its 48 existing cases passing. GitHub CI reproduced the same feedback counts. [A's recorded RED run](../../../Project_code/docs/evidence/R2-A05-lab7-red.md) · [Machine-readable local output](../../../Project_code/docs/evidence/R2-A05-lab7-red-results.json)

| Assertion | Expected | RED output or control |
| --- | --- | --- |
| 5,999 and 6,000 in three shapes | 201, saved and readable | Six failures. `Feedback content cannot exceed 4000 characters.` Expected 400 to be 201. |
| 6,001 in three shapes | 400 and zero inserts | Three rejection controls passed. |
| 6,000 escaped astral emoji | 201 and stored decoded string | One failure. `Provide a valid JSON body within the size limit.` Expected 400 to be 201. |
| Direct database write at 6,000 | Exact 6,000-point readback | One failure. `The provided value for the column is too long for the column's type.` |

Selected lines from the [boundary tests](../../../Project_code/server/src/testing/feedback-review.b02.ts) show persistence and authorized readback checks.

~~~ts
expect(response.status, 'Expected feedback to be saved. API error: ' + JSON.stringify(response.body.error)).toBe(201);
const saved = response.body.data;
const row = await prisma.feedback.findUniqueOrThrow({ where: { id: saved.id } });
expect(row).toMatchObject({ content: expected, submissionId: id, supervisorId: fixtures.users.supA.id });
expect(saved.content).toBe(expected);
const student = await login('stu-a1@test.local');
expect((await get(id, student).expect(200)).body.data).toEqual([saved]);
~~~

### L7-B02 GREEN change and migration

B updated the shared bound and made it the feedback form's source for the live count, hint and checks. The route's strict JSON parser admits up to 96 KiB for feedback POST only. This supports valid 6,000-point astral input represented by JSON surrogate escapes while the shared 64 KiB cap remains on other routes. The forward migration widens only `feedback.content` and `feedback_content_bounds`. Old overflow assertions now test 6,001 and the 4,000 acceptance control remains.

| Selected diff | Before | After |
| --- | --- | --- |
| `FEEDBACK_LIMITS.CONTENT_MAX_CHARS` | `4000` | `6000` |
| Feedback POST body parser | Shared `64kb` | `express.json({ limit: '96kb', strict: true })` after the existing guards |
| `Feedback.content` and SQL check | `VarChar(4000)`, `BETWEEN 1 AND 4000` | `VarChar(6000)`, `BETWEEN 1 AND 6000` after the existing SQL trim |
| Regression overflow fixture | 4,001 rejected | 6,001 rejected and 4,000 accepted |

The seeded PostgreSQL 14.23 upgrade kept two existing feedback rows byte-for-byte and preserved their v1 associations with v2 present. A direct insert of 6,000 astral emoji succeeded and SQL rejected 6,001. A disposable compiled-app Chromium session separately verified 5,999 and 6,000, the 6,001 field error with zero new rows, and v1/v2 separation through student readback. [Implementation diff](https://github.com/zerotwobook/fastTrack/commit/2368d71813541bacc0bc9b9ecba58b3ae9ea7c86) · [B's GREEN execution and upgrade evidence](../../../Project_code/docs/evidence/R2-B05-lab7-green.md)

### L7-B03 Regression and exact candidate

The GREEN run `44675948834` used `npm run test:runtime:isolated` on GitHub Actions with PostgreSQL 16.8. The approved PR head `5315c9e` passed run `44679245716`. Candidate push run `44697610558`, on `1185f3f`, retained the following counts. The `ci-runtime-report` artifact for this push provides the run's case outcomes and verifies the zero skipped count below.

| Suite | Coverage relevant to the change | Passed | Failed | Skipped |
| --- | --- | ---: | ---: | ---: |
| `test` | Core unit/API, including feedback input handling | 198 | 0 | 0 |
| `test:g1` | Schema bounds, migrations and persistence | 38 | 0 | 0 |
| `test:auth` | Session, scope and source protection | 46 | 0 | 0 |
| `test:b01` | Milestone domain and access behavior | 48 | 0 | 0 |
| `test:a02` | Submission domain, authorization and deadlines | 54 | 0 | 0 |
| `test:b02` | Feedback boundaries, authentication, replay and version retention | 61 | 0 | 0 |
| `test:j03` | Compiled end-to-end Sprint 1 journey | 1 | 0 | 0 |
| `test:runtime` | Isolated runtime and database behavior | 12 | 0 | 0 |
| **Total** | | **458** | **0** | **0** |

All seven legacy upgrade scenarios passed. Typecheck, production build and both CI image builds passed. The release candidate feedback tests confirmed foreign supervisor denial (404), student write denial (403), same-input replay (200), conflict on reuse with different content (409), and version retention. [GREEN CI](https://github.com/zerotwobook/fastTrack/actions/runs/44675948834) · [Candidate CI and artifact](https://github.com/zerotwobook/fastTrack/actions/runs/44697610558)

### L7-B04 Peer review and staging integration

A reviewed the implementation and tightened the parser-boundary test at `d2b6c16`. It checks independent padding against both route limits. B approved the exact PR head `5315c9e` at 05:17:13 after required CI success. PR #128 merged to `staging/sprint-2` at 05:18:43 as `7357fd2`. [A's review amendment](https://github.com/zerotwobook/fastTrack/commit/d2b6c16a9d25d8c44724d323eabbc2b63a4be36c) · [Reviewed and merged PR](https://github.com/zerotwobook/fastTrack/pull/128)

### L7-B05 Deployed verification record

At the report snapshot, the public `/api/health` and `/api/ready` readbacks still reported `8e637e5`, with `database=connected`. Draft PR #129 contains the approved maintenance on staging. Main authorization, the deployed Lab 7 revision and the following live checks are pending. [Release PR #129](https://github.com/zerotwobook/fastTrack/pull/129) · [Release authorization procedure](../../../workflow/MAIN_RELEASE_GATE.md)

| L7-STS-05 check | Expected deployed evidence | Actual at snapshot | Owner |
| --- | --- | --- | --- |
| Release identity and smoke | Main merge SHA, image digests, migration result, serving Cloud Run revision, traffic, health and readiness agree. | Previous main reachable. Lab 7 release verification pending. | B records deployment, A cross-checks. |
| 5,999 and 6,000 with emoji and surrounding whitespace | Assigned supervisor saves. Counter reflects trimmed code points, saved text reads back in the exact version, and student can read it. | Pending deploy. Disposable preview results are in L7-B02. | A executes, B cross-checks. |
| 6,001 with emoji and surrounding whitespace | Browser shows the content error. The authenticated API returns 400 `INVALID_INPUT` and a readback confirms zero new rows. | Pending deploy. | A executes, B cross-checks. |
| Preserved Sprint 1 domain and access | Original saved work and v1 feedback remain readable to the assigned team after migration. The foreign supervisor receives generic 404. Saved feedback on v1 stays on v1 with v2 present. | Pending deploy. The accepted Sprint 1 UAT baseline is in L7-M04. | A and B cross-check. |

For the final report, use synthetic submissions and record the time, public URL, main SHA, serving revision, actor, expected and actual outcome for each check.
