# C06-VIS-01: clarify the sign-in introduction

Task: R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). A (`zerotwobook`) owns this small F-01 login-copy change; B (`Atip-Infa`) reviews it and remains release captain. Branch: `feat/s2-a-c06-login-copy`, based on staging merge `692d3704ab098235dfa84826f48d2005b13964b7` after B accepted PR #98's restart evidence.

**Implementation checkpoint: one copy change; local visual/check results pending. C-06 release: NOT RUN.** This staging increment does not authorize a main release or cloud mutation.

## Before and after

At `/login`, replace the general introduction with the actual accepted-S1 concepts users will find after sign-in:

| Before | After |
|---|---|
| Keep track of your team's work and feedback. | Track your team's milestones, submissions, and feedback. |

The new wording helps a Student or Supervisor understand the workspace before signing in. It can be verified publicly without modifying any original milestone, submission or feedback. Application scope is the introduction paragraph in [App.tsx](../../../../Project_code/client/src/App.tsx); no auth behavior, routes, form controls, validation, schema or migration changes are part of this task.

## Design and acceptance

Follow [project detail section 8](../../../../Project_doc/project_detail.md#8-uiux--fasttrack-ในธีมขาวดำ) and [the UI guide](../../../../skill/SKILL_UI.md). Retain the existing single-column form, wordmark, labels, help text, Inter/Noto Sans Thai stack and the six shared paper/ink/wash/divider/muted/control tokens. The change introduces no new style, component, image or motion. This matches the established login brief rather than introducing a new visual design.

| Case | Expected result | Actual |
|---|---|---|
| VIS-01 | Anonymous `/login` displays the exact new sentence | NOT RUN |
| VIS-02 | Existing form/labels/help/primary action remain available | NOT RUN |
| VIS-03 | Intro wraps without horizontal overflow at desktop and narrow mobile widths | NOT RUN |
| VIS-04 | Existing session regression, client typecheck/build and current-head CI pass | NOT RUN |

Use a local anonymous-session fixture if only rendered-copy review is needed; label that preview honestly and do not call it an authenticated business-flow test. Record real screenshot/check results after execution. No extra assertion mirroring this one sentence is required.

## Release dependency and handoff

B accepted the exact restart head `b1a83577d04459ae3657da4e16e9b23248e79f9a` and merged PR #98 into staging. The [restart report](C05-persistence.md) and immutable [original-record ledger](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json) remain the persistence prerequisites. This copy task must not restart, reseed or recreate those records.

After real current-head B review and staging integration, B/10 must inspect the full staging-to-main diff, prepare the concrete Draft main candidate and present its exact head/base/checks/cloud scope to the user. The [main-release gate](../../../../workflow/MAIN_RELEASE_GATE.md) still applies; this task's continuation instruction is not release authorization. A cross-checks the actual release chain and A/11 reads the same original IDs after redeploy. C-06, the redeploy half of C-05 and whole #15/#16 acceptance remain pending.
