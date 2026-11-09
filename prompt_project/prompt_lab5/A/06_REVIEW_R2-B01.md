# A / 06: independently review CI, release code and C-01

I am A (`zerotwobook`), independently checking B's **R2-B01 / Issue #15** code candidate. Perform assisted review and real verification; do not invent A's human approval, merge B's PR, or call pending live WIF/C-02 complete.

## Read and discover

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely, Lab 5 plan sections 4/5/7/9/10, accepted delivery/runtime contracts, B's current #15 PR/full diff/checks/evidence and actual workflows/scripts/tests. Discover current PR/head/base/check names; inspect the real required-check configuration separately from implementation plans. Use A's safe clone/worktree and preserve existing work.

## Independent review and tests

1. Verify workflow location/context, exact runtime/lockfile install and relevant PR triggers for main and actual staging pattern. Check path filters, reusable jobs and skipped/cancelled dependencies cannot leave required checks missing or falsely passing.
2. Inspect test assertions and actual run output. C-01 requires meaningful build/automated tests at the current candidate. Confirm real PostgreSQL migrations/API/system coverage and disposable DB guards, not only `npm test` or mocked persistence.
3. Reproduce selected script failure tests and image integration. Check A's accepted final image/job entrypoints are used; missing tooling/context/assets cannot be waved through by a syntax check.
4. Audit PR permissions and secret access, artifact/log redaction and safe handling of untrusted checkout. Do not execute privileged untrusted code. Compare observed aggregate context with what live protection will select later.
5. Trace normal release: main-only validated ref/source -> CI -> immutable SHA image/digest -> migration -> rollout -> readiness/HTML/smoke -> factual summary. Check wrong-ref/manual inputs cannot silently deploy staging or arbitrary code.
6. Verify migration failure stops before service update, jobs are serialized without cancelling active migrations, failure output is sanitized and partial DB failures are not blindly repaired.
7. Verify real source SHA propagation, including the main merge SHA distinction. A job cannot claim release identity merely by reading an unrelated PR head or old tag.
8. Inspect smoke cookie jar/custom login header/source/CSRF/logout behavior, dedicated low-privilege account, read-only private request, exact JSON checks and honest optional-login SKIP. No starter categories/bearer/admin shortcuts.
9. If rollback exists, verify existing full image identity, digest resolution, no migration/seed, schema-compatibility caveat and clear failure reporting. Offline mocks establish command behavior only.
10. Check env/permission/WIF design is scoped, variables versus secrets are correct, guide paths/commands agree with A's runtime contract and live setup gaps are explicit. B cannot claim WIF or merge gate verified until actual authorized setup/proof.

## Report and handoff

Create an English assisted-review record with exact head/base, environment, tests/runs/commands/results and file/line findings or justified no-findings outcome. Capture actual C-01 run link and test summary where established. Do not manufacture a human review, post comments, Approve or merge without explicit applicable authorization.

Return fixes to B's existing PR. Use actual Fixing/re-review lifecycle only for real findings; preserve previous evidence with its SHA. If head/base changes, reassess affected checks before endorsing the new candidate. Code PR integration can be accepted while #15's live required-check/WIF/C-02 work remains open; state that boundary rather than closing the whole task.

After an actual peer-authorized staging merge, read back state/merge SHA/Project card and exact accepted scope. Record whether the integrated container/CI gate is ready with B's actual decision; AI checks do not invent joint acceptance. Next: A/07 cloud runtime preparation and B/08 live WIF/gate/release preparation when prerequisites hold.
