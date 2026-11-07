# D1 combined report and release review

Joint task R1-J04 / #12, PR #66. A/Codex prepared the combined candidate; B reviews its exact source/PDF. Accepted application/source baseline: 4de6a7a8d3f6c1028d8a40fbbae17875c272361b. G0-G4 and both source packages are accepted. **G5/main/tag/submission remain pending.**

## Artifacts

- [Combined English source](report.md): substantive Parts A-F, current acceptance statements and evidence.
- [PDF review candidate](../../../output/pdf/fastTrack_D1_review_candidate.pdf): 44 pages, real A-F navigation, bookmarks, full AC/STS/DoD, original figures and two actual test excerpts.
- [Source/version manifest](source_manifest.json), [actual GitHub snapshot](github_snapshot.json), [page map/hash](page_map.json) and [verification](qa_checks.json).
- [Report generator](build_report.py): embedded fonts and deterministic PDF metadata; source images are not changed. Tall/wide captures are explicitly paginated/clipped in PDF layout for legibility.

## Rebuild

Verified artifact runtime: Python 3.13.16 on Windows with installed Calibri/Consolas fonts (C:/Windows/Fonts). Dependencies: reportlab 5.0.1, pypdf 6.18.1, Pillow 12.3.0, PyMuPDF 1.28.2. Font files are not copied into the repository; the generated PDF embeds its used glyphs. This artifact tooling is separate from application dependencies.

From repository root:

```powershell
python 'deliverable _file/submit/d1_release/build_report.py'
```

The generator stabilizes actual page ranges before writing page_map.json; unchanged source/fonts produce identical PDF bytes. Intermediate review images belong under ignored tmp/pdfs/. The final PDF is at repository-root output/pdf/.

## Actual verification and review boundary

All 44 PDF pages were rendered and visually inspected; changed pages were rechecked after layout/attribution fixes. Text bounds, source/image hashes, exact test excerpts and current evidence mappings are checked separately. The existing successful 310-case/seven-migration run is reused with its actual source/time; no extra application test run is claimed for this document preparation.

Original accepted A/B packages, application source/schema/lockfile and historical reports stay unchanged. Current workflow/technical status entry points are updated. B's combined-report review is pending. This candidate is not ready to submit to the course system: reconcile actual accepted release/tag/main identity, final page/evidence status and both G5 decisions first. Notify the user with the final release candidate/checks before any main merge. Do not infer course-upload authorization or fabricate a receipt.
