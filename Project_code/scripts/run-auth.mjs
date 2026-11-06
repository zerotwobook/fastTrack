import { spawnSync } from 'node:child_process';
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'test:g1:isolated'], {
  env: { ...process.env, G1_AUTH_CHECKS: '1' }, stdio: 'inherit', windowsHide: true,
});
process.exitCode = result.status ?? 1;
