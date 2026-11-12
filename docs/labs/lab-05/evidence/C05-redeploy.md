# C-05 redeploy: A/11 readback

Owner: A (`zerotwobook`), R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). B (`Atip-Infa`) independently cross-checks the actual records. This phase observes the completed release; it does not deploy again or create replacement data.

**A-assisted domain persistence: PASS across the distinct restart and later redeploy. Wrong-team denial, visible change and C-06 identity cross-check: PASS. Retained-session survival: NOT ESTABLISHED. B post-release cross-check and whole acceptance: PENDING.** Actual observations are retained in the separate [machine result](../../../../Project_code/docs/evidence/R2-J01-C05-redeploy.json); the original before/restart artifacts are unchanged.

## Actual release boundary

- B approved exact release head `80ad1df62700c9aba5d1ac84441143b85e19c629` on base `16ec6d268ac087f3834be7da55dda29e589847ce`; the user authorized that concrete candidate. [PR #100](https://github.com/zerotwobook/fastTrack/pull/100) merged as `8e637e537cd037d630a5fffc1b5672d1b44371a8`.
- The automatic push run `43185679995` was cancelled before any deploy step because its B initiator conflicted with B-only independent environment approval. The user separately authorized the bounded cancellation and one A-initiated replacement; no protection was weakened.
- [Replacement run 43186570077](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077), event `workflow_dispatch`, A initiator, exact main source `8e637e5`, completed SUCCESS. The actual approval API identifies `Atip-Infa` approving `demo`. CI, WIF, both image builds/uploads, migration/rollout, smoke and summary steps succeeded. This is manually triggered delivery of the accepted main source, not an automatic-push success claim.
- Actual migration execution `fasttrack-migrate-dnvqn` completed at `2026-11-12T09:05:39.568704Z`, succeeded count 1. The older bootstrap execution is separate.
- Public health/readiness returned 200 / database connected / source `8e637e537cd037d630a5fffc1b5672d1b44371a8`. Filtered Cloud Run readback identifies revision `fasttrack-app-00003-rc7` with 100% traffic. The actual deployed Sign in page displays “Track your team's milestones, submissions, and feedback.”

## Runtime, image and DB identity

The actual main SHA differs from the release PR head, as expected for its accepted merge. Full-SHA registry tags, the service image, migration execution image and workflow source were independently correlated:

| Field | Actual post-release value |
|---|---|
| Service / region / project | `fasttrack-app` / `asia-southeast1` / `fasttrack-se-002` |
| Source | `8e637e537cd037d630a5fffc1b5672d1b44371a8` |
| Revision / traffic | `fasttrack-app-00003-rc7` / single 100% assignment |
| Web registry digest / configured service image | `sha256:d7606d79c068f7e86796e33f2f0872a02954f1c7a7d5b2d2253a43a1a334cb99` |
| Jobs registry digest / migration execution image | `sha256:5e94cc946c3ec00353048ec598d082eed0fa1814b24e08e3ea057fdeca5df4d4` |
| Runtime identity | Existing `sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com` |
| Persistent DB attachment | Unchanged `fasttrack-se-002:asia-southeast1:fasttrack-db` |
| DATABASE_URL reference | Unchanged individual secret `fasttrack-database-url`, version `1`, in service and migration execution; no payload read |
| APP_ORIGIN / RELEASE_SHA | Canonical HTTPS origin / exact actual main SHA above |
| Limits | Automatic min 0 / service max 3 / revision max 2 / concurrency 8 |
| Migration | `fasttrack-migrate-dnvqn`, one task/parallelism 1/max retries 0, command `npm run db:migrate --workspace @fasttrack/server`; succeeded 1, failed 0 |

Safe metadata includes the revision's resolved digest separately from the configured index, avoiding an assumption that platform-specific and index digests are identical. No DB connection string, secret value, full environment dump or raw deployment log is retained. Unchanged attachment/reference metadata plus exact original data support continuity of the intended DB; an unchanged service name alone would not prove it.

The actual workflow smoke log passed health, readiness, frontend and unknown-API 404. Its optional login case was **SKIP** because smoke credentials were not configured. The real Student/Supervisor logins and scoped record reads below were separate checks, not a retroactive workflow-smoke PASS. A private log-reader encoding error was corrected and only read-only collection was repeated; no migration or deployment was repeated.

## Preserved evidence and session limit

The immutable [original C04 ledger](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json) and [actual distinct restart result](../../../../Project_code/docs/evidence/R2-J01-C05-restart.json) remain unchanged. Compare the original milestone `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d`, submission `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` version 1 and feedback `b9ebf7f7-a542-4b89-95a8-8f1de22a5357`, including full values/relationships/counts. Do not seed, reset or recreate them.

Both prior restart-specific browser contexts were observed unavailable before this readback. Their redeploy-session continuity is NOT ESTABLISHED; no claim is made that they expired naturally or survived. Fresh isolated approved synthetic roles established domain persistence, normal access and wrong-team denial. All three temporary contexts were signed out through the real UI, and subsequent `/api/auth/me` returned 401. No session-state export occurred, no token values were retained, and no original records were created/changed.

## Actual three-stage comparison

Student A1 read at `2026-11-12T09:12:36.422Z` and assigned Supervisor A read at `09:12:39.660Z` (16:12 Asia/Bangkok). Compare full `team`, `milestone`, `submission`, `feedback`, `submissionCount` and `feedbackCount` using sorted compact JSON, preserving timestamps and exact text. Both role observations equal the baseline and both roles' actual post-restart observations. The common canonical SHA-256 remains `c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e`.

| Case / assertion | Original baseline | After distinct restart | After later redeploy | Expected / actual |
|---|---|---|---|---|
| C05-01 milestone | `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d`, Team A, original title/description/dueAt/state/createdAt | Same exact identity and values | Same exact identity and values, both roles | Equal / PASS |
| C05-02 submission | `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`, exact milestone/author/version 1/title/description/URL/time | Same exact record | Same exact record, both roles | Equal / PASS |
| C05-03 feedback | `b9ebf7f7-a542-4b89-95a8-8f1de22a5357`, exact submission/author/content/intent/time | Same exact association and values | Same exact association and values, both roles | Equal / PASS |
| Counts / team scope | One submission / one feedback; original membership and supervisor | Equal | Equal | No replacement/extra record / PASS |
| Source boundary | `16ec6d2` / `fasttrack-app-00002-f75` | Same source/revision, explicit zero then new serving instance | New accepted `8e637e5` / `fasttrack-app-00003-rc7`, original DB references | Distinct operations / PASS |
| C05-04 retained-session survival | Original C04 contexts closed before restart; new restart-specific sessions established | Those new sessions survived the measured restart | Contexts already unavailable; new A11 logins do not establish survival | NOT ESTABLISHED; full eight-hour test NOT RUN |
| C05-05 wrong-team scope | Supervisor B / Team B reads original Team A submission -> 404 | C04 guard remains prior evidence; restart checked original values | Fresh genuine Supervisor B / Team B request -> 404 `NOT_FOUND`; generic UI only | No protected payload / PASS |

The final denial occurred at `09:12:42.315Z` with exactly `{"code":"NOT_FOUND","message":"The requested resource was not found.","fields":{}}`. Team B membership was verified in its own authenticated scope. The probe was a safe GET; no forbidden write or new business history was attempted. Both authorized roles then deep-linked the exact original submission UI and saw version 1 and the exact original feedback. No similarly named or newly seeded replacement was used.

## Actual visual and cleanup evidence

These four inspected desktop viewport screenshots are retained byte-identically with hashes in the JSON. They omit browser address-bar chrome; the exact origin/route/source is recorded in the JSON and captions. They do not claim mobile/accessibility or independent UAT coverage.

1. [Deployed Sign in copy](C05-redeploy-login.png): canonical origin `/login`, actual new sentence, source `8e637e5`; captured before credentials were entered.
2. [Student original feedback](C05-redeploy-student.png): same origin, `/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`, source `8e637e5`; original submission/version/content/feedback visible after reload at `09:13:29.096Z`.
3. [Supervisor original feedback](C05-redeploy-supervisor.png): same origin/route/source, original feedback visible at `09:13:31.496Z`; no new feedback submitted.
4. [Wrong-team generic denial](C05-redeploy-foreign.png): same origin/route/source, `Submission unavailable` at `09:13:34.546Z`; no Team A private record displayed.

Temporary Student, Supervisor A and Supervisor B sessions were all confirmed logged out with `/api/auth/me` 401 at `09:13:51.725Z`, `09:13:53.257Z` and `09:13:53.082Z`, respectively. Initial anonymous-session 401 and the intended foreign-scope 404 were expected guard responses. No new application defect was identified in this bounded verification.

## B cross-check and handoff

The full trace now has actual evidence: visible task [PR #99](https://github.com/zerotwobook/fastTrack/pull/99) -> staging `80ad1df` -> user-authorized [release PR #100](https://github.com/zerotwobook/fastTrack/pull/100) -> actual main `8e637e5` -> cancelled zero-deploy-step push run -> separately authorized [A-initiated replacement](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077) -> actual B `demo` approval -> live WIF / web+jobs digests / successful migration -> new revision/100% traffic / source / visible change -> this same-ID comparison. A independently cross-checks C-06 identity here; B owns final C-06 release acceptance.

B should use the approved private test-account channel, never chat/Git credentials, to independently open the canonical URL as Student A1 and Supervisor A; read the exact milestone/submission/feedback IDs above, verify original content/version/relationships and compare the canonical JSON/report. In a separate genuine Supervisor B session, verify Team B scope and the same safe 404. Record actual time/source/results and log out temporary sessions. B's real pipeline environment approval and prior restart/copy reviews do not constitute this new record readback. B post-release witness/acceptance remains PENDING until actually performed.

Review this increment in [PR #101](https://github.com/zerotwobook/fastTrack/pull/101). No original JSON is overwritten, no release is repeated, and Issue #16 stays OPEN. After actual peer acceptance, B/12 may separately assemble/reconcile Answer Parts 0–4, the evidence index and contributions as Markdown. The user handles final PDF export/upload unless explicitly requested otherwise; no report completion, submission or whole #15/#16 acceptance is fabricated.

This branch also preserves accepted main ancestry for a reviewed staging sync; no protected branch is changed directly. Follow the actual early-Draft/Started workflow. Later report-source preparation is separate, no PDF/export/upload or new cloud mutation is authorized here.
