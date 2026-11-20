import os, json, time, uuid, urllib.request, urllib.error, http.cookiejar, pathlib, datetime, traceback, sys

BASE = 'https://fasttrack-app-kpx7au3w2a-as.a.run.app'
EXPECTED = '8e637e537cd037d630a5fffc1b5672d1b44371a8'
OUT = pathlib.Path(os.environ['FT_UAT_OUTPUT'])
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'evidence').mkdir(exist_ok=True)
RUN = 'L6-CPMS-' + datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=7))).strftime('%Y%m%d-%H%M%S')
records, checks, ledger, clients = [], [], {'runId': RUN, 'baseUrl': BASE, 'expectedSource': EXPECTED}, {}

def now(): return datetime.datetime.now(datetime.timezone.utc).isoformat()
def save():
    for name, value in [('http-observations.json', records), ('assertions.json', checks), ('fixture-ledger.json', ledger)]:
        (OUT / 'evidence' / name).write_text(json.dumps(value, indent=2, ensure_ascii=True), encoding='utf-8')

def clean(value):
    if isinstance(value, dict):
        return {k: clean(v) for k, v in value.items() if k.lower() not in {'csrftoken', 'password', 'token', 'cookie', 'authorization'}}
    if isinstance(value, list): return [clean(v) for v in value]
    return value

class Client:
    def __init__(self, alias):
        self.alias, self.csrf = alias, None
        self.jar = http.cookiejar.CookieJar()
        self.opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(self.jar))
    def request(self, method, path, payload=None, case='SETUP', label='', expected_status=None, expected_code=None):
        headers = {'Accept': 'application/json', 'Cache-Control': 'no-store'}
        if method != 'GET':
            headers.update({'Origin': BASE, 'X-fastTrack-Request': '1', 'Content-Type': 'application/json'})
            if self.csrf: headers['X-CSRF-Token'] = self.csrf
        req = urllib.request.Request(BASE + path, data=None if payload is None else json.dumps(payload).encode(), headers=headers, method=method)
        started = now()
        try:
            response = self.opener.open(req, timeout=30)
        except urllib.error.HTTPError as e:
            response = e
        body = response.read().decode('utf-8')
        try: body = json.loads(body) if body else None
        except ValueError: body = {'nonJsonPreview': body[:300]}
        safe_input = {'emailAlias': self.alias, 'password': '[OMITTED]'} if path == '/api/auth/login' else clean(payload)
        record = {'evidenceId': f'L6-CPMS-HTTP-{len(records)+1:03}', 'caseId': case, 'actor': self.alias, 'startedUtc': started,
            'finishedUtc': now(), 'method': method, 'path': path, 'action': label, 'input': safe_input,
            'status': response.status, 'cacheControl': response.headers.get('Cache-Control'),
            'body': clean(body), 'testedSource': EXPECTED}
        records.append(record)
        if expected_status is not None:
            code = body.get('error', {}).get('code') if isinstance(body, dict) else None
            check(case, label or f'{method} {path}', response.status == expected_status and (expected_code is None or code == expected_code),
                f'HTTP {expected_status}' + (f' / {expected_code}' if expected_code else ''),
                f'HTTP {response.status}' + (f' / {code}' if code else ''), [record['evidenceId']])
        save()
        return response.status, body, record['evidenceId']
    def login(self, email, case='SETUP'):
        status, body, eid = self.request('POST', '/api/auth/login', {'email': email, 'password': os.environ['FT_UAT_PASSWORD']}, case, 'Authenticate supplied test alias', 200)
        if status != 200: raise RuntimeError(f'Cannot authenticate {self.alias}')
        self.csrf = body['data']['csrfToken']
        return body['data']['user']
    def logout(self, case='CLEANUP'):
        result = self.request('POST', '/api/auth/logout', {}, case, 'Sign out temporary API session', 204)
        self.csrf = None
        return result

def check(case, action, passed, expected, actual, evidence=None):
    checks.append({'assertionId': f'L6-CPMS-A-{len(checks)+1:03}', 'caseId': case, 'action': action,
        'status': 'PASS' if passed else 'FAIL', 'expected': expected, 'actual': actual,
        'timeUtc': now(), 'evidence': evidence or []})
    save()
    print(json.dumps({'case': case, 'action': action, 'status': 'PASS' if passed else 'FAIL'}), flush=True)

def data(client, path, case, label):
    s, b, e = client.request('GET', path, case=case, label=label, expected_status=200)
    if s != 200: raise RuntimeError(f'Precondition failed: {label}, HTTP {s}')
    return b['data'], e

def milestone(title, description, due, case):
    s, b, e = clients['SA'].request('POST', f"/api/teams/{ledger['teamId']}/milestones", {'title': title, 'description': description, 'dueAt': due}, case, 'Create synthetic milestone', 201)
    if s != 201: raise RuntimeError('Synthetic milestone creation failed')
    return b['data'], e

try:
    anon = Client('ANONYMOUS')
    for path in ['/api/health', '/api/ready']:
        s, b, e = anon.request('GET', path, case='READINESS', label='Read serving source and readiness', expected_status=200)
        check('READINESS', 'Selected source matches public service', b.get('version') == EXPECTED, EXPECTED, str(b.get('version')), [e])
        if b.get('version') != EXPECTED: raise RuntimeError('Serving source differs from selected baseline')
    ledger['startedUtc'] = now()
    for alias, email, role in [('SA','supervisor.a@fasttrack.local','supervisor'), ('A1','student.a1@fasttrack.local','student'),
                              ('A2','student.a2@fasttrack.local','student'), ('SB','supervisor.b@fasttrack.local','supervisor'), ('B1','student.b1@fasttrack.local','student')]:
        client = clients[alias] = Client(alias)
        user = client.login(email)
        check('SETUP', f'{alias} supplied role', user['role'] == role, role, user['role'])
    sa, a1, a2, sb, b1 = [clients[a] for a in ['SA','A1','A2','SB','B1']]
    teams, _ = data(sa, '/api/teams', 'UAT-01', 'Supervisor assigned teams')
    student_teams, _ = data(a1, '/api/teams', 'UAT-01', 'Student assigned teams')
    common = [t for t in teams if t['id'] in {x['id'] for x in student_teams}]
    if len(common) != 1: raise RuntimeError('Cannot identify one shared Team A')
    ledger['teamId'] = common[0]['id']
    team_path = f"/api/teams/{ledger['teamId']}"
    due = datetime.datetime.now(datetime.timezone.utc).replace(second=0, microsecond=0) + datetime.timedelta(minutes=6)
    late, _ = milestone(RUN+'-DEADLINE', 'Synthetic independent UAT late-submission rejection.', due.isoformat(), 'UAT-04')
    ledger['deadlineMilestone'] = late
    ledger['deadlineNotBeforeUtc'] = (due + datetime.timedelta(seconds=60)).isoformat()
    future = (datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=2)).isoformat(timespec='milliseconds')
    normal, e = milestone(RUN+'-NORMAL', 'Synthetic independent UAT normal journey.', future, 'UAT-01')
    ledger['normalMilestone'] = normal
    mid = normal['id']
    mpath = f'/api/milestones/{mid}'
    read, e2 = data(a1, mpath, 'UAT-01', 'Student rereads newly created milestone')
    check('UAT-01', 'Student sees persisted milestone fields', all(read.get(k)==normal.get(k) for k in ['id','teamId','title','description','dueAt']), 'Same saved ID/team/title/description/deadline', 'All fields match' if read == normal else 'Compared canonical fields', [e,e2])
    listed, e = data(sa, team_path+'/milestones', 'UAT-01', 'Reread saved milestone list')
    check('UAT-01', 'NORMAL milestone appears exactly once', sum(t['id']==mid for t in listed)==1, 'Exactly one run-specific NORMAL', str(sum(t['id']==mid for t in listed)), [e])
    work = {'title':RUN+'-WORK', 'description':'Synthetic Sprint 1 UAT submission.', 'url':'https://example.com/?run='+RUN}
    s,b,e = a1.request('POST', mpath+'/submissions', work, 'UAT-02','Student submits work before deadline',201)
    if s != 201: raise RuntimeError('Normal submission setup failed')
    saved = ledger['normalSubmission'] = b['data']
    sid, spath = saved['id'], '/api/submissions/'+saved['id']
    reread,e2 = data(a1, spath, 'UAT-02','Student reloads saved work')
    check('UAT-02','Version-1 saved content persists', reread == saved and saved['version']==1 and all(saved[k]==v for k,v in work.items()), 'Same persisted version 1 and work fields', 'Canonical DTO equality: '+str(reread == saved), [e,e2])
    initial,_ = data(a1, spath+'/feedback','UAT-02','Initial feedback count')
    ledger['initialFeedbackCount'] = len(initial)
    messages = [RUN+': Please explain the test evidence.', RUN+': Add the acceptance result.']
    for msg in messages:
        sa.request('POST', spath+'/feedback', {'content': msg, 'clientRequestId':str(uuid.uuid4())},'UAT-02','Supervisor appends feedback',201)
    feedback,e = data(sa, spath+'/feedback','UAT-02','Supervisor reloads exact-version feedback')
    feedback_student,e2 = data(a1, spath+'/feedback','UAT-02','Student reads the same feedback')
    check('UAT-02','Two messages appended once in order for exact saved version', feedback==feedback_student and [f['content'] for f in feedback]==messages and all(f['submissionId']==sid for f in feedback), 'Two distinct ordered messages bound to same submission ID', 'Matching lists: '+str(feedback==feedback_student)+'; count='+str(len(feedback)),[e,e2])
    ledger['normalFeedback'] = feedback
    for actor in [a1,a2]:
        actor.request('POST',mpath+'/submissions',work,'UAT-03',f'{actor.alias} duplicate first submission rejected',409,'ALREADY_SUBMITTED')
    work_after,e=data(a1,mpath+'/submissions','UAT-03','Read work after duplicate attempts')
    check('UAT-03','Duplicate attempts preserve one unchanged saved work', work_after==[saved], 'One unchanged version-1 work', 'Count='+str(len(work_after))+'; unchanged='+str(work_after==[saved]),[e])
    for actor in [sb,b1]:
        for path in [team_path,team_path+'/milestones',mpath,mpath+'/submissions',spath,spath+'/feedback']:
            actor.request('GET',path,case='UAT-05',label=f'{actor.alias} foreign resource denial',expected_status=404,expected_code='NOT_FOUND')
        foreign_teams,e=data(actor,'/api/teams','UAT-05',f'{actor.alias} own team list')
        check('UAT-05',f'{actor.alias} list hides Team A', all(t['id']!=ledger['teamId'] for t in foreign_teams),'No Team A in foreign list','Team A absent: '+str(all(t['id']!=ledger['teamId'] for t in foreign_teams)),[e])
    protected_after,e=data(sa,spath,'UAT-05','Authorized control after foreign reads')
    protected_feedback,e2=data(sa,spath+'/feedback','UAT-05','Authorized feedback control after foreign reads')
    check('UAT-05','Foreign requests preserve protected work and feedback',protected_after==saved and protected_feedback==feedback,'Original work/feedback unchanged','Canonical snapshots unchanged: '+str(protected_after==saved and protected_feedback==feedback),[e,e2])
    validation,_=milestone(RUN+'-VALIDATION','Synthetic invalid-input rejection.',future,'UAT-06')
    ledger['validationMilestone']=validation
    before,_=data(sa,team_path+'/milestones','UAT-06','Count milestones before denied writes')
    a1.request('POST',team_path+'/milestones',{'title':RUN+'-FORBIDDEN','description':'Synthetic denied student write.','dueAt':future},'UAT-06','Student cannot create milestones',403,'FORBIDDEN')
    sa.request('POST',team_path+'/milestones',{'title':'   ','description':'Synthetic invalid title.','dueAt':future},'UAT-06','Whitespace-only milestone rejected',400)
    after,e=data(sa,team_path+'/milestones','UAT-06','Count milestones after denied writes')
    check('UAT-06','Denied milestone writes do not alter saved list',before==after,'Unchanged authorized milestone list','Unchanged: '+str(before==after),[e])
    vpath='/api/milestones/'+validation['id']+'/submissions'
    for body,label in [({**work,'title':'   '},'Whitespace-only submission title rejected'),({**work,'url':'ftp://example.com/work'},'Non-HTTP work link rejected')]:
        a1.request('POST',vpath,body,'UAT-06',label,400)
    empty,e=data(a1,vpath,'UAT-06','Read submissions after input rejection')
    check('UAT-06','Invalid submissions create no work',empty==[],'Empty submission list',str(empty),[e])
    sa.request('POST',spath+'/feedback',{'content':'   ','clientRequestId':str(uuid.uuid4())},'UAT-06','Whitespace-only feedback rejected',400)
    a1.request('POST',spath+'/feedback',{'content':RUN+': forbidden student feedback.','clientRequestId':str(uuid.uuid4())},'UAT-06','Student cannot write supervisor feedback',403,'FORBIDDEN')
    unchanged,e=data(sa,spath+'/feedback','UAT-06','Read feedback after rejected writes')
    check('UAT-06','Rejected feedback does not append/change existing messages',unchanged==feedback,'Original two messages unchanged','Unchanged: '+str(unchanged==feedback),[e])
    anon.request('GET',spath,case='UAT-07',label='Anonymous private read rejected',expected_status=401)
    anon.request('POST','/api/auth/login',{'email':'student.a1@fasttrack.local','password':'Clearly-incorrect-synthetic-value'},'UAT-07','Single wrong-password attempt rejected',401)
    anon.request('GET','/api/auth/me',case='UAT-07',label='Failed sign-in creates no usable session',expected_status=401)
    old_cookie='; '.join(f'{c.name}={c.value}' for c in a1.jar)
    a1.logout('UAT-07')
    a1.request('GET',spath,case='UAT-07',label='Signed-out private read rejected',expected_status=401)
    replay=Client('REVOKED_SESSION')
    replay.opener.addheaders=[('Cookie',old_cookie)]
    replay.request('GET',spath,case='UAT-07',label='Revoked session replay rejected',expected_status=401)
    old_cookie=None
    a1.login('supervisor.b@fasttrack.local','UAT-07')
    a1.request('GET',spath,case='UAT-07',label='Same cookie jar switched to SB cannot read Team A',expected_status=404,expected_code='NOT_FOUND')
    a1.logout('UAT-07')
    a1.login('student.a1@fasttrack.local','UAT-08')
    persisted,e=data(a1,spath,'UAT-08','Student rereads work after logout and relogin')
    persisted_feedback,e2=data(a1,spath+'/feedback','UAT-08','Student rereads exact-version feedback after relogin')
    other_student,e3=data(a2,spath,'UAT-08','Second team student reads shared saved work')
    supervisor,e4=data(sa,spath,'UAT-08','Supervisor independently rereads saved work')
    check('UAT-08','Work and feedback survive new session and role reads',persisted==saved==other_student==supervisor and persisted_feedback==feedback,'Identical saved ID/content/version/author/time and feedback','All canonical snapshots unchanged: '+str(persisted==saved==other_student==supervisor and persisted_feedback==feedback),[e,e2,e3,e4])
    ledger['apiMainChecksCompletedUtc']=now()
    save()
    print(json.dumps({'phase':'WAITING_FOR_DEADLINE','runId':RUN,'deadlineNotBeforeUtc':ledger['deadlineNotBeforeUtc'],'output':str(OUT)}),flush=True)
    while datetime.datetime.now(datetime.timezone.utc) < due+datetime.timedelta(seconds=60):
        time.sleep(10)
    latepath='/api/milestones/'+late['id']
    s,late_detail,e=a1.request('GET',latepath,case='UAT-04',label='Fresh server clock after deadline',expected_status=200)
    server_time=datetime.datetime.fromisoformat(late_detail['meta']['serverTime'].replace('Z','+00:00'))
    actual_due=datetime.datetime.fromisoformat(late_detail['data']['dueAt'].replace('Z','+00:00'))
    check('UAT-04','Fresh server time is beyond saved deadline plus 60 seconds',server_time>=actual_due+datetime.timedelta(seconds=60),'Server time >= dueAt + 60 seconds',str(server_time)+' >= '+str(actual_due+datetime.timedelta(seconds=60)),[e])
    if server_time<=actual_due: raise RuntimeError('Server deadline precondition not satisfied')
    a1.request('POST',latepath+'/submissions',{**work,'title':RUN+'-LATE'},'UAT-04','Late first submission rejected',409,'DEADLINE_PASSED')
    late_saved,e=data(a1,latepath+'/submissions','UAT-04','Authorized read after late rejection')
    check('UAT-04','Late rejection creates no work',late_saved==[],'Empty saved work list',str(late_saved),[e])
    for path in ['/api/health','/api/ready']:
        s,b,e=anon.request('GET',path,case='READINESS',label='End-of-run serving source check',expected_status=200)
        check('READINESS','Serving source unchanged at completion',b.get('version')==EXPECTED,EXPECTED,str(b.get('version')),[e])
    ledger['completedUtc']=now()
except Exception as error:
    ledger['runnerError']={'type':type(error).__name__,'message':str(error),'timeUtc':now()}
    print(json.dumps({'phase':'ERROR','type':type(error).__name__,'message':str(error)}),flush=True)
finally:
    for alias,client in clients.items():
        try: client.logout()
        except Exception as error: ledger.setdefault('cleanupErrors',[]).append({'alias':alias,'type':type(error).__name__})
    ledger['apiSessionCleanupUtc']=now()
    ledger['assertionTotals']={s:sum(c['status']==s for c in checks) for s in ['PASS','FAIL']}
    save()
    print(json.dumps({'phase':'FINISHED','totals':ledger['assertionTotals'],'output':str(OUT)}),flush=True)
    if 'runnerError' in ledger or ledger['assertionTotals']['FAIL']: sys.exit(1)
