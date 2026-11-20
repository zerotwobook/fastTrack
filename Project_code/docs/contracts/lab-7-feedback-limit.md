# Lab 7 feedback length maintenance contract

**Change:** CR-L7-01, F-04. **Contract revision:** 2, with peer review pending. **Owner:** A for impact and RED ([#24](https://github.com/zerotwobook/fastTrack/issues/24)). B reviews the contract and owns the implementation and GREEN evidence ([#25](https://github.com/zerotwobook/fastTrack/issues/25)).

## Approval and baseline

On 20 November 2026 (Asia/Bangkok), A supplied a screenshot in the project conversation showing the TA's approval. The approved request raises the limit for feedback written by the assigned supervisor from **4,000 to 6,000 Unicode code points after trimming leading and trailing whitespace**. The TA asked for explicit tests at 5,999, 6,000, and 6,001, including emoji and whitespace. This is an English paraphrase of the supplied approval. The screenshot displays 10:48 AM and has no visible date. Use the original screenshot as approval evidence in the course report.

The [Sprint 1 feedback contract](sprint-1-feedback.md) documents the accepted 4,000-point behavior. The legacy `v1.0.0-sprint-1` tag resolves to `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8`. The accepted Lab 6 deployment reference is `main@8e637e537cd037d630a5fffc1b5672d1b44371a8`. Read-only health/readiness checks confirmed that source was live on 20 November. The pre-change test source is `staging/sprint-2@63e81d1a91f7f288825100b47786823460943e5c`. The shared feedback validator, feedback form, Prisma schema, and migration files match the deployed reference in a Git comparison. [Independent live readback](https://github.com/zerotwobook/fastTrack/issues/16#issuecomment-6827274410) · [Baseline staging CI](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612)

The verified delivery scope of #16 supports the local RED stage. The broader issue remains open for its separate closeout.

## Contract and impact

| Area | Current behavior and approved delta |
| --- | --- |
| SRS and business rules | [FR-05, BR-07, BR-08 and NFR-02–06](../../../Project_doc/project_detail.md) trace to F-04. BR-08's feedback length becomes 1–6,000 after trim. Other title, description and URL limits retain their current values. |
| Feature SDS and UI | The [existing F-04 contract](sprint-1-feedback.md) remains the baseline for roles, workflow and form recovery. [FeedbackPanel](../../client/src/features/feedback/FeedbackPanel.tsx) must show 6,000 and use the same shared counting rule for its text, counter and validation. A Unicode code point may take two UTF-16 code units. A multi-code-point emoji sequence counts by its constituent points. |
| API and request size | `POST /api/submissions/:id/feedback` still accepts `{content, clientRequestId}` and returns 201 for a new valid entry. Counts apply to decoded, trimmed text. An invalid length returns 400 `INVALID_INPUT` with a content field error and writes no row. The current [64 KiB JSON parser](../../server/src/http/errors.ts) admits ordinary UTF-8 at the new boundary but can reject valid JSON whose astral characters are fully escaped into surrogate pairs, since 6,000 points may require about 72 KB before field overhead. Review a bounded feedback-route parser allowance if needed. Preserve guard order and the existing shared transport cap for other routes. |
| Persistence and System-Level SDS | Update [Prisma](../../server/prisma/schema.prisma) and add a new forward migration widening only `feedback.content` and its `feedback_content_bounds` check to 6,000. Preserve the minimum, trim semantics, existing rows, IDs, timestamps, exact `submissionId` foreign key, uniqueness, indexes and migration history. A disposable upgrade must verify the legacy records and new maximum. |
| Cross-feature rules | Assigned-supervisor write access, team-scoped reads, CSRF, append-only version binding, ordering and request-key replay/conflict behavior stay as specified. Revision history, deadline rules, progress formula and feedback-count projection retain their existing behavior. Feedback remains exact-version content rather than a grade. |

## Acceptance criteria and test specification

| Acceptance criterion | Test case | Expected outcome |
| --- | --- | --- |
| L7-AC-01. Accept the new trimmed boundary with consistent counting. | L7-STS-01. HTTP, PostgreSQL and shared validation. Submit plain text, single-point astral emoji, and text padded with leading/trailing whitespace with an interior space, each at 5,999 and 6,000. | API 201, exact trimmed text returned and stored, and same content available through the authorized GET. The browser count matches. Interior whitespace counts. |
| L7-AC-02. Reject invalid content with no write. | L7-STS-02. Repeat the three forms at 6,001. Recheck empty/whitespace-only, NUL and unpaired surrogates. | 400 with a content error and no feedback row. The browser prevents saving an invalid draft and provides the field error. |
| L7-AC-03. Support the bound across transport and persistence. | L7-STS-03. Submit 6,000 astral points as escaped JSON. Check a direct DB write at 6,000. During GREEN, upgrade seeded pre-change data, read back original rows and verify the new SQL bound. | The valid request reaches domain validation and persists the same decoded text. The widened schema accepts 6,000 and protects the upper bound. Existing feedback IDs and version associations survive. |
| L7-AC-04. Preserve original permissions, history, and retry semantics. | L7-STS-04. Rerun real-session, CSRF, replay and exact-version suites. Include a valid long payload for a foreign supervisor or unauthorized actor in release regression. | No foreign reads/writes, no duplicate on replay, and no transfer of feedback to a newer version. |
| L7-AC-05. Verify the released behavior. | L7-STS-05. Browser check of the actual deployed candidate at 5,999, 6,000 and 6,001 with emoji/whitespace, and one Sprint 1 authorization/persistence journey. | Record URL, immutable commit or tag, CI and deployment revision, fixture, expected/actual outcome, and failures/skips. |

## Handoff and evidence

Keep the RED test inputs and expectations fixed as B implements GREEN on the same maintenance branch and PR. Record exact tested SHAs, commands and case results. The older over-limit regression cases that assert that 4,001 is too long must be updated during GREEN to test 6,001. Continue testing 4,000 as a compatibility control. Retain the pre-change RED record.

Track five date-bounded metrics with actual source IDs. A compiles completed issues, merged PRs and tests for the selected run. B compiles UAT defect disposition and CI outcomes. Record the interpretation in at most 100 words, an evidence-backed readiness decision, and the retrospective in the Lab 7 report. Deployment and report submission remain separate from the RED evidence. [Lab 7 summary](../../../lab_file/Lab7/LAB7_SUMMARY.md) · [Main release gate](../../../workflow/MAIN_RELEASE_GATE.md)
