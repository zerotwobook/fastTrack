# A / 11: compare the original records after the actual pipeline redeploy

## Invocation, responsibility and hold

I am A (`zerotwobook`), verifying the redeploy half of **C-05** and independently checking C-06 identity under **R2-J01 / Issue #16**. B (`Atip-Infa`) cross-checks the real read-back. This is an observation/evidence phase after B/10, not a new deployment.

**If the user requests prompt authoring only, edit Markdown and stop.** Do not log into the public app, read private records, change #16, redeploy or run persistence checks under that authoring request.

When explicitly invoked, prepare/validate the evidence gate, execute the selected safe read-back or resume incomplete observations. Do not create replacement records, seed/reset a DB, trigger another release or proceed to B/12 automatically. Use English Markdown for project narratives; no PDF generation/export/upload.

## 1. Read and require a valid experiment

Read [all shared rules](../00_SHARED_EXECUTION_RULES.md), current #16, accepted domain/auth contracts, Lab 5 plan sections 8.3/10/11, [A/09](09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md) baseline/restart record and [B/10](../B/10_R2-J01_RELEASE_AND_TRACEABILITY.md) actual main merge/run/revision handoff.

Inspect the actual URL, source/main SHA, image digests, revision/traffic, readiness and public test access. Do not print credentials or full env/connection strings. A currently open IDE file is not proof of committed, tested or served source.

Require all three time-ordered stages:

| Stage | Required evidence | Invalid substitute |
|---|---|---|
| Before disruption | A/09's real original IDs/content/relationships at a known public release/time | A reconstructed before-state written after release |
| Distinct restart | Actual supported restart provenance and the same-ID read-back with DB preserved | A revision change counted twice or a planned operation |
| Later redeploy | B/10's real authorized main pipeline release and verified served identity | A Draft PR, local image or old/manual unrelated run |

If a stage is missing, preserve the existing facts and mark the experiment INCOMPLETE. Prepare a legitimate new baseline/restart/redeploy plan with owners/user when necessary; never backdate, reseed lookalikes or redeploy casually to make a table complete.

## 2. Pin the post-release target before reading data

Recheck B's actual main merge, workflow source, image tags/digests, migration outcome, serving revision, traffic, canonical HTTPS URL and observation time. Compare health version to the actual main source built by that run, which may differ from the release PR head.

Establish that the observed service/DB is the same intended environment as the baseline. An unchanged service name does not prove its DB reference was unchanged. Use approved filtered metadata or the verified resource handoff without retrieving secret payloads. If identity is unavailable, mark that dependency UNKNOWN and avoid an unsupported continuity claim.

Check for concurrent releases/traffic changes and stale browser caches. The source boundary must be clear before interpreting records as post-redeploy data. Do not mutate traffic, purge infrastructure or rerun a pipeline from this read-back prompt.

## 3. Prepare an immutable comparison sheet

Load the original A/09 ledger at its recorded evidence commit. Preserve it and add after-state observations in the existing agreed evidence record rather than overwriting before values. Record the evidence-document commit separately from the served application SHA.

Use one row per assertion, with actual values or safely referenced result files:

| Case | Entity/field and exact original ID | Baseline | After distinct restart | After later redeploy | Expected comparison | Actual result | Evidence/time |
|---|---|---|---|---|---|---|---|
| C05-01 | Original milestone identity/team/owner/due time | Existing ledger value | Existing restart observation | NOT RUN until read | Same identity and approved unchanged values | NOT RUN | Pending |
| C05-02 | Original submission identity/version/author/content/link | Existing ledger value | Existing restart observation | NOT RUN until read | Same immutable record and associations | NOT RUN | Pending |
| C05-03 | Original feedback identity/submission/author/content | Existing ledger value | Existing restart observation | NOT RUN until read | Same exact-version feedback association | NOT RUN | Pending |
| C05-04 | Still-valid retained session, if claimed | Private reference; no token | Actual prior observation | NOT RUN until read | Honor original eight-hour absolute TTL | NOT RUN | Pending |
| C05-05 | Team/role authorization | Expected current contract | Prior safe denial | NOT RUN until read | No unauthorized data or write | NOT RUN | Pending |

Add fields needed by the actual contract. Preserve exact IDs, versions and relationships; names and counts alone are insufficient. Normalize timestamps only for display/comparison of the same instant, documenting timezone/precision. Do not normalize away changed text, URLs, versions, authors or associations. Predeclared intentional accepted changes require their real source and expectation; do not invent one after observing a mismatch.

## 4. Verify identity and sessions without leaking secrets

Use the same approved synthetic role scopes, with separate Student/Supervisor and wrong-scope sessions. Keep credentials and session/token jars private and outside tracked evidence. Never use cleanup-capable isolated test fixtures against the live DB.

If A/09 retained a session for continuity and it is still within the original eight-hour absolute TTL, test that actual session through the implemented auth flow. Capture only actor/status/times, never the cookie or CSRF token. A newly logged-in session cannot prove an older session survived.

If it naturally expired or was deliberately revoked, report that exact condition and reauthenticate privately for domain-data read-back. Domain continuity can still be verified; the old-session survival assertion becomes NOT APPLICABLE/NOT ESTABLISHED with a reason, not a fabricated PASS or an automatic data-loss failure. Do not extend TTL or reset accounts to force success.

Keep temporary read-back sessions separate from any remaining baseline session. Logout temporary sessions when finished using the accepted source/CSRF flow; record a cleanup failure honestly. Do not accidentally revoke another active test session to satisfy a cleanup checklist.

## 5. Read the exact original domain records

1. As the appropriate scoped role, navigate to the **original milestone ID** through the public UI/API. Compare team, creator/supervisor scope, title, due timestamp/state and relevant saved times against the ledger. A similarly named milestone is not equivalent.
2. Open the **original submission ID** for that milestone. Compare exact version, author, saved URL/title/description/time and relationship. Do not select a newer/recreated submission merely because the UI defaults to latest.
3. Open the **original feedback ID**. Compare its exact submission/version link, author/content/time and Student visibility. Feedback attached to a replacement submission or different latest version does not establish continuity.
4. Reload/deep-link the same records in the public app. Where the UI omits IDs or fields, use the implemented authenticated read route or existing safe result evidence to bind identity. Mark unobserved fields honestly; do not infer hidden relationships from matching labels.
5. Record actual response/status/visible values for each assertion with source/revision/time. Read-only verification should not alter original content or create new business history. Avoid a broad DB dump when targeted app/API observations suffice.
6. If a request times out or fails ambiguously, retry a safe read only after identifying the current service state. Do not resubmit writes or recreate data to repair a missing screen.

## 6. Repeat a meaningful safe authorization check

Repeat the agreed A/09 wrong-team or wrong-role case against the synthetic fixture using a separate real unauthorized actor. Use a well-formed route/request that actually reaches the intended authorization boundary; an unrelated malformed-input 400 or expired login alone is not scope proof.

Record the current contract's expected denial, actual result, absence of private payload and absence of unintended mutation. Do not retain an exposed private response as a public artifact. A security regression is a finding even if all original records still exist.

Check essential public routing/readiness and the visible change as separate assertions. Health or a successful login cannot substitute for same-ID persistence and authorization.

## 7. Compare and interpret the result

Review the full before -> after restart -> after redeploy table. Derive each result from actual observations and preserve source attribution. C-05 requires original milestone/submission/feedback continuity across **both distinct operations**; a successful final read alone does not prove the restart stage.

Classify outcomes explicitly:

| Observation | Interpretation |
|---|---|
| All required original IDs/values/links survive both operations with clear provenance | C-05 may be PASSED for the defined scope, subject to actual peer acceptance |
| Old session expired naturally, domain records match after private re-login | Domain persistence may pass; report the separate session limitation honestly |
| Record/content/version/relationship missing or changed unexpectedly | FAILED; preserve evidence and owner investigation |
| Wrong service/source/DB, missing before-state or unsupported restart provenance | INCOMPLETE; do not convert uncertainty to PASS or proven data loss |
| Private scope now permits unauthorized data/write | Security regression requiring correction; not a successful overall verification |

Do not silently overwrite failed rows after a retry. Keep actual attempts and explain any legitimate correction/retest. A later successful experiment has its own baseline/time/source; it does not retroactively validate the failed one.

## 8. Independent witness and failure route

Prepare B's exact read-back instructions: public URL, roles, non-secret original IDs, comparison rows, current source identity and private access method. Do not send credentials or messages automatically. Credit B only for actual performed checks, with their real result/time/source. The AI's own analysis is not B's independent human witness.

For a failure, preserve original artifacts and affected state, identify the domain/runtime/release owner and prepare a focused finding with actual versus expected values. Corrections belong to the correct Issue/branch/peer workflow. Any new main candidate needs its exact user gate; DB/IAM/rollback actions need their actual applicable authorization. Do not reset, reseed, repair migrations, delete data or rerun deployment from this read-back phase.

## 9. Handoff and stop

Commit/push only intended sanitized evidence/guide changes on the actual scoped branch/PR, following the real joint lifecycle without stage replay. Leave #16 active for report/final acceptance; a docs PR merge or one passed row is not whole-task Done.

Return separate C-04, C-05 restart, C-05 redeploy, session-continuity and C-06 identity outcomes, with exact original IDs, observation/evidence commits, serving source/digests/revision/traffic, actual commands/cases and B's real witness status. Include unresolved failures/unknowns and the precise next owner action.

Provide B ready-to-use A-owned Parts 2-3 evidence and links, distinguishing historical local container checks from actual public observations. Stop here. [B/12](../B/12_R2-J01_EVIDENCE_AND_REPORT_SOURCE.md) is a separate report-source invocation; no PDF export, upload, partner communication, teardown or later feature work is authorized.
