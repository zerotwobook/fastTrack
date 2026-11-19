import { Router } from 'express';
import { AppError, parseJsonBody, requireJsonBody } from '../../http/errors.js';
import { database } from '../auth/security.js';
import type { AuthDependencies, SessionProtection } from '../auth/index.js';
import { requireUuid, scopedTeamWhere, teamDto, teamNotFound, teamSelect } from './model.js';
import { addTeamMember, createTeam, listAvailableStudents, removeTeamMember, renameTeam } from './planning.js';

export { requireTeamAccess, requireUuid, scopedTeamWhere } from './model.js';
export type { TeamActor } from './model.js';

export function createTeamsRouter({ prisma, protection, now = () => new Date() }: AuthDependencies & { readonly protection: SessionProtection }): Router {
  const router = Router();
  const supervisor = [protection.requireSession, protection.requireRole('supervisor')];
  const mutation = [...supervisor, protection.requireMutation];
  const jsonMutation = [...mutation, requireJsonBody, parseJsonBody];
  router.get('/teams', protection.requireSession, async (req, res) => {
    const auth = await protection.getAuthContext(req);
    const teams = await database(() => prisma.team.findMany({
      where: scopedTeamWhere(auth), select: teamSelect, orderBy: [{ name: 'asc' }, { id: 'asc' }],
    }));
    res.json({ data: teams.map(teamDto), meta: { serverTime: now().toISOString() } });
  });
  router.get('/teams/:id', protection.requireSession, async (req, res) => {
    const auth = await protection.getAuthContext(req);
    const id = String(req.params.id);
    requireUuid(id);
    const team = await database(() => prisma.team.findFirst({ where: { id, ...scopedTeamWhere(auth) }, select: teamSelect }));
    if (!team) throw teamNotFound();
    res.json({ data: teamDto(team), meta: { serverTime: now().toISOString() } });
  });
  router.post('/teams', ...jsonMutation, async (req, res) => {
    const data = await createTeam(prisma, await protection.getAuthContext(req), req.body);
    res.status(201).json({ data });
  });
  router.patch('/teams/:id', ...jsonMutation, async (req, res) => {
    const data = await renameTeam(prisma, await protection.getAuthContext(req), String(req.params.id), req.body);
    res.json({ data });
  });
  router.get('/students/available', ...supervisor, async (req, res) => {
    res.json(await listAvailableStudents(prisma, req.query));
  });
  router.post('/teams/:id/members', ...jsonMutation, async (req, res) => {
    const data = await addTeamMember(prisma, await protection.getAuthContext(req), String(req.params.id), req.body);
    res.json({ data });
  });
  router.delete('/teams/:id/members/:studentId', ...mutation, async (req, res) => {
    if (Number(req.get('Content-Length')) > 0 || req.get('Transfer-Encoding')) {
      throw new AppError(400, 'INVALID_INPUT', 'Remove the request body before removing a member.');
    }
    await removeTeamMember(prisma, await protection.getAuthContext(req), String(req.params.id), String(req.params.studentId));
    res.status(204).end();
  });
  return router;
}
