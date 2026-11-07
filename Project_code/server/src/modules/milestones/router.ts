import { Router } from 'express';
import type { Request, RequestHandler } from 'express';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { requireJsonBody, parseJsonBody } from '../../http/errors.js';
import { MilestoneService } from './service.js';
import type { MilestoneAuthContext } from './service.js';

export interface MilestoneRouterDependencies {
  prisma: PrismaClient;
  getAuthContext: (req: Request) => MilestoneAuthContext | Promise<MilestoneAuthContext>;
  requireSession: RequestHandler;
  requireSupervisor: RequestHandler;
  requireMutation: RequestHandler;
}
export function createMilestoneRouter(deps: MilestoneRouterDependencies): Router {
  for (const name of ['getAuthContext', 'requireSession', 'requireSupervisor', 'requireMutation'] as const) {
    if (typeof deps[name] !== 'function') throw new TypeError(`Milestone protection dependency ${name} is required.`);
  }
  const router = Router();
  const service = new MilestoneService(deps.prisma);
  router.post('/teams/:teamId/milestones', deps.requireSession, deps.requireSupervisor, deps.requireMutation,
    requireJsonBody, parseJsonBody, async (req, res) => {
      const result = await service.createMilestone(String(req.params.teamId), req.body, await deps.getAuthContext(req));
      res.status(201).json({ data: result });
    });
  router.get('/teams/:teamId/milestones', deps.requireSession, async (req, res) => {
    res.json(await service.listMilestones(String(req.params.teamId), await deps.getAuthContext(req)));
  });
  router.get('/milestones/:id', deps.requireSession, async (req, res) => {
    res.json(await service.getMilestone(String(req.params.id), await deps.getAuthContext(req)));
  });
  return router;
}
