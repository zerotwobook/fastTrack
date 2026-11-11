import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const result = spawnSync(process.execPath, [process.env.npm_execpath, 'run', 'test:j03:isolated'], {
  env: { ...process.env, G1_A01_CHECKS: '1' }, stdio: 'inherit', windowsHide: true,
});
if (result.status === 0) {
  const socket = spawnSync(process.execPath, [fileURLToPath(new URL('./verify-container.mjs', import.meta.url)), '--socket'], {
    env: process.env, stdio: 'inherit', windowsHide: true,
  });
  process.exitCode = socket.status ?? 1;
} else process.exitCode = result.status ?? 1;
