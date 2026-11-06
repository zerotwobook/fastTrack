// Milestone router factory — B owns (R1-B01).
// Paths declared relative to /api per sprint-1-module-boundaries.md.

import { Router } from 'express';
import type { Request, Response, NextFunction } from 'express';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { requireJsonBody, parseJsonBody } from '../../http/errors.js';
import { MilestoneService } from './service.js';
import type { MilestoneAuthContext } from './service.js';

export interface MilestoneRouterDependencies {
  prisma: PrismaClient;
  getAuthContext?: (req: Request) => MilestoneAuthContext | Promise<MilestoneAuthContext>;
}

export function createMilestoneRouter(deps: MilestoneRouterDependencies): Router {
  const router = Router();
  const service = new MilestoneService(deps.prisma);

  const resolveAuth = async (req: Request): Promise<MilestoneAuthContext> => {
    if (deps.getAuthContext) {
      return await deps.getAuthContext(req);
    }
    const session = (req as unknown as { session?: { userId: string; role: 'student' | 'supervisor' } }).session;
    if (session) {
      return { userId: session.userId, role: session.role };
    }
    const userId = req.headers['x-user-id'] as string;
    const role = req.headers['x-user-role'] as 'student' | 'supervisor';
    if (userId && role) {
      return { userId, role };
    }
    throw new Error('Unauthenticated: missing session context');
  };

  // POST /teams/:teamId/milestones
  router.post(
    '/teams/:teamId/milestones',
    requireJsonBody,
    parseJsonBody,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await resolveAuth(req);
        const teamId = String(req.params.teamId);
        const milestone = await service.createMilestone(teamId, req.body, auth);
        res.status(201).json({ data: milestone });
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /teams/:teamId/milestones
  router.get('/teams/:teamId/milestones', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = await resolveAuth(req);
      const teamId = String(req.params.teamId);
      const milestones = await service.listMilestones(teamId, auth);
      res.json({
        data: milestones,
        meta: { serverTime: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  });

  // GET /milestones/:id
  router.get('/milestones/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const auth = await resolveAuth(req);
      const id = String(req.params.id);
      const milestone = await service.getMilestone(id, auth);
      res.json({
        data: milestone,
        meta: { serverTime: new Date().toISOString() },
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
