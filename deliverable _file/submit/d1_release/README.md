# D1 combined report and release review

Current task R1-J04-A-REFRESH / #74, PR #75, parent #12. A/Codex refreshed the previously accepted #66 preparation; B reviews this new source/PDF into staging. Accepted application source: **17f4398d52536fc8049022e56a7bacd0beeb822a**. G0-G4, source packages and correction/UI merges are accepted. **User main authorization, final G5/main/tag/submission remain pending.**

## Artifacts

- [Combined English source](report.md): substantive Parts A-F, current acceptance statements and evidence.
- [PDF review candidate](../../../output/pdf/fastTrack_D1_review_candidate.pdf): 50 pages, A 2-5 / B 6-8 / C 9-17 / D 18-19 / E 20-27 / F 28-50; six bookmarks, full AC/STS/DoD, historical/current figures and two actual test excerpts.
- [Source/version manifest](source_manifest.json), [current GitHub snapshot](current_github_snapshot.json), [actual acceptance reconciliation](acceptance_reconciliation.json), [page map/hash](page_map.json), [verification](qa_checks.json) and [recorded render inspection](visual_review.json). The earlier github_snapshot.json remains historical.
- [Report generator](build_report.py): embedded fonts and deterministic PDF metadata; source images are not changed. Tall/wide captures are explicitly paginated/clipped in PDF layout for legibility.

## Rebuild

Verified artifact runtime: Python 3.13.16 on Windows with installed Calibri/Consolas fonts (C:/Windows/Fonts). Dependencies: reportlab 5.0.1, pypdf 6.18.1, Pillow 12.3.0, PyMuPDF 1.28.2. Font files are not copied into the repository; the generated PDF embeds its used glyphs. This artifact tooling is separate from application dependencies.

From repository root:

```powershell
python 'deliverable _file/submit/d1_release/build_report.py'
python 'deliverable _file/submit/d1_release/verify_report.py'
```

The generator stabilizes actual page ranges before writing page_map.json; unchanged source/fonts produce identical PDF bytes. Intermediate review images belong under ignored tmp/pdfs/. The final PDF is at repository-root output/pdf/.

## Actual verification and review boundary

All 50 PDF pages were rendered and visually inspected; changed table/figure pages were rechecked after layout/provenance fixes. Text bounds, source/image hashes, exact excerpts, current case names, links/navigation and deterministic bytes pass. Fresh current-source verification passed **340 automated cases plus seven separate migration scenarios**, generation/typecheck/build, real compiled role journeys and 108 role/viewport combinations. The owned database container was removed. This run used the existing workspace with fresh disposable databases; historical 310-case and 340-case clean-clone evidence is not relabeled as a new install.

Original A/B packages, application/domain-test/schema/lockfile and historical reports stay unchanged. One browser-helper wait now synchronizes with asynchronous dialog close before its existing assertions. Chromium/Windows only; current native 200% and physical-device checks remain disclosed limits. B's refreshed-PDF review is pending. Follow [the pre-main handoff](../../../workflow/handoffs/R1-J04_REFRESH_PRE_MAIN.md): accept this preparation into staging, present the concrete new candidate for user authorization, then obtain protected final peer release review. Keep main #67 Draft until that authorization. No assessed tag, G5 approval, course upload or receipt is created by preparation.
