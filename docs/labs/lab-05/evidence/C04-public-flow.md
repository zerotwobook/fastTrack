# C-04 public business flow and original-record baseline

Task R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16), A/09 execution. Owner A (`zerotwobook`); peer B (`Atip-Infa`). Run `C04-20261112T040407Z`, 12 November 2026. Execution was automated through isolated real browser sessions and corroborating authenticated HTTP reads. It is assisted verification, not a claim that B or an independent human tester executed these cases.

**Outcome: C04-01..05 PASS in the tested scope.** Original records are saved for subsequent C-05 comparison. Restart, later redeploy, eight-hour survival and whole-task acceptance remain pending.

## 1. Authorization and unchanged application identity

The user explicitly approved continuation in direct response to the concrete request for **A09-SEED-01..04 and A09-CASE-01**, reviewed in [PR #96](https://github.com/zerotwobook/fastTrack/pull/96) at preparation head `e1fa3a140357c53e78ad9c4a3c6404aef7c5f9e8`. The action identities/resources remained unchanged. The decision was recorded in Issue #16 before execution. No restart/scaling, extra migration, reset, teardown, protected merge or later release was inferred.

| Identity | Verified value |
|---|---|
| Accepted served source | `16ec6d268ac087f3834be7da55dda29e589847ce`, released by PR #93 |
| Canonical origin | <https://fasttrack-app-kpx7au3w2a-as.a.run.app> |
| Project / region | `fasttrack-se-002` / `970128017651` / `asia-southeast1` |
| Service / ready revision | `fasttrack-app` / `fasttrack-app-00002-f75` |
| Traffic before/after | One assignment, 100% to that same ready revision |
| Configured immutable web index | `sha256:7eadbc226af98dd0231513ada70a33f1fb2c59a19ebcca301430221a836eb2e0` |
| Seed jobs image | `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-jobs@sha256:b5c911962827b063eac223dc1910aeaf0f4e121a34e925747d8f950a2440478a` |

Health/readiness and final baseline reads matched the full served SHA. Final Cloud Run readback confirmed unchanged image/revision/traffic. The evidence branch/commit is separate from the serving source; this PR does not deploy its documentation.

## 2. Actual account preparation

Fresh successful inventories confirmed the selected seed secret/job absent before creation. Authorized steps completed:

| Action | Actual result |
|---|---|
| A09-SEED-01 | Created `fasttrack-demo-password`, enabled version 1. A strong generated synthetic password was passed privately through stdin and retained locally only as Windows-user DPAPI-encrypted data. No secret payload was read back or printed. |
| A09-SEED-02 | Granted existing runtime identity `sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com` Secret Accessor on this individual secret; binding read back. No project-wide role or web env/reference change. Its effective access expands because the identity is shared with the job. |
| A09-SEED-03 | Created `fasttrack-seed-c04` using the pinned accepted-main jobs image and `npm run db:seed --workspace @fasttrack/server`. Verified DB/seed secret version 1 references, existing SQL attachment, one task/parallelism one, max retries 0, timeout 600 seconds, 1 CPU / 512 MiB. |
| A09-SEED-04 | Exactly one successful execution, `fasttrack-seed-c04-x9crb`, completed `2026-11-12T04:00:48.956602Z`; final execution list contained only this execution with succeededCount 1. |

The accepted add-only seed supports up to five users/two teams/three memberships and preserves existing records/passwords. A pre-seed DB row count was not collected, so this record does not assert that all five accounts were newly inserted. Supervisor A, Student A1 and Supervisor B logins succeeded; Student A2 and Student B1 appeared in their respective team membership UI. Their separate logins were not needed or claimed.

The local pre-execution validator initially stopped after job creation because it expected Cloud SQL annotations at the wrong response nesting. Read-only inspection found them at `spec.template.metadata.annotations`. The validator was corrected and all intended fields verified; the job was not recreated and no execution occurred before verification. Neither seed nor migration was replayed.

The generated password and local browser-tool files are outside Git. No account credential, cookie value, CSRF token or private request payload is included in this package.

## 3. Executed cases

| Case | Actual public operation and result | Evidence |
|---|---|---|
| C04-01 | Supervisor A signed in, opened Team A, observed no milestones, completed the milestone form and clicked Create milestone once. Observed POST 201 and subsequent scoped GET 200; saved deadline rendered as 19 Nov 2026, 11:04:00 Asia/Bangkok. | Baseline milestone identity/values below; UI request observation recorded in results JSON. |
| C04-02 | Student A1 signed in in a different browser context, used Submit work for that milestone and submitted the synthetic title/description/URL once. POST 201; saved page and GET returned version 1 by Student A1. | Submission identity/values; Student screenshot. |
| C04-03 | Supervisor A deep-linked to the exact saved submission, saved one feedback intent via UI, and received POST 201. Student A1 reloaded and saw the same feedback for version 1. | Exact feedback/submission association; both role screenshots; counts remain one. |
| C04-04 | Supervisor B authenticated separately and had only Team B in its scoped list. GET of Team A's submission returned 404 `NOT_FOUND`, generic message and empty fields. The public UI showed Submission unavailable without Team A data. | Wrong-team result and screenshot; original-record comparison after denial. |
| C04-05 | Both authorized roles reloaded/read the saved journey; IDs, values and relationships matched. Cookie attributes Secure/HttpOnly/SameSite=Lax and exact host were observed without values. Controlled foreign-Origin and missing-CSRF feedback probes each returned 403 `FORBIDDEN` with the corresponding source/token message; feedback count/ID remained unchanged. | Source/CSRF results and final cross-role canonical-record comparison. |

Submission URL: `https://example.com/fasttrack-c04`. This is synthetic work content; no external work document was uploaded or fetched as an application test.

The milestone POST response-body capture became unavailable after full-page navigation. Its actual 201 status was observed in the browser request summary (entry 23), and the saved detail/GET established its persisted identity. No create was retried. This capture limitation is retained in the results instead of replacing it with an invented response body.

## 4. Immutable original-record ledger

Canonical machine-readable [baseline](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json) observed by Student A1 at `2026-11-12T04:08:48.655Z`. Preserve it unchanged. Later after-restart/redeploy observations must be new artifacts comparing these identities, never replacements or newly seeded lookalikes.

| Entity | Actual identity / relationship | Preserved values / UTC timestamps |
|---|---|---|
| Team A | `7c600ee0-a595-4c52-a093-f0ed5e08fded` | Assigned Supervisor A; members Student A1/A2. |
| Supervisor A | `6d467a72-a32c-4eff-a9a5-e7897deb4fd2` | Assigned author of the saved feedback. |
| Student A1 | `03838685-bf47-4dd4-b99b-b689f863cdb3` | Author of the original submission. |
| Milestone | `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d` -> Team A | `C04 baseline 2026-11-12 0404 UTC`; created `2026-11-12T04:04:50.033Z`, due `2026-11-19T04:04:00.000Z`, not cancelled. Full description in baseline. |
| Submission | `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` -> milestone above, Student A1, version 1 | `C04 initial submission`, synthetic URL above, submitted `2026-11-12T04:07:08.322Z`; full description in baseline. |
| Feedback | `b9ebf7f7-a542-4b89-95a8-8f1de22a5357` -> that exact submission/version | `C04 verified feedback on the exact original submission version. Preserve this record through restart and redeploy.` Created `2026-11-12T04:08:02.974Z`. |
| Feedback intent | `d8e93c8b-3968-4c54-b5a7-e0ebaed367ad` | Non-secret client request UUID; do not create another feedback to replace this identity. |

After denial/guard probes, Supervisor A read the same records at `04:12:00.480Z` and Student A1 at `04:14:02.869Z`. Canonical equality held for team, milestone, submission, feedback and both counts. Their sorted compact JSON projection has SHA-256 `c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e` (projection keys/method recorded in the machine-readable results).

Student cookie expiry was observed as `2026-11-12T12:06:39.354929Z`. This is browser cookie metadata, not a measured eight-hour survival or a server-expiry query. No baseline session was logged out. A separate short-lived smoke session was used for the logout check below.

## 5. Supporting evidence and actual limits

[Actual results JSON](../../../../Project_code/docs/evidence/R2-J01-C04-results.json) retains the sanitized execution journal, wrong-team denial, source/CSRF errors, UI status provenance, authenticated smoke and final equality result. It contains no cookie/token value or secret payload.

Accepted-source public/authenticated smoke completed outside the browser using the dedicated Student account in private environment variables:

```text
PASS /api/health
PASS /api/ready
PASS /
PASS /api/nonexistent
PASS login, /api/auth/me, and read-only scoped /api/teams
PASS logout
```

Selected screenshots were inspected for readability and absence of credentials, then retained byte-identically. They capture the page viewport, not browser address-bar chrome; the actual canonical URL, route, role and served source are recorded here and in the machine results.

1. [Student feedback view](C04-student-feedback.png): canonical origin, route `/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`, source `16ec6d2`; Student A1 sees saved version 1 and Supervisor A's exact feedback after reload.
2. [Supervisor feedback view](C04-supervisor-feedback.png): same origin/route/source; assigned Supervisor A sees the original work and saved feedback, with a separate empty new-intent form.
3. [Wrong-team denial](C04-foreign-denial.png): same origin/route/source; Supervisor B sees only the generic unavailable state.

An attempted export of authenticated browser state to local JSON was rejected by automatic approval review because it would persist cookies/tokens without explicit export authorization. That command did not run. Verification continued in the already-open isolated browser contexts; no export or alternative credential-persistence workaround was performed. These live sessions are not a guarantee of availability in a later run. Session-continuity evidence remains unclaimed.

No application source, schema, dependency, protected branch or runtime revision changed. Desktop browser behavior was exercised; this run is not a full accessibility/mobile/concurrency or independent UAT result. No new application defect was found within these bounded cases. B's independent record readback and acceptance are PENDING.

## 6. Next checkpoint

C-04 assisted verification and the original-record baseline were accepted by B at head `9077d22` and merged through PR #96. Issue #16 stays OPEN / Acceptance PENDING. The subsequent authorized [controlled restart result](C05-persistence.md) passed its restart half with explicit zero/new-instance provenance and the same original IDs/content. That execution has separate newly baselined sessions because the C04 browser contexts were already closed. B must review the new execution evidence; later B/10 release and A/11 same-ID redeploy comparison remain separate. Do not rerun seed, first bootstrap, migration or business creates to resume this task.
