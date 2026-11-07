import { createHash, scrypt, timingSafeEqual } from 'node:crypto';
import type { Request, RequestHandler } from 'express';
import type { AppConfig } from '../../config.js';
import type { Prisma, PrismaClient } from '../../db/generated/client/index.js';
import { AppError } from '../../http/errors.js';

export const SESSION_COOKIE = 'fasttrack_session';
export interface AuthDependencies {
  readonly prisma: PrismaClient;
  readonly config: AppConfig;
  /** Internal test seam; never populated from HTTP input. */
  readonly now?: () => Date;
}
export interface AuthContext {
  readonly userId: string;
  readonly role: 'student' | 'supervisor';
  readonly sessionId: string;
}
type Session = Prisma.SessionGetPayload<{ include: { user: true } }>;

export async function database<T>(operation: () => Promise<T>): Promise<T> {
  try { return await operation(); }
  catch { throw new AppError(503, 'TEMPORARILY_UNAVAILABLE', 'The service is temporarily unavailable. Try again.'); }
}

export function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

/** Match B's existing seed format without changing stored credentials. */
export async function verifyPassword(password: string, stored: string | undefined): Promise<boolean> {
  const valid = stored !== undefined && /^[a-f0-9]{32}:[a-f0-9]{128}$/.test(stored);
  const [salt, hash] = (valid ? stored : `${'0'.repeat(32)}:${'0'.repeat(128)}`).split(':');
  const actual = await new Promise<Buffer>((resolve, reject) => {
    scrypt(password, salt!, 64, (error, key) => error ? reject(error) : resolve(key));
  });
  return timingSafeEqual(actual, Buffer.from(hash!, 'hex')) && valid;
}

export function sessionToken(req: Request): string | undefined {
  const matches = (req.headers.cookie ?? '').split(';').map(value => value.trim())
    .filter(value => value.startsWith(`${SESSION_COOKIE}=`));
  if (matches.length !== 1) return undefined;
  const token = matches[0]!.slice(SESSION_COOKIE.length + 1);
  return /^[A-Za-z0-9_-]{43}$/.test(token) ? token : undefined;
}

export function requireSource(req: Request, config: AppConfig): void {
  const origin = req.get('Origin');
  if (origin !== undefined) {
    if (origin === config.appOrigin) return;
  } else {
    try {
      const referer = new URL(req.get('Referer') ?? '');
      if (!referer.username && !referer.password && referer.origin === config.appOrigin) return;
    } catch { /* Missing/malformed source is denied below. */ }
  }
  throw new AppError(403, 'FORBIDDEN', 'This request source is not allowed.');
}

export function requireCsrf(req: Request, session: Session): void {
  const actual = req.get('X-CSRF-Token') ?? '';
  const expected = session.csrfToken;
  if (!/^[A-Za-z0-9_-]{43}$/.test(actual) || !/^[A-Za-z0-9_-]{43}$/.test(expected) ||
      !timingSafeEqual(Buffer.from(actual), Buffer.from(expected))) {
    throw new AppError(403, 'FORBIDDEN', 'The security token is invalid. Reload and try again.');
  }
}

export function createSessionProtection({ prisma, config, now = () => new Date() }: AuthDependencies) {
  const sessions = new WeakMap<Request, Promise<Session | null>>();
  const readSession = (req: Request): Promise<Session | null> => {
    let pending = sessions.get(req);
    if (!pending) {
      pending = (async () => {
        const token = sessionToken(req);
        if (!token) return null;
        const session = await database(() => prisma.session.findUnique({ where: { tokenHash: tokenHash(token) }, include: { user: true } }));
        return session && session.revokedAt === null && session.expiresAt.getTime() > now().getTime() ? session : null;
      })();
      sessions.set(req, pending);
    }
    return pending;
  };
  const getAuthContext = async (req: Request): Promise<AuthContext> => {
    const session = await readSession(req);
    if (!session) throw new AppError(401, 'UNAUTHENTICATED', 'Sign in to continue.');
    return Object.freeze({ userId: session.user.id, role: session.user.role, sessionId: session.id });
  };
  const requireSession: RequestHandler = async (req, _res, next) => { await getAuthContext(req); next(); };
  const requireRole = (role: AuthContext['role']): RequestHandler => async (req, _res, next) => {
    if ((await getAuthContext(req)).role !== role) throw new AppError(403, 'FORBIDDEN', 'This action is not allowed for your role.');
    next();
  };
  const requireMutation: RequestHandler = async (req, _res, next) => {
    await getAuthContext(req);
    requireSource(req, config);
    requireCsrf(req, (await readSession(req))!);
    next();
  };
  return Object.freeze({ requireSession, requireRole, requireMutation, getAuthContext, readSession });
}
export type SessionProtection = ReturnType<typeof createSessionProtection>;
