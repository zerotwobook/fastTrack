# R1-J04 refresh - user checkpoint before main

Owner A/zerotwobook, task R1-J04-A-REFRESH / [#74](https://github.com/zerotwobook/fastTrack/issues/74), parent [#12](https://github.com/zerotwobook/fastTrack/issues/12). B/Atip-Infa independently reviews [preparation PR #75](https://github.com/zerotwobook/fastTrack/pull/75) into staging/sprint-1. Branch `docs/s1-a-release-refresh`, based on accepted staging application **17f4398d52536fc8049022e56a7bacd0beeb822a**.

The user asked to complete remaining preparation and notify them just before main so they can arrange peer review. This is permission to prepare a concrete candidate, not permission to merge main, approve as B, create an assessed tag or upload to LEB2. Follow [MAIN_RELEASE_GATE.md](../MAIN_RELEASE_GATE.md).

## Completed preparation

- Verified B's exact-head approvals and actual staging merges of #71 (repairs), #69 (main gate) and #73 (UI/eye toggle). Reconciled #70/#68/#72 as closed Done/PASSED/ACCEPTED and filled real PR acceptance without replaying native Done events.
- Current application source is 17f4398; main remains **2080cf31f8d855ecba9624eafe4fe9a5fa74b4d8**. This refresh changes documentation/artifact tooling and a browser-helper wait, with no application/domain/API test/schema/dependency changes.
- Fresh disposable `npm run review:j03`: generation, fresh/repeat migrations, typecheck, production build, **340 passed / 0 failed / 0 skipped** cases plus **seven separate migration scenarios**. Owned container/credential cleanup completed. [Case/stage report](../../Project_code/docs/evidence/R1-J04-REFRESH-system.json).
- Fresh compiled-browser normal create/submit/save-feedback/reload journey, real foreign 404 and expired-deadline UI, API-matched student groups, **108 role/viewport combinations**, feedback read/write ordering/lost-response/frozen-intent recovery, loading/error/retry and masked private drafts passed. [Methods/results](../../Project_code/docs/evidence/R1-J04-REFRESH-browser.json).
- Refreshed [PDF](../../output/pdf/fastTrack_D1_review_candidate.pdf), [source](../../deliverable%20_file/submit/d1_release/report.md), [page map/hash](../../deliverable%20_file/submit/d1_release/page_map.json), [source manifest](../../deliverable%20_file/submit/d1_release/source_manifest.json) and [QA](../../deliverable%20_file/submit/d1_release/qa_checks.json). Original source packages, figures, accepted preparation and historical 310-case/native-zoom records retain their identities.

## Review the concrete artifact

The PDF has 50 pages: A 2-5, B 6-8, C 9-17, D 18-19, E 20-27, F 28-50. The current merged-source/evidence update is on pages 45-50. Both real source-identical automated excerpts, current/historical test results, complete AC/STS/DoD and original reviewed Issue/PR chains remain embedded.

All pages were rendered and visually inspected; changed table/figure pages were rechecked. Screenshot page splits now choose nearby whitespace to avoid cutting through text, without altering source image bytes. Deterministic rebuild, original/current source hashes, links, requirements/AC/STS coverage, real case names, exact excerpts, six bookmarks, page starts and text bounds passed. Run from repository root:

```powershell
python 'deliverable _file/submit/d1_release/build_report.py'
python 'deliverable _file/submit/d1_release/verify_report.py'
```

The verifier records mechanical checks and renders. Human/agent visual inspection is recorded separately after viewing, tied to the exact PDF hash; rerendering alone is not visual acceptance. The first Supervisor browser run raced the native close event; the helper now waits for collapsed state/restored focus before the same assertions, and both final matrices passed. One initial artifact check required correcting its T-31-local matching; neither harness issue is hidden as a product failure.

## B preparation review

Review PR #75 current head, complete source/PDF diff, all 50 rendered pages and attribution. Confirm the unchanged executable tree against 17f4398, source/hash manifests, fresh 340-case evidence, current versus historical browser records and main hold. Inspect especially the current setup checkout commit, bundled-font claim, updated controls/figures, 340-versus-310 tables and native-zoom disclosure. B may accept/merge this preparation into staging under normal protection; A does not self-approve or merge it.

## Exact main boundary

1. PR #75 needs independent preparation acceptance/integration first. Read back its actual merge/new staging head and compare runtime tree identity to tested 17f4398. A docs-only merge does not need a redundant full DB run; unexpected runtime changes need affected rechecks.
2. Keep [release PR #67](https://github.com/zerotwobook/fastTrack/pull/67) **Draft**, no auto-merge and no outstanding final release review request while user authorization is pending. Main base is 2080cf3; current staging head before preparation integration is 17f4398. The preparation PR head is obtained live from #75 rather than guessed from this document's self-referential commit.
3. Show the user that concrete post-preparation head/base, application preview/PDF, actual checks and limits. Obtain/record their explicit current-candidate release authorization before main ready/final peer handoff. Changed candidates require reassessment; silence and staging approval do not authorize main.
4. Then obtain actual B release review and both final G5 decisions as applicable, respect branch protection and verify the real main merge. Only then preserve a new immutable assessed tag/commit and reconcile final PDF identity. Never move an assessed tag or predeclare acceptance.
5. Submit only on actual user course-submission instruction by **8 November 2026, 23:59 Asia/Bangkok**; retain a real receipt. Close #12 only after its full release/submission/handoff criteria, then start S2 from accepted main under #13.

## Remaining practical limits

The scoped refresh diff passes `git diff --check`. The unfiltered main-to-staging diff returns exit 2 for eight inherited whitespace/blank-EOF notes in seven files: shared components, global CSS, tokens, both original font licenses, applied migration `20261106195734_g1_schema_corrections` and historical fixture `g1-candidate-633a9fe.sql` (two notes). Preserve applied checksums, license bytes and fixture history; B reviews this nonfunctional disposition. Do not report a passing unfiltered check or silently rewrite those sources.

Chromium/Windows only. Physical mobile devices and Firefox/WebKit were not checked. Current native browser 200% zoom was not rerun; 640px reflow is a proxy and the earlier user manual report stays historical. No new clean-clone install was claimed for this refresh; accepted historical clean-setup evidence is retained. Public deployment, Docker/CI/CD implementation, throttling/readiness and cloud redeployment remain Lab 5. No release-ready/G5/main/tag/submission claim is made by author verification alone.
