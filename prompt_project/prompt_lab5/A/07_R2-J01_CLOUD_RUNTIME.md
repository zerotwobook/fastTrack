# A / 07: prepare cloud runtime, then perform an authorized first deployment

## Invocation and current hold

This file is a reusable task prompt for A (`zerotwobook`). It describes the next runtime/cloud phase of **R2-J01 / Issue #16**, with B (`Atip-Infa`) reviewing delivery interfaces.

**Writing, editing or reviewing this file does not start #16.** If the user requests prompt preparation only, edit the requested Markdown and stop. Do not run the discovery commands below, change the execution Issues, access GCP, provision resources, create a main-release PR or deploy under an authoring-only request.

When the user later explicitly asks to execute A/07, use the following modes:

| Mode | Permitted endpoint |
|---|---|
| Prepare (default for a new A/07 execution) | Inspect live state, perform authorized read-only discovery, prepare owned scripts/docs/offline checks and a complete reviewable action plan. Stop before unapproved cloud mutations or main release. |
| Resume preparation | Read the last handoff and continue only incomplete preparation; preserve branches, evidence and lifecycle. |
| Execute an authorized subset | Verify the user's recorded authorization for the exact current actions/resources and perform only that subset. Existing valid authorization need not be requested again. |

Conversation may be Thai. All project content, commands' descriptive comments, evidence and handoffs must be English. Prepare reports in Markdown; the user exports final PDFs.

## 1. Outcome, ownership and boundaries

Produce a reproducible cloud-runtime plan that B and the account holder can inspect. After the separate main and cloud gates are satisfied, perform and verify the first public deployment of the accepted S1 application.

A owns runtime, provisioning plans, database connectivity, resource/secret references, canonical origin and external runtime verification. B owns WIF/deployer trust, GitHub environment/check settings and release orchestration in [B/08](../B/08_R2-B01_J01_WIF_GATE_AND_RELEASE_PREP.md). Agree one editor for shared scripts/guide sections before changes.

Keep the existing accepted paths: `Project_code/` for application/Docker/runtime source; root `.github/workflows/` for Actions; root `deploy/deploy.sh`, `deploy/release.sh`, `deploy/smoke_test.py` and `deploy/tests/` for the existing delivery scripts; `docs/labs/lab-05/deployment.md` for the canonical guide. Do not move accepted scripts merely to satisfy an older generic path example.

Keep unfinished F-05-F-07 features, broader #13 contract work, later visible-change release, C-02 proof and final evidence assembly outside this invocation unless separately selected. First deployment does not complete #16.

## 2. Read before acting

Read [all shared execution rules](../00_SHARED_EXECUTION_RULES.md), root `AGENTS.md`, `skill/SKILL_Project.md`, complete `skill/SKILL_Github.md`, `CONTRIBUTING.md` and `DEVELOPMENT_README.md`.

Then inspect:

- `workflow/README.md`, `workflow/02_SPRINT2_LABS5-7.md` sections 5/10, `workflow/04_LAB5_DELIVERY_PLAN.md` sections 5/8-10/12/13, `workflow/GITHUB_PROJECT_AUTOMATION.md` and `workflow/MAIN_RELEASE_GATE.md`.
- Project-detail sections 7/9/11/13, the original Lab 5 handout sections 4.4/9 and the relevant Student Guide account, SQL, secrets and first-deploy sections. Preserve instructor artifacts.
- Live Issues #13/#14/#15/#16, relevant comments/reviews, accepted delivery contract, runtime evidence, CI review evidence and current deployment guide.
- Actual `Project_code/Dockerfile`, workspace scripts, server env/config, Prisma adapter/config, migration/seed entrypoints, root deploy scripts and both Actions workflows.

Use implemented contracts where older prose is stale. Record a material conflict before changing behavior. Do not assume a starter command, cloud role or CLI flag is suitable without checking the actual source and current official documentation.

## 3. Recheck the historical integration checkpoint

The following is historical evidence from 10 November 2026, not a permanent current-head assertion:

| Item | Recorded evidence | Meaning and limit |
|---|---|---|
| Delivery contract | PR #83, accepted proposal `490fe8b`, staging merge `09caaa8` | Lab 5 delivery subset accepted; broader #13 stays open. |
| Runtime/container | PR #84, head `0301f6f`, staging merge `0bb2309`; B's actual review | R2-A01 accepted; does not prove cloud resources or public TLS. |
| CI/release code | PR #85, corrected head `048d412`, staging merge `cb9b969` | User-authorized assisted review/integration; retain that attribution rather than inventing a separate human test. |
| Current-head CI at that checkpoint | Run `42846580997`, head `048d412`, success | Explicitly dispatched code/DB/image verification; not a deployment. |
| Staging push CI at that checkpoint | Run `42847298597`, head `cb9b969`, success | Integrated code verification; not WIF, C-02 or public persistence proof. |

Fetch/read current refs, exact head/base, changed executable files and newer results before relying on these records. Do not reopen completed #14 or rerun all historical tests just to reconstruct its acceptance. Verify the actual joint container/CI checkpoint; if a required human decision is absent, prepare independent work and report it honestly.

## 4. Establish a safe execution workspace and lifecycle

1. Inspect the actual authenticated account, repo/remote, current branch/upstream, tracked/untracked/staged changes, worktrees and existing #16 branches/PRs. Preserve unrelated work.
2. Use A's isolated clone/worktree. Resume the correct existing task branch or create a scoped branch from current `staging/sprint-2` for genuinely new work. Do not switch another owner's workspace.
3. Read #16's real Project state. Only when execution is actually authorized, follow its real Backlog -> Specified -> Started milestones before task-file edits. Resume an existing phase without replaying earlier transitions. Record/read back actual transitions in its Issue body.
4. If owned preparation needs edits, push a first coherent commit and open a Draft staging PR during Started; add its Project card immediately with real metadata. Finish checks before ready handoff. A read-only investigation does not require an empty commit or placeholder PR.
5. Keep Status, Verification and Acceptance separate. Do not close #15/#16 because this preparation or the first deployment succeeds.

Useful repository discovery, to execute only after this prompt is invoked:

```powershell
git status --short --branch
git remote -v
git worktree list
git fetch origin
gh issue view 16 --repo zerotwobook/fastTrack
gh pr list --repo zerotwobook/fastTrack --state open
gh project item-list 3 --owner zerotwobook --limit 100 --format json
```

## 5. Phase A: discover actual cloud state without mutation

Check available `gcloud`/Docker tooling and account access before choosing CLI or Console. Use existing connected tools when suitable. If access is unavailable, identify the missing capability and finish independent preparation; do not ask for passwords, tokens or key files in chat.

Verify the account holder, project ID **and number**, region, billing/trial state, credit expiry, enabled APIs, actual inventory and team access. Recorded proposal `fasttrack-se-002` / `970128017651` / `asia-southeast1` is a discovery lead, not permission or proof of existence. Reuse the team's real project; do not create a duplicate.

Use filtered read-only views for the selected project. Do not print full service environment, connection strings, secret payloads, cookies, access tokens or credential files. Secret names/version metadata may be inspected; secret-version access is not needed for this plan. Keep account identifiers out of public evidence where unnecessary.

Build an inventory with one row per registry, SQL instance/database/user, runtime/deployer identity, secret reference, migration job and Cloud Run service. Classify each as VERIFIED PRESENT, VERIFIED ABSENT or UNKNOWN with source/time. Permission failure is UNKNOWN, not absence.

Recheck current official pricing, trial/credit rules and quotas when preparing paid-resource recommendations. Record dated sources and assumptions rather than copying the starter's old estimate. Inspect SQL edition/tier, storage/auto-increase/backups, region and runtime limits. Follow the handout account method; payment/Upgrade or closed-billing errors require account-holder/TA action.

## 6. Phase B: prepare the concrete runtime and resource plan

Prepare or reuse one English Markdown handoff, for example `workflow/handoffs/R2-J01_A_CLOUD_RUNTIME_PLAN.md`. It is a future output path, not a claim that a plan already exists. Coordinate shared guide/script edits with B.

Use this change matrix and replace every placeholder with verified non-secret values before requesting execution:

| Action ID | Current state and evidence | Exact project/region/resource | Proposed command or Console change | Purpose | IAM/DB/secret/cost impact | Recovery limit | Authorization | Verification |
|---|---|---|---|---|---|---|---|---|
| A07-01 | UNKNOWN until discovery | Verified target required | Concrete command required | Explain | Identify impact | Explain | PENDING or actual reference | Safe read-back command |

Resolve all of the following:

1. Registry and image identity: web `fasttrack-app`, jobs `fasttrack-jobs`, full actual source SHA and immutable 64-hex digests. Identify which accepted main commit will be built; the PR head and eventual main merge SHA can differ.
2. SQL: intended persistent instance/database, supported PostgreSQL tier/region, user, Cloud SQL connection mechanism and compatibility with both the actual Prisma adapter and migration CLI. Validate with approved disposable/local resources where possible; never use production cleanup fixtures.
3. Identity: separate runtime and deployer accounts. Runtime receives only the required DB connectivity and individual-secret access. B supplies scoped deployer/WIF bindings. Avoid Owner/Editor, project-wide secret access and JSON keys.
4. Secrets: private creation/input method, scoped secret/version references and required consumers. `DATABASE_URL` belongs to server/jobs only. `DEMO_SEED_PASSWORD` belongs to an explicit seed job, not web runtime or Vite builds. Never show secret values in the plan.
5. Runtime: exact HTTPS `APP_ORIGIN`, port/binding, production mode, eight-hour sessions, verified proxy topology, bounded pool/deadlines, min/max instances and relevant concurrency/DB capacity.
6. Origin bootstrap: verify the accepted deterministic URL scheme or existing canonical service origin; confirm real metadata/browser URL after creation. Do not disable CSRF or allow wildcard origins to solve ordering.
7. Migration: jobs image includes the real tooling; explicit `npm run db:migrate --workspace @fasttrack/server`, one task, no automatic retry, awaited success before rollout. Failure requires inspection before deliberate recovery.
8. Seed: separate explicitly authorized add-only operation. `deploy/deploy.sh --demo` currently prepares the optional password secret; it does not execute a seed. No reset/schema-push/development migrations or routine reseeding.
9. Cost controls: current supported SQL/storage/backup choices, min 0/max at most 3 as the agreed reference and bounded DB connections. Budget alerts are notifications, not spending caps. Do not stop assessed/UAT services as an assumed optimization.
10. Bootstrap ordering: identify which resources can be prepared with separately approved resource-only commands before main release, and which steps require accepted main source. Account for the automatic main-push deploy workflow; do not merge first and discover missing prerequisites afterward without an explicit agreed bootstrap plan.

Review the current monolithic provisioning script before proposing it. It combines APIs/IAM/DB/secrets/build/migration/rollout; permission for one action is not permission to run the whole script. Use a concrete approved subset or a scoped reviewed script change when needed.

For command preview, after reading the script, `DRY_RUN=1 bash deploy/deploy.sh` may run from the repository root with verified non-secret identifiers. It makes no cloud calls but does inspect local Git and generate local random values. Never treat preview output as provisioning or assume it fully describes existing-resource branches. Inspect the actual rerun/update paths too.

## 7. Verify owned preparation and hand off to B

For changed scripts, run meaningful shell/offline failure tests without cloud access. Existing commands are `bash deploy/tests/test_deploy_stub.sh`, `bash deploy/tests/test_release_stub.sh` and `python -m unittest discover -s deploy/tests -p test_smoke.py`; inspect their current implementation and prerequisites first. App/runtime changes also require the appropriate pinned-toolchain/build/DB/image checks. Text-only edits need document/link/scope checks, not a fabricated application test run.

Recheck these accepted safeguards rather than weakening them to make bootstrap easier:

- Provisioning execution requires clean `main` matching fetched `origin/main`; source tags and resolved digests must agree.
- Existing migration jobs select the intended jobs image/command before execution; zero retries and one task remain enforced.
- Normal release rejects wrong refs/malformed digests and verifies actual revision/100% traffic. Rollback skips migration/seed.
- Smoke checks match implemented health/readiness/404 envelopes and source identity. Optional login uses the cookie/source/custom-header/CSRF contracts and fails when logout fails.

Send B a prepared handoff in the repository; do not post external messages without explicit authorization. Include the runtime/env/job/origin contract, exact resource/action IDs, actual checks, open decisions and required setup order. B returns deployer/WIF/environment details and the current main-candidate identity.

**Preparation endpoint:** finish every independent authorized item, present the concrete matrix and affected commands/diffs, then stop before unapproved mutations. This boundary comes from the shared rules and Lab 5 plan, not from a new approval requirement invented by this prompt.

## 8. Phase C: execute only a specifically authorized cloud subset

On resume, reread live resources, current code/head/base, last handoff and the actual user decision. Map the decision to action IDs and current commands. If the approved target/scope changed, finish the revised plan before requesting renewed approval. Retain valid unchanged approval without asking again.

Apply approved steps sequentially and verify each result with sanitized output/time/resource identity. Check before create/update to preserve existing resources and credentials. Permission failure does not authorize a broader IAM role. Partial migration failure does not authorize blind retry, repair, rollback or data deletion. Stop the affected operation and inspect its actual state; continue independent work where safe.

Do not run `deploy/teardown.sh` under this task. Its destructive scope is not a first-deploy recovery mechanism.

## 9. Phase D: deploy accepted main source and verify the first URL

If required runtime/workflow code exists only on staging, prepare the runtime plan and pause rollout. B/08 prepares the initial delivery Draft main candidate; the user reviews the exact head/base and authorizes it, then the real non-author peer/protection/authorized merge process applies. Reassess changed candidates. A staging approval or this prompt is not main-release permission.

After the real main merge, use the accepted pipeline or a separately reviewed authorized main-source bootstrap. Do not deploy a staging/dirty checkout or silently dispatch an old workflow. Record why a manual bootstrap is needed if used; it is separate from the later C-06 visible-change release.

Verify from outside the runtime environment:

| Check | Expected observation | Evidence without secrets |
|---|---|---|
| Source chain | Actual main commit -> web/jobs tag/digests -> revision | Full SHAs/digests and run/job links |
| Traffic | Selected ready revision receives the intended 100% assignment | Filtered service status/time |
| Health | HTTP 200, `status: ok`, exact expected release SHA | Sanitized status/JSON |
| Readiness | HTTP 200, `status: ready`, `database: connected`, expected SHA | Sanitized status/JSON; no DB URL |
| Frontend/API routing | HTML/title/assets/fonts/deep link work; unknown API returns exact safe 404 | Public URL and observations |
| Production auth | HTTPS origin, Secure/HttpOnly/SameSite cookie, source/custom-header/CSRF behavior | Attributes/results only; no cookie or token values |
| Optional private smoke | Dedicated low-privilege account, read-only scoped request and logout; missing credentials reported SKIP | Actual pass/fail/skip and reason |

Do not break production DB access to demonstrate readiness failure. Existing local failure tests remain local evidence. Health or smoke success alone does not establish the full C-04 business flow or C-05 persistence.

## 10. Required final handoff and stop

Return a concise conversation update plus the durable English Markdown record containing:

- Owner, selected mode/phase, Issue, branch/PR and exact current head/base.
- Current resources versus proposed/actually applied actions, each with evidence and authorization reference.
- Actual commands/checks/environment/results; distinguish historical results, local mocks and live observations.
- Main source SHA, image tags/digests, migration execution, URL, revision and traffic if deployment actually occurred; otherwise PENDING with the specific prerequisite.
- Current Status / Verification / Acceptance and exact missing decisions, tool permissions or peer actions.
- The precise next resume point; no repeated provisioning/seed/release and no claim that #16 is complete.

Stop after this bounded phase. Do not automatically execute [A/09](09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md), B/10 or the final report prompts. After a working first URL and real gates, A/09 records original business IDs and a distinct restart before the later visible-change release.
