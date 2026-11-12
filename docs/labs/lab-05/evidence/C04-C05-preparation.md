# C-04 / C-05 public-flow preparation and account gate

Task R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16), A/09. Owner A (`zerotwobook`); peer B (`Atip-Infa`). Originally prepared on 12 November 2026 when no synthetic accounts were available.

**Execution update:** the user subsequently authorized A09-SEED-01..04 and A09-CASE-01 at preparation head `e1fa3a1`. They completed successfully; see [actual C-04 execution and immutable ledger](C04-public-flow.md). The inventory/command proposal below retains the reviewed preparation context. Do not repeat its create/seed commands to resume. Restart and later redeploy remain NOT RUN / authorization PENDING.

## 1. Verified entry state

| Item | Observation in this preparation session |
|---|---|
| Accepted source | Main `16ec6d268ac087f3834be7da55dda29e589847ce`, released by [PR #93](https://github.com/zerotwobook/fastTrack/pull/93). |
| Project / region | `fasttrack-se-002` / number `970128017651` / `asia-southeast1`. Existing authenticated task profile used for read-only metadata only. |
| Canonical origin | <https://fasttrack-app-kpx7au3w2a-as.a.run.app>; use this exact APP_ORIGIN for browser/auth tests, not a different advertised alias. |
| Service / ready revision | `fasttrack-app` / `fasttrack-app-00002-f75`, single 100% traffic assignment. |
| Configured web index | `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-app@sha256:7eadbc226af98dd0231513ada70a33f1fb2c59a19ebcca301430221a836eb2e0`. |
| Jobs image | Fresh registry and existing migration-job readbacks agree on `asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-jobs@sha256:b5c911962827b063eac223dc1910aeaf0f4e121a34e925747d8f950a2440478a`. |
| Runtime identity | `sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com`; existing SQL attachment `fasttrack-se-002:asia-southeast1:fasttrack-db`. |
| Existing jobs / secrets | Successful lists returned only `fasttrack-migrate` and `fasttrack-database-url`. Proposed `fasttrack-seed-c04` and `fasttrack-demo-password` were absent from those lists. Recheck before creation. |
| Scaling | Service-level maximum 3, revision maximum 2, concurrency 8; no explicit manual-scaling annotation observed. Do not replace these with generic defaults. |
| Instance provenance | Read-only log projection returned an instance ID for the serving revision, including request timestamps `2026-11-12T03:38:57Z` and `03:38:59Z`. This establishes that the field is available, not a restart. |

The first-bootstrap source/image/platform-manifest lineage, migration execution and original runtime settings remain recorded in [the actual bootstrap checkpoint](https://github.com/zerotwobook/fastTrack/issues/16#issuecomment-6804877049). Image index and platform digests are different identities; no rebuild, migration or rollout was repeated here.

### Actual public checks

Executed the accepted-main `deploy/smoke_test.py` extracted from exact source into a temporary directory. Set EXPECTED_RELEASE_SHA to the full accepted main; removed both optional smoke credential variables from the child environment:

```text
PASS /api/health
PASS /api/ready
PASS /
PASS /api/nonexistent
SKIP login: optional smoke credentials not configured
```

Additional anonymous GETs with the canonical Origin/custom request header returned **401** for `/api/auth/me` and `/api/teams`. This preparation checkpoint involved no login or business mutation. Subsequent rendered UI, cookie, source/CSRF and wrong-team results are recorded in the execution report; these early anonymous checks are not substituted for them.

## 2. Retained synthetic-account proposal: authorized and executed

The existing accepted `Project_code/server/prisma/seed.ts` is add-only. With a private `DEMO_SEED_PASSWORD` it creates up to **five users** (two supervisors, three students), **two teams** and **three memberships**. Existing names/passwords/membership/history are preserved. The user's lack of available credentials is not authoritative proof that these emails do not exist in the DB. No DB user enumeration, password reset or secret payload read was performed.

| Actor | Seed identity / relationship | Planned use |
|---|---|---|
| Supervisor A | `supervisor.a@fasttrack.local`, assigned Team A | Create milestone, read submission, append feedback. |
| Student A1 | `student.a1@fasttrack.local`, Team A | Submit and read exact feedback; retain baseline session. |
| Student A2 | `student.a2@fasttrack.local`, Team A | Available fixture; no extra case required. |
| Supervisor B | `supervisor.b@fasttrack.local`, Team B | Genuine wrong-team read denial for Team A's saved submission. |
| Student B1 | `student.b1@fasttrack.local`, Team B | Optional alternate wrong-team fixture; no extra writes required. |

These actions were originally proposed with approval pending. The user then explicitly approved the concrete subset in response to the PR #96 request. The [execution record](C04-public-flow.md#2-actual-account-preparation) identifies actual resources, private generated credential input, verified job configuration and its single successful execution. The earlier bootstrap approval was not reused as seed permission.

| Action | Exact proposed change | Impact / verification / failure boundary |
|---|---|---|
| A09-SEED-01 | Create `fasttrack-demo-password` secret and one private version, only after fresh absent-state confirmation | Secret-version/storage cost; account holder enters value privately. Inspect version metadata only. If the resource now exists, stop and reconcile ownership/version; do not rotate it. |
| A09-SEED-02 | Grant existing runtime identity Secret Accessor **on this secret only** | Explicit IAM delta; no project-wide role. Web service receives no seed-password env/reference. This identity is shared with the one-off job, so its effective secret access expands even though the web specification is unchanged. Read back this exact binding. |
| A09-SEED-03 | Create one `fasttrack-seed-c04` job using the pinned accepted-main jobs digest, DB secret version 1 and new seed-secret version 1 | One task/parallelism one, max retries 0, 600-second timeout, 1 CPU / 512 MiB. Verify command/image/identity/attachments/references before execution. No service rollout or migration. |
| A09-SEED-04 | Execute that job once with `--wait` | Intended bounded DB additions listed above; job compute is billable and has a minimum billed duration. Record execution identity/status, then verify real logins. On failure inspect partial additions privately; do not blindly retry or reset existing passwords. |
| A09-CASE-01 | Execute C04-01..05 below on those synthetic fixtures | One milestone, first submission and feedback plus scoped reads/rejection. No unrelated cleanup, production mutation suite or restart. Preserve original IDs before B's later release. |

No automatic deletion/revocation is included. Unused job/secret/IAM cleanup can be a separately reviewed follow-up after verification; retaining them incurs their normal resource/secret costs. An existing account whose password differs must be handled explicitly, not overwritten to make a test pass.

### Retained commands for the reviewed subset

These approved commands were executed once and are retained for audit, **not as a resume recipe**. The selected secret/job now exist. Do not repeat them or run `deploy/deploy.sh --demo`, which would combine unrelated provisioning/migration/rollout with this account task.

```bash
gcloud secrets create fasttrack-demo-password --replication-policy=automatic --project=fasttrack-se-002
```

For this execution, a strong synthetic-only value was generated and passed through private stdin as version 1, with its local copy protected by Windows DPAPI. No payload was printed or read back from Secret Manager. Enabled version 1 metadata was verified before configuring the job. Credentials remain outside Git/chat/screenshots.

```bash
gcloud secrets versions list fasttrack-demo-password --project=fasttrack-se-002 --format='table(name,state,createTime)'
gcloud secrets add-iam-policy-binding fasttrack-demo-password --member=serviceAccount:sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com --role=roles/secretmanager.secretAccessor --project=fasttrack-se-002
gcloud secrets get-iam-policy fasttrack-demo-password --project=fasttrack-se-002 --format=json
gcloud run jobs create fasttrack-seed-c04 \
  --project=fasttrack-se-002 --region=asia-southeast1 \
  --image=asia-southeast1-docker.pkg.dev/fasttrack-se-002/fasttrack-docker/fasttrack-jobs@sha256:b5c911962827b063eac223dc1910aeaf0f4e121a34e925747d8f950a2440478a \
  --service-account=sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com \
  --set-cloudsql-instances=fasttrack-se-002:asia-southeast1:fasttrack-db \
  --set-secrets=DATABASE_URL=fasttrack-database-url:1,DEMO_SEED_PASSWORD=fasttrack-demo-password:1 \
  --command=npm --args=run,db:seed,--workspace,@fasttrack/server \
  --tasks=1 --parallelism=1 --max-retries=0 --task-timeout=600s --cpu=1 --memory=512Mi
gcloud run jobs describe fasttrack-seed-c04 --project=fasttrack-se-002 --region=asia-southeast1 --format='json(spec.template.metadata.annotations,spec.template.spec.template.spec.containers,spec.template.spec.template.spec.serviceAccountName,spec.template.spec.template.spec.maxRetries,spec.template.spec.template.spec.timeoutSeconds,spec.template.spec.taskCount,spec.template.spec.parallelism)'
```

Confirm the job has only the intended secret references; do not print any actual credential env value. Only after the specification readback matches:

```bash
gcloud run jobs execute fasttrack-seed-c04 --project=fasttrack-se-002 --region=asia-southeast1 --wait
```

Retain the private password in an approved local channel for test login. Do not set a public variable or place it in a PR. Login testing must not be performed by reading the secret payload back into chat or tool output.

## 3. Planned public cases and immutable baseline

Use separate role browser sessions. For API corroboration use real cookie/source/custom-header/CSRF contracts, not direct SQL insertion. Sources: [milestones](../../../../Project_code/docs/contracts/sprint-1-milestones.md), [submissions](../../../../Project_code/docs/contracts/sprint-1-submissions.md), [feedback](../../../../Project_code/docs/contracts/sprint-1-feedback.md), [authentication](../../../../Project_code/docs/contracts/sprint-1-auth.md).

Choose one run-specific English title and a due time seven days after actual execution in Asia/Bangkok. This relative plan must be replaced with the actual timestamp before creating the record. Proposed work URL `https://example.com/fasttrack-c04` is synthetic and is not fetched by the application server.

| Case | Steps / expected result | Required saved evidence | Actual |
|---|---|---|---|
| C04-01 | Assigned Supervisor A creates one Team A milestone through `/teams/:id/milestones/new`, reloads detail; API create 201, subsequent scoped read 200 | Actual team/milestone IDs, title, dueAt, creator and source/time | PASS; actual execution report/ledger. |
| C04-02 | Student A1 submits one title/description/URL through `/milestones/:id/submissions/new`; 201 version 1, reload `/submissions/:id` | Actual submission ID, milestone, author, version, accepted timestamp and values | PASS; actual execution report/ledger. |
| C04-03 | Supervisor A opens that exact submission and adds one feedback intent/UUID; first create 201, Student A1 reads it | Actual feedback ID and exact submission/version association; content/author/time | PASS; both role screenshots and saved identity. |
| C04-04 | Supervisor B requests `GET /api/submissions/:savedTeamASubmissionId` using its own real session | 404 `NOT_FOUND`, generic message, no Team A data; Team A's original records remain unchanged | PASS; genuine wrong-team actor, 404 and unchanged original records. |
| C04-05 | Student A1 and Supervisor A refresh/deep-link the saved journey; check HTTPS cookie attributes/source/CSRF through accepted flow | Real UI/API consistency and role-scoped values, attributes/status only; no tokens/headers | PASS; cookie flags, independent 403 source/CSRF probes and equal final records. |

Before any disruptive operation, use the now-frozen [actual original-record ledger](C04-public-flow.md#4-immutable-original-record-ledger) and its machine-readable baseline. Preserve the exact milestone/submission/feedback identities and values. Later restart/redeploy observations must be separate records, not replacements or reseeded lookalikes.

Keep one baseline session private and separate from short-lived smoke/logout sessions. Only claim survival while within its original eight-hour absolute TTL. Natural expiry is not data loss. On unknown create outcome, read back before retry; never duplicate/reseed to hide a missing record.

## 4. Distinct restart proposal: current bounded packet

The follow-up [C05 restart packet](C05-persistence.md) now specifies a five-minute maintenance window, restoration by T+120 seconds, recovery deadline T+300 seconds, fresh two-role equality results and the actual limits of natural-turnover telemetry. Its concrete outage-window decision and current B release hold remain PENDING; no scaling command has run. The original proposal below is retained as context, not a completed restart result.

After original records exist and B confirms a release hold, propose a short agreed downtime window on `fasttrack-app` only. Target revision/source/image must still match section 1. Current user confirmation and experiment authorization are **PENDING**; no restart/scaling mutation was performed here.

The [Cloud Run manual-scaling guide](https://docs.cloud.google.com/run/docs/configuring/services/manual-scaling) supports disabling service traffic with manual count zero; scaling is a service-level setting. The [CLI reference](https://docs.cloud.google.com/sdk/gcloud/reference/run/services/update) supports restoring `--scaling=auto`. These commands are future review material:

```bash
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=0
# Observe actual disabled/zero-instance state and provenance before restoration.
gcloud run services update fasttrack-app --project=fasttrack-se-002 --region=asia-southeast1 --scaling=auto
```

Approve the window and both disabling/restoration actions together. Record start/end and an agreed short recovery deadline; restore automatic scaling if observation fails rather than extending downtime. Verify preserved service/revision bounds (service max 3, revision max 2), concurrency, unchanged image/SHA/revision, health/readiness and 100% traffic afterward. No SQL/migration/seed/image/env change belongs to this experiment.

**Provenance is still required:** a disabled response alone does not prove the old process stopped. Correlate platform zero-instance/termination evidence with before/after `cloud_run_revision` instance IDs at the same revision. [Cloud Run logging](https://docs.cloud.google.com/run/docs/logging) identifies a service instance through `labels.instanceId`; service IDs must not be confused with standalone Cloud Run instance restart semantics. Project only timestamp/instanceId/revision fields; avoid request payloads, IPs and credentials. If old/new process provenance or zero-instance observation is unavailable, mark the restart proof INCOMPLETE and seek platform/TA clarification, not a fabricated PASS.

Read the exact original milestone/submission/feedback IDs after restoration and compare all saved relationships/values. The later visible-change redeploy remains a separate B/10 release with a new candidate/authorization; A/11 compares these same IDs afterward. An env/image revision change cannot count twice as both this restart and that redeploy.

## 5. Handoff and next actions

- C-02 is independently witnessed and closed unmerged; see [C02-gate-witness.md](C02-gate-witness.md). Whole #15 remains pending for live WIF/release evidence.
- Accounts, public/authenticated C-04 and the immutable ledger are now verified in the linked execution report. Restart, redeploy, eight-hour session survival and C-05 acceptance remain NOT RUN/PENDING.
- B approved the actual C04 artifact head `9077d22` and merged PR #96 into staging. Next decision: confirm the concrete window and current release hold in [C05-persistence.md](C05-persistence.md), then execute only the authorized restart. Existing seed/case authorization remains recorded and must not be requested again for completed actions. B's C04 review does not establish restart witness or whole-task acceptance.
- B reviews this staging evidence/sync PR; the later visible-change release still depends on baseline/restart acceptance. Authorized seed and individual-secret IAM changes are recorded in the execution report. No external message, protected merge, reset or service interruption was performed.
- Other project gates still need an actual independent UAT partner and a selected/TA-approved Lab 7 change. Those decisions are separate from Lab 5 and are not fabricated by this packet.
