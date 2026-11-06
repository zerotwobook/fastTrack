import { spawnSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PrismaClient } from '../server/src/db/generated/client/index.js';
import { PrismaPg } from '@prisma/adapter-pg';

const root = fileURLToPath(new URL('../', import.meta.url));
const runtime = new URL(process.env.DATABASE_URL);
const container = process.env.G1_AUDIT_CONTAINER_ID;
if (runtime.hostname !== '127.0.0.1' || runtime.pathname !== '/fasttrack_g1_dev' || runtime.username !== 'g1_admin' ||
    !container || !/^[a-f0-9]{64}$/.test(container)) throw new Error('Use the isolated G1 runner for upgrade checks.');
const inspected = spawnSync('docker', ['inspect', '--format', '{{json .}}', container], { encoding: 'utf8', windowsHide: true });
if (inspected.status !== 0) throw new Error('The newly created audit container could not be verified.');
const details = JSON.parse(inspected.stdout);
if (details.Config.Labels?.['fasttrack.audit'] !== 'g1' ||
    !details.NetworkSettings.Ports?.['5432/tcp']?.some(binding => binding.HostIp === '127.0.0.1' && binding.HostPort === runtime.port)) {
  throw new Error('The database URL is not bound to the isolated audit container.');
}
const admin = new PrismaClient({ adapter: new PrismaPg({ connectionString: runtime.href }) });
const canonical = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.TEST_DATABASE_URL }) });
const report = { cases: [] };
function migration(url, config, history) {
  return spawnSync(process.execPath, ['node_modules/prisma/build/index.js', 'migrate', 'deploy', '--config', config], {
    cwd: root, env: { ...process.env, DATABASE_URL: url, ...(history ? { G1_HISTORY_MIGRATIONS_DIR: history } : {}) },
    encoding: 'utf8', windowsHide: true, timeout: 30_000,
  });
}
const tableNames = "('users','sessions','teams','team_members','milestones','submissions','feedback')";
async function fingerprint(db) {
  const foreignKeys = await db.$queryRawUnsafe("SELECT count(*)::int AS count FROM pg_constraint WHERE contype='f' AND connamespace='public'::regnamespace");
  const columns = await db.$queryRawUnsafe(`SELECT table_name,column_name,data_type,character_maximum_length,is_nullable,column_default
    FROM information_schema.columns WHERE table_schema='public' AND table_name IN ${tableNames} ORDER BY table_name,column_name`);
  const constraints = await db.$queryRawUnsafe(`SELECT r.relname AS table_name,c.conname,c.contype,pg_get_constraintdef(c.oid) AS definition
    FROM pg_constraint c JOIN pg_class r ON c.conrelid=r.oid JOIN pg_namespace n ON r.relnamespace=n.oid
    WHERE n.nspname='public' AND r.relname IN ${tableNames} ORDER BY r.relname,c.conname`);
  const indexes = await db.$queryRawUnsafe(`SELECT tablename,indexname,indexdef FROM pg_indexes WHERE schemaname='public' AND tablename IN ${tableNames} ORDER BY tablename,indexname`);
  return { foreignKeys: foreignKeys[0].count, columns, constraints, indexes };
}
const columns = {
  users: 'id::text,email,password_hash,name,role::text,student_id,created_at::text,updated_at::text',
  sessions: 'id::text,user_id::text,token_hash,csrf_token,expires_at::text,created_at::text',
  teams: 'id::text,name,supervisor_id::text,created_at::text,updated_at::text',
  team_members: 'team_id::text,student_id::text,joined_at::text',
  milestones: 'id::text,team_id::text,title,description,due_at::text,created_by_id::text,created_at::text,updated_at::text',
  submissions: 'id::text,milestone_id::text,submitted_by_id::text,version,title,description,url,submitted_at::text,created_at::text',
  feedback: 'id::text,submission_id::text,supervisor_id::text,content,client_request_id::text,created_at::text',
};
async function snapshot(db) {
  const rows = {};
  for (const [table, select] of Object.entries(columns)) rows[table] = await db.$queryRawUnsafe(`SELECT ${select} FROM "${table}" ORDER BY 1,2`);
  return rows;
}
async function history(db) {
  return db.$queryRawUnsafe('SELECT migration_name,checksum FROM "_prisma_migrations" WHERE finished_at IS NOT NULL ORDER BY migration_name');
}
async function insertLegacy(db, variant) {
  const boundary = variant === 'canonical_boundary';
  const ids = { sup: variant === 'invalid_uuid' ? 'legacy-invalid-id' : randomUUID(), stu: randomUUID(), team: randomUUID(),
    milestone: randomUUID(), submission: randomUUID(), feedback: randomUUID(), session: randomUUID(), key: randomUUID() };
  await db.$executeRawUnsafe("INSERT INTO users(id,email,password_hash,name,role,updated_at) VALUES($1,'sup@upgrade.local','synthetic-hash',$3,'supervisor',now()),($2,'stu@upgrade.local','synthetic-hash','Legacy student','student',now())",
    ids.sup, ids.stu, boundary ? 'N'.repeat(130) : 'Legacy supervisor');
  await db.$executeRawUnsafe("INSERT INTO sessions(id,user_id,token_hash,csrf_token,expires_at) VALUES($1,$2,'legacy-token-hash','legacy-csrf','2030-11-07T12:00:00Z')",ids.session,ids.sup);
  await db.$executeRawUnsafe('INSERT INTO teams(id,name,supervisor_id,updated_at) VALUES($1,$2,$3,now())',ids.team,
    variant === 'invalid_overlength' ? 'T'.repeat(121) : boundary ? 'T'.repeat(120) : 'Legacy team',ids.sup);
  await db.$executeRawUnsafe('INSERT INTO team_members(team_id,student_id) VALUES($1,$2)',ids.team,ids.stu);
  await db.$executeRawUnsafe("INSERT INTO milestones(id,team_id,title,description,due_at,created_by_id,updated_at) VALUES($1,$2,$3,$4,'2030-11-07T12:00:00Z',$5,now())",
    ids.milestone,ids.team,boundary?'M'.repeat(120):'Legacy milestone',
    variant === 'invalid_required' ? '\u00a0\ufeff' : boundary?'D'.repeat(4000):'Legacy description',ids.sup);
  const url = boundary ? 'https://example.edu/' + 'x'.repeat(2048 - 'https://example.edu/'.length) : 'https://example.edu/work';
  await db.$executeRawUnsafe("INSERT INTO submissions(id,milestone_id,submitted_by_id,version,title,description,url,submitted_at) VALUES($1,$2,$3,1,$4,$5,$6,'2030-11-06T12:00:00Z')",
    ids.submission,ids.milestone,variant === 'invalid_author' ? randomUUID() : ids.stu,
    boundary?'S'.repeat(120):'Legacy submission',boundary?'D'.repeat(4000):'Legacy description',url);
  await db.$executeRawUnsafe('INSERT INTO feedback(id,submission_id,supervisor_id,content,client_request_id) VALUES($1,$2,$3,$4,$5::uuid)',
    ids.feedback,ids.submission,ids.sup,boundary?'F'.repeat(4000):'Legacy feedback',ids.key);
}
try {
  const expectedSchema = await fingerprint(canonical);
  for (const variant of ['control', 'canonical_boundary', 'invalid_uuid', 'invalid_required', 'invalid_overlength', 'invalid_author', 'candidate_applied']) {
    const database = `fasttrack_g1_upgrade_${variant}`;
    await admin.$executeRawUnsafe(`CREATE DATABASE "${database}"`);
    const url = new URL(runtime.href); url.pathname = `/${database}`;
    const historicalPath = variant === 'candidate_applied' ? process.env.G1_CANDIDATE_MIGRATIONS_DIR : process.env.G1_LEGACY_MIGRATIONS_DIR;
    const legacy = migration(url.href, 'prisma.g1-history.config.ts', historicalPath);
    if (legacy.status !== 0) throw new Error(`Historical migration setup failed for ${variant}.`);
    const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url.href }) });
    try {
      await insertLegacy(db, variant);
      const before = await snapshot(db); const schemaBefore = await fingerprint(db); const ledgerBefore = await history(db);
      const applied = migration(url.href, 'prisma.config.ts');
      const after = await snapshot(db); const schemaAfter = await fingerprint(db); const ledgerAfter = await history(db);
      const recordsPreserved = JSON.stringify(before) === JSON.stringify(after);
      const schemaPreserved = JSON.stringify(schemaBefore) === JSON.stringify(schemaAfter);
      const matchesFreshSchema = JSON.stringify(expectedSchema) === JSON.stringify(schemaAfter);
      const appliedHistoryPreserved = ledgerBefore.every(old => ledgerAfter.some(current => current.migration_name === old.migration_name && current.checksum === old.checksum));
      const shouldReject = variant.startsWith('invalid_');
      const passed = shouldReject ? applied.status !== 0 && recordsPreserved && schemaPreserved && appliedHistoryPreserved
        : applied.status === 0 && recordsPreserved && matchesFreshSchema && appliedHistoryPreserved;
      report.cases.push({ variant, passed, migrationExit: applied.status,
        databaseErrorCode: /Database error code:\s*(\w+)/.exec(applied.stderr)?.[1] ?? null,
        recordsPreserved, schemaPreserved, matchesFreshSchema, appliedHistoryPreserved,
        foreignKeysBefore: schemaBefore.foreignKeys, foreignKeysAfter: schemaAfter.foreignKeys });
      process.stdout.write(`${passed ? 'PASS' : 'FAIL'} upgrade: ${variant}; records=${recordsPreserved}; FKs=${schemaBefore.foreignKeys}->${schemaAfter.foreignKeys}\n`);
    } finally { await db.$disconnect(); }
  }
} catch (error) {
  report.error = String(error.message).replace(/postgres(?:ql)?:\/\/[^\s'"<>]+/g,'[database URL]');
  process.stderr.write(`${report.error}\n`);
} finally {
  await Promise.all([admin.$disconnect(), canonical.$disconnect()]);
  report.passed = !report.error && report.cases.length === 7 && report.cases.every(test => test.passed);
  writeFileSync(process.env.G1_UPGRADE_REPORT_PATH, JSON.stringify(report,null,2)+'\n');
  process.exitCode = report.passed ? 0 : 1;
}
