// Milestone router factory — B owns (R1-B01).
// Paths declared relative to /api per sprint-1-module-boundaries.md.
//
// Security contract (see docs/contracts/sprint-1-auth.md):
//   A provides createSessionProtection({prisma,config}) exposing
//   { requireSession, requireRole, requireMutation, getAuthContext }.
//   Middleware order for mutations:
//     requireSession → requireRole → requireMutation → requireJsonBody → parseJsonBody → controller
//   Middleware order for reads:
//     requireSession → controller   (role/scope enforced inside MilestoneService)
//
//   No header/body/query identity fallback is permitted in production.
//   getAuthContext is injected via MilestoneRouterDependencies so the router
//   never constructs its own AuthContext from untrusted inputs.

import { Router } from 'express';
import type { Request, Response, NextFunction, RequestHandler } from 'express';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { requireJsonBody, parseJsonBody } from '../../http/errors.js';
import { MilestoneService } from './service.js';
import type { MilestoneAuthContext } from './service.js';

export interface MilestoneRouterDependencies {
  prisma: PrismaClient;
  /**
   * Resolves the caller's auth context from the request.
   * In production: bind to SessionProtection.getAuthContext from createSessionProtection().
   * In tests: provide a stub that returns the desired context directly.
   * Throws AppError(401) when no valid session exists.
   */
  getAuthContext: (req: Request) => MilestoneAuthContext | Promise<MilestoneAuthContext>;
  /**
   * Session guard — requires a valid, unexpired, unrevoked DB session.
   * In production: bind to SessionProtection.requireSession.
   * In tests: may be omitted; auth context is supplied via getAuthContext stub.
   */
  requireSession?: RequestHandler;
  /**
   * Role guard — requires caller role === 'supervisor'.
   * In production: bind to SessionProtection.requireRole('supervisor').
   * In tests: may be omitted; role enforcement is exercised inside MilestoneService.
   */
  requireSupervisor?: RequestHandler;
  /**
   * Mutation guard — validates request source (Origin/Referer) and CSRF token.
   * In production: bind to SessionProtection.requireMutation.
   * In tests: may be omitted; CSRF is not exercised in unit tests.
   */
  requireMutation?: RequestHandler;
}

export function createMilestoneRouter(deps: MilestoneRouterDependencies): Router {
  const router = Router();
  const service = new MilestoneService(deps.prisma);

  // Build middleware arrays; skip optional guards when not provided (test mode only).
  const sessionGuard: RequestHandler[] = deps.requireSession ? [deps.requireSession] : [];
  const supervisorGuard: RequestHandler[] = deps.requireSupervisor ? [deps.requireSupervisor] : [];
  const mutationGuard: RequestHandler[] = deps.requireMutation ? [deps.requireMutation] : [];

  // POST /teams/:teamId/milestones
  // Order: requireSession → requireRole('supervisor') → requireMutation → requireJsonBody → parseJsonBody → controller
  router.post(
    '/teams/:teamId/milestones',
    ...sessionGuard,
    ...supervisorGuard,
    ...mutationGuard,
    requireJsonBody,
    parseJsonBody,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await deps.getAuthContext(req);
        const teamId = String(req.params.teamId);
        const milestone = await service.createMilestone(teamId, req.body, auth);
        res.status(201).json({ data: milestone });
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /teams/:teamId/milestones
  // Order: requireSession → controller   (role/scope enforced inside MilestoneService)
  router.get(
    '/teams/:teamId/milestones',
    ...sessionGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await deps.getAuthContext(req);
        const teamId = String(req.params.teamId);
        const milestones = await service.listMilestones(teamId, auth);
        res.json({
          data: milestones,
          meta: { serverTime: new Date().toISOString() },
        });
      } catch (err) {
        next(err);
      }
    },
  );

  // GET /milestones/:id
  // Order: requireSession → controller   (role/scope enforced inside MilestoneService)
  router.get(
    '/milestones/:id',
    ...sessionGuard,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const auth = await deps.getAuthContext(req);
        const id = String(req.params.id);
        const milestone = await service.getMilestone(id, auth);
        res.json({
          data: milestone,
          meta: { serverTime: new Date().toISOString() },
        });
      } catch (err) {
        next(err);
      }
    },
  );

  return router;
}
