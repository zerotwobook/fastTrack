# R2-B01 operational safety correction

Issue #15; release review #93 at `25d2e33b28ff12c48739d47b715642f2a6166cb9`. Branch `fix/s2-b-provision-guards` starts at that accepted staging head. B owns the operational module; the user explicitly authorized A (`zerotwobook`) to implement these two findings on B's behalf. B (`Atip-Infa`) remains the non-author reviewer. Use this isolated correction worktree; no direct staging/main edits.

## Design and acceptance

1. Credential discovery must succeed independently for SQL users and Secret Manager metadata. A failed query is UNKNOWN, not absence. Existing user plus missing secret, or missing user plus existing secret, stops for deliberate recovery. Both present preserves credentials; both absent allows fresh creation. Remove implicit password-reset behavior and test that failures cannot write users/passwords/secret versions.
2. Teardown must obtain successful inventories and check SQL deletion protection before any deletion. Never disable protection automatically. Skip only successfully verified absent targets. Stop on deletion/readback failure; preserve dependent resources if SQL deletion fails or cannot be confirmed. Verify all managed targets absent before printing completion. A partial failure remains nonzero and requires inspection before retry.
3. Wire meaningful offline regressions into the existing CI job. Preserve source/ref/digest/migration/rollback guards and dry-run/no-secret-output behavior. Update only the relevant operational guide; application/schema/lockfile and Cloud state stay unchanged.

## Verification plan

Run the new negative tests against the current scripts first and retain actual RED results. After implementation, run deployment, teardown, release and mocked smoke suites plus shell syntax/whitespace checks. The required current-head PR CI verifies the integrated candidate, including the existing application/DB/container regressions. Do not claim a live Cloud run from stub tests.

## Current checkpoint

Design commit `4cbc457` was pushed and early Draft PR [#94](https://github.com/zerotwobook/fastTrack/pull/94) was added/read back Started / NOT RUN / PENDING before implementation. Issue #15 stayed at its actual Fixing stage. A is the fix PR author; B remains its non-author reviewer.

Actual RED at regression commit `471c0d9127f7c6aeca820e1f00fabcf36d72d7d7`: the deployment test exited 1 because the partial-state scenario incorrectly succeeded; the teardown test exited 1 because protected SQL teardown incorrectly reported success. The fix PR stayed Started and its Verification FAILED was saved/read back. These tests ran against the original scripts before implementation.

After implementation, all local deployment scenarios pass, including both mismatched-state directions and both inventory failures; all 16 teardown cases pass, including protected/failed discovery, failed/unconfirmed deletion, SQL post-delete read failure, a secret remaining despite delete success, final-read failure, partial/absent targets, confirmation and dry-run. Existing release/rollback and 10 mocked smoke tests also pass. All use local stubs: no real Cloud/Docker/DB mutation is claimed. The final exact-head CI/review/acceptance state is recorded in the live PR and Issue; do not rewrite the RED source or claim whole-task completion from these checks.

Keep release PR #93 Draft and its findings unresolved until peer-accepted staging integration and current-candidate re-review. Whole #15/#16 acceptance and main-release authorization remain pending. No Cloud provisioning, password rotation, deletion, seed, release or PDF export is performed by this correction.
