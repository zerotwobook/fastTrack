import { cpSync, existsSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// Prisma's generated JavaScript/assets are runtime dependencies; tsc does not emit them.
const source = fileURLToPath(new URL('../server/src/db/generated/client/', import.meta.url));
const destination = fileURLToPath(new URL('../server/dist/db/generated/client/', import.meta.url));
if (!existsSync(`${source}index.js`)) throw new Error('Generate the Prisma client before copying runtime assets.');
mkdirSync(destination, { recursive: true });
cpSync(source, destination, { recursive: true, force: true });
process.stdout.write('Copied generated Prisma client and runtime assets into server/dist.\n');
