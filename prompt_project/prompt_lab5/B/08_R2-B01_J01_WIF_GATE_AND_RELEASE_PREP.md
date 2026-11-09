# B / 08: live WIF, required-check proof and release preparation

I am B (`Atip-Infa`). Continue **R2-B01 / #15** for real CI/gate setup and **R2-J01 / #16** for joint cloud/release preparation. Keep their scopes/evidence/status separate; do not close both because one phase passes. A (`zerotwobook`) independently checks.

## Read and entry

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely, Lab 5 plan sections 7-10/12/13, the current #13/#14/#15/#16 contracts/results and actual root workflows/scripts/env definitions. Read relevant Student Guide WIF/environment/ruleset/release sections. Inspect real accounts, current Project/card states, PRs/main/staging, emitted CI contexts, existing WIF/resources and action-specific authorizations.

Use B's isolated clone/actual task branch; resume code fixes on #15's existing branch/PR. New jointly scoped evidence/scripts need the agreed branch/owner, not a permanent personal branch. Do not reset started phases or fabricate their earlier transitions. Verify A's runtime/image/secret/connection/origin contract before live configuration.

## A. Real GitHub and WIF setup

1. Inspect current rulesets, branch selectors, environments and actual workflow runs before changing settings. Preserve peer approval, resolved discussions, stale-approval dismissal, up-to-date policy, force-push/deletion blocks and no bypass. Never select a nonexistent check or remove a required check to make an incomplete workflow pass.
2. Once real CI runs exist, identify the actual aggregate context and require it for main and actual sprint staging patterns. Verify the setting/read-back and representative passing run. Check skipped/path-filter behavior and API access; record exact missing permissions instead of pretending configuration succeeded.
3. Prepare main-only deployment environment variables and secret references from actual team values. Distinguish project ID from number, non-secret WIF identifiers from passwords, runtime from deployer account and optional smoke credentials from mandatory settings. Do not read/print secrets for evidence.
4. Prepare exact WIF/IAM changes for human inspection: real repo/owner IDs, subject/ref/workflow/environment restrictions, deployer trust, scoped registry/service/job rights and runtime impersonation. Coordinate A's runtime DB/Secret Manager roles. Do not copy TA IDs, mint a JSON key or grant Owner/Editor as a shortcut.
5. Apply only already-authorized exact IAM/DB/cloud actions, or present the complete concrete plan and wait. Read back resulting bindings/environment/configuration without exposing tokens. An attempted tool call is not proof access was configured.
6. Verify release scripts match current accepted image/job commands, health/readiness JSON and cookie/source/CSRF smoke. Run meaningful offline failure/rollback tests for changes; retain current source and actual run identities.

## B. Initial main bootstrap when A/07 cannot deploy yet

If delivery/runtime/workflow changes are only on staging, the first service cannot deploy that unmerged staging source. Inspect the full accepted staging-to-main diff, keep unfinished S2 features out, and prepare/reuse an **initial delivery Draft release PR** under #16. Do not repurpose an unrelated planning PR as an application release.

Present exact head/base, scoped behavior/diff, current build/DB/image/CI results, known limits, cloud action authorizations and practical review route. Keep Draft/no auto-merge/no final peer/merge request until the user explicitly authorizes this current main candidate. Renew if head/base changes; retain valid unchanged authorization without repeatedly asking.

After actual authorization, obtain the real non-author peer approval and required checks. Leave merge to the authorized maintainer unless an explicit applicable instruction and policy permit the action; never self-approve/merge. Verify actual main merge, then run/observe the accepted main pipeline or documented authorized bootstrap. Coordinate A/07 to verify URL, readiness, runtime and identity. This initial release is distinct from the later visible-change experiment and does not create pre-release persistence evidence retroactively.

## C. C-02 controlled failed-check proof

1. Verify a stable working main release and actual required check first. Prepare the isolated proof scope and exact current main base with A: one failing assertion in a test the real required CI executes, no deploy/config/data changes.
2. Use a fresh temporary current-main branch, early Draft PR and honest Started metadata/evidence linkage. Request the specific user authorization required to lift Draft for this exact **never-merge** experiment; no general release authorization or silence substitutes.
3. After that specific authorization, use a normal non-Draft PR, observe the real named failing test/required context and merge-blocked state. Explain how required-check failure is itself blocking; Draft status or a missing approval alone is insufficient.
4. Capture PR/run/check/ruleset/head/base and readable sanitized blocked-merge evidence. A witnesses; never request a false approval or enable auto-merge. Close without merging and preserve branch/commits/PR/run history.
5. Record proof complete in #15 only when actual evidence establishes it; the intentionally broken closed-unmerged PR is not accepted implementation or a Done release. Do not delete history or cycle finished cards to manufacture a result.

If a necessary permission/authorization is missing, finish independent WIF/release documentation and return the exact next decision. Do not weaken protection or skip the proof silently.

## D. Prepare the later visible-change candidate

Choose a small accepted-S1 visible change with A, issue/owner/UI-brief compliance and a normal task PR/review into staging. Do not implement an unapproved business-rule change or unfinished S2 feature. Coordinate owned files; early Draft and actual tests are still required. Prepare/reuse the later main release Draft, with exact head/base and clean full diff.

**Do not release that later candidate yet.** A/09 must first record original public domain IDs and distinct restart proof. A may proceed with 09 while the later candidate stays Draft. B/10 then verifies those prerequisites and performs the separate user-authorized main release/C-06 phase.

Return separate #15/#16 progress, actual settings/WIF/proof evidence, initial bootstrap outcome if any, URL/current main identity, pending candidate and exact authorizations still required. Do not claim whole Lab 5 acceptance from these preparations.
