import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from 'react';
import type { FormEvent, KeyboardEvent } from 'react';
import { Button, EmptyState, Field, Input } from './design/components';
import { safeReturnTo, sessionStore, StaleSessionError } from './features/auth/session';
import type { SessionSnapshot, Team } from './features/auth/session';
import { MilestoneCreate, MilestoneDetail, MilestoneTrack } from './features/milestones';
import { SubmissionCreate, SubmissionDetail } from './features/submissions';
import { FeedbackPanel } from './features/feedback';
import './app.css';

function Login({ state }: { state: SessionSnapshot }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const alert = useRef<HTMLParagraphElement>(null);
  const submitting = useRef(false);
  useEffect(() => { if (state.error) alert.current?.focus(); }, [state.error]);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (state.busy || submitting.current) return;
    submitting.current = true;
    if (await sessionStore.login(email, password)) {
      history.replaceState(null, '', safeReturnTo(new URLSearchParams(location.search).get('returnTo') ?? location.pathname));
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else setPassword('');
    submitting.current = false;
  };
  return <main id="main-content" className="login-page">
    <div className="login-form"><p className="wordmark">fastTrack</p><h1>Sign in</h1>
      <p className="intro">Keep track of your team's work and feedback.</p>
      {state.error && <p className="notice" role="alert" tabIndex={-1} ref={alert}>{state.error}</p>}
      <form onSubmit={event => { void submit(event); }}>
        <Field id="email" label="Email"><Input id="email" name="email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)} disabled={state.busy} /></Field>
        <Field id="password" label="Password"><div className="password-control"><Input id="password" name="password" type={visible ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} disabled={state.busy} /><Button type="button" variant="ghost" aria-pressed={visible} onClick={() => setVisible(!visible)}>{visible ? 'Hide password' : 'Show password'}</Button></div></Field>
        <Button className="login-submit" type="submit" loading={state.busy}>{state.busy ? 'Signing in…' : 'Sign in'}</Button>
      </form><p className="help">Use the account provided for your course.</p>
    </div>
  </main>;
}
function Navigation({ role }: { role: 'student' | 'supervisor' }) {
  return <nav aria-label="Main navigation"><a href="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Overview</a><a href="/#teams" aria-current={location.pathname !== '/' ? 'page' : undefined}>{role === 'student' ? 'My team' : 'Supervised teams'}</a></nav>;
}
function trapNavigationFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== 'Tab') return;
  const controls = event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled), a[href]');
  const first = controls[0]; const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault(); last?.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault(); first?.focus();
  }
}
function Workspace({ state, path }: { state: SessionSnapshot; path: string }) {
  const user = state.auth!.user;
  const [result, setResult] = useState<{ revision: number; path: string; teams: Team[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const menu = useRef<HTMLButtonElement>(null);
  useLayoutEffect(() => { if (state.phase !== 'ready') dialog.current?.close(); }, [state.phase]);
  useEffect(() => {
    const desktop = matchMedia('(min-width: 1200px)');
    const closeOnDesktop = () => { if (desktop.matches) dialog.current?.close(); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);
  const detailId = /^\/teams\/([a-f0-9-]{36})(?:\/milestones\/new)?$/i.exec(path)?.[1];
  const milestoneId = /^\/milestones\/([a-f0-9-]{36})(?:\/submissions\/new)?$/i.exec(path)?.[1];
  const submissionId = /^\/submissions\/([a-f0-9-]{36})$/i.exec(path)?.[1];
  const submitting = path.endsWith('/submissions/new');
  const creating = path.endsWith('/milestones/new');
  const validPath = path === '/' || detailId !== undefined || milestoneId !== undefined || submissionId !== undefined;
  useEffect(() => {
    let active = true; setError(null); setResult(null);
    if (milestoneId || submissionId) return;
    if (!validPath) { setError('This page could not be found. Return to your overview.'); return; }
    void sessionStore.read<Team | Team[]>(detailId ? `/teams/${detailId}` : '/teams').then(data => {
      if (active) setResult({ revision: state.revision, path, teams: Array.isArray(data) ? data : [data] });
    }).catch(reason => { if (active && !(reason instanceof StaleSessionError)) setError((reason as Error).message); });
    return () => { active = false; };
  }, [state.revision, path, attempt, detailId, milestoneId, submissionId, validPath]);
  const teams = result?.revision === state.revision && result.path === path ? result.teams : null;
  return <div className="application-shell">
    <aside className="sidebar"><a className="wordmark" href="/">fastTrack</a><Navigation role={user.role} /></aside>
    <dialog id="workspace-navigation" ref={dialog} className="navigation-dialog" aria-labelledby="navigation-title" onKeyDown={trapNavigationFocus} onClose={() => { setMenuOpen(false); if (state.phase === 'ready' && !matchMedia('(min-width: 1200px)').matches) menu.current?.focus(); }}>
      <div className="navigation-heading"><h2 id="navigation-title">Navigation</h2><Button type="button" variant="secondary" onClick={() => dialog.current?.close()}>Close menu</Button></div><Navigation role={user.role} />
    </dialog>
    <div className="workspace"><header className="app-header">
      <button ref={menu} className="menu-button" type="button" aria-controls="workspace-navigation" aria-expanded={menuOpen} onClick={() => { dialog.current?.showModal(); setMenuOpen(true); }}>Menu</button>
      <p className="account-summary"><span>{user.displayName}</span> <span className="role-label">{user.role === 'student' ? 'Student' : 'Supervisor'}</span></p>
      <Button variant="ghost" type="button" onClick={() => { void sessionStore.logout(); }}>Sign out</Button>
    </header><main id={state.phase === 'ready' ? 'main-content' : undefined} className="workspace-content">
      {submissionId ? <SubmissionDetail id={submissionId} renderFeedback={submission => <FeedbackPanel key={submission.id} submissionId={submission.id} submissionVersion={submission.version} userRole={user.role} />} /> : milestoneId ? submitting ? <SubmissionCreate milestoneId={milestoneId} userRole={user.role} /> : <MilestoneDetail id={milestoneId} userRole={user.role} /> : <><p className="breadcrumb"><a href="/">Overview</a>{detailId && teams?.[0] ? ` / ${teams[0].name}` : ''}</p>
      <h1>{creating ? 'Create milestone' : detailId && teams?.[0] ? teams[0].name : user.role === 'supervisor' ? 'Your teams' : 'Your team'}</h1>
      <p className="intro">{creating ? `Set the work and deadline${teams?.[0] ? ` for ${teams[0].name}` : ' for this team'}.` : detailId ? 'Your team members, deadlines and submitted work.' : user.role === 'supervisor' ? 'Choose a team to view its workspace.' : 'Your project team and supervisor.'}</p>
      {error ? <section className="notice" role="alert"><p>{error}</p><div className="recovery-actions"><Button variant="secondary" onClick={() => setAttempt(value => value + 1)}>Try again</Button><a href="/">Back to overview</a></div></section>
      : teams === null ? <p role="status">Loading your team workspace…</p>
      : teams.length === 0 ? <EmptyState title={user.role === 'student' ? 'No team assigned yet' : 'No supervised teams yet'} description="Contact your course supervisor to arrange your team." />
      : <section id="teams" aria-label="Teams" className={`team-list${!detailId && user.role === 'supervisor' ? ' team-list--supervisor' : ''}`}>{teams.map(team => <article className="team-row" key={team.id}>
        {!detailId && <h2><a href={`/teams/${team.id}`}>{team.name}<span aria-hidden="true"> ↗</span></a></h2>}
        {!creating && (detailId || user.role === 'supervisor') && <dl><div><dt>Supervisor</dt><dd>{team.supervisor.displayName}</dd></div><div><dt>Team members</dt><dd>{team.members.length ? <ul>{team.members.map(member => <li key={member.id}>{member.displayName}</li>)}</ul> : 'No members assigned yet'}</dd></div></dl>}
        {(detailId || user.role === 'student') && (creating ? <MilestoneCreate teamId={team.id} userRole={user.role} /> : <MilestoneTrack teamId={team.id} userRole={user.role} />)}
        {!detailId && <a className="team-link" href={`/teams/${team.id}`}>Open team</a>}
      </article>)}</section>}</>}
    </main></div>
  </div>;
}
export function App() {
  const state = useSyncExternalStore(sessionStore.subscribe, sessionStore.getSnapshot);
  const [path, setPath] = useState(location.pathname);
  useEffect(() => {
    void sessionStore.restore();
    const pop = () => { setPath(location.pathname); void sessionStore.restore(); };
    const pagehide = () => sessionStore.lock();
    const pageshow = (event: PageTransitionEvent) => { if (event.persisted) { setPath(location.pathname); void sessionStore.restore(); } };
    const visibility = () => { if (document.visibilityState === 'hidden') sessionStore.suspend(); else void sessionStore.revalidate(); };
    window.addEventListener('popstate', pop); window.addEventListener('pagehide', pagehide); window.addEventListener('pageshow', pageshow); document.addEventListener('visibilitychange', visibility);
    return () => { window.removeEventListener('popstate', pop); window.removeEventListener('pagehide', pagehide); window.removeEventListener('pageshow', pageshow); document.removeEventListener('visibilitychange', visibility); };
  }, []);
  return <><a className="skip-link" href="#main-content">Skip to content</a>
    {state.phase === 'loading' || state.phase === 'checking' ? <main id="main-content" className="session-status" role="status"><p className="wordmark">fastTrack</p><p>{state.recovery === 'logout' ? 'Signing out…' : 'Checking your session…'}</p></main>
    : state.phase === 'unavailable' ? <main id="main-content" className="session-status"><h1>Unable to continue</h1><p role="alert">{state.error}</p><Button onClick={() => { void (state.recovery === 'logout' ? sessionStore.logout() : sessionStore.revalidate()); }}>{state.recovery === 'logout' ? 'Retry sign-out' : 'Try again'}</Button>{state.auth && <Button variant="ghost" onClick={() => { void sessionStore.logout(); }}>Sign out</Button>}</main>
    : !state.auth ? <Login state={state} /> : null}
    <div hidden={state.phase !== 'ready'}>{state.auth && <Workspace key={state.revision} state={state} path={path} />}</div>
  </>;
}
