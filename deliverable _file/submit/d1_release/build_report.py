"""Build the combined D1 review candidate; application code is unchanged."""
from pathlib import Path
from urllib.parse import unquote, urljoin
import re, json, math, html, textwrap, hashlib
from reportlab.platypus import BaseDocTemplate, PageTemplate, Frame, Paragraph, Spacer, PageBreak, LongTable, TableStyle, Flowable, KeepTogether
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader
from PIL import Image as PILImage, ImageChops
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[3]
HERE = Path(__file__).resolve().parent
OUTPUT = ROOT / 'output/pdf/fastTrack_D1_review_candidate.pdf'
MANIFEST = json.loads((HERE / 'source_manifest.json').read_text(encoding='utf-8-sig'))
APPLICATION_SOURCE = MANIFEST['applicationSource']
DOCUMENT_REF = MANIFEST.get('documentRef', APPLICATION_SOURCE)
PAGE_W, PAGE_H = 595.276, 841.89
LEFT, RIGHT, TOP, BOTTOM = 49, 49, 50, 47
WIDTH = PAGE_W-LEFT-RIGHT
FONTDIR=Path('C:/Windows/Fonts')
for name,file in [('Body','calibri.ttf'),('BodyBold','calibrib.ttf'),('BodyItalic','calibrii.ttf'),('Mono','consola.ttf')]:
    pdfmetrics.registerFont(TTFont(name,str(FONTDIR/file)))
pdfmetrics.registerFontFamily('Body',normal='Body',bold='BodyBold',italic='BodyItalic',boldItalic='BodyBold')
styles={
 'body':ParagraphStyle('body',fontName='Body',fontSize=10.2,leading=14,spaceAfter=7,splitLongWords=True),
 'small':ParagraphStyle('small',fontName='Body',fontSize=9,leading=12,spaceAfter=6,splitLongWords=True),
 'title':ParagraphStyle('title',fontName='BodyBold',fontSize=29,leading=33,spaceAfter=19),
 'part':ParagraphStyle('part',fontName='BodyBold',fontSize=22,leading=27,spaceAfter=18,keepWithNext=True),
 'h2':ParagraphStyle('h2',fontName='BodyBold',fontSize=14,leading=18,spaceBefore=13,spaceAfter=8,keepWithNext=True),
 'h3':ParagraphStyle('h3',fontName='BodyBold',fontSize=11.5,leading=15,spaceBefore=10,spaceAfter=6,keepWithNext=True),
 'cell':ParagraphStyle('cell',fontName='Body',fontSize=8.6,leading=11,splitLongWords=True),
 'th':ParagraphStyle('th',fontName='BodyBold',fontSize=8.8,leading=11.3,splitLongWords=True),
 'code':ParagraphStyle('code',fontName='Mono',fontSize=8.2,leading=10.4,spaceAfter=1,splitLongWords=True),
}
def inline(s):
    s=html.escape(s,quote=False).replace('&lt;br/&gt;','<br/>').replace('&lt;br /&gt;','<br/>')
    def link(m):
        target=html.unescape(m.group(2))
        if not re.match(r'https?://',target):
            target='https://github.com/zerotwobook/fastTrack/blob/'+DOCUMENT_REF+'/'+str((HERE/unquote(target)).resolve().relative_to(ROOT)).replace('\\','/').replace(' ','%20')
        return '<link href="'+html.escape(target,quote=True)+'" color="#222222"><u>'+m.group(1)+'</u></link>'
    s=re.sub(r'\[([^\]]+)\]\(([^)]+)\)',link,s)
    s=re.sub(r'`([^`]+)`',lambda m:'<font name="Mono" size="8.5">'+m.group(1)+'</font>',s)
    s=re.sub(r'\*\*(.+?)\*\*',r'<b>\1</b>',s)
    s=re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)',r'<i>\1</i>',s)
    return s

def P(s,style='body'):
    p=Paragraph(inline(s),styles[style])
    if s.rstrip().endswith(':') and style in ['body','small']:p.keepWithNext=True
    return p

def table(rows,widths=None):
    n=max(map(len,rows));rows=[r+['']*(n-len(r)) for r in rows]
    if widths is None:
        head=' '.join(rows[0]).lower()
        if n==3 and 'cases passed' in head:widths=[WIDTH*x for x in [.32,.12,.56]]
        elif n==3 and 'required behavior' in head:widths=[WIDTH*x for x in [.21,.24,.55]]
        elif n==3 and 'actual file and reported' in head:widths=[WIDTH*x for x in [.20,.67,.13]]
        elif n==3 and 'live issue state' in head:widths=[WIDTH*x for x in [.47,.13,.40]]
        elif n==3 and 'shared behavior' in head:widths=[WIDTH*x for x in [.20,.35,.45]]
        elif n==3 and 'error code' in head:widths=[WIDTH*x for x in [.12,.30,.58]]
        elif n==4 and 'architectural responsibility' in head:widths=[WIDTH*x for x in [.18,.18,.20,.44]]
        elif n==4 and 'baseline result' in head:widths=[WIDTH*x for x in [.20,.32,.31,.17]]
        elif n==4 and 'preconditions' in head:widths=[WIDTH*x for x in [.17,.12,.30,.41]]
        elif n==4 and 'relevant failures' in head:widths=[WIDTH*x for x in [.24,.31,.18,.27]]
        elif n==4 and 'sprint' in head and 'completion' in head:widths=[WIDTH*x for x in [.08,.33,.25,.34]]
        elif n==5 and 'passed' in head and 'failed' in head:widths=[WIDTH*x for x in [.24,.27,.07,.07,.35]]
        elif n==3 and 'requirement' in head:widths=[WIDTH*x for x in [.15,.27,.58]]
        elif n==3 and 'observable required behavior' in head:widths=[WIDTH*x for x in [.12,.63,.25]]
        elif n==3 and 'target and practical' in head:widths=[WIDTH*x for x in [.12,.67,.21]]
        elif n==2:widths=[WIDTH*.30,WIDTH*.70]
        elif n==3:widths=[WIDTH*.20,WIDTH*.57,WIDTH*.23]
        elif n==4:widths=[WIDTH*.17,WIDTH*.17,WIDTH*.29,WIDTH*.37]
        elif n==5:widths=[WIDTH*.14,WIDTH*.19,WIDTH*.17,WIDTH*.21,WIDTH*.29]
        elif n==6:widths=[WIDTH*x for x in [.23,.08,.13,.13,.12,.31]]
        else:widths=[WIDTH/n]*n
    data=[[P(v,'th' if i==0 else 'cell') for v in row] for i,row in enumerate(rows)]
    t=LongTable(data,colWidths=widths,repeatRows=1,hAlign='LEFT',splitByRow=True)
    t.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),colors.HexColor('#EEEEEE')),('LINEBELOW',(0,0),(-1,0),.8,colors.black),('LINEBELOW',(0,1),(-1,-1),.3,colors.HexColor('#CCCCCC')),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),6),('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),6),('BOTTOMPADDING',(0,0),(-1,-1),6)]))
    return t

class Diagram(Flowable):
    def __init__(self,kind):Flowable.__init__(self);self.kind=kind;self.width=WIDTH;self.height=140 if kind=='architecture' else 275
    def draw(self):
        c=self.canv
        def box(x,y,w,h,title,lines):
            c.setStrokeColor(colors.HexColor('#777777'));c.setFillColor(colors.HexColor('#FAFAFA'));c.roundRect(x,y,w,h,4,stroke=1,fill=1);c.setFillColor(colors.black);c.setFont('BodyBold',10);c.drawString(x+8,y+h-16,title);c.setFont('Body',8.5)
            for i,line in enumerate(lines):c.drawString(x+8,y+h-31-i*11,line)
        def arrow(a,b):
            c.setStrokeColor(colors.black);c.setLineWidth(.6);c.line(*a,*b);dx,dy=b[0]-a[0],b[1]-a[1];ang=math.atan2(dy,dx);l=5
            for offset in [-.45,.45]:c.line(*b,b[0]-l*math.cos(ang+offset),b[1]-l*math.sin(ang+offset))
        if self.kind=='architecture':
            labels=[('React client',['Vite 8.3.6','same-origin /api']),('Express API',['real sessions','role/source/CSRF']),('Domain services',['scope / rules','transaction locks']),('Prisma 7.10.1',['PG adapter','typed queries']),('PostgreSQL',['16.8 verified','durable history'])]
            w=(WIDTH-48)/5
            for i,(title,lines) in enumerate(labels):box(i*(w+12),45,w,75,title,lines)
            for i in range(4):arrow((i*(w+12)+w,82),((i+1)*(w+12),82))
            c.setFont('Body',9);c.drawString(0,15,'Shared pure ESM validation is imported by both browser and server; DB scope is authoritative.')
        else:
            w=(WIDTH-32)/3;h=62
            nodes={'users':(0,200),'sessions':(w+16,200),'teams':(0,106),'members':(w+16,106),'milestones':(2*(w+16),106),'submissions':(w+16,12),'feedback':(2*(w+16),12)}
            lines={'users':['role / identity','student_id unique'],'sessions':['user_id -> users','token hash / expiry'],'teams':['supervisor_id -> users','one-to-many assignment'],'members':['team + student PK','student unique'],'milestones':['team_id -> teams','dueAt / cancellation'],'submissions':['milestone + version unique','author / accepted time'],'feedback':['exact submission FK','supervisor + key unique']}
            for name,(x,y) in nodes.items():box(x,y,w,h,name,lines[name])
            for a,b in [('users','sessions'),('users','teams'),('users','members'),('teams','members'),('teams','milestones'),('milestones','submissions'),('submissions','feedback')]:
                x,y=nodes[a];xx,yy=nodes[b]
                if a=='teams' and b=='milestones':
                    c.setStrokeColor(colors.black);c.line(x+w/2,y+h,x+w/2,y+h+15);c.line(x+w/2,y+h+15,xx+w/2,yy+h+15);arrow((xx+w/2,yy+h+15),(xx+w/2,yy+h))
                elif yy==y:arrow((x+w,y+h/2),(xx,yy+h/2))
                else:arrow((x+w/2,y),(xx+w/2,yy+h))
            # Team ownership of milestones is conveyed by the explicit FK table; avoid implying members own milestones.
            c.setFont('BodyItalic',8);c.drawString(0,0,'Foreign keys and physical constraints are specified in the following table; no inferred UI authority.')

class Crop(Flowable):
    def __init__(self,path,box,scale):
        Flowable.__init__(self);self.path=path;self.box=box;self.scale=scale;self.width=(box[2]-box[0])*scale;self.height=(box[3]-box[1])*scale
    def draw(self):
        c=self.canv;x0,y0,x1,y1=self.box;w,h=PILImage.open(self.path).size;s=self.scale
        c.saveState();clip=c.beginPath();clip.rect(0,0,self.width,self.height);c.clipPath(clip,stroke=0,fill=0);c.drawImage(str(self.path),-x0*s,-(h-y1)*s,width=w*s,height=h*s,mask='auto');c.restoreState()

class Doc(BaseDocTemplate):
    def __init__(self,target,total=0):
        super().__init__(str(target),pagesize=(PAGE_W,PAGE_H),leftMargin=LEFT,rightMargin=RIGHT,topMargin=TOP,bottomMargin=BOTTOM,title='fastTrack - Deliverable 1 review candidate',author='Supapanya Yathip and Atip Infa-udom',allowSplitting=True)
        self.partPages={};self.total=total;frame=Frame(LEFT,BOTTOM,WIDTH,PAGE_H-TOP-BOTTOM,id='normal',leftPadding=0,rightPadding=0,topPadding=0,bottomPadding=0)
        self.addPageTemplates(PageTemplate(id='normal',frames=frame,onPage=self.header))
    def header(self,c,doc):
        c.saveState();c.setFont('Body',8.5);c.setFillColor(colors.HexColor('#555555'))
        if doc.page>1:c.drawString(LEFT,PAGE_H-28,'fastTrack  /  Deliverable 1  /  candidate '+APPLICATION_SOURCE[:7])
        c.setStrokeColor(colors.HexColor('#CCCCCC'));c.line(LEFT,36,PAGE_W-RIGHT,36)
        c.drawString(LEFT,23,'REVIEW CANDIDATE - G5 / MAIN / SUBMISSION PENDING')
        c.drawRightString(PAGE_W-RIGHT,23,str(doc.page)+((' / '+str(self.total)) if self.total else ''));c.restoreState()
    def afterFlowable(self,f):
        if hasattr(f,'partKey'):
            self.partPages[f.partKey]=self.page;self.canv.bookmarkPage(f.partKey);self.canv.addOutlineEntry(f.getPlainText(),f.partKey,0,False)

def codeflow(text):
    # Actual source strings are unchanged; only display lines are wrapped for legibility.
    content=[]
    for line in text.splitlines():
        chunks=textwrap.wrap(line,width=92,expand_tabs=False,replace_whitespace=False,drop_whitespace=False,subsequent_indent='    ') or ['']
        for chunk in chunks:content.append(Paragraph(html.escape(chunk).replace(' ','&#160;'),styles['code']))
    return content+[Spacer(1,8)]

def figure(title,body,img):
    target=(HERE/unquote(img)).resolve();w,h=PILImage.open(target).size
    cap=' '.join(x.strip().removeprefix('- ') for x in body if x.strip() and not x.startswith('!['))
    if w>1000:
        views=[((0,0,w,h),min(WIDTH/w,300/h),'Full original capture'),((224,0,1015,h),.58,'Work detail - PDF layout crop from the same original PNG'),((1015,0,w,h),.59,'Feedback / identity detail - PDF layout crop from the same original PNG')]
    else:
        scale=min(.66,WIDTH/w)
        original=PILImage.open(target).convert('RGB');bounds=ImageChops.difference(original,PILImage.new('RGB',original.size,'white')).getbbox()
        h=min(h,(bounds[3]+14) if bounds else h);total=h*scale
        if total<=550:views=[((0,0,w,h),scale,'Original capture - trailing white space omitted by PDF layout crop')]
        else:
            count=math.ceil(total/470);step=math.ceil(h/count);views=[((0,i*step,w,min((i+1)*step,h)),scale,'Original capture, vertical page segment '+str(i+1)+' of '+str(count)) for i in range(count)]
    result=[]
    for i,(box,scale,label) in enumerate(views):
        result.extend([PageBreak(),P(title+(' (continued)' if i else ''),'h3')])
        if i==0:result.append(P(cap,'small'))
        result.extend([P(label+'. Source image bytes are unchanged.','small'),Crop(target,box,scale)])
    return result

def story(ranges):
    lines=(HERE/'report.md').read_text(encoding='utf-8').splitlines();out=[];i=0
    while i<len(lines):
        line=lines[i].strip()
        if not line:i+=1;continue
        if line=='[NAVIGATION]':
            out.append(P('Navigation - complete Parts A-F','h2'));rows=[['Part / IDs','Pages','Content']]
            for k,ids,title in [('A','FR-01-10 / BR-01-10 / NFR-01-06','SRS, actors, scope and decisions'),('B','F-01-F-08','Inventory and whole-product traceability'),('C','Architecture / data / access','System SDS, configuration and delivery plan'),('D','Sprints 1-3','Goals, dependencies and allocation'),('E','F-01-F-04 / AC / STS','Feature contracts, planned tests and DoD'),('F','Results / evidence / history','Actual cases, figures, excerpts, reviews and limits')]:
                value=ranges.get(k);rows.append([k+' / '+ids,(str(value[0])+'-'+str(value[1])) if value else 'Building',title])
            out.append(table(rows,[WIDTH*.42,WIDTH*.12,WIDTH*.46]));i+=1;continue
        if line.startswith('[DIAGRAM:'):
            out.extend([Diagram(line[9:-1]),Spacer(1,10)]);i+=1;continue
        if line.startswith('# Part '):
            out.append(PageBreak());p=P(line[2:],'part');p.partKey=line[7];out.append(p);i+=1;continue
        if line.startswith('# '):out.extend([Spacer(1,30),P(line[2:],'title')]);i+=1;continue
        if line.startswith('### Figure'):
            j=i+1
            while j<len(lines) and not lines[j].startswith('##'):j+=1
            chunk=lines[i+1:j];image=next((re.match(r'!\[[^\]]*\]\(([^)]+)\)',x.strip()) for x in chunk if x.strip().startswith('![')),None)
            if image:out.extend(figure(line[4:],chunk,image.group(1)));i=j;continue
        if line.startswith('### '):out.append(P(line[4:],'h3'));i+=1;continue
        if line.startswith('## '):out.append(P(line[3:],'h2'));i+=1;continue
        if line.startswith('```'):
            j=i+1
            while j<len(lines) and not lines[j].strip().startswith('```'):j+=1
            items=codeflow('\n'.join(lines[i+1:j]));out.extend([KeepTogether(items)] if len(items)<=28 else items);i=j+1;continue
        if line.startswith('|'):
            rows=[];j=i
            while j<len(lines) and lines[j].strip().startswith('|'):
                raw=lines[j].strip().strip('|');cells=[x.strip().replace('\\|','|') for x in re.split(r'(?<!\\)\|',raw)]
                if not all(re.match(r'^:?-+:?$',x.replace(' ','')) for x in cells):rows.append(cells)
                j+=1
            out.extend([table(rows),Spacer(1,10)]);i=j;continue
        if line=='---':out.append(Spacer(1,7));i+=1;continue
        if line.startswith('!['):
            m=re.match(r'!\[([^\]]+)\]\(([^)]+)\)',line);out.extend(figure(m.group(1),[],m.group(2)));i+=1;continue
        if line.startswith('- '):out.append(P('- '+line[2:]));i+=1;continue
        if re.match(r'^\d+\. ',line):out.append(P(line));i+=1;continue
        block=[line];j=i+1
        while j<len(lines) and lines[j].strip() and not re.match(r'^(#|\||```|!\[|\[DIAGRAM|\[NAVIGATION|---$|- |\d+\. )',lines[j].strip()):block.append(lines[j].strip());j+=1
        out.append(P(' '.join(block)));i=j
    return out

def make_canvas(*args,**kwargs):
    kwargs["invariant"]=1
    return canvas.Canvas(*args,**kwargs)

def build():
    OUTPUT.parent.mkdir(parents=True,exist_ok=True);ranges={};total=0
    for iteration in range(4):
        d=Doc(OUTPUT,total);d.build(story(ranges),canvasmaker=make_canvas);total_pages=len(PdfReader(str(OUTPUT)).pages)
        keys=list('ABCDEF');new={k:[d.partPages[k],d.partPages[keys[n+1]]-1 if n<5 else total_pages] for n,k in enumerate(keys)}
        if new==ranges and total==total_pages:break
        ranges,total=new,total_pages
    else:raise RuntimeError('Navigation did not stabilize')
    summary={'pdf':OUTPUT.relative_to(ROOT).as_posix(),'pages':total,'parts':ranges,'sha256':hashlib.sha256(OUTPUT.read_bytes()).hexdigest(),'status':'Review candidate; B PDF review/G5/main pending','rendering':'ReportLab; original PNGs drawn unedited, with explicitly labeled PDF layout crops/segments for legibility.'}
    (HERE/'page_map.json').write_text(json.dumps(summary,indent=2)+'\n',encoding='utf-8');print(json.dumps(summary))
if __name__=='__main__':build()
