import { defineConfig } from 'prisma/config';

const path = process.env.G1_HISTORY_MIGRATIONS_DIR;
if (!path) throw new Error('Use the isolated G1 runner for historical migration checks.');
export default defineConfig({
  schema: 'server/prisma/schema.prisma',
  migrations: { path },
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
