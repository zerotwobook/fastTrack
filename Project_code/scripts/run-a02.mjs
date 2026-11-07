import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', process.argv.includes('--review') ? 'review:b01' : 'test:b01:isolated'], {
  env: { ...process.env, G1_A02_CHECKS: '1' }, stdio: 'inherit', windowsHide: true,
});
process.exitCode = result.status ?? 1;
