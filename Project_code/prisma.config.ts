// Prisma 7 configuration — B owns (R1-B00).
// Prisma 7 reads connection URL from here rather than from schema.prisma datasource.
// DATABASE_URL is required at runtime; never hard-code credentials here.
// See: https://pris.ly/d/config-datasource

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'server/prisma/schema.prisma',
  datasource: {
    url: process.env['DATABASE_URL'] ?? '',
  },
});
