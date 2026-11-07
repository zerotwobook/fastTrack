# Sprint 1 integrated verification plan

Task R1-J03 / Issue #9. Shared owners A/B; A executes this branch and supplies evidence, B cross-reviews and records its own actual gate decision. Base: accepted staging 514f34cbdb95f2141d2c7f3159a1c36a0bd236a6 after B approval/merge of PR #61. The approved f516b17 and merge have identical trees. B02 #8 and correction #60 are accepted/closed. Main is unchanged.

## Scope and ownership

Preserve accepted application behavior, schema/migrations/seed, shared UI tokens, runtime dependencies and lockfile. Extend verification under Project_code, not the application scope. A owns the test harness/evidence changes in this branch. B independently owns R1-B03 / #11 C/E/F/PDF assembly and reviews this shared gate record. The historical A03 report/map remains a versioned snapshot; a new integrated map will reference current exact results.

## Required checks

1. Fresh separate clone: install, generate, fresh/repeat migrations, typecheck, ordinary tests and client/server build; run the complete inherited protected PostgreSQL chain (G1/auth/B01/A02/B02 and migration upgrades).
2. A small integrated compiled-HTTP/DB check: real logins, scoped milestone creation, student submission, supervisor append-only exact-version feedback, replay/conflict, student reads and milestone latestSubmission/feedbackCount projection. Repeat add-only seed with stored work/password/membership/session evidence and verify unchanged records after a real compiled process restart. Existing feature cases remain authoritative for precise validation, clock/lock and negative matrices; do not duplicate every case.
3. Real browser checks for the complete journey and any remaining G4 states: 320/390/768/1280/1440 layouts, native browser 200% zoom, keyboard/focus, loading/empty/error/recovery and English monochrome copy. Preserve current private-data/account-switch behavior. Record the actual method and any limit; CSS scaling is not a substitute for native browser zoom.
4. Map all 18 feature ACs (F-01: five; F-02: three; F-03: six; F-04: four), five S1 extensions and shared T-21/T-22/T-31-local checks to exact passed cases or actual browser/clean-setup evidence. Keep Lab 5 readiness/cloud, S2/S3 features and final release/PDF out of S1 acceptance claims.
5. Supply two source-identical excerpts (deadline and access restriction), meaningful pre-implementation RED/GREEN history, two actual Issue/PR/peer-review/merge chains, source images/captions and explicit A/AI/B contributions for B assembly.

## Handoff and gate decisions

An early Draft PR follows this plan commit during Started, before new verification checks are complete. Record the actual checks/results/commit, then Ready + both cards PR Review + B review request. A verification pass is not a joint gate acceptance. B must independently review the current head/evidence and provide its actual G3/G4 result before accepted integration; do not infer a full G3/G4 decision from the earlier feature merge alone. If a required check fails, retain the finding and fix/retest the affected scope before handoff. Keep G5/main/release tag/final PDF/submission pending.

Current new-task checks: NOT RUN. Existing feature evidence is referenced as historical accepted evidence, not relabeled as a new run.
