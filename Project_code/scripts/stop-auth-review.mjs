import { readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { authReviewStateFile } from './auth-review-state.mjs';
const state = JSON.parse(readFileSync(authReviewStateFile, 'utf8'));
const stopFile = resolve(state.stopFile);
if (basename(stopFile) !== 'stop-review' || !basename(dirname(stopFile)).startsWith('fasttrack-g1-') ||
    dirname(dirname(stopFile)).toLowerCase() !== resolve(tmpdir()).toLowerCase() || !/^[a-f0-9]{64}$/.test(state.containerId)) {
  throw new Error('Unverified review stop marker.');
}
writeFileSync(stopFile, 'stop\n', { flag: 'wx' });
process.stdout.write('Requested graceful shutdown of this clone\'s disposable auth review. Wait for its cleanup report.\n');
