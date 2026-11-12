# C06-VIS-01: clarify the sign-in introduction

Task: R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). A (`zerotwobook`) owns this small F-01 login-copy change; B (`Atip-Infa`) reviews it and remains release captain. Branch: `feat/s2-a-c06-login-copy`, based on staging merge `692d3704ab098235dfa84826f48d2005b13964b7` after B accepted PR #98's restart evidence.

**Visible-change implementation and local verification: PASS. C-06 release/live WIF: NOT RUN.** This staging increment does not authorize a main release or cloud mutation. The first real code/spec commit and early Draft [PR #99](https://github.com/zerotwobook/fastTrack/pull/99) were created during Started, after Issue #16's actual scope/Started checkpoint.

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
| VIS-01 | Anonymous `/login` displays the exact new sentence | PASS in the local built-client preview; actual public before-state still has the old sentence |
| VIS-02 | Existing form/labels/help/primary action remain available | PASS: email, password, visibility toggle, Sign in action and course-account help visible |
| VIS-03 | Intro wraps without horizontal overflow at desktop and narrow mobile widths | PASS at 1280x720 and 390x844; document widths equal viewport widths, form within bounds |
| VIS-04 | Existing session regression, client typecheck/build and current-head CI pass | Local PASS: 37 existing session tests and client TypeScript/production build. Final-head CI is recorded separately in PR #99. |

Actual local checks used Node 26.13.0/npm 11.20.0 from `Project_code/`:

```bash
npx --no-install vitest run client/src/features/auth/session.test.ts
npm run build --workspace @fasttrack/client
```

The first command passed one file / 37 tests. The second includes client `tsc --noEmit` and Vite production build. No new assertion merely mirroring the sentence was added. Current-head full CI is reported in the PR/Issue with its actual SHA and run; earlier unchanged-code evidence is not silently relabeled.

The local review URL is `http://127.0.0.1:4175/login` while this session's helper is running. It serves the actual built client from code commit `b772af40456a348c50b7e30364849c17f428caa3`, with only an anonymous `GET /api/auth/me` 401 fixture. It has no real application API, credential store or DB. Inspect the wording/form/layout there; do not use it to test login or submit real credentials. Reproduce the normal full local application using `Project_code/README.md` if an authenticated review is required. The expected initial anonymous 401 is not a new application defect.

The [actual measurement record](../../../../Project_code/docs/evidence/R2-J01-C06-login-copy.json) retains times, viewport/form bounds, visible controls, computed font/color and byte hashes of the three inspected screenshots:

1. [Public before, 1280x720](C06-login-public-before.png), canonical HTTPS `/login` at `2026-11-12T07:26:17.299Z`; health source `16ec6d268ac087f3834be7da55dda29e589847ce` and the old introduction.
2. [Local candidate desktop, 1280x720](C06-login-local-desktop.png), new introduction at `07:26:20.127Z`; existing 464px form bounds, Inter stack and muted `rgb(89,89,89)` unchanged.
3. [Local candidate mobile, 390x844](C06-login-local-mobile.png), new introduction at `07:26:22.821Z`; form within x=16..374, no horizontal overflow and all controls/help visible.

The sentence wraps to two lines within the existing layout. Screenshots show page viewports without address bars; exact origins/routes are in the captions and JSON. This is bounded copy/layout verification, not a new authenticated business-flow, keyboard/accessibility or full responsive suite. Original C04/C05 JSON and records were not rewritten.

## Read-only release preflight for B

The following actual settings were read during preparation; no configuration, IAM or workflow changes were made. They are metadata evidence, **not live WIF authentication or deployment PASS**:

| Item | Observed configuration / scope |
|---|---|
| Environment | `demo`, custom deployment branch policy only `main`; required reviewer `Atip-Infa`, `prevent_self_review=true` |
| Environment variables | Project `fasttrack-se-002`, region `asia-southeast1`, provider `projects/970128017651/locations/global/workloadIdentityPools/github-pool/providers/github-provider`, deployer `sa-fasttrack-deployer@fasttrack-se-002.iam.gserviceaccount.com` |
| Optional smoke configuration | Neither repository nor environment metadata contains `SMOKE_PASSWORD` or `SMOKE_EMAIL`; names only were checked, no secret value was read. Optional authenticated workflow smoke will remain SKIP unless separately configured. |
| Repository OIDC | Default immutable subject enabled; prefix `repo:zerotwobook@135503171/fastTrack@1446690639` |
| Provider | ACTIVE; GitHub OIDC issuer; condition binds repository/owner numeric IDs, exact repository, `refs/heads/main`, exact `deploy.yml@refs/heads/main`, immutable `:environment:demo` subject and only push/manual events |
| Deployer bindings inspected | Workload Identity User for this repository-ID principal set; Run Developer at project; Artifact Registry Writer on `fasttrack-docker`; Service Account User on the individual runtime SA |
| Migration job metadata | `fasttrack-migrate`: one task, parallelism 1, max retries 0, existing runtime SA |
| Actual workflow | Main push automatically runs CI then waits at `demo`; normal path builds/pushes web/jobs images, runs the existing migration job once, updates image/RELEASE_SHA/traffic and smoke-checks |

**Actor coordination matters:** B cannot approve a deployment run that B initiated while this environment prevents self-review. This follows [GitHub's deployment review rule](https://docs.github.com/en/actions/how-tos/managing-workflow-runs-and-deployments/managing-deployments/reviewing-deployments). For the intended single main-push run, coordinate an explicitly authorized non-B merge/trigger actor so B can provide the independent environment approval. This is a proposed execution sequence, not permission for A to merge. Preserve all review/protection settings and inspect existing runs before any separately authorized recovery; do not bypass the gate or dispatch a duplicate deployment. The old cancelled bootstrap run had A as actor and is not live WIF proof.

The future release necessarily includes image uploads, one migration-job update/execution and service/traffic changes; the copy-only diff introduces no migration or data write. B must present that exact pipeline action scope with the main candidate for user authorization. Existing metadata alignment does not certify every effective permission or future run success.

## Release dependency and handoff

B accepted the exact restart head `b1a83577d04459ae3657da4e16e9b23248e79f9a` and merged PR #98 into staging. The [restart report](C05-persistence.md) and immutable [original-record ledger](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json) remain the persistence prerequisites. This copy task must not restart, reseed or recreate those records.

After real current-head B review and staging integration, B/10 must inspect the full staging-to-main diff, prepare the concrete Draft main candidate and present its exact head/base/checks/cloud scope to the user. The [main-release gate](../../../../workflow/MAIN_RELEASE_GATE.md) still applies; this task's continuation instruction is not release authorization. A cross-checks the actual release chain and A/11 reads the same original IDs after redeploy. C-06, the redeploy half of C-05 and whole #15/#16 acceptance remain pending.
