# R2-J01 A/07 resource-only review package

Owner A (`zerotwobook`); reviewer B (`Atip-Infa`); Issue [#16](https://github.com/zerotwobook/fastTrack/issues/16), staging PR [#92](https://github.com/zerotwobook/fastTrack/pull/92). This supplements the [runtime plan](R2-J01_A_CLOUD_RUNTIME_PLAN.md) and [verification checkpoint](R2-J01_A_FIRST_DEPLOY_PREPARATION.md). **PROPOSED / NOT EXECUTED.** The user's request to continue deployment authorizes preparation; this concrete paid-resource/IAM/DB subset still requires applicable approval under shared rules section 8.

## Current evidence and selected scope

The account holder's successful inventory at `2026-11-11T08:17:16Z`, retained in Issue #13, found no SQL instance, selected regional registry, Cloud Run service/job or secret. Only the default Compute service account existed. The account holder enabled SQL Admin, Run, Artifact Registry and Secret Manager APIs and read them back. Preserve that completed work. Inventory is a dated observation; repeat read-only discovery immediately before any mutation.

| Action | Proposed target and exact delta | Impact and execution condition |
|---|---|---|
| A07-01 delta | Enable `iam.googleapis.com` only if a successful current enabled-API listing proves it absent. | Supports runtime service-account creation. Other WIF APIs/trust belong to B/08. Do not enable Cloud Build for this local-Docker path. |
| A07-02 | Create Docker repository `fasttrack-docker` in `asia-southeast1`. | Registry storage/egress costs; only after a successful current listing proves this exact repository absent. |
| A07-03 | Create `fasttrack-db`: PostgreSQL 16 Enterprise, `db-f1-micro`, zonal, 10 GB SSD, storage auto-increase off, daily backup 03:00 UTC, seven retained backups, deletion protection on. | Persistent paid database. With auto-increase off, storage exhaustion requires deliberate intervention. Backups are incremental; retained count is not a fixed storage-cost cap. No HA/PITR/VPC deployment is added by this subset. |
| A07-04 | Create `fasttrack_prod` in that instance. | Add database only if a successful listing proves absent. No reset, drop or schema change. |
| A07-05 | Create `sa-fasttrack-runtime`; bind `roles/cloudsql.client` at supported project scope. | Dedicated runtime identity; project-level Cloud SQL connection permission, not SQL Admin/Owner/Editor. Inspect existing IAM first. |
| A07-06 | Create `fasttrack_user`, secret `fasttrack-database-url` and its first version; grant runtime `roles/secretmanager.secretAccessor` on this secret only. | Private generated password; no reset of an existing user, no secret payload readback and no demo password/seed. Stop for a separately reviewed recovery if either user or secret already exists. |

The regional model recorded in Issue #13 uses Singapore rates checked on 11 November 2026: SQL approximately USD 14.23 per 730-hour month including assumed 10 GiB SSD and 10 GiB used backup storage; an illustrative combined SQL/Run/jobs/registry/secret scenario is USD 15.64 before allowances/credits and excluded usage/taxes. This is an estimate, not a spending cap or a full bill. The THB 250 alerts-only budget does not stop resources. Recheck credit eligibility, quotas and current prices immediately before paid-resource creation. Sources: [SQL](https://cloud.google.com/sql/pricing), [Run](https://cloud.google.com/run/pricing), [Artifact Registry](https://cloud.google.com/artifact-registry/pricing), [Secret Manager](https://cloud.google.com/secret-manager/pricing).

## Account-holder execution blocks after approval

Run selected blocks sequentially in the authenticated Cloud Shell, checking each result. These are reviewable commands, not permission to paste/run the entire document. No authenticated GCP tool or CLI is available to A's current session. Never paste credentials, tokens, connection strings or complete IAM/environment dumps into chat. Do not use `set -x`.

### 1. Read-only identity, APIs and inventory

```bash
set -euo pipefail
set +x
umask 077
PROJECT_ID=fasttrack-se-002
REGION=asia-southeast1
RUNTIME_SA=sa-fasttrack-runtime@fasttrack-se-002.iam.gserviceaccount.com
date -u '+%Y-%m-%dT%H:%M:%SZ'
gcloud projects describe "$PROJECT_ID" --format='json(projectId,projectNumber,lifecycleState)'
gcloud billing projects describe "$PROJECT_ID" --format='json(projectId,billingEnabled)'
gcloud services list --enabled --project="$PROJECT_ID" --format='value(config.name)'
gcloud artifacts repositories list --project="$PROJECT_ID" --location="$REGION" --format='json(name,format)'
gcloud sql instances list --project="$PROJECT_ID" --format='json(name,region,databaseVersion,settings.tier)'
gcloud iam service-accounts list --project="$PROJECT_ID" --format='json(email,disabled)'
gcloud secrets list --project="$PROJECT_ID" --format='json(name)'
```

Require project number `970128017651`, ACTIVE project and `billingEnabled: true`. Privately verify the active account, credits and quotas. Failed commands mean UNKNOWN and stop that action; they never prove absence. Review resources that appeared since the dated inventory rather than overwriting them.

### 2. APIs, repository and persistent instance

Select only absent resources established by the successful current inventory and approved action IDs. The API command is unnecessary if IAM is already enabled.

```bash
gcloud services enable iam.googleapis.com --project="$PROJECT_ID"
gcloud artifacts repositories create fasttrack-docker --project="$PROJECT_ID" \
  --location="$REGION" --repository-format=docker --description='fastTrack container repository'
gcloud artifacts repositories describe fasttrack-docker --project="$PROJECT_ID" \
  --location="$REGION" --format='json(name,format)'
gcloud sql instances create fasttrack-db --project="$PROJECT_ID" \
  --region="$REGION" --database-version=POSTGRES_16 --edition=enterprise \
  --tier=db-f1-micro --availability-type=zonal --storage-size=10GB --storage-type=SSD \
  --no-storage-auto-increase --backup-start-time=03:00 --retained-backups-count=7 \
  --deletion-protection
gcloud sql instances describe fasttrack-db --project="$PROJECT_ID" \
  --format='json(name,state,connectionName,region,databaseVersion,settings.edition,settings.tier,settings.availabilityType,settings.dataDiskSizeGb,settings.dataDiskType,settings.storageAutoResize,settings.backupConfiguration,settings.deletionProtectionEnabled,settings.ipConfiguration.authorizedNetworks)'
```

Require RUNNABLE, correct configuration and connection name `fasttrack-se-002:asia-southeast1:fasttrack-db`. No authorized client networks are added. The subsequent Cloud Run attachment uses the managed Cloud SQL connector and runtime identity; this package adds no public direct-database access rule. Confirm the actual network/backup metadata. On partial failure inspect operation/instance state before deciding whether a retry is appropriate; never delete automatically. Flags checked against the [official create reference](https://cloud.google.com/sdk/gcloud/reference/sql/instances/create) on 11 November 2026.

### 3. Database and runtime identity

```bash
gcloud sql databases list --instance=fasttrack-db --project="$PROJECT_ID" --format='value(name)'
gcloud sql databases create fasttrack_prod --instance=fasttrack-db --project="$PROJECT_ID"
gcloud sql databases describe fasttrack_prod --instance=fasttrack-db --project="$PROJECT_ID" --format='json(name)'
gcloud iam service-accounts create sa-fasttrack-runtime --project="$PROJECT_ID" \
  --display-name='fastTrack Cloud Run Runtime'
gcloud iam service-accounts describe "$RUNTIME_SA" --project="$PROJECT_ID" --format='json(email,disabled)'
gcloud projects get-iam-policy "$PROJECT_ID" --flatten='bindings[].members' \
  --filter="bindings.members:serviceAccount:${RUNTIME_SA}" --format='json(bindings.role,bindings.members,bindings.condition)'
gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="serviceAccount:${RUNTIME_SA}" \
  --role=roles/cloudsql.client --condition=None --quiet --format=none
gcloud projects get-iam-policy "$PROJECT_ID" --flatten='bindings[].members' \
  --filter="bindings.members:serviceAccount:${RUNTIME_SA}" --format='json(bindings.role,bindings.members,bindings.condition)'
```

The create commands apply only after successful absence checks. Preserve an existing database/service account and review its effective configuration rather than recreating it. Skip an already correct binding. Do not change B's human access or assign the default Compute account to the application.

### 4. Fresh application credential and individual secret

```bash
gcloud sql users list --instance=fasttrack-db --project="$PROJECT_ID" --format='value(name)'
gcloud secrets list --project="$PROJECT_ID" --format='value(name)'
```

Proceed only when both successful listings establish `fasttrack_user` and `fasttrack-database-url` absent. If either exists, stop this block and preserve its credentials; do not reset a password or add a replacement version. Only after this joint absence check and A07-06 approval:

```bash
DB_PASSWORD=$(openssl rand -hex 24)
gcloud sql users create fasttrack_user --instance=fasttrack-db --project="$PROJECT_ID" \
  --password="$DB_PASSWORD" --quiet
gcloud secrets create fasttrack-database-url --project="$PROJECT_ID" --replication-policy=automatic
printf '%s' "postgresql://fasttrack_user:${DB_PASSWORD}@127.0.0.1:5432/fasttrack_prod?host=/cloudsql/fasttrack-se-002:asia-southeast1:fasttrack-db" \
  | gcloud secrets versions add fasttrack-database-url --project="$PROJECT_ID" --data-file=-
unset DB_PASSWORD
gcloud secrets add-iam-policy-binding fasttrack-database-url --project="$PROJECT_ID" \
  --member="serviceAccount:${RUNTIME_SA}" --role=roles/secretmanager.secretAccessor --quiet --format=none
gcloud secrets versions list fasttrack-database-url --project="$PROJECT_ID" --format='table(name,state,createTime)'
gcloud secrets get-iam-policy fasttrack-database-url --project="$PROJECT_ID" --format='json(bindings.role,bindings.members,bindings.condition)'
```

This generates the password privately and passes the URL through stdin; shell history contains variable references. Never echo the variable or access the secret payload for evidence. If a command fails after creating the user, stop and retain the private shell session for deliberate recovery. Re-executing this block is unsafe. Record the enabled numeric secret version for later reviewed consumers; creation alone does not prove successful Cloud SQL connectivity. User creation syntax checked against the [official users reference](https://cloud.google.com/sdk/gcloud/reference/sql/users/create).

## Boundary before first web deployment

This subset creates no image, migration job, service, seed, WIF provider, deployment environment or main release. The local socket fixture validates the actual Prisma CLI and runtime URL consumers; it does not validate managed Cloud SQL connectivity or IAM.

B/08 must finish reviewed required CI checks, environment `demo` restricted to branch `main` with a real required reviewer/hold, scoped deployer/WIF and environment variables. Live GitHub readback during this preparation still showed zero environments and no required-status-check rule. B prepares the concrete Draft main PR after the staging verification fix is reviewed/merged; the user reviews its exact head/base under the [main gate](../MAIN_RELEASE_GATE.md). Do not substitute today's staging SHA for the eventual main merge SHA.

For the first accepted-main bootstrap, use the already proposed hold -> accepted-main manual bootstrap -> reject duplicate waiting automatic deployment sequence, after B accepts/configures the hold. The monolithic `deploy/deploy.sh` is not this resource-only subset: review current state before using it, preserve precreated resources/secret, and do not blindly rerun it on missing-secret/existing-user or partial migration state. Both actual image digests, the single awaited zero-retry migration, the first ready revision/100% traffic and public checks must be recorded before claiming deployment.

Runtime contract for B's bootstrap: port 8080 bound on all interfaces, `NODE_ENV=production`, exact accepted-main `RELEASE_SHA`, HTTPS `APP_ORIGIN`, `SESSION_TTL_HOURS=8`, `TRUST_PROXY_HOPS=1` for the intended single trusted proxy, min 0/max 2 instances, 512 MiB, pool max 2 per web process, connect/statement/query deadlines 1000/1000/1500 ms and readiness 3000 ms. Web database pools are bounded at four connections across two instances; migration/admin/overlapping revisions add connections and must be budgeted separately. Confirm actual proxy topology, Run concurrency and SQL connection capacity at execution; do not disable origin/CSRF guards. The predicted origin is `https://fasttrack-app-970128017651.asia-southeast1.run.app`; verify actual service metadata and HTTPS after creation. No public URL exists as a result of this preparation.
