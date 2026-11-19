import { Prisma } from '../../db/generated/client/index.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';
import { parseTeamName, TeamNameInputError } from '../../../../shared/teams.mjs';
import { database } from '../auth/security.js';
import { lockScopedTeam, readDatabaseTimeMs, runDomainTransaction } from '../shared/transactions.js';
import { requireUuid, teamDto, teamNotFound, teamSelect } from './model.js';
import type { TeamActor } from './model.js';

const invalidInput = (field: string, message: string) =>
  new AppError(400, 'INVALID_INPUT', 'Check the highlighted team fields.', { [field]: message });
const membershipConflict = () =>
  new AppError(409, 'MEMBERSHIP_CONFLICT', 'This student is already assigned to a team. Refresh available students.');

function readField(value: unknown, key: 'name' | 'studentId'): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).length !== 1 || !Object.hasOwn(value, key)) {
    throw invalidInput('form', `Provide only ${key}.`);
  }
  return (value as Record<string, unknown>)[key];
}

function readName(value: unknown): string {
  const name = readField(value, 'name');
  try { return parseTeamName(name); }
  catch (error) {
    if (error instanceof TeamNameInputError) throw invalidInput('name', error.message);
    throw error;
  }
}

function requireStudentId(value: unknown): string {
  if (typeof value !== 'string') throw invalidInput('studentId', 'Provide a valid student identifier.');
  try { requireUuid(value); }
  catch (error) {
    if (error instanceof AppError) throw invalidInput('studentId', 'Provide a valid student identifier.');
    throw error;
  }
  return value;
}

async function requireEditableMembership(tx: Prisma.TransactionClient, actor: TeamActor, teamId: string) {
  await lockScopedTeam(tx, actor, teamId);
  const history = await tx.submission.findFirst({ where: { milestone: { teamId } }, select: { id: true } });
  if (history) throw new AppError(409, 'TEAM_HISTORY_LOCKED', 'Membership is locked because this team has submission history.');
}

function isMembershipUniqueConflict(error: unknown): boolean {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError) || error.code !== 'P2002') return false;
  const target = error.meta?.['target'];
  const adapter = error.meta?.['driverAdapterError'] as { cause?: { kind?: string; constraint?: { index?: string; fields?: string[] } } } | undefined;
  const constraint = adapter?.cause?.kind === 'UniqueConstraintViolation' ? adapter.cause.constraint : undefined;
  const matches = (fields: unknown) => Array.isArray(fields) && fields.length === 1 &&
    (fields[0] === 'student_id' || fields[0] === 'studentId');
  return target === 'team_members_student_id_key' || matches(target) ||
    constraint?.index === 'team_members_student_id_key' || matches(constraint?.fields);
}

export function createTeam(prisma: PrismaClient, actor: TeamActor, value: unknown) {
  const name = readName(value);
  return database(async () => teamDto(await prisma.team.create({
    data: { name, supervisorId: actor.userId }, select: teamSelect,
  })));
}

export function renameTeam(prisma: PrismaClient, actor: TeamActor, teamId: string, value: unknown) {
  const name = readName(value);
  return runDomainTransaction(prisma, async tx => {
    await lockScopedTeam(tx, actor, teamId);
    return teamDto(await tx.team.update({ where: { id: teamId }, data: { name }, select: teamSelect }));
  });
}

export function addTeamMember(prisma: PrismaClient, actor: TeamActor, teamId: string, value: unknown) {
  const studentId = requireStudentId(readField(value, 'studentId'));
  return runDomainTransaction(prisma, async tx => {
    await requireEditableMembership(tx, actor, teamId);
    const student = await tx.user.findFirst({ where: { id: studentId, role: 'student' }, select: { id: true } });
    if (!student) throw invalidInput('studentId', 'Choose a valid student.');
    if (await tx.teamMember.findUnique({ where: { studentId }, select: { studentId: true } })) throw membershipConflict();
    await tx.teamMember.create({ data: { teamId, studentId } });
    return teamDto(await tx.team.findUniqueOrThrow({ where: { id: teamId }, select: teamSelect }));
  }, error => isMembershipUniqueConflict(error) ? membershipConflict() :
    new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Refresh the team before trying again.'));
}

export function removeTeamMember(prisma: PrismaClient, actor: TeamActor, teamId: string, id: string) {
  const studentId = requireStudentId(id);
  return runDomainTransaction(prisma, async tx => {
    await requireEditableMembership(tx, actor, teamId);
    const removed = await tx.teamMember.deleteMany({ where: { teamId, studentId, student: { role: 'student' } } });
    if (removed.count === 0) throw teamNotFound();
  });
}

export function listAvailableStudents(prisma: PrismaClient, query: Readonly<Record<string, unknown>>) {
  const { limit: rawLimit, after: rawAfter } = query;
  if (Object.keys(query).some(key => key !== 'limit' && key !== 'after')) {
    throw invalidInput('form', 'Use only limit and after.');
  }
  const limit = rawLimit === undefined ? 20 :
    typeof rawLimit === 'string' && /^[0-9]+$/.test(rawLimit) ? Number(rawLimit) : 0;
  if (limit < 1 || limit > 100) throw invalidInput('limit', 'Enter a whole number from 1 to 100.');
  let after: string | undefined;
  if (rawAfter !== undefined) {
    if (typeof rawAfter !== 'string') throw invalidInput('after', 'Provide a valid cursor.');
    try { requireUuid(rawAfter); }
    catch (error) {
      if (error instanceof AppError) throw invalidInput('after', 'Provide a valid cursor.');
      throw error;
    }
    after = rawAfter;
  }
  const eligible = { role: 'student', teamMembership: { is: null } } satisfies Prisma.UserWhereInput;
  return database(() => prisma.$transaction(async tx => {
    const totalAvailable = await tx.user.count({ where: eligible });
    const rows = await tx.user.findMany({
      where: { ...eligible, ...(after === undefined ? {} : { id: { gt: after } }) },
      orderBy: { id: 'asc' }, take: limit + 1, select: { id: true, name: true },
    });
    const data = rows.slice(0, limit).map(({ id, name }) => ({ id, displayName: name }));
    return { data, meta: {
      serverTime: (await readDatabaseTimeMs(tx)).toISOString(),
      totalAvailable, nextCursor: rows.length > limit ? data[data.length - 1]!.id : null,
    } };
  }, { isolationLevel: 'RepeatableRead' }));
}
