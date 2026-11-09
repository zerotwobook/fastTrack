# A / 03: implement R2-A01 container, runtime and cloud readiness

I am A (`zerotwobook`), implementing **R2-A01 / Issue #14**. B (`Atip-Infa`) independently reviews. Complete this task's authorized design/code/tests/docs and staging PR handoff; do not deploy or perform B's CI task.

## Read and establish entry

Read `prompt_project/prompt_lab5/00_SHARED_EXECUTION_RULES.md` completely. Read Lab 5 plan sections 4-6/9/10, Sprint 2 section 5.1, project-detail sections 5/7/9/11/13, accepted delivery decisions from #13, actual auth/domain contracts and `Project_code/README.md`. Inspect package scripts, runtime validation/startup, Prisma generation/seed, shared modules, DB test guards and any existing delivery files before editing.

Verify the real accepted Lab 5 delivery checkpoint, exact staging baseline and B's shared-file integration agreement. Missing broader S2 acceptance may only be bypassed by an explicit recorded delivery-specific checkpoint, not by assumption. Use A's own clone and existing #14 branch/PR, or a new task branch such as `build/s2-a-docker` from accepted `staging/sprint-2` if truly new. Never implement on protected main/staging or inside the starter kit.

## Design before code

Write the task AC and short implementation design in the existing canonical contract/Issue: build stages, runtime contents, entrypoints, env scopes, readiness response/timeout, migration/seed job execution, safe limiter design and meaningful checks. Freeze JSON/script/env interfaces with B before dependent smoke code. B remains schema integrator; A proposes migration changes rather than concurrently editing applied history. If a required limiter/security/connection decision is unresolved, finish independent image/readiness work and present the precise proposed decision before dependent code.

Read UI skill/project-detail section 8 only if a deployment defect requires UI changes. Preserve established design, loading/error/recovery, accessibility and English copy; no unrelated feature or redesign.

## Implementation sequence

1. **Reuse the workspace.** Read actual engine/package pins and lockfile. Use `Project_code/` as app context. Do not duplicate packages, lockfiles, auth modules or the starter application.
2. **Production image.** Add/extend a multi-stage `Project_code/Dockerfile` with deterministic install, Prisma generation, client/server builds and non-root execution. Select a compatible supported base against actual pins and verify it; do not assume the starter Node version is correct.
3. **Runtime assets.** Include built client, bundled font licenses/assets, built server, runtime-required `shared/*.mjs`, generated Prisma client/engine assets and required production dependencies. Run the final image, not only the builder stage. Check static paths and unknown `/api` responses separately from SPA deep links.
4. **Job tooling.** Define explicit migrate/seed commands and verify them in the actual job image. Prisma CLI/`tsx` currently being development tools may disappear after pruning. Choose and document a tested job image/tool packaging approach; keep app startup free of schema reset/migration/automatic seed.
5. **Ignore and local run.** Write `.dockerignore` that excludes real env/credentials/Git/local dependencies/output but includes everything required by build/job. Add agreed local Compose when useful: persistent named DB storage, health condition and placeholders. Document ordinary stop/start versus destructive volume removal, which must never be the test procedure.
6. **Configuration.** Inventory app/scripts/test/seed env reads. Keep examples placeholder-only, clarify runtime/test/seed/build/GitHub scopes and preserve existing validations. Production requires real HTTPS `APP_ORIGIN`, injected PORT, valid DB URL, eight-hour session TTL and full source SHA. Never bundle server secrets into Vite variables.
7. **Operations.** Reuse `/api/health` with release identity. Implement accepted `/api/ready`: minimal real DB query, bounded timeout, exact agreed JSON, 200 on success/503 on failure, sanitized response and no private record query. Verify listener accepts container traffic and graceful SIGTERM cleanup.
8. **Auth/public login.** Preserve Secure/HttpOnly/SameSite cookie behavior, opaque hashed session token, independent DB CSRF token, source/Origin rules, custom login header, no-store private responses, revocation/expiry and role/team scope. Inspect actual implementation rather than replacing it with a bearer token example.
9. **Shared limiter.** Implement the accepted multi-instance throttling design, including threshold/window/keys/trusted-proxy policy/retention/cleanup/concurrency and generic 429 errors. Coordinate any migration with B, use bounded database work and avoid exposing whether a user exists. Do not add a paid cache service without the agreed decision.
10. **Persistence and seed.** Keep domain/session state in external PostgreSQL. Verify first and repeated explicit seed preserve existing users/passwords/team membership/milestones/submissions/feedback. Fresh DB and existing S1-data upgrades must both work; do not change an already applied migration or point fixture cleanup at cloud data.
11. **Documentation.** Update only owned runtime/env/setup sections in `docs/labs/lab-05/deployment.md` and verified commands in `Project_code/README.md`. Add actual configuration contract/results to existing appropriate Markdown/evidence locations; coordinate B's release sections. Keep app README focused on implemented behavior.

## Verification to execute and retain

- Relevant unit/type/build checks and real-DB S1 regression with existing isolated guards. Inspect `npm run test:j03:isolated` and prerequisites; report actual counts/exit/result files and SHA, not expected historical counts.
- New readiness connected/disconnected/timeout/sanitization tests; shared limiter threshold/expiry/concurrent requests/IP trust/429 tests; production config/port/auth proxy regressions that your changes can affect.
- Build the final image from a **fresh checkout** at the candidate commit; privately fill documented env; start app+real DB; verify health/version/readiness/HTML/assets/deep links and role-scoped API behavior.
- Exercise the actual migration/seed entrypoint and safe repeated seed. Inspect image/context/history for secrets without dumping environment or password-bearing URLs.
- Create local milestone/submission/feedback with recorded IDs, perform an actual app restart while preserving DB, then read the same records/session. This local proof prepares C-03 and runtime confidence; it is not public C-04/C-05 evidence.
- Preserve actual failing/passing evidence for substantive new behavior when using TDD; fix regressions before protected integration. If Docker/DB/runner access is unavailable, complete unaffected checks and report the exact unverified items; do not substitute mocks for real-DB/image success.

## GitHub timing and endpoint

Save/read back #14's real Specified/Started transitions before edits when starting new work. After the first coherent pushed implementation commit, open/reuse the Started Draft PR to staging and initialize its Project card immediately. Complete checks, scoped diff/secret review and runtime docs on the same PR. Keep other owners' files unstaged.

After actual staging handoff criteria pass, update PR evidence, mark ready, move/read back both cards to PR Review and prepare B's review request. No self-approval or merge; report required real peer action. If a main target is unavoidable due to a documented planning bootstrap, application implementation must instead wait for proper staging; do not use the docs exception for code.

Provide exact branch/head/base/Issue/PR, changed behavior/files, image/job commands, operational JSON/env contract, actual result links, limitations and safe reproduction for B. Stop at peer acceptance or unresolved required decisions. Next: B/05_REVIEW_R2-A01.md; cloud work waits for the integrated container/CI gate.
