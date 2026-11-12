# C-05 persistence: restart preparation and observation

Owner: A (`zerotwobook`), R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). B (`Atip-Infa`) is the independent reviewer. This phase follows B's accepted staging merge of PR #96 at `95a541927726d8a5fe599b68bf20b05ff0fc586a`.

**Execution checkpoint: AUTHORIZED, not yet performed. Later redeploy: NOT RUN.** After B approved preparation head `ab555a3` and merged PR #97 as `e1db7854e2338a33983199d99a69070c97ef5f50`, the user explicitly instructed continuation in direct response to the five-minute-window request and reported that B is not deploying. This authorizes the unchanged service-only scale-zero/restore-auto operation below, with restoration by T+120 and recovery deadline T+300. It does not authorize a main release or additional cloud/DB changes. The original natural-turnover observation remains INCOMPLETE.

The new execution phase uses A's `docs/s2-a-restart-execution` branch from that staging merge. Issue #16 was changed/read back Started / NOT RUN / PENDING before edits. Fresh runtime identity remains source `16ec6d2`, revision `fasttrack-app-00002-f75`, 100% traffic; no open release PR or active main deployment was found. The release hold is user-reported, not a fabricated direct B witness. Previous C04 browser contexts are closed; new isolated role logins will establish this experiment's session baseline. C04-original-session continuity is NOT RUN because those contexts are unavailable.

## Original records and current observations

The immutable [C04 baseline](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json), committed at `9077d22386fcb4dc7eb8adb66017e3c26f1b6878`, remains authoritative. Do not seed again or recreate these records:

| Entity | Original identity |
|---|---|
| Milestone | `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d` |
| Submission | `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd`, version 1 |
| Feedback | `b9ebf7f7-a542-4b89-95a8-8f1de22a5357` |

At `2026-11-12T04:45:16.686Z` (11:45:16 Asia/Bangkok), the retained original Student browser context successfully read the original journey without a new login. The retained Supervisor context did the same at `04:49:36.604Z`. Both observations exactly matched the frozen team, milestone, submission, feedback and counts; the canonical comparison SHA-256 remained `c5396255105bfccd8f13ec0b8469aae6d1ab2a3a7923a13a55253e582bbe0f4e`. Source remained `16ec6d268ac087f3834be7da55dda29e589847ce`. These are new preflight observations, not a completed controlled restart or an eight-hour survival test.

The separate [machine-readable preflight](../../../../Project_code/docs/evidence/R2-J01-C05-preflight.json) retains exact observation times, original-session references and cookie attributes without values, runtime identity, old/new instance IDs, safe startup events and raw metric points. It does not replace the original baseline. Fresh public smoke passed `/api/health`, `/api/ready` (database connected), `/` and unknown-API 404; optional separate smoke login was skipped because no smoke credentials were configured. Authenticated record reads above were independently performed in both retained browser contexts.

Cloud Logging also recorded a new same-revision instance starting for `AUTOSCALING` at `04:44:53.571345Z`, followed by the application listening at `04:44:55.036185Z`. Monitoring reported active=0 and idle=0 at `04:45:00Z`, then active=1 at `04:46:00Z`. The zero point is later than startup, so it cannot establish an unambiguous interval with no old process before the new process began. No old-instance termination signal was found in the inspected log interval. **Do not promote this natural turnover observation to restart PASS.** Detailed sanitized observations and equality checks will accompany the completed preparation handoff.

## Concrete proposed operation

This operation narrows [A/09 sections 7–8](../../../../prompt_project/prompt_lab5/A/09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md#7-prepare-a-distinct-supported-restart-experiment). The user has now supplied the actual window decision and current release-hold report. Recheck the unchanged target immediately before execution.

| Field | Exact scope |
|---|---|
| Target | Project `fasttrack-se-002`, region `asia-southeast1`, service `fasttrack-app` only |
| Expected revision | `fasttrack-app-00002-f75`, 100% traffic, no tagged revisions |
| Origin | `https://fasttrack-app-kpx7au3w2a-as.a.run.app` |
| Persistent DB | Existing `fasttrack-db` / `fasttrack_prod`; no DB mutation belongs to this experiment |
| Availability window | One agreed five-minute maintenance window starting immediately after fresh preflight. Expected disabled period at most two minutes; start restoration by T+120 seconds even if proof is absent. Recovery/readiness deadline T+300 seconds. These are operator deadlines, not a platform recovery guarantee. |
| User decision | AUTHORIZED in direct response to the concrete five-minute-window request; recorded in Issue #16 before execution |
| B coordination | User reports B is not deploying and instructs continuation. No direct B restart witness is claimed. |
| Preservation | Same source, image, revision, traffic and DB; automatic min 0, service max 3, revision max 2, concurrency 8 |
| Scope exclusions | No seed, migration, reset, image/env update, resource deletion, IAM change or main merge |

[Cloud Run manual scaling](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling) supports a service-level fixed instance count without redeployment. Zero disables service traffic; traffic-tag-only revisions require separate consideration and must be absent at preflight. The [CLI reference](https://docs.cloud.google.com/sdk/gcloud/reference/run/services/update) supports restoration to `auto`.

```bash
# Execute only within the authorized window, after the preflight below.
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=0
# Restore by T+120 seconds, even when instance proof remains unavailable.
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=auto
```

## Execution and recovery checklist

1. Read back actual main, active deployment runs, B's release hold, service generation/scaling/revision/traffic/image and health/readiness. Stop before mutation if the target identity changes, tags appear, another release starts or the window is no longer available. Keep original browser sessions private; never export cookies or tokens.
2. Read the same three original IDs and compare the frozen values/relationships/counts before disruption. Capture the serving old instance identity from filtered Cloud Logging; current preflight IDs must not be reused blindly at execution.
3. Record actual UTC/Bangkok start and deadline, submit the one approved scale-zero operation, and verify its current state. Arm a separate operator watchdog before the command so a slow CLI call cannot suppress the T+120 restoration attempt. Do not extend disabled time to wait for metrics.
4. Capture explicit platform instance-count points for both `active` and `idle` states, with complete series coverage and timestamps wholly inside the confirmed disabled interval. A missing series/point is unknown, never zero. A disabled response/configuration alone is insufficient. Retain only allowlisted timestamps/counts/revision/instance IDs.
5. Restore `auto` by T+120 regardless of the observation result. If an update errors, inspect its actual operation/service state, then retry only the same authorized restoration when needed; do not replay scale-zero. At T+300, report any unresolved outage and the actual last state. Do not redeploy or mutate the DB as recovery.
6. Verify restored automatic scaling, original limits/concurrency/source/image/revision/traffic, public health/readiness, and a new serving instance ID distinct from the captured old ID. Collect delayed metric points after service restoration. The metric is sampled every 60 seconds and can be delayed up to 120 seconds, according to the [official metric catalog](https://docs.cloud.google.com/monitoring/api/metrics_gcp_p_z); this does not justify longer downtime.
7. Read the exact original IDs as Student and Supervisor, compare all baseline values/counts, and refresh the original submission UI. Observe the retained session only within its original absolute TTL. A fresh login cannot prove old-session continuity.
8. Mark PASS only with coherent zero/termination and new-start provenance plus unchanged original records and runtime identity. Otherwise restore availability and retain INCOMPLETE/FAILED with the actual reason. B must independently review the resulting evidence; no acceptance is presumed.

## Comparison and handoff

| Check | Baseline | Current preflight | After authorized restart | After later redeploy | Result |
|---|---|---|---|---|---|
| Original milestone/submission/feedback | Frozen C04 ledger | Exact equality in both retained roles, counts 1 submission / 1 feedback | NOT RUN | NOT RUN | Preflight PASS |
| Source/revision | `16ec6d2` / `fasttrack-app-00002-f75` | Unchanged | NOT RUN | NOT RUN | Preflight only |
| Original role sessions | C04 retained Student / Supervisor contexts | Authenticated without new login at 04:45:16Z / 04:49:36Z | NOT RUN | NOT RUN | No full-TTL claim |
| Old process stopped / new process served | Not applicable | Natural turnover observed; temporal proof insufficient | NOT RUN | NOT RUN | INCOMPLETE |

The next B/10 visible-change release and A/11 redeploy comparison remain separate. Keep their dependency pending while the required restart proof is incomplete. A main candidate still needs the user's review and authorization under [the main-release gate](../../../../workflow/MAIN_RELEASE_GATE.md). This staging preparation does not complete #16 or authorize an external message, protected merge or release.

B approved the C04 artifact head `9077d22386fcb4dc7eb8adb66017e3c26f1b6878` and merged PR #96 into staging. That accepted baseline review is separate from a current execution hold or witnessing this future restart. The current packet is [PR #97](https://github.com/zerotwobook/fastTrack/pull/97); its initial plan commit was `80854de2535202406d68261c144c116e3f7278b7`. No production scaling, data mutation, session export or release occurred while preparing it. Two CLI log-filter quoting errors produced no data or mutation; the successful read-only Logging API query supplied the sanitized provenance instead.
