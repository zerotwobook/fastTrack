# B / 05: independent container/runtime review and C-03 reproduction

I am B (`Atip-Infa`), independently checking A's **R2-A01 / Issue #14** current candidate. Perform assisted technical review and safe reproduction. Do not fabricate B's human approval, self-merge, or silently take over A's implementation.

## Read and select the actual candidate

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely, Lab 5 plan sections 4-6/9/10, the accepted delivery contract, A's full PR/diff/checks/evidence and relevant actual source/tests/config. Discover the PR/head/base via #14 rather than using an old number. Confirm B's own clone/account and preserve unrelated changes. Use a clean disposable checkout/worktree for C-03 without deleting another person's directory.

Require a concrete A candidate and documented run/env/job instructions. If the image contract is still changing, report that and review independent portions; do not create evidence against one SHA and approve another without reassessment.

## Independent procedure

1. Trace Docker stages/dependency pins/install/build. Inspect the final runtime, not just builder success: built client/server/shared modules/fonts/Prisma runtime and actual migration/seed tools must be present.
2. Verify `.dockerignore` and secret boundaries; inspect only safe file/config metadata, not credential dumps. Check non-root UID, filesystem needs, injected port, external reachability and graceful stop.
3. Follow A's documented commands from a fresh checkout, filling placeholders privately. Build/run with a disposable real PostgreSQL instance. Record command/tool versions/exit/results/image/commit; confirm this is the actual C-03 candidate.
4. Run type/unit/build and relevant real-DB regressions according to changed behavior and existing accepted evidence. Preserve test guards; never target the cloud/shared DB for fixture cleanup.
5. Test `/api/health` exact version, real readiness success and bounded sanitized 503 on isolated DB failure. Check HTML/assets/deep links and JSON unknown-API behavior.
6. Exercise real login/session/CSRF/Origin/Secure-cookie/proxy assumptions and Student/Supervisor scope. Inspect shared limiter assertions for concurrency, threshold/window/expiry, IP trust and 429. Do not disable auth to make the smoke pass.
7. Run explicit migration/seed in the actual chosen job runtime. Check fresh and existing S1-data upgrade, safe repeated seed and existing passwords/membership/domain relations preserved. Applied S1 migrations must not change.
8. Save synthetic milestone/submission/feedback IDs locally, restart the app preserving the same DB, then read the same records/valid session. Local restart proves container/runtime behavior; it is not public C-05.
9. Check env docs cover all actual runtime/build/test/seed settings with secret/source scope; commands in the technical guide must match verified behavior and expected working directory.
10. Review full current diff for unrelated S2 feature/UI/business-rule changes, schema/manifest ownership conflicts and missing error/failure tests. If UI changed, read UI skill/brief and inspect required states rather than relying only on code.

## Findings and acceptance boundary

Prepare an English technical review with head/base/environment, checks performed and actual results, precise file/line findings, severity and requested correction. Attribute new evidence to B's actual run and distinguish A's inherited evidence. Preserve machine-readable outputs and readable Markdown narrative.

For real blockers, return fixes to A's same branch/PR and follow real PR Review -> Fixing only when appropriate. Do not mutate #14's owner or create a duplicate task merely to leave a review. If explicitly delegated a correction, record narrow scope/ownership first, then require independent review of that change.

An AI-assisted passing review is not B's human approval. Present the concrete evidence for B to review; do not submit approval or merge as a person without the required explicit instruction and policy. After an actual authorized peer merge, verify MERGED/current head/merge commit, native PR Done and #14's exact full criteria before marking the Issue accepted/closed. A preparation result alone does not accept cloud gates.

Return review findings or actual no-findings result, C-03 evidence, branch/PR/head/base, verification/acceptance separately and next action for A. Wait for corrections/human integration as needed. Next dependent cloud phase is A/07 only after both container and CI gate decisions are real.
