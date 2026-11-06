import type { AuthDependencies } from './auth/index.js';
import { createAuthRouter, createSessionProtection } from './auth/index.js';
import { createTeamsRouter } from './teams/index.js';
import { createMilestoneRouter } from './milestones/index.js';
import { createFeedbackRouter } from './feedback/index.js';

/** Real fail-closed guards are mandatory for every composed milestone and feedback route. */
export function createApplicationRouters(deps: AuthDependencies) {
  const protection = createSessionProtection(deps);
  return {
    auth: createAuthRouter({ ...deps, protection }),
    teams: createTeamsRouter({ ...deps, protection }),
    milestones: createMilestoneRouter({
      prisma: deps.prisma,
      getAuthContext: protection.getAuthContext,
      requireSession: protection.requireSession,
      requireSupervisor: protection.requireRole('supervisor'),
      requireMutation: protection.requireMutation,
    }),
    feedback: createFeedbackRouter({
      prisma: deps.prisma,
      getAuthContext: protection.getAuthContext,
      requireSession: protection.requireSession,
      requireSupervisor: protection.requireRole('supervisor'),
      requireMutation: protection.requireMutation,
      now: deps.now,
    }),
  };
}
