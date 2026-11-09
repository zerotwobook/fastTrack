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
