export interface User { id: string; displayName: string; role: 'student' | 'supervisor' }
export interface AuthData { user: User; csrfToken: string }
export interface Team { id: string; name: string; supervisor: Pick<User, 'id' | 'displayName'>; members: Pick<User, 'id' | 'displayName'>[] }
export interface SessionSnapshot {
  readonly phase: 'loading' | 'checking' | 'anonymous' | 'ready' | 'unavailable';
  readonly auth: AuthData | null; readonly error: string | null; readonly busy: boolean;
  readonly revision: number; readonly recovery: 'session' | 'logout';
}
export interface DomainRead<T> { data: T; meta: { serverTime: string } }
export class ApiError extends Error { constructor(readonly status: number, message: string, readonly fields: Readonly<Record<string, string>> = {}, readonly code: string | null = null) { super(message); } }
export class StaleSessionError extends Error {}
export function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\u0000-\u0020\\]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://fasttrack.invalid');
    if (url.origin !== 'https://fasttrack.invalid' || !(url.pathname === '/' || /^\/teams\/[a-f0-9-]{36}(?:\/milestones\/new)?$/i.test(url.pathname) || /^\/milestones\/[a-f0-9-]{36}(?:\/submissions\/new)?$/i.test(url.pathname) || /^\/submissions\/[a-f0-9-]{36}$/i.test(url.pathname))) return '/';
    return url.pathname + url.search + url.hash;
  } catch { return '/'; }
}
/** Memory only. Generation checks prevent stale account responses from rendering. */
export class SessionStore {
  private generation = 0;
  private sessionCheck = 0;
  private pendingLogout: string | null = null;
  private listeners = new Set<() => void>();
  private snapshot: SessionSnapshot = { phase: 'loading', auth: null, error: null, busy: false, revision: 0, recovery: 'session' };
  constructor(private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  readonly subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  readonly getSnapshot = () => this.snapshot;
  private publish(state: Omit<SessionSnapshot, 'revision'>) {
    this.snapshot = { ...state, revision: this.generation }; for (const listener of this.listeners) listener();
  }
  private async api<T>(path: string, options: RequestInit = {}, envelope = false): Promise<T> {
    let response: Response;
    try { response = await this.fetcher(`/api${path}`, { ...options, credentials: 'same-origin', cache: 'no-store' }); }
    catch { throw new ApiError(0, 'Unable to reach fastTrack. Check your connection and try again.'); }
    if (response.status === 204) return undefined as T;
    let body: { data?: T; meta?: { serverTime: string }; error?: { code?: string; message?: string; fields?: Record<string, string> } };
    try { body = await response.json() as typeof body; }
    catch { throw new ApiError(0, 'The service returned an unreadable response. Try again.'); }
    if (!response.ok) throw new ApiError(response.status, body.error?.message ?? 'The request could not be completed.', body.error?.fields ?? {}, body.error?.code ?? null);
    return (envelope ? body : body.data) as T;
  }
  lock(): void { this.sessionCheck++; this.generation++; this.publish({ phase: 'loading', auth: null, error: null, busy: false, recovery: this.pendingLogout ? 'logout' : 'session' }); }
  /** Mask the mounted workspace; only same-session verification may reveal it. */
  suspend(): void {
    if (!this.snapshot.auth) { this.lock(); return; }
    this.sessionCheck++;
    this.publish({ ...this.snapshot, phase: 'checking', error: null, busy: false });
  }
  async revalidate(): Promise<void> {
    const previous = this.snapshot.auth;
    if (!previous || this.pendingLogout) return this.restore();
    const version = this.generation; const check = ++this.sessionCheck;
    this.publish({ ...this.snapshot, phase: 'checking', error: null, busy: false });
    try {
      const auth = await this.api<AuthData>('/auth/me');
      if (version !== this.generation || check !== this.sessionCheck) return;
      if (auth.user.id !== previous.user.id || auth.user.role !== previous.user.role || auth.csrfToken !== previous.csrfToken) this.generation++;
      this.publish({ phase: 'ready', auth, error: null, busy: false, recovery: 'session' });
    } catch (error) {
      if (version !== this.generation || check !== this.sessionCheck) return;
      if (error instanceof ApiError && error.status === 401) {
        this.generation++;
        this.publish({ phase: 'anonymous', auth: null, error: 'Your session has expired. Sign in again.', busy: false, recovery: 'session' });
      } else this.publish({ phase: 'unavailable', auth: previous, error: (error as Error).message, busy: false, recovery: 'session' });
    }
  }
  async restore(): Promise<void> {
    if (this.pendingLogout) return this.logout();
    this.sessionCheck++;
    const version = ++this.generation;
    this.publish({ phase: 'loading', auth: null, error: null, busy: false, recovery: 'session' });
    try {
      const auth = await this.api<AuthData>('/auth/me');
      if (version === this.generation) this.publish({ phase: 'ready', auth, error: null, busy: false, recovery: 'session' });
    } catch (error) {
      if (version !== this.generation) return;
      const anonymous = error instanceof ApiError && error.status === 401;
      this.publish({ phase: anonymous ? 'anonymous' : 'unavailable', auth: null, error: anonymous ? null : (error as Error).message, busy: false, recovery: 'session' });
    }
  }
  async login(email: string, password: string): Promise<boolean> {
    this.sessionCheck++;
    const version = ++this.generation;
    this.publish({ phase: 'anonymous', auth: null, error: null, busy: true, recovery: 'session' });
    try {
      const auth = await this.api<AuthData>('/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-fastTrack-Request': '1' }, body: JSON.stringify({ email, password }) });
      if (version !== this.generation) return false;
      this.pendingLogout = null; this.publish({ phase: 'ready', auth, error: null, busy: false, recovery: 'session' }); return true;
    } catch (error) {
      if (version === this.generation) this.publish({ phase: 'anonymous', auth: null, error: (error as Error).message, busy: false, recovery: 'session' }); return false;
    }
  }
  async logout(): Promise<void> {
    this.sessionCheck++;
    const csrf = this.snapshot.auth?.csrfToken ?? this.pendingLogout; this.pendingLogout = csrf;
    const version = ++this.generation;
    this.publish({ phase: 'loading', auth: null, error: null, busy: true, recovery: 'logout' });
    try {
      await this.api('/auth/logout', { method: 'POST', headers: csrf ? { 'X-CSRF-Token': csrf } : {} });
      if (version !== this.generation) return;
      this.pendingLogout = null; this.publish({ phase: 'anonymous', auth: null, error: null, busy: false, recovery: 'session' });
    } catch {
      if (version === this.generation) this.publish({ phase: 'unavailable', auth: null, error: 'Sign-out could not be confirmed. Retry before leaving this browser.', busy: false, recovery: 'logout' });
    }
  }
  async read<T>(path: string): Promise<T> {
    return this.privateRequest<T>(path);
  }
  async readDomain<T>(path: string): Promise<DomainRead<T>> {
    return this.privateRequest<DomainRead<T>>(path, {}, true);
  }
  async mutate<T>(path: string, value: unknown): Promise<T> {
    const csrf = this.snapshot.auth?.csrfToken;
    return this.privateRequest<T>(path, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf ?? '' }, body: JSON.stringify(value) });
  }
  private waitUntilReady(version: number): Promise<void> {
    return new Promise((resolve, reject) => {
      let unsubscribe = () => {};
      const check = () => {
        if (version !== this.generation || !this.snapshot.auth) { unsubscribe(); reject(new StaleSessionError()); }
        else if (this.snapshot.phase === 'ready') { unsubscribe(); resolve(); }
      };
      unsubscribe = this.subscribe(check); check();
    });
  }
  private async privateRequest<T>(path: string, options: RequestInit = {}, envelope = false): Promise<T> {
    const version = this.generation;
    if (this.snapshot.phase !== 'ready') await this.waitUntilReady(version);
    if (version !== this.generation) throw new StaleSessionError();
    try {
      const data = await this.api<T>(path, options, envelope);
      if (version !== this.generation) throw new StaleSessionError();
      if (this.snapshot.phase !== 'ready') await this.waitUntilReady(version);
      if (version !== this.generation) throw new StaleSessionError();
      return data;
    } catch (error) {
      if (version !== this.generation) throw new StaleSessionError();
      if (error instanceof ApiError && error.status === 401) {
        this.sessionCheck++;
        this.generation++; this.publish({ phase: 'anonymous', auth: null, error: 'Your session has expired. Sign in again.', busy: false, recovery: 'session' });
      } else if (this.snapshot.phase !== 'ready') await this.waitUntilReady(version);
      throw error;
    }
  }
}
export const sessionStore = new SessionStore();
