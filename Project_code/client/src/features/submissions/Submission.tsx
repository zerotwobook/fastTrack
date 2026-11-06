import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button, Field, Input, Textarea } from '../../design/components';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { formatBangkok } from '../milestones/MilestoneTrack';
import type { MilestoneItem } from '../milestones/MilestoneTrack';
import { codePointLength } from '../../../../shared/milestones.mjs';
import { isWorkUrl, parseSubmissionInput, SubmissionInputError } from '../../../../shared/submissions.mjs';
import styles from './submissions.module.css';

export interface SubmissionRecord {
  id: string; milestoneId: string; submittedBy: { id: string; displayName: string }; version: number;
  title: string; description: string; url: string; submittedAt: string;
}
interface Context { id: string; milestone: MilestoneItem; team: Team; serverTime: string }

function Existing({ item }: { item: SubmissionRecord }) {
  return <section className={styles.notice} aria-label="Existing team submission">
    <h2>Your team has already submitted work</h2>
    <p>Submitted by {item.submittedBy.displayName}, version {item.version}, {formatBangkok(item.submittedAt)}.</p>
    <a href={`/submissions/${item.id}`}>Open saved submission</a>
  </section>;
}

export function SubmissionCreate({ milestoneId, userRole }: { milestoneId: string; userRole: 'student' | 'supervisor' }) {
  const [context, setContext] = useState<Context | null>(null);
  const [existing, setExisting] = useState<SubmissionRecord | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Readonly<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [uncertain, setUncertain] = useState(false);
  const busy = useRef(false);
  const alive = useRef(true);
  const summary = useRef<HTMLDivElement>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (error) summary.current?.focus(); }, [error, fields]);
  useEffect(() => {
    let active = true;
    setContext(null); setExisting(null); setError(null);
    void (async () => {
      const response = await sessionStore.readDomain<MilestoneItem>(`/milestones/${milestoneId}`);
      const [team, saved] = await Promise.all([
        sessionStore.read<Team>(`/teams/${response.data.teamId}`),
        sessionStore.readDomain<SubmissionRecord[]>(`/milestones/${milestoneId}/submissions`),
      ]);
      if (active) {
        setContext({ id: milestoneId, milestone: response.data, team, serverTime: saved.meta.serverTime });
        setExisting(saved.data[0] ?? null);
      }
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [milestoneId, attempt]);

  const recover = async (message: string) => {
    setUncertain(true); setChecking(true); setError(message);
    try {
      const [saved, milestone] = await Promise.all([
        sessionStore.readDomain<SubmissionRecord[]>(`/milestones/${milestoneId}/submissions`),
        sessionStore.readDomain<MilestoneItem>(`/milestones/${milestoneId}`),
      ]);
      if (!alive.current) return;
      setExisting(saved.data[0] ?? null);
      setContext(current => current ? { ...current, milestone: milestone.data, serverTime: milestone.meta.serverTime } : current);
      setUncertain(false);
      setError(saved.data.length ? 'Saved team work was found. Review its author and time below.'
        : milestone.data.cancelledAt ? 'This milestone was cancelled. Your draft is still shown below.'
        : Date.parse(milestone.meta.serverTime) > Date.parse(milestone.data.dueAt) ? 'The deadline has passed. No saved submission was found; your draft is still shown below.'
        : 'No saved submission was found. Your draft is still here; you can try submitting again.');
    } catch (reason) {
      if (alive.current && !(reason instanceof StaleSessionError)) {
        setError('The result is still uncertain. Check saved submissions before trying to submit again.');
      }
    } finally { if (alive.current) setChecking(false); }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current || uncertain || existing || !context) return;
    setError(null); setFields({});
    let input;
    try { input = parseSubmissionInput({ title, description, url }); }
    catch (reason) {
      if (reason instanceof SubmissionInputError) { setFields(reason.fields); setError(reason.message); }
      return;
    }
    busy.current = true; setSaving(true);
    try {
      const saved = await sessionStore.mutate<SubmissionRecord>(`/milestones/${milestoneId}/submissions`, input);
      if (alive.current) location.assign(`/submissions/${saved.id}`);
    } catch (reason) {
      if (!alive.current || reason instanceof StaleSessionError) return;
      if (reason instanceof ApiError) {
        setFields(reason.fields);
        if (reason.status === 0 || reason.status >= 500 || reason.status === 409) {
          await recover(reason.message);
          return;
        }
      }
      setError((reason as Error).message);
    } finally { busy.current = false; if (alive.current) setSaving(false); }
  };

  if (userRole !== 'student') return <section className={styles.notice} role="alert"><h1>Student submission only</h1><p>Only a student on this team can submit work.</p><a href={`/milestones/${milestoneId}`}>Back to milestone</a></section>;
  if (!context || context.id !== milestoneId) return <section><h1>Submit work</h1>{error
    ? <div role="alert" className={styles.notice}><p>{error}</p><Button onClick={() => setAttempt(v => v + 1)}>Try again</Button><a href="/">Back to overview</a></div>
    : <p role="status">Loading milestone and saved submissions...</p>}</section>;
  const closed = !!context.milestone.cancelledAt || Date.parse(context.serverTime) > Date.parse(context.milestone.dueAt);
  const disabled = saving || checking || uncertain || !!existing || closed;
  const described = (key: string) => `submission-${key}-${fields[key] ? 'error' : 'hint'}`;
  return <>
    <p className={styles.breadcrumb}><a href={`/teams/${context.team.id}`}>{context.team.name}</a> / <a href={`/milestones/${milestoneId}`}>{context.milestone.title}</a></p>
    <h1>Submit work</h1>
    <p className={styles.context}>Deadline: <time dateTime={context.milestone.dueAt}>{formatBangkok(context.milestone.dueAt)}</time>.</p>
    <p className={styles.context}>One submission is shared by your team for this milestone.</p>
    {error && <div ref={summary} role="alert" tabIndex={-1} className={styles.notice}><p>{error}</p>
      {uncertain && <Button variant="secondary" disabled={checking || saving} onClick={() => { void recover('Checking saved submissions...'); }}>{checking ? 'Checking saved work...' : 'Check saved submissions'}</Button>}
    </div>}
    {existing && <Existing item={existing} />}
    {closed && !existing && <p className={styles.notice}>{context.milestone.cancelledAt ? 'This milestone was cancelled and cannot receive work.' : 'The deadline has passed. Work cannot be submitted.'}</p>}
    <form className={styles.form} noValidate onSubmit={event => { void submit(event); }}>
      <Field id="submission-title" label="Title" hint={`${codePointLength(title.trim())}/120 characters`} {...(fields.title ? { error: fields.title } : {})}>
        <Input id="submission-title" name="title" required value={title} disabled={saving || checking} onChange={event => setTitle(event.target.value)} aria-invalid={!!fields.title} aria-describedby={described('title')} />
      </Field>
      <Field id="submission-description" label="Description" hint={`${codePointLength(description.trim())}/4,000 characters`} {...(fields.description ? { error: fields.description } : {})}>
        <Textarea id="submission-description" name="description" required value={description} disabled={saving || checking} onChange={event => setDescription(event.target.value)} aria-invalid={!!fields.description} aria-describedby={described('description')} />
      </Field>
      <Field id="submission-url" label="Work link" hint="Use a complete http:// or https:// link your supervisor can open. Check its sharing permissions before submitting." {...(fields.url ? { error: fields.url } : {})}>
        <Input id="submission-url" name="url" type="url" required value={url} disabled={saving || checking} onChange={event => setUrl(event.target.value)} aria-invalid={!!fields.url} aria-describedby={described('url')} />
      </Field>
      <div className={styles.actions}><Button type="submit" loading={saving} disabled={disabled}>{saving ? 'Submitting work...' : 'Submit work'}</Button><a href={`/milestones/${milestoneId}`}>Back to milestone</a></div>
    </form>
  </>;
}

export function SubmissionDetail({ id, renderFeedback }: { id: string; renderFeedback?: (submission: SubmissionRecord) => ReactNode }) {
  const [result, setResult] = useState<{ id: string; item: SubmissionRecord; milestone: MilestoneItem; team: Team } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; setResult(null); setError(null);
    void (async () => {
      const item = await sessionStore.read<SubmissionRecord>(`/submissions/${id}`);
      const milestone = await sessionStore.read<MilestoneItem>(`/milestones/${item.milestoneId}`);
      const team = await sessionStore.read<Team>(`/teams/${milestone.teamId}`);
      if (active) setResult({ id, item, milestone, team });
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [id, attempt]);
  if (error) return <><h1>Submission unavailable</h1><div role="alert" className={styles.notice}><p>{error}</p><Button onClick={() => setAttempt(v => v + 1)}>Try again</Button><a href="/">Back to overview</a></div></>;
  if (!result || result.id !== id) return <p role="status">Loading saved submission...</p>;
  const { item, milestone, team } = result;
  return <>
    <p className={styles.breadcrumb}><a href={`/teams/${team.id}`}>{team.name}</a> / <a href={`/milestones/${milestone.id}`}>{milestone.title}</a> / Saved submission</p>
    <h1>{item.title}</h1>
    <p className={styles.context}>Version {item.version}, submitted by {item.submittedBy.displayName}.</p>
    <p className={styles.context}><time dateTime={item.submittedAt}>{formatBangkok(item.submittedAt)}</time></p>
    <div className={renderFeedback ? styles.withFeedback : styles.content}>
      <section aria-label="Saved work"><h2>Description</h2><p className={styles.description}>{item.description}</p>
        <h2>Work link</h2>{isWorkUrl(item.url)
          ? <><a className={styles.workLink} href={item.url} target="_blank" rel="noopener noreferrer">Open work link</a><p className={styles.url}>{item.url}</p></>
          : <p className={styles.notice}>This saved link cannot be opened safely. Contact the submitting team member.</p>}
      </section>
      {renderFeedback && <aside aria-label={`Feedback for version ${item.version}`}>{renderFeedback(item)}</aside>}
    </div>
  </>;
}
