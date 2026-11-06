import React, { useState, useEffect, useCallback } from 'react';
import styles from './feedback.module.css';
import { validateFeedbackContent } from '../../../../shared/feedback.mjs';

export interface FeedbackSupervisor {
  id: string;
  displayName: string;
}

export interface FeedbackItem {
  id: string;
  submissionId: string;
  supervisor: FeedbackSupervisor;
  content: string;
  clientRequestId: string;
  createdAt: string;
}

export interface FeedbackPanelProps {
  submissionId: string;
  submissionVersion: number;
  userRole: 'student' | 'supervisor';
  currentUserId?: string;
  csrfToken?: string;
}

/**
 * Format timestamp in Asia/Bangkok timezone with seconds precision.
 * Example: "07 Nov 2026, 01:30:00 (Asia/Bangkok)"
 */
function formatBangkokDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    const datePart = d.toLocaleDateString('en-GB', {
      timeZone: 'Asia/Bangkok',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    const timePart = d.toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Bangkok',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    return `${datePart}, ${timePart} (Asia/Bangkok)`;
  } catch {
    return isoString;
  }
}

export function FeedbackPanel({
  submissionId,
  submissionVersion,
  userRole,
  csrfToken,
}: FeedbackPanelProps) {
  const [items, setItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Supervisor creation form state
  const [content, setContent] = useState('');
  const [clientRequestId, setClientRequestId] = useState(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'req-' + Date.now(),
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchFeedback = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/feedback`, {
        headers: { 'Accept': 'application/json' },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message || `Failed to load feedback (${res.status})`);
      }
      const data = await res.json();
      setItems(data.data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load feedback');
    } finally {
      setLoading(false);
    }
  }, [submissionId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const validation = validateFeedbackContent(content);
    if (!validation.valid) {
      setSubmitError(validation.error || 'Please enter valid feedback content.');
      return;
    }

    setIsSubmitting(true);
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }

      const res = await fetch(`/api/submissions/${submissionId}/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          content: validation.value,
          clientRequestId,
        }),
      });

      const body = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(body?.error?.message || `Failed to submit feedback (${res.status})`);
      }

      // Success: 201 Created or 200 Replay
      const returnedItem: FeedbackItem = body.data;
      setItems((prev) => {
        const exists = prev.some((item) => item.id === returnedItem.id);
        if (exists) {
          return prev.map((item) => (item.id === returnedItem.id ? returnedItem : item));
        }
        return [...prev, returnedItem];
      });

      // Clear input and generate fresh clientRequestId for the next submission
      setContent('');
      setClientRequestId(
        typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'req-' + Date.now(),
      );
    } catch (err: unknown) {
      // Keep existing clientRequestId so retrying sends the same intent (§9.5)
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className={styles.panel} aria-labelledby="feedback-heading">
      <div className={styles.header}>
        <h3 id="feedback-heading" className={styles.title}>
          Feedback
        </h3>
        <span className={styles.versionBadge}>Version {submissionVersion}</span>
      </div>

      {error && (
        <div className={styles.errorBanner} role="alert">
          <span>{error}</span>
          <button type="button" className={styles.retryBtn} onClick={fetchFeedback}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className={styles.empty}>Loading feedback...</div>
      ) : items.length === 0 ? (
        <div className={styles.empty}>No feedback has been added for this submission yet.</div>
      ) : (
        <div className={styles.list}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.author}>{item.supervisor.displayName}</span>
                <time className={styles.time} dateTime={item.createdAt}>
                  {formatBangkokDateTime(item.createdAt)}
                </time>
              </div>
              <p className={styles.content}>{item.content}</p>
            </article>
          ))}
        </div>
      )}

      {userRole === 'supervisor' && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h4 className={styles.formTitle}>Add Feedback</h4>

          {submitError && (
            <div className={styles.errorBanner} role="alert">
              <span>{submitError}</span>
            </div>
          )}

          <label htmlFor={`feedback-content-${submissionId}`} className="sr-only">
            Feedback Content
          </label>
          <textarea
            id={`feedback-content-${submissionId}`}
            className={styles.textarea}
            placeholder="Write constructive, version-specific feedback..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
            maxLength={4000}
            rows={4}
            required
          />

          <div className={styles.formFooter}>
            <span className={styles.counter}>{content.trim().length} / 4000 characters</span>
            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !content.trim()}>
              {isSubmitting ? 'Saving...' : 'Save Feedback'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
