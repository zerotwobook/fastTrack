# A / 07: authorized cloud runtime and first public deployment

I am A (`zerotwobook`), leading the runtime/cloud phase of **R2-J01 / Issue #16**, with B (`Atip-Infa`) checking CI/WIF/release interfaces. Prepare and execute only concrete authorized actions. Complete independent preparation before asking for a required decision; do not provision unspecified resources or deploy staging code.

## Required reads and real entry gate

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely, Lab 5 plan sections 5/8-10/12/13, project-detail section 13, actual accepted #14/#15 contracts/results and #13 delivery checkpoint. Read relevant Student Guide account/first-deploy/secret/DB sections and handout section 4.4/9. Inspect live #16, existing cloud handoffs/authorizations/resources, main/staging, release workflows and candidate PRs.

Verify actual container/CI integration and both members' gate decisions. Use A's isolated task/evidence branch for new script/docs edits, or resume the actual joint branch serially. Do not reset #16's lifecycle because this prompt starts a new phase. App/provisioning scripts stay under `Project_code/`; canonical guide stays at root `docs/labs/lab-05/deployment.md`.

## Phase A: inspect and prepare a reviewable action plan

1. Verify project account holder, project ID/number, region, actual inventory, credit/billing status and access using read-only methods. Never print secrets or full connection strings. Reuse the same project through later labs; do not create duplicates.
2. Follow the handout access method: eligible personal Gmail Free Trial, team access, no prepayment/Upgrade. For payment/closed-account errors, capture sanitized evidence and identify TA/account-holder action rather than changing billing silently.
3. Recheck current official pricing/credits/quotas before recommending paid resources. Prepare budget alerts/cost controls and state alerts do not cap spending. Review small supported SQL/storage/backup choices, min instances 0/max at most 3 as reference controls, pool/concurrency limits and retention. Do not pause assessed/UAT services as an assumed cost fix.
4. Prepare an English change matrix: current resource/state, proposed action, exact project/region/name, purpose, IAM/DB/secret/cost impact, rollback/recovery limit, required owner authorization and verification command. Provide actual safe scripts/diff/dry-run when available; do not label a dry run as a successful provision.
5. Design runtime identity and Cloud SQL connectivity with the accepted Prisma adapter/URL behavior. Scope DB and Secret Manager access; B coordinates deployer/WIF. Never default the pipeline to Owner/Editor or create a JSON key to fix auth.
6. Resolve exact production origin and first-service URL sequence without disabling source/CSRF validation. Define privately supplied secrets, migration/explicit seed job configuration, service account, image/digest/source and public URL access.
7. Prepare validated provisioning/runtime scripts and guide sections only within accepted file ownership. Use real command exit checks, safe secret handling and targeted resource identifiers; no blanket destructive operations. Test local/offline failure behavior where meaningful and commit/push scoped changes through the actual early-Draft/staging process.

At the billing/IAM/DB boundary, present the exact reviewed actions and wait for explicit applicable authorization unless already valid for those unchanged actions. Continue independent code/docs/read-only checks while waiting. A pasted prompt is not authorization for unidentified mutations.

## Phase B: execute only the reviewed authorized subset

Read back authorizations and current resource state immediately before execution. Apply approved actions one at a time, verify results and record sanitized actual command/time/resource identities. If a step fails, inspect its real output/state before proposing a fix; do not grant broader IAM, pay, blindly rerun migrations or recreate resources. New material scope requires renewed review.

Prepare persistent PostgreSQL and private secret references; run only explicitly authorized migration/seed against the intended DB. No reset/schema-push/development migrations or implicit seed at every startup. Confirm repeat-seed preservation and migration-job success before rollout. Do not put demo passwords in Git, logs, screenshot or chat.

## Phase C: first deployment without breaking the main-only rule

The service may run only an accepted **main source commit**. If required Docker/runtime/workflow changes exist only on staging, stop rollout and coordinate the **initial delivery main bootstrap** with B's prompt 08: concrete Draft candidate -> exact user authorization -> real non-author peer/protected merge -> pipeline or documented main-source bootstrap. This may require returning to this same prompt after B's phase; it does not permit deploying an unmerged staging image.

If a manual first-deploy bootstrap is needed, document why, build the exact accepted main source/image and use the already-reviewed authorized procedure. A manual bootstrap does not replace later C-06's visible-change main pipeline proof. Do not trigger a stale/unmerged workflow or assume a branch push is a release.

After the actual deployment, verify from an external browser/API: HTTPS URL/origin, health status/version versus built source, DB readiness, static assets/fonts/deep links, correct API routing, production cookies/source/CSRF, and safe Student/Supervisor login. Capture sanitized service/revision/image/traffic/version identifiers and actual results. Health alone is not a business/persistence pass.

## Endpoint and handoff

Update runtime/resource/env/setup guide with actual values that are safe to publish, precise commands, results and limits. Retain Project Started for pending joint work, and use scoped PR Review only for genuinely ready individual PR handoffs; do not mark #16 Done from first deploy.

Return actual cloud changes versus pending actions, authorization references, accepted main SHA/image/digest, URL/revision, migration execution, checks and failures. Coordinate with B/08 for WIF/gate/initial main bootstrap when needed. Once first URL and required gates are real, A/09 creates persistent original records **before** B/10's later visible-change release.
