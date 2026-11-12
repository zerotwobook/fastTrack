# fastTrack Lab 5 report source

Markdown source for the Lab 5 team report. The user assembles, exports and uploads the final document; no PDF is produced here. Every claim points to an artifact in [evidence-index.md](evidence-index.md) and keeps its own source, time and limit. Where a fact is not established, the text says NOT RUN, NOT ESTABLISHED or PENDING.

## Answer Part 0: Team and Evidence Index

| Field | Value |
|---|---|
| Group number / section / group name | PENDING. Not provided yet; the team supplies it. |
| Topic | fastTrack, a milestone, submission and feedback tracker for supervisors and students. |
| Member A | Supapanya Yathip, student ID 67070503443, GitHub [`zerotwobook`](https://github.com/zerotwobook) |
| Member B | Atip Infa-udom, student ID 67070503446, GitHub [`Atip-Infa`](https://github.com/Atip-Infa) |
| Theme | Theme 6, eligible through B's final ID digit 6 under the group specification, as recorded in [Issue #2](https://github.com/zerotwobook/fastTrack/issues/2). |
| Public repository | https://github.com/zerotwobook/fastTrack |
| Submitted tag / commit | PENDING. No tag created. The report-source commit is documentation only. |
| Serving URL | https://fasttrack-app-kpx7au3w2a-as.a.run.app |
| Serving source | `8e637e537cd037d630a5fffc1b5672d1b44371a8`, revision `fasttrack-app-00003-rc7`, 100% traffic, read from `/api/health` and `/api/ready` on 12 November 2026 about 09:14Z. |

**Contributions.** A built the container/runtime, cloud resources and first bootstrap, and ran the public business flow, the restart experiment and the post-release readback. B built the CI and release pipeline, the required-check proof, the live WIF gate and the release. Each member reviewed the other's work through pull requests. Links, without commit-count quotas, are in [evidence-index.md section 3](evidence-index.md#3-contribution-links-no-commit-count-quota). Ability-to-explain evidence is the team's own and is PENDING.

**Evidence index.** One ledger per check and requirement, with sources, actors and limits: [evidence-index.md](evidence-index.md). Summary:

| Check | Result | Main limit |
|---|---|---|
| C-01 | PASSED | Counts read from the CI log. |
| C-02 | PASSED | Assisted witness; the proof PR is never merged. |
| C-03 | PASSED locally | Local Docker, not cloud. |
| C-04 | PASSED (assisted) | B's independent readback PENDING. |
| C-05 | Domain persistence PASSED | Session survival NOT ESTABLISHED; eight-hour test NOT RUN. |
| C-06 | PASSED | Delivered by a manually dispatched run; no live rollback. |

## Answer Part 1: CI and Quality Gate

**Workflow.** [ci-docker.yml](../../../.github/workflows/ci-docker.yml) runs on pull requests and on pushes to `main` and `staging/sprint-*`, and can be called by the deploy workflow. Its single job is `test-and-docker`. It checks the deploy scripts without cloud access, installs with the lockfile, generates the Prisma client, type-checks, runs unit tests, builds the client and server, runs the isolated PostgreSQL regression, uploads a sanitized report and builds the `runner` and `jobs` Docker targets ([deployment.md section 7](deployment.md)).

**C-01: a normal PR passes.** [PR #100 run 43179053148](https://github.com/zerotwobook/fastTrack/actions/runs/43179053148) passed `test-and-docker` on `80ad1df62700c9aba5d1ac84441143b85e19c629`: 10 Python deploy tests, 166 unit tests, and 374 isolated real-database cases across eight suites, with no failures. The first CI-introducing PR is [#85](https://github.com/zerotwobook/fastTrack/pull/85), run [42847201049](https://github.com/zerotwobook/fastTrack/actions/runs/42847201049).

**Required rules.** Ruleset [26666182](https://github.com/zerotwobook/fastTrack/rules/26666182) is active on `main`. It requires one approving review and the strict up-to-date `test-and-docker` check from the GitHub Actions app, and the bypass list is empty.

**C-02: a failing required test blocks the merge.** [PR #95](https://github.com/zerotwobook/fastTrack/pull/95) changed one assertion in `deploy/tests/test_smoke.py` and nothing else. Its run [43144813896](https://github.com/zerotwobook/fastTrack/actions/runs/43144813896) failed the required check (`AssertionError: 4 != 5`). While the PR was non-Draft and conflict-free, GitHub reported `mergeStateStatus: BLOCKED`. It was closed unmerged. A's [review](https://github.com/zerotwobook/fastTrack/pull/95#pullrequestreview-5868601890) is an assisted witness, not separate manual testing. Details: [C02-gate-witness.md](evidence/C02-gate-witness.md).

## Answer Part 2: Docker and Reproducible Configuration

**Image design.** [Dockerfile](../../../Project_code/Dockerfile) pins `node:26.13.0-bookworm-slim` by digest. Stages are `base`, `deps`, `builder`, then two final targets. `runner` is a pruned image that runs as the non-root `node` user and starts only `node server/dist/index.js`. `jobs` keeps the Prisma CLI and runs `npm run db:migrate` by default. Both receive the full source SHA through `RELEASE_SHA`. The web image never migrates, seeds or cleans on start. [.dockerignore](../../../Project_code/.dockerignore) excludes `.git`, dependencies, build output, every `.env*` except `.env.example`, tests and docs.

**Configuration.** The environment table (name, purpose, secret status, source) is in [deployment.md section 2](deployment.md). Real values stay in private env files or Secret Manager references. [server/.env.example](../../../Project_code/server/.env.example) and [compose.env.example](../../../Project_code/compose.env.example) hold placeholders only.

**C-03: clean build and run with a real database.** A's verifier cloned the committed source `11e6c73…`, built both targets, ran migrate, repeat migrate, seed and a production-header API flow against an isolated PostgreSQL, restarted the app container and read back the same original records: `passed: true` in [R2-A01-container-results.json](../../../Project_code/docs/evidence/R2-A01-container-results.json). The guarded regression passed 374 cases ([R2-A01-regression.json](../../../Project_code/docs/evidence/R2-A01-regression.json)). B reports reproducing both commands on PR #84 head `0301f6f` (374 cases, 13 container checks) in the [review](https://github.com/zerotwobook/fastTrack/pull/84). Limit: local Docker only, no cloud or TLS claim, and B's run exists only as review text.

## Answer Part 3: GCP Deployment and Persistence

**Service and database.** Project `fasttrack-se-002`, region `asia-southeast1`, Cloud Run service `fasttrack-app`, Cloud SQL instance `fasttrack-db` attached to the service, `DATABASE_URL` supplied from one Secret Manager reference. Runtime identity `sa-fasttrack-runtime`. Limits: min 0, max 3 instances, concurrency 8 ([C05-redeploy.md](evidence/C05-redeploy.md)).

**C-04: public role flow.** On the public URL, Supervisor A created a milestone, Student A1 submitted version 1, and Supervisor A saved feedback on that exact submission; Student A1 then saw it ([C04-public-flow.md](evidence/C04-public-flow.md), [screenshots](evidence/C04-student-feedback.png)). Supervisor B, who belongs to a different team, got 404 `NOT_FOUND` for Team A's submission ([screenshot](evidence/C04-foreign-denial.png)). A foreign-origin request and a request without a CSRF token were each rejected with 403 and no data change. This was assisted verification with isolated real browsers.

**C-05: the same records survive.** The three original records were frozen at baseline: milestone `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d`, submission `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` (version 1), feedback `b9ebf7f7-a542-4b89-95a8-8f1de22a5357`.

| Stage | Source / revision | Result |
|---|---|---|
| Baseline, 04:08Z | `16ec6d2` / `fasttrack-app-00002-f75` | Canonical SHA-256 `c5396255…0f4e` |
| After distinct restart, 06:13-06:15Z | Same revision; scale to zero, platform sample active=0 and idle=0 at 06:14:00Z, then a new instance | Same records, same hash ([C05-persistence.md](evidence/C05-persistence.md)) |
| After later redeploy, 09:12Z | `8e637e5` / `fasttrack-app-00003-rc7` | Same records, same hash, both roles; wrong-team read still 404 ([C05-redeploy.md](evidence/C05-redeploy.md)) |

**Limits.** The original browser sessions were closed before the restart and were already unavailable after the redeploy, so session survival is NOT ESTABLISHED and the eight-hour test is NOT RUN. B's own readback of the exact records with the private test accounts is PENDING.

## Answer Part 4: Repeatable Release Pipeline

**Labelled chain (C-06).** Issue [#16](https://github.com/zerotwobook/fastTrack/issues/16) -> task [PR #99](https://github.com/zerotwobook/fastTrack/pull/99) with B's [approval](https://github.com/zerotwobook/fastTrack/pull/99#pullrequestreview-5913218944) -> `staging/sprint-2` as `80ad1df` -> user-authorized [release PR #100](https://github.com/zerotwobook/fastTrack/pull/100) with B's [approval](https://github.com/zerotwobook/fastTrack/pull/100#pullrequestreview-5916420833) -> `main` as `8e637e5` -> [run 43186570077](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077) -> web and jobs image digests -> migration `fasttrack-migrate-dnvqn` -> revision `fasttrack-app-00003-rc7` at 100% traffic. The full table with every link is [C06-release-traceability.md](evidence/C06-release-traceability.md).

**Result.** `/api/health` and `/api/ready` report `8e637e537cd037d630a5fffc1b5672d1b44371a8`, and the served bundle shows the new sign-in sentence. The pipeline's own smoke step passed the four public checks; its login check was a SKIP because no smoke credentials are configured.

**Honest note on the run.** The automatic push run [43185679995](https://github.com/zerotwobook/fastTrack/actions/runs/43185679995) was initiated by B, who merged the PR, and the `demo` environment blocks self-approval, so it was cancelled with zero deploy steps. With the user's authorization, A dispatched one replacement run and B approved `demo`. This is delivery through `workflow_dispatch`, not an automatic-push success.

**Repeat and recover.** [deploy.yml](../../../.github/workflows/deploy.yml) runs CI first, authenticates with keyless WIF (no JSON key), builds web and jobs images tagged with the full SHA, resolves digests, runs migration with no retry before rollout, updates the service, and smoke-tests the result. Main-only guards exist in the trigger and in `deploy/release.sh`. A rollback is a manual dispatch with the full tag of an existing compatible image; it skips migration and seed and does not reverse schema or data. Rollback is covered by offline tests; no live rollback was executed.

## Validation

Checks run on this source on 12 November 2026 (about 09:35Z) before the first commit.

| Check | Actual result |
|---|---|
| Relative links and image paths in `report.md`, `evidence-index.md` and `evidence/C06-release-traceability.md` | 50 checked, 0 missing. |
| Markdown fences and tabs in those three files | 0 code fences and 0 tab characters; tables were written as plain pipe tables. A rendered preview was not opened. |
| External links (GitHub PRs, issues, runs, jobs, ruleset) fetched without signing in, using `curl.exe` | 27 distinct URLs, all HTTP 200. A Python `urllib` attempt failed with a local certificate-verification error and was not used; certificate checking was not disabled. |
| `git diff --check` | Run before commit; the result is in the PR description. |
| Application test suites | Not rerun. This change edits documentation only. |

No PDF was generated, rebuilt or exported. No secret value, cookie or token appears in these files.
