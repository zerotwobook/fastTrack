import type { AuthDependencies } from './auth/index.js';
import { createAuthRouter, createSessionProtection } from './auth/index.js';
import { createTeamsRouter } from './teams/index.js';

/** A owns composition. B's unmerged routes are deliberately not registered. */
export function createApplicationRouters(deps: AuthDependencies) {
  const protection = createSessionProtection(deps);
  return { auth: createAuthRouter({ ...deps, protection }), teams: createTeamsRouter({ ...deps, protection }) };
}
