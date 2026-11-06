import { describe, expect, it, vi } from 'vitest';
import { ApiError, safeReturnTo, SessionStore, StaleSessionError } from './session';

const auth = (id: string) => ({ user: { id, displayName: `User ${id}`, role: 'student' }, csrfToken: id.repeat(43) });
const json = (data: unknown) => new Response(JSON.stringify({ data }), { status: 200 });
const denied = () => new Response(JSON.stringify({ error: { message: 'Sign in to continue.' } }), { status: 401 });
function deferred<T>() { let resolve!: (value: T) => void; const promise = new Promise<T>(done => { resolve = done; }); return { promise, resolve }; }

describe('F-01 account isolation and recovery', () => {
  it('sends the current session CSRF for protected mutations and retains domain serverTime', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockResolvedValueOnce(json({ id: 'saved' }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [], meta: { serverTime: '2030-01-01T00:00:00.000Z' } }), { status: 200 }));
    const store = new SessionStore(fetcher); await store.login('a', 'synthetic');
    expect(await store.mutate('/teams/team/milestones', { title: 'Work' })).toEqual({ id: 'saved' });
    expect(fetcher.mock.calls[1]?.[1]).toMatchObject({ method: 'POST', credentials: 'same-origin', cache: 'no-store', headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': 'a'.repeat(43) } });
    expect(await store.readDomain('/teams/team/milestones')).toEqual({ data: [], meta: { serverTime: '2030-01-01T00:00:00.000Z' } });
  });
  it('drops a late mutation result after account change', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockReturnValueOnce(pending.promise).mockResolvedValueOnce(json(auth('b')));
    const store = new SessionStore(fetcher); await store.login('a', 'synthetic');
    const mutation = store.mutate('/teams/team/milestones', { title: 'Work' });
    const rejected = expect(mutation).rejects.toBeInstanceOf(StaleSessionError);
    await store.login('b', 'synthetic'); pending.resolve(json({ id: 'private' })); await rejected;
    expect(store.getSnapshot().auth?.user.id).toBe('b');
  });
  it('uses the global receiver required by the browser Fetch API', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(function (this: unknown) {
      expect(this).toBe(globalThis);
      return Promise.resolve(json(auth('a')));
    });
    const store = new SessionStore(); await store.restore();
    expect(store.getSnapshot().phase).toBe('ready');
  });
  it('T-27 discards old private reads after logout/account change without changing the new account', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockReturnValueOnce(pending.promise)
      .mockResolvedValueOnce(new Response(null, { status: 204 })).mockResolvedValueOnce(json(auth('b')));
    const store = new SessionStore(fetcher);
    await store.login('a@example.local', 'synthetic');
    const oldRead = store.read('/teams');
    const rejection = expect(oldRead).rejects.toBeInstanceOf(StaleSessionError);
    await store.logout(); await store.login('b@example.local', 'synthetic');
    pending.resolve(json([{ name: 'Private team A' }])); await rejection;
    expect(store.getSnapshot().auth?.user.id).toBe('b');
    expect(JSON.stringify(store.getSnapshot())).not.toContain('Private team A');
  });
  it('T-27 does not let an old 401 clear a newly authenticated account', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockReturnValueOnce(pending.promise).mockResolvedValueOnce(json(auth('b')));
    const store = new SessionStore(fetcher); await store.login('a', 'synthetic');
    const result = store.read('/teams'); const rejection = expect(result).rejects.toBeInstanceOf(StaleSessionError);
    await store.login('b', 'synthetic'); pending.resolve(denied()); await rejection;
    expect(store.getSnapshot().auth?.user.id).toBe('b');
  });
  it('T-27 clears current private state on expiry and on a navigation lock', async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockResolvedValueOnce(denied()).mockResolvedValueOnce(json(auth('b')));
    const store = new SessionStore(fetcher); await store.login('a', 'synthetic');
    await expect(store.read('/teams')).rejects.toBeInstanceOf(ApiError);
    expect(store.getSnapshot().phase).toBe('anonymous'); expect(store.getSnapshot().auth).toBeNull();
    await store.login('b', 'synthetic'); store.lock();
    expect(store.getSnapshot().auth).toBeNull(); expect(store.getSnapshot().phase).toBe('loading');
  });
  it('T-27 clears private data immediately on sign-out and retains a safe retry if the request fails', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockReturnValueOnce(pending.promise).mockResolvedValueOnce(new Response(null, { status: 204 }));
    const store = new SessionStore(fetcher); await store.login('a', 'synthetic');
    const logout = store.logout(); expect(store.getSnapshot().auth).toBeNull();
    pending.resolve(new Response('{}', { status: 503 })); await logout;
    expect(store.getSnapshot().phase).toBe('unavailable'); expect(store.getSnapshot().recovery).toBe('logout');
    await store.restore(); expect(store.getSnapshot().phase).toBe('anonymous');
    expect(fetcher.mock.calls[2]?.[0]).toBe('/api/auth/logout');
    expect(fetcher.mock.calls[2]?.[1]?.headers).toEqual({ 'X-CSRF-Token': 'a'.repeat(43) });
  });
  it('T-23 restores only the latest session and uses same-origin/no-store request options', async () => {
    const pending = deferred<Response>();
    const fetcher = vi.fn<typeof fetch>().mockReturnValueOnce(pending.promise).mockResolvedValueOnce(json(auth('b')));
    const store = new SessionStore(fetcher); const restore = store.restore();
    await store.login('b', 'synthetic'); pending.resolve(json(auth('a'))); await restore;
    expect(store.getSnapshot().auth?.user.id).toBe('b');
    for (const call of fetcher.mock.calls) expect(call[1]).toMatchObject({ credentials: 'same-origin', cache: 'no-store' });
    expect(fetcher.mock.calls[1]?.[1]?.headers).toEqual({ 'Content-Type': 'application/json', 'X-fastTrack-Request': '1' });
  });
  it('T-02 exposes useful network errors without retaining failed login credentials/private identity', async () => {
    const store = new SessionStore(vi.fn<typeof fetch>().mockRejectedValue(new Error('network detail')));
    expect(await store.login('synthetic@example.local', 'synthetic-only')).toBe(false);
    expect(store.getSnapshot().auth).toBeNull(); expect(store.getSnapshot().error).toContain('Check your connection');
    expect(JSON.stringify(store.getSnapshot())).not.toContain('synthetic-only');
  });
});
describe('F-01 internal return-to destinations', () => {
  it.each(['/milestones/11111111-1111-1111-1111-111111111111', '/teams/11111111-1111-1111-1111-111111111111/milestones/new',
    '/milestones/11111111-1111-1111-1111-111111111111/submissions/new', '/submissions/11111111-1111-1111-1111-111111111111'])('permits implemented milestone/submission destination %s with server-side scope still required', path => {
    expect(safeReturnTo(path)).toBe(path);
  });
  it.each(['https://foreign.example', '//foreign.example', '/\\foreign.example', '/%2f%2fforeign.example', '/login', '/teams/invalid', '/\n/foreign.example', null])('T-27 rejects unsafe/unimplemented destination %j', value => {
    expect(safeReturnTo(value)).toBe('/');
  });
  it('T-27 preserves an implemented internal path, whose API still rechecks scope', () => {
    const path = '/teams/11111111-1111-1111-1111-111111111111?view=team#members'; expect(safeReturnTo(path)).toBe(path);
  });
});

describe('F-03 private mutation recovery information', () => {
  it('retains the actual business code and field errors for truthful duplicate/deadline recovery',async () => {
    const fetcher=vi.fn<typeof fetch>().mockResolvedValueOnce(json(auth('a'))).mockResolvedValueOnce(new Response(JSON.stringify({
      error:{code:'ALREADY_SUBMITTED',message:'Your team already submitted.',fields:{url:'Check this link.'}},
    }),{status:409,headers:{'Content-Type':'application/json'}}));
    const store=new SessionStore(fetcher);await store.restore();
    await expect(store.mutate('/milestones/id/submissions',{})).rejects.toMatchObject({status:409,code:'ALREADY_SUBMITTED',fields:{url:'Check this link.'}});
    expect(store.getSnapshot().phase).toBe('ready');
  });
});
