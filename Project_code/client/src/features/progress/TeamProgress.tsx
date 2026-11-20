import { useEffect, useState } from 'react';
import { Button, EmptyState, StatusBadge } from '../../design/components';
import { Icon } from '../../design/Icon';
import { sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { formatBangkok } from '../milestones/MilestoneTrack';
import type { MilestoneItem } from '../milestones/MilestoneTrack';
import styles from './progress.module.css';

const statusBadges = {
  PENDING: 'pending',
  OVERDUE: 'overdue',
  SUBMITTED: 'submitted',
  FEEDBACK_AVAILABLE: 'feedback',
  CANCELLED: 'cancelled',
} as const;

type ProgressMilestone = MilestoneItem & { status: keyof typeof statusBadges };

interface Progress {
  teamId: string;
  asOf: string;
  total: number;
  submitted: number;
  progressPercent: number;
  milestones: ProgressMilestone[];
}

export function TeamProgress({ teamId }: { teamId: string }) {
  const [result, setResult] = useState<{ team: Team; progress: Progress } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const teamPath = `/teams/${teamId}`;

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    void Promise.all([sessionStore.read<Team>(teamPath), sessionStore.read<Progress>(`${teamPath}/progress`)])
      .then(([team, progress]) => { if (active) setResult({ team, progress }); })
      .catch((reason: unknown) => {
        if (!active || reason instanceof StaleSessionError) return;
        setResult(null);
        setError(reason instanceof Error ? reason.message : 'Unable to load team progress.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [teamPath, attempt]);

  const progress = result?.progress;
  const refresh = () => {
    if (!loading) setAttempt(attempt => attempt + 1);
  };

  return <>
    <p className="breadcrumb"><a href="/">Overview</a>{result && <> / <a href={teamPath}>{result.team.name}</a></>}</p>
    <h1>Team progress</h1>
    {error && <section className="notice" role="alert">
      <p>{error}</p>
      <div className="recovery-actions"><Button variant="secondary" onClick={refresh}>Try again</Button><a href="/">Back to overview</a></div>
    </section>}
    {loading && <p className={styles.loading} role="status">Loading progress…</p>}
    {progress && <>
      <section className={styles.summary} aria-label="Submission progress">
        <div className={styles.summaryHeader}>
          <div className={styles.summaryTitle}>
            <span className={styles.summaryIcon}><Icon name="chart" size={22} /></span>
            <h2>Submission progress</h2>
          </div>
          <p className={styles.count} role="status">
            <span>{progress.submitted} of {progress.total} active milestones submitted</span>
            <strong>{progress.progressPercent.toFixed(1)}%</strong>
          </p>
        </div>
        <progress aria-label="Team submission progress" value={progress.progressPercent} max={100} />
        <p className={styles.summaryNote}>Each active milestone with a saved submission counts once.</p>
        <div className={styles.refresh}>
          <p className={styles.summaryNote}>Status as of <time dateTime={progress.asOf}>{formatBangkok(progress.asOf)}</time>.</p>
          <Button className={styles.refreshButton} variant="secondary" aria-disabled={loading} onClick={refresh}><Icon name="refresh" size={17} />Refresh progress</Button>
        </div>
      </section>
      {progress.milestones.length === 0 ? <EmptyState title="No milestones yet" />
        : <section aria-labelledby="progress-milestones">
          <h2 id="progress-milestones">Milestones</h2>
          {progress.total === 0 && <p className={styles.note}>All milestones have been cancelled.</p>}
          <ul className={styles.milestones}>
            {progress.milestones.map(item => <li key={item.id} className={styles.milestone}>
              <div className={styles.info}>
                <span className={styles.calendarIcon}><Icon name="calendar" size={18} /></span>
                <div>
                  <a href={`/milestones/${item.id}`}>{item.title}<Icon name="arrowRight" size={16} /></a>
                  <p className={styles.note}>Due <time dateTime={item.dueAt}>{formatBangkok(item.dueAt)}</time></p>
                </div>
              </div>
              <StatusBadge status={statusBadges[item.status]} />
            </li>)}
          </ul>
        </section>}
    </>}
  </>;
}
