# R2-B01 / R2-J01: Phase A Live Gate, Environment, WIF and Release Preparation Plan

**Selected Phase:** Phase A — Discovery and Plans (no unapproved GitHub settings or GCP mutations executed)
**Task Scope:** R2-B01 ([Issue #15](https://github.com/zerotwobook/fastTrack/issues/15) — live CI checks, rulesets, `demo` environment, WIF and C-02 proof) and R2-J01 ([Issue #16](https://github.com/zerotwobook/fastTrack/issues/16) — initial cloud/release orchestration)
**Owner:** B (`@Atip-Infa`) | **Reviewer:** A (`@zerotwobook`)
**Timestamp:** 2026-11-11T00:35:00+07:00 (Asia/Bangkok)
**Task Branch:** `docs/s2-b-live-gate-plan` from `staging/sprint-2` (`8edab6f30c051a1a8f6c0d1a2222af5f2125fc9e`)

---

## 1. Verified Live Repository, Branch and Project Snapshot

All observations below were read back from live GitHub APIs and the fetched repository on 2026-11-11 (Asia/Bangkok):

| Item | Verified Current State | Consequence for Execution |
|---|---|---|
| Repository | `zerotwobook/fastTrack` (`PUBLIC`), Repo ID `1446690639`, Owner ID `135503171` | Numeric IDs verified for OIDC attribute conditions; public access holds. |
| Current Actor Permission | `@Atip-Infa` authenticated via `gh` with scopes `gist, project, read:org, repo, workflow`; repo `viewerPermission`: **`WRITE`** | `@Atip-Infa` lacks **`ADMIN`** privileges on `zerotwobook/fastTrack`. Ruleset edits and environment setup require repo owner (`@zerotwobook`) execution or admin authorization. |
| `origin/main` | `b7174a7` (`Merge pull request #82 from zerotwobook/fix/d1-pdf`) | Contains Sprint 1 app and D1 PDF only. Lacks R2-A01 runtime/Dockerfile and R2-B01 workflows/`deploy/` scripts. |
| `origin/staging/sprint-2` | `8edab6f` (`Merge pull request #87 from zerotwobook/docs/s2-a-next-task-prompts`) | Contains #83 (`docs/s2-a-cloud-contracts`), #84 (`R2-A01`), #85 (`R2-B01` code @ `048d412` / `cb9b969`), and #87 (prompt updates). **Zero** unfinished F-05–F-07 feature code exists on staging. |
| Open PRs | `0` open PRs prior to this handoff branch | No unmerged competing delivery candidate exists. |
| Local GCP CLI (`gcloud`) | Not installed / not available in local PATH (`gcloud: command not found`) | Live GCP project/billing/WIF state is **`UNKNOWN` / `NOT RUN`** locally until verified by the GCP account holder (`fasttrack-se-002` / `@zerotwobook`). |

### Live Project 3 (`fastTrack — Team Delivery`) Card Snapshot

| Item | Title | Status | Verification | Acceptance | Owner | Notes |
|---|---|---|---|---|---|---|
| [#13](https://github.com/zerotwobook/fastTrack/issues/13) | `[R2-J00] Review the accepted S1 baseline and freeze S2/cloud interfaces` | `PR Review` | `PASSED` | `PENDING` | `SHARED` | Delivery subset accepted at #83 (`490fe8b`); broader S2 F-05–F-07 scope remains open. |
| [#14](https://github.com/zerotwobook/fastTrack/issues/14) | `[R2-A01] Containerize fastTrack...` | `Done` | `PASSED` | `ACCEPTED` | `A` | Completed via PR #84 (`0bb2309`). |
| [#15](https://github.com/zerotwobook/fastTrack/issues/15) | `[R2-B01] Build CI, merge gates, release workflows and smoke checks` | `PR Review` | `PASSED` | `PENDING` | `B` | Code integration PR #85 is `Done`/`ACCEPTED` (`cb9b969`), while live ruleset, `demo` env, WIF and C-02 proof remain open. |
| [#16](https://github.com/zerotwobook/fastTrack/issues/16) | `[R2-J01] Deploy to Cloud Run, verify persistence, CI/CD gates and Lab 5` | `Backlog` | `NOT RUN` | `PENDING` | `SHARED` | Blocked on #14/#15 live setup and cloud prerequisites; keeps separate joint lifecycle. |
| [#85](https://github.com/zerotwobook/fastTrack/pull/85) | `ci: build CI and release pipeline workflows and offline tests` | `Done` | `PASSED` | `ACCEPTED` | `B` | Code integration merged as `cb9b969`; historical record preserved. |

---

## 2. Phase A: CI Context and Ruleset Gate Plan

### 2.1 Observed CI Check Runs

Inspecting live check runs on `origin/staging/sprint-2` (`8edab6f`) and PR #85 (`048d412` / `cb9b969`):
- **Latest Push Run:** [#42855058501](https://github.com/zerotwobook/fastTrack/actions/runs/42855058501/job/129965730520) (`push` to `staging/sprint-2` @ `8edab6f`, `completed`, `success`, 1m46s).
- **Previous PR #85 Run:** [#42846580997](https://github.com/zerotwobook/fastTrack/actions/runs/42846580997) (`048d412`, `success`, 2m16s) & [#42847201049](https://github.com/zerotwobook/fastTrack/actions/runs/42847201049) (`pull_request`, `success`, 1m47s).
- **Emitted Check Context Name:** **`test-and-docker`**
- **Check Producer App:** `github-actions` (`integration_id: 15368`, verified via `commits/8edab6f30c051a1a8f6c0d1a2222af5f2125fc9e/check-runs`).

### 2.2 Gate Suitability Audit

- `.github/workflows/ci-docker.yml` executes from `Project_code/` with pinned Node `26.13.0` (`npm ci`), Python `3.12`, syntax & offline deploy stub tests (`test_release_stub.sh`, `test_deploy_stub.sh`, `test_smoke.py`), Prisma generation, `typecheck`, `npm test` (166 unit tests), production build, isolated Docker PostgreSQL 16.8 regression (`npm run test:runtime:isolated`), and both `runner` and `jobs` production Docker image builds.
- Triggers cover both `pull_request` and `push` on `main` and `staging/sprint-*` with **no path filters** (check cannot silently go missing on doc/workflow PRs).
- Single-job structure (`test-and-docker`) ensures no skipped sub-jobs can create a false green pass. Concurrency cancels stale `pull_request` runs only (`cancel-in-progress: ${{ github.event_name == 'pull_request' }}`).
- PR jobs run with `permissions: { contents: read }`, `persist-credentials: false`, zero cloud credentials, and safe `pull_request` checkout (not `pull_request_target`). Artifacts (`ci-runtime-report`) contain redacted Vitest summaries only.
- Note on reusable invocation: When `deploy.yml` calls `ci-docker.yml` on `push` to `main`, GitHub emits `test / test-and-docker`. Pre-merge PR protection relies strictly on the standalone **`test-and-docker`** check emitted by `ci-docker.yml` on `pull_request`.

### 2.3 Ruleset Before / After Settings Delta

| Setting | Current State (Ruleset ID `26666182`) | Proposed Target State |
|---|---|---|
| Name & Enforcement | `fastTrack peer review — main and sprint staging`, `active` | Unchanged (`active`) |
| Target Branch Selectors | `include: ["refs/heads/main", "refs/heads/staging/sprint-*"]` | Unchanged |
| Bypass Actors | Empty (`current_user_can_bypass: "never"`) | Unchanged (empty, no bypass) |
| Deletion & Force-Push Blocks | `deletion`, `non_fast_forward` enabled | Unchanged |
| Pull Request Rule | `required_approving_review_count: 1`, `dismiss_stale_reviews_on_push: true`, `required_review_thread_resolution: true`, `require_extra_approval_for_unattributed_changes: true`, `allowed_merge_methods: ["merge"]` | Unchanged |
| **Required Status Checks** | **Absent (not configured)** | **Add `required_status_checks` rule:**<br>• `strict_required_status_checks_policy: true` (up-to-date branch required)<br>• `do_not_enforce_on_create: false`<br>• `required_status_checks: [{"context": "test-and-docker", "integration_id": 15368}]` |

- **Permission Required:** Repository Admin (`@zerotwobook`).
- **Verification & Recovery:** After update, read back `gh api repos/zerotwobook/fastTrack/rulesets/26666182` and `gh api repos/zerotwobook/fastTrack/rules/branches/main`. If check context matching fails on live PRs due to integration mismatch, update `required_status_checks` with the live observed `app_id` without weakening PR/review or force-push protections.

---

## 3. Phase A: GitHub Environment `demo` and WIF / IAM Plan

### 3.1 GitHub Deployment Environment `demo`

- **Current State:** `gh api repos/zerotwobook/fastTrack/environments` returns `{"total_count": 0, "environments": []}`.
- **Proposed Configuration (`demo`):**
  - **Deployment Branches:** Protected/selected branches matching exact **`main`** branch (`refs/heads/main`, NOT tag patterns — prevents a tag named `main` from accessing `demo`).
  - **Environment Review:** Preserve explicit branch protection / main-gate authorization; record whether optional required reviewers are enabled in GitHub UI/API without claiming unconfigured reviewers exist.

| Variable / Secret Name | Type | Proposed Value Source & Verification Scope |
|---|---|---|
| `GCP_PROJECT_ID` | Env Variable | Verified real project ID (lead from contract §7.1: `fasttrack-se-002`; distinguish from numeric project number `970128017651`). |
| `GCP_REGION` | Env Variable | Verified approved region (lead: `asia-southeast1`). |
| `WIF_PROVIDER` | Env Variable | Full verified provider resource path: `projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/providers/github-provider`. |
| `WIF_SERVICE_ACCOUNT` | Env Variable | Verified deployer identity: `sa-fasttrack-deployer@<PROJECT_ID>.iam.gserviceaccount.com`. |
| `SMOKE_EMAIL` | Optional Variable | Dedicated low-privilege synthetic account email (coordinated privately with A; pair with secret below or omit both). |
| `SMOKE_PASSWORD` | Optional Secret | Private secret value entered directly by owner; never printed or read back. |

### 3.2 WIF OIDC & GCP IAM Least-Privilege Matrix

*(Note: All GCP identities and resources require account holder `@zerotwobook` read-only verification before provisioning/binding; `gcloud` CLI is not present in B's workspace).*

1. **Identity & Issuer Verification:**
   - **GitHub Repository ID:** `1446690639` | **Owner ID:** `135503171`
   - **OIDC Issuer URL:** `https://token.actions.githubusercontent.com`
   - **Target Pool / Provider Leads:** `github-pool` / `github-provider`
2. **Attribute Mapping & Environment-Aware Subject Format:**
   - The repository OIDC customization API reports `use_default: true`, `use_immutable_subject: true` and prefix `repo:zerotwobook@135503171/fastTrack@1446690639`. With `environment: demo`, the expected default subject is **`repo:zerotwobook@135503171/fastTrack@1446690639:environment:demo`**. This is a configuration-based expectation, not a decoded live token. Confirm the actual sanitized claims in the authorized deployment job before binding or changing trust; do not print tokens. [GitHub OIDC reference](https://docs.github.com/en/actions/reference/security/oidc).
   - Required Attribute Mappings:
     - `google.subject=assertion.sub`
     - `attribute.repository_id=assertion.repository_id`
     - `attribute.repository_owner_id=assertion.repository_owner_id`
     - `attribute.repository=assertion.repository`
     - `attribute.ref=assertion.ref`
     - `attribute.workflow_ref=assertion.workflow_ref`
     - `attribute.event_name=assertion.event_name`
   - Required Attribute Condition (rejects forks, wrong repos, wrong branches, tags named `main`, staging pushes, and unauthorized workflows):
     ```text
     assertion.repository_id == '1446690639' &&
     assertion.repository_owner_id == '135503171' &&
     assertion.repository == 'zerotwobook/fastTrack' &&
     assertion.ref == 'refs/heads/main' &&
     assertion.workflow_ref == 'zerotwobook/fastTrack/.github/workflows/deploy.yml@refs/heads/main' &&
     assertion.sub == 'repo:zerotwobook@135503171/fastTrack@1446690639:environment:demo' &&
     (assertion.event_name == 'push' || assertion.event_name == 'workflow_dispatch')
     ```
3. **IAM Separation (Deployer vs Runtime):**
   - **WIF Impersonation on `sa-fasttrack-deployer`:** Grant `roles/iam.workloadIdentityUser` solely to principalSet `principalSet://iam.googleapis.com/projects/<PROJECT_NUMBER>/locations/global/workloadIdentityPools/github-pool/attribute.repository_id/1446690639`.
   - **Deployer (`sa-fasttrack-deployer`) Scoped Roles:**
     - `roles/artifactregistry.writer` (push `fasttrack-app` & `fasttrack-jobs` images and `images describe` digest lookup; scoped to `fasttrack-docker` repo or project if scoped IAM is supported).
     - `roles/run.developer` (update `fasttrack-migrate` job, execute job, update `fasttrack-app` service & traffic).
     - `roles/iam.serviceAccountUser` **scoped exclusively to `sa-fasttrack-runtime`** (required so deployer can attach runtime SA to Cloud Run service/job; never project-wide).
     - **Forbidden on Deployer:** No `Owner`, `Editor`, `Cloud Run Admin` project-wide, `Cloud SQL Admin`, or `Secret Manager` admin/accessor. No JSON keys.
   - **Runtime (`sa-fasttrack-runtime`, owned by A/07):**
     - `roles/cloudsql.client` at the appropriate supported project scope, and `roles/secretmanager.secretAccessor` on the individual `fasttrack-database-url` secret (and `fasttrack-demo-password` only if explicitly needed). Verify existing bindings and effective permissions; do not grant project-wide Secret Accessor. The runtime identity does not deploy or alter IAM.
4. **Failure / Recovery Boundaries:**
   - Test valid `main` OIDC authentication and record rejection on mismatched claim/branch during live WIF validation. Do not broaden IAM roles or mint a JSON service-account key if OIDC rejects a token; inspect the actual token claims/subject mismatch and update the mapping/condition intentionally.

---

## 4. End-to-End Release Contract & Readiness Review

Inspecting current code at `origin/staging/sprint-2` (`8edab6f` / PR #85 `048d412`):
- **Ref & Source Guards:** `deploy/release.sh` rejects a non-main `GITHUB_REF` when that variable is set before any `gcloud` invocation and rejects malformed tags (`^[0-9a-f]{40}$`). `deploy/deploy.sh` requires clean main synchronized with `origin/main`.
- **Dual Image & Digest Resolution:** `deploy.yml` builds and pushes both `fasttrack-app:$IMAGE_TAG` (`runner` target) and `fasttrack-jobs:$IMAGE_TAG` (`jobs` target). `release.sh` validates full 64-hex `@sha256:` digests on both before touching jobs or service.
- **Migration Safety:** `release.sh` updates `fasttrack-migrate` with `--max-retries=0 --tasks=1 --parallelism=1 --command=npm --args=run,db:migrate,--workspace,@fasttrack/server` and executes `--wait`. Non-zero exit aborts via `set -euo pipefail` before `run services update`.
- **Rollout, Identity & Traffic:** `release.sh` passes `--update-env-vars="RELEASE_SHA=$IMAGE_TAG"`, sets `--to-latest`, and validates single 100% traffic allocation (`traffic.percent == 100` to `SERVING_REVISION`). Rollback skips build, migration, and seed.
- **Smoke Validation:** `deploy/smoke_test.py` checks 200 `/api/health` (`version == EXPECTED_RELEASE_SHA`), 200 `/api/ready`, 200 `/` HTML title, exact 404 `/api/nonexistent` JSON envelope matching `errors.ts`, and optional cookie/origin/`X-fastTrack-Request: 1`/`X-CSRF-Token` login + `/api/auth/me` + read-only `/api/teams` + mandatory `/api/auth/logout` (fails on logout error).
- **Concurrency Limit Acknowledgement:** `deploy.yml` uses `concurrency: { group: deploy-main, cancel-in-progress: false }`. A newer run does not cancel the active run; manual cancellation, timeout, or runner failure can still interrupt it. However, per GitHub Actions concurrency semantics, a concurrency group retains at most **one** running job and **one** pending job (if a 3rd run arrives while 1 is running and 1 is pending, GitHub replaces the pending queue item). Do not describe infinite queuing.

### Initial Bootstrap Ordering Boundary (With A/07)

Because `main` (`b7174a7`) currently lacks `Dockerfile`, `workflows/`, and `deploy/`, **merging the initial delivery PR to `main` triggers `deploy.yml` on `push: main` automatically**. Therefore:
1. Complete **Phase B** (`B08-01` ruleset, `B08-02` `demo` environment) first.
2. Complete **A/07 cloud resource verification**, the authorized infrastructure prerequisites, `B08-04` WIF/deployer IAM and `B08-05` environment variables. Resolve the first-release bootstrap with A before selecting or authorizing a main candidate. `release.sh` updates an existing `fasttrack-migrate` job and `fasttrack-app` service; infrastructure, IAM and secrets alone are insufficient. `deploy.sh` requires clean synchronized `main` and creates resources using images built from that accepted source, so it cannot establish those resources from the unmerged candidate in advance. Prepare a concrete separately authorized bootstrap sequence, including what happens to the automatic main-push run, how accepted-main images and both resources are created, migration-before-rollout, and recovery from partial failure. Until reviewed and authorized, first deployment readiness is **BLOCKED**, not proven.
3. Prepare **Phase C** Draft main PR (`B08-06`), obtain explicit user current-candidate main-release authorization, then execute **Phase D** (`B08-07`), and finally **Phase E** C-02 proof (`B08-08`).

---

## 5. Proposed Action Matrix (Phase A Plan)

| Action ID | Issue Scope | Current Verified State / Time | Exact Resource / Selector | Proposed Delta / Command | Permission / Impact | Authorization Reference | Read-Back Evidence | Status |
|---|---|---|---|---|---|---|---|---|
| **B08-01** | #15 | **2026-11-11 00:28**: Ruleset `26666182` active (`refs/heads/main`, `refs/heads/staging/sprint-*`), PR/review/no-bypass active, **no `required_status_checks`** | Repository Ruleset `26666182` (`zerotwobook/fastTrack`) | Update Ruleset `26666182` adding `required_status_checks` (`strict_required_status_checks_policy: true`, `context: "test-and-docker"`, `integration_id: 15368`) while preserving all existing rules | Requires Repo `ADMIN` (`@zerotwobook`). Enforces CI green & up-to-date branch before merge | **PENDING** user / `@zerotwobook` admin execution or authorization | Read back `gh api repos/zerotwobook/fastTrack/rulesets/26666182` & `rules/branches/main` | `PLANNED` |
| **B08-02** | #15 | **2026-11-11 00:28**: Environments API reports `total_count: 0` | GitHub Environment `demo` (`zerotwobook/fastTrack`) | Create environment `demo` with `deployment_branch_policy: { protected_branches: false, custom_branch_policies: true }` allowing exact branch `main` only (no tags) | Requires Repo `ADMIN` (`@zerotwobook`). Restricts deployment secrets/WIF token issuance to `main` | **PENDING** user / `@zerotwobook` admin authorization | Read back `gh api repos/zerotwobook/fastTrack/environments/demo` & deployment branch policies | `PLANNED` |
| **B08-03** | #15 / #16 | **2026-11-11 00:31**: Local `gcloud` absent; GCP resources **`UNKNOWN`** | GCP Project `fasttrack-se-002` (`970128017651`), SQL `fasttrack-db`, AR `fasttrack-docker`, SA `sa-fasttrack-runtime`, Secret `fasttrack-database-url` | Account holder / A verifies project/billing/credits/quotas and prepares the authorized infrastructure prerequisites. Agree a separately authorized first-release bootstrap with A before main rollout; `deploy.sh` requires accepted clean main and does not create resources in advance from an unmerged candidate | Requires GCP Billing/Project Owner (`zerotwobook`); incurs Cloud SQL / Run billing once created | **PENDING** A/07 discovery & user billing/IAM/DB authorization | Sanitized `gcloud` inventory & `deploy/deploy.sh` readback without secrets | `PLANNED` |
| **B08-04** | #15 / #16 | **2026-11-11 00:31**: GCP WIF & deployer IAM **`UNKNOWN` / `NOT RUN`** | `sa-fasttrack-deployer`, Pool `github-pool`, Provider `github-provider` | Create WIF pool/OIDC provider with the verified immutable subject prefix, numeric IDs, `refs/heads/main` and `environment:demo` condition after verifying expected claims; create `sa-fasttrack-deployer` with scoped AR writer, Run developer, runtime SA user, and WIF principal binding | Requires GCP IAM / Workload Identity Admin (`@zerotwobook`); zero JSON keys | **PENDING** verified `B08-03` & explicit IAM authorization | Sanitized `gcloud iam workload-identity-pools providers describe` & `get-iam-policy` | `PLANNED` |
| **B08-05** | #15 | **2026-11-11 00:28**: Env `demo` absent; vars/secrets unconfigured | Env `demo` vars (`GCP_PROJECT_ID`, `GCP_REGION`, `WIF_PROVIDER`, `WIF_SERVICE_ACCOUNT`, optional `SMOKE_EMAIL`/`SMOKE_PASSWORD`) | Set verified environment variables on `demo` after `B08-02` & `B08-04`; configure `SMOKE_EMAIL`/`SMOKE_PASSWORD` pair only if synthetic smoke user exists | Requires Repo `ADMIN` (`@zerotwobook`); private passwords stay out of chat | **PENDING** `B08-02` & `B08-04` | `gh variable list --env demo` (secret values excluded) | `PLANNED` |
| **B08-06** | #16 | **2026-11-11 00:28**: `origin/main` = `b7174a7`; `origin/staging/sprint-2` = `8edab6f` (clean delivery scope) | Initial Delivery Draft PR (`main` ← clean release branch from `staging/sprint-2`) | **Phase C**: Prepare Draft PR targeting `main`, verify full diff excludes unfinished F-05–F-07, present Main Release Gate review package | Controlled by `workflow/MAIN_RELEASE_GATE.md`; Draft holds deploy | **PENDING** Phase B (`B08-01..05`) & explicit candidate prep instruction | Draft PR URL, head/base SHAs, passing CI link | `PLANNED` |
| **B08-07** | #16 | No initial Lab 5 main release has occurred | `main` push pipeline (`deploy.yml`) | **Phase D**: After user current-candidate main authorization + A peer approval, merge to `main` and trace initial pipeline, digests, migration, URL, revision, traffic & smoke | Protected merge & live Cloud Run rollout | **PENDING** concrete candidate authorization + peer approval | Merged SHA, `deploy.yml` run URL, digests, revision, smoke log | `PLANNED` |
| **B08-08** | #15 | Required check rule not yet active; C-02 experiment **`NOT RUN`** | Temporary proof branch from post-release `main` + never-merge PR | **Phase E**: After stable `main` & `B08-01` active, open Draft failing-test PR -> get explicit exception authorization -> lift Draft -> verify `test-and-docker` fails & blocks merge -> A witnesses -> close unmerged | Separate never-merge exception; must preserve failed run/PR history without merging broken code | **PENDING** Phase D + explicit C-02 experiment authorization | Closed unmerged PR URL, failed CI run, blocked-merge rules readback | `PLANNED` |

---

## 6. Stop Boundary and Exact Next Action Required

**Current Phase Completed:** Phase A (discovery and live-gate planning only). No unapproved repository ruleset, environment, cloud IAM, `main` branch, or C-02 changes were executed.

**Exact Missing Prerequisites / Human Decisions Required to Start Phase B:**
1. **Admin Execution / Authorization (`@zerotwobook`)** for **`B08-01`** (adding `test-and-docker` with strict up-to-date policy to Ruleset `26666182`) and **`B08-02`** (creating `demo` environment restricted to protected branch `main`).
2. **Account Holder / A (`@zerotwobook`) GCP Verification (`B08-03`, `A/07`)**: Run `gcloud` read-only inventory against `fasttrack-se-002` (`970128017651`) to confirm existing resources, credits/billing, and authorize the cloud provisioning + WIF/deployer IAM (`B08-04`) subset.
3. **Resume Point:** Peer review of this plan PR (`docs/s2-b-live-gate-plan` → `staging/sprint-2`), then execute **Phase B** on explicit authorization for actions `B08-01` through `B08-05`. Do not proceed to Phase C (`B08-06`), Phase D (`B08-07`), or Phase E (`B08-08`) until prerequisites hold and separate authorizations are recorded.
