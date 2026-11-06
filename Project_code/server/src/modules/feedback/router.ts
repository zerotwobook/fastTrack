// Feedback router factory — B owns (R1-B02).
// Paths declared relative to /api per sprint-1-module-boundaries.md.
//
// Pipeline order for mutations:
//   requireSession → requireSupervisor → requireMutation → requireJsonBody → parseJsonBody → controller
// Pipeline order for reads:
//   requireSession → controller (scoped team check enforced in FeedbackService)

import { Router } from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { requireJsonBody, parseJsonBody } from '../../http/errors.js';
import { FeedbackService } from './service.js';
import type { FeedbackAuthContext } from './service.js';

export interface FeedbackRouterDependencies {
  prisma: PrismaClient;
  /**
   * Resolves the caller's auth context from the request session.
   */
  getAuthContext: (req: Request) => FeedbackAuthContext | Promise<FeedbackAuthContext>;
  /**
   * Session guard — requires a valid, unexpired, unrevoked DB session.
   */
  requireSession: RequestHandler;
  /**
   * Role guard — requires caller role === 'supervisor'.
   */
  requireSupervisor: RequestHandler;
  /**
   * Mutation guard — validates request source (Origin/Referer) and CSRF token.
   */
  requireMutation: RequestHandler;
  /**
   * Optional clock seam for deterministic serverTime in tests.
   */
  now?: (() => Date) | undefined;
}

export function createFeedbackRouter(deps: FeedbackRouterDependencies): Router {
  for (const name of ['getAuthContext', 'requireSession', 'requireSupervisor', 'requireMutation'] as const) {
    if (typeof deps[name] !== 'function') throw new TypeError(`Feedback protection dependency ${name} is required.`);
  }

  const router = Router();
  const service = new FeedbackService(deps.prisma);
  const now = deps.now ?? (() => new Date());

  // POST /submissions/:id/feedback
  // Order: requireSession → requireSupervisor → requireMutation → requireJsonBody → parseJsonBody → controller
  router.post(
    '/submissions/:id/feedback',
    deps.requireSession,
    deps.requireSupervisor,
    deps.requireMutation,
    requireJsonBody,
    parseJsonBody,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await deps.getAuthContext(req);
        const submissionId = String(req.params.id);
        const result = await service.createFeedback(submissionId, req.body, auth);
        res.status(result.status).json({ data: result.data });
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /submissions/:id/feedback
  // Order: requireSession → controller (scope check inside FeedbackService)
  router.get(
    '/submissions/:id/feedback',
    deps.requireSession,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await deps.getAuthContext(req);
        const submissionId = String(req.params.id);
        const items = await service.listFeedback(submissionId, auth);
        res.json({
          data: items,
          meta: { serverTime: now().toISOString() },
        });
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
