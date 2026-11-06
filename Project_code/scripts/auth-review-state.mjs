import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = fileURLToPath(new URL('../', import.meta.url));
export const authReviewStateFile = process.env.AUTH_REVIEW_STATE_PATH ?? join(tmpdir(), `fasttrack-auth-review-${createHash('sha256').update(root).digest('hex').slice(0, 12)}.json`);
