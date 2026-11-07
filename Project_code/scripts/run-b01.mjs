import { spawnSync } from 'node:child_process';
const review = process.argv.includes('--review');
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', review ? 'review:auth' : 'test:auth:isolated'], {
  env: { ...process.env, G1_B01_CHECKS: '1' }, stdio: 'inherit', windowsHide: true,
});
process.exitCode = result.status ?? 1;
