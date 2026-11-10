# R2-J00: corrected A delivery contract and B review handoff

Date: 10 November 2026, Asia/Bangkok. Owner A (`zerotwobook`); independent reviewer B (`Atip-Infa`). Related [Issue #13](https://github.com/zerotwobook/fastTrack/issues/13), [PR #83](https://github.com/zerotwobook/fastTrack/pull/83), branch `docs/s2-a-cloud-contracts`, target `staging/sprint-2`.

Read the [corrected contract](../../Project_code/docs/contracts/sprint-2-lab-05-delivery-contract.md), [Lab 5 plan](../04_LAB5_DELIVERY_PLAN.md), [B/02 review prompt](../../prompt_project/prompt_lab5/B/02_R2-J00_CONTRACT_REVIEW.md) and [stage protocol](../GITHUB_PROJECT_AUTOMATION.md). The PR and Issue identify the current exact candidate; this file does not embed a self-referential commit hash.

## Scope and actual state

This change corrects A's design, source consistency and implementation/test handoff. Application source, schema, lockfiles and runtime examples are unchanged. No new app/image/DB/cloud run is claimed. The contract is a proposal until B reviews the actual current head; no B authorship, approval, deployment or whole-S2 acceptance is manufactured.

R2-A01 / [Issue #14](https://github.com/zerotwobook/fastTrack/issues/14) still depends on the real delivery-specific checkpoint. Its full implementation cannot be called complete while that dependency is pending. Twelve concrete A01 acceptance cases and the job/env/schema interfaces are now specified in the contract so the next owner can implement without silently deciding shared behavior.

## Findings addressed

| Finding | Corrected design / review target |
|---|---|
| Node 22 conflicts with strict Node 26/npm 11 pins | Require actual compatible Node/npm and verified base digest; candidate tag availability remains an explicit implementation check, not an invented registry PASS. |
| Runner omits runtime shared modules | Explicit final `/app/shared/*.mjs`, manifests, built client/server and generated Prisma assets; final-image import/start checks. |
| Migration/seed execution environment unresolved | Dedicated same-source full-tool `jobs` target, exact workspace-root npm scripts, explicit seed and migration-before-rollout. |
| Readiness timeout only bounds response promise | Require underlying connection/query/statement deadlines, bounded pool and late-error/release behavior as well as response timeout. |
| Root env example link is nonexistent and inventory incomplete | Correct relative server example, existing test/seed scopes and clearly proposed runtime/limiter variables; no claim they are implemented. |
| Login errors conflict with existing API/client | Preserve nested code/message/fields envelope; proposed 429 code and Retry-After semantics; add actual status/client tests in A01. |
| Limiter concurrency/expiry/cleanup unspecified | Conflict-safe row creation, lock/current DB time, committed failure outcomes, atomic session effects, exact expiry, bounded contention/cleanup and real DB test cases. |
| Unconditional proxy trust | Conditional topology-verified hop count, normalized IP identity and forged/multiple-header/direct-path tests before public readiness. |
| First origin depends on describing a nonexistent service | Derive a documented deterministic origin for initial deployment, then verify actual canonical host/metadata; keep CSRF/source checks and main-only release. |
| Repo-name-only WIF and excessive default deploy role | Numeric repo/owner, main/workflow/environment/event condition, scoped runtime/deployer duties; actual claims/resources still need authorized verification. |
| Restart example can create another revision | Document an authorized service-level manual scale-to-zero/restore experiment with same-revision/instance provenance, then a separate pipeline redeploy with original-ID readback. |
| Unverified cloud/resource and zero-cost/risk claims | Distinguish prior inputs/proposals from inspected resources; require current cost/permission/connectivity review. |
| Historical progress times conflict with commit/PR history | Preserve original rows but supersede their timing assertions with the explicit correction in Issue #13; no retroactive transitions or invented actors. |

## Checks and their limits

The author correction validates actual tracked package/runtime pins, source import requirements, error/client contract, existing env path, baseline executable identity, local Markdown links, fenced JSON, scope separation and planned acceptance-case coverage. The actual run and candidate hash are recorded in the PR/Issue after execution. A document consistency PASS is not application, image, Cloud Run, persistence or human-acceptance PASS.

Historical timeline facts used for the Issue correction:

- GitHub Issue events show Project status-change events at `2026-11-09T15:46:44Z` and `2026-11-09T15:46:49Z`; the inspected REST events do not expose their individual from/to values. Do not assign unverified from/to mappings to them.
- Initial contract commit `af759180abaff81e3153334450424e6f1380de5d` has commit time `2026-11-09T17:13:55Z`.
- PR #83 creation time is `2026-11-09T17:14:20Z`.
- Original Issue rows claiming before-edit transitions at 17:15/17:15:30 and Draft creation at 17:16 therefore cannot be used as verified milestone timestamps. Preserve them as superseded narrative, not valid proof that those events happened at those times.
- Current corrections record actual current timestamps. Missing historical evidence is not repaired by replaying card states or inventing a clean timeline.

## B's independent review procedure

1. Fetch the actual PR head and target staging in B's own clone/worktree. Inspect full diff and any later comments; do not approve an old head after changes.
2. Verify runtime pins/imports/job commands and preservation of accepted auth/source/error behavior against actual source.
3. Review all newly explicit decisions: limiter lock/commit/expiry/proxy semantics, deadline/pool relationships, canonical origin, job image, scoped WIF and controlled restart method. Record concrete corrections or a real reason for acceptance.
4. Identify image-registry/tool compatibility, cloud identities/connectivity/claims/costs and operational experiments as pending implementation/cloud checks. A's design inspection cannot accept those execution results.
5. Record the actual reviewed SHA, reviewer, decision/time and precisely accepted **Lab 5 delivery subset** in the real review/Issue when performed by B. This file and AI analysis do not supply B's human decision.
6. Any requested changes stay on this PR; use the actual Fixing/re-review protocol only for real handed-off findings. No self-approval/merge or protection bypass.

## Remaining scope and next step

- B's current-head contract review and actual joint delivery-specific checkpoint: PENDING.
- Contract integration into sprint staging: PENDING until the authorized peer process actually merges.
- Broader #13 F-05-F-07 contracts, real cloud verification and external coordination: retain their actual pending scope; do not close the whole Issue from this delivery document.
- R2-A01 Docker/runtime/config/readiness/limiter/migration tooling and actual tests: NOT IMPLEMENTED by this change.
- After the real checkpoint and integrated/synchronized staging, A uses [A/03](../../prompt_project/prompt_lab5/A/03_R2-A01_CONTAINER_AND_RUNTIME.md) on its own task branch; B uses its independent CI/release branch.
- Every later main candidate still requires exact current-head/base user authorization, real peer/protection and an authorized merge. Cloud billing/IAM/DB operations need their separate concrete authorization. No PDF export, submission, external messages or destructive experiments are authorized here.
