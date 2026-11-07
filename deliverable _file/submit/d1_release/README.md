# D1 Markdown source and release review

Current task R1-J04-A-REFRESH / #74, PR #75, parent #12. A/Codex maintains the Markdown source and handoff for B review into staging. Accepted application source: **17f4398d52536fc8049022e56a7bacd0beeb822a**. G0-G4, source packages and correction/UI merges are accepted. **User main authorization, final G5/main/tag/submission remain pending.**

The user requested Markdown documentation and will assemble/export the final report. Use [report.md](report.md) as the primary document. Do not generate/rebuild/export a PDF unless the user explicitly requests it; this includes PDF-rebuilding verification tools. The instructor's final submission format is unchanged.

## Artifacts

- [Combined English source](report.md): substantive Parts A-F, current acceptance statements and evidence.
- [Historical PDF snapshot](../../../output/pdf/fastTrack_D1_review_candidate.pdf): 50 pages, generated before the Markdown preference at commit `209ccc7`. Its page map and layout QA describe that snapshot, not subsequent Markdown edits.
- [Source/version manifest](source_manifest.json), [current GitHub snapshot](current_github_snapshot.json), [actual acceptance reconciliation](acceptance_reconciliation.json), [page map/hash](page_map.json), [verification](qa_checks.json) and [recorded render inspection](visual_review.json). The earlier github_snapshot.json remains historical.
- [Report generator](build_report.py): embedded fonts and deterministic PDF metadata; source images are not changed. Tall/wide captures are explicitly paginated/clipped in PDF layout for legibility.

## Historical export tooling

Verified artifact runtime: Python 3.13.16 on Windows with installed Calibri/Consolas fonts (C:/Windows/Fonts). Dependencies: reportlab 5.0.1, pypdf 6.18.1, Pillow 12.3.0, PyMuPDF 1.28.2. Font files are not copied into the repository; the generated PDF embeds its used glyphs. This artifact tooling is separate from application dependencies.

The retained generator stabilizes page ranges before writing page_map.json. The verifier also rebuilds the PDF as a side effect. Run either only when the user explicitly requests PDF work. Ordinary Markdown editing/review does not require either tool. Prior export/render outputs remain historical.

## Actual verification and review boundary

At `209ccc7`, all 50 PDF pages were rendered/visually inspected and the recorded artifact checks passed. Those results remain historical after Markdown edits. Application verification at unchanged source `17f4398` passed **340 automated cases plus seven separate migration scenarios**, generation/typecheck/build, real compiled role journeys and 108 role/viewport combinations. The owned database container was removed. This run used the existing workspace with fresh disposable databases; historical clean-clone evidence is not relabeled as a new install.

Original A/B packages, application/domain-test/schema/lockfile and historical reports stay unchanged. One browser-helper wait now synchronizes with asynchronous dialog close before its existing assertions. Chromium/Windows only; current native 200% and physical-device checks remain disclosed limits. B's current Markdown/source review is pending. Follow [the pre-main handoff](../../../workflow/handoffs/R1-J04_REFRESH_PRE_MAIN.md): accept this preparation into staging, present the concrete new candidate for user authorization, then obtain protected final peer release review. Keep main #67 Draft until that authorization. No assessed tag, G5 approval, course upload or receipt is created by preparation.
