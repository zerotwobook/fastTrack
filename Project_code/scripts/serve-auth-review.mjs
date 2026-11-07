import { createServer } from 'node:http';
import { existsSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server/dist/app.js';
import { loadConfig } from '../server/dist/config.js';
import { prisma } from '../server/dist/db/client.js';
import { createApplicationRouters } from '../server/dist/modules/index.js';
import { authReviewStateFile } from './auth-review-state.mjs';

// Launched only by the disposable runner, never by application startup.
if (process.env.G1_REVIEW_AUTH !== '1' || !/^[a-f0-9]{64}$/.test(process.env.G1_AUDIT_CONTAINER_ID ?? '')) {
  throw new Error('Use npm run review:auth to provision a disposable review environment.');
}
const reference = await prisma.user.findUniqueOrThrow({ where: { email: 'student.a1@fasttrack.local' } });
await prisma.user.create({ data: { email: 'unassigned@fasttrack.local', name: 'Unassigned student', role: 'student', passwordHash: reference.passwordHash } });
const server = createServer();
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const origin = `http://127.0.0.1:${server.address().port}`;
const config = loadConfig({ ...process.env, NODE_ENV: 'development', APP_ORIGIN: origin });
server.on('request', createApp(config, {
  routers: createApplicationRouters({ prisma, config }),
  clientDirectory: fileURLToPath(new URL('../client/dist/', import.meta.url)),
}));
writeFileSync(authReviewStateFile, JSON.stringify({ url: origin, containerId: process.env.G1_AUDIT_CONTAINER_ID, stopFile: process.env.AUTH_REVIEW_STOP_FILE }) + '\n');
process.stdout.write(`AUTH_REVIEW_URL=${origin}\nDisposable synthetic accounts only. Run npm run review:auth:stop in another terminal to shut down and clean up.\n`);
let stopping = false;
const poller = setInterval(() => { if (existsSync(process.env.AUTH_REVIEW_STOP_FILE)) shutdown(); }, 500);
const shutdown = () => {
  if (stopping) return;
  stopping = true;
  clearInterval(poller);
  server.close(() => { void prisma.$disconnect().finally(() => { process.exitCode = 0; }); });
  setTimeout(() => process.exit(1), 5000).unref();
};
process.once('SIGINT', shutdown); process.once('SIGTERM', shutdown);
