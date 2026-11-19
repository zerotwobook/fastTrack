import { useEffect, useRef, useState } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Button, EmptyState, Field, Input, StatusBadge, Textarea } from '../../design/components';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { describeRevisionRestriction } from '../submissions/history';
import { bangkokInputToIso, codePointLength, isoToBangkokInput, MilestoneInputError, parseMilestoneInput } from '../../../../shared/milestones.mjs';
import styles from './milestones.module.css';
import { describeMilestonePlanning, groupStudentMilestones } from './overview';

export interface MilestoneItem {
  id: string; teamId: string; title: string; description: string; dueAt: string;
  cancelledAt: string | null; createdAt: string;
  latestSubmission: { id: string; version: number; submittedAt: string; feedbackCount: number } | null;
}
export const formatBangkok = (value: string) => new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Bangkok', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,
}).format(new Date(value)) + ' (Asia/Bangkok)';
function State({ item, serverTime }: { item: MilestoneItem; serverTime: string }) {
  if (item.cancelledAt) {
    return (
      <span className={styles.cancelled} aria-label="Cancelled">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="10" cy="10" r="7" />
          <path d="m5.5 14.5 9-9" />
        </svg>
        Cancelled
      </span>
    );
  }
  return <StatusBadge status={item.latestSubmission ? item.latestSubmission.feedbackCount ? 'feedback' : 'submitted'
    : new Date(item.dueAt).getTime() < new Date(serverTime).getTime() ? 'overdue' : 'pending'} />;
}
function Failure({ message, retry }: { message: string; retry: () => void }) {
  return <div className={styles.error} role="alert"><p>{message}</p><Button variant="secondary" onClick={retry}>Try again</Button></div>;
}

interface MilestoneFormFieldsProps {
  title: string; setTitle: (value: string) => void;
  description: string; setDescription: (value: string) => void;
  dueAt: string; setDueAt: (value: string) => void;
  fields: Readonly<Record<string, string>>;
  saving: boolean;
  deadlineStep?: number;
}
function MilestoneFormFields({ title, setTitle, description, setDescription, dueAt, setDueAt, fields, saving, deadlineStep = 60 }: MilestoneFormFieldsProps) {
  const described = (id: string) => `${id}-${fields[id] ? 'error' : 'hint'}`;
  return <>
    <Field id="title" label="Title" hint={`${codePointLength(title.trim())}/120 characters`} {...(fields.title ? { error: fields.title } : {})}>
      <Input id="title" name="title" required value={title} onChange={event => setTitle(event.target.value)} disabled={saving} aria-invalid={!!fields.title} aria-describedby={described('title')} />
    </Field>
    <Field id="description" label="Description" hint={`${codePointLength(description.trim())}/4,000 characters`} {...(fields.description ? { error: fields.description } : {})}>
      <Textarea id="description" name="description" required value={description} onChange={event => setDescription(event.target.value)} disabled={saving} aria-invalid={!!fields.description} aria-describedby={described('description')} />
    </Field>
    <Field id="dueAt" label="Deadline in Asia/Bangkok" hint="A time entered as HH:mm uses seconds 00, not the end of that minute." {...(fields.dueAt ? { error: fields.dueAt } : {})}>
      <Input id="dueAt" name="dueAt" type="datetime-local" step={deadlineStep} required value={dueAt} onChange={event => setDueAt(event.target.value)} disabled={saving} aria-invalid={!!fields.dueAt} aria-describedby={described('dueAt')} />
    </Field>
  </>;
}

function trapDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
  const first = controls[0]; const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first?.focus();
  }
}
function TrackRows({ items, serverTime, userRole }: { items: MilestoneItem[]; serverTime: string; userRole: 'student' | 'supervisor' }) {
  const Heading = userRole === 'student' ? 'h4' : 'h3';
  return <ol className={styles.track}>{items.map(item => <li key={item.id} className={styles.row}>
    <time dateTime={item.dueAt} className={styles.date}>{formatBangkok(item.dueAt)}</time><span className={styles.marker} aria-hidden="true" />
    <div className={styles.item}><Heading><a href={`/milestones/${item.id}`}>{item.title}</a></Heading><State item={item} serverTime={serverTime} />
      <p>{item.description}</p>{item.latestSubmission && <p className={styles.meta}>Version {item.latestSubmission.version}, {item.latestSubmission.feedbackCount} feedback messages. <a href={`/submissions/${item.latestSubmission.id}`}>{userRole === 'supervisor' ? 'Open work and give feedback' : 'Open saved submission'}</a></p>}
      {userRole === 'student' && !item.cancelledAt && !item.latestSubmission && Date.parse(item.dueAt) >= Date.parse(serverTime) && <a className={styles.primaryLink} href={`/milestones/${item.id}/submissions/new`}>Submit work</a>}
      <a className={styles.detailLink} href={`/milestones/${item.id}`}>View milestone</a></div>
  </li>)}</ol>;
}
function StudentGroups({ items, serverTime }: { items: MilestoneItem[]; serverTime: string }) {
  const groups = groupStudentMilestones(items, serverTime);
  const sections = [
    ['actionable', 'Work to submit', 'No upcoming work to submit.'],
    ['overdue', 'Overdue', 'No overdue work.'],
    ['submitted', 'Submitted work', 'No saved submissions yet.'],
    ['cancelled', 'Cancelled', ''],
  ] as const;
  return <div className={styles.groups}>{sections.filter(([key]) => key !== 'cancelled' || groups.cancelled.length > 0).map(([key, heading, empty]) => <section key={key} aria-label={heading} className={styles.group}>
    <h3>{heading}</h3>{groups[key].length ? <TrackRows items={groups[key]} serverTime={serverTime} userRole="student" /> : <p className={styles.meta}>{empty}</p>}
  </section>)}</div>;
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
      : !result || result.teamId !== teamId ? <p role="status">Loading milestones…</p>
      : <>{result.items.length === 0 ? <EmptyState title="No milestones yet" description={userRole === 'supervisor' ? 'Create a milestone to set the next deadline for your team.' : 'Your supervisor has not scheduled a milestone yet.'} />
        : userRole === 'student' ? <StudentGroups items={result.items} serverTime={result.serverTime} />
        : <TrackRows items={result.items} serverTime={result.serverTime} userRole={userRole} />}
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
  return <section className={styles.container}><h2>Milestone details</h2><p className={styles.meta}>All fields are required. Dates use Asia/Bangkok.</p>
    {error && <div ref={summary} tabIndex={-1} role="alert" className={styles.error}><p>{error}</p>{uncertain && <a href={`/teams/${teamId}`}>Check milestone list</a>}</div>}
    <form className={styles.form} onSubmit={event => { void submit(event); }}>
      <MilestoneFormFields title={title} setTitle={setTitle} description={description} setDescription={setDescription} dueAt={dueAt} setDueAt={setDueAt} fields={fields} saving={saving} />
      <div className={styles.actions}><Button type="submit" loading={saving} disabled={saving || uncertain}>{saving ? 'Creating milestone…' : 'Create milestone'}</Button><a href={`/teams/${teamId}`}>Back to team</a></div>
    </form>
  </section>;
}

interface MilestoneEditProps {
  item: MilestoneItem;
  onBack: () => void;
  onReload: () => void;
  onSaved: (updated: MilestoneItem) => void;
}
function MilestoneEdit({ item, onBack, onReload, onSaved }: MilestoneEditProps) {
  const [title, setTitle] = useState(item.title);
  const [description, setDescription] = useState(item.description);
  const [dueAt, setDueAt] = useState(() => isoToBangkokInput(item.dueAt));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Readonly<Record<string, string>>>({});
  const [uncertain, setUncertain] = useState(false);
  const summary = useRef<HTMLDivElement>(null); const heading = useRef<HTMLHeadingElement>(null);
  const busy = useRef(false); const alive = useRef(true);
  useEffect(() => { alive.current = true; heading.current?.focus(); return () => { alive.current = false; }; }, []);
  useEffect(() => { if (error) summary.current?.focus(); }, [error, fields]);

  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy.current || uncertain) return;
    setError(null); setFields({});
    let input;
    try { input = parseMilestoneInput({ title, description, dueAt: bangkokInputToIso(dueAt) }); }
    catch (reason) { if (reason instanceof MilestoneInputError) { setFields(reason.fields); setError(reason.message); } return; }
    busy.current = true; setSaving(true);
    try {
      const updated = await sessionStore.mutate<MilestoneItem>(`/milestones/${item.id}`, input, 'PATCH');
      if (alive.current) onSaved(updated);
    } catch (reason) {
      if (!alive.current || reason instanceof StaleSessionError) return;
      const unknown = reason instanceof ApiError && (reason.status === 0 || reason.status >= 500);
      if (reason instanceof ApiError) setFields(reason.fields);
      setUncertain(unknown);
      setError(unknown ? 'The result could not be confirmed. Reload the milestone before trying again.' : (reason as Error).message);
    } finally { busy.current = false; if (alive.current) setSaving(false); }
  };

  return <section aria-labelledby="edit-milestone-heading" className={styles.editPanel}>
    <h2 id="edit-milestone-heading" ref={heading} tabIndex={-1}>Edit milestone</h2>
    <p className={styles.meta}>All fields are required. Dates use Asia/Bangkok.</p>
    {error && <div ref={summary} tabIndex={-1} role="alert" className={styles.error}>
      <p>{error}</p>
      <div className={styles.inlineActions}><Button type="button" variant="secondary" onClick={onReload}>Reload milestone</Button></div>
    </div>}
    <form className={styles.form} onSubmit={event => { void submit(event); }}>
      <MilestoneFormFields title={title} setTitle={setTitle} description={description} setDescription={setDescription} dueAt={dueAt} setDueAt={setDueAt} fields={fields} saving={saving} deadlineStep={0.001} />
      <div className={styles.actions}>
        <Button type="submit" loading={saving} disabled={saving || uncertain}>{saving ? 'Saving changes…' : 'Save changes'}</Button>
        <Button type="button" variant="secondary" disabled={saving} onClick={onBack}>Go back</Button>
      </div>
    </form>
  </section>;
}

export function MilestoneDetail({ id, userRole }: { id: string; userRole: 'student' | 'supervisor' }) {
  const [result, setResult] = useState<{ id: string; item: MilestoneItem; team: Team; serverTime: string } | null>(null);
  const [error, setError] = useState<string | null>(null); const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(false);
  const [statusNotice, setStatusNotice] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const editTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelTriggerRef = useRef<HTMLButtonElement>(null);
  const cancelDialogRef = useRef<HTMLDialogElement>(null);
  const cancelBackRef = useRef<HTMLButtonElement>(null);
  const statusNoticeRef = useRef<HTMLDivElement>(null);
  const restoreFocusTarget = useRef<'edit' | 'cancel' | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { setEditing(false); setStatusNotice(null); setCancelError(null); cancelDialogRef.current?.close(); }, [id]);
  useEffect(() => {
    let active = true; setError(null);
    if (result?.id !== id) setResult(null);
    void (async () => { const response = await sessionStore.readDomain<MilestoneItem>(`/milestones/${id}`);
      const team = await sessionStore.read<Team>(`/teams/${response.data.teamId}`);
      if (active) setResult({ id, item: response.data, team, serverTime: response.meta.serverTime });
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [id, attempt]);
  useEffect(() => {
    if (!editing && restoreFocusTarget.current === 'edit') {
      restoreFocusTarget.current = null;
      editTriggerRef.current?.focus();
    }
  }, [editing]);
  useEffect(() => {
    if (statusNotice) statusNoticeRef.current?.focus();
  }, [statusNotice]);

  if (error && (!result || result.id !== id)) return <><h1>Milestone unavailable</h1><Failure message={error} retry={() => setAttempt(value => value + 1)} /><a href="/">Back to overview</a></>;
  if (!result || result.id !== id) return <p role="status">Loading milestone…</p>;

  const planning = describeMilestonePlanning(result.item, userRole);
  const openCancelDialog = () => {
    setCancelError(null);
    restoreFocusTarget.current = 'cancel';
    cancelDialogRef.current?.showModal();
    cancelBackRef.current?.focus();
  };
  const closeCancelDialog = (restore = true) => {
    if (cancelling) return;
    restoreFocusTarget.current = restore ? 'cancel' : null;
    cancelDialogRef.current?.close();
  };
  const confirmCancel = async () => {
    if (cancelling) return;
    setCancelError(null); setCancelling(true);
    try {
      const updated = await sessionStore.mutate<MilestoneItem>(`/milestones/${id}/cancel`, {}, 'POST');
      if (!alive.current) return;
      restoreFocusTarget.current = null;
      cancelDialogRef.current?.close();
      setResult(current => current ? { ...current, item: updated } : current);
      setStatusNotice('Milestone cancelled.');
      setAttempt(value => value + 1);
    } catch (reason) {
      if (!alive.current || reason instanceof StaleSessionError) return;
      const unknown = reason instanceof ApiError && (reason.status === 0 || reason.status >= 500);
      setCancelError(unknown ? 'The result could not be confirmed. Close and reload the milestone before retrying.' : (reason as Error).message);
    } finally {
      if (alive.current) setCancelling(false);
    }
  };

  const revisionRestriction = result.item.latestSubmission
    ? describeRevisionRestriction(result.item, result.serverTime, result.item.latestSubmission.version)
    : null;
  return <><p className={styles.meta}><a href={`/teams/${result.team.id}`}>{result.team.name}</a> / Milestone</p><h1>{result.item.title}</h1>
    {statusNotice && <div ref={statusNoticeRef} tabIndex={-1} role="status" className={styles.statusNotice}><p>{statusNotice}</p></div>}
    {error && <Failure message={error} retry={() => setAttempt(value => value + 1)} />}
    <div className={styles.detail}>
      {editing ? <MilestoneEdit key={result.item.dueAt + result.item.title} item={result.item}
        onBack={() => { restoreFocusTarget.current = 'edit'; setEditing(false); }}
        onReload={() => { setEditing(false); setAttempt(value => value + 1); }}
        onSaved={updated => {
          restoreFocusTarget.current = null;
          setEditing(false);
          setResult(current => current ? { ...current, item: updated } : current);
          setStatusNotice('Milestone updated.');
          setAttempt(value => value + 1);
        }} />
      : <section><h2>Description</h2><p className={styles.description}>{result.item.description}</p></section>}
      <aside className={styles.rail}><h2>Deadline</h2><time dateTime={result.item.dueAt}>{formatBangkok(result.item.dueAt)}</time><State item={result.item} serverTime={result.serverTime} />
        {result.item.cancelledAt && <p className={styles.meta}>Cancelled on {formatBangkok(result.item.cancelledAt)}.</p>}
        {result.item.latestSubmission ? <><p>Latest submission: version {result.item.latestSubmission.version}, {result.item.latestSubmission.feedbackCount} feedback messages.</p><a className={styles.primaryLink} href={`/submissions/${result.item.latestSubmission.id}`}>Open saved submission</a>
          {userRole === 'student' && (revisionRestriction ? <p>{revisionRestriction}</p>
            : <a className={styles.detailLink} href={`/milestones/${id}/revisions/new`}>Submit revision</a>)}</>
          : userRole === 'student' && (result.item.cancelledAt ? <p>This milestone was cancelled and cannot receive work.</p>
            : Date.parse(result.serverTime) > Date.parse(result.item.dueAt) ? <p>The deadline has passed. Work cannot be submitted.</p>
            : <a className={styles.primaryLink} href={`/milestones/${id}/submissions/new`}>Submit work</a>)}
        {userRole === 'supervisor' && <>
          {planning.canEdit && !editing && <div className={styles.railActions}>
            <Button ref={editTriggerRef} type="button" variant="secondary" onClick={() => { setStatusNotice(null); setEditing(true); }}>Edit milestone</Button>
            <Button ref={cancelTriggerRef} type="button" variant="secondary" onClick={openCancelDialog}>Cancel milestone</Button>
          </div>}
          {planning.lockedReason && <p className={styles.lockedReason}>{planning.lockedReason}</p>}
          {planning.canCreateAnother && <a className={styles.detailLink} href={`/teams/${result.team.id}/milestones/new`}>Create another milestone</a>}
        </>}
      </aside>
    </div>
    <dialog ref={cancelDialogRef} className={styles.confirmDialog} aria-labelledby="cancel-milestone-title" aria-describedby="cancel-milestone-description"
      aria-modal="true"
      onKeyDown={trapDialogFocus}
      onCancel={event => { if (cancelling) { event.preventDefault(); return; } restoreFocusTarget.current = 'cancel'; }}
      onClose={() => { setCancelError(null); if (restoreFocusTarget.current === 'cancel') { restoreFocusTarget.current = null; cancelTriggerRef.current?.focus(); } }}>
      <h2 id="cancel-milestone-title">Cancel milestone</h2>
      <p id="cancel-milestone-description" className={styles.confirmCopy}>
        Cancel milestone &ldquo;{result.item.title}&rdquo;? Cancelled milestones stay visible in history, cannot receive submissions, and cannot be reopened or edited.
      </p>
      {cancelError && <div role="alert" className={styles.error}><p>{cancelError}</p></div>}
      <div className={styles.confirmActions}>
        <Button ref={cancelBackRef} type="button" variant="secondary" disabled={cancelling} onClick={() => closeCancelDialog(true)}>Go back</Button>
        <Button type="button" variant="primary" loading={cancelling} disabled={cancelling} onClick={() => { void confirmCancel(); }}>
          {cancelling ? 'Cancelling milestone…' : 'Confirm cancel milestone'}
        </Button>
      </div>
    </dialog>
  </>;
}
