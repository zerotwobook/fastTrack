import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { parseTeamName, TeamNameInputError } from '../../../../shared/teams.mjs';
import { Button, EmptyState, Field, Input } from '../../design/components';
import { ApiError, sessionStore, StaleSessionError } from '../auth/session';
import type { DomainRead, Team } from '../auth/session';
import styles from './teamPlanning.module.css';

type Member = Team['members'][number];
type CandidatePage = DomainRead<Member[], { serverTime: string; totalAvailable: number; nextCursor: string | null }>;

function uncertain(error: unknown): boolean {
  return error instanceof ApiError && (error.status === 0 || error.status >= 500);
}

function TeamNameForm({ initialName, label, save, recoveryHref, recoveryLabel }: {
  initialName: string;
  label: string;
  save: (name: string) => Promise<void>;
  recoveryHref: string;
  recoveryLabel: string;
}) {
  const [name, setName] = useState(initialName);
  const [fieldError, setFieldError] = useState<string>();
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [checkResult, setCheckResult] = useState(false);
  const pending = useRef(false);
  const form = useRef<HTMLFormElement>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (pending.current || checkResult) return;
    setError(undefined);
    setFieldError(undefined);
    pending.current = true;
    setBusy(true);
    try {
      const cleanName = parseTeamName(name);
      await save(cleanName);
      setName(cleanName);
    } catch (reason) {
      const message = reason instanceof TeamNameInputError ? reason.message :
        reason instanceof ApiError ? reason.fields.name : undefined;
      if (message) {
        setFieldError(message);
      } else if (uncertain(reason)) {
        setCheckResult(true);
        setError('The result could not be confirmed. Check the saved team before trying again.');
      } else if (!(reason instanceof StaleSessionError)) {
        setError((reason as Error).message);
      }
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  useEffect(() => { if (fieldError) form.current?.querySelector('input')?.focus(); }, [fieldError]);

  return <form ref={form} className={styles.form} onSubmit={event => { void submit(event); }} noValidate>
    <Field id="team-name" label="Team name" {...(fieldError ? { error: fieldError } : {})} hint="Use 1–120 characters.">
      <Input id="team-name" name="name" required value={name} disabled={busy}
        aria-invalid={Boolean(fieldError)} aria-describedby={fieldError ? 'team-name-error' : 'team-name-hint'}
        hasError={Boolean(fieldError)} onChange={event => { setName(event.target.value); setFieldError(undefined); }} />
    </Field>
    {error && <p className="notice" role="alert">{error} {checkResult && <a href={recoveryHref}>{recoveryLabel}</a>}</p>}
    <Button type="submit" loading={busy} disabled={busy || checkResult}>{busy ? 'Saving…' : label}</Button>
  </form>;
}

export function TeamCreate() {
  return <div className={styles.planning}>
    <p className="breadcrumb"><a href="/#teams">Your teams</a></p>
    <h1>Create team</h1>
    <p className="intro">Name the team, then assign its members in team settings.</p>
    <TeamNameForm initialName="" label="Create team" recoveryHref="/#teams" recoveryLabel="Check your teams"
      save={async name => {
        const created = await sessionStore.mutate<Team>('/teams', { name });
        location.assign(`/teams/${created.id}/settings`);
      }} />
  </div>;
}

function TeamMembers({ team, initiallyLocked, reload }: { team: Team; initiallyLocked: boolean; reload: () => void }) {
  const [members, setMembers] = useState(team.members);
  const [locked, setLocked] = useState(initiallyLocked);
  const [page, setPage] = useState<CandidatePage | null>(null);
  const [candidateError, setCandidateError] = useState<string>();
  const [loadingPage, setLoadingPage] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [saving, setSaving] = useState<string>();
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [checkResult, setCheckResult] = useState(false);
  const pending = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (locked) return;
    let active = true;
    setLoadingPage(true);
    setCandidateError(undefined);
    setPage(null);
    void sessionStore.readDomain<CandidatePage['data'], CandidatePage['meta']>('/students/available')
      .then(result => { if (active) setPage(result); })
      .catch(reason => { if (active && !(reason instanceof StaleSessionError)) setCandidateError((reason as Error).message); })
      .finally(() => { if (active) setLoadingPage(false); });
    return () => { active = false; };
  }, [locked, refresh]);

  async function loadMore() {
    if (!page?.meta.nextCursor || pending.current || loadingPage) return;
    pending.current = true;
    setLoadingPage(true);
    setCandidateError(undefined);
    try {
      const next = await sessionStore.readDomain<CandidatePage['data'], CandidatePage['meta']>(
        `/students/available?after=${encodeURIComponent(page.meta.nextCursor)}`);
      setPage({ data: [...page.data, ...next.data], meta: next.meta });
    } catch (reason) {
      if (!(reason instanceof StaleSessionError)) setCandidateError((reason as Error).message);
    } finally {
      pending.current = false;
      setLoadingPage(false);
    }
  }

  async function change(member: Member, action: 'add' | 'remove') {
    if (pending.current || locked || checkResult || loadingPage) return;
    pending.current = true;
    setSaving(member.id);
    setNotice(undefined);
    setError(undefined);
    const path = `/teams/${team.id}/members`;
    try {
      if (action === 'add') {
        const saved = await sessionStore.mutate<Team>(path, { studentId: member.id });
        setMembers(saved.members);
      } else {
        await sessionStore.remove(`${path}/${member.id}`);
        setMembers(current => current.filter(item => item.id !== member.id));
      }
      setNotice(action === 'add' ? `${member.displayName} joined the team.` : `${member.displayName} was removed from the team.`);
      heading.current?.focus();
      setRefresh(value => value + 1);
    } catch (reason) {
      if (reason instanceof StaleSessionError) return;
      if (reason instanceof ApiError && reason.code === 'TEAM_HISTORY_LOCKED') {
        setLocked(true);
        heading.current?.focus();
        return;
      }
      if (reason instanceof ApiError && reason.code === 'MEMBERSHIP_CONFLICT') {
        setRefresh(value => value + 1);
        heading.current?.focus();
      }
      if (uncertain(reason) || (reason instanceof ApiError && reason.status === 404)) {
        setCheckResult(true);
        setError('Refresh team settings to check the current membership before trying again.');
      } else setError((reason as Error).message);
    } finally {
      pending.current = false;
      setSaving(undefined);
    }
  }

  const disabled = saving !== undefined || checkResult || loadingPage;
  return <section className={styles.section} aria-labelledby="members-heading">
    <h2 id="members-heading" tabIndex={-1} ref={heading}>Members</h2>
    {locked && <p className="notice" role="status">Membership is locked because this team has submission history.</p>}
    {notice && <p role="status">{notice}</p>}
    {error && <p className="notice" role="alert">{error}</p>}
    {checkResult && <Button type="button" variant="secondary" onClick={reload}>Refresh team settings</Button>}
    {members.length ? <ul className={styles.people}>{members.map(member => <li key={member.id}>
      <span>{member.displayName}</span>
      {!locked && <Button type="button" variant="secondary" disabled={disabled} loading={saving === member.id}
        aria-label={`Remove ${member.displayName}`} onClick={() => { void change(member, 'remove'); }}>Remove</Button>}
    </li>)}</ul> : <EmptyState title="No members assigned yet" />}
    {!locked && <div className={styles.available}>
      <h3>Available students</h3>
      {loadingPage && <p role="status">Loading available students…</p>}
      {candidateError && <div className="notice"><p role="alert">{candidateError}</p>
        <Button type="button" variant="secondary" disabled={disabled} onClick={() => setRefresh(value => value + 1)}>Refresh available students</Button>
      </div>}
      {page && <p className={styles.muted}>{page.meta.totalAvailable} available</p>}
      {page?.data.length ? <ul className={styles.people}>{page.data.map(student => <li key={student.id}>
        <span>{student.displayName}</span>
        <Button type="button" variant="secondary" disabled={disabled} loading={saving === student.id}
          aria-label={`Add ${student.displayName}`} onClick={() => { void change(student, 'add'); }}>Add</Button>
      </li>)}</ul> : page && <EmptyState title="No available students" />}
      {page?.meta.nextCursor && <Button type="button" variant="secondary" disabled={disabled} onClick={() => { void loadMore(); }}>Load more students</Button>}
    </div>}
  </section>;
}

export function TeamSettings({ teamId }: { teamId: string }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [locked, setLocked] = useState(false);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [attempt, setAttempt] = useState(0);
  const reload = () => { setTeam(null); setNotice(undefined); setAttempt(value => value + 1); };

  useEffect(() => {
    let active = true;
    setError(undefined);
    void Promise.all([
      sessionStore.read<Team>(`/teams/${teamId}`),
      sessionStore.read<{ latestSubmission: { id: string } | null }[]>(`/teams/${teamId}/milestones`),
    ]).then(([current, milestones]) => {
      if (!active) return;
      setLocked(milestones.some(milestone => milestone.latestSubmission !== null));
      setTeam(current);
    }).catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [teamId, attempt]);

  return <div className={styles.planning}>
    <p className="breadcrumb"><a href="/#teams">Your teams</a>{team && <> / <a href={`/teams/${team.id}`}>{team.name}</a></>}</p>
    <h1>Team settings</h1>
    {error ? <section className="notice"><p role="alert">{error}</p><Button type="button" variant="secondary" onClick={reload}>Try again</Button></section>
      : !team ? <p role="status">Loading team settings…</p> : <>
        <section className={styles.section} aria-labelledby="team-information">
          <h2 id="team-information">Team information</h2>
          {notice && <p role="status">{notice}</p>}
          <TeamNameForm initialName={team.name} label="Save name" recoveryHref={`/teams/${team.id}/settings`}
            recoveryLabel="Refresh team settings" save={async name => {
              setNotice(undefined);
              const saved = await sessionStore.mutate<Team>(`/teams/${team.id}`, { name }, 'PATCH');
              setTeam(saved);
              setNotice('Team name saved.');
            }} />
        </section>
        <TeamMembers team={team} initiallyLocked={locked} reload={reload} />
        <section className={styles.section} aria-labelledby="team-milestones">
          <h2 id="team-milestones">Milestone plan</h2>
          <a href={`/teams/${team.id}`}>View team milestones</a>
        </section>
      </>}
  </div>;
}
