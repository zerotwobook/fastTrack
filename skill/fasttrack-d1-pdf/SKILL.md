---
name: fasttrack-d1-pdf
description: "Create English engineering report PDFs using the fastTrack D1 visual style: Inter typography, a centered cover, plain black grid tables, readable evidence images and page numbers at the lower right. Use when the user asks for the D1 report layout or invokes this skill; preserve the current assignment's required headings and evidence."
---

# fastTrack D1 PDF

Reproduce the visual language of the user's retained D1 reference while using the new report's actual content. This is a personal PDF skill, not a Template Gallery entry. The original PDF is retained byte-for-byte in [assets/reference.pdf](assets/reference.pdf); it is a design reference, not a source of current project facts.

## Use the reference

- Open [assets/preview.png](assets/preview.png) for the cover. Read [references/design.md](references/design.md) and inspect the relevant retained page images before laying out a report.
- Use pages 2, 3 and 10 for contents, typography and tables; pages 12-13 for technical diagrams; pages 37 and 39 for UI evidence. All are under [assets/reference-pages](assets/reference-pages).
- Prefer A4 portrait, white paper, black Inter headings and text, white table headers with bold labels, thin black grid lines, and a plain page number at the lower right. Do not add colored title bars, decorative cards, dark table headers or branding in every page header.
- Match the appearance approximately, not the original page count, accidental spacing or old content. Improve a crop or page break when necessary for readability.

## Preserve report meaning

Read the current assignment and source Markdown first. Keep required section names, ordering, rubric mapping, actual checks, tested commits, limits and direct evidence links. Never import D1's old Issue numbers, PR state, test counts, screenshots or release claims into a new report.

For Lab 5, retain Answer Part 0 through Answer Part 4 in order and keep the report concise. Use the current Lab 5 handout; D1's Part A-F structure is not a substitute. A cover and contents page are optional when the assignment favors a compact evidence index.

Author and retain the new report as English Markdown. Create or overwrite a PDF only when the user explicitly requests that output; invoking this skill to discuss or inspect a template is not permission to export a report. Do not overwrite the reference, publish, upload, release, deploy or change repository metadata merely to format a document.

## Generate with reusable components

The package includes licensed static Inter Regular and Bold fonts, exact style tokens, and [scripts/build_pdf.py](scripts/build_pdf.py). It accepts a small structured report specification so content, table widths and source-image crops stay deliberate. Read [references/input-format.md](references/input-format.md) for the format.

Use the active Codex dependency runtime, with ReportLab and Pillow. The script resolves its own fonts and style tokens; it does not depend on this repository, the original file location, Canva, Word, or a font installation.

```text
PYTHON scripts/build_pdf.py --input report-spec.json --check-only
PYTHON scripts/build_pdf.py --input report-spec.json --output report.pdf --build
```

Replace `PYTHON` with the resolved runtime executable. The first command validates input, fonts, asset paths, table widths and flowable dimensions without generating any PDF. The second creates the report only after actual PDF authorization. Existing output files are refused unless the user authorized replacement and `--overwrite` is passed.

If the PDF skill is available, follow its authoring contract and run its artifact-operation marker once immediately before the first actual PDF authoring command. Do not run that marker for reading reference pages or `--check-only`.

Adapt the included ReportLab components for layouts the schema does not express, rather than flattening the entire report into images. Keep body text searchable, links clickable, fonts embedded and source images unchanged.

## Evidence images and verification

Use original screenshots. The helper clips an original image on the PDF canvas; it does not edit the raster or synthesize UI. Label every crop or vertical segment and link the complete source. Keep the public URL, role and important result visible when the check requires them. A screenshot alone does not prove an HTTP status, source SHA, persistence boundary or successful test.

Render every generated PDF page to PNG with Poppler and inspect every page at readable size. Check the cover, table continuation/header repetition, long identifiers and URLs, figure captions, screenshot text, section order and page numbers. Fix and render again when needed. `--check-only` is a preflight, not a rendered-PDF pass. Keep QA intermediates separate from final deliverables.

Do not shrink a tall screenshot until its text becomes unreadable: use labeled vertical segments or focused crops, as in the reference. Do not preserve the reference's 53-page length for a short assignment. Report only the output and checks actually completed.
