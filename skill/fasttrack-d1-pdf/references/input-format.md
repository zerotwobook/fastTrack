# Report specification

Use a JSON object with `title`, optional `brand`, `authors`, `links`, `cover`, `contents`, and an ordered `sections` array. The input is an intermediate representation of the retained source Markdown, not a replacement for that source. Supply actual new report facts; the example below is layout-only sample content.

```json
{
  "title": "Example Engineering Report",
  "brand": "fastTrack",
  "authors": ["Example author"],
  "links": [{"label": "Source repository", "url": "https://github.com/zerotwobook/fastTrack"}],
  "cover": true,
  "contents": true,
  "sections": [{
    "title": "Evidence index",
    "blocks": [
      {"type": "paragraph", "text": "This is a layout example, not a project test result."},
      {"type": "heading", "text": "Recorded checks"},
      {"type": "table", "headers": ["Check", "Source", "Result"], "widths": [0.16, 0.50, 0.34], "rows": [["Example", "[Repository](https://github.com/zerotwobook/fastTrack)", "Not executed"]]}
    ]
  }]
}
```

## Content blocks

- `paragraph`: `text`, with optional `**bold**`, inline backticks and `[label](https://...)` links. Other text is escaped. Use paragraphs for explanations and tables for repeated records.
- `heading`: `text`; rendered as a 14 pt subheading. Sections provide the 18 pt major headings.
- `table`: non-empty `headers`, equal-length `rows`, optional positive `widths` that sum to 1. Header labels repeat when the table crosses pages. Rows wrap; no fixed row heights are imposed.
- `figure`: `path` to an existing local image, `caption`, optional `crop` in original top-left pixel coordinates `[left, top, right, bottom]`, optional `width_pt` and `max_height_pt`. Paths resolve relative to the specification. Crops are canvas clips of unchanged original images. Include the figure number, relevant check/requirement, source/version/time and the full-image link in the caption. Add multiple labeled figure blocks to divide a long capture; never imply that separate excerpts form one new original screenshot.
- `code`: `text`, shown in Courier 9 pt; long lines require deliberate line breaks or a direct source link.
- `page_break`: an explicit break when the next body unit needs its own page.

Each section starts on a fresh page by default. Set its `new_page` to `false` to continue naturally. Set both `cover` and `contents` to `false` for a compact evidence index. Contents page numbers are generated from actual section positions during multi-pass layout, not copied from D1.

## Validation and output

`--check-only` does not write a PDF. It checks structural input, image existence and crop bounds, font coverage, table proportions and basic flowable wrapping. It does not execute linked tests, check a web page, predict every page break or replace visual QA. `--build` creates the requested PDF and refuses an existing destination unless `--overwrite` is supplied. No command publishes or uploads a file.

For special layouts, import the script's `make_styles`, `make_table`, `OriginalImage` and `D1Document` components into a task-local builder and retain the same render/inspect loop.
