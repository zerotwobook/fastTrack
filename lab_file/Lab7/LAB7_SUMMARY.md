# Lab 7 - Software maintenance, metrics, and release readiness

Source: [CPE334 Lab 7 handout](Lab_7_Sprint_1_Maintenance.pdf), pp. 1-7. Semester 1/2026. **Due 29 November 2026 at 23:59 Thailand time.** Submit one self-contained team PDF through LEB2. The lab is worth **100 points and 5% of the course grade**. Use the same team, application, repository, and GCP delivery pipeline. [Project Deliverable 2](../../deliverable%20_file/PROJECT_DELIVERABLE_2_SUMMARY.md) has its own submission.

## Scope

Choose **one bounded change to a rule or behavior already implemented and accepted in Sprint 1**. Describe the previous correct behavior and the new requirement. Obtain instructor or TA approval for that specific change before implementation. A repair that restores the existing rule belongs to Lab 6 corrective maintenance. Completing an unchanged Sprint 2 or Sprint 3 backlog feature does not qualify for Lab 7.

Use the Sprint 1 release accepted in Lab 6 as the behavior reference. Identify the actual pre-change commit and deployed version, and explain intervening work. The approved change may ship with later-sprint work using the normal project workflow and pipeline. A separate Sprint 1-only release is optional.

## Rubric and evidence

| Part | Points | What to record |
| --- | ---: | --- |
| A. Impact and updated contract | 25 | Change request with old/new rule, reason, scope, boundaries, invalid cases, roles and acceptance criteria (AC). Capture approval, approver and date. Trace requirement ID → feature → SRS/Feature SDS/System-Level SDS → AC → STS IDs → code modules. Consider callers, UI/API validation, ownership, persistence, historical data and migrations. Explain items that do not apply. Version the revised contract and Software Test Specification (STS), and preserve teammate review before coding. |
| B. Implementation and regression-safe delivery | 50 | Run an automated boundary test for the approved rule on the actual pre-change code. Preserve RED caused by the missing behavior, including the command, tested commit and output. Implement the change and show the same test GREEN, with relevant assertions and the code diff. Rerun selected existing domain, persistence and authorization regressions. Capture pass/fail/skip counts, substantive teammate review, CI, staging integration, reviewed `main` release, GCP revision and post-deploy checks of the changed behavior and a preserved Sprint 1 domain/access path. |
| C. Objective metrics | 15 | Provide five dated measures with definition, scope, window or snapshot time, value and evidence ID. Embed compact sources that let the grader reconcile at least two values. Show numerator/denominator for percentages. Write at most 100 words connecting the evidence to one action with an owner or milestone. |
| D. Readiness and retrospective | 10 | State READY or NOT READY for the maintained Sprint 1 scope. Include version, defects by severity/status, test outcomes and skips, debt, configuration/secrets, setup docs and deployment/smoke results. Give reasons, owners and actions for open items. Record debt with impact, priority and action. Answer what helped, what hurt and what will change in 1-2 sentences each. |

Suggested metrics are completed Issues, merged PRs, test results for one named suite and commit, UAT defect status, and CI success/failure/cancellation. For each, preserve the actual supporting IDs, dates, commands and outcomes within the chosen scope. An evidence-supported zero is valid. Keep defect and technical-debt records distinct.

## Submission checklist

- At the start, identify both students and IDs, theme, repo URL, accepted Sprint 1 tag/commit, actual pre-change commit, submitted `main` tag/commit, deployed URL and deployed version. Include a contents table for Parts A-D with page ranges and evidence IDs.
- Embed the relevant old/new contract excerpts, STS and review, RED/GREEN and regression output, selected diffs, metrics sources, and readiness record directly in the report. Caption evidence with ID, action, expected and actual result, time, and tested commit or revision. Include a compact version table and explain merge/deploy SHA differences and unrelated changes.
- Preserve test setup, IDs, assertions, commands, counts and version. Label manual results. Include contributions, AI use and known limitations. Use synthetic data, share safe credentials privately, and keep the assessed deployment and repository available through grading. The same PDF contains any appendices. No separate video is required.

## fastTrack next steps

Planning snapshot checked on 19 November 2026. [Issue #24](https://github.com/zerotwobook/fastTrack/issues/24) and [Issue #25](https://github.com/zerotwobook/fastTrack/issues/25) are in Backlog. Neither records a selected approved change. [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16), a dependency of #24, is open in PR Review with Acceptance PENDING. Confirm the relevant reviewed cloud/delivery scope in the task record before starting dependent work. The accepted Sprint 1 deployment documented in Lab 6 used source `8e637e5`. Historical tag `v1.0.0-sprint-1` points to `ae7a60a`. See the [Lab 6 closeout](../../docs/labs/lab-06/sessions/2026-11-19-lab6-closeout.md).

1. **Start the approval request early.** A prepares #24 with one precise proposed change, why it matters, exact boundaries and roles, AC, and Sprint 1 evidence. Reconcile the delivery dependency with B and capture the TA decision for this proposal. The Lab 6 Section 3.5 exercise has a separate approval and acceptance record.
2. **Freeze the engineering contract.** A maps the impact, versions the revised sections/AC/STS and records B's review. Then A captures the real RED on the agreed pre-change commit. Agree on shared modules and ownership before changing them.
3. **Implement, verify and release.** B reviews RED and delivers GREEN through #25 on the agreed maintenance branch/PR by default. A reviews the implementation. Both record regression, CI and deployed outcomes. Use the [Sprint 2 workflow](../../workflow/02_SPRINT2_LABS5-7.md) and the [main release gate](../../workflow/MAIN_RELEASE_GATE.md) for the concrete release candidate.
4. **Collect evidence while the work happens.** Prepare metric definitions and evidence IDs while approval is pending. Populate them from actual results, then write the interpretation, readiness and retrospective. Assemble the Lab 7 material as its own assessed submission even if the same release also supports D2.
