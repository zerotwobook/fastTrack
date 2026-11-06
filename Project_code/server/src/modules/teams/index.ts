import { Router } from 'express';
import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { database } from '../auth/security.js';
import type { AuthContext, AuthDependencies, SessionProtection } from '../auth/index.js';

export function scopedTeamWhere(auth: AuthContext): Prisma.TeamWhereInput {
  return auth.role === 'supervisor' ? { supervisorId: auth.userId } : { members: { some: { studentId: auth.userId } } };
}
export function requireUuid(value: string): void {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) {
    throw new AppError(400, 'INVALID_INPUT', 'Provide a valid resource identifier.');
  }
}
/** Pass the operation's transaction client when rechecking mutation scope. */
export async function requireTeamAccess(db: Pick<PrismaClient, 'team'>, auth: AuthContext, id: string) {
  requireUuid(id);
  const team = await database(() => db.team.findFirst({ where: { id, ...scopedTeamWhere(auth) }, select: { id: true } }));
  if (!team) throw new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
  return team;
}
const select = {
  id: true, name: true, supervisor: { select: { id: true, name: true } },
  members: { select: { student: { select: { id: true, name: true } } }, orderBy: [{ student: { name: 'asc' } }, { studentId: 'asc' }] },
} satisfies Prisma.TeamSelect;
type Team = Prisma.TeamGetPayload<{ select: typeof select }>;
const dto = (team: Team) => ({ id: team.id, name: team.name,
  supervisor: { id: team.supervisor.id, displayName: team.supervisor.name },
  members: team.members.map(({ student }) => ({ id: student.id, displayName: student.name })) });

export function createTeamsRouter({ prisma, protection, now = () => new Date() }: AuthDependencies & { readonly protection: SessionProtection }): Router {
  const router = Router();
  router.get('/teams', protection.requireSession, async (req, res) => {
    const auth = await protection.getAuthContext(req);
    const teams = await database(() => prisma.team.findMany({ where: scopedTeamWhere(auth), select, orderBy: [{ name: 'asc' }, { id: 'asc' }] }));
    res.json({ data: teams.map(dto), meta: { serverTime: now().toISOString() } });
  });
  router.get('/teams/:id', protection.requireSession, async (req, res) => {
    const auth = await protection.getAuthContext(req);
    const id = String(req.params.id);
    requireUuid(id);
    const team = await database(() => prisma.team.findFirst({ where: { id, ...scopedTeamWhere(auth) }, select }));
    if (!team) throw new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');
    res.json({ data: dto(team), meta: { serverTime: now().toISOString() } });
  });
  return router;
}
