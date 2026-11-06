import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { Button, EmptyState, Field, Input, StatusBadge, Textarea } from '../../design/components';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { bangkokInputToIso, codePointLength, MilestoneInputError, parseMilestoneInput } from '../../../../shared/milestones.mjs';
import styles from './milestones.module.css';

export interface MilestoneItem {
  id: string; teamId: string; title: string; description: string; dueAt: string;
  cancelledAt: string | null; createdAt: string;
  latestSubmission: { id: string; version: number; submittedAt: string; feedbackCount: number } | null;
}
export const formatBangkok = (value: string) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
}).format(new Date(value)) + ' (Asia/Bangkok)';
function State({ item, serverTime }: { item: MilestoneItem; serverTime: string }) {
  if (item.cancelledAt) return <span className={styles.cancelled}>Cancelled</span>;
  return <StatusBadge status={item.latestSubmission ? item.latestSubmission.feedbackCount ? 'feedback' : 'submitted'
    : new Date(item.dueAt).getTime() < new Date(serverTime).getTime() ? 'overdue' : 'pending'} />;
}
function Failure({ message, retry }: { message: string; retry: () => void }) {
  return <div className={styles.error} role="alert"><p>{message}</p><Button variant="secondary" onClick={retry}>Try again</Button></div>;
}
export function MilestoneTrack({ teamId, userRole }: { teamId: string; userRole: 'student' | 'supervisor' }) {
  const [result, setResult] = useState<{ teamId: string; items: MilestoneItem[]; serverTime: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; setResult(null); setError(null);
    void sessionStore.readDomain<MilestoneItem[]>(`/teams/${teamId}/milestones`).then(response => {
      if (active) setResult({ teamId, items: response.data, serverTime: response.meta.serverTime });
    }).catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [teamId, attempt]);
  return <section className={styles.container} aria-label="Milestones">
    <header className={styles.header}><h2>Milestones</h2>{userRole === 'supervisor' && <a className={styles.primaryLink} href={`/teams/${teamId}/milestones/new`}>Create milestone</a>}</header>
    {error ? <Failure message={error} retry={() => setAttempt(value => value + 1)} />
      : !result || result.teamId !== teamId ? <p role="status">Loading milestones?</p>
      : <>{result.items.length === 0 ? <EmptyState title="No milestones yet" description={userRole === 'supervisor' ? 'Create a milestone to set the next deadline for your team.' : 'Your supervisor has not scheduled a milestone yet.'} />
        : <ol className={styles.track}>{result.items.map(item => <li key={item.id} className={styles.row}>
          <time dateTime={item.dueAt} className={styles.date}>{formatBangkok(item.dueAt)}</time><span className={styles.marker} aria-hidden="true" />
          <div className={styles.item}><h3><a href={`/milestones/${item.id}`}>{item.title}</a></h3><State item={item} serverTime={result.serverTime} />
            <p>{item.description}</p>{item.latestSubmission && <p className={styles.meta}>Version {item.latestSubmission.version} ? {item.latestSubmission.feedbackCount} feedback messages</p>}
            <a href={`/milestones/${item.id}`}>View milestone</a></div>
        </li>)}</ol>}
        <div className={styles.refresh}><p className={styles.meta}>Status as of {formatBangkok(result.serverTime)}.</p><Button variant="ghost" onClick={() => setAttempt(value => value + 1)}>Refresh milestones</Button></div>
      </>}
  </section>;
}
export function MilestoneCreate({ teamId, userRole }: { teamId: string; userRole: 'student' | 'supervisor' }) {
  const [title, setTitle] = useState(''); const [description, setDescription] = useState(''); const [dueAt, setDueAt] = useState('');
  const [saving, setSaving] = useState(false); const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Readonly<Record<string, string>>>({}); const [uncertain, setUncertain] = useState(false);
  const summary = useRef<HTMLDivElement>(null); const busy = useRef(false); const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (error) summary.current?.focus(); }, [error]);
  if (userRole !== 'supervisor') return <div role="alert" className={styles.error}><p>Only the assigned supervisor can create milestones.</p><a href={`/teams/${teamId}`}>Back to team</a></div>;
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy.current || uncertain) return;
    setError(null); setFields({});
    let input;
    try { input = parseMilestoneInput({ title, description, dueAt: bangkokInputToIso(dueAt) }); }
    catch (reason) { if (reason instanceof MilestoneInputError) { setFields(reason.fields); setError(reason.message); } return; }
    busy.current = true; setSaving(true);
    try {
      const result = await sessionStore.mutate<MilestoneItem>(`/teams/${teamId}/milestones`, input);
      if (alive.current) location.assign(`/milestones/${result.id}`);
    } catch (reason) {
      if (!alive.current || reason instanceof StaleSessionError) return;
      const unknown = reason instanceof ApiError && (reason.status === 0 || reason.status >= 500);
      if (reason instanceof ApiError) setFields(reason.fields);
      setUncertain(unknown); setError(unknown ? 'The result could not be confirmed. Check the milestone list before creating another milestone.' : (reason as Error).message);
    } finally { busy.current = false; if (alive.current) setSaving(false); }
  };
  const described = (id: string) => `${id}-${fields[id] ? 'error' : 'hint'}`;
  return <section className={styles.container}><h2>Create milestone</h2><p className={styles.meta}>Set the work and deadline for this team.</p>
    {error && <div ref={summary} tabIndex={-1} role="alert" className={styles.error}><p>{error}</p>{uncertain && <a href={`/teams/${teamId}`}>Check milestone list</a>}</div>}
    <form className={styles.form} onSubmit={event => { void submit(event); }}>
      <Field id="title" label="Title" hint={`${codePointLength(title.trim())}/120 characters`} {...(fields.title ? { error: fields.title } : {})}>
        <Input id="title" name="title" required value={title} onChange={event => setTitle(event.target.value)} disabled={saving} aria-invalid={!!fields.title} aria-describedby={described('title')} />
      </Field>
      <Field id="description" label="Description" hint={`${codePointLength(description.trim())}/4,000 characters`} {...(fields.description ? { error: fields.description } : {})}>
        <Textarea id="description" name="description" required value={description} onChange={event => setDescription(event.target.value)} disabled={saving} aria-invalid={!!fields.description} aria-describedby={described('description')} />
      </Field>
      <Field id="dueAt" label="Deadline in Asia/Bangkok" hint="A time entered as HH:mm uses seconds 00, not the end of that minute." {...(fields.dueAt ? { error: fields.dueAt } : {})}>
        <Input id="dueAt" name="dueAt" type="datetime-local" step="60" required value={dueAt} onChange={event => setDueAt(event.target.value)} disabled={saving} aria-invalid={!!fields.dueAt} aria-describedby={described('dueAt')} />
      </Field>
      <div className={styles.actions}><Button type="submit" loading={saving} disabled={saving || uncertain}>{saving ? 'Creating milestone?' : 'Create milestone'}</Button><a href={`/teams/${teamId}`}>Back to team</a></div>
    </form>
  </section>;
}
export function MilestoneDetail({ id }: { id: string }) {
  const [result, setResult] = useState<{ id: string; item: MilestoneItem; team: Team; serverTime: string } | null>(null);
  const [error, setError] = useState<string | null>(null); const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; setResult(null); setError(null);
    void (async () => { const response = await sessionStore.readDomain<MilestoneItem>(`/milestones/${id}`);
      const team = await sessionStore.read<Team>(`/teams/${response.data.teamId}`);
      if (active) setResult({ id, item: response.data, team, serverTime: response.meta.serverTime });
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [id, attempt]);
  if (error) return <><h1>Milestone unavailable</h1><Failure message={error} retry={() => setAttempt(value => value + 1)} /><a href="/">Back to overview</a></>;
  if (!result || result.id !== id) return <p role="status">Loading milestone?</p>;
  return <><p className={styles.meta}><a href={`/teams/${result.team.id}`}>{result.team.name}</a> / Milestone</p><h1>{result.item.title}</h1>
    <div className={styles.detail}><section><h2>Description</h2><p className={styles.description}>{result.item.description}</p></section>
      <aside className={styles.rail}><h2>Deadline</h2><time dateTime={result.item.dueAt}>{formatBangkok(result.item.dueAt)}</time><State item={result.item} serverTime={result.serverTime} />
        {result.item.latestSubmission && <p>Latest submission: version {result.item.latestSubmission.version}, {result.item.latestSubmission.feedbackCount} feedback messages.</p>}</aside>
    </div></>;
}
