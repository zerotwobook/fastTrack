"""Render a report with the retained fastTrack D1 visual system.

Use --check-only for a PDF-free preflight. Actual output requires --build.
"""
import argparse
import hashlib
import html
import json
import math
from pathlib import Path
import re

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.styles import ParagraphStyle, StyleSheet1
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from reportlab.platypus import (
    BaseDocTemplate, Flowable, Frame, KeepTogether, PageBreak, PageTemplate,
    Paragraph, Preformatted, Spacer, Table, TableStyle,
)
from reportlab.platypus.tableofcontents import TableOfContents

PACKAGE = Path(__file__).resolve().parents[1]
ASSETS = PACKAGE / 'assets'
STYLE = json.loads((ASSETS / 'style.json').read_text(encoding='utf-8'))


def make_styles():
    for name, key in [('D1Inter', 'font_regular'), ('D1InterBold', 'font_bold')]:
        if name not in pdfmetrics.getRegisteredFontNames():
            pdfmetrics.registerFont(TTFont(name, str(ASSETS / STYLE[key])))
    pdfmetrics.registerFontFamily('D1Inter', normal='D1Inter', bold='D1InterBold',
                                  italic='D1Inter', boldItalic='D1InterBold')
    ss = StyleSheet1()
    ss.add(ParagraphStyle('D1Body', fontName='D1Inter', fontSize=STYLE['body_size'],
                          leading=STYLE['body_leading'], spaceAfter=9,
                          textColor=colors.black, splitLongWords=True))
    ss.add(ParagraphStyle('D1H1', parent=ss['D1Body'], fontName='D1InterBold',
                          fontSize=STYLE['heading_size'], leading=22, spaceAfter=12, keepWithNext=True))
    ss.add(ParagraphStyle('D1H2', parent=ss['D1Body'], fontName='D1InterBold',
                          fontSize=STYLE['subheading_size'], leading=18, spaceBefore=8,
                          spaceAfter=7, keepWithNext=True))
    ss.add(ParagraphStyle('D1Table', parent=ss['D1Body'], fontSize=STYLE['table_size'],
                          leading=13, spaceAfter=0))
    ss.add(ParagraphStyle('D1TableHead', parent=ss['D1Table'], fontName='D1InterBold'))
    ss.add(ParagraphStyle('D1Caption', parent=ss['D1Body'], fontSize=STYLE['caption_size'],
                          leading=13, spaceAfter=6, keepWithNext=True))
    ss.add(ParagraphStyle('D1Code', fontName='Courier', fontSize=9,
                          leading=11.5, spaceBefore=4, spaceAfter=9))
    ss.add(ParagraphStyle('D1Cover', parent=ss['D1Body'], alignment=TA_CENTER))
    return ss


def normalize(text):
    return str(text).replace('\u2011', '-').replace('\u2013', '-').replace('\u2014', '-')


def inline(text):
    """Accept limited Markdown inline markup; escape arbitrary source HTML."""
    text = normalize(text)
    tokens = re.split(r'(\[[^\]]+\]\(https?://[^)]+\)|\*\*[^*]+\*\*|`[^`]+`)', text)
    output = []
    for token in tokens:
        match = re.fullmatch(r'\[([^\]]+)\]\((https?://[^)]+)\)', token)
        if match:
            output.append('<link href="' + html.escape(match[2], quote=True) +
                          '" color="#000000"><u>' + html.escape(match[1]) + '</u></link>')
        elif token.startswith('**') and token.endswith('**'):
            output.append('<b>' + html.escape(token[2:-2]) + '</b>')
        elif token.startswith('`') and token.endswith('`'):
            output.append('<font name="Courier" size="9">' + html.escape(token[1:-1]) + '</font>')
        else:
            output.append(html.escape(token))
    return ''.join(output).replace('\n', '<br/>')


def make_table(headers, rows, proportions, width, styles):
    if not headers or any(len(row) != len(headers) for row in rows):
        raise ValueError('Every table row must have the same number of cells as its non-empty header.')
    proportions = proportions or [1 / len(headers)] * len(headers)
    if (len(proportions) != len(headers) or
            any(not math.isfinite(x) or x <= 0 for x in proportions) or
            not math.isclose(sum(proportions), 1, abs_tol=0.001)):
        raise ValueError('Table widths must be positive fractions that sum to 1.')
    data = [[Paragraph(inline(x), styles['D1TableHead']) for x in headers]]
    data.extend([Paragraph(inline(x), styles['D1Table']) for x in row] for row in rows)
    return Table(data, colWidths=[width * x for x in proportions], repeatRows=1,
                 hAlign='LEFT', splitByRow=1, splitInRow=1, style=TableStyle([
                     ('GRID', (0, 0), (-1, -1), STYLE['table_grid'], colors.black),
                     ('BACKGROUND', (0, 0), (-1, -1), colors.white),
                     ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                     ('TOPPADDING', (0, 0), (-1, -1), STYLE['table_padding']),
                     ('BOTTOMPADDING', (0, 0), (-1, -1), STYLE['table_padding']),
                     ('LEFTPADDING', (0, 0), (-1, -1), STYLE['table_padding']),
                     ('RIGHTPADDING', (0, 0), (-1, -1), STYLE['table_padding']),
                 ]))


class OriginalImage(Flowable):
    """Clip original image bytes on the canvas without generating edited pixels."""
    def __init__(self, path, width, max_height, crop=None):
        super().__init__()
        self.path = Path(path)
        with Image.open(self.path) as image:
            self.iw, self.ih = image.size
            image.verify()
        self.crop = crop or [0, 0, self.iw, self.ih]
        if len(self.crop) != 4:
            raise ValueError('An image crop requires four coordinates.')
        x0, y0, x1, y1 = self.crop
        if not (0 <= x0 < x1 <= self.iw and 0 <= y0 < y1 <= self.ih):
            raise ValueError(f'Invalid original-image crop: {self.path}')
        if width <= 0 or max_height <= 0:
            raise ValueError('Image dimensions must be positive.')
        self.scale = min(width / (x1 - x0), max_height / (y1 - y0))
        self.width = (x1 - x0) * self.scale
        self.height = (y1 - y0) * self.scale
        self.hAlign = 'CENTER'

    def wrap(self, avail_width, avail_height):
        return self.width, self.height

    def draw(self):
        c = self.canv
        c.saveState()
        clip = c.beginPath()
        clip.rect(0, 0, self.width, self.height)
        c.clipPath(clip, stroke=0, fill=0)
        x0, y0, x1, y1 = self.crop
        c.drawImage(ImageReader(str(self.path)), -x0 * self.scale,
                    -(self.ih - y1) * self.scale, self.iw * self.scale,
                    self.ih * self.scale, mask='auto')
        c.restoreState()


class D1Contents(TableOfContents):
    def __init__(self, styles):
        super().__init__()
        self.styles = styles

    def wrap(self, avail_width, avail_height):
        entries = self._lastEntries or []
        rows = []
        for level, text, page, key in entries:
            p = Paragraph(html.escape(text), self.styles['D1Table'])
            if key:
                p = Paragraph('<link href="#' + key + '" color="#000000">' +
                              html.escape(text) + '</link>', self.styles['D1Table'])
            rows.append([p, Paragraph(str(page), self.styles['D1Table'])])
        data = [[Paragraph('Contents', self.styles['D1TableHead']),
                 Paragraph('Page', self.styles['D1TableHead'])]] + rows
        self._table = Table(data, colWidths=[avail_width * .83, avail_width * .17],
                            repeatRows=1, style=TableStyle([
                                ('GRID', (0, 0), (-1, -1), .65, colors.black),
                                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                                ('TOPPADDING', (0, 0), (-1, -1), 8),
                                ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                                ('LEFTPADDING', (0, 0), (-1, -1), 6),
                                ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                            ]))
        self.width, self.height = self._table.wrap(avail_width, avail_height)
        return self.width, self.height


class Cover(Flowable):
    def __init__(self, spec, width, height, styles):
        super().__init__()
        self.width, self.height = width, height - 1
        self.spec, self.styles = spec, styles

    def draw(self):
        c = self.canv
        c.saveState()
        x, y = c.absolutePosition(0, 0)
        c.translate(-x, -y)
        center = STYLE['page_width'] / 2
        baseline = STYLE['page_height'] - STYLE['cover_title_top'] - 23
        c.setFillColor(colors.black)
        c.setFont('D1InterBold', STYLE['cover_brand_size'])
        c.drawCentredString(center, baseline, normalize(self.spec.get('brand', 'fastTrack')))
        baseline -= 28
        items = [self.spec['title']] + self.spec.get('authors', [])
        items += ['[' + item['label'] + '](' + item['url'] + ')' for item in self.spec.get('links', [])]
        for text in items:
            p = Paragraph(inline(text), self.styles['D1Cover'])
            width, height = p.wrap(self.width, 1000)
            p.drawOn(c, center - width / 2, baseline - height)
            baseline -= height + 3
        c.restoreState()


class D1Document(BaseDocTemplate):
    def __init__(self, filename, title, author=''):
        super().__init__(str(filename), pagesize=(STYLE['page_width'], STYLE['page_height']),
                         leftMargin=STYLE['margin_left'], rightMargin=STYLE['margin_right'],
                         topMargin=STYLE['margin_top'], bottomMargin=STYLE['margin_bottom'],
                         title=title, author=author)
        frame = Frame(self.leftMargin, self.bottomMargin, self.width, self.height,
                      leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
        self.addPageTemplates(PageTemplate(id='D1', frames=frame, onPage=self.footer))

    @staticmethod
    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFillColor(colors.black)
        canvas.setFont('D1Inter', 12)
        canvas.drawRightString(STYLE['page_width'] - STYLE['footer_right'],
                               STYLE['footer_y'], str(doc.page))
        canvas.restoreState()

    def afterFlowable(self, flowable):
        if isinstance(flowable, Paragraph) and hasattr(flowable, 'toc_key'):
            self.canv.bookmarkPage(flowable.toc_key)
            self.canv.addOutlineEntry(flowable.getPlainText(), flowable.toc_key, 0)
            self.notify('TOCEntry', (0, flowable.getPlainText(), self.page, flowable.toc_key))


def prepare(spec, base):
    styles = make_styles()
    width = STYLE['page_width'] - STYLE['margin_left'] - STYLE['margin_right']
    height = STYLE['page_height'] - STYLE['margin_top'] - STYLE['margin_bottom']
    if not isinstance(spec.get('title'), str) or not spec['title'].strip():
        raise ValueError('A non-empty report title is required.')
    sections = spec.get('sections')
    if not isinstance(sections, list) or not sections:
        raise ValueError('At least one ordered report section is required.')
    warnings, story, examined = [], [], []
    if spec.get('cover', True):
        story.extend([Cover(spec, width, height, styles), PageBreak()])
    if spec.get('contents', True):
        story.extend([Paragraph('Contents', styles['D1H1']), D1Contents(styles), PageBreak()])
    for i, section in enumerate(sections):
        if i and section.get('new_page', True):
            story.append(PageBreak())
        title = section['title']
        heading = Paragraph(inline(title), styles['D1H1'])
        heading.toc_key = 'section-' + str(i)
        story.append(heading)
        examined.append(str(title))
        for block in section.get('blocks', []):
            kind = block['type']
            if kind in ('paragraph', 'heading'):
                examined.append(str(block['text']))
                story.append(Paragraph(inline(block['text']), styles['D1Body' if kind == 'paragraph' else 'D1H2']))
            elif kind == 'table':
                examined.extend(str(x) for row in [block['headers']] + block['rows'] for x in row)
                story.extend([make_table(block['headers'], block['rows'], block.get('widths'), width, styles), Spacer(1, 9)])
            elif kind == 'figure':
                path = (base / block['path']).resolve()
                fig_width = block.get('width_pt', width)
                max_height = block.get('max_height_pt', 430)
                if fig_width > width or max_height > height - 80:
                    raise ValueError('Figure width/height leaves insufficient space for its caption.')
                image = OriginalImage(path, fig_width, max_height, block.get('crop'))
                if 72 / image.scale > 160:
                    warnings.append('Inspect small UI text; consider labeled crops: ' + str(path))
                examined.append(str(block['caption']))
                caption = Paragraph(inline(block['caption']), styles['D1Caption'])
                story.extend([KeepTogether([caption, image]), Spacer(1, 10)])
            elif kind == 'code':
                examined.append(str(block['text']))
                if max(map(len, block['text'].splitlines()), default=0) * 5.4 > width:
                    raise ValueError('Code line is too wide; wrap it deliberately or link its source.')
                story.append(Preformatted(block['text'], styles['D1Code']))
            elif kind == 'page_break':
                story.append(PageBreak())
            else:
                raise ValueError('Unsupported content block: ' + str(kind))
    examined += [spec['title'], spec.get('brand', 'fastTrack')] + spec.get('authors', [])
    examined += [x['label'] for x in spec.get('links', [])]
    for item in spec.get('links', []):
        if not re.match(r'^https?://', item['url']):
            raise ValueError('Cover links must be HTTP(S) URLs.')
    if spec.get('cover', True):
        if pdfmetrics.stringWidth(normalize(spec.get('brand', 'fastTrack')), 'D1InterBold', STYLE['cover_brand_size']) > width:
            raise ValueError('Cover brand is too wide for the page.')
        cover_y = STYLE['page_height'] - STYLE['cover_title_top'] - 23 - 28
        cover_items = [spec['title']] + spec.get('authors', [])
        cover_items += [x['label'] for x in spec.get('links', [])]
        for text in cover_items:
            cover_y -= Paragraph(inline(text), styles['D1Cover']).wrap(width, 1000)[1] + 3
        if cover_y < STYLE['margin_bottom']:
            raise ValueError('Cover metadata is too long; move details into the first report section.')
    available = pdfmetrics.getFont('D1Inter').face.charWidths
    missing = sorted({c for text in examined for c in normalize(text) if not c.isspace() and ord(c) not in available})
    if missing:
        raise ValueError('Font lacks source characters: ' + repr(missing))
    for flowable in story:
        if isinstance(flowable, (Paragraph, Table, OriginalImage)):
            w, h = flowable.wrap(width, height)
            if w > width + .1:
                raise ValueError('A flowable exceeds the content width.')
    return story, {'sections': len(sections), 'flowables': len(story),
                   'warnings': warnings, 'font': 'Inter optical size 18',
                   'validation': 'content and layout preflight only', 'pdf_written': False}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--input', type=Path, required=True)
    parser.add_argument('--output', type=Path)
    parser.add_argument('--overwrite', action='store_true')
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument('--check-only', action='store_true')
    mode.add_argument('--build', action='store_true')
    args = parser.parse_args()
    spec = json.loads(args.input.read_text(encoding='utf-8-sig'))
    story, result = prepare(spec, args.input.resolve().parent)
    if args.build:
        if args.output is None or args.output.suffix.lower() != '.pdf':
            parser.error('--build requires a PDF --output path.')
        if args.output.exists() and not args.overwrite:
            parser.error('Output exists; explicit replacement requires --overwrite.')
        if args.output.resolve() == (ASSETS / 'reference.pdf').resolve():
            parser.error('The retained reference cannot be an output.')
        args.output.parent.mkdir(parents=True, exist_ok=True)
        document = D1Document(args.output, spec['title'], '; '.join(spec.get('authors', [])))
        document.multiBuild(story)
        result.update(pdf_written=True, output=str(args.output.resolve()),
                      sha256=hashlib.sha256(args.output.read_bytes()).hexdigest(),
                      validation='generated; render and inspect every page before delivery')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
