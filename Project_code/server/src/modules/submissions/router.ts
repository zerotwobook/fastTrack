import { Router } from 'express';
import type { Request, RequestHandler } from 'express';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { parseJsonBody, requireJsonBody } from '../../http/errors.js';
import type { TeamActor } from '../teams/index.js';
import { SubmissionService } from './service.js';

export interface SubmissionRouterDependencies {
  prisma: PrismaClient;
  getAuthContext: (req: Request) => TeamActor | Promise<TeamActor>;
  requireSession: RequestHandler;
  requireStudent: RequestHandler;
  requireMutation: RequestHandler;
}

export function createSubmissionRouter(deps: SubmissionRouterDependencies): Router {
  for (const key of ['getAuthContext', 'requireSession', 'requireStudent', 'requireMutation'] as const) {
    if (typeof deps[key] !== 'function') throw new TypeError(`Submission protection dependency ${key} is required.`);
  }
  const service = new SubmissionService(deps.prisma);
  const router = Router();
  router.post('/milestones/:id/submissions', deps.requireSession, deps.requireStudent, deps.requireMutation,
    requireJsonBody, parseJsonBody, async (req, res) => {
      const saved = await service.submit(String(req.params.id), req.body, await deps.getAuthContext(req));
      res.status(201).json({ data: saved });
    });
  router.get('/milestones/:id/submissions', deps.requireSession, async (req, res) => {
    res.json(await service.list(String(req.params.id), await deps.getAuthContext(req)));
  });
  router.get('/submissions/:id', deps.requireSession, async (req, res) => {
    res.json(await service.detail(String(req.params.id), await deps.getAuthContext(req)));
  });
  return router;
}
