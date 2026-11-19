import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../server/src/db/generated/client/index.js';

const target = new URL(process.env.DATABASE_URL ?? '');
if (target.pathname !== '/fasttrack_lab6' || target.searchParams.get('host') !== '/cloudsql/fasttrack-se-002:asia-southeast1:fasttrack-lab6-db') {
  throw new Error('This evidence reader requires the dedicated Lab 6 database and instance.');
}
const ids = process.argv.slice(2);
if (ids.length === 0 || ids.some(id => !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))) {
  throw new Error('Provide the exact synthetic milestone UUIDs to inspect.');
}
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: target.toString(), max: 1 }) });
try {
  const snapshot = await prisma.$transaction(async tx => {
    const clock = await tx.$queryRaw`SELECT date_trunc('milliseconds', clock_timestamp()) AS now`;
    const milestones = await tx.milestone.findMany({ where: { id: { in: ids } }, orderBy: { id: 'asc' },
      select: { id: true, title: true, dueAt: true, submissions: { orderBy: { version: 'asc' },
        select: { id: true, version: true, title: true, url: true, submittedAt: true } } } });
    if (milestones.length !== new Set(ids).size) throw new Error('Every requested milestone must exist in the isolated database.');
    return { database: 'fasttrack_lab6', instance: 'fasttrack-lab6-db', databaseTime: clock[0].now, milestones };
  }, { isolationLevel: 'RepeatableRead' });
  console.log(JSON.stringify(snapshot));
} finally {
  await prisma.$disconnect();
}
