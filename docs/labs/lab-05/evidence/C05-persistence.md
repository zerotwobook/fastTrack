# C-05 persistence: controlled restart result

**Restart half: PASS. Later redeploy: NOT RUN. Whole C-05 and human acceptance: PENDING.** A (`zerotwobook`) executed one authorized service-only scale-zero/restore-auto experiment on 12 November 2026. B (`Atip-Infa`) must independently review this result. This is R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16), execution [PR #98](https://github.com/zerotwobook/fastTrack/pull/98), branch `docs/s2-a-restart-execution`.

**Later checkpoint:** B accepted this exact restart evidence at `b1a8357` and merged PR #98. The separate [A/11 post-redeploy report](C05-redeploy.md) now verifies the same original IDs/values after actual source `8e637e5` on `fasttrack-app-00003-rc7`. Its domain comparison passes; B's post-release cross-check and whole acceptance remain pending. The NOT RUN cells below describe this preserved restart-stage observation, not the later experiment's current outcome; use the linked three-stage table and separate JSON for after-redeploy values. Closed earlier browser contexts do not establish session survival.

The service recovered with the same source, image, revision, traffic and revision-template hash. Both roles read the exact original C04 records afterward without logging in again between the experiment's before/after checks. No seed, migration, DB write, image/env update, IAM change, new revision, protected merge or main release was performed.

## 1. Authorization and experiment boundary

B approved preparation head `ab555a31a87bcc3597a6f86329cc729591425f7a` in PR #97 and merged it into staging as `e1db7854e2338a33983199d99a69070c97ef5f50`. In direct response to the concrete request for a five-minute window, restoration by T+120 and recovery deadline T+300, the user confirmed the merge, reported B was not deploying and instructed continuation. Issue #16 records that actual authorization and the Started readback before edits/execution. The release hold is user-reported; no direct B restart witness is invented.

Fresh preflight verified accepted main/source `16ec6d268ac087f3834be7da55dda29e589847ce`, revision `fasttrack-app-00002-f75`, 100% traffic without tags, no active main deployment, working health/database readiness and equality with the frozen original records. The target was only project `fasttrack-se-002`, region `asia-southeast1`, service `fasttrack-app`, canonical origin `https://fasttrack-app-kpx7au3w2a-as.a.run.app`. Persistent storage remained the existing `fasttrack-db` / `fasttrack_prod` configuration.

The old C04 browser contexts were closed before execution. New isolated `ft-c05-student` and `ft-c05-supervisor` contexts were explicitly logged in and baselined for this restart. Their observed survival does not establish continuity of the unavailable original C04 contexts or eight-hour survival. No browser session-state export was performed.

## 2. Actual commands, timing and recovery

These two commands were executed once each. They are an audit record, **not a resume recipe**:

```bash
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=0 --quiet
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=auto --quiet
```

[Cloud Run manual scaling](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling) changes service-level instance allocation without redeploying. The [CLI reference](https://docs.cloud.google.com/sdk/gcloud/reference/run/services/update) supports restoration to `auto`. An independently armed hidden watchdog process owned restoration; a mutually exclusive parent fallback was prepared but not used. The executor refused to repeat scale-zero once its start journal existed. Restore timing did not depend on successful metric collection.

All table times are UTC on 12 November 2026. The experiment started at **13:13:10 Asia/Bangkok**; health/readiness recovered by **13:15:03**.

| Event | Actual UTC time / result |
|---|---|
| Experiment start | `06:13:10.448417Z` |
| Scale-zero command | `06:13:10.458133Z` to `06:13:18.083538Z`, exit 0 |
| First manual-zero / disabled health observation | Manual count 0; health 503, about T+7.9 seconds |
| Explicit platform zero sample | `06:14:00Z`: active=0 **and** idle=0 |
| Watchdog starts restore-auto | `06:14:40.646466Z`, T+90.198 seconds, within the T+120 deadline |
| Restore command completes | `06:14:47.312342Z`, exit 0; no retry or parent fallback |
| New same-revision instance starts | `06:14:59.596620Z`, platform reason `AUTOSCALING` |
| Application listens in that new instance | `06:15:01.062081Z` |
| First observed restored health | `06:15:02.661902Z`, 200 / `ok` / original source |
| Database readiness | `06:15:03.181580Z`, 200 / `ready` / `connected` / original source |
| Recovery check completes | T+112.733 seconds, within the T+300 deadline |

The first health probe after the auto configuration appeared returned 500 during recovery; subsequent health/readiness succeeded. Manual-mode observations returned 503 as expected. This is an observed polling sequence, not an exact measurement of every user's availability. No extra restart or deployment was used to resolve the transient response.

Before/after runtime checks preserved service max 3, revision max 2, default min 0, concurrency 8 and 100% traffic to the same revision. Manual-mode API output did not expose the automatic maximum; restoring `auto` read back max 3 without an extra setting command. Service generation changed 2 -> 3 -> 4, while the revision stayed unchanged. The complete revision-template SHA-256 remained `59f85e6560ab9163e75d2d102e40c7cbe4c0eccd664b6053b13c4479fccbd2fd`.

The pinned web index remained `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-app@sha256:7eadbc226af98dd0231513ada70a33f1fb2c59a19ebcca301430221a836eb2e0`. This experiment did not build/upload an image or create a revision, so it is distinct from B/10's later visible-change release.

## 3. Old-stop / new-start provenance

The [sanitized machine result](../../../../Project_code/docs/evidence/R2-J01-C05-restart.json) contains full old/new instance IDs, allowlisted observations, startup events, complete active/idle metric points, before/after role reads and the actual restoration journal.

- The captured preflight serving instance ID began `00e8a408bd2e46ca`.
- A complete `run.googleapis.com/container/instance_count` query returned both active and idle series, with no remaining page. At `06:14:00Z`, both values were explicitly zero. That sample lies strictly inside the observed manual-zero interval, after the first manual observation and before the watchdog's `06:14:40.646311Z` manual readback.
- The new instance ID began `00e8a408bd95f4ee`. It was absent from the preflight instance set and started at `06:14:59.596620Z`, after the zero sample and restoration. Its application-listening event and later serving logs use the same ID and original revision. Serving logs were also observed after the role readbacks.

This establishes a platform-observed zero-instance boundary followed by a distinct new serving container. The application does not expose an exact process-exit timestamp, and no SIGTERM observation is claimed. A missing metric series would have been unknown, not zero. Metric collection continued after restoration; downtime was not extended to wait for the [documented sampling/visibility delay](https://docs.cloud.google.com/monitoring/api/metrics_gcp_p_z).

The earlier natural-turnover observation in the immutable [preparation result](../../../../Project_code/docs/evidence/R2-J01-C05-preflight.json) remains INCOMPLETE: its zero sample followed startup. It is historical context and is not used to pass this controlled experiment.

## 4. Original-record and session comparison

The [original C04 baseline](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json), committed at `9077d22386fcb4dc7eb8adb66017e3c26f1b6878`, is unchanged. The comparison includes the full team, milestone, submission, feedback and counts, not just visible names. The canonical record SHA-256 remains `c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e` in both roles before and after.

| Check | Baseline | After controlled restart | After later redeploy | Expected / result |
|---|---|---|---|---|
| Milestone | `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d` | Same ID/team/title/description/dueAt/state/timestamps | NOT RUN | Equal / PASS |
| Submission | `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`, version 1 | Same ID/milestone/author/version/title/description/URL/timestamp | NOT RUN | Equal / PASS |
| Feedback | `b9ebf7f7-a542-4b89-95a8-8f1de22a5357` | Same ID/exact submission/author/content/client intent/timestamp | NOT RUN | Equal / PASS |
| Counts and team scope | One submission, one feedback; original Team A membership | Identical counts and relationships in both roles | NOT RUN | Equal / PASS |
| Source/image/revision/traffic | Accepted `16ec6d2`, pinned image, `fasttrack-app-00002-f75`, 100% | Unchanged; identical revision-template hash | NOT RUN | Equal / PASS |
| Restart-specific Student session | New login, authenticated before read at `06:09:02.702Z` | Authenticated same context at `06:16:25.721Z`, no intervening login | NOT RUN | Current valid session survives / PASS |
| Restart-specific Supervisor session | New login, authenticated before restart | Authenticated same context at `06:16:31.062Z`, no intervening login | NOT RUN | Current valid session survives / PASS |
| Original C04 contexts / full eight-hour lifetime | Contexts already closed before restart | NOT RUN; no replacement-session claim | NOT RUN | Limitation retained |

Cookie attributes and absolute expiry were identical before/after in each restart-specific context: Secure, HttpOnly, SameSite=Lax, canonical domain and `/` path. Cookie values, CSRF tokens, request headers and session files were not retained. Both roles then reloaded the original submission route through the actual UI and saw the saved version and exact feedback.

## 5. Verification and visual evidence

Actual local evidence validation checked original-file preservation, full record equality, source/image/traffic and revision-template equality, zero/new-start ordering, restoration/recovery deadlines, no telemetry pagination, unchanged role/cookie attributes and credential-free schema. Public smoke passed health, database readiness, frontend and unknown-API 404. Its optional separate login case was skipped because no smoke credentials were configured; the two real role logins and authenticated before/after reads were independently performed as described above. Current-head CI and peer-review status are recorded in PR #98 and Issue #16 rather than inferred from earlier runs.

These inspected desktop viewport screenshots are retained byte-identically from `output/playwright/C05-restart-20261112/`. They contain no credentials or browser address bar; the exact canonical origin, source and route `/submissions/baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` are recorded above and in the JSON:

1. [Student after restart](C05-restart-student.png): Student A1 sees the original version 1, saved URL and exact Supervisor A feedback.
2. [Supervisor after restart](C05-restart-supervisor.png): Supervisor A sees the same original submission and feedback. No new feedback was submitted.

This bounded check is not a mobile/accessibility suite, full eight-hour test, independent UAT or B witness. Private helper syntax validation caught a missing newline before execution; it was corrected before any cloud command. No failed preflight command was retried as another scale-zero operation.

## 6. Handoff and remaining work

B must review the actual execution packet, including time ordering, original IDs, session scope, restored limits and the transient recovery response. A successful restart half does not complete C-05, #16 or #15. Keep whole-task Acceptance PENDING and do not replay this interruption for convenience.

After B accepts this restart evidence, the next distinct phase is B/10's reviewed visible-change delivery and live WIF/release trace (C-06), followed by A/11 reading these same original IDs after that redeploy (the remaining half of C-05). B/10 is a separate invocation. Every concrete main candidate still requires actual user review and authorization under [the main-release gate](../../../../workflow/MAIN_RELEASE_GATE.md). No main candidate is authorized by this restart decision.
