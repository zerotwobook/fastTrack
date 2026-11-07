"""Verify the refreshed D1 artifact against real source and execution evidence."""
from pathlib import Path
import hashlib
import json
import re
import subprocess
from datetime import datetime, timezone
from urllib.parse import unquote

import pymupdf as fitz
from PIL import Image, ImageDraw
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
PDF = ROOT / 'output/pdf/fastTrack_D1_review_candidate.pdf'
RENDERS = ROOT / 'tmp/pdfs/d1-refresh'


def read_json(path):
    return json.loads(path.read_text(encoding='utf-8-sig'))


def digest(data):
    return hashlib.sha256(data).hexdigest()


def git_blob(ref, path):
    return subprocess.check_output(['git', 'show', f'{ref}:{path}'], cwd=ROOT)


def verify():
    manifest = read_json(HERE / 'source_manifest.json')
    page_map = read_json(HERE / 'page_map.json')
    report = (HERE / 'report.md').read_text(encoding='utf-8')
    checks = {}

    def check(name, condition):
        checks[name] = 'PASSED' if condition else 'FAILED'

    historical = manifest['sourceHashes']
    check('historicalSourceHashes', all(digest(git_blob(manifest['sourceHashBase'], name)) == expected for name, expected in historical.items()))
    current = manifest['currentSourceHashes']
    check('currentEvidenceHashes', all(digest((ROOT / name).read_bytes() if name.endswith('.png') else (ROOT / name).read_bytes().replace(b'\r\n', b'\n')) == expected for name, expected in current.items()))
    runtime = ['Project_code/client', 'Project_code/server', 'Project_code/shared', 'Project_code/package.json', 'Project_code/package-lock.json', 'Project_code/prisma.config.ts']
    unchanged = subprocess.run(['git', 'diff', '--quiet', manifest['applicationSource'], '--', *runtime], cwd=ROOT).returncode == 0
    check('runtimeAndDomainTestTreeUnchanged', unchanged)

    links = re.findall(r'!?\[[^\]]*\]\(([^)]+)\)', report)
    local_links = [unquote(link.split('#')[0]) for link in links if not re.match(r'https?://', link)]
    check('localLinks', all((HERE / target).resolve().exists() for target in local_links))
    for label, count in [('FR', 10), ('BR', 10), ('NFR', 6)]:
        check(label + 'Coverage', all(f'{label}-{number:02}' in report for number in range(1, count + 1)))
    acs = [f'AC-{feature:02}.{number}' for feature, count in [(1, 5), (2, 3), (3, 6), (4, 4)] for number in range(1, count + 1)]
    check('featureAcceptanceCoverage', all(ac in report for ac in acs))
    check('extensionCoverage', all(f'S1-AC-EXT-{i:02}' in report for i in range(1, 6)))
    check('plannedTestSpecifications', all(re.search(r'\| T-' + f'{i:02}' + r'(?: local)? /', report) for i in list(range(1, 28)) + [31]))

    system = read_json(ROOT / manifest['currentVerification']['runner'])
    groups = [system[name] for name in ['ordinaryTests', 'g1Tests', 'authTests', 'b01Tests', 'a02Tests', 'b02Tests', 'j03Tests']]
    cases = [case for group in groups for case in group['cases']]
    check('current340Cases', system['passed'] and len(cases) == 340 and all(case['status'] == 'passed' for case in cases))
    check('currentBuildAndTypecheck', all(stage['passed'] for stage in system['stages']))
    check('ownedCleanup', system['cleanup'] == 'removed newly created audit container')
    check('migrationScenarios', system['upgrades']['passed'])
    names = {case['name'] for case in cases}
    selected = list(manifest['selectedPrintedEvidence'].values())
    check('printedCurrentCaseNames', all(item['name'] in names for item in selected if 'name' in item))
    for item in read_json(ROOT / 'Project_code/docs/evidence/R1-J03-excerpts.json'):
        excerpt = (ROOT / item['path']).read_text(encoding='utf-8').replace('\r\n', '\n').strip()
        source = git_blob(item['sourceCommit'], item['source']).decode().replace('\r\n', '\n')
        lines = '\n'.join(source.splitlines()[item['startLine'] - 1:item['endLine']]).strip()
        check('sourceIdenticalExcerpt-' + Path(item['path']).stem, excerpt == lines and excerpt in report)
    browser = read_json(ROOT / manifest['currentVerification']['browser'])
    check('current108RoleLayouts', [item['role'] for item in browser['matrices']] == ['student', 'supervisor'] and all(len(item['layoutChecks']) == 54 for item in browser['matrices']))
    check('currentBrowserJourneys', browser['negativeJourneys']['forbiddenStatus'] == 404 and all(browser[key]['passed'] for key in ['journey', 'negativeJourneys', 'feedbackOrdering', 'feedbackIntent', 'privateDrafts', 'readStates']))

    before = digest(PDF.read_bytes())
    subprocess.run(['python', str(HERE / 'build_report.py')], cwd=ROOT, check=True, capture_output=True)
    check('deterministicRebuild', before == digest(PDF.read_bytes()))
    reader = PdfReader(str(PDF))
    doc = fitz.open(PDF)
    text = '\n'.join(page.get_text() for page in doc)
    check('pagesAndBookmarks', len(doc) == page_map['pages'] and len(reader.outline) == 6)
    check('partPageStarts', all(f'Part {key}' in doc[start - 1].get_text() for key, (start, end) in page_map['parts'].items()))
    check('currentApplicationIdentity', manifest['applicationSource'] in text and f'candidate {manifest["applicationSource"][:7]}' in doc[1].get_text())
    check('noUnrenderedDirectives', not any(item in text for item in ['[NAVIGATION]', '[DIAGRAM:', 'Building']))
    check('EnglishRefreshedReport', not re.search(r'[\u0e00-\u0e7f]', report))
    check('noLiveCredentials', not re.search(r'(?:ReleaseReview|UiReview)-[a-f0-9]{20,}|postgres(?:ql)?://[^\s]+@', report))
    findings = []
    for number, page in enumerate(doc, 1):
        for block in page.get_text('dict')['blocks']:
            for line in block.get('lines', []):
                for span in line['spans']:
                    x0, y0, x1, y1 = span['bbox']
                    if x0 < 29 or x1 > page.rect.width - 29 or y0 < 9 or y1 > page.rect.height - 9:
                        findings.append({'page': number, 'text': span['text'], 'bounds': span['bbox']})
    check('textBounds', not findings)
    visual_file = HERE / 'visual_review.json'
    visual = read_json(visual_file) if visual_file.exists() else {}
    visual_matches = visual.get('pdfSha256') == digest(PDF.read_bytes()) and visual.get('status') == 'PASSED'
    check('recordedVisualInspection', visual_matches)

    RENDERS.mkdir(parents=True, exist_ok=True)
    pages = []
    for number, page in enumerate(doc, 1):
        pix = page.get_pixmap(matrix=fitz.Matrix(1.3, 1.3), alpha=False)
        target = RENDERS / f'page-{number:02}.png'
        pix.save(target)
        pages.append(target)
    for index in range(0, len(pages), 2):
        sheet = Image.new('RGB', (1600, 1160), '#dddddd')
        draw = ImageDraw.Draw(sheet)
        for offset, target in enumerate(pages[index:index + 2]):
            image = Image.open(target)
            image.thumbnail((770, 1090))
            sheet.paste(image, (15 + offset * 800, 35))
            draw.text((15 + offset * 800, 10), f'Page {index + offset + 1}', fill='black')
        sheet.save(RENDERS / f'sheet-{index // 2 + 1:02}.png')
    result = {
        'recordedAt': datetime.now(timezone.utc).isoformat(), 'applicationSource': manifest['applicationSource'],
        'pdfSha256': digest(PDF.read_bytes()), 'pages': len(doc), 'parts': page_map['parts'],
        'checks': checks, 'counts': {'historicalSources': len(historical), 'currentEvidenceSources': len(current), 'localLinks': len(local_links), 'featureAcs': len(acs), 'automatedCases': len(cases), 'roleViewportCombinations': 108},
        'textBoundsFindings': findings,
        'visualInspection': {**visual, 'status': 'PASSED' if visual_matches else 'PENDING', 'renderDirectory': RENDERS.relative_to(ROOT).as_posix(), 'pagesRendered': len(doc), 'sheets': (len(doc) + 1) // 2},
        'acceptance': 'B refreshed-PDF review / user main authorization / G5 / main / tag / submission PENDING',
        'passed': all(value == 'PASSED' for value in checks.values()),
    }
    (HERE / 'qa_checks.json').write_text(json.dumps(result, indent=2) + '\n', encoding='utf-8')
    print(json.dumps({'passed': result['passed'], 'pages': len(doc), 'failedChecks': [name for name, value in checks.items() if value == 'FAILED'], 'textBoundsFindings': len(findings), 'sheets': (len(doc) + 1) // 2}))
    return result['passed']


if __name__ == '__main__':
    raise SystemExit(0 if verify() else 1)
