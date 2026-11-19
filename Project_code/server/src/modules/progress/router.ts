import { Router } from 'express';
import { AppError } from '../../http/errors.js';
import type { AuthDependencies, SessionProtection } from '../auth/index.js';
import { MilestoneService } from '../milestones/service.js';
import { calculateProgress } from './calculation.js';

export function createProgressRouter({ prisma, protection }: Pick<AuthDependencies, 'prisma'> & { protection: SessionProtection }): Router {
  const router = Router();
  const milestones = new MilestoneService(prisma);
  router.get('/teams/:teamId/progress', protection.requireSession, async (req, res) => {
    if (Object.keys(req.query).length) {
      throw new AppError(400, 'INVALID_INPUT', 'Team progress accepts no query parameters.');
    }
    const teamId = String(req.params.teamId).toLowerCase();
    const auth = await protection.getAuthContext(req);
    const { data, meta } = await milestones.listMilestones(teamId, auth);
    const asOf = meta.serverTime;
    res.json({ data: { teamId, asOf, ...calculateProgress(data, new Date(asOf)) }, meta });
  });
  return router;
}
