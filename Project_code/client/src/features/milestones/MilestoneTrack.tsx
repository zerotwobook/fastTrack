import { useState, useEffect } from 'react';
import { Button, Field, Input, Textarea, StatusBadge, EmptyState, ErrorMessage } from '../../design/components';
import styles from './milestones.module.css';

export interface MilestoneItem {
  id: string;
  teamId: string;
  title: string;
  description: string;
  dueAt: string;
  cancelledAt: string | null;
  createdAt: string;
  latestSubmission: {
    id: string;
    version: number;
    submittedAt: string;
    feedbackCount: number;
  } | null;
}

interface MilestoneTrackProps {
  teamId: string;
  userRole: 'student' | 'supervisor';
  currentUserId: string;
}

export function MilestoneTrack({ teamId, userRole }: MilestoneTrackProps) {
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state for Supervisor creation
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchMilestones = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/teams/${teamId}/milestones`);
      if (!res.ok) {
        throw new Error('Failed to load milestones');
      }
      const data = await res.json();
      setMilestones(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error loading milestones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, [teamId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);

    try {
      const formattedDueAt = new Date(dueAt).toISOString();
      const res = await fetch(`/api/teams/${teamId}/milestones`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          dueAt: formattedDueAt,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error?.message || 'Failed to create milestone');
      }

      setTitle('');
      setDescription('');
      setDueAt('');
      setShowCreateForm(false);
      await fetchMilestones();
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Failed to create milestone');
    } finally {
      setSubmitting(false);
    }
  };

  const formatAsiaBangkok = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Bangkok',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).format(date) + ' (Asia/Bangkok)';
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return <div className={styles.loadingState}>Loading milestones…</div>;
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <ErrorMessage message={error} />
        <Button variant="secondary" onClick={fetchMilestones}>Retry</Button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.heading}>Milestones</h2>
        {userRole === 'supervisor' && !showCreateForm && (
          <Button variant="primary" onClick={() => setShowCreateForm(true)}>
            Add Milestone
          </Button>
        )}
      </header>

      {showCreateForm && (
        <form onSubmit={handleCreate} className={styles.createForm}>
          <h3>New Milestone</h3>
          {formError && <ErrorMessage message={formError} />}

          <Field id="title" label="Title">
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Deliverable 1 Submission"
              maxLength={120}
              required
            />
          </Field>

          <Field id="description" label="Description">
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Requirements and expected artifacts"
              maxLength={2000}
            />
          </Field>

          <Field id="dueAt" label="Due Date (Asia/Bangkok)">
            <Input
              id="dueAt"
              type="datetime-local"
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              required
            />
          </Field>

          <div className={styles.formActions}>
            <Button variant="primary" type="submit" loading={submitting}>
              Create Milestone
            </Button>
            <Button variant="ghost" type="button" onClick={() => setShowCreateForm(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {milestones.length === 0 ? (
        <EmptyState
          title="No milestones yet"
          description={
            userRole === 'supervisor'
              ? 'Create the first milestone to schedule submissions for this team.'
              : 'Your supervisor has not scheduled any milestones yet.'
          }
        />
      ) : (
        <div className={styles.milestoneList}>
          {milestones.map((m) => {
            const isSubmitted = !!m.latestSubmission;
            const isOverdue = !isSubmitted && new Date(m.dueAt).getTime() < Date.now();

            return (
              <div key={m.id} className={styles.milestoneCard}>
                <div className={styles.cardMain}>
                  <div className={styles.dateBadge}>{formatAsiaBangkok(m.dueAt)}</div>
                  <h4 className={styles.cardTitle}>{m.title}</h4>
                  {m.description && <p className={styles.cardDesc}>{m.description}</p>}
                </div>

                <div className={styles.cardSide}>
                  <StatusBadge
                    status={
                      isSubmitted
                        ? (m.latestSubmission?.feedbackCount ?? 0) > 0
                          ? 'feedback'
                          : 'submitted'
                        : isOverdue
                          ? 'overdue'
                          : 'pending'
                    }
                  />

                  {userRole === 'student' && !isSubmitted && !isOverdue && (
                    <Button variant="primary">Submit</Button>
                  )}
                  {isSubmitted && (
                    <Button variant="secondary">View Submission</Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
