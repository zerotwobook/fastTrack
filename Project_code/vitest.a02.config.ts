import { defineConfig } from 'vitest/config';
export default defineConfig({ test: {
  environment: 'node', include: ['server/src/**/*.a02.ts'], fileParallelism: false,
  testTimeout: 20_000, hookTimeout: 30_000, restoreMocks: true,
} });
