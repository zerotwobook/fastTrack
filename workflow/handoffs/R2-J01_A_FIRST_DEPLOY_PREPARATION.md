# R2-J01 A/07: socket verification and first-deploy preparation

Owner A (`zerotwobook`); peer B (`Atip-Infa`). Issue [#16](https://github.com/zerotwobook/fastTrack/issues/16), branch `test/s2-a-cloud-socket`, based on accepted staging `19a0a0b6cd7d05cb212499397f5cacacbc49247a`. This resumes the accepted [runtime plan](R2-J01_A_CLOUD_RUNTIME_PLAN.md). First deployment remains pending prerequisites and the [concrete main-release gate](../MAIN_RELEASE_GATE.md).

## 1. Authorization and observed capabilities

The user explicitly asks to continue first deployment after PR #91 merged. This authorizes owned preparation/verification and a concrete review package. No exact main candidate has yet been presented/authorized, and no new resource/IAM/DB command was previously reviewed for this current execution. Preserve the API-only action the account holder already executed; do not rerun it unnecessarily.

- Docker Desktop was installed but its Linux engine was stopped. A started the existing engine; Docker 29.9.2 is available.
- Host Node 26.13.0 and npm 11.20.0 match the project pins.
- No gcloud executable is available. Authenticated browser access previously failed before navigation. Plugin discovery did not return a suitable Cloud Run management connector; unrelated providers are not substituted for the assessed GCP target.
- Account-holder inventory/credit/API evidence and the dated regional cost model are recorded in Issue #13. The 2026-11-11T08:17:16Z inventory found no selected SQL/registry/service/job/secret and no application runtime/deployer identity. Recheck actual resources before execution.
- Live GitHub has no environment `demo` and no required-status-check rule. Existing peer/no-bypass/force-push protections remain active. B owns these settings/WIF and release orchestration; this task does not silently change them.

## 2. Missing verification and owned implementation

The accepted production URL proposal uses `?host=/cloudsql/...`. Prior command stubs and TCP tests do not prove both the Prisma migration CLI and runtime adapter can consume that socket URL. Extend the existing A-owned `Project_code/scripts/verify-container.mjs` with an explicit `--socket` mode and invoke it after the existing A01 regression runner succeeds. Expose a standalone owned npm command. Keep B-owned Actions, schema, migrations and deployment scripts unchanged.

Use the actual pinned runner/jobs images from a clean committed clone, the existing pinned disposable PostgreSQL image and fresh generated test credentials. A fresh named Docker volume carries the database's Unix socket to `/cloudsql/fasttrack-socket-check:asia-southeast1:test-db` in the clients. Disable PostgreSQL TCP listeners and require password authentication locally so passing cannot be a TCP/trust-auth false positive. Fixed fresh `_test` database and generated resource IDs cannot target Cloud/shared data.

| Planned check | Required result |
|---|---|
| Source/image identity | Clean committed clone, pinned builds, runner/jobs source labels and non-root runtime preserved. |
| Socket-only database | TCP listen_addresses empty; socket shared through newly created volume only. |
| Real migration CLI | Actual jobs image executes the real db:migrate workspace command twice without reset. |
| Real adapter/readiness | Actual runner starts, health has exact SHA and ready reports database connected over socket. |
| Authentication negative control | Wrong synthetic password cannot migrate; runtime readiness fails safely while liveness remains independent. |
| Existing production behavior | Real local Student/Supervisor flow, assets/deep links/404, exact records/session persistence and explicit seed preservation remain verified. |
| Cleanup/privacy | Only newly created containers/network/volume and known temporary credential files removed; report is sanitized JSON with source/image/check/cleanup identity. |

This fixture validates the two consumers and URL shape on Linux; it does not reproduce the Cloud SQL proxy, WIF, Cloud Run permissions/TLS or public production topology. The initial design recorded these checks as NOT RUN; actual results are recorded below. Retain failures honestly and fix any actual result on the same branch/PR.

## 3. Remaining first-release ordering

1. Complete socket checks and review any source/config findings. Inspect the whole main-to-staging candidate and current CI; unfinished F-05-F-07 implementation remains excluded.
2. Prepare a resource-only, check-before-create action matrix for registry/SQL/runtime identity/DB secret, with the verified project/region, explicit storage/backup/connection choices and the existing cost model. Preserve existing credentials/resources after re-discovery; no blind provisioning rerun.
3. B supplies reviewed required-check/environment-review/main-only/WIF settings. The accepted hold -> accepted-main bootstrap -> reject waiting duplicate proposal requires an actual working environment hold before the first main merge.
4. Prepare the exact Draft main candidate and practical review package. Keep Draft/no auto-merge until the user reviews/authorizes that current head/base; actual peer/protection/authorized merge remain required.
5. Execute only the specifically authorized Cloud subset via an authenticated account-holder session. Actual clean accepted main source builds images, migrates once and rolls out; verify source/digest/revision/traffic/public behavior independently. No deployment is claimed by a passing local fixture.

## 4. Current phase

Owned socket verification and the [resource-only command package](R2-J01_A_RESOURCE_ONLY_COMMANDS.md) are prepared in PR #92. The package gives exact project/resource names, sequential readbacks, storage/backup choices, private credential creation and the boundary before first rollout. These commands were inspected and their five Bash blocks passed syntax checking; they have not been executed against GCP.

| Actual check | Result and source identity |
|---|---|
| Local production-image socket fixture | PASS, 17 checks, `2026-11-11T09:08:56.576Z` to `09:10:11.143Z`, source `26f155cc46351fb7846bd152afd3786c29b6dc24`. Actual [JSON](../../Project_code/docs/evidence/R2-J01-socket-results.json) retains both image IDs, checks, synthetic record IDs and cleanup. |
| First implementation CI | [42992664665](https://github.com/zerotwobook/fastTrack/actions/runs/42992664665) FAILED after existing regressions passed: Actions checks out a detached commit, and the previous verifier tried to clone an empty branch name. PR stayed Started; Verification FAILED was saved/read back on PR #92 and Issue #16. |
| Actual correction | `c874b9e82ace8b7dac00db290962cf6dced40b49` clones without selecting a branch, explicitly checks out the exact source commit, then verifies identity/cleanliness. Also includes the generated negative-control password in redaction. No workflow/schema/app behavior change. |
| Corrected CI | [42993436201](https://github.com/zerotwobook/fastTrack/actions/runs/42993436201) PASSED at PR head `c874b9e82ace8b7dac00db290962cf6dced40b49`, including typecheck/unit/production build, isolated DB/migration/runtime, socket fixture and runner/jobs Docker builds. The actual detached merge checkout is `adfc3f410dec7590160d90bbf10702b96daabec7`, not the PR head. |
| CI socket machine result | PASS, 17 checks, `2026-11-11T09:15:27.746Z` to `09:16:15.980Z`; [JSON](../../Project_code/docs/evidence/R2-J01-socket-ci-results.json) extracted unchanged from the sanitized successful run log. |
| Local syntax/whitespace | `node --check` for both changed JS scripts, `bash -n` for the five resource-command blocks and `git diff --check` passed. No cloud commands were executed by syntax checks. |

Historical results above retain their actual source identities. The final PR head/base and its automatic CI are recorded in the live PR/Issue handoff; retaining evidence changes the head and does not rewrite a previous result's source. Run `npm run verify:socket` from a clean committed checkout in `Project_code/` with Docker to reproduce the standalone fixture; `npm run test:runtime:isolated` also invokes it after existing regressions. Only generated disposable local test resources are used.

Review focus for B: actual Prisma CLI/runtime consume the same colon-containing socket path with TCP disabled; wrong passwords are rejected without trust-auth fallback; both branch and detached checkouts select the exact source; cleanup does not touch pre-existing resources; resource-only commands preserve existing credentials and remain separate from B-owned WIF/settings/release work. The package changes owned verifier/runner/npm command, machine evidence and A handoffs only. No dependencies, lockfile, migrations, Actions or deploy scripts changed.

The next owner action is B/08 setup and the eventual Draft main candidate, followed by the user's concrete main review. Resource/IAM/DB approval applies to A07-01 delta and A07-02..06 in the linked command package; unchanged prior API enablement is not requested again. Actual execution needs an authenticated account-holder Cloud Shell session. Main release and A07-07..10 remain pending, with no image push, migration execution, service URL or serving revision claimed. Whole #16 stays open for real deployment and later C-01-C-06 evidence. No main release, cloud mutation, production seed, teardown, external message or PDF export is performed by this preparation.
