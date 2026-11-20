import { useEffect, useRef, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button, Field, Input, Textarea } from '../../design/components';
import { Icon } from '../../design/Icon';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import type { Team } from '../auth/session';
import { formatBangkok } from '../milestones/MilestoneTrack';
import type { MilestoneItem } from '../milestones/MilestoneTrack';
import { codePointLength } from '../../../../shared/milestones.mjs';
import { isWorkUrl, parseRevisionInput, parseSubmissionInput, SubmissionInputError } from '../../../../shared/submissions.mjs';
import { describeRevisionRestriction, describeSubmissionHistory } from './history';
import { SummaryDetailBreadcrumb, SummaryRecoveryLinks } from '../summary/DrilldownList';
import {
  buildMilestoneDetailHref,
  buildSubmissionDetailHref,
  readSummaryReturnTo,
  resolveDetailSummaryNavigation,
} from '../summary/navigation';
import styles from './submissions.module.css';

export interface SubmissionRecord {
  id: string; milestoneId: string; submittedBy: { id: string; displayName: string }; version: number;
  title: string; description: string; url: string; submittedAt: string;
}
interface Context { id: string; milestone: MilestoneItem; team: Team; serverTime: string }

function Existing({ item, milestoneId, canRevise }: { item: SubmissionRecord; milestoneId: string; canRevise: boolean }) {
  return <section className={styles.notice} aria-label="Existing team submission">
    <h2>Your team has already submitted work</h2>
    <p>Submitted by {item.submittedBy.displayName}, version {item.version}, {formatBangkok(item.submittedAt)}.</p>
    <a href={`/submissions/${item.id}`}>Open saved submission</a>
    {canRevise && <a href={`/milestones/${milestoneId}/revisions/new`}>Submit revision</a>}
  </section>;
}

interface SubmissionFormFieldsProps {
  prefix: string;
  title: string; setTitle: (value: string) => void;
  description: string; setDescription: (value: string) => void;
  url: string; setUrl: (value: string) => void;
  fields: Readonly<Record<string, string>>;
  disabled: boolean;
}
function SubmissionFormFields({ prefix, title, setTitle, description, setDescription, url, setUrl, fields, disabled }: SubmissionFormFieldsProps) {
  const described = (key: string) => `${prefix}-${key}-${fields[key] ? 'error' : 'hint'}`;
  return <>
    <Field id={`${prefix}-title`} label="Title" hint={`${codePointLength(title.trim())}/120 characters`} {...(fields.title ? { error: fields.title } : {})}>
      <Input id={`${prefix}-title`} name="title" required value={title} disabled={disabled} onChange={event => setTitle(event.target.value)} aria-invalid={!!fields.title} aria-describedby={described('title')} />
    </Field>
    <Field id={`${prefix}-description`} label="Description" hint={`${codePointLength(description.trim())}/4,000 characters`} {...(fields.description ? { error: fields.description } : {})}>
      <Textarea id={`${prefix}-description`} name="description" required value={description} disabled={disabled} onChange={event => setDescription(event.target.value)} aria-invalid={!!fields.description} aria-describedby={described('description')} />
    </Field>
    <Field id={`${prefix}-url`} label="Work link" hint="Use a complete http:// or https:// link your supervisor can open. Check its sharing permissions before submitting." {...(fields.url ? { error: fields.url } : {})}>
      <Input id={`${prefix}-url`} name="url" type="url" required value={url} disabled={disabled} onChange={event => setUrl(event.target.value)} aria-invalid={!!fields.url} aria-describedby={described('url')} />
    </Field>
  </>;
}

function VersionHistoryList({ items, currentId, latestId, keepDraft, summaryHref }: {
  items: readonly SubmissionRecord[]; currentId?: string | undefined; latestId?: string | undefined; keepDraft?: boolean;
  summaryHref?: string | null;
}) {
  return <ul className={styles.historyList}>{items.map(row => {
    const isCurrent = row.id === currentId;
    const isLatest = row.id === latestId;
    return <li key={row.id} className={styles.historyItem} data-current={isCurrent ? 'true' : undefined}>
      <div>
        <strong>Version {row.version}</strong>
        {isLatest && <span className={styles.historyBadge}>Latest</span>}
        {isCurrent && <span className={styles.historyBadge}>Current</span>}
        <p className={styles.historyMeta}>{row.title} &mdash; submitted by {row.submittedBy.displayName}, <time dateTime={row.submittedAt}>{formatBangkok(row.submittedAt)}</time></p>
      </div>
      <a href={buildSubmissionDetailHref(row.id, summaryHref)} target={keepDraft ? '_blank' : undefined} rel={keepDraft ? 'noopener noreferrer' : undefined} aria-current={isCurrent ? 'page' : undefined}>
        {isCurrent ? 'Viewing version' : `Open version ${row.version}${keepDraft ? ' in a new tab' : ''}`}
      </a>
    </li>;
  })}</ul>;
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
  return <>
    <p className="breadcrumb"><a href={`/teams/${context.team.id}`}>{context.team.name}</a> / <a href={`/milestones/${milestoneId}`}>{context.milestone.title}</a></p>
    <h1>Submit work</h1>
    <p className={styles.context}>Deadline: <time dateTime={context.milestone.dueAt}>{formatBangkok(context.milestone.dueAt)}</time>.</p>
    <p className={styles.context}>One submission is shared by your team for this milestone.</p>
    {error && <div ref={summary} role="alert" tabIndex={-1} className={styles.notice}><p>{error}</p>
      {uncertain && <Button variant="secondary" disabled={checking || saving} onClick={() => { void recover('Checking saved submissions...'); }}>{checking ? 'Checking saved work...' : 'Check saved submissions'}</Button>}
    </div>}
    {existing && <Existing item={existing} milestoneId={milestoneId} canRevise={!describeRevisionRestriction(context.milestone, context.serverTime, existing.version)} />}
    {closed && !existing && <p className={styles.notice}>{context.milestone.cancelledAt ? 'This milestone was cancelled and cannot receive work.' : 'The deadline has passed. Work cannot be submitted.'}</p>}
    <form className={styles.form} noValidate onSubmit={event => { void submit(event); }}>
      <SubmissionFormFields prefix="submission" title={title} setTitle={setTitle} description={description} setDescription={setDescription} url={url} setUrl={setUrl} fields={fields} disabled={saving || checking} />
      <div className={styles.actions}><Button type="submit" variant="submit" loading={saving} disabled={disabled}>{!saving && <Icon name="send" size={18} />}{saving ? 'Submitting work...' : 'Submit work'}</Button><a href={`/milestones/${milestoneId}`}>Back to milestone</a></div>
    </form>
  </>;
}

type RevisionRecovery = { kind: 'conflict' | 'timeout'; checked: boolean };
const terminalRevisionErrors = new Set(['DEADLINE_PASSED', 'MILESTONE_CANCELLED', 'SUBMISSION_REQUIRED', 'VERSION_LIMIT_REACHED']);

export function RevisionCreate({ milestoneId, userRole }: { milestoneId: string; userRole: 'student' | 'supervisor' }) {
  const [context, setContext] = useState<{ id: string; milestone: MilestoneItem; team: Team; serverTime: string; history: SubmissionRecord[] } | null>(null);
  const [expectedVersion, setExpectedVersion] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [fields, setFields] = useState<Readonly<Record<string, string>>>({});
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [recovery, setRecovery] = useState<RevisionRecovery | null>(null);
  const [rejected, setRejected] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const initialized = useRef(false);
  const busy = useRef(false);
  const alive = useRef(true);
  const summary = useRef<HTMLDivElement>(null);
  const revisionForm = useRef<HTMLFormElement>(null);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);
  useEffect(() => { if (error) summary.current?.focus(); }, [error, fields]);
  useEffect(() => {
    let active = true;
    setError(null);
    if (context?.id !== milestoneId) setContext(null);
    void (async () => {
      const response = await sessionStore.readDomain<MilestoneItem>(`/milestones/${milestoneId}`);
      const [team, saved] = await Promise.all([
        sessionStore.read<Team>(`/teams/${response.data.teamId}`),
        sessionStore.readDomain<SubmissionRecord[]>(`/milestones/${milestoneId}/submissions`),
      ]);
      if (!active) return;
      const latest = saved.data[0] ?? null;
      setContext({ id: milestoneId, milestone: response.data, team, serverTime: saved.meta.serverTime, history: saved.data });
      if (!initialized.current && latest) {
        initialized.current = true;
        setExpectedVersion(latest.version);
        setTitle(latest.title);
        setDescription(latest.description);
        setUrl(latest.url);
      }
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [milestoneId, attempt]);

  const inspectHistory = async (reasonMessage: string, kind: RevisionRecovery['kind']) => {
    setChecking(true);
    setRecovery({ kind, checked: false });
    setError(reasonMessage);
    try {
      const [milestone, saved] = await Promise.all([
        sessionStore.readDomain<MilestoneItem>(`/milestones/${milestoneId}`),
        sessionStore.readDomain<SubmissionRecord[]>(`/milestones/${milestoneId}/submissions`),
      ]);
      if (!alive.current) return;
      setContext(current => current ? { ...current, milestone: milestone.data, serverTime: saved.meta.serverTime, history: saved.data } : current);
      const latest = saved.data[0] ?? null;
      setRecovery({ kind, checked: true });
      if (!latest) {
        setError('No saved submission was found. Your draft is kept here.');
        return;
      }
      if (kind === 'timeout') {
        setError('The save result is still unconfirmed. Compare the author and time as well as the version and saved work before choosing a base.');
      } else {
        setError(`A newer version (version ${latest.version}) exists. Review the latest saved version below before submitting your revision again.`);
      }
    } catch (reason) {
      if (alive.current && !(reason instanceof StaleSessionError)) {
        setError('Saved versions could not be checked right now. Your draft is kept. Check saved versions again before choosing a base.');
      }
    } finally {
      if (alive.current) setChecking(false);
    }
  };

  const latest = context?.history[0] ?? null;
  const restriction = context ? describeRevisionRestriction(context.milestone, context.serverTime, latest?.version ?? 0) : null;
  const blocked = rejected || restriction !== null;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (busy.current || checking || recovery || blocked || !latest || expectedVersion === null) return;
    setError(null); setFields({});
    let input;
    try { input = parseRevisionInput({ title, description, url, expectedVersion }); }
    catch (reason) {
      if (reason instanceof SubmissionInputError) { setFields(reason.fields); setError(reason.message); }
      return;
    }
    busy.current = true; setSaving(true);
    try {
      const saved = await sessionStore.mutate<SubmissionRecord>(`/milestones/${milestoneId}/revisions`, input);
      if (alive.current) location.assign(`/submissions/${saved.id}`);
    } catch (reason) {
      if (!alive.current || reason instanceof StaleSessionError) return;
      if (reason instanceof ApiError) {
        setFields(reason.fields);
        if (reason.status === 0 || reason.status >= 500) {
          await inspectHistory(reason.message, 'timeout');
          return;
        }
        if (reason.code === 'VERSION_CONFLICT') {
          await inspectHistory(reason.message, 'conflict');
          return;
        }
        if (reason.status === 409 && reason.code && terminalRevisionErrors.has(reason.code)) setRejected(true);
      }
      setError((reason as Error).message);
    } finally { busy.current = false; if (alive.current) setSaving(false); }
  };

  if (userRole !== 'student') return <section className={styles.notice} role="alert"><h1>Student revision only</h1><p>Only a student on this team can submit revisions.</p><a href={`/milestones/${milestoneId}`}>Back to milestone</a></section>;
  if (!context || context.id !== milestoneId) return <section><h1>Submit revision</h1>{error
    ? <div role="alert" className={styles.notice}><p>{error}</p><Button onClick={() => setAttempt(v => v + 1)}>Try again</Button><a href="/">Back to overview</a></div>
    : <p role="status">Loading milestone and version history...</p>}</section>;

  const disabled = saving || checking || recovery !== null || !latest || expectedVersion === null || blocked;
  return <>
    <p className="breadcrumb"><a href={`/teams/${context.team.id}`}>{context.team.name}</a> / <a href={`/milestones/${milestoneId}`}>{context.milestone.title}</a> / Submit revision</p>
    <h1>Submit revision</h1>
    <p className={styles.context}>Deadline: <time dateTime={context.milestone.dueAt}>{formatBangkok(context.milestone.dueAt)}</time>.</p>
    {latest ? <p className={styles.context}>Latest saved version: version {latest.version}, submitted by {latest.submittedBy.displayName}, {formatBangkok(latest.submittedAt)}. <a href={`/submissions/${latest.id}`} target="_blank" rel="noopener noreferrer">Review version {latest.version} in a new tab</a></p>
      : !restriction && !recovery && <div className={styles.notice}><p>A first submission is required before submitting a revision.</p><a href={`/milestones/${milestoneId}/submissions/new`}>Submit initial work</a></div>}
    {restriction && <p className={styles.notice}>{restriction}</p>}
    {error && <div ref={summary} role="alert" tabIndex={-1} className={styles.notice}><p>{error}</p>
      {recovery && <div className={styles.recoveryButtons}>
        <Button type="button" variant="secondary" disabled={checking || saving} onClick={() => { void inspectHistory('Checking saved versions...', recovery.kind); }}>
          {checking ? 'Checking saved versions...' : 'Check saved versions'}
        </Button>
        {recovery.checked && latest && !blocked && <Button type="button" variant="secondary" disabled={checking || saving} onClick={() => {
          setExpectedVersion(latest.version);
          setRecovery(null);
          setError(null);
          revisionForm.current?.querySelector<HTMLInputElement>('input[name="title"]')?.focus();
        }}>
          Use version {latest.version} as base (keep my draft)
        </Button>}
      </div>}
    </div>}
    {expectedVersion !== null && <form ref={revisionForm} className={styles.form} noValidate onSubmit={event => { void submit(event); }}>
      <SubmissionFormFields prefix="revision" title={title} setTitle={setTitle} description={description} setDescription={setDescription} url={url} setUrl={setUrl} fields={fields} disabled={saving || checking} />
      <p className={styles.historyMeta}>Submitting based on expected version {expectedVersion}. Prior versions and their feedback remain unchanged.</p>
      <div className={styles.actions}><Button type="submit" variant="submit" loading={saving} disabled={disabled}>{!saving && <Icon name="send" size={18} />}{saving ? 'Submitting revision...' : 'Submit revision'}</Button><a href={`/milestones/${milestoneId}`}>Back to milestone</a></div>
    </form>}
    {context.history.length > 0 && <section className={styles.historySection} aria-label="Saved version history">
      <h2>Saved versions</h2>
      <VersionHistoryList items={context.history} latestId={latest?.id} keepDraft />
    </section>}
  </>;
}

export function SubmissionDetail({ id, userRole, returnTo, renderFeedback }: { id: string; userRole?: 'student' | 'supervisor'; returnTo?: string | null | undefined; renderFeedback?: (submission: SubmissionRecord) => ReactNode }) {
  const rawReturnTo = returnTo !== undefined
    ? returnTo
    : (typeof location !== 'undefined' ? readSummaryReturnTo(location.search) : null);
  const summaryNav = resolveDetailSummaryNavigation(rawReturnTo, userRole);
  const [result, setResult] = useState<{ id: string; item: SubmissionRecord; milestone: MilestoneItem; team: Team; history: SubmissionRecord[]; serverTime: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; setResult(null); setError(null);
    void (async () => {
      const item = await sessionStore.read<SubmissionRecord>(`/submissions/${id}`);
      const [milestoneDomain, historyDomain] = await Promise.all([
        sessionStore.readDomain<MilestoneItem>(`/milestones/${item.milestoneId}`),
        sessionStore.readDomain<SubmissionRecord[]>(`/milestones/${item.milestoneId}/submissions`),
      ]);
      const team = await sessionStore.read<Team>(`/teams/${milestoneDomain.data.teamId}`);
      if (active) setResult({ id, item, milestone: milestoneDomain.data, team, history: historyDomain.data, serverTime: historyDomain.meta.serverTime });
    })().catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [id, attempt]);
  if (error) return <><h1>Submission unavailable</h1><div role="alert" className={styles.notice}><p>{error}</p><Button onClick={() => setAttempt(v => v + 1)}>Try again</Button><SummaryRecoveryLinks summaryNav={summaryNav} /></div></>;
  if (!result || result.id !== id) return <p role="status">Loading saved submission...</p>;
  const { item, milestone, team, history, serverTime } = result;
  const { orderedHistory, latest, isOldVersion } = describeSubmissionHistory(item, history);
  const restriction = describeRevisionRestriction(milestone, serverTime, latest?.version ?? item.version);
  const milestoneHref = buildMilestoneDetailHref(milestone.id, summaryNav.summaryHref);
  return <>
    <SummaryDetailBreadcrumb summaryNav={summaryNav}><a href={`/teams/${team.id}`}>{team.name}</a> / <a href={milestoneHref}>{milestone.title}</a> / Saved submission</SummaryDetailBreadcrumb>
    <h1>{item.title}</h1>
    <p className={styles.context}>Version {item.version}, submitted by {item.submittedBy.displayName}.</p>
    <p className={styles.context}><time dateTime={item.submittedAt}>{formatBangkok(item.submittedAt)}</time></p>
    {isOldVersion && latest && <div className={styles.notice} role="region" aria-label="Older version notice">
      <p>Viewing version {item.version}; the latest version is version {latest.version}.</p>
      <a href={buildSubmissionDetailHref(latest.id, summaryNav.summaryHref)}>View latest version</a>
    </div>}
    <div className={renderFeedback ? styles.withFeedback : styles.content}>
      <section aria-label="Saved work"><h2>Description</h2><p className={styles.description}>{item.description}</p>
        <h2>Work link</h2>{isWorkUrl(item.url)
          ? <><a className={styles.workLink} href={item.url} target="_blank" rel="noopener noreferrer">Open work link<Icon name="external" size={18} /></a><p className={styles.url}>{item.url}</p></>
          : <p className={styles.notice}>This saved link cannot be opened safely. Contact the submitting team member.</p>}
        <section className={styles.historySection} aria-label="Version history">
          <h2 className={styles.iconHeading}><Icon name="history" />Version history</h2>
          <VersionHistoryList items={orderedHistory} currentId={item.id} latestId={latest?.id} summaryHref={summaryNav.summaryHref} />
          {userRole === 'student' && (restriction ? <p className={styles.historyMeta}>{restriction}</p>
            : <a className={`${styles.detailActionLink} ${styles.submitLink}`} href={`/milestones/${milestone.id}/revisions/new`}><Icon name="send" size={18} />Submit new revision</a>)}
        </section>
      </section>
      {renderFeedback && <aside aria-label={`Feedback for version ${item.version}`}>{renderFeedback(item)}</aside>}
    </div>
  </>;
}
