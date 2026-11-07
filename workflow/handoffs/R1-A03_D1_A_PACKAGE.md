# R1-A03: D1 owner A package handoff

Owner A / zerotwobook; reviewer B / Atip-Infa. Issue #10. Branch `docs/s1-a-d1-evidence` from accepted staging `3365a36e4cd1fcdd7410cca2086447ec4ae5dc33`.

## Scope and shared ownership

Prepare English Parts A/B/D and selected F-01/F-03 evidence under `deliverable _file/submit/d1_owner_a/`. The existing whole-report baseline and B-owned Parts C/E are review sources, not overwritten by this task. B assembles the final self-contained A-F PDF after actual G3/G4/release checks. Keep application code, schema, shared UI and B's active feedback branch unchanged.

The package is tied to an immutable accepted source, not a live claim that Sprint 1 is fully released. A01/B01/A02 are peer-accepted; F-04/G3 and a main release are pending at this baseline. Preserve original instructor artifacts and earlier test-result snapshots.

## Contents and checks

- `A_SRS.md`: full-product context/actors, FR-01-FR-10, BR-01-BR-10, NFR-01-NFR-06, exclusions and decisions. Distinguish accepted S1 behavior from future scope.
- `B_FEATURES_TRACEABILITY.md`: F-01-F-08 inventory, dependency/sprint/owner mapping and all FR/BR/NFR responsibilities; actual evidence and uncovered checks remain explicit.
- `D_THREE_SPRINT_PLAN.md`: goals, allocation, dependencies, feasibility and completion outcomes for all three sprints and their assessment dates.
- `F_A_VERIFICATION.md`: actual F-01/F-03 AC-to-test/source mapping, selected readable test excerpt, real RED/GREEN and peer Issue/PR chains, normal/rejection/auth evidence, setup summary, contributions/AI use and limitations.
- Byte-identical selected screenshots and an asset/provenance manifest, so B can assemble from tracked files. Do not synthesize or alter execution evidence.
- Review the current C/E baseline against actual accepted code/contracts and record assembly findings here; do not claim B's pending final revision is already reviewed.

Validate local/immutable links, English authored content, complete ID/sprint coverage, exact test names/commits/counts, screenshot provenance, secret exclusion and whitespace. Application tests are not repeated for documentation-only changes; cite the actual clean-clone results and verify the accepted merge tree.

## Package and exact assembly boundary

The completed source files are in [deliverable _file/submit/d1_owner_a](../../deliverable%20_file/submit/d1_owner_a/):

| File | Use in the final report |
| --- | --- |
| [A_SRS.md](../../deliverable%20_file/submit/d1_owner_a/A_SRS.md) | Complete Part A, including cover/baseline metadata, all FR/BR/NFR and decisions |
| [B_FEATURES_TRACEABILITY.md](../../deliverable%20_file/submit/d1_owner_a/B_FEATURES_TRACEABILITY.md) | Complete Part B, covering the whole baseline and explicit execution gaps |
| [D_THREE_SPRINT_PLAN.md](../../deliverable%20_file/submit/d1_owner_a/D_THREE_SPRINT_PLAN.md) | Complete Part D, preserving allocation/dependencies/checkpoints and official dates |
| [F_A_VERIFICATION.md](../../deliverable%20_file/submit/d1_owner_a/F_A_VERIFICATION.md) | A's selected Part F content; merge with B's F-02/F-04/access evidence, not a replacement for all Part F |
| [verification_map.json](../../deliverable%20_file/submit/d1_owner_a/verification_map.json) | Exact reported names/source/result provenance for the 13 A-owned AC/extension rows |
| [asset_manifest.json](../../deliverable%20_file/submit/d1_owner_a/asset_manifest.json) and assets/ | Four original byte-identical source images with hashes/dimensions/tested source and captions |

Copy the substantive section content into the final self-contained PDF in A-F order; do not use repository links instead of the required content. Use real final PDF page numbers and an immutable accepted main release, not the preparation baseline 3365a36. Include the relevant images at readable size with their actual captions and source exceptions; keep passwords/tokens out. Byte-identical source images are tracked so B can assemble without access to A's ignored output folder. A owns the writing above; B owns final assembly and C/E updates.

## Actual review of the current C/E baseline

Reviewed source: deliverable _file/submit/project_deliverable_1.md, which explicitly identifies itself as a pre-implementation design snapshot. Compare it with accepted code/contracts at 3365a36 and actual clean-clone results. These are document-assembly findings, not a claim that the accepted app still has the old proposed behavior. B's pending final C/E revision is not yet accepted by A.

| Area | Source finding and required final assembly update | Authoritative accepted source |
| --- | --- | --- |
| Cover/C.1 | Old text says Project_code has no app and stack/build compatibility is unverified. Replace those current-status claims with actual versions/results and preserve historical statements only when clearly labelled. | Project_code/README.md; R1-A02-results.json; accepted 3365a36 |
| C.2 | M001-M004 are logical proposals, not the actual four timestamped migration directories. Explain logical versus physical names/roles and record the real migration sequence. Do not rename/rewrite accepted migrations. | server/prisma/schema.prisma and migrations/ |
| C.3 | Proposed Argon2id wording differs from accepted seed-compatible scrypt. Record actual async verification, opaque session-token hashing, absolute eight-hour lifetime and current session/source/CSRF behavior. | modules/auth/security.ts; modules/auth/index.ts; sprint-1-auth.md |
| C.4.8 | Proposed body requestId/VALIDATION_ERROR differs from accepted X-Request-Id correlation header and INVALID_INPUT. Document actual envelopes and guard-before-parser order. | http/errors.ts; http/request-context.ts; accepted module routers |
| C.4 UI | Preserve monochrome/typography and English copy. Current scoped form controls use #8A8A8A contrast, 16px text and 48px minimum height; avoid copying unverified older contrast claims into a final screenshot caption. | Actual A01/A02 CSS and browser evidence |
| C.5/E.3 | Preserve same-client team -> milestone locks, scoped recheck, inclusive once-read millisecond DB clock, immutable version 1 and cancelled -> duplicate -> deadline precedence. Internal test clock is not an HTTP option. | sprint-1-submissions.md and submissions.a02.ts |
| C.7/E.1-E.3 | Use exact current DTO/required-guard exports and shared/*.mjs runtime layout. F-01/F-02/F-03 are peer-accepted, not still entirely proposed. | Accepted contracts and PRs #54/#56/#57 |
| E.5/E.6 | Global PLANNED/NOT RUN/no-tests/no-TDD statements are historical. Incorporate the actual A-owned coverage/results and B's independently verified rows. F-04, full T-21 and final release checks must stay pending until actually run. | Owner A Part F/map plus B's future accepted feedback/evidence |
| Final complete journey | API process restart and independent browser reload pass; the combined UI immediately after actual process restart is not separately recorded. Include it with feedback persistence in G4. | B_FEATURES_TRACEABILITY.md gaps; Issue #9 verification scope |

A's clean-setup review uses the actual no-hardlink clone at 1bf8d63: npm ci 316 packages, generation/fresh-repeat migrations/typecheck/build, 111 ordinary/48 A02/33 B01/28 auth/38 G1 and seven upgrade scenarios passed; cleanup exit 0 and clone status clean. The approved merge into 3365a36 has an identical tree to f6c4988 and no executable change from that tested source. No redundant application run is represented as a new A03 result.

## Completion and remaining gates

B approved PR #59 at dfb4d1650eb74ebd7aef1b86fae967a9b95c7187 on 6 November 2026 at 19:25:25 UTC and merged it into staging/sprint-1 as 5b35fc1847e1482a4625772fcb007f43401d45bd at 19:28:52 UTC. The approved and merged trees match. Issue #10 is closed Done/PASSED/ACCEPTED. Verification of the final PDF and full S1 release is outside this accepted package scope.

B completes its C/E/F contribution and assembles the final PDF after G3/G4/G5. The A-owned package has already been accepted through PR #59. Do not change past completed cards or infer a main release/submission from a documentation merge.

## Actual package verification

Passed checks: all FR-01-FR-10, BR-01-BR-10, NFR-01-NFR-06 and F-01-F-08 are covered; 13 AC/extension rows reference 27 exact passing case names from actual results; the selected test excerpt equals its immutable source; all four images match their original bytes/hashes/dimensions. Authored content is English; local links, JSON and secret-pattern/whitespace checks pass. No application/schema/runtime/lockfile differences from accepted staging 3365a36. No application suite was rerun for these document-only changes.

PR #59 carries the accepted owned package and A02 status update; its B review/merge and Issue #10 closure are verified above. The final whole-report PDF, B's current C/E revision and G3/G4/G5 are not certified by these package checks.

## Subsequent feedback candidate evidence

The combined UI-after-actual-process-restart gap in the older A03 source/map was exercised during #60 / PR #61 feedback correction review. [The new candidate evidence](../../Project_code/docs/evidence/R1-B02-A-review.md) records unchanged submission and feedback DTOs plus student UI/session restoration after a real compiled process restart. This is additional current-candidate evidence; the accepted historical A03 map is preserved. B must accept the feedback correction before using it as the accepted full journey in the final PDF. G3/G4/G5 are not automatically accepted by this follow-up.
