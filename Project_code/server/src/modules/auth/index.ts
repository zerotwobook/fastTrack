import { randomBytes } from 'node:crypto';
import { Router } from 'express';
import type { CookieOptions } from 'express';
import { AppError, parseJsonBody, requireJsonBody } from '../../http/errors.js';
import { createSessionProtection, database, requireCsrf, requireSource, SESSION_COOKIE, sessionToken, tokenHash, verifyPassword } from './security.js';
import type { AuthDependencies, SessionProtection } from './security.js';
export { createSessionProtection } from './security.js';
export type { AuthContext, AuthDependencies, SessionProtection } from './security.js';

export function createAuthRouter(deps: AuthDependencies & { readonly protection?: SessionProtection }): Router {
  const { prisma, config, now = () => new Date() } = deps;
  const protection = deps.protection ?? createSessionProtection(deps);
  const router = Router();
  const cookie: CookieOptions = { httpOnly: true, sameSite: 'lax', secure: config.appOrigin.startsWith('https:'), path: '/' };
  const userDto = (user: { id: string; name: string; role: string }) => ({ id: user.id, displayName: user.name, role: user.role });
  router.post('/auth/login', (req, _res, next) => {
    requireSource(req, config);
    if (req.get('X-fastTrack-Request') !== '1') throw new AppError(403, 'FORBIDDEN', 'The request security header is required.');
    next();
  }, requireJsonBody, parseJsonBody, async (req, res) => {
    const body: unknown = req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body) ||
        Object.keys(body).some(key => !['email', 'password'].includes(key)) ||
        !('email' in body) || typeof body.email !== 'string' || !body.email.trim() ||
        !('password' in body) || typeof body.password !== 'string' || !body.password) {
      throw new AppError(400, 'INVALID_INPUT', 'Provide your email and password.', { email: 'Enter your email.', password: 'Enter your password.' });
    }
    const email = body.email.trim().toLowerCase();
    const user = await database(() => prisma.user.findUnique({ where: { email } }));
    const matched = await verifyPassword(body.password, user?.passwordHash);
    if (!user || !matched) throw new AppError(401, 'INVALID_CREDENTIALS', 'Email or password is incorrect. Check and try again.');
    const token = randomBytes(32).toString('base64url');
    const csrfToken = randomBytes(32).toString('base64url');
    const at = now();
    const expiresAt = new Date(at.getTime() + config.sessionTtlHours * 60 * 60 * 1000);
    const previous = sessionToken(req);
    await database(() => prisma.$transaction(async tx => {
      if (previous) await tx.session.updateMany({ where: { tokenHash: tokenHash(previous), revokedAt: null }, data: { revokedAt: at } });
      await tx.session.create({ data: { userId: user.id, tokenHash: tokenHash(token), csrfToken, createdAt: at, expiresAt } });
    }));
    res.cookie(SESSION_COOKIE, token, { ...cookie, expires: expiresAt });
    res.json({ data: { user: userDto(user), csrfToken } });
  });
  router.get('/auth/me', protection.requireSession, async (req, res) => {
    const session = (await protection.readSession(req))!;
    res.json({ data: { user: userDto(session.user), csrfToken: session.csrfToken } });
  });
  router.post('/auth/logout', async (req, res) => {
    requireSource(req, config);
    const session = await protection.readSession(req);
    if (session) {
      requireCsrf(req, session);
      await database(() => prisma.session.updateMany({ where: { id: session.id, revokedAt: null }, data: { revokedAt: now() } }));
    }
    res.clearCookie(SESSION_COOKIE, cookie);
    res.status(204).end();
  });
  return router;
}
