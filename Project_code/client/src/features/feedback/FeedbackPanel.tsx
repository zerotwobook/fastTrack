import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, Field, Textarea } from '../../design/components';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import { formatBangkok } from '../milestones/MilestoneTrack';
import { countCodePoints, validateFeedbackContent } from '../../../../shared/feedback.mjs';
import styles from './feedback.module.css';

export interface FeedbackItem {
  id: string; submissionId: string; supervisor: { id: string; displayName: string };
  content: string; clientRequestId: string; createdAt: string;
}
export interface FeedbackPanelProps {
  submissionId: string; submissionVersion: number; userRole: 'student' | 'supervisor';
}
type Intent = { content: string; clientRequestId: string };
const chronological = (rows: FeedbackItem[]) => [...rows].sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt) || a.id.localeCompare(b.id));

/** Mounted with an exact submission key inside the authenticated workspace. */
export function FeedbackPanel({ submissionId, submissionVersion, userRole }: FeedbackPanelProps) {
  const [items, setItems] = useState<FeedbackItem[] | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [fieldError, setFieldError] = useState<string | undefined>();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [pending, setPending] = useState<Intent | null>(null);
  const [recovery, setRecovery] = useState<'checking' | 'blocked' | 'retry' | null>(null);
  const [attempt, setAttempt] = useState(0);
  const active = useRef(false);
  const busy = useRef(false);
  const intent = useRef<Intent | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const alert = useRef<HTMLParagraphElement>(null);
  const path = `/submissions/${submissionId}/feedback`;
  const fieldId = `feedback-content-${submissionId}`;
  useEffect(() => {
    active.current = true;
    return () => { active.current = false; };
  }, []);
  useEffect(() => {
    let current = true; setLoadError(null); setItems(null);
    void sessionStore.read<FeedbackItem[]>(path).then(rows => { if (current) setItems(chronological(rows)); })
      .catch(error => { if (current && !(error instanceof StaleSessionError)) setLoadError((error as Error).message); });
    return () => { current = false; };
  }, [path, attempt]);
  useEffect(() => { if (fieldError) form.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus(); else if (saveError) alert.current?.focus(); }, [fieldError, saveError]);

  const finish = (row: FeedbackItem) => {
    if (!active.current) return;
    setItems(previous => chronological([...(previous ?? []).filter(item => item.id !== row.id), row]));
    intent.current = null; setPending(null); setRecovery(null); setContent(''); setFieldError(undefined);
    setSaveError(null); setNotice(`Feedback saved for version ${submissionVersion}.`);
  };
  const reconcile = async (value: Intent) => {
    setRecovery('checking');
    try {
      const rows = await sessionStore.read<FeedbackItem[]>(path);
      if (!active.current) return;
      setItems(chronological(rows)); setLoadError(null);
      const saved = rows.find(row => row.supervisor.id === sessionStore.getSnapshot().auth?.user.id && row.clientRequestId.toLowerCase() === value.clientRequestId.toLowerCase());
      if (saved && saved.submissionId.toLowerCase() === submissionId.toLowerCase() && saved.content === value.content) { finish(saved); return; }
      if (saved) {
        setRecovery('blocked'); setSaveError('This save could not be matched to your draft. Keep this page open and contact your supervisor.'); return;
      }
      // A missing row does not prove an in-flight POST rolled back. Keep both the
      // original body and UUID frozen; a manual retry uses exactly that intent.
      setRecovery('retry'); setSaveError('This feedback is not in the saved list yet. Retry the same save; your draft is kept unchanged.');
    } catch (error) {
      if (!active.current || error instanceof StaleSessionError) return;
      setRecovery('blocked'); setSaveError('Saved feedback could not be checked. Check again before retrying the save. Your draft is kept.');
    }
  };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current || recovery === 'blocked' || recovery === 'checking') return;
    setSaveError(null); setNotice(null); setFieldError(undefined);
    let value = intent.current;
    if (!value) {
      const checked = validateFeedbackContent(content);
      if (!checked.valid) {
        setFieldError(checked.error ?? 'Enter valid feedback.');
        form.current?.querySelector<HTMLTextAreaElement>('textarea')?.focus();
        return;
      }
      if (!globalThis.crypto?.randomUUID) { setSaveError('Use a supported browser with a secure connection to save feedback.'); return; }
      value = { content: checked.value!, clientRequestId: crypto.randomUUID() };
      intent.current = value; setPending(value);
    }
    busy.current = true; setSaving(true);
    try {
      const saved = await sessionStore.mutate<FeedbackItem>(path, value);
      if (active.current) finish(saved);
    } catch (error) {
      if (!active.current || error instanceof StaleSessionError) return;
      if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
        // A definitive rejection made no write. A later edited draft is a new intent.
        intent.current = null; setPending(null); setRecovery(null);
        setFieldError(error.fields.content); setSaveError(error.message);
      } else {
        setSaveError('Checking whether your feedback was saved...');
        await reconcile(value);
      }
    } finally { busy.current = false; if (active.current) setSaving(false); }
  };
  const checkAgain = async () => {
    if (busy.current || !intent.current) return;
    busy.current = true; setSaving(true);
    try { await reconcile(intent.current); }
    finally { busy.current = false; if (active.current) setSaving(false); }
  };
  return <section className={styles.panel} aria-labelledby={`feedback-heading-${submissionId}`}>
    <h2 id={`feedback-heading-${submissionId}`}>Feedback for version {submissionVersion}</h2>
    {loadError ? <div className={styles.notice} role="alert"><p>{loadError}</p><Button variant="secondary" onClick={() => setAttempt(v => v + 1)}>Retry loading feedback</Button></div>
      : items === null ? <p className={styles.meta} role="status">Loading feedback...</p>
      : items.length === 0 ? <p className={styles.meta}>No feedback for this version yet.</p>
      : <ol className={styles.list} aria-label={`Saved feedback for version ${submissionVersion}`}>{items.map(item => <li key={item.id}>
        <article className={styles.entry}><h3>{item.supervisor.displayName}</h3>
          <time className={styles.meta} dateTime={item.createdAt}>{formatBangkok(item.createdAt)}</time>
          <p className={styles.content}>{item.content}</p>
        </article>
      </li>)}</ol>}
    {notice && <p role="status" className={styles.notice}>{notice}</p>}
    {userRole === 'supervisor' && <form ref={form} className={styles.form} onSubmit={event => { void submit(event); }} noValidate aria-busy={saving}>
      {saveError && <p ref={alert} tabIndex={-1} role="alert" className={styles.notice}>{saveError}</p>}
      <Field id={fieldId} label="Your feedback" {...(fieldError ? { error: fieldError } : {})} hint="Use 1 to 4,000 characters. Feedback stays with this version.">
        <Textarea id={fieldId} value={content} onChange={event => { setContent(event.target.value); setFieldError(undefined); setNotice(null); }}
          readOnly={pending !== null} disabled={saving} rows={5} required hasError={!!fieldError}
          aria-invalid={!!fieldError} aria-describedby={`${fieldId}-${fieldError ? 'error' : 'hint'}`} />
      </Field>
      <p className={styles.meta}>{countCodePoints(content.trim()).toLocaleString('en-US')} / 4,000 characters</p>
      {pending && <p className={styles.meta}>Your draft is locked until this save is confirmed.</p>}
      <div className={styles.actions}>
        <Button type="submit" loading={saving} disabled={saving || recovery === 'blocked' || recovery === 'checking'}>{saving ? recovery === 'checking' ? 'Checking saved feedback...' : 'Saving feedback...' : recovery === 'retry' ? 'Retry save' : 'Save feedback'}</Button>
        {recovery === 'blocked' && <Button variant="secondary" type="button" disabled={saving} onClick={() => { void checkAgain(); }}>Check saved feedback</Button>}
      </div>
    </form>}
  </section>;
}
