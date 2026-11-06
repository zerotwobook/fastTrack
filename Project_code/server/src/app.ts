import express, { Router } from 'express';
import type { Router as DomainRouter } from 'express';
import type { AppConfig } from './config.js';
import { errorHandler, notFound } from './http/errors.js';
import { requestContext, stdoutLogger } from './http/request-context.js';
import type { RequestLogger } from './http/request-context.js';

/** Routers declare full paths relative to /api. A owns this composition root. */
export interface AppRouters {
  readonly auth?: DomainRouter;
  readonly teams?: DomainRouter;
  readonly milestones?: DomainRouter;
  readonly submissions?: DomainRouter;
  readonly feedback?: DomainRouter;
}
export interface AppOptions {
  readonly routers?: AppRouters;
  readonly logger?: RequestLogger;
  readonly clientDirectory?: string;
}

export function createApp(config: AppConfig, options: AppOptions = {}) {
  const app = express();
  app.disable('x-powered-by');
  app.use(requestContext(options.logger ?? stdoutLogger));
  app.use((_req, res, next) => { res.setHeader('X-Content-Type-Options', 'nosniff'); next(); });
  const api = Router();
  api.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  api.get('/health', (_req, res) => { res.json({ status: 'ok', version: config.releaseSha }); });
  for (const router of Object.values(options.routers ?? {})) if (router) api.use(router);
  api.use(notFound);
  app.use('/api', api);
  if (options.clientDirectory) {
    app.use(express.static(options.clientDirectory, { index: false }));
    app.get(/.*/, (req, res, next) => {
      if (!req.accepts('html') || req.path.includes('.')) return next();
      res.setHeader('Cache-Control', 'no-cache');
      res.sendFile('index.html', { root: options.clientDirectory });
    });
  }
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
