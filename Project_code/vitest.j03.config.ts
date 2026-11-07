import { defineConfig } from 'vitest/config';
export default defineConfig({ test: {
  environment: 'node', include: ['server/src/**/*.j03.ts'], fileParallelism: false,
  testTimeout: 45000, hookTimeout: 30000, restoreMocks: true,
} });
