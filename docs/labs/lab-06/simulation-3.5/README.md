# Lab 6 simulated exercise section 3.5

Read the [execution report](execution-report.md), [verified evidence PDF](evidence.pdf) and [CoursePMS retest instructions](coursepms-retest.md). Human review and independent retest are pending in this evidence package.

## Assignment and ownership

The user relayed the TA-assigned scenario on 19 November 2026. A student can submit work after the deadline in a deliberately defective isolated version. The required chain is reproduction, RED, GREEN, peer PR review, CI, isolated deployment and independent CoursePMS retest. Original incoming UAT found no confirmed defect in its recorded scope.

Task R2-B04 / Issue #23. A (zerotwobook), the F-03 module owner, implements this exercise. B (Atip-Infa) reviews the tests, server restoration and evidence, and coordinates the defect loop. CoursePMS supplies its independent execution and acceptance. The task branch is `fix/s2-a-lab6-deadline-simulation`, isolated from staging baseline `01f61a9e2b3c0dde02e6acf8c5e4231086dbba2b`.

## Existing rule and controlled defect

BR-04 uses the database clock after team and milestone locks. An accepted time at or before dueAt is valid. A later time must produce HTTP 409 DEADLINE_PASSED and leave submissions unchanged. The existing baseline already implements this rule.

The simulated defective commit deliberately omits the server deadline rejection. New tests must expose the actual unexpected HTTP 201 and persisted row against that commit. The GREEN commit restores the original rejection. Preserve both commits and machine-readable outputs. The final PR's server behavior must conform to the accepted contract.

## Acceptance checks

- An actual authenticated HTTP request after the database deadline returns 409 DEADLINE_PASSED.
- Compare persisted submission rows before and after rejection, including an unrelated saved control row. The rejected title/URL must be absent.
- Repeating a late attempt still creates zero rows for that milestone.
- An authenticated request before the deadline returns 201 and stores exactly one version 1 visible through a fresh authenticated GET.
- Internal deterministic tests preserve acceptance at -1 ms and 0 ms and rejection at +1 ms. Existing real database-clock lock-wait, access, cancellation and duplicate tests remain required.
- Current-head CI passes, B performs real PR review, and the isolated deployed source/digest/revision is recorded.
- CoursePMS independently repeats the late rejection/no-write checks and the successful before-deadline control on the recorded deployed version. Record actual tester names, time, steps, expected/actual results and screenshots.

## Authorized isolated online resources

Project fasttrack-se-002, region asia-southeast1. A dedicated Cloud SQL PostgreSQL 16 instance `fasttrack-lab6-db` (db-f1-micro), database `fasttrack_lab6`, and synthetic database user would keep the exercise data on a separate instance. Dedicated runtime identity `sa-fasttrack-lab6`, secret `fasttrack-lab6-database-url`, and synthetic demo-seed secret would serve only the exercise. Cloud Run service `fasttrack-lab6` uses min instances 0, max instances 1 and a pinned GREEN image digest. Job `fasttrack-lab6-migrate` applies the existing migrations and explicit synthetic seed. Images use separate lab6 tags in the existing registry.

The user explicitly authorized this resource list before creation, following workflow/02_SPRINT2_LABS5-7.md section 5.3. The dedicated service is deployed at https://fasttrack-lab6-970128017651.asia-southeast1.run.app with source `1bbe187c088b86d104a16e420058f17425f18828` and revision `fasttrack-lab6-00001-74k`. The SQL instance uses PostgreSQL 16 Enterprise, db-f1-micro. The new SQL instance incurs cloud usage while running. [Actual execution report](execution-report.md) records the pinned images, migration/seed executions, online API/browser checks and database snapshots. Existing main release approval remains a separate requirement for any future main-targeted change.

## Evidence and partner handoff

Keep authored report content in Markdown and actual sanitized machine results beside it. Export the explicitly requested evidence PDF after collecting available verification. Mark review, deployment or independent retest as PENDING until each occurs. A final assessment decision requires the actual CoursePMS result.

Current implementation verification is PASSED. Human B review and independent CoursePMS execution/acceptance remain PENDING. The live Issue and PR carry the current workflow state. Historical records and PR #114 retain their own state.
