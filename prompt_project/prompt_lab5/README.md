# fastTrack Lab 5 prompt pack

Copy-ready instructions for A (`zerotwobook`) and B (`Atip-Infa`). This pack implements the allocation in the [Lab 5 delivery plan](../../workflow/04_LAB5_DELIVERY_PLAN.md), within [Sprint 2](../../workflow/02_SPRINT2_LABS5-7.md). It does not add new execution Issues or authorize a cloud/main action merely by existing.

## How to use

1. Use your own clone/worktree. Open this repository in the AI's workspace. Ensure the plan and **this complete prompt pack** are present at the version both members intend to use. A pushed Draft branch is not automatically available on a teammate's main checkout; fetch/read the actual shared version without merging an unapproved branch into main.
2. Select a prompt for your owner and the next accepted dependency in the table. **Copy the entire Markdown file** into the AI chat. It contains the actual instructions; no second hidden copy block is required.
3. The AI must read `00_SHARED_EXECUTION_RULES.md` from disk as well as the task-specific sources. Copying a task file alone is sufficient only when the AI can access those repository files. If it cannot, supply the missing non-secret files or use a repository-enabled session; it must not guess their contents.
4. The AI inspects live state and discovers paths/PR numbers/cloud identifiers. There are no credential fields to paste into chat. Existing Issue numbers are deliberate task references, not invented future PR numbers.
5. Each invocation completes **one bounded phase**, including its authorized code/tests/docs/GitHub preparation. It stops only at a real missing dependency, shared decision, review or authorization boundary. Paste the same prompt again to resume after the human action; it must inspect current state and continue the existing branch/PR.
6. Do not paste the whole folder into one agent or run every file simultaneously. Numbers describe coordination order, not new tasks. Reading a review prompt does not turn an AI review into a human teammate approval.

The instructions reduce ambiguity; they cannot guarantee error-free execution by every model or compensate for missing access, changed requirements or unverified output. The checks and human gates remain necessary.

## Order and ownership

| Order | Run by | Prompt | Existing task | Required predecessor / permitted endpoint |
|---|---|---|---|---|
| 01 | A | [Baseline and delivery design](A/01_R2-J00_BASELINE_AND_CONTRACTS.md) | R2-J00 / #13 | Inspect accepted S1; prepare delivery decisions and staging bootstrap for B. |
| 02 | B | [Independent contract review](B/02_R2-J00_CONTRACT_REVIEW.md) | R2-J00 / #13 | A's concrete contract; identify findings and prepare the real joint checkpoint. |
| 03 | A | [Container and runtime implementation](A/03_R2-A01_CONTAINER_AND_RUNTIME.md) | R2-A01 / #14 | Accepted delivery checkpoint; code/tests/docs and staging PR handoff. |
| 04 | B | [CI and release implementation](B/04_R2-B01_CI_AND_RELEASE_PIPELINE.md) | R2-B01 / #15 | Accepted delivery checkpoint; may run alongside 03; Docker integration waits for A's real image. |
| 05 | B | [Review A's container/runtime](B/05_REVIEW_R2-A01.md) | Review #14 | Current A PR; independently reproduce C-03 and runtime checks. |
| 06 | A | [Review B's CI/release](A/06_REVIEW_R2-B01.md) | Review #15 | Current B PR and image dependency; independently verify code/CI failure handling. |
| 07 | A | [Cloud runtime preparation and first deploy](A/07_R2-J01_CLOUD_RUNTIME.md) | R2-J01 / #16 | Accepted container/CI; prepare changes, wait for applicable cloud authorization, then verify first deployment. |
| 08 | B | [WIF, real gate and release preparation](B/08_R2-B01_J01_WIF_GATE_AND_RELEASE_PREP.md) | #15 + #16, separately scoped | Real cloud/runtime contract and CI; prepare WIF/gate, controlled C-02 and a Draft release candidate. |
| 09 | A | [Public journey and pre-release restart](A/09_R2-J01_PRE_RELEASE_BUSINESS_AND_RESTART.md) | R2-J01 / #16 | First URL works; **create original records and prove distinct restart before 10's release**. |
| 10 | B | [Release and C-06 traceability](B/10_R2-J01_RELEASE_AND_TRACEABILITY.md) | R2-J01 / #16 | 09's original IDs/restart evidence and ready candidate; user/main/peer gates, then actual pipeline/revision. |
| 11 | A | [Post-release persistence](A/11_R2-J01_POST_RELEASE_PERSISTENCE.md) | R2-J01 / #16 | Actual deployment from 10; read **09's exact original IDs**, not newly seeded replacements. |
| 12 | B | [Evidence and report-source assembly](B/12_R2-J01_EVIDENCE_AND_REPORT_SOURCE.md) | R2-J01 / #16 | Actual C-01-C-06, with missing evidence left pending; Markdown source and independent readback. |
| 13 | A | [Final independent handoff audit](A/13_R2-J01_FINAL_CROSS_CHECK.md) | R2-J01 / #16 | B's concrete source/index/version; report actual readiness and user-controlled submission steps. |

03/04 may overlap on separate clones after interfaces are accepted. 05/06 are independent cross-checks, not replacement implementation tasks. 07/08 can prepare independent plans concurrently, but cloud actions wait for exact prerequisites/authorization. 08 may prepare the release Draft early; **10 must not release before 09 records the persistence baseline**. All phases under #16 resume the same real joint lifecycle; do not manufacture Backlog/Specified stages for every prompt.

**First-deploy bootstrap loop:** if the needed delivery code has not reached main, 07 prepares runtime/resources and pauses rollout. 08 prepares the initial delivery main candidate and follows the exact user/peer/protection gates; after the real main bootstrap, resume 07 to verify the first URL. Then run 09 before the **later visible-change release** in 10. These are two different release events when bootstrap is required; do not deploy staging or invent pre-release evidence to collapse them into one.

## What each prompt contains

Role and task; required reads; live-state/dependency discovery; allowed files and shared ownership; design decisions; implementation or independent verification steps; actual checks; GitHub handoff; specific stop/resume conditions and output format. [Shared execution rules](00_SHARED_EXECUTION_RULES.md) supply the full reusable Project/branch/PR/security protocol.

No file is an approval, merge instruction, credential, test result, deployment claim or submission receipt. All project artifacts are English; conversation may be Thai. The user handles final PDF assembly/export unless explicitly requesting it.
