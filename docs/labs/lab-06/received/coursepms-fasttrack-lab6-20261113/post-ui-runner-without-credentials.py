import os,json,pathlib,urllib.request,urllib.error,http.cookiejar,datetime
root=pathlib.Path(os.environ['TEMP'])/'coursepms-fasttrack-lab6-20261113'
base='https://fasttrack-app-kpx7au3w2a-as.a.run.app'
ledger=json.loads((root/'evidence/fixture-ledger.json').read_text())
jar=http.cookiejar.CookieJar()
opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(jar))
observations=[]
csrf=None
def request(method,path,payload=None):
    headers={'Accept':'application/json','Origin':base,'X-fastTrack-Request':'1','Content-Type':'application/json'}
    if csrf:headers['X-CSRF-Token']=csrf
    req=urllib.request.Request(base+path,headers=headers,method=method,data=json.dumps(payload).encode() if payload is not None else None)
    try:r=opener.open(req,timeout=30)
    except urllib.error.HTTPError as e:r=e
    raw=r.read()
    return r.status,json.loads(raw) if raw else None
def check(action,passed,status,body=None):
    observations.append({'id':'POST-UI-'+str(len(observations)+1).zfill(2),'action':action,'timeUtc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'status':'PASS' if passed else 'FAIL','httpStatus':status,'body':body})
try:
    s,b=request('GET','/api/health');check('Serving source still matches selected source',s==200 and b.get('version')==ledger['expectedSource'],s,b)
    s,b=request('POST','/api/auth/login',{'email':'supervisor.a@fasttrack.local','password':os.environ['FT_UAT_PASSWORD']});check('Authenticate supervisor control session',s==200,s,{'role':b.get('data',{}).get('user',{}).get('role')})
    csrf=b['data']['csrfToken']
    s,b=request('GET','/api/milestones/'+ledger['validationMilestone']['id']+'/submissions');check('UI invalid-title and FTP-link attempts created no work',s==200 and b.get('data')==[],s,b)
    s,b=request('GET','/api/submissions/'+ledger['normalSubmission']['id']);check('Saved normal work unchanged after browser checks',s==200 and b.get('data')==ledger['normalSubmission'],s,b)
    s,b=request('GET','/api/submissions/'+ledger['normalSubmission']['id']+'/feedback');check('UI blank-feedback rejection preserves the original two messages',s==200 and b.get('data')==ledger['normalFeedback'],s,b)
    s,b=request('GET','/api/milestones/'+ledger['deadlineMilestone']['id']+'/submissions');check('Late milestone remains without work',s==200 and b.get('data')==[],s,b)
finally:
    if csrf:
        s,b=request('POST','/api/auth/logout',{});check('Control API session signed out',s==204,s)
    result={'source':ledger['expectedSource'],'operator':'Codex AI','observations':observations,'totals':{k:sum(r['status']==k for r in observations) for k in ['PASS','FAIL']}}
    (root/'evidence/post-ui-state-controls.json').write_text(json.dumps(result,indent=2),encoding='utf-8')
    print(json.dumps(result['totals']))
