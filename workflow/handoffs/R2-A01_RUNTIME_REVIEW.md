# R2-A01: runtime/container review handoff to B

Owner A (`zerotwobook`), independent reviewer/schema integrator B (`Atip-Infa`). [Issue #14](https://github.com/zerotwobook/fastTrack/issues/14), [PR #84](https://github.com/zerotwobook/fastTrack/pull/84), branch `build/s2-a-docker`, base `staging/sprint-2`. Read the actual latest PR head/base; do not approve an old commit after changes.

## Concrete candidate and evidence

The candidate implements A's accepted Lab 5 runtime contract without adding S2 product features or B's Actions/release workflows. Read:

- [Canonical author results and applicability](../../Project_code/docs/evidence/R2-A01-runtime.md), including actual RED, regression, initial failed verifier and final image JSON.
- [Deployment/runtime/env guide](../../docs/labs/lab-05/deployment.md).
- [Dockerfile](../../Project_code/Dockerfile), [Compose](../../Project_code/compose.yaml), [accepted delivery contract](../../Project_code/docs/contracts/sprint-2-lab-05-delivery-contract.md).
- [B's independent review prompt](../../prompt_project/prompt_lab5/B/05_REVIEW_R2-A01.md).

The new limiter migration/model is an additive A-authored proposal under the accepted interface, specifically for B's schema review/integration. Applied migrations and existing domain fields are unchanged. Do not treat A writing the proposal as B's review or acceptance.

## Review focus

1. Reproduce compatible full-tool jobs and pruned non-root final runner from a fresh checkout. Confirm source SHA labels/health, workspace paths, shared/generated assets, production origin behavior and no secret/env/fixture files.
2. Verify actual DB deadline/pool settings and single pending readiness probe; connected/disconnected/timeout JSON and liveness remain distinct. Production must retain exact HTTPS origin, Secure cookies and source/CSRF rules.
3. Inspect limiter row creation/locking/current DB clock, failed-attempt commit before HTTP error, atomic success/session rotation, exact expiry and bounded contention. Check generic 401/429 envelope and no session creation/revocation on active lock.
4. Inspect the **new** schema/migration/index and test-fixture cleanup guards. Validate fresh/legacy preservation and do not rewrite applied history. B remains schema integrator.
5. Test normalized selected-IP identity/direct versus trusted-hop paths; do not assume local header tests certify GCP. The cloud proxy topology must be verified before enabling trust in production.
6. Verify one explicit bounded cleanup batch only, active-state preservation, confirmation guard and no automatic maintenance/seed/migration at web startup.
7. Reproduce actual job migrate/seed, domain flow, role rejection, graceful app restart and exact original-ID/session readback. Docker can change ephemeral host ports on restart; verifier refreshes the binding instead of recreating data.
8. Check result provenance/source applicability and secret redaction. Local HTTP verification with controlled production headers is not public TLS/cloud evidence. Existing historical browser results must not be credited as a new B run.

## Runtime interface for B's CI/release task

- App context `Project_code/`; targets `runner` and `jobs`; required `RELEASE_SHA` build argument is the actual full source commit.
- Web entrypoint: `node server/dist/index.js`, working directory `/app`, injected PORT, non-root `node`.
- Jobs entrypoint: `npm`; arguments `run db:migrate --workspace @fasttrack/server` (normal explicit pre-rollout job). Seed is a separately authorized `run db:seed --workspace @fasttrack/server` with private seed password, not a normal release step.
- Exact operational JSON, env names, timeouts and cleanup guard are in the canonical guide/contract. Keep web/job image identities from the same source and never bake runtime credentials into build args.
- CI can run `npm run test:runtime:isolated` when the runner supports the existing Docker/guarded-test prerequisites. Do not replace real DB coverage with mock-only checks or mark a skipped Docker job successful.

## Human handoff boundary

A's current checks support a staging review request, not B acceptance, automatic merge or whole Lab 5 completion. B records their actual head, checks/findings and reason for acceptance in their own review. Real findings use the same PR/branch and actual Fixing/re-review lifecycle. Authorized staging merge is verified afterward; no self-approval/merge is performed here.

Main release still needs the user's exact current-candidate authorization and real peer/protection. Cloud resource/IAM/DB mutations require separate concrete review/authorization. Public workflow/persistence/release checks belong to R2-J01; PDF export/upload and external partner messages remain user-controlled actions.
