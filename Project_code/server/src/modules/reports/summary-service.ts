import { Prisma } from '../../db/generated/client/index.js';
import type { PrismaClient } from '../../db/generated/client/index.js';
import type { SummaryFilters, SummaryResponse, SummaryTeam, SummaryTotals } from '../../../../shared/summary.mjs';
import type { TeamActor } from '../teams/model.js';
import { scopedTeamWhere, teamNotFound } from '../teams/model.js';
import { database } from '../auth/security.js';
import { progressStatus, submissionProgressPercent } from '../progress/calculation.js';
import { readDatabaseTimeMs } from '../shared/transactions.js';
import { readSummaryItems } from './summary-items.js';

type Counts = Omit<SummaryTotals, 'progressPercent'>;

function emptyCounts(): Counts {
  return { total: 0, submitted: 0, pending: 0, overdue: 0 };
}

function completion(counts: Counts): SummaryTotals {
  return { ...counts, progressPercent: submissionProgressPercent(counts.submitted, counts.total) };
}

async function readCompletion(
  tx: Prisma.TransactionClient,
  teams: readonly { id: string; name: string }[],
  asOf: Date,
): Promise<{ totals: SummaryTotals; teams: SummaryTeam[] }> {
  const countsByTeam = new Map(teams.map(team => [team.id, emptyCounts()]));
  const totals = emptyCounts();
  if (teams.length === 0) return { totals: completion(totals), teams: [] };

  const milestones = await tx.milestone.findMany({
    where: { teamId: { in: [...countsByTeam.keys()] }, cancelledAt: null },
    select: {
      teamId: true,
      dueAt: true,
      cancelledAt: true,
      submissions: {
        orderBy: { version: 'desc' },
        take: 1,
        select: { _count: { select: { feedback: true } } },
      },
    },
  });

  for (const milestone of milestones) {
    const latest = milestone.submissions[0];
    const status = progressStatus({
      cancelledAt: milestone.cancelledAt,
      dueAt: milestone.dueAt,
      latestSubmission: latest ? { feedbackCount: latest._count.feedback } : null,
    }, asOf.getTime());
    if (status === 'CANCELLED') continue;
    const team = countsByTeam.get(milestone.teamId)!;
    team.total++;
    if (status === 'PENDING') team.pending++;
    else if (status === 'OVERDUE') team.overdue++;
    else team.submitted++;
  }

  const teamRows = teams.map(team => {
    const counts = countsByTeam.get(team.id)!;
    totals.total += counts.total;
    totals.submitted += counts.submitted;
    totals.pending += counts.pending;
    totals.overdue += counts.overdue;
    return { teamId: team.id, teamName: team.name, ...completion(counts) };
  });

  return { totals: completion(totals), teams: teamRows };
}

/** Resolve the supervisor's scope, completion, and paged items in one database snapshot. */
export async function readSummary(
  prisma: PrismaClient,
  actor: TeamActor,
  filters: SummaryFilters,
): Promise<SummaryResponse> {
  const response = await database(() => prisma.$transaction(async tx => {
    await tx.$executeRaw`SET TRANSACTION READ ONLY`;
    const asOf = await readDatabaseTimeMs(tx);
    const teams = await tx.team.findMany({
      where: {
        ...scopedTeamWhere(actor),
        ...(filters.teamId === null ? {} : { id: filters.teamId }),
      },
      select: { id: true, name: true },
      orderBy: [{ name: 'asc' }, { id: 'asc' }],
    });
    if (filters.teamId !== null && teams.length === 0) return null;

    const overview = await readCompletion(tx, teams, asOf);
    const page = await readSummaryItems({ tx, teamIds: teams.map(team => team.id), asOf, filters });
    const serverTime = asOf.toISOString();
    return { data: { asOf: serverTime, filters, ...overview, ...page }, meta: { serverTime } };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }));

  if (!response) throw teamNotFound();
  return response;
}
