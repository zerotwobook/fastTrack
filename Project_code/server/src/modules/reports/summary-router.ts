import { Router } from 'express';
import { parseSummarySearch } from '../../../../shared/summary.mjs';
import { AppError } from '../../http/errors.js';
import type { AuthDependencies, SessionProtection } from '../auth/index.js';
import { readSummary } from './summary-service.js';

export function createSummaryRouter({ prisma, protection }: Pick<AuthDependencies, 'prisma'> & { protection: SessionProtection }): Router {
  const router = Router();
  router.get('/summary', protection.requireRole('supervisor'), async (req, res) => {
    const queryStart = req.originalUrl.indexOf('?');
    const query = parseSummarySearch(queryStart < 0 ? '' : req.originalUrl.slice(queryStart));
    if (!query.ok) throw new AppError(400, 'INVALID_INPUT', 'Check the summary filter parameters.', query.errors);

    const actor = await protection.getAuthContext(req);
    res.json(await readSummary(prisma, actor, query.filters));
  });
  return router;
}
