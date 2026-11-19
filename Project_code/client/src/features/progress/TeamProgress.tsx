import { useEffect, useState } from 'react';
import { Button, EmptyState, StatusBadge } from '../../design/components';
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
} as const;

type ProgressMilestone = MilestoneItem & { status: keyof typeof statusBadges | 'CANCELLED' };

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
  const refresh = () => setAttempt(attempt => attempt + 1);

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
        <p className={styles.count} role="status">{progress.submitted} of {progress.total} active milestones submitted <strong>{progress.progressPercent.toFixed(1)}%</strong></p>
        <progress aria-label="Team submission progress" value={progress.progressPercent} max={100} />
        <p className={styles.note}>This measures submission completion only. Each active milestone with a saved submission counts once.</p>
        <div className={styles.refresh}>
          <p className={styles.note}>Status as of <time dateTime={progress.asOf}>{formatBangkok(progress.asOf)}</time>.</p>
          <Button variant="secondary" disabled={loading} onClick={refresh}>Refresh progress</Button>
        </div>
      </section>
      {progress.milestones.length === 0 ? <EmptyState title="No milestones yet" />
        : <section aria-labelledby="progress-milestones">
          <h2 id="progress-milestones">Milestones</h2>
          {progress.total === 0 && <p className={styles.note}>All milestones have been cancelled.</p>}
          <ul className={styles.milestones}>
            {progress.milestones.map(item => <li key={item.id} className={styles.milestone}>
              <div>
                <a href={`/milestones/${item.id}`}>{item.title}</a>
                <p className={styles.note}>Due <time dateTime={item.dueAt}>{formatBangkok(item.dueAt)}</time></p>
              </div>
              {item.status === 'CANCELLED' ? <span className={styles.cancelled}>Cancelled</span> : <StatusBadge status={statusBadges[item.status]} />}
            </li>)}
          </ul>
        </section>}
    </>}
  </>;
}
