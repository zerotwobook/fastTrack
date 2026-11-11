import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Only newly created containers/network and explicit temporary credential files are removed.
const arguments_ = process.argv.slice(2);
if (arguments_.some(value => value !== '--socket') || arguments_.length > 1) throw new Error('Use verify-container.mjs [--socket].');
const socketMode = arguments_.includes('--socket');
const appRoot = fileURLToPath(new URL('../', import.meta.url));
const repo = fileURLToPath(new URL('../../', import.meta.url));
const temp = mkdtempSync(join(tmpdir(), 'fasttrack-a01-container-'));
const clone = join(temp, 'clean-clone');
const suffix = randomBytes(5).toString('hex');
const password = randomBytes(24).toString('hex');
const demoPassword = randomBytes(24).toString('hex');
const wrongPassword = randomBytes(24).toString('hex');
const secrets = [password, demoPassword, wrongPassword];
const network = `fasttrack-a01-${suffix}`;
const dbName = `${network}-db`;
const socketVolume = `${network}-socket`;
const socketDirectory = '/cloudsql/fasttrack-socket-check:asia-southeast1:test-db';
const clientSocketMounts = socketMode ? ['--mount', `type=volume,source=${socketVolume},target=${socketDirectory},readonly`] : [];
const webImage = `${network}-web:check`;
const jobsImage = `${network}-jobs:check`;
const containers = [];
const files = [];
const report = { startedAt: new Date().toISOString(), checks: [], cleanup: [],
  transport: socketMode ? 'unix-socket' : 'tcp',
  scope: 'local clean-clone container verification; no Cloud SQL proxy, cloud IAM or public TLS claim' };
let networkCreated = false;
let socketVolumeCreated = false;
const redact = value => secrets.reduce((text, secret) => text.replaceAll(secret, '[redacted]'), String(value ?? ''))
  .replace(/postgres(?:ql)?:\/\/[^\s'"<>]+/g, '[database URL]');
function run(bin, args, cwd = repo) {
  const result = spawnSync(bin, args, { cwd, encoding: 'utf8', windowsHide: true, timeout: 600_000 });
  if (result.status !== 0) throw new Error(redact(`${bin} ${args[0]} failed: ${result.stderr || result.stdout || result.error?.message}`));
  return result.stdout.trim();
}
function check(name, work) {
  const value = work(); report.checks.push({ name, passed: true }); process.stdout.write(`PASS ${name}\n`); return value;
}
function envFile(name, entries) {
  const path = join(temp, name); files.push(path);
  writeFileSync(path, Object.entries(entries).map(([key, value]) => `${key}=${value}`).join('\n') + '\n', { mode: 0o600 });
  return path;
}
function start(args) {
  const id = run('docker', ['run', '--detach', '--network', network, ...args]);
  if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('Unexpected new container identity.');
  containers.push(id); return id;
}
const inspect = id => JSON.parse(run('docker', ['inspect', id]))[0];
async function waitReady(url) {
  for (let i = 0; i < 80; i++) {
    try { if ((await fetch(`${url}/api/ready`, { signal: AbortSignal.timeout(4000) })).status === 200) return; } catch { /* Wait for this new container only. */ }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  throw new Error('New local web container did not become ready.');
}
function sql(query) { return run('docker', ['exec', dbName, 'psql', '-U', 'a01_admin', '-d', 'fasttrack_a01_test', '-tAc', query]); }
const fingerprint = () => sql(`SELECT md5(concat(
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM users t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM sessions t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM teams t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY team_id,student_id) FROM team_members t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM milestones t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM submissions t),
  (SELECT string_agg(row_to_json(t)::text, '' ORDER BY id) FROM feedback t)))`);

try {
  const dirty = run('git', ['status', '--porcelain', '--', 'Project_code', ':(exclude)Project_code/docs/evidence/**']);
  if (dirty) throw new Error('Commit application/script changes before clean-clone verification.');
  report.sourceCommit = run('git', ['rev-parse', 'HEAD']);
  check('fresh clone has the exact committed source', () => {
    run('git', ['clone', '--quiet', '--no-hardlinks', '--no-checkout', repo, clone]);
    run('git', ['checkout', '--quiet', '--detach', report.sourceCommit], clone);
    if (run('git', ['rev-parse', 'HEAD'], clone) !== report.sourceCommit) throw new Error('Clean clone source mismatch.');
    if (run('git', ['status', '--porcelain'], clone)) throw new Error('Clean clone is dirty.');
  });
  const context = join(clone, 'Project_code');
  for (const [target, image] of [['runner', webImage], ['jobs', jobsImage]]) {
    check(`clean ${target} image build`, () => run('docker', ['build', '--target', target,
      '--build-arg', `RELEASE_SHA=${report.sourceCommit}`, '--tag', image, '.'], context));
  }
  report.images = {};
  for (const [name, image] of [['web', webImage], ['jobs', jobsImage]]) {
    const meta = JSON.parse(run('docker', ['image', 'inspect', image]))[0];
    report.images[name] = { id: meta.Id, sourceCommit: meta.Config.Labels['org.opencontainers.image.revision'], user: meta.Config.User };
    if (meta.Config.User !== 'node' || report.images[name].sourceCommit !== report.sourceCommit) throw new Error('Image user/source mismatch.');
    const history = run('docker', ['history', '--no-trunc', image]);
    if (secrets.some(secret => history.includes(secret))) throw new Error('Private verification secret appears in image history.');
  }
  check('final runner has runtime modules, no env files and no test fixtures', () => {
    run('docker', ['run', '--rm', '--entrypoint', 'node', webImage, '-e',
      "const f=require('node:fs'); for(const p of ['shared/milestones.mjs','shared/submissions.mjs','shared/feedback.mjs','server/dist/db/generated/client/index.js','client/dist/index.html'])if(!f.existsSync(p))process.exit(1); for(const p of ['server/.env','.env','server/dist/testing'])if(f.existsSync(p))process.exit(2); if(process.getuid()===0)process.exit(3)"]);
  });
  check('compiled maintenance requires explicit confirmation before any DB access', () => {
    const denied = spawnSync('docker', ['run', '--rm', '--entrypoint', 'node', webImage,
      'server/dist/operations/cleanup-rate-limits.js'], { encoding: 'utf8', windowsHide: true });
    if (denied.status !== 1 || !denied.stderr.includes('maintenance failed')) throw new Error('Maintenance confirmation guard failed.');
  });
  check('production image rejects an HTTP origin before startup', () => {
    const denied = spawnSync('docker', ['run', '--rm', '--env', 'APP_ORIGIN=http://localhost:8080',
      '--entrypoint', 'node', webImage, 'server/dist/index.js'], { encoding: 'utf8', windowsHide: true });
    if (denied.status !== 1 || !denied.stderr.includes('Server startup failed')) throw new Error('Production origin guard failed.');
  });
  run('docker', ['network', 'create', network]); networkCreated = true;
  if (socketMode) {
    check('new socket volume has this verification identity only', () => {
      const existing = run('docker', ['volume', 'ls', '--format', '{{.Name}}']).split('\n');
      if (existing.includes(socketVolume)) throw new Error('Refusing to reuse an existing socket volume.');
      if (run('docker', ['volume', 'create', '--label', `io.fasttrack.verification=${suffix}`, socketVolume]) !== socketVolume) {
        throw new Error('Unexpected new socket volume identity.');
      }
      const volume = JSON.parse(run('docker', ['volume', 'inspect', socketVolume]))[0];
      if (volume.Labels?.['io.fasttrack.verification'] !== suffix) throw new Error('Socket volume ownership mismatch.');
      socketVolumeCreated = true;
    });
  }
  const dbEnv = envFile('db.env', { POSTGRES_USER: 'a01_admin', POSTGRES_DB: 'fasttrack_a01_test',
    POSTGRES_PASSWORD: password, PGPASSWORD: password,
    ...(socketMode ? { POSTGRES_INITDB_ARGS: '--auth-local=scram-sha-256' } : {}) });
  start(['--name', dbName, '--env-file', dbEnv, '--tmpfs', '/var/lib/postgresql/data:rw',
    ...(socketMode ? ['--mount', `type=volume,source=${socketVolume},target=/var/run/postgresql`] : []),
    'postgres:16.8@sha256:301bcb60b8a3ee4ab7e147932723e3abd1cef53516ce5210b39fd9fe5e3602ae',
    ...(socketMode ? ['-c', 'listen_addresses='] : [])]);
  let dbReady = false;
  for (let i = 0; i < 80; i++) {
    const ready = spawnSync('docker', ['exec', dbName, 'pg_isready', '-U', 'a01_admin', '-d', 'fasttrack_a01_test'], { windowsHide: true });
    if (ready.status === 0) { dbReady = true; break; }
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  if (!dbReady) throw new Error('New isolated database is unavailable.');
  if (socketMode) {
    check('socket fixture disables database TCP and requires local password authentication', () => {
      if (sql('SHOW listen_addresses') !== '') throw new Error('Socket fixture still accepts TCP.');
      if (sql("SELECT count(*) FROM pg_hba_file_rules WHERE type='local' AND auth_method <> 'scram-sha-256'") !== '0') {
        throw new Error('Local password authentication is not enforced.');
      }
      report.socketDirectory = socketDirectory; report.databaseTcpDisabled = true;
    });
  }
  const origin = 'https://verification.fasttrack.invalid';
  const databaseUrl = value => socketMode
    ? `postgresql://a01_admin:${value}@127.0.0.1:5432/fasttrack_a01_test?host=${socketDirectory}`
    : `postgresql://a01_admin:${value}@${dbName}:5432/fasttrack_a01_test`;
  const runtimeEnv = envFile('runtime.env', { DATABASE_URL: databaseUrl(password),
    DEMO_SEED_PASSWORD: demoPassword, APP_ORIGIN: origin, RELEASE_SHA: report.sourceCommit });
  if (socketMode) {
    const rejectedEnv = envFile('rejected.env', { DATABASE_URL: databaseUrl(wrongPassword), APP_ORIGIN: origin });
    check('real migration CLI rejects the wrong socket password', () => {
      const denied = spawnSync('docker', ['run', '--rm', '--network', network, ...clientSocketMounts,
        '--env-file', rejectedEnv, jobsImage, 'run', 'db:migrate', '--workspace', '@fasttrack/server'],
      { encoding: 'utf8', windowsHide: true, timeout: 60_000 });
      if (denied.error || denied.status === null || denied.status === 0 ||
          !/P1000|password authentication failed/i.test(`${denied.stdout}\n${denied.stderr}`)) {
        throw new Error('Migration did not explicitly reject socket authentication.');
      }
    });
    const rejectedWeb = start(['--publish', '127.0.0.1::8080', ...clientSocketMounts, '--env-file', rejectedEnv, webImage]);
    const rejectedUrl = `http://127.0.0.1:${inspect(rejectedWeb).NetworkSettings.Ports['8080/tcp'][0].HostPort}`;
    let rejectedResponse;
    for (let i = 0; i < 60; i++) {
      try { rejectedResponse = await fetch(`${rejectedUrl}/api/ready`, { signal: AbortSignal.timeout(5000) }); break; }
      catch { await new Promise(resolve => setTimeout(resolve, 250)); }
    }
    if (rejectedResponse?.status !== 503 || (await fetch(`${rejectedUrl}/api/health`)).status !== 200) {
      throw new Error('Wrong socket password did not isolate readiness from liveness.');
    }
    const payload = await rejectedResponse.text();
    if (secrets.some(value => payload.includes(value)) || /postgres|cloudsql|authentication/i.test(payload)) {
      throw new Error('Socket readiness leaked connection details.');
    }
    report.checks.push({ name: 'actual runtime adapter rejects wrong socket password with safe readiness 503 and health 200', passed: true });
  }
  const job = script => run('docker', ['run', '--rm', '--network', network, ...clientSocketMounts, '--env-file', runtimeEnv, jobsImage,
    'run', script, '--workspace', '@fasttrack/server']);
  check('actual jobs image migrates a fresh DB and repeats without reset', () => { job('db:migrate'); job('db:migrate'); });
  check('explicit image seed preserves existing users and credentials', () => {
    job('db:seed'); const before = fingerprint(); job('db:seed'); if (before !== fingerprint()) throw new Error('Repeat seed changed existing records.');
  });
  const web = start(['--publish', '127.0.0.1::8080', ...clientSocketMounts, '--env-file', runtimeEnv, webImage]);
  const binding = inspect(web).NetworkSettings.Ports['8080/tcp'][0];
  let url = `http://127.0.0.1:${binding.HostPort}`;
  await waitReady(url);
  const api = async (path, { cookie, body, expected = 200 } = {}) => {
    const response = await fetch(`${url}/api${path}`, { method: body ? 'POST' : 'GET',
      headers: { Origin: origin, 'X-fastTrack-Request': '1', ...(cookie ? { Cookie: cookie } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}), ...(body?.csrf ? { 'X-CSRF-Token': body.csrf } : {}) },
      ...(body ? { body: JSON.stringify(Object.fromEntries(Object.entries(body).filter(([key]) => key !== 'csrf'))) } : {}) });
    if (response.status !== expected) throw new Error(`Local ${path} returned ${response.status}, expected ${expected}.`);
    const data = response.status === 204 ? null : await response.json(); return { response, data };
  };
  const auth = async email => {
    const { response, data } = await api('/auth/login', { body: { email, password: demoPassword } });
    const setCookie = response.headers.get('set-cookie');
    if (!setCookie?.includes('Secure') || !setCookie.includes('HttpOnly')) throw new Error('Production cookie security missing.');
    return { cookie: setCookie.split(';')[0], csrf: data.data.csrfToken };
  };
  if ((await api('/health')).data.version !== report.sourceCommit) throw new Error('Serving source mismatch.');
  const html = await (await fetch(url)).text(); if (!/fastTrack/.test(html)) throw new Error('Built HTML missing.');
  for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^\"]+)"/g)) {
    const asset = await fetch(`${url}${match[1]}`);
    if (asset.status !== 200 || !asset.headers.get('cache-control')?.includes('immutable')) throw new Error('Built hashed asset/cache failed.');
    if (asset.headers.get('content-type')?.includes('text/css')) {
      const css = await asset.text();
      for (const font of css.matchAll(/url\(["']?(\/assets\/[^\s)"']+)/g)) {
        if ((await fetch(`${url}${font[1]}`)).status !== 200) throw new Error('Bundled font asset failed.');
      }
    }
  }
  const deepLink = await fetch(`${url}/teams/synthetic-browser-path`, { headers: { Accept: 'text/html' } });
  if (deepLink.status !== 200 || !deepLink.headers.get('cache-control')?.includes('no-cache')) throw new Error('Built SPA deep link failed.');
  await api('/nonexistent', { expected: 404 });
  report.checks.push({ name: 'built hashed assets/fonts, no-cache SPA deep link and JSON API 404', passed: true });
  const supervisor = await auth('supervisor.a@fasttrack.local');
  const student = await auth('student.a1@fasttrack.local');
  const teams = (await api('/teams', supervisor)).data.data;
  const team = teams[0]; if (!team?.id) throw new Error('Seed team missing.');
  const milestone = (await api(`/teams/${team.id}/milestones`, { ...supervisor, expected: 201,
    body: { title: 'Container persistence check', description: 'Synthetic local container evidence.', dueAt: new Date(Date.now() + 86_400_000).toISOString(), csrf: supervisor.csrf } })).data.data;
  const submission = (await api(`/milestones/${milestone.id}/submissions`, { ...student, expected: 201,
    body: { title: 'Container submission', description: 'Synthetic original submission.', url: 'https://example.com/a01', csrf: student.csrf } })).data.data;
  const feedback = (await api(`/submissions/${submission.id}/feedback`, { ...supervisor, expected: 201,
    body: { content: 'Synthetic original feedback.', clientRequestId: randomUUID(), csrf: supervisor.csrf } })).data.data;
  report.records = { milestone: milestone.id, submission: submission.id, feedback: feedback.id };
  report.checks.push({ name: 'compiled production UI/API/DB business flow and secure cookie', passed: true });
  await api(`/teams/${team.id}/milestones`, { ...student, expected: 403,
    body: { title: 'Forbidden', description: 'Must not write.', dueAt: new Date(Date.now() + 86_400_000).toISOString(), csrf: student.csrf } });
  const before = fingerprint(); job('db:seed'); if (before !== fingerprint()) throw new Error('Seed changed saved domain/session data.');
  check('graceful actual web stop retains external DB', () => {
    run('docker', ['stop', '--time', '10', web]);
    if (inspect(web).State.ExitCode !== 0) throw new Error('Web did not stop gracefully.');
    run('docker', ['start', web]);
    // Docker may allocate a different ephemeral host port when the same container restarts.
    url = `http://127.0.0.1:${inspect(web).NetworkSettings.Ports['8080/tcp'][0].HostPort}`;
  });
  await waitReady(url);
  const restored = (await api(`/submissions/${submission.id}`, student)).data.data;
  const restoredFeedback = (await api(`/submissions/${submission.id}/feedback`, student)).data.data;
  if (restored.id !== submission.id || !restoredFeedback.some(item => item.id === feedback.id) || before !== fingerprint()) throw new Error('Original record/session persistence failed.');
  report.checks.push({ name: 'same original IDs and still-valid DB session survive actual container restart and repeat seed', passed: true });
  const brokenEnv = envFile('broken.env', { DATABASE_URL: 'postgresql://synthetic:placeholder@127.0.0.1:1/unavailable', APP_ORIGIN: origin });
  const broken = start(['--publish', '127.0.0.1::8080', '--env-file', brokenEnv, webImage]);
  const brokenUrl = `http://127.0.0.1:${inspect(broken).NetworkSettings.Ports['8080/tcp'][0].HostPort}`;
  let brokenResponse;
  for (let i = 0; i < 60; i++) {
    try { brokenResponse = await fetch(`${brokenUrl}/api/ready`, { signal: AbortSignal.timeout(5000) }); break; } catch { await new Promise(resolve => setTimeout(resolve, 250)); }
  }
  if (brokenResponse?.status !== 503 || (await fetch(`${brokenUrl}/api/health`)).status !== 200) throw new Error('Disconnected image readiness/liveness failed.');
  const failure = await brokenResponse.text(); if (/postgres|password|127\.0\.0\.1/.test(failure)) throw new Error('Readiness leaked private connection details.');
  report.checks.push({ name: 'actual final image returns sanitized disconnected DB 503 and independent health 200', passed: true });
  report.passed = true;
} catch (error) {
  report.passed = false; report.error = redact(error.message); process.stderr.write(`${report.error}\n`);
} finally {
  for (const id of containers.reverse()) {
    const removed = spawnSync('docker', ['rm', '--force', id], { windowsHide: true, encoding: 'utf8' });
    report.cleanup.push({ container: id, removed: removed.status === 0 });
    if (removed.status !== 0) report.passed = false;
  }
  if (networkCreated) { try { run('docker', ['network', 'rm', network]); } catch { report.passed = false; } }
  if (socketVolumeCreated) {
    const removed = spawnSync('docker', ['volume', 'rm', socketVolume], { windowsHide: true, encoding: 'utf8' });
    report.cleanup.push({ volume: socketVolume, removed: removed.status === 0 });
    if (removed.status !== 0) report.passed = false;
  }
  for (const path of files) rmSync(path, { force: true });
  report.finishedAt = new Date().toISOString();
  const destination = process.env.A01_CONTAINER_REPORT ?? join(appRoot, socketMode ? 'docs/evidence/R2-J01-socket-results.json' : 'docs/evidence/R2-A01-container-results.json');
  mkdirSync(join(appRoot, 'docs/evidence'), { recursive: true });
  writeFileSync(destination, redact(JSON.stringify(report, null, 2)) + '\n');
  process.stdout.write(`Container verification ${report.passed ? 'PASSED' : 'FAILED'}; report: ${destination}\n`);
  if (process.env.CI) process.stdout.write(redact(JSON.stringify(report)) + '\n');
  process.exitCode = report.passed ? 0 : 1;
}
