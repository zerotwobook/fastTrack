import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtempSync, writeFileSync, readFileSync, rmSync, mkdirSync, cpSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Run with npm run test:g1:isolated.');
const image = 'postgres:16.8@sha256:301bcb60b8a3ee4ab7e147932723e3abd1cef53516ce5210b39fd9fe5e3602ae';
const suffix = randomBytes(6).toString('hex');
const password = randomBytes(24).toString('hex');
const directory = mkdtempSync(join(tmpdir(), 'fasttrack-g1-'));
const envFile = join(directory, 'postgres.env');
const reportFile = process.env.G1_REPORT_PATH ?? join(directory, 'report.json');
const report = { image, startedAt: new Date().toISOString(), stages: [], cleanup: 'pending' };
const redactions = [password];
let container;
let failed = false;
function redact(value) {
  let text = String(value ?? '');
  for (const secret of redactions) text = text.replaceAll(secret, '[redacted]');
  return text.replace(/postgres(?:ql)?:\/\/[^\s'"<>]+/g, '[database URL]');
}
function command(bin, args, env = process.env) {
  return spawnSync(bin, args, { cwd: root, env, encoding: 'utf8', windowsHide: true, timeout: 120_000 });
}
function must(bin, args, env) {
  const result = command(bin, args, env);
  if (result.status !== 0) throw new Error(redact(result.stderr || result.error?.message || 'Command failed.'));
  return result.stdout.trim();
}
function stage(name, script, env, required = false) {
  const testReport = join(directory, 'tests.json');
  const extra = script === 'test:g1' ? ['--', '--reporter=json', '--outputFile', testReport] : [];
  const result = command(process.execPath, [npmCli, 'run', script, ...(script.startsWith('db:') ? ['--workspace', '@fasttrack/server'] : []), ...extra], env);
  const passed = result.status === 0;
  report.stages.push({ name, passed, exitCode: result.status });
  process.stdout.write(redact(result.stdout) + redact(result.stderr));
  if (script === 'test:g1') {
    try {
      const tests = JSON.parse(readFileSync(testReport, 'utf8'));
      report.g1Tests = { passed: tests.numPassedTests, failed: tests.numFailedTests,
        cases: tests.testResults.flatMap(file => file.assertionResults.map(test => ({ name: test.fullName, status: test.status }))) };
      process.stdout.write(`G1 cases: ${report.g1Tests.passed} passed, ${report.g1Tests.failed} failed.\n`);
      for (const test of report.g1Tests.cases.filter(test => test.status !== 'passed')) process.stdout.write(`${test.status}: ${test.name}\n`);
    } catch { report.testReportError = 'No readable Vitest report.'; }
  }
  failed ||= !passed;
  if (required && !passed) throw new Error(`${name} failed; dependent DB checks cannot run.`);
}
try {
  writeFileSync(envFile, `POSTGRES_PASSWORD=${password}\n`, { mode: 0o600 });
  container = must('docker', ['run', '--rm', '--detach', '--name', `fasttrack-g1-${suffix}`,
    '--label', 'fasttrack.audit=g1', '--publish', '127.0.0.1::5432',
    '--tmpfs', '/var/lib/postgresql/data:rw', '--env-file', envFile,
    '--env', 'POSTGRES_USER=g1_admin', '--env', 'POSTGRES_DB=fasttrack_g1_test', image]);
  if (!/^[a-f0-9]{64}$/.test(container)) throw new Error('Unexpected new audit container identity.');
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (command('docker', ['exec', container, 'pg_isready', '-h', '127.0.0.1', '-U', 'g1_admin', '-d', 'fasttrack_g1_test']).status === 0) { ready = true; break; }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw new Error('Disposable PostgreSQL did not become ready.');
  must('docker', ['exec', container, 'psql', '-h', '127.0.0.1', '-U', 'g1_admin', '-d', 'postgres', '-v', 'ON_ERROR_STOP=1', '-c', 'CREATE DATABASE fasttrack_g1_dev']);
  const binding = must('docker', ['port', container, '5432/tcp']);
  const match = /^127\.0\.0\.1:(\d+)$/.exec(binding);
  if (!match) throw new Error('Expected a loopback-only ephemeral database port.');
  const base = `postgresql://g1_admin:${password}@127.0.0.1:${match[1]}`;
  const runtimeUrl = `${base}/fasttrack_g1_dev`;
  const testUrl = `${base}/fasttrack_g1_test`;
  redactions.push(runtimeUrl, testUrl);
  const env = { ...process.env, NODE_ENV: 'test', DATABASE_URL: runtimeUrl, TEST_DATABASE_URL: testUrl,
    DEMO_SEED_PASSWORD: randomBytes(24).toString('hex') };
  redactions.push(env.DEMO_SEED_PASSWORD);
  const legacyDirectory = join(directory, 'legacy-migrations');
  const candidateDirectory = join(directory, 'candidate-migrations');
  for (const target of [legacyDirectory, candidateDirectory]) {
    mkdirSync(target, { recursive: true });
    for (const name of ['20261106094006_init_sprint1_schema', '20261106094101_add_version_check_constraint']) {
      cpSync(join(root, 'server/prisma/migrations', name), join(target, name), { recursive: true });
    }
    cpSync(join(root, 'server/prisma/migrations/migration_lock.toml'), join(target, 'migration_lock.toml'));
  }
  const originalCandidate = join(candidateDirectory, '20261106195734_g1_schema_corrections');
  mkdirSync(originalCandidate);
  cpSync(join(root, 'server/src/testing/migrations/g1-candidate-633a9fe.sql'), join(originalCandidate, 'migration.sql'));
  Object.assign(env, { G1_AUDIT_CONTAINER_ID: container, G1_LEGACY_MIGRATIONS_DIR: legacyDirectory,
    G1_CANDIDATE_MIGRATIONS_DIR: candidateDirectory, G1_UPGRADE_REPORT_PATH: join(directory, 'upgrade-report.json') });
  report.postgresVersion = must('docker', ['exec', container, 'postgres', '--version']);
  stage('client generation', 'db:generate', env, true);
  stage('fresh dev migrations', 'db:migrate', env, true);
  stage('fresh test migrations', 'db:migrate', { ...env, DATABASE_URL: testUrl }, true);
  stage('repeat migration deploy', 'db:migrate', { ...env, DATABASE_URL: testUrl }, true);
  stage('typecheck', 'typecheck', env);
  stage('ordinary unit/API tests', 'test', env);
  stage('production build', 'build', { ...env, NODE_ENV: 'production' });
  stage('G1 database, seed and compiled-client checks', 'test:g1', env);
  const upgrades = command(process.execPath, ['scripts/check-foundation-upgrade.mjs'], env);
  process.stdout.write(redact(upgrades.stdout) + redact(upgrades.stderr));
  report.upgrades = JSON.parse(readFileSync(env.G1_UPGRADE_REPORT_PATH, 'utf8'));
  failed ||= upgrades.status !== 0;
} catch (error) {
  failed = true;
  report.error = redact(error.message);
  process.stderr.write(`${report.error}\n`);
} finally {
  if (container && /^[a-f0-9]{64}$/.test(container)) {
    const cleanup = command('docker', ['rm', '--force', container]);
    report.cleanup = cleanup.status === 0 ? 'removed newly created audit container' : 'failed';
    failed ||= cleanup.status !== 0;
  } else report.cleanup = 'no audit container created';
  rmSync(envFile, { force: true });
  report.finishedAt = new Date().toISOString();
  report.passed = !failed;
  writeFileSync(reportFile, JSON.stringify(report, null, 2) + '\n');
  process.stdout.write(`G1 report: ${reportFile}\n`);
  process.exitCode = failed ? 1 : 0;
}
