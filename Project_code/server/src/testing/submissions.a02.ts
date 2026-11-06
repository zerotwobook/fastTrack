import { afterAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { randomUUID } from 'node:crypto';
import { fork } from 'node:child_process';
import type { ChildProcess } from 'node:child_process';
import { Prisma } from '../db/generated/client/index.js';
import request from 'supertest';
import { createApp } from '../app.js';
import { loadConfig } from '../config.js';
import { createApplicationRouters } from '../modules/index.js';
import { SubmissionService, isRolledBackContention, isSubmissionUniqueConflict, requireSubmissionAccess } from '../modules/submissions/service.js';
import { createSubmissionRouter } from '../modules/submissions/router.js';
import { createBaseFixtures, createTestPrisma, cleanTestDatabase, TEST_PASSWORD } from './fixtures.js';

const prisma = createTestPrisma();
const origin = 'http://127.0.0.1:5173';
const config = loadConfig({ NODE_ENV: 'test', DATABASE_URL: process.env['TEST_DATABASE_URL'], APP_ORIGIN: origin });
const app = () => createApp(config, { logger: () => undefined, routers: createApplicationRouters({ prisma, config }) });
const body = () => ({ title: 'Engineering baseline', description: 'SRS and system design ready for review.', url: 'https://example.edu/team-a/work?version=1#design' });
let fixtures: Awaited<ReturnType<typeof createBaseFixtures>>;
let student: { cookie: string; csrf: string };

async function login(email: string) {
  const result = await request(app()).post('/api/auth/login').set('Origin', origin).set('X-fastTrack-Request', '1')
    .send({ email, password: TEST_PASSWORD }).expect(200);
  return { cookie: String(result.headers['set-cookie']?.[0]).split(';')[0]!, csrf: String(result.body.data.csrfToken) };
}
const post = (value: unknown, id = fixtures.milestones.milestoneFuture.id, actor = student) => request(app())
  .post(`/api/milestones/${id}/submissions`).set('Cookie', actor.cookie).set('Origin', origin).set('X-CSRF-Token', actor.csrf)
  .set('Content-Type', 'application/json').send(JSON.stringify(value));

beforeEach(async () => { fixtures = await createBaseFixtures(prisma); student = await login('stu-a1@test.local'); });
afterAll(async () => { await cleanTestDatabase(prisma); await prisma.$disconnect(); });

describe('F-03 first-submission deadline TDD and persistence', () => {
  it.each([-1, 0, 1])('T-10/T-12/T-26 uses exact acceptedAt offset %i ms and persists that same instant', async offset => {
    const milestone = fixtures.milestones.milestoneExact;
    const acceptedAt = new Date(milestone.dueAt.getTime() + offset);
    let calls = 0;
    const service = new SubmissionService(prisma, async () => { calls++; return acceptedAt; });
    const actor = { userId: fixtures.users.stuA1.id, role: 'student' as const };
    if (offset > 0) {
      await expect(service.submit(milestone.id, body(), actor)).rejects.toMatchObject({ status: 409, code: 'DEADLINE_PASSED' });
      expect(await prisma.submission.count()).toBe(0);
    } else {
      const saved = await service.submit(milestone.id, body(), actor);
      const row = await prisma.submission.findUniqueOrThrow({ where: { id: saved.id } });
      expect(saved.submittedAt).toBe(acceptedAt.toISOString());
      expect(row.submittedAt.getTime()).toBe(acceptedAt.getTime());
      expect(row.submittedById).toBe(actor.userId);
      expect(row.version).toBe(1);
    }
    expect(calls).toBe(1);
  });

  it('T-11 rejects a first submission after the actual database deadline without writing', async () => {
    const id = fixtures.milestones.milestoneFuture.id;
    await prisma.milestone.update({ where: { id }, data: { dueAt: new Date(Date.now() - 1000) } });
    const result = await post(body(), id).expect(409);
    expect(result.body.error.code).toBe('DEADLINE_PASSED');
    expect(await prisma.submission.count()).toBe(0);
  });

  it('T-09/T-16 creates version 1 and reads the exact saved DTO after app recreation', async () => {
    const created = await post(body()).expect(201);
    expect(created.body.data.submittedBy).toEqual({ id: fixtures.users.stuA1.id, displayName: 'Student A1' });
    expect(created.body.data.version).toBe(1);
    const detail = await request(app()).get(`/api/submissions/${created.body.data.id}`).set('Cookie', student.cookie).expect(200);
    const list = await request(app()).get(`/api/milestones/${created.body.data.milestoneId}/submissions`).set('Cookie', student.cookie).expect(200);
    expect(detail.body.data).toEqual(created.body.data);
    expect(list.body.data).toEqual([detail.body.data]);
    expect(detail.headers['cache-control']).toBe('no-store');
    expect(Date.parse(detail.body.meta.serverTime)).not.toBeNaN();
    expect(Object.keys(detail.body.data).sort()).toEqual(['id','milestoneId','submittedBy','version','title','description','url','submittedAt'].sort());
  });

  it('T-13/T-26 preserves the first submission and duplicate precedence after the deadline', async () => {
    const created = await post(body()).expect(201);
    await prisma.milestone.update({ where: { id: created.body.data.milestoneId }, data: { dueAt: new Date(Date.now() - 1000) } });
    const duplicate = await post({ ...body(), title: 'Second attempt' }).expect(409);
    expect(duplicate.body.error.code).toBe('ALREADY_SUBMITTED');
    expect(await prisma.submission.count()).toBe(1);
    expect((await prisma.submission.findUniqueOrThrow({ where: { id: created.body.data.id } })).title).toBe(body().title);
  });

  it('T-13 serializes two different students to one immutable version 1', async () => {
    const teammate = await login('stu-a2@test.local');
    const results = await Promise.all([post(body()), post({ ...body(), title: 'Teammate work' }, undefined, teammate)]);
    expect(results.map(r => r.status).sort()).toEqual([201,409]);
    expect(results.find(r => r.status === 409)!.body.error.code).toBe('ALREADY_SUBMITTED');
    const rows = await prisma.submission.findMany();
    expect(rows).toHaveLength(1);
    expect(rows[0]!.version).toBe(1);
    expect(results.find(r => r.status === 201)!.body.data.id).toBe(rows[0]!.id);
  });
});

describe('F-03 authorization, validation and immutable submission contracts', () => {
  it('requires every router guard and forbids a production clock injection', () => {
    expect(() => createSubmissionRouter({ prisma } as never)).toThrow();
    vi.stubEnv('NODE_ENV', 'production');
    try { expect(() => new SubmissionService(prisma, async () => new Date())).toThrow('restricted'); }
    finally { vi.unstubAllEnvs(); }
  });

  it('T-14 checks session, role and source/CSRF before parsing JSON; rejects unsupported content types', async () => {
    const path = `/api/milestones/${fixtures.milestones.milestoneFuture.id}/submissions`;
    await request(app()).post(path).set('X-User-Id', fixtures.users.stuA1.id).set('Content-Type','application/json').send('{bad').expect(401);
    const supervisor = await login('sup-a@test.local');
    await request(app()).post(path).set('Cookie',supervisor.cookie).set('Content-Type','application/json').send('{bad').expect(403);
    await request(app()).post(path).set('Cookie',student.cookie).set('Origin',origin).set('Content-Type','application/json').send('{bad').expect(403);
    await request(app()).post(path).set('Cookie',student.cookie).set('Origin','https://foreign.example').set('X-CSRF-Token',student.csrf).send(body()).expect(403);
    await request(app()).post(path).set('Cookie',student.cookie).set('Origin',origin).set('X-CSRF-Token',student.csrf).type('form').send(body()).expect(415);
    await request(app()).post(path).set('Cookie',student.cookie).set('Origin',origin).set('X-CSRF-Token',student.csrf).set('Content-Type','application/json').send('{bad').expect(400);
    expect(await prisma.submission.count()).toBe(0);
  });

  const invalid = [null, [], {}, { title: 123 }, { description: false }, { title: ' ' }, { description: '' },
    { title: 't'.repeat(121) }, { description: 'd'.repeat(4001) }, { url: 'u'.repeat(2049) },
    { url: 'javascript:alert(1)' }, { url: 'https://u:p@example.edu/work' }, { url: '//example.edu/work' },
    { submittedBy: 'forged' }, { submittedById: 'forged' }, { teamId: 'forged' }, { role: 'student' }, { version: 1 },
    { submittedAt: '2030-01-01T00:00:00.1234Z' }, { acceptedAt: '2030-01-01T00:00:00Z' }, { title: '\ud800' }, { description: 'bad\u0000value' }];
  it.each(invalid.map((value,index) => [index,value] as const))('T-15 rejects invalid/forged payload case %i without partial writes', async (_index,value) => {
    const input = value && !Array.isArray(value) && typeof value==='object' && Object.keys(value).length ? { ...body(), ...value } : value;
    const result = await post(input).expect(400);
    expect(result.body.error.code).toBe('INVALID_INPUT');
    expect(await prisma.submission.count()).toBe(0);
  });

  it('T-15 accepts exact Unicode/title/description/URL maxima and trims persisted values', async () => {
    const prefix = 'https://example.edu/';
    const input = { title: '\u{1f680}'.repeat(120), description: 'd'.repeat(4000), url: prefix+'x'.repeat(2048-prefix.length) };
    const result = await post({ title: ` ${input.title} `, description: ` ${input.description} `, url: ` ${input.url} ` }).expect(201);
    expect(result.body.data).toMatchObject(input);
    expect(await prisma.submission.count()).toBe(1);
  });

  it('T-14 denies foreign/absent milestone writes equally and checks input before scope', async () => {
    const foreign = await post(body(),fixtures.milestones.milestoneBTeam.id).expect(404);
    const absent = await post(body(),randomUUID()).expect(404);
    expect(foreign.body).toEqual(absent.body);
    await post({ ...body(), title: false },fixtures.milestones.milestoneBTeam.id).expect(400);
    await post(body(),'invalid-id').expect(400);
    expect(await prisma.submission.count()).toBe(0);
  });

  it('T-14/T-25 permits teammate/supervisor reads and conceals foreign/missing list and detail identically', async () => {
    const created = await post(body()).expect(201);
    for (const email of ['stu-a2@test.local','sup-a@test.local']) {
      const actor = await login(email);
      const detail = await request(app()).get(`/api/submissions/${created.body.data.id}`).set('Cookie',actor.cookie).expect(200);
      expect(detail.body.data).toEqual(created.body.data);
    }
    for (const email of ['stu-b1@test.local','sup-b@test.local']) {
      const actor = await login(email);
      for (const [foreignPath,missingPath] of [
        [`/api/submissions/${created.body.data.id}`,`/api/submissions/${randomUUID()}`],
        [`/api/milestones/${created.body.data.milestoneId}/submissions`,`/api/milestones/${randomUUID()}/submissions`],
      ]) {
        const foreign = await request(app()).get(foreignPath!).set('Cookie',actor.cookie).expect(404);
        const missing = await request(app()).get(missingPath!).set('Cookie',actor.cookie).expect(404);
        expect(foreign.body).toEqual(missing.body);
        expect(JSON.stringify(foreign.body)).not.toContain(body().title);
      }
    }
  });

  it('T-14 protects anonymous reads and disallows update/delete of saved work', async () => {
    const created = await post(body()).expect(201);
    await request(app()).get(`/api/submissions/${created.body.data.id}`).expect(401);
    await request(app()).get(`/api/milestones/${created.body.data.milestoneId}/submissions`).expect(401);
    for (const method of ['patch','delete'] as const) await request(app())[method](`/api/submissions/${created.body.data.id}`)
      .set('Cookie',student.cookie).set('Origin',origin).set('X-CSRF-Token',student.csrf).send({title:'Changed'}).expect(404);
    expect((await prisma.submission.findUniqueOrThrow({where:{id:created.body.data.id}})).title).toBe(body().title);
  });

  it('enforces cancellation before duplicate and deadline without changing saved history', async () => {
    const created = await post(body()).expect(201);
    await prisma.milestone.update({where:{id:created.body.data.milestoneId},data:{cancelledAt:new Date(),dueAt:new Date(Date.now()-1000)}});
    const rejected = await post(body()).expect(409);
    expect(rejected.body.error.code).toBe('MILESTONE_CANCELLED');
    expect(await prisma.submission.count()).toBe(1);
  });

  it('T-12 uses equivalent offset instants and stores the once-read millisecond boundary', async () => {
    const instant = new Date('2030-11-08T23:59:00.123+07:00');
    for (const id of [fixtures.milestones.milestonePast.id,fixtures.milestones.milestoneExact.id]) {
      await prisma.milestone.update({where:{id},data:{dueAt:new Date('2030-11-08T16:59:00.123Z')}});
      const result = await new SubmissionService(prisma,async () => instant).submit(id,body(),{userId:fixtures.users.stuA1.id,role:'student'});
      expect(result.submittedAt).toBe('2030-11-08T16:59:00.123Z');
    }
  });

  it('T-26 ignores a client test-clock header and rejects clock/precision body fields', async () => {
    const id=fixtures.milestones.milestoneFuture.id;
    await prisma.milestone.update({where:{id},data:{dueAt:new Date(Date.now()-1000)}});
    const rejected=await post(body(),id).set('X-Test-Clock','2000-01-01T00:00:00Z').expect(409);
    expect(rejected.body.error.code).toBe('DEADLINE_PASSED');
    expect(await prisma.submission.count()).toBe(0);
  });

  it('exports a transaction-bound scoped submission helper for B without foreign identifiers', async () => {
    const created=await post(body()).expect(201);
    const auth={userId:fixtures.users.supA.id,role:'supervisor' as const};
    const scope=await prisma.$transaction(tx => requireSubmissionAccess(tx,auth,created.body.data.id));
    expect(scope).toEqual({id:created.body.data.id,milestoneId:created.body.data.milestoneId,teamId:fixtures.teams.teamA.id});
    await expect(requireSubmissionAccess(prisma,{userId:fixtures.users.supB.id,role:'supervisor'},created.body.data.id)).rejects.toMatchObject({status:404});
  });
});

async function waitForLock() {
  for (let count=0;count<100;count++) {
    const rows=await prisma.$queryRaw<{count:number}[]>`SELECT count(*)::int AS count FROM pg_stat_activity WHERE datname=current_database() AND wait_event_type='Lock'`;
    if (rows[0]!.count) return;
    await new Promise(resolve => setTimeout(resolve,20));
  }
  throw new Error('The submission did not reach the expected row-lock barrier.');
}

describe('F-03 real lock barriers and bounded technical recovery', () => {
  it('T-16/T-31 creates through compiled HTTP and retains the exact submission/session after an actual process restart', async () => {
    let child: ChildProcess | undefined;
    const start = async () => {
      child = fork(new URL('../../../scripts/serve-submission-restart.mjs',import.meta.url),[],{
        env:{...process.env,NODE_ENV:'test',RESTART_PROTECTED_DATABASE_URL:process.env['DATABASE_URL']!,DATABASE_URL:process.env['TEST_DATABASE_URL']!},
        stdio:['ignore','ignore','ignore','ipc'],windowsHide:true,
      });
      const running=child;
      return new Promise<string>((resolve,reject)=>{
        const timer=setTimeout(()=>reject(new Error('Compiled restart app did not become ready.')),8000);
        running.once('error',error=>{clearTimeout(timer);reject(error);});
        running.once('exit',code=>{clearTimeout(timer);reject(new Error(`Compiled restart app exited before ready (${code}).`));});
        running.once('message',message=>{
          const data=message as {type:string;url:string};clearTimeout(timer);
          if(data.type==='ready')resolve(data.url);else reject(new Error('Unexpected restart IPC message.'));
        });
      });
    };
    const stop=async () => {
      if(!child||child.exitCode!==null)return;
      const running=child;
      await new Promise<void>((resolve,reject)=>{
        const timer=setTimeout(()=>{running.kill();reject(new Error('Compiled restart app did not stop.'));},7000);
        running.once('exit',code=>{clearTimeout(timer);code===0?resolve():reject(new Error('Compiled app shutdown failed.'));});
        running.send('stop');
      });
    };
    try {
      let url=await start();
      const auth=await fetch(`${url}/api/auth/login`,{method:'POST',headers:{Origin:url,'Content-Type':'application/json','X-fastTrack-Request':'1'},
        body:JSON.stringify({email:'stu-a1@test.local',password:TEST_PASSWORD})});
      expect(auth.status).toBe(200);
      const cookie=auth.headers.get('set-cookie')!.split(';')[0]!;
      const csrf=(await auth.json() as {data:{csrfToken:string}}).data.csrfToken;
      const created=await fetch(`${url}/api/milestones/${fixtures.milestones.milestoneFuture.id}/submissions`,{
        method:'POST',headers:{Cookie:cookie,Origin:url,'Content-Type':'application/json','X-CSRF-Token':csrf},body:JSON.stringify(body())});
      expect(created.status).toBe(201);
      const saved=(await created.json() as {data:{id:string}}).data;
      await stop();url=await start();
      const detail=await fetch(`${url}/api/submissions/${saved.id}`,{headers:{Cookie:cookie}});
      expect(detail.status).toBe(200);
      expect((await detail.json() as {data:unknown}).data).toEqual(saved);
      expect((await fetch(`${url}/api/auth/me`,{headers:{Cookie:cookie}})).status).toBe(200);
      expect(await prisma.submission.count()).toBe(1);
      expect((await fetch(`${url}/submissions/${saved.id}`)).status).toBe(200);
    } finally {await stop();}
  });

  it.each(['team','milestone'] as const)('T-26 rejects a real DB-clock deadline crossed while waiting for the %s lock', async kind => {
    const id=fixtures.milestones.milestoneFuture.id;
    const clock=await prisma.$queryRaw<{now:Date}[]>`SELECT clock_timestamp() AS now`;
    const dueAt=new Date(clock[0]!.now.getTime()+1000);
    await prisma.milestone.update({where:{id},data:{dueAt}});
    let release!:()=>void;let acquired!:()=>void;
    const gate=new Promise<void>(resolve => {release=resolve;});const held=new Promise<void>(resolve => {acquired=resolve;});
    const blocker=prisma.$transaction(async tx => {
      if(kind==='team') await tx.$queryRaw`SELECT id FROM teams WHERE id=${fixtures.teams.teamA.id}::uuid FOR UPDATE`;
      else await tx.$queryRaw`SELECT id FROM milestones WHERE id=${id}::uuid FOR UPDATE`;
      acquired();await gate;
    },{timeout:10000});
    await held;
    const pending=post(body(),id).then(result => result);
    try {
      await waitForLock();
      let crossed=false;
      for(let count=0;count<150;count++) {
        const now=await prisma.$queryRaw<{now:Date}[]>`SELECT date_trunc('milliseconds',clock_timestamp()) AS now`;
        if(now[0]!.now.getTime()>dueAt.getTime()){crossed=true;break;}
        await new Promise(resolve => setTimeout(resolve,20));
      }
      expect(crossed).toBe(true);
    } finally {release();await blocker;}
    const result=await pending;
    expect(result.status).toBe(409);expect(result.body.error.code).toBe('DEADLINE_PASSED');
    expect(await prisma.submission.count()).toBe(0);
  });

  it('rechecks membership after the team lock instead of trusting its initial scope query', async () => {
    let release!:()=>void;let acquired!:()=>void;
    const gate=new Promise<void>(resolve => {release=resolve;});const held=new Promise<void>(resolve => {acquired=resolve;});
    const blocker=prisma.$transaction(async tx => {
      await tx.$queryRaw`SELECT id FROM teams WHERE id=${fixtures.teams.teamA.id}::uuid FOR UPDATE`;
      acquired();await gate;
      await tx.teamMember.delete({where:{teamId_studentId:{teamId:fixtures.teams.teamA.id,studentId:fixtures.users.stuA1.id}}});
    },{timeout:10000});
    await held;
    const pending=post(body()).then(result => result);
    try {await waitForLock();}finally{release();await blocker;}
    const result=await pending;expect(result.status).toBe(404);expect(await prisma.submission.count()).toBe(0);
  });

  it('retries confirmed rolled-back contention with fresh transactions and one final stored timestamp', async () => {
    let calls=0;const accepted=new Date(fixtures.milestones.milestoneFuture.dueAt.getTime()-1);
    const service=new SubmissionService(prisma,async () => {
      if(++calls<3)throw new Prisma.PrismaClientKnownRequestError('Synthetic confirmed rollback',{code:'P2034',clientVersion:'7.10.1'});
      return accepted;
    });
    const saved=await service.submit(fixtures.milestones.milestoneFuture.id,body(),{userId:fixtures.users.stuA1.id,role:'student'});
    expect(calls).toBe(3);expect(saved.submittedAt).toBe(accepted.toISOString());expect(await prisma.submission.count()).toBe(1);
  });

  it.each(['P2034','P2028','UNKNOWN'])('bounds or avoids retries for technical condition %s without exposing details',async code => {
    let calls=0;
    const service=new SubmissionService(prisma,async () => {
      calls++;
      if(code==='UNKNOWN')throw new Error('Private SQL details');
      throw new Prisma.PrismaClientKnownRequestError('Private SQL details',{code,clientVersion:'7.10.1'});
    });
    await expect(service.submit(fixtures.milestones.milestoneFuture.id,body(),{userId:fixtures.users.stuA1.id,role:'student'}))
      .rejects.toMatchObject({status:503,code:'TEMPORARILY_UNAVAILABLE'});
    expect(calls).toBe(code==='P2034'?3:1);expect(await prisma.submission.count()).toBe(0);
  });

  it('recognizes the actual pinned-driver unique conflict and excludes another unique constraint',async () => {
    const created=await post(body()).expect(201);
    const stored=await prisma.submission.findUniqueOrThrow({where:{id:created.body.data.id}});
    const {id:_id,...data}=stored;
    try {await prisma.submission.create({data});throw new Error('Expected a real unique conflict.');}
    catch(error){expect(isSubmissionUniqueConflict(error)).toBe(true);expect(isRolledBackContention(error)).toBe(false);}
    try {await prisma.submission.create({data:{...data,id:stored.id,milestoneId:fixtures.milestones.milestoneExact.id}});throw new Error('Expected a real primary-key conflict.');}
    catch(error){expect(isSubmissionUniqueConflict(error)).toBe(false);}
    expect(await prisma.submission.count()).toBe(1);
  });
});
