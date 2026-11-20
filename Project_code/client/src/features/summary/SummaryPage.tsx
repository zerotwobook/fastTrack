import { useEffect, useState } from 'react';
import type { MouseEvent } from 'react';
import type { SummaryData, SummaryTeam } from '../../../../shared/summary.mjs';
import { Button, Field } from '../../design/components';
import { Icon } from '../../design/Icon';
import { sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { DrilldownList } from './DrilldownList';
import {
  buildSummaryUrl, parseSummarySearch, SUMMARY_DEFAULT_PAGE, SUMMARY_DEFAULT_PAGE_SIZE, SUMMARY_STATUS_ORDER,
} from './navigation';
import type { SummaryFilters, SummaryStatus } from './navigation';
import styles from './SummaryPage.module.css';

const statusLabels: Record<SummaryStatus, string> = {
  PENDING: 'Pending',
  OVERDUE: 'Overdue',
  SUBMITTED: 'Submitted',
  FEEDBACK_AVAILABLE: 'Feedback available',
  CANCELLED: 'Cancelled',
};

const defaultFilters: SummaryFilters = {
  teamId: null, status: null, page: SUMMARY_DEFAULT_PAGE, pageSize: SUMMARY_DEFAULT_PAGE_SIZE,
};

type TeamOption = Pick<Team, 'id' | 'name'>;
type Result = { path: string; attempt: number } & (
  | { data: SummaryData; error?: never }
  | { data?: never; error: string }
);

function navigateToSummary(href: string) {
  if (href === location.pathname + location.search) return;
  history.pushState(null, '', href);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

function followSummaryLink(event: MouseEvent<HTMLAnchorElement>) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  navigateToSummary(event.currentTarget.pathname + event.currentTarget.search);
}

function filterHref(filters: SummaryFilters, updates: Partial<SummaryFilters>) {
  return buildSummaryUrl({ ...filters, ...updates, page: SUMMARY_DEFAULT_PAGE });
}

function TeamRow({ team, filters }: { team: SummaryTeam; filters: SummaryFilters }) {
  return <tr>
    <th scope="row"><a href={filterHref(filters, { teamId: team.teamId })} onClick={followSummaryLink}>{team.teamName}</a></th>
    <td>{team.submitted}</td>
    <td>{team.total}</td>
    <td>{team.progressPercent.toFixed(1)}%</td>
    <td><a href={filterHref(filters, { teamId: team.teamId, status: 'PENDING' })} onClick={followSummaryLink}
      aria-label={`${team.pending} pending milestones for ${team.teamName}`}>{team.pending}</a></td>
    <td><a href={filterHref(filters, { teamId: team.teamId, status: 'OVERDUE' })} onClick={followSummaryLink}
      aria-label={`${team.overdue} overdue milestones for ${team.teamName}`}>{team.overdue}</a></td>
  </tr>;
}

function TeamCompletion({ data }: { data: SummaryData }) {
  const { totals, teams, filters } = data;
  return <section className={styles.completion} aria-labelledby="summary-completion">
    <h2 id="summary-completion">Team completion</h2>
    <p className={styles.note}>Each active milestone with a saved submission counts once. The milestone status filter applies to the matching results below.</p>
    <dl className={styles.totals}>
      <div><dt>Submission progress</dt><dd>{totals.progressPercent.toFixed(1)}%</dd></div>
      <div><dt>Submitted</dt><dd>{totals.submitted}</dd></div>
      <div><dt>Active milestones</dt><dd>{totals.total}</dd></div>
      <div><dt>Pending</dt><dd>{totals.pending}</dd></div>
      <div><dt>Overdue</dt><dd>{totals.overdue}</dd></div>
    </dl>
    {teams.length > 0 && <div className={styles.tableFrame} role="region" aria-label="Completion by team" tabIndex={0}>
      <table className={styles.teamTable} aria-label="Team completion breakdown">
        <thead><tr>
          <th scope="col">Team</th>
          <th scope="col">Submitted</th>
          <th scope="col">Active</th>
          <th scope="col">Progress</th>
          <th scope="col">Pending</th>
          <th scope="col">Overdue</th>
        </tr></thead>
        <tbody>{teams.map(team => <TeamRow key={team.teamId} team={team} filters={filters} />)}</tbody>
      </table>
    </div>}
  </section>;
}

export function SummaryPage({ search }: { search: string }) {
  const parsed = parseSummarySearch(search);
  const filters = parsed.ok ? parsed.filters : defaultFilters;
  const path = parsed.ok ? buildSummaryUrl(filters) : null;
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<Result | null>(null);
  const [teamOptions, setTeamOptions] = useState<TeamOption[] | null>(null);
  const [teamOptionsError, setTeamOptionsError] = useState(false);

  useEffect(() => {
    if (!path) return;
    let current = true;
    setResult(null);
    void sessionStore.readDomain<SummaryData>(path).then(({ data }) => {
      if (current) setResult({ path, attempt, data });
    }).catch((reason: unknown) => {
      if (!current || reason instanceof StaleSessionError) return;
      const error = reason instanceof Error ? reason.message : 'Unable to load the summary.';
      setResult({ path, attempt, error });
    });
    return () => { current = false; };
  }, [path, attempt]);

  useEffect(() => {
    let current = true;
    setTeamOptionsError(false);
    void sessionStore.read<TeamOption[]>('/teams').then(teams => {
      if (current) setTeamOptions(teams.map(({ id, name }) => ({ id, name })));
    }).catch((error: unknown) => {
      if (!current || error instanceof StaleSessionError) return;
      setTeamOptions(null);
      setTeamOptionsError(true);
    });
    return () => { current = false; };
  }, [attempt]);

  const current = result && result.path === path && result.attempt === attempt ? result : null;
  const data = current?.data;
  const loading = path !== null && current === null;
  const choices = teamOptions ?? data?.teams.map(team => ({ id: team.teamId, name: team.teamName })) ?? [];
  const selectedTeamMissing = filters.teamId !== null && !choices.some(team => team.id === filters.teamId);
  const refresh = () => setAttempt(value => value + 1);

  return <div className={styles.page}>
    <div>
      <p className="breadcrumb"><a href="/">Overview</a> / Summary</p>
      <header className="workspace-heading">
        <h1>Summary</h1>
        <Button type="button" variant="secondary" disabled={!path || loading} onClick={refresh}>
          <Icon name="refresh" size={18} />Refresh summary
        </Button>
      </header>
    </div>

    <div role="group" aria-label="Summary filters" className={styles.filters}>
      <Field id="summary-team" label="Team">
        <select id="summary-team" className={styles.select} value={filters.teamId ?? ''} onChange={event =>
          navigateToSummary(filterHref(filters, { teamId: event.currentTarget.value || null }))}>
          <option value="">All supervised teams</option>
          {selectedTeamMissing && <option value={filters.teamId!} disabled>
            {current?.error ? 'Unavailable team' : 'Selected team'}
          </option>}
          {choices.map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
        </select>
      </Field>
      <Field id="summary-status" label="Milestone status">
        <select id="summary-status" className={styles.select} value={filters.status ?? ''} onChange={event =>
          navigateToSummary(filterHref(filters, { status: (event.currentTarget.value as SummaryStatus | '') || null }))}>
          <option value="">All statuses</option>
          {SUMMARY_STATUS_ORDER.map(status => <option key={status} value={status}>{statusLabels[status]}</option>)}
        </select>
      </Field>
      {teamOptionsError && <p className={styles.note} role="status">Team options are unavailable. Refresh the summary to try again.</p>}
    </div>

    {data && <TeamCompletion data={data} />}
    <DrilldownList
      asOf={data?.asOf ?? null}
      filters={data?.filters ?? filters}
      matchedCount={data?.matchedCount ?? 0}
      items={data?.items ?? []}
      loading={loading}
      error={current?.error ?? null}
      invalidFilters={parsed.ok ? null : parsed.errors}
      hasTeams={data ? data.teams.length > 0 : true}
      onPageChange={page => navigateToSummary(buildSummaryUrl({ ...filters, page }))}
      onPageSizeChange={pageSize => navigateToSummary(filterHref(filters, { pageSize }))}
      onRetry={refresh}
      onResetFilters={() => navigateToSummary('/summary')}
    />
  </div>;
}
