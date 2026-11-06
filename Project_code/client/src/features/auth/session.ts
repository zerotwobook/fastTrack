export interface User { id: string; displayName: string; role: 'student' | 'supervisor' }
export interface AuthData { user: User; csrfToken: string }
export interface Team { id: string; name: string; supervisor: Pick<User, 'id' | 'displayName'>; members: Pick<User, 'id' | 'displayName'>[] }
export interface SessionSnapshot {
  readonly phase: 'loading' | 'anonymous' | 'ready' | 'unavailable';
  readonly auth: AuthData | null; readonly error: string | null; readonly busy: boolean;
  readonly revision: number; readonly recovery: 'session' | 'logout';
}
export class ApiError extends Error { constructor(readonly status: number, message: string) { super(message); } }
export class StaleSessionError extends Error {}
export function safeReturnTo(value: string | null): string {
  if (!value || !value.startsWith('/') || value.startsWith('//') || /[\u0000-\u0020\\]/.test(value)) return '/';
  try {
    const url = new URL(value, 'https://fasttrack.invalid');
    if (url.origin !== 'https://fasttrack.invalid' || !(url.pathname === '/' || /^\/teams\/[a-f0-9-]{36}$/i.test(url.pathname))) return '/';
    return url.pathname + url.search + url.hash;
  } catch { return '/'; }
}
/** Memory only. Generation checks prevent stale account responses from rendering. */
export class SessionStore {
  private generation = 0;
  private pendingLogout: string | null = null;
  private listeners = new Set<() => void>();
  private snapshot: SessionSnapshot = { phase: 'loading', auth: null, error: null, busy: false, revision: 0, recovery: 'session' };
  constructor(private readonly fetcher: typeof fetch = globalThis.fetch.bind(globalThis)) {}
  readonly subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener); }; };
  readonly getSnapshot = () => this.snapshot;
  private publish(state: Omit<SessionSnapshot, 'revision'>) {
    this.snapshot = { ...state, revision: this.generation }; for (const listener of this.listeners) listener();
  }
  private async api<T>(path: string, options: RequestInit = {}): Promise<T> {
    let response: Response;
    try { response = await this.fetcher(`/api${path}`, { ...options, credentials: 'same-origin', cache: 'no-store' }); }
    catch { throw new ApiError(0, 'Unable to reach fastTrack. Check your connection and try again.'); }
    if (response.status === 204) return undefined as T;
    let body: { data?: T; error?: { message?: string } };
    try { body = await response.json() as typeof body; }
    catch { throw new ApiError(0, 'The service returned an unreadable response. Try again.'); }
    if (!response.ok) throw new ApiError(response.status, body.error?.message ?? 'The request could not be completed.');
    return body.data as T;
  }
  lock(): void { this.generation++; this.publish({ phase: 'loading', auth: null, error: null, busy: false, recovery: this.pendingLogout ? 'logout' : 'session' }); }
  async restore(): Promise<void> {
    if (this.pendingLogout) return this.logout();
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
    if (this.snapshot.phase !== 'ready') throw new StaleSessionError();
    const version = this.generation;
    try {
      const data = await this.api<T>(path); if (version !== this.generation) throw new StaleSessionError(); return data;
    } catch (error) {
      if (version !== this.generation) throw new StaleSessionError();
      if (error instanceof ApiError && error.status === 401) {
        this.generation++; this.publish({ phase: 'anonymous', auth: null, error: 'Your session has expired. Sign in again.', busy: false, recovery: 'session' });
      }
      throw error;
    }
  }
}
export const sessionStore = new SessionStore();
