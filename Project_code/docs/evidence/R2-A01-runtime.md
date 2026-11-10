# R2-A01 runtime/container author verification

Owner A (`zerotwobook`); reviewer B (`Atip-Infa`); [Issue #14](https://github.com/zerotwobook/fastTrack/issues/14), [PR #84](https://github.com/zerotwobook/fastTrack/pull/84), branch `build/s2-a-docker`, target `staging/sprint-2`. Prepared on 10 November 2026. Author verification is distinct from B acceptance/merge and later public-cloud evidence.

## Implemented increment and source identity

The accepted delivery interface came from B's exact-head approval of `490fe8b` and PR #83's actual staging merge `09caaa8`. This task adds non-root web/jobs images, explicit persistent local Compose, bounded runtime DB/readiness, shared atomic PostgreSQL login limiting, guarded cleanup and runtime/environment guidance. The additive limiter model/migration is A's proposal for B, who remains schema integrator; no applied S1 migration was edited.

Runtime/schema/test implementation was committed as `6b6d165`. The regression was executed against that same working source, then its identity against subsequent candidates was checked; documentation/verifier-only follow-ups did not change those runtime/schema/test sources. The final clean-clone image source is the exact full `sourceCommit` in the container JSON. Image labels and health must match that source, which can differ from a later evidence-only commit.

## Actual RED/GREEN and regression

| Execution | Actual result | Artifact |
|---|---|---|
| Readiness acceptance before implementation, commit `ceab421` | Five cases fail against missing endpoint (HTTP 404), no accepted failing integration | [RED reporter](R2-A01-readiness-red.json) |
| Unit/type/build and runtime implementation | Generation/typecheck/build pass; ordinary suite has 166 passing cases | [Unit reporter](R2-A01-unit-green.json), [full isolated result](R2-A01-regression.json) |
| Guarded full real-DB regression, `npm run test:runtime:isolated` | **374 cases pass, zero fail**, seven separate migration scenarios pass | [Full isolated result](R2-A01-regression.json) |
| New runtime DB suite | 12 passing cases including actual PostgreSQL statement timeout/pool recovery, committed failure counts, expiry, concurrent independent apps, proxy identity, contention, rollback and cleanup | `runtimeTests` in the full result |

The full suite includes ordinary 166, G1 38, auth 28, milestones 39, submissions 48, feedback 42, compiled S1 system 1 and runtime DB 12. The runner created protected disposable PostgreSQL with generated credentials and removed its own container. No cloud/shared database was used for fixture cleanup.

The seven migration scenarios verify successful control/canonical/candidate paths and rejection/preservation for malformed legacy data. Applied history/checksums and original domain records remain preserved. Existing S1 browser evidence retains its original provenance; no new native browser/TLS/cloud result is attributed to this run.

## Actual clean-clone final-image verification

[Final container result](R2-A01-container-results.json) records exact source/image IDs, original milestone/submission/feedback IDs, individual outcomes and owned-container cleanup. The verifier clones committed source afresh, builds both final targets, keeps credentials only in temporary private files, and checks actual jobs and compiled HTTP/API/DB behavior.

It verifies source/image user/label, runtime shared/generated assets and env/test exclusion; real migrate/repeat migrate and explicit non-destructive seed; production cookie/domain API flow and safe role rejection; graceful app stop/start with the external DB still running; same original IDs/relationships/valid session after restart and repeated seed; and actual disconnected-DB sanitized 503 with independent health 200. Final asset/entrypoint guard checks are named individually in the report. No public cloud or TLS claim is made by these local HTTP requests with controlled production-origin headers.

The [initial verifier result](R2-A01-container-initial.json) is intentionally retained as failed evidence. Its app/image/jobs/business/stop checks succeeded, but post-start readback used the old ephemeral host port. A separate disposable HTTP probe reproduced Docker changing the host port from `51525` to `51534` on stop/start. The verifier now inspects the same container's new binding before readback; the successful result contains actual original-record continuity. This was a verifier address bug, not a reason to recreate data or hide a failed report.

## Reproduce safely

From `Project_code/` with Node 26.13.0/npm 11.20.0 and Docker Engine:

```powershell
npm ci
$env:G1_REPORT_PATH = Join-Path (Get-Location) 'docs/evidence/R2-A01-regression.json'
npm run test:runtime:isolated
# Only after committing code/script changes; this verifies an exact clean clone:
npm run verify:container
```

The verifier uses generated synthetic local accounts, an isolated Docker network/database and exact created-container IDs. It removes only its own containers/network/credential files and does not delete unrelated Docker data. Do not aim fixture cleanup at an existing dev/cloud database. Read [the deployment guide](../../../docs/labs/lab-05/deployment.md) for explicit Compose jobs/env and maintenance commands.

## Coverage and limits

| Contract case | Evidence / assertion |
|---|---|
| A01-01 / C-03 local preparation | Fresh exact-source clone, pinned build, real final web/jobs images. |
| A01-02 | Final runtime artifacts/non-root/listener, actual static/HTTP checks, graceful stop; assertions listed in final image result. |
| A01-03 | Real job migrate/repeat migrate/seed/repeat seed, fingerprint of all seven existing domain/session tables. |
| A01-04 | Five bounded readiness cases, real statement-timeout/pool recovery DB case and disconnected final image. |
| A01-05 | Config bound/order/retention/proxy validations, implemented scoped examples and Compose syntax check. |
| A01-06/A01-07 | Exact generic 401/fifth 429/header/lock/expiry/reset outcomes with committed PostgreSQL state. |
| A01-08 | Ten concurrent requests over independent app instances, bounded lock failure/recovery and rollback/no-session checks. |
| A01-09 | Direct-mode spoof rejection, nearest configured-hop selection, malformed IP fail-closed and mapped IPv6 normalization. Actual GCP topology still pending. |
| A01-10 | Cleanup deletes one bounded 100-row batch, preserves active lock and domain tables, then processes remaining expired rows. |
| A01-11 | Full inherited auth/source/CSRF/role/scope/domain/replay and compiled S1 regression preserved. |
| A01-12 | Actual local app-container restart, unchanged external DB and exact original records/still-valid session. |

Remaining: B's independent reproduction/review and migration integration; B's R2-B01 CI/check/protection/release workflows; authorized cloud identities/IAM/DB/connectivity and proxy verification; public C-04, separate cloud C-05 restart/redeploy and C-06 main pipeline. No main merge, cloud action, PDF export or submission occurred here.
