# D1 visual reference

## Retained source

The reference is the user's 53-page Canva-exported report, Project Deliverable 1 Engineering baseline and working Sprint 1. Its source SHA-256 is recorded in `assets/reference-provenance.json`. The retained PDF and rendered sample PNGs are read-only visual authorities. The package does not assert that historical project claims remain current.

## Visual system

| Element | Observed D1 treatment | Reusable default |
|---|---|---|
| Paper | Portrait, approximately 595.5 x 842.25 points | Same A4-like dimensions |
| Cover | Large white upper area; centered fastTrack block around the middle/lower half | Black 24 pt brand, optional 14 pt report title, 12 pt authors and links |
| Text | Inter 18pt Regular, mostly 12 pt | Licensed Inter, optical size 18, weight 400, 12 pt with 16.5 pt leading |
| Major heading | Inter Bold, about 18 pt | 18 pt, black, left aligned |
| Subheading | Inter Bold, about 14 pt | 14 pt, black, left aligned |
| Tables | White background, black grid, bold header, commonly 10 pt | White headers, 10 pt body, 0.65 pt black grid, intentional widths and padding |
| Links | Black and underlined | Searchable labels and clickable black links |
| Figures | Original screenshots, captions above/beside images; long UI split across pages | Numbered caption with source/check/version; readable original image or labeled crop |
| Diagrams | Simple monochrome boxes, thin gray borders and black arrows | Reuse that language only when a technical diagram is needed |
| Footer | Plain page number at the lower right, including cover | 12 pt black; no running brand header |

The source uses varying narrow margins. The helper normalizes these to 24 pt sides and top, reserving the footer area below body content. This preserves the overall dense, plain report appearance while preventing text from touching page edges or colliding with the page number.

## Representative pages

- `assets/reference-pages/page-1.png`: centered cover, author and linked metadata.
- `page-2.png`: plain contents grid.
- `page-3.png`: heading ladder, prose and compact record table.
- `page-10.png`: dense requirement matrix with white headers and black rules.
- `page-12.png` and `page-13.png`: architecture/data diagrams and technical tables.
- `page-37.png`: long mobile screenshot shown as a labeled vertical segment.
- `page-39.png`: full UI capture with explicit limits and source narrative.

## Fidelity boundaries

Keep the typography, alignment, monochrome palette, grid tables and evidence-first layout. Do not reproduce accidental clipping, huge blank gaps, stale contents page numbers or evidence that belongs to another assignment. Do not replace live evidence with an AI-generated image. Do not turn historical D1 metadata into defaults for a new report.
