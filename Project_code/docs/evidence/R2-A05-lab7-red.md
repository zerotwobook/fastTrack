# Lab 7 A-side RED evidence and handoff

[Issue #24](https://github.com/zerotwobook/fastTrack/issues/24) · [Issue #25](https://github.com/zerotwobook/fastTrack/issues/25) · [Draft PR #128](https://github.com/zerotwobook/fastTrack/pull/128)

## Versions and approval

- Accepted deployed Sprint 1 behavior reference: `8e637e537cd037d630a5fffc1b5672d1b44371a8`. Test baseline with the same validator, form and database limit: staging `63e81d1a91f7f288825100b47786823460943e5c`.
- [The revised contract and STS](../contracts/lab-7-feedback-limit.md) were committed at `b46b7de` before RED. The approved maximum is 6,000 Unicode code points after trimming. A received the screenshot of TA approval on 20 November 2026 (Asia/Bangkok). The original screenshot is retained in the conversation.
- Exact test commit: `e3758fb541e48716545868c6f435907b83a67aec`. The app and database rules still enforce the pre-change behavior at this commit.

## RED run on 20 November 2026

From `Project_code`, run `npm run test:b02:isolated` with Docker running. Vitest runs the [new cases in the existing authenticated feedback suite](../../server/src/testing/feedback-review.b02.ts) against disposable PostgreSQL 16.8. The fixture creates a real student submission, signs in the assigned supervisor, and uses the feedback POST, persisted database state and student readback. The isolated runner removed its database container after the run.

| Test cases | Expected after GREEN | Observed on the pre-change implementation |
| --- | --- | --- |
| L7-STS-01. 5,999 and 6,000 in plain, astral emoji and whitespace forms | HTTP 201. Exact trimmed body persists and reads back. | Six tests failed as expected. HTTP 400 `INVALID_INPUT` reported the current 4,000-point content limit. |
| L7-STS-02. 6,001 in the three forms | HTTP 400 with a content field error and zero writes. | All three rejection controls passed. |
| L7-STS-03. 6,000 astral emoji encoded as JSON surrogate pairs | HTTP 201. Persist the decoded text. | Expected RED. HTTP 400 reported that the JSON body was too large. This exposes a separate 64 KiB transport limit. |
| L7-STS-03. Direct PostgreSQL persistence of 6,000 astral points | Insert and read back exactly 6,000 points. | Expected RED. PostgreSQL rejected the content as too long for its current column type. |

Local and [GitHub CI run 44672187909](https://github.com/zerotwobook/fastTrack/actions/runs/44672187909) both reported **51 passed and 8 expected failures** in the feedback suite, including all 48 existing cases passing. The typecheck and build stages passed locally. The seven existing upgrade checks also passed. Exit code 1 comes from the deliberately failing new expectations. [Machine-readable result extract](R2-A05-lab7-red-results.json)

## A's metrics inputs for the report

Snapshot dated 20 November 2026 (Asia/Bangkok). The issue and merge counts below deliberately cover the accepted Sprint 2 product and integration workstream inherited by this change. Report this scope alongside the values.

| Evidence ID | Measure and scope | Value and source |
| --- | --- | --- |
| L7-M01 | Accepted, closed product and integration issues from the selected #17–21 workstream by the snapshot. | **5 of 5.** [#17](https://github.com/zerotwobook/fastTrack/issues/17), [#18](https://github.com/zerotwobook/fastTrack/issues/18), [#19](https://github.com/zerotwobook/fastTrack/issues/19), [#20](https://github.com/zerotwobook/fastTrack/issues/20), [#21](https://github.com/zerotwobook/fastTrack/issues/21). |
| L7-M02 | Merged feature and integration PRs selected from those five issues, with staging as the destination. | **5 of 5.** [#117](https://github.com/zerotwobook/fastTrack/pull/117), [#118](https://github.com/zerotwobook/fastTrack/pull/118), [#119](https://github.com/zerotwobook/fastTrack/pull/119), [#120](https://github.com/zerotwobook/fastTrack/pull/120), [#123](https://github.com/zerotwobook/fastTrack/pull/123). |
| L7-M03 | `test:b02` at the unmodified staging baseline, before adding the Lab 7 tests. | **48 passed, 0 failed.** [Baseline CI run 44663918612 and its regression artifact](https://github.com/zerotwobook/fastTrack/actions/runs/44663918612). Record the release-candidate outcome separately. |

B supplies the two measures for UAT defect dispositions and CI run outcomes. The final five-metric table, interpretation, readiness and retrospective follow the actual GREEN and release work.

## B handoff

1. Review the contract, acceptance criteria and RED assertions before changing production code. Use the existing `maintenance/lab7-feedback-limit` branch and PR #128 in a separate checkout. The pinned RED test commit stays in history.
2. Implement the 6,000-point limit with the shared validator and form counter. Verify the escaped JSON case with a bounded feedback-route request allowance and the established session, role and source guard order. Add a forward migration for `feedback.content` and its named bounds check. Verify legacy rows, IDs and version associations survive.
3. Run the same tests after the changes. Update historical over-limit assertions that used 4,001 as invalid so the new overflow value is 6,001. Retain the 4,000 acceptance control. Check real browser boundaries, Unicode and whitespace, cross-team denial, replay, and original-version feedback. Provide the GREEN head, case counts, upgrade result and CI.
4. Keep the shared PR in Draft through expected RED. Request A's review after GREEN. After staging integration, follow the [main release gate](../../../workflow/MAIN_RELEASE_GATE.md) for a concrete candidate and capture deployed evidence for Lab 7.
