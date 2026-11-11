# A / 01: R2-J00 baseline and delivery contracts

I am A (`zerotwobook`). Perform the Lab 5 baseline/design phase of **R2-J00 / Issue #13** for fastTrack. B (`Atip-Infa`) is the real peer. Execute this phase fully within the boundaries below; do not start R2-A01 or deploy.

## Required reads and startup

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely and follow it. Also read Lab 5 plan sections 1-5, Sprint 2 sections 2/4/5/10/13, project-detail sections 5/7/9/11/13, actual S1 module contracts, current package scripts/server config and existing release/handoff records. Inspect live Issue #13, predecessor #12, relevant PRs/tags/main/staging and Project 3; dated documentation is not live acceptance.

Confirm A's account/clone and cleanly isolated branch. Reuse an existing #13 branch/PR if active. If sprint-2 staging is absent, first inspect the accepted S1/main baseline with B's actual acceptance evidence. Prepare the one-time staging bootstrap; do not invent joint acceptance or publish a different base on B's behalf. A planning-only docs bootstrap may follow the documented exception; application work still waits for accepted staging.

## Deliver the design, not just a proposal to work later

1. Identify the exact S1 tag/commit, current main, executable differences since S1, open defects and prior actual tests. Distinguish reused evidence from new reproduction. Do not move an assessed tag or reopen/replay completed cards.
2. Inspect existing Docker/workflows/resources before assuming they are absent. Record the real app layout, dependency/runtime pins, generated Prisma/shared-module packaging and baseline security. Do not read real secrets.
3. Write a concise English delivery contract in the existing appropriate contract/decision location under `Project_code/docs/` or a scoped workflow handoff. Reuse an existing canonical contract instead of creating conflicting duplicates. Link its commit/path from #13.
4. Specify build context, final image contents, non-root entrypoint, injected PORT, listener, shutdown, client/assets/deep links and separate migration/seed commands. Resolve how the production migration job gets Prisma CLI and seed tooling after dependency pruning; do not leave an untested assumption.
5. Define exact health/version/readiness keys, DB query timeout/failure response and what B's smoke validates. Reuse existing `/api/health`; readiness must query the real DB and sanitize failure.
6. Define env inventory/scope/secret/source, canonical env-example path, `docs/labs/lab-05/deployment.md` section ownership and exact-source SHA propagation. Account for first service URL discovery versus strict production `APP_ORIGIN`; never disable CSRF to bootstrap.
7. Preserve DB-backed session/CSRF, cookie/source rules and eight-hour TTL. Design shared public-login throttling: threshold/window/key/expiry, trusted proxy handling, concurrency, generic errors, cleanup and 429 tests. Evaluate existing PostgreSQL before adding a paid component. Mark unresolved product/security decisions explicitly for B/user rather than choosing silently.
8. Specify external DB connection strategy, ordered migration integration by B, safe explicit seed and fresh/S1-upgrade tests. No production reset or seed-on-every-start.
9. Prepare actual cloud naming/identity/resource plan where inputs are known: project ID/number, region, registry, service, DB and runtime/deployer separation. Unknown values stay pending. Do not execute billing/IAM/DB changes; prepare reviewable actions for prompt 07/08.
10. Define A/B file ownership and contract integration order, test commands, C-01-C-06 evidence owners and distinct restart/redeploy procedure. Keep unfinished S2 features excluded.

## GitHub and verification

Apply the shared stage protocol to the actual #13 state; save/read back Specified and Started before edits if genuinely new. On a continuing task, retain real lifecycle. After the first coherent pushed contract commit, create/reuse the early Draft and Project card; finish scope/link/consistency checks, then prepare B's actual staging handoff. If targeting main via docs bootstrap, keep Draft until the user gate permits otherwise.

Check relative links, env/API/JSON consistency against source, branch/base ancestry, shared-file ownership and acceptance/test coverage. Application test runs are needed only for relevant executable changes or a real baseline reproduction decision; do not claim old results are a fresh run. Record exact pending decisions.

## Endpoint and next action

Provide B a concrete contract commit/PR, decision table, actual baseline/staging identities, reproducible checks and questions. **Do not declare both members accepted the contract.** The broader #13 scope also includes F-05-F-07 interfaces; explicitly distinguish the Lab 5-specific checkpoint from those pending items, and do not close #13 based only on this phase.

When B's real acceptance permits bootstrap, A can coordinate publishing the one agreed staging branch under repository policy; verify remote SHA and B access before dependent code. Stop at unresolved human/shared decisions. Next prompt: B/02_R2-J00_CONTRACT_REVIEW.md. Report actual status, results, remaining decisions and branch/Issue/PR as required by the shared rules.
