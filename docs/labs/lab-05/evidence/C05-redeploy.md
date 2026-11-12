# C-05 redeploy: A/11 readback

Owner: A (`zerotwobook`), R2-J01 / [Issue #16](https://github.com/zerotwobook/fastTrack/issues/16). B (`Atip-Infa`) independently cross-checks the actual records. This phase observes the completed release; it does not deploy again or create replacement data.

**Checkpoint: release identity gate passed; original-record readback pending. Whole acceptance remains PENDING.**

## Actual release boundary

- B approved exact release head `80ad1df62700c9aba5d1ac84441143b85e19c629` on base `16ec6d268ac087f3834be7da55dda29e589847ce`; the user authorized that concrete candidate. [PR #100](https://github.com/zerotwobook/fastTrack/pull/100) merged as `8e637e537cd037d630a5fffc1b5672d1b44371a8`.
- The automatic push run `43185679995` was cancelled before any deploy step because its B initiator conflicted with B-only independent environment approval. The user separately authorized the bounded cancellation and one A-initiated replacement; no protection was weakened.
- [Replacement run 43186570077](https://github.com/zerotwobook/fastTrack/actions/runs/43186570077), event `workflow_dispatch`, A initiator, exact main source `8e637e5`, completed SUCCESS. The actual approval API identifies `Atip-Infa` approving `demo`. CI, WIF, both image builds/uploads, migration/rollout, smoke and summary steps succeeded. This is manually triggered delivery of the accepted main source, not an automatic-push success claim.
- Actual migration execution `fasttrack-migrate-dnvqn` completed at `2026-11-12T09:05:39.568704Z`, succeeded count 1. The older bootstrap execution is separate.
- Public health/readiness returned 200 / database connected / source `8e637e537cd037d630a5fffc1b5672d1b44371a8`. Filtered Cloud Run readback identifies revision `fasttrack-app-00003-rc7` with 100% traffic. Digest/DB-reference/visible-copy verification and original-record comparisons are being collected separately.

## Preserved evidence and session limit

The immutable [original C04 ledger](../../../../Project_code/docs/evidence/R2-J01-C04-baseline.json) and [actual distinct restart result](../../../../Project_code/docs/evidence/R2-J01-C05-restart.json) remain unchanged. Compare the original milestone `b19ae7d5-d2a1-4ace-9b11-d2a94cb8177d`, submission `baa3eb8d-e37f-44c2-93fc-dc9f8e5463fd` version 1 and feedback `b9ebf7f7-a542-4b89-95a8-8f1de22a5357`, including full values/relationships/counts. Do not seed, reset or recreate them.

Both prior restart-specific browser contexts were observed unavailable before this readback. Their redeploy-session continuity is NOT ESTABLISHED; do not label a new login as survival of those sessions. Fresh isolated approved synthetic roles can establish domain persistence, normal access and wrong-team denial without changing the original records. Temporary sessions must be logged out when the checks finish.

## Remaining readback and handoff

Read the exact originals as Student A1 and Supervisor A, deep-link/reload the saved journey, repeat the safe wrong-team Supervisor B denial, and compare with both baseline and restart observations. Capture only sanitized actual results, safe runtime/secret-reference metadata and credential-free screenshots. B review is pending until performed; pipeline approval is not an independent record readback.

This branch also preserves accepted main ancestry for a reviewed staging sync; no protected branch is changed directly. Follow the actual early-Draft/Started workflow. Later report-source preparation is separate, no PDF/export/upload or new cloud mutation is authorized here.
