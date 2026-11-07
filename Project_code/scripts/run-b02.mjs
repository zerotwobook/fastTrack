import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', process.argv.includes('--review') ? 'review:a02' : 'test:a02:isolated'], {
  env: { ...process.env, G1_B02_CHECKS: '1' }, stdio: 'inherit', windowsHide: true,
});
process.exitCode = result.status ?? 1;
