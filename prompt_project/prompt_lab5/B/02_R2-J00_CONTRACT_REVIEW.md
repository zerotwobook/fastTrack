# B / 02: independently review R2-J00 delivery contracts

I am B (`Atip-Infa`). Independently inspect A's concrete Lab 5 baseline/delivery contract for **R2-J00 / Issue #13**. A is `zerotwobook`. This is B-assisted analysis and reproduction; the AI must not manufacture B's human acceptance or submit approval as a person.

## Required reads and entry

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely. Read Lab 5 plan sections 1-5/9/12, Sprint 2's entry/shared ownership rules, project-detail sections 7/9/11/13 and the exact current #13 contract/PR/diff/author evidence. Inspect live predecessor decisions and the real S1 tag/main/staging ancestry. Do not rely on the historic snapshot or merely a closed Issue.

Use B's separate clone. Find the actual A candidate by Issue/branch linkage, not a guessed PR. Fetch/read the exact head. Preserve B's uncommitted work; use a safe separate worktree if necessary. If A has not produced a concrete candidate, inspect available baseline sources and return the precise missing handoff instead of inventing a review.

## Independent checklist

1. Compare S1/main baseline, defect disposition and executed versus historical test evidence. Confirm the proposed staging bootstrap is one shared branch from an agreed commit; do not create a competing staging branch.
2. Trace Docker/runtime packaging against actual source: npm workspace, pins, built client/server, shared modules, generated Prisma runtime, non-root image, PORT/listener/shutdown and real job tools after pruning.
3. Check operational JSON/version/readiness tests and smoke assertions agree. A readiness constant or health-only smoke cannot prove DB availability.
4. Check complete env inventory, production HTTPS origin bootstrap, secret scopes, no client secret injection and the canonical guide's shared ownership.
5. Inspect cookie/CSRF/source/no-store/session design against implemented auth, including multi-instance behavior. Evaluate proposed shared limiter threshold/window/keys, IP trust, expiry/concurrency and 429/error tests; identify unresolved decisions explicitly.
6. Verify DB connectivity choices are compatible with current Prisma/adapter and planned GCP access. Inspect fresh/upgrade migrations, non-destructive explicit seed and B's schema integration ownership; reject applied-migration rewrites or DB resets.
7. Check CI commands preserve real-DB/system/migration coverage and isolated guards. Required-check name must be discovered from actual runs later, not assumed ready now.
8. Check release source SHA, immutable image/digest and serving revision verification; main-only trigger, migration-before-rollout, queued deployment, smoke/logout and compatible rollback limits.
9. Check cloud IAM/resource changes and main integration have distinct concrete user gates. Budget alert does not cap spend. No cost/service already exists merely because the plan names it.
10. Verify A/B owned paths, manifest/schema integration order, C-01-C-06 coverage and separate actual restart/redeploy experiments are actionable. Keep broader F-05-F-07 scope visible if not covered.

## Findings and correction handoff

Prepare an English review with exact head/base, each check performed, results and file/line findings, severity and requested correction. Separate blocking correctness/security/reproducibility problems from optional suggestions. A passing analysis is still not a human approval. Do not click Approve, merge, post comments or claim B accepted without an explicit actual human decision.

Return corrections to A's existing branch/PR; do not silently implement in A's module. If the user explicitly delegates a bounded correction, record owner/shared-path coordination first, retain history, rerun affected checks and still require an independent human reviewer for the resulting change. Use Fixing only for real findings already handed off.

If B/user actually records acceptance for the exact contract, verify/read back it and the bootstrap/main ancestry. Record the **delivery-specific checkpoint** in #13 without accepting unreviewed broader S2 scope. Do not set the entire joint task Done without its full criteria and merge.

## Endpoint

Return candidate/Issue/PR/branch, exact checks and findings, unresolved decisions and the real human acceptance state. If delivery interfaces are accepted and shared staging exists, A may start prompt 03 and B may start prompt 04 on separate task branches. Otherwise identify the exact dependency to resolve and continue only independent preparation.
