import { spawnSync } from 'node:child_process';
const review = process.argv.includes('--review');
if (review && !process.env.AUTH_REVIEW_PASSWORD) throw new Error('Set a synthetic AUTH_REVIEW_PASSWORD before disposable browser review.');
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'test:g1:isolated'], {
  env: { ...process.env, G1_AUTH_CHECKS: '1', ...(review ? { G1_REVIEW_AUTH: '1' } : {}) }, stdio: 'inherit', windowsHide: true,
});
process.exitCode = result.status ?? 1;
