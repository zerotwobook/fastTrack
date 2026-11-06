import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createApp } from './app.js';
import { loadConfig } from './config.js';
import { createApplicationRouters } from './modules/index.js';

try {
  const config = loadConfig(process.env);
  const { prisma } = await import('./db/client.js');
  const clientDirectory = fileURLToPath(new URL('../../client/dist/', import.meta.url));
  if (config.mode === 'production' && !existsSync(new URL('../../client/dist/index.html', import.meta.url))) {
    throw new Error('Build the client before starting production.');
  }
  const routers = createApplicationRouters({ prisma, config });
  const app = createApp(config, { routers, ...(config.mode === 'production' ? { clientDirectory } : {}) });
  const server = app.listen(config.port, () => {
    process.stdout.write(`fastTrack API listening on port ${config.port}.\n`);
  });
  server.on('error', () => {
    process.stderr.write('Server startup failed. Check the port and runtime configuration.\n');
    process.exitCode = 1;
  });
  const shutdown = () => {
    server.close(() => { void prisma.$disconnect().finally(() => { process.exitCode = 0; }); });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
} catch {
  process.stderr.write('Server startup failed. Check environment configuration and the production build.\n');
  process.exitCode = 1;
}
