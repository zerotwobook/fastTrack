import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { database } from '../auth/security.js';
import type { AuthContext } from '../auth/index.js';

export type TeamActor = Pick<AuthContext, 'userId' | 'role'>;

export function scopedTeamWhere(auth: TeamActor): Prisma.TeamWhereInput {
  return auth.role === 'supervisor' ? { supervisorId: auth.userId } : { members: { some: { studentId: auth.userId } } };
}

export function requireUuid(value: string): void {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i.test(value)) {
    throw new AppError(400, 'INVALID_INPUT', 'Provide a valid resource identifier.');
  }
}

export const teamNotFound = () => new AppError(404, 'NOT_FOUND', 'The requested resource was not found.');

/** Pass the operation's transaction client when rechecking mutation scope. */
export async function requireTeamAccess(db: Pick<PrismaClient, 'team'>, auth: TeamActor, id: string) {
  requireUuid(id);
  const team = await database(() => db.team.findFirst({ where: { id, ...scopedTeamWhere(auth) }, select: { id: true } }));
  if (!team) throw teamNotFound();
  return team;
}

export const teamSelect = {
  id: true, name: true, supervisor: { select: { id: true, name: true } },
  members: { select: { student: { select: { id: true, name: true } } }, orderBy: [{ student: { name: 'asc' } }, { studentId: 'asc' }] },
} satisfies Prisma.TeamSelect;

export function teamDto(team: Prisma.TeamGetPayload<{ select: typeof teamSelect }>) {
  return { id: team.id, name: team.name,
    supervisor: { id: team.supervisor.id, displayName: team.supervisor.name },
    members: team.members.map(({ student }) => ({ id: student.id, displayName: student.name })) };
}
