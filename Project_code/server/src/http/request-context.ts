import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import type { RequestHandler } from 'express';

export interface RequestLog {
  readonly requestId: string;
  readonly method: string;
  readonly route: string;
  readonly status: number;
  readonly durationMs: number;
}
export type RequestLogger = (entry: RequestLog) => void;

export const stdoutLogger: RequestLogger = entry => { process.stdout.write(`${JSON.stringify(entry)}\n`); };

export function requestContext(logger: RequestLogger): RequestHandler {
  return (req, res, next) => {
    const requestId = randomUUID();
    const startedAt = performance.now();
    res.locals.requestId = requestId;
    res.setHeader('X-Request-Id', requestId);
    res.once('finish', () => {
      const route = req.route?.path;
      logger({ requestId, method: req.method, route: typeof route === 'string' ? route : 'unmatched',
        status: res.statusCode, durationMs: Math.round((performance.now() - startedAt) * 100) / 100 });
    });
    next();
  };
}
