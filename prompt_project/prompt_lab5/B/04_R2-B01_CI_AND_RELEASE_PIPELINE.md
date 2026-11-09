# B / 04: implement R2-B01 CI and release scripts

I am B (`Atip-Infa`), implementing **R2-B01 / Issue #15**. A (`zerotwobook`) reviews. Complete the CI/release **code and local/CI verification phase**. Live WIF/gate proof/cloud release belongs to later prompts; do not claim all of #15 accepted because templates exist.

## Required reads and dependency inspection

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely. Read Lab 5 plan sections 4/5/7/9/10, Sprint 2 section 5.2, accepted delivery contract in #13, actual #14 image/entrypoint/operational contract, current npm scripts/DB guards and existing workflow/deploy files. Read relevant starter CI/deploy documentation as reference only; fastTrack cookie/CSRF/JSON conventions override TokTickIT examples.

Use B's separate clone, real current #15 lifecycle and existing task branch/PR, or a new branch such as `ci/s2-b-pipeline` from accepted staging for a genuinely new task. Verify the delivery-specific checkpoint and shared owners. Independent CI scaffolding can run alongside A's work; mark Docker integration blocked until A's actual reviewed image contract is available. Do not stub successful Docker/migration checks to bypass that dependency.

## Write and implement the delivery design

1. Record AC/test plan and event/check/job/script interfaces in the actual Issue/contract. Agree app context, paths, JSON keys, env names, image/job command and release identity with A. B owns workflows/release/smoke; coordinate manifest/lockfile/schema edits with the integrator.
2. Put Actions workflows at root `.github/workflows/`. Set `Project_code/` working directory/context explicitly. Use lockfile install and actual pinned runtime/package manager; avoid a duplicate root package or assuming starter paths.
3. Trigger meaningful CI for relevant PRs to `main` and `staging/sprint-*`. Review event filters and shared/workflow changes. A required check must not be absent due to path filters or falsely successful because dependencies were skipped/cancelled.
4. Run real unit/type/build, migration/seed checks, S1 API/DB/system regression and Docker build. Inspect the existing isolated chain and disposable DB guards; adapt CI runner support deliberately. Keep production/cloud credentials out of PR jobs, especially untrusted contributions. Do not use privileged PR execution for checkout of untrusted code.
5. Produce one stable observable aggregate context, such as the actual emitted `test-and-docker` name, that fails when required jobs fail/skip unexpectedly. Do not configure branch protection using an unobserved guessed context; prompt 08 handles live required-check proof after real runs exist.
6. Retain meaningful reports/artifacts and run links without secrets, cookies or payloads. State actual assertions/counts/environment/SHA. Pin/review Actions and minimal workflow permissions as required by the adopted design.
7. Implement normal main-only release code: validate event/ref/environment -> CI -> build/push full source-SHA image -> resolve digest -> explicit migration job -> service rollout -> readiness/HTML/safe smoke -> factual summary. Reject staging/unapproved arbitrary source deploy paths. Preserve appropriate explicit manual approval inside the pipeline if configured.
8. Propagate the **actual main source commit built by the run** to image/runtime identity. A release PR head can differ from the main merge SHA. Document exactly how `RELEASE_SHA`, build tag, digest and serving revision are compared.
9. Serialize releases without cancelling an active migration. Stop before rollout on migration failure or unresolved image/digest. Treat migration output as potentially sensitive. Do not silently retry partially applied schema changes or seed real data on every release.
10. Implement smoke against accepted fastTrack operational JSON and HTML. Optional private smoke uses a dedicated low-privilege account, same-origin/custom login header, cookie jar, CSRF, read-only scoped request and logout. Missing optional credentials yields SKIP login; failed configured credentials yields failure, not a silent skip.
11. If rollback is implemented, accept only an existing known full image SHA, resolve its digest and skip build/migrate/seed as the accepted design requires. Explain compatibility limits; no automatic schema/data rollback or blind old-image selection after smoke failure.
12. Add offline behavior tests for migration-failure-no-rollout, unknown image/digest rejection, release ref enforcement and rollback-no-migration. Use safe command mocks for those failure paths, but do not call them live deployment proof.
13. Update owned CI/release/smoke documentation and B's section of root `docs/labs/lab-05/deployment.md` with actual commands/limits. Coordinate A's runtime/env sections; no PDF export or unrelated S2 feature implementation.

## Verification and GitHub handoff

Execute relevant script tests, existing app tests and real-DB/image checks when dependencies permit. Trigger/inspect actual PR Actions after the early Draft is pushed; compare emitted check names, assertions, branch event and tested SHA. A green syntax check alone is not C-01. If a runner/cloud dependency is unavailable, finish independent code/docs/tests and record precise remaining verification.

Follow real #15 lifecycle without replaying it. Save Specified/Started before edits when new; after the first coherent real commit/push, open/reuse the Draft and immediately add its Started Project card. Complete remaining work on that PR. For ready staging code, move both cards to PR Review only when criteria/evidence truly support handoff; keep live WIF/gate/C-02 items explicitly pending if not yet performed.

A reviews the current full diff, command failure behavior, auth smoke, actual test/DB/image coverage and minimal permissions. Do not self-approve/merge or request a main release before user authorization. Code integration acceptance can be narrower than complete #15 acceptance; do not close the whole Issue while its actual gate proof remains pending.

Return exact branch/Issue/PR/head/base, workflow/job/check names, actual results/artifacts, required runtime contract, incomplete live setup and reproduction for A. Next: A/06_REVIEW_R2-B01.md. Resume #15's live settings/proof in B/08_R2-B01_J01_WIF_GATE_AND_RELEASE_PREP.md after prerequisites.
