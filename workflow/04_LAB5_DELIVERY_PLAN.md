# Lab 5 delivery plan for fastTrack

> Planning document prepared on 9 November 2026. All checklists below describe work to execute; they are not claims of implementation, test success, cloud availability or acceptance.
> A: **zerotwobook** (project owner). B: **Atip-Infa** (teammate). Both develop, test, supervise AI, review and participate in deployment.
> Official deadline: **15 November 2026, 23:59 Asia/Bangkok**. This is a detailed Lab 5 workstream within Sprint 2, not a fourth sprint.

## 1. Purpose, scope and source order

Take the accepted **Sprint 1 fastTrack application** to GCP with reproducible containers, persistent PostgreSQL, meaningful CI, a protected release path and traceable deployment evidence. Preserve the Student/Supervisor workflow: supervisor creates a milestone, a team student submits a URL, and the assigned supervisor supplies feedback for that exact submission.

Read these sources before execution:

1. [Original Lab 5 handout](../lab_file/lab5/01_SE_Lab_5_updated.pdf), especially sections 4, 7-9 and 11-12: grading requirements take priority over the kit and summary.
2. [Lab 5 summary](../lab_file/lab5/LAB5_SUMMARY.md) and [starter README](../lab_file/lab5/02_lab5-starter-kit/toktickit-lab5-starter/README.md): navigation and adaptable reference material.
3. [Project skill](../skill/SKILL_Project.md), [Git skill](../skill/SKILL_Github.md), [shared workflow](README.md), [Project stages](GITHUB_PROJECT_AUTOMATION.md) and [main release gate](MAIN_RELEASE_GATE.md).
4. [Sprint 2 plan](02_SPRINT2_LABS5-7.md), particularly sections 2, 4-5, 10 and 13-15: canonical task IDs and sprint dependencies.
5. [Project detail](../Project_doc/project_detail.md), sections 5, 7, 9, 11 and 13; [verified application setup](../Project_code/README.md); accepted [module contracts](../Project_code/docs/contracts).

The reference delivery design is **GitHub Actions -> Artifact Registry -> Cloud Run -> Cloud SQL PostgreSQL**, with Secret Manager and Workload Identity Federation (WIF). These services are the agreed planning direction, not a claim that resources exist. If a different implementation is chosen, record its reason and demonstrate the same required outcomes.

Do not add F-05 team/milestone editing, F-06 revisions or F-07 progress to this initial cloud release. Keep unfinished Sprint 2 features on their task branches. No custom domain, Kubernetes, separate cloud staging, Terraform, load balancer, multi-region setup, monitoring dashboard or load test is required by Lab 5. A rollback rehearsal, WIF, digest deployment and a separate migration job are recommended practices adopted by this plan; they do not add separate rubric points.

## 2. Verified starting snapshot and unresolved inputs

These are read-only observations from 9 November 2026. Recheck before starting a task; do not use this snapshot as permanent live state.

| Item | Observed fact | Execution consequence |
|---|---|---|
| Repository | `zerotwobook/fastTrack`, public | Preserve public access through grading; inspect artifacts for secrets. |
| Current remote main | `10757ce3cfab7cdfcb75a68e8e1c038849ab7e11` | Contains the S1 application and subsequent D1 document upload. |
| S1 release | PR #67 is merged; tag `v1.0.0-sprint-1` resolves locally to `ae7a60a6e3ed0a363dcee920ac1774a02f4f4ab8` | Inspect release acceptance, remote tag and executable diff to current main during R2-J00. Do not move the tag. |
| Sprint 2 integration branch | `origin/staging/sprint-2` was absent after fetch | A coordinates one bootstrap after the baseline decision; do not create two independent staging branches. |
| Existing execution Issues | #13 R2-J00, #14 R2-A01, #15 R2-B01, #16 R2-J01 are open and Backlog at inspection | Reuse them. Existing blocked labels/gates require evidence-based reconciliation, not automatic removal. |
| Source | React/TypeScript/Vite client; Express/TypeScript API; Prisma/PostgreSQL; npm workspaces in `Project_code/` | Adapt delivery to this application. Do not install the TokTickIT app or introduce a second root package. |
| Runtime | `Project_code/server/src/config.ts` validates production origin, DB URL, port, eight-hour session TTL and full release SHA | Extend existing validation only where the agreed cloud contract requires it. |
| Operations | `/api/health` already returns status/version; `/api/ready` needs implementation verification | Reuse health. Add and test DB readiness rather than returning a constant healthy result. |
| Tests | `Project_code/package.json` contains unit, typecheck/build and isolated S1 integration runners | Existing evidence is historical evidence. This planning task has not rerun application tests. |
| Delivery files | No tracked Actions workflow, application Dockerfile or required root `docs/labs/lab-05/deployment.md` was found in the inspected tree | Verify again before creating; the starter's copies do not count as application delivery. |
| Cloud | Project identity, billing, resources, WIF, service URL and serving revision were not inspected | Leave these inputs pending until verified with authorized access. |

Some older documents still describe PR #67 as pending. The observed merge does not authorize a future release or prove every old submission checkbox. Record current S1 acceptance in #13 without rewriting historical decisions or completed cards.

Before implementation, A and B must record:

- [ ] Chosen immutable S1 baseline and intended Sprint 2 staging starting commit; outstanding defects and their impact.
- [ ] Real availability for 9-15 November, individual task owners and reviewer availability.
- [ ] GCP account holder, project ID **and** project number, region, existing resource inventory, credit/billing status and budget owner. Keep credentials private.
- [ ] Public service naming, image repository, runtime/deployer identities, DB connection strategy and migration/seed mechanism.
- [ ] Runtime/operations contract, login throttling decision, exact CI commands, artifact retention and shared-file integration order.

## 3. Requirement-to-work map

| Requirement | Planned work | Owner / verification |
|---|---|---|
| R-01 Docker reproducibility | Production Dockerfile, ignore file, optional local Compose; clean clone build/run | A implements; B reproduces C-03. |
| R-02 Environment and secrets | Complete placeholder examples, validated runtime and environment table | A authors; B checks config/image/log exposure; C-03. |
| R-03 GCP domain workflow | Public same-origin UI/API, real persistent DB, Student/Supervisor journey and rejection | Joint deployment; A records C-04; B independently checks. |
| R-04 Persistence | External DB, safe seed/migration and before/after record checks | A prepares; both execute C-05 across restart and redeploy. |
| R-05 Meaningful PR CI | Lockfile install, unit/type/build, real DB regressions and Docker build | B implements; A checks C-01. |
| R-06 Required passing check | Select the actual CI context in protection; isolated failing PR proves merge blocked | B prepares; A witnesses C-02. |
| R-07 Repeatable main release | Reviewed staging release, CI, main-only deploy pipeline and smoke checks | B coordinates; both verify C-06. |
| R-08 Release identity | Source SHA -> image tag/digest -> serving revision/traffic; repeatable procedure | A supplies runtime identity; B supplies pipeline trace; C-06. |
| R-09 GitHub collaboration | Existing Issues/Project, per-task branches, real peer reviews, staging and release PR | Each author follows section 9; other member reviews. |
| R-10 Lab labels/history | `lab5` labels, retained commits/contracts/PR/run evidence, CI remains mandatory afterward | B checks index/history; each author maintains their work. |
| R-11 Shared participation | Contributions with Issue/commit/PR/review links; both explain sampled steps | Both maintain real contribution records; no equal-commit quota. |
| R-12 Public repository | Public code/Issues/PRs/runs accessible until grading ends | A verifies access; B checks links without privileged assumptions. |

## 4. Task allocation, branches and shared files

The following are **existing work items**, not instructions to create duplicates. Checklist groups inside an Issue may use multiple coherent commits on the same task branch. Create a separate subtask/branch only when the team explicitly splits an independently reviewable outcome.

| Task / real Issue | Lead and reviewer | Branch example | Dependency / output |
|---|---|---|---|
| [R2-J00 / #13](https://github.com/zerotwobook/fastTrack/issues/13) | A+B; A coordinates delivery contract, B cross-checks | `docs/s2-a-cloud-contracts` | Confirm S1 handoff and staging bootstrap; accept the Lab 5 delivery interfaces. The broader S2 contract work in #13 remains separately visible. |
| [R2-A01 / #14](https://github.com/zerotwobook/fastTrack/issues/14) | A implements; B reviews/reproduces | `build/s2-a-docker` | Accepted delivery interfaces; container, configuration, readiness, public-login controls and safe migration/seed runtime. |
| [R2-B01 / #15](https://github.com/zerotwobook/fastTrack/issues/15) | B implements; A reviews/reproduces | `ci/s2-b-pipeline` | Accepted interfaces; CI scaffold may proceed alongside A; Docker integration waits for the real reviewed image contract. |
| [R2-J01 / #16](https://github.com/zerotwobook/fastTrack/issues/16) | A leads runtime/cloud checks; B leads release/evidence coordination | `docs/s2-b-lab5-evidence` for evidence; actual corrections stay on the appropriate task/fix branch | Container/CI gate plus authorized cloud setup; C-01-C-06 and report-source handoff. B is release captain; A reviews B-authored release work. |

The current planning-only change is [R2-A00-L5-PLAN / #80](https://github.com/zerotwobook/fastTrack/issues/80), branch `docs/s2-a-lab5-plan`. It does not start #13-#16. Because sprint staging was absent, it uses the existing documentation-bootstrap convention from inspected main. Its main-targeted PR remains Draft under the release gate.

### 4.1 Shared-file ownership

| Area | Integrator for Lab 5 | Required coordination |
|---|---|---|
| `Project_code/Dockerfile`, `.dockerignore`, local Compose and runtime config | A | B supplies CI build context, image/runtime expectations and review. |
| `Project_code/server/src/app.ts`, startup, health/readiness and auth controls | A | Freeze operational JSON/auth behavior with B before smoke implementation. Preserve accepted domain routes. |
| `Project_code/server/prisma/` and migration history | B remains schema integrator | A proposes any throttle/DB change; B reviews/integrates ordered migrations before dependent code. Never edit an applied S1 migration. |
| Root `.github/workflows/`, Actions pins, GitHub environment/check settings | B | A reviews permissions, triggers, path filters and release restrictions. No paid-resource permission change is implied. |
| Application delivery scripts under `Project_code/` | B for release/smoke; A for provisioning/migration runtime | Agree on script paths, shell/runtime, exit codes and inputs. Do not edit the same script simultaneously. |
| `Project_code/package.json`, lockfile, Prisma tool/runtime packaging | A proposes runtime packaging; B performs agreed shared integration | One integrator per change. B proposes CI scripts to that integrator; avoid simultaneous lockfile churn. |
| `docs/labs/lab-05/deployment.md` | A authors runtime/env/setup sections; B integrates release/CI sections | Coordinate sections; use one canonical file. |
| `docs/labs/lab-05/` evidence index and report source | B integrates; A supplies complete C-03-C-05 sections | Link actual machine-readable evidence; do not invent a second result set. |
| UI/shared design | Existing owners, only if a real deployment defect requires change | Read UI skill and project-detail section 8 first; preserve design and English copy. |

Each owner uses their own clone/worktree. A shared branch is handed over serially for joint work; never run two sessions switching branches in the same working directory.

## 5. R2-J00: baseline and delivery contract before parallel implementation

Use #13 to record each actual decision, its reviewer and commit. Do not close the whole Issue merely because the Lab 5 subset is agreed: #13 also tracks broader S2 interfaces. If those remain open, explicitly record whether the Lab 5-specific dependency is accepted and keep the remaining scope blocked. Do not silently treat a partial checkpoint as full G0.

### 5.1 Baseline and staging

- [ ] Inspect the S1 release/tag, current main, changes since the release, open defects and accepted evidence. Reproduce the agreed baseline when needed; disclose historical results separately.
- [ ] A and B accept the exact product baseline for Lab 5 and record unresolved limitations.
- [ ] A verifies whether local/remote `staging/sprint-2` now exists. If absent, publish it once from the agreed main baseline; if present, inspect ancestry and use a reviewed sync PR instead of resetting it.
- [ ] Both fetch the same staging SHA, verify access and create their own task branches when dependencies permit.
- [ ] Keep unfinished F-05-F-07 work out of the first cloud release. Independent S2 design can continue without claiming cloud acceptance.

### 5.2 Interfaces to decide together

| Decision | Proposed starting point | Required acceptance evidence |
|---|---|---|
| Build/runtime | Existing npm workspace and pinned engine/package versions; API serves compiled client under one origin | Image includes server output, client output, shared `.mjs` modules and generated Prisma runtime; clean image actually starts. |
| Image/job roles | Same release identity, explicit service and migration entry commands; seed is deliberate | Production image or separate reviewed job image contains the tools it actually invokes. |
| Port and shutdown | Read injected `PORT`, listen on all required interfaces, handle SIGTERM | Container external reachability and controlled stop result; do not assume host-only smoke proves Cloud Run readiness. |
| Readiness | Minimal DB query with bounded failure; sanitized 200/503 JSON | Freeze exact keys and timeout, then use those keys in smoke tests. Existing health stays `{status:"ok",version:RELEASE_SHA}`. |
| Database connection | Choose supported Cloud SQL socket/connector or approved network/TLS path | Validate current Prisma adapter/URL behavior; redact all real connection strings in evidence. |
| Authentication | Existing HttpOnly cookie, DB sessions and independent CSRF token; same-origin HTTPS | Preserve `X-fastTrack-Request: 1`, Origin/Referer checks, `X-CSRF-Token`, no-store responses and eight-hour absolute sessions. |
| Public login throttling | Shared state appropriate for multiple instances; evaluate existing PostgreSQL before adding a service | Agree threshold/window/key/retention, client-IP/proxy trust, concurrency, generic errors, bounded cleanup and 429 behavior/tests. No invented threshold is accepted by this document. |
| Migration/seed | Migration before rollout; explicit non-destructive synthetic demo seed | Fresh DB plus existing S1-data upgrade tests; repeated seed preserves passwords, membership, milestones, submissions and feedback. |
| Resource and access model | Separate runtime and deployer identities, main-only WIF, scoped secrets | Human-reviewed permission/resource plan and actual action-specific authorization before billing/IAM/DB changes. |
| First origin bootstrap | Production requires exact HTTPS `APP_ORIGIN`, but first service URL may not yet be known | Agree how to obtain/configure the real service origin before business testing. Do not disable source/CSRF checks or use a placeholder as final config. |

## 6. R2-A01: A's development checklist

### 6.1 Container and configuration

1. Inspect the existing workspace, `.node-version`, `.npmrc`, lockfile and build scripts. Keep one root application workspace under `Project_code/`.
2. Write a multi-stage production Dockerfile in `Project_code/`: deterministic install, generated Prisma client, server/client builds and a non-root runtime. Validate the pinned toolchain/image instead of copying starter Node versions.
3. Include runtime-required `shared/` modules, generated Prisma engine/client assets, client fonts and built frontend. Verify migration/seed entrypoints against the chosen production dependencies: Prisma CLI and `tsx` currently appear in development dependencies and cannot be assumed present after pruning.
4. Add `.dockerignore` excluding real env files, local dependencies, test outputs, Git data and credentials. Keep files needed by build and migration jobs. Inspect image history/files without printing secrets.
5. Add local Compose only if it improves reproducibility. Use named DB persistence, a readiness condition and placeholder credentials. Document how to stop without deleting data; destructive volume removal is never a persistence test.
6. Inventory all environment reads across app, scripts, tests, seed and delivery. Keep the existing server example canonical or clearly document the chosen example layout. Distinguish runtime, build, test-only, seed-only and GitHub settings.
7. Extend `Project_code/README.md` only with commands actually verified during implementation. Put environment purpose/secret/source and cloud release instructions in root `docs/labs/lab-05/deployment.md`.

Minimum runtime inventory to verify: `NODE_ENV`, `PORT`, `APP_ORIGIN`, `DATABASE_URL`, `SESSION_TTL_HOURS`, `RELEASE_SHA`; test-only `TEST_DATABASE_URL`; explicit seed-only `DEMO_SEED_PASSWORD`. Additional throttle/connection variables require documented validation. Never pass DB/seed secrets to the Vite client bundle.

### 6.2 Runtime, data and public security

- [ ] Reuse health/release SHA; implement `/api/ready` with a real bounded DB query, sanitized errors and 503 on failure. Test failure on an isolated environment, not by breaking the grading DB.
- [ ] Verify container port injection, all-interface binding, static asset serving, deep links, JSON API 404 behavior, graceful shutdown and same-origin routing.
- [ ] Preserve production Secure cookies, login source checks, CSRF, session revocation, role/team scope and private-response cache policy over HTTPS/proxying.
- [ ] Implement the agreed shared login limiter; coordinate migration with B if PostgreSQL is used. Test threshold, expiry, concurrent requests, trusted proxy/IP behavior and sanitized 429 responses without leaking account validity.
- [ ] Keep sessions and all domain records in PostgreSQL; audit for filesystem/in-memory state that would break cross-instance correctness. Request-scoped memoization is not persistent session storage.
- [ ] Migration is an explicit job/command before service rollout. No database reset, schema push or development migration command against cloud production.
- [ ] Explicit demo seed adds missing synthetic records without resetting existing users, passwords or domain data. Verify both first seed and repeat seed. Keep demo account passwords outside Git, logs and chat.

### 6.3 A's tests and handoff to B

- [ ] Existing relevant unit/type/build and real-DB regressions pass at the current task head; add behavior tests only for the runtime/security changes that need them.
- [ ] Clean clone at the candidate commit builds and runs with documented placeholder configuration filled privately.
- [ ] B independently follows Docker/run instructions, uses the real DB, restarts the app and reads the same milestone/submission/feedback and valid session.
- [ ] Record exact commands, exit codes/results, tested SHA, image identity, record IDs and unresolved limits. Local persistence is preparation for cloud C-05, not a substitute.
- [ ] Provide B the env/health/readiness/entrypoint contract, changed files, reproduction instructions and specific review focus. Open the Draft PR after the first coherent pushed commit, not only after all checks finish.

## 7. R2-B01: B's development checklist

### 7.1 Meaningful CI on actual branches

1. Place workflows at repository-root `.github/workflows/`; set app working directory/build context to `Project_code/`. Use the actual lockfile and pinned runtime.
2. Trigger on every relevant PR to `main` and `staging/sprint-*`. Avoid path filters that leave a required check missing or silently skip application tests after shared/workflow changes.
3. Run lockfile installation, `npm run typecheck`, `npm test`, build and meaningful PostgreSQL-backed S1 regressions, plus Docker build once A's reviewed image contract is available.
4. Evaluate the existing `npm run test:j03:isolated` chain for the chosen CI runner. It composes inherited S1 checks and Docker-managed disposable PostgreSQL. Adapt environment/runtime only if necessary; never substitute an in-memory mock for DB/persistence tests. If a service-container alternative is chosen, preserve explicit test DB guards and migration scenarios.
5. Define one stable aggregate required context, for example `test-and-docker`, only after observing the actual emitted check name. A skipped/cancelled dependency must not make the aggregate falsely pass.
6. Publish actual test summaries and machine-readable results as appropriate, without cookies/passwords/connection strings. Set useful retention and keep rubric evidence durable through grading and Lab 7.
7. Add offline script tests where behavior matters: migration failure prevents service update; missing image/digest stops; rollback uses an existing image without migration/seed. A mock command-order test does not prove GCP deployment works.

### 7.2 Merge gate and temporary failing proof

- [ ] Inspect current rulesets first. Preserve real peer approval, stale-approval dismissal, conversation resolution, force-push/deletion restrictions and no-bypass policy.
- [ ] After a real workflow run exists, require its actual passing context on `main` and sprint staging; verify up-to-date policy and branch targeting. Never select a guessed or obsolete check.
- [ ] Execute C-02 only under section 9.5's controlled proof exception. The evidence must be a **normal, non-Draft PR** with a real failed required test and merge-blocked state, not a Draft-only merge restriction.
- [ ] Record exact rules/check name, PR head/base and failed run; close the proof without merging. Preserve its commits/PR/run history; do not mark the broken implementation accepted.

### 7.3 Release pipeline, smoke and identity

- [ ] Configure a main-only GitHub environment such as `demo`; record real `GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT` and other agreed identifiers as variables, not guessed values.
- [ ] Prepare WIF and deployer permission changes for human review. Match actual repo/owner IDs, workflow, ref and environment subject; avoid service-account JSON keys and broad Owner/Editor pipeline credentials.
- [ ] Normal main release: validate trigger/ref -> CI -> build/push SHA-tagged image -> resolve immutable digest -> run migration job -> update service -> check readiness/HTML/business-safe smoke -> publish factual summary.
- [ ] Propagate the **actual source commit built by the deployment workflow**, including a main merge commit when applicable, into runtime `RELEASE_SHA`. Do not confuse PR head SHA with the deployed main SHA.
- [ ] Serialize deployments; do not cancel an in-flight migration. Inspect step failure logs before changing permissions or rerunning a partially applied migration.
- [ ] Smoke checks validate health JSON/version, real DB readiness JSON and HTML. Optional authenticated read uses a dedicated low-privilege account, cookie jar, source header, CSRF and logout. Missing optional credentials means SKIP login, not PASS login.
- [ ] Keep unauthenticated health checks free of private records; never use the starter's `/api/categories` or bearer-token assumptions for fastTrack.
- [ ] Manual image rollback, if implemented, accepts a full known image SHA, resolves its digest and skips migration/seed. Verify schema compatibility first; there is no automatic data/schema reversal.
- [ ] Report service URL, source SHA, image tag/digest, migration execution, serving revision, traffic and actual smoke outcomes. A green pipeline alone does not prove C-04/C-05.

### 7.4 B's handoff to A

A checks actual event coverage, test assertions, DB guards, build context, permission scope, main-only deploy enforcement, migration failure behavior, secret redaction and traceability. B supplies the PR/commit, actual commands/runs/results and remaining cloud prerequisites. CI can be developed while A builds the container, but integrated Docker/release checks wait for the reviewed dependency and real runtime contract.

## 8. R2-J01: joint cloud execution and release

### 8.1 Cloud setup: A leads, B checks every proposed change

1. Follow handout section 4.4 and Student Guide Episode 1 for the account/project. Use one member's eligible personal Gmail Free Trial, not the university account. If payment, Upgrade or a closed billing account appears, stop that action and contact the TA; do not pay or change the access method silently.
2. Inspect existing resources before provisioning. Record project ID/number, region, enabled APIs, service names, DB/registry/storage, current access and cost controls. Avoid duplicate projects or duplicate SQL instances.
3. Prepare a concrete resource/permission plan and proposed commands or Console changes. The user must inspect them before execution; billing, IAM and database mutations require explicit applicable authorization. Planning, dry-run output or a previous unrelated approval is not that authorization.
4. Propose a budget alert before paid resources; explain that alerts do not cap spending. Recheck current credits/prices/quotas before provisioning. Do not treat historical guide estimates as current quotes.
5. Scope resources: small supported PostgreSQL tier, appropriate storage/backup choices, storage auto-increase reviewed, Cloud Run min instances 0/max 3 or fewer as the reference cost controls. Confirm concurrency/DB connection-pool capacity and login limiter behavior across allowed instances.
6. Separate runtime and deployer identities. Runtime needs DB access and only its required secrets; deployer needs scoped image/service/job update and runtime impersonation rights. WIF grants the intended GitHub principal access to the deployer. Do not repeatedly grant provisioning/Owner rights during normal releases.
7. Review database connectivity, secret mapping, migration-job execution and exact service origin. A prepares app/runtime inputs; B checks workflow/environment/WIF inputs. Never display secret values in evidence.
8. Apply only authorized changes, verify the resulting inventory and record real sanitized outputs. Console-only setup still belongs to an Issue with evidence. Either person must be able to explain the commands, permissions and resulting resources.

### 8.2 First deployment and protected visible-change release

- [ ] Container/CI gate is accepted; authorized cloud resources and runtime secrets are ready.
- [ ] Follow the documented first-deploy procedure with an immutable image and explicit migration. If first deployment uses a reviewed manual bootstrap, record that honestly; it does not replace C-06's main-pipeline release.
- [ ] Verify HTTPS URL, exact `APP_ORIGIN`, health/version, readiness/DB, client assets/deep links and cookie/source behavior from an external browser.
- [ ] Use private synthetic Student/Supervisor accounts to perform the real domain journey; prepare separate teams/supervisors for access rejection.
- [ ] Choose a small visible change within accepted S1 scope, such as a deployment-related help-text clarification. Record it in an existing scoped Issue or a justified new Issue. It must not silently change an accepted business rule or redesign the app.
- [ ] Author uses a task branch -> early Draft PR -> complete checks -> teammate review -> authorized staging merge. B assembles the release PR from `staging/sprint-2` to `main` as Draft.
- [ ] Present the concrete current release head/base, diff, actual checks, behavior, risks and preview/reproduction to the user. Keep Draft until explicit user authorization for that candidate; renew if head/base changes.
- [ ] After authorization, obtain the real non-author peer review, pass protection, and let the authorized maintainer merge. This document never authorizes self-approval or a merge.
- [ ] Verify the resulting main commit, pipeline, image/digest, migration job, deployed revision and actual traffic. Compare `/api/health` version to the source commit built by that pipeline and verify the visible change at the URL.
- [ ] After the release, sync main ancestry back into staging through a reviewed sync branch/PR when necessary. Do not squash away the sync ancestry or force-push staging.

### 8.3 Persistence and safe rollback rehearsal

Use synthetic data whose IDs and expected relationships can be recorded. Keep user passwords, session cookies and CSRF values out of the evidence.

1. Before disruption, supervisor A creates a future milestone for Team A; student A submits a URL; supervisor A writes feedback. Record the milestone/submission/feedback IDs, submission version/author/time and feedback association; capture the visible URL and release identity.
2. Perform an actual controlled **application process/container restart** while preserving the external DB. Cloud Run is not assumed to have a generic restart button: agree on a concrete supported method and evidence. A new revision alone cannot be counted twice as both the distinct restart and redeploy experiments.
3. After restart, read the same records through the app/API, verify exact IDs/content/association and valid-session behavior within its eight-hour TTL. Do not reseed lookalike records as a substitute.
4. Release the visible change through the reviewed main pipeline. Then read the same IDs again, with before/after public URL and commit/revision evidence. This is the separate redeploy proof.
5. Record who executed/witnessed each operation, command or Console action, timestamp, old/new process or revision, record IDs, expected/actual results and screenshots.
6. If rollback is rehearsed, verify old-image/new-schema compatibility first and use an existing immutable image. Migration/data rollback is outside that operation. Do not delete records, volumes or the cloud DB to demonstrate persistence.
7. Do not pause the assessed service/DB while grading, partner UAT or active deployment requires it. Rehearsals must be scheduled and bounded; destructive DB recovery exercises use a separate authorized environment.

## 9. GitHub runbook for both owners

### 9.1 Start the day and bootstrap safely

Run read-only checks in your own clone; inspect actual output before mutations:

```powershell
git status --short --branch
git remote -v
git fetch origin
git branch -r --list 'origin/staging/*'
gh issue view 13 --repo zerotwobook/fastTrack
gh issue view 14 --repo zerotwobook/fastTrack
gh issue view 15 --repo zerotwobook/fastTrack
gh pr list --repo zerotwobook/fastTrack --state open
gh project field-list 3 --owner zerotwobook --format json
```

Resume an existing Issue/branch/PR for the same task. Preserve uncommitted work; do not reset, clean or stash another person's files to make examples run. For a new task, verify baseline/dependencies and branch existence first, then create only the relevant branch from synchronized sprint staging:

```powershell
# A only, when starting the new R2-A01 task:
git switch -c build/s2-a-docker origin/staging/sprint-2
# B uses B's separate clone, when starting the new R2-B01 task:
git switch -c ci/s2-b-pipeline origin/staging/sprint-2
```

These are branch examples, not commands to run consecutively in one clone. If staging is absent, finish section 5.1 first. A missing staging branch does not permit application implementation directly on main. Planning-only bootstrap PRs remain subject to the main release gate.

### 9.2 Issue, Project and PR lifecycle

Use [Project 3](https://github.com/users/zerotwobook/projects/3) and existing task metadata. Every Lab 5 Issue/PR has `lab5`, the relevant owner/sprint labels, Lab 5 milestone when applicable, real assignee, Task ID, dependencies and reviewer. Do not create permanent A/B branches or duplicate #13-#16.

| Moment | Required action and read-back |
|---|---|
| Receive task | Reuse/register Issue as Backlog, Sprint 2, actual Owner and Task ID; Verification NOT RUN, Acceptance PENDING. |
| Scope understood | Review source/contracts, checklist, dependencies and shared-file owners; save/read back Backlog -> Specified now. |
| Ready to edit | Verify required predecessor/gate decisions and isolated branch; save/read back Specified -> Started **before task-file edits**. |
| First coherent real commit | Review scoped diff, commit/push; open Draft PR during Started, immediately add its Project card and initialize actual metadata as Started. No empty commit to manufacture timing. |
| Remaining development/checks | Keep both cards Started; record actual outcomes. A failed pre-handoff test is Verification FAILED, not a fabricated review finding. |
| Staging peer handoff | Complete checks/evidence, mark ready, move/read back both cards to PR Review and request the other member. |
| Main candidate pending user review | Keep main PR Draft and task at its true preparation stage; author Verification may be PASSED while Acceptance remains PENDING. Do not force PR Review to satisfy a template. |
| Actual review/check finding | PR Review -> Fixing; fix same branch/PR; rerun affected checks; return to PR Review when genuinely ready. |
| Accepted merge | Verify current-head peer acceptance, criteria and actual integration merge. Read back native PR -> Done; reconcile Issue closure/Done/Acceptance separately. A task merge does not accept the cloud release or coursework. |

Append real timestamps, from/to, reasons and available branch/PR/commit in the Issue body. Preserve existing text and history. Do not batch earlier states at handoff, replay completed cards, invent approvals or rely on `Closes` to close a staging-targeted Issue automatically. Inspect any native linked-Issue automation that moves a card unexpectedly before reconciling its real state.

### 9.3 Commit, early Draft and peer review

- Stage only the intended paths after reviewing `git diff`, `git diff --cached` and `git diff --check`. Check for secrets, generated files and unrelated changes. Do not use `git add .` by default.
- Use English commits describing behavior, for example `build: package fastTrack for Cloud Run` or `ci: verify pull requests against PostgreSQL`.
- Push and verify the remote head SHA. Open a Draft PR to `staging/sprint-2` after the first coherent commit. Use the repository PR template and actual Issue linkage; initialize its Project card immediately.
- Complete implementation, tests and honest evidence on that same PR. The other member checks the current head, reproduces the relevant happy path and rejection/failure case, and states a specific check/finding/reason in their own review.
- AI can prepare review text and analyze code, but cannot provide the teammate's human approval or post messages as a person without explicit instructions. Do not send emails/chat messages or publish review comments merely because the plan includes a handoff.
- A/B may perform independent work while a review waits. Dependent work waits for the stated accepted interface/gate. Do not bypass protection to recover time.

### 9.4 Main release and subsequent synchronization

Only main deploys. Release captain B inspects the **full staging-to-main diff**, not only the last commit, and verifies that no unfinished S2 feature is included. The current user review requirement is [MAIN_RELEASE_GATE.md](MAIN_RELEASE_GATE.md): keep Draft until the user reviews and explicitly authorizes the exact head/base. B approval, a green check, staging integration, generic continuation or silence is insufficient.

After user authorization, real non-author peer review and passing checks still apply. Reassess authorization and stale approvals when head/base changes. Verify the actual merged state before saying released; pipeline success and serving revision must then be checked separately.

After release, if main is not already an ancestor of staging, create an isolated sync branch from latest staging, merge main into it, resolve conflicts with owners, verify affected checks, then peer-review/merge the sync PR preserving ancestry. Both fetch and merge latest staging into active task branches without rewriting shared history.

### 9.5 Controlled C-02 exception: failing proof PR

The repository's documented exception is a temporary branch from **current main**, with a normal PR into main containing only the failing-test proof. It is excluded from the ordinary staging release path.

1. B first verifies an accepted working release, actual required check and matching ruleset. A reviews the minimal proof scope, which must not change deployment configuration or production data.
2. Obtain explicit authorization for this controlled main-targeted proof and the exact head/base before lifting Draft. The general main rule otherwise requires Draft; permission to write this plan is not permission to open a ready failing main PR. Record that the authorized action is an evidence experiment that **must never merge**, not a release authorization.
3. Create a fresh temporary branch, add one harmless isolated failing assertion that the real required CI executes, push and open the Draft during Started. After the specific proof authorization, make it a normal non-Draft PR for observation; do not request a false approval or enable auto-merge.
4. Capture the failed named test, required-check result and blocked merge at that head/base. Show that the failed required check itself is a blocking condition; an absent approval or Draft state alone is not proof of R-06.
5. A witnesses/read-backs the gate. Close without merging and retain branch/commit/PR/run evidence. The parent #15 can accept the completed gate experiment; the intentionally broken proof PR is not an accepted implementation merge or a Done release card. Record closed-unmerged disposition honestly.

### 9.6 Protected settings and approvals boundary

Inspect real rules, branch patterns, environments and WIF before every change. Select check names emitted by this repository. Preserve required review, up-to-date policy, no bypass, stale-review dismissal and protected history. If permissions block setup, record the exact missing capability; never disable checks, weaken branch protection or broaden IAM as a shortcut. Cloud action authorization and main release authorization are separate decisions with different scopes.

## 10. Verification design and evidence ownership

### 10.1 Verification levels and commands

| Level | Existing starting point / planned addition | What it can establish |
|---|---|---|
| Source/config | Review actual env reads, workflow triggers, secret scope and image contents | Contract/configuration checks; no cloud success claim. |
| Unit/type/build | From `Project_code/`: `npm ci`, `npm run typecheck`, `npm test`, `npm run build` | Real unit/type/build results at the tested head. |
| Integrated S1 | Existing `npm run test:j03:isolated`, with its documented Docker/test-DB prerequisites | Real inherited DB/HTTP/system and migration checks. Inspect current reporter instead of copying historical test counts. |
| New runtime/release behavior | Readiness/limiter tests and offline migration/rollback failure tests added by owners | New assertions at current commit; offline release mocks do not prove live deployment. |
| Clean container | New documented Docker/Compose commands in a fresh checkout | C-03; local DB/port/static/runtime reproducibility. |
| Public cloud | Browser/API journeys, actual restart, reviewed redeploy and revision/traffic checks | C-04-C-06. Health checks alone cannot establish these outcomes. |

Commands above are an inventory of existing scripts to inspect/use, not new test results. The final exact CI/build/migration commands must be executed and recorded during implementation. Do not run cleanup-capable integration fixtures against the cloud or a shared development database. Existing disposable DB guards must remain active.

### 10.2 Required checks C-01-C-06

| Check | Procedure / expected result | Evidence and lead |
|---|---|---|
| C-01 | Normal relevant PR runs meaningful build/tests and passes at recorded commit | B: PR URL, run URL, actual check/test names, summary/counts and SHA. A inspects assertions/results. |
| C-02 | A real required failing test blocks a normal temporary PR from merging | B: proof PR, failed run, ruleset/check selection, readable blocked-merge capture and exact head/base. A witnesses. |
| C-03 | New clone, privately filled documented env, build/run with real DB | A: commands, versions, commit, outputs and running image/container/DB. B independently reproduces. |
| C-04 | Public supervisor milestone -> student submission -> exact-version feedback; one cross-team/role/deadline rejection with no unauthorized write | A: role/preconditions/steps/expected/actual and URL-visible captures. B tests both roles and a rejection. |
| C-05 | Existing milestone/submission/feedback remain after separate restart and redeploy | A: original IDs/relationships, before/after records, operation method, timestamps, URL and old/new release identity. B verifies exact readback. |
| C-06 | One labelled reviewed change traverses staging -> main -> pipeline, serving revision matches built source | B: Issue/task PR/specific peer review/release PR/run URLs, actual main SHA, image tag/digest, revision and traffic/version check. A cross-checks. |

The main C-04 rejection should use a safe synthetic fixture: Supervisor B tries to read Team A's submission/feedback, or a Student attempts a supervisor-only mutation. Add deadline/duplicate behavior where practical to demonstrate S1 continuity; record actual response/error and unchanged data. Do not intentionally modify real users' work.

Every evidence entry includes file/test name, command or run, actual outcome and tested commit. Screenshots have numbered captions with check/requirement, source URL/run/commit and readable text. Capture only what direct links cannot establish. Redact credentials, cookies, CSRF tokens, secret values and connection strings before retaining evidence.

### 10.3 Canonical documentation and artifact layout

Create these application-delivery documents **during execution**, reusing existing paths if the repository has since added them:

```text
workflow/04_LAB5_DELIVERY_PLAN.md          Work allocation and execution instructions (this file)
Project_code/Dockerfile                  Proposed application build/runtime recipe
Project_code/.dockerignore               Proposed context exclusions
Project_code/<agreed-compose-file>       Optional local app/DB recipe
Project_code/<agreed-delivery-path>/     Owned provisioning/release/smoke/job scripts
.github/workflows/<ci-workflow>.yml      Root PR verification
.github/workflows/<deploy-workflow>.yml  Root main release workflow
docs/labs/lab-05/deployment.md            Required canonical deployment guide
docs/labs/lab-05/evidence-index.md        Proposed C-01-C-06/rubric index
docs/labs/lab-05/report.md                Proposed Answer Part 0-4 Markdown source
docs/labs/lab-05/evidence/                Only actual selected captures/output references
```

Angle-bracket names are unresolved path choices, not files claimed to exist. Keep application tests/results under existing `Project_code/` conventions and link them from the root index. Do not copy historical machine-readable results as fresh runs. New project documentation/evidence narratives/handoffs are Markdown. Retain instructor PDFs and actual machine-readable results unchanged.

Minimum `deployment.md` sections: stack/deviations; prerequisites/toolchain; env table (name, purpose, secret status, source, scope); clean build/test/run; migrations and explicit seed; actual GCP project/region/resource names; public URL/auth access instructions without passwords; normal release; source/image/revision lookup; controlled restart/persistence; failure diagnosis; rollback limits; cost/availability/cleanup responsibilities.

## 11. Report source, submission and Lab 6 handoff

The instructor requires one concise PDF per team on LEB2 named `lab5_sec<section>_<group name>.pdf`, due **15 November 2026 at 23:59 Asia/Bangkok**. The repository instruction is to prepare Markdown; **the user assembles/exports the final report**. Do not generate, rebuild or export a PDF without an explicit user request. Writing this plan does not authorize LEB2 submission.

| Required report heading | Points | Section author / cross-check |
|---|---:|---|
| Answer Part 0: Team and Evidence Index | Required, no separate points | Both provide real names/student IDs/GitHub identities, team/topic, public repo, submitted tag/commit, serving URL/commit, contributions and direct evidence index. B integrates; A checks. |
| Answer Part 1: CI and Quality Gate | 30 | B writes workflow/settings and C-01/C-02; A verifies links/results/blocked gate. |
| Answer Part 2: Docker and Reproducible Configuration | 20 | A writes Docker/env/C-03; B reproduces clean build and reviews configuration. |
| Answer Part 3: GCP Deployment and Persistence | 35 | A writes public flow/service/DB and C-04/C-05; B independently checks. |
| Answer Part 4: Repeatable Release Pipeline | 15 | B writes labelled Issue/PR/review/run/revision chain and C-06; A checks exact identity/procedure. |

Evidence index: at least one row per scored rubric part, with artifact/direct link, C/R IDs, version and real verification result. Use one or two explanatory sentences per link. Do not reward document length, prompt counts or equal commit counts over observable behavior.

Before final handoff:

- [ ] Both review the final Markdown content and all direct links, captions and secret redaction at the submitted version.
- [ ] Record submitted tag or commit and serving commit separately; a later report-only commit need not be misrepresented as a newly built app.
- [ ] User performs final PDF assembly/export/upload, unless separately requesting assistance. Record only a real submission receipt; leave pending otherwise.
- [ ] Keep repo public and the service available until the instructor announces grading is finished. Do not follow generic idle-pause advice during this availability obligation.
- [ ] Prepare private dedicated demo accounts for both roles and record the fixed release/URL/known limitations for the Lab 6 partner. The user shares credentials privately and sends external messages; do not send them automatically.
- [ ] Retain pipeline/contract/CI history and required checks for Lab 6 fixes and Lab 7 metrics. Do not recreate the app/project/pipeline for later labs.

## 12. Gates, proposed schedule and dependency handling

This schedule is a proposal for 9-15 November, not a record of work performed. Confirm A/B availability and cloud access first. Adjust pending work openly when external dependencies slip; do not invent earlier evidence to meet dates.

| Window (Asia/Bangkok) | A leads | B leads | Exit evidence / dependency |
|---|---|---|---|
| 9 November | S1 baseline/runtime/env audit; Docker and resource plan | CI/test/protection/WIF audit; contract review | Lab 5 portion of R2-J00 agreed; staging bootstrap and unresolved S2 scope explicit. |
| 10 November | Container/readiness/limiter implementation; migration packaging | CI and release-script scaffold; actual event coverage | Early Draft PRs/cards exist; shared contracts/version/paths agree. |
| 11 November | Fresh local build/run and safe seed/migration/persistence | Integrated Docker/real-DB CI; reviewer reproduction | **L5-G1 Container/CI**: both reproduce the app+DB; required check exists; no cloud claim yet. |
| 12 November | Authorized GCP runtime/DB setup and first public flow | Authorized WIF/environment integration; deployment smoke | **L5-G2 First cloud**: real service origin, DB and safe accounts work; resource inventory known. |
| 13 November | Public C-04/restart proof; review release workflow | C-02 controlled proof and reviewed visible-change release preparation | User reviews exact release candidate; required peer review; no bypass if authorization waits. |
| 14 November | Witness redeploy/read exact records; write Parts 2-3 | Pipeline/revision C-06; Parts 1/4; integrate Markdown | **L5-G3 Release/persistence**: C-01-C-06 real evidence; source/digest/revision/traffic agree. |
| 15 November | Check contributions/URLs/config and final source | Validate index/links/captions; hand off report source | **L5-G4 Submission readiness**; user exports/uploads before 23:59; availability obligation remains. |

Gate decisions must name A/B reviewer, tested version, actual checks/findings and remaining risks. L5-G1 corresponds to Sprint 2's container/CI gate; L5-G3/G4 provide the Lab 5 release/evidence part of Sprint 2 G2. These labels refine the existing gates rather than replacing them.

The critical path is accepted S1/delivery interfaces -> integrated container+CI -> authorized cloud/runtime+identity -> user-authorized reviewed main release -> distinct persistence proofs -> evidence/source review. A can prepare runtime/tests while B prepares CI/templates. B cannot certify Docker integration before A's image is available; neither can certify cloud persistence using offline tests.

If #13's broader F-05-F-07 specification is unfinished, record a reviewed delivery-specific checkpoint and exact scope permitted to proceed. Keep unresolved dependencies visible. If cloud access, main authorization or required peer review is unavailable, finish independent documents/tests and report the precise next human action; do not silently mark the gate accepted.

## 13. Risk and recovery decisions

| Finding / risk | Response and owner |
|---|---|
| Docker starts locally but cloud assets/Prisma/shared modules are missing | A inspects final image/runtime paths and actual entrypoint. Rebuild/test immutable candidate; B reruns affected CI. |
| Runtime image lacks migration CLI or seed loader | A/B agree a job image or explicitly packaged tools; test real commands. Do not assume development dependencies survived pruning. |
| HTTPS login fails due to origin/cookie/proxy configuration | A inspects real origin/source/cookie handling; preserve auth security. B checks smoke headers and cookie jar. |
| Parallel login requests evade per-instance limiter | A implements accepted shared-state design with B's schema review; test concurrency. Instance affinity is not a substitute for shared correctness. |
| Failed CI still permits merge or PR CI never runs | B inspects Active rules, branch patterns, actual check selection and skipped contexts; preserve protection and reproduce C-02. |
| WIF/token or permission error | B checks actual principal/ref/environment/workflow and scoped role binding; obtain authorization for necessary IAM changes. Do not generate a JSON key or grant Owner as a workaround. |
| Migration fails after partial DB changes | Stop rollout, inspect job output and current schema; A/B plan recovery with backup/compatibility review. No blind retry, destructive reset or automatic reverse migration. |
| Smoke fails after service update | Record failed deployment honestly; inspect version/traffic/logs. Choose compatible rollback or roll-forward deliberately; no assumed automatic recovery. |
| Restart evidence is only another redeploy screenshot | A records a distinct actual restart method and same-record readback; B checks provenance. Do not claim C-05 complete until both operations are evidenced. |
| Secret reaches Git/image/log/screenshot | Stop exposure; authorized owner rotates the secret at its actual source, updates references/redeploys and informs TA. Deleting the file alone does not remove the leaked credential/history. |
| Resource/billing action is blocked | Preserve the exact error, sanitize evidence and involve account holder/TA. Do not pay, Upgrade, bypass review or weaken permissions. |
| Main changed after candidate review | B refreshes exact head/base, evaluates checks/diff and obtains renewed user authorization; previous authorization does not transfer silently. |
| Deadline arrives before proof is complete | Both report actual incomplete items and next action; retain real failed/pending results. Never fabricate cloud/test/review/submission success. |

## 14. Reusable Issue, review and AI handoffs

Use the existing repository templates. The following English fields can supplement the current task Issue body without deleting other members' records:

```markdown
Task ID / owner / reviewer:
Scope and excluded work:
Accepted dependencies and contract commit:
Owned paths / shared-file integrator:
Acceptance criteria and R/C mapping:
Planned commands/tests and safe environment:
Actual results with command/run, test name and commit:
Cloud/main authorizations needed or already recorded for this exact action:
Remaining findings and next owner/action:
Progress log: actual time | from -> to | reason/evidence | branch/PR/commit
```

Author handoff:

```text
Task / Issue / PR:
Exact head and target base:
Changed behavior and paths:
How to reproduce safely:
Actual checks/results and evidence links:
Known limits and requested review focus:
Status / Verification / Acceptance:
Next action and required human decision:
```

Peer review must be written by the actual reviewer after checking the candidate. A useful review identifies the exact head, environment, checks performed, observed results and findings/reason for approval. Do not prefill an approval or impersonate the teammate. The release handoff additionally identifies actual built source SHA, image/digest, migration execution, serving revision/traffic and public URL.

AI starting prompt for A:

```text
I am A (zerotwobook), working on R2-A01 / Issue #14.
Read AGENTS.md, skill/SKILL_Project.md, skill/SKILL_Github.md,
workflow/README.md, workflow/02_SPRINT2_LABS5-7.md and
workflow/04_LAB5_DELIVERY_PLAN.md. Inspect live Issue/PR/branch state first.
Verify the actual R2-J00 delivery checkpoint and staging/sprint-2 baseline.
Use my isolated task branch; write application delivery code under Project_code/.
Coordinate migrations, manifests and readiness/smoke contracts with B.
Complete Docker/runtime/env/readiness/public-login controls and meaningful checks.
Save/read back Project stages at the correct time and open an early Started Draft PR.
Report actual results and B's review instructions. Keep cloud billing/IAM/DB actions
and main integration behind the applicable concrete user authorizations.
Use English for artifacts. Do not export PDFs or invent tests/approval/deployment.
```

AI starting prompt for B:

```text
I am B (Atip-Infa), working on R2-B01 / Issue #15.
Read the same project/Git skills and workflow files, then inspect live state.
Use B's separate clone and task branch from accepted staging/sprint-2.
Own CI, actual required checks, release/smoke scripts and release traceability.
Preserve fastTrack cookie/CSRF/origin and PostgreSQL test guards; adapt the kit.
Integrate A's reviewed image/runtime contract before claiming Docker/deploy success.
Record real stages, open the early Draft PR and provide actual checks for A.
Prepare C-02 as an isolated authorized never-merge proof, not a broken release.
Keep main PRs Draft until the user reviews/authorizes their current head/base.
Do not grant cloud permissions, self-approve/merge, send messages or export PDFs
without the authorization required for that specific action.
```

## 15. Final Lab 5 acceptance checklist

- [ ] Agreed immutable S1 baseline; delivery-specific R2-J00 checkpoint and unresolved broader S2 scope recorded honestly.
- [ ] Clean clone builds/runs with documented env and real DB; final image contains app/assets/shared/Prisma and actual job tooling.
- [ ] All env settings documented; no real secret in source, image, client bundle, logs, evidence or report.
- [ ] Public HTTPS URL supports the real Student/Supervisor workflow plus a meaningful rule/access rejection.
- [ ] Sessions/domain data use external persistence; the same recorded IDs survive distinct restart and redeploy checks.
- [ ] Public-login controls, source/CSRF/cookie policy and DB readiness behave as accepted and tested.
- [ ] Relevant staging/main PRs have meaningful build/automated DB tests and actual Docker verification; failed required check blocks merging.
- [ ] Controlled normal failing proof PR is preserved and closed unmerged; broken code never reaches the release path.
- [ ] Reviewed release from staging into main has explicit current-candidate user authorization, real peer acceptance and actual pipeline deployment.
- [ ] Built main SHA, image tag/digest, serving revision/traffic and health version agree; procedure can be repeated.
- [ ] C-01-C-06, deployment.md, evidence index, Answer Part 0-4 Markdown and both members' real contributions are complete and cross-checked.
- [ ] User handles final PDF export/upload or explicitly requests it; only a real receipt is recorded as submitted.
- [ ] Public repo and service remain available through grading; history/required CI and safe Lab 6 handoff remain intact.

Completing the planning document alone satisfies none of these execution checkboxes. Update actual task/gate records as work happens, and keep implementation, verification, human acceptance, release and course submission distinct.
