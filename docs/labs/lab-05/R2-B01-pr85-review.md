# R2-B01: assisted review of PR #85

## Scope and authorization

- Owner: B (`Atip-Infa`); reviewer account: A (`zerotwobook`).
- PR: https://github.com/zerotwobook/fastTrack/pull/85
- Target: `staging/sprint-2` at `0bb230958c4efb6ec2c083e2cc78419304de864a`.
- Original reviewed head: `16a5bd1862a3c7263a2f2b412a4a11042ebc63a1`.
- The user explicitly requested inspection, necessary corrections, a review response and merge if satisfactory. This is assisted review under that instruction, not a claim of independent manual human testing.
- A used a separate temporary worktree on `review/s2-a-pr85`. Corrections are delivered to the existing `ci/s2-b-pipeline` branch and PR; B remains task owner.
- Changes cover delivery scripts/tests and their guide. No schema, application module, lockfile or UI changes. No main merge or live cloud mutation is authorized by this staging integration.

## Findings and corrections

| Finding | Affected source | Correction |
|---|---|---|
| Provisioning reruns executed an existing job without selecting the new jobs image. | `deploy/deploy.sh` | Update its image and migration command before execution. |
| Bootstrap could deploy unmerged/dirty source and mutable `latest` tags, with a fabricated zero SHA fallback. | `deploy/deploy.sh` | Require clean main matching fetched origin/main; use the real full source SHA and validated immutable web/jobs digests. Preview remains available without cloud calls. |
| Migration configuration did not explicitly disable retries or inherited multiple tasks. | `deploy/deploy.sh`, `deploy/release.sh` | Use one task, one parallel worker, zero retries and the explicit migration command. Failure still prevents rollout; rollback never touches jobs. |
| Digest validation accepted an empty or malformed suffix. | `deploy/release.sh` | Validate the repository prefix and all 64 hexadecimal digest characters before migration/rollout. |
| The latest ready revision was labeled serving without reading actual traffic. | `deploy/release.sh`, deploy workflow | Require a single 100% assignment to the reported ready revision and include observed traffic in the summary. |
| Logout failure printed a warning and allowed a passing smoke result; error text could expose diagnostics. | `deploy/smoke_test.py` | Fail with a fixed sanitized error. |
| 404 smoke accepted any nonempty code/message and extra diagnostics; its fixture used a different message from the real API. | Smoke script/tests | Match the implemented `NOT_FOUND` envelope from `Project_code/server/src/http/errors.ts`, rejecting unexpected fields, message, code or stack data. |

## Actual local verification

Tests ran on the correction working tree based on the original head; this record is committed with that tested code. The final exact pushed head and CI run are recorded in the PR review and Issue #15 progress log.

Environment: Windows, Git Bash 5.3.15, Python 3.13.16. Only local stubbed gcloud/docker/openssl commands ran; no cloud access or billing changes.

- RED before implementation: the extended smoke suite had 3 failures out of 9 (logout, wrong 404 code and top-level stack). The provisioning/release suites also exited nonzero on the new migration-image/retry assertions.
- GREEN: `python -m unittest discover -s deploy/tests -p test_smoke.py`: 10 tests passed.
- GREEN: `bash -n deploy/deploy.sh deploy/release.sh deploy/teardown.sh deploy/tests/test_deploy_stub.sh deploy/tests/test_release_stub.sh`: passed.
- GREEN: `bash deploy/tests/test_deploy_stub.sh`: first-run, rerun, partial setup, migration failure, optional demo-secret preparation, dry-run and rejection of non-main/dirty/divergent source passed. Reruns select immutable images and preserve existing DB credentials.
- GREEN: `bash deploy/tests/test_release_stub.sh`: normal release, rollback, wrong ref, missing web/jobs image, failed migration, malformed web/jobs digests, invalid tag and split-traffic rejection passed.
- GREEN: `git diff --check`: passed after removing one trailing-space finding.
- Local Docker Engine was unavailable (`dockerDesktopLinuxEngine` pipe missing). Full PostgreSQL/build/image verification is therefore required from the current-head GitHub Actions run before merge; previous CI is historical evidence only.

## CI and remaining gates

Original head CI: https://github.com/zerotwobook/fastTrack/actions/runs/42788194028 completed successfully with the `test-and-docker` context. Its steps include lockfile install, Prisma generation, typecheck, unit/contract tests, production build, isolated PostgreSQL/migration/S1/runtime tests and both production image targets. It does not validate the subsequent corrections.

The current staging ruleset requires one non-author approval, dismissed stale approvals, resolved threads, merge commits, and blocks deletion/force push. At inspection it did not yet require the observed CI context. This review still requires current-head CI before merging; it does not change protection.

Live WIF/environment configuration, required-check/up-to-date enforcement, controlled C-02 failed-check proof, public deployment, business-flow/persistence evidence and main-release authorization remain pending. Keep Issue #15 open and its overall Acceptance PENDING after code integration. The merged PR card may become Done independently.

Cloud Run job flags were checked against the official CLI references: https://docs.cloud.google.com/sdk/gcloud/reference/run/jobs/create and https://docs.cloud.google.com/sdk/gcloud/reference/run/jobs/update . Offline mocks establish intended command behavior, not cloud availability or successful execution.
