import express from 'express';
import type { ErrorRequestHandler, RequestHandler } from 'express';

export type FieldErrors = Readonly<Record<string, string>>;
export type ErrorStatus = 400 | 401 | 403 | 404 | 409 | 415 | 500 | 503;

export class AppError extends Error {
  constructor(readonly status: ErrorStatus, readonly code: string, message: string, readonly fields: FieldErrors = {}) {
    super(message);
    this.name = 'AppError';
  }
}

/** Mount in the domain router at the contract's input-validation stage. */
export const requireJsonBody: RequestHandler = (req, _res, next) => {
  if (!req.is('application/json')) return next(new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use application/json.'));
  next();
};

/** Mount after session/role/source protection, alongside requireJsonBody. */
export const parseJsonBody = express.json({ limit: '64kb', strict: true });

export const notFound: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, 'NOT_FOUND', 'The requested resource was not found.'));
};

export const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, next) => {
  if (res.headersSent) return next(error);
  const parserType = error && typeof error === 'object' && 'type' in error ? error.type : undefined;
  const safe = error instanceof AppError ? error :
    parserType === 'entity.parse.failed' || parserType === 'entity.too.large'
      ? new AppError(400, 'INVALID_INPUT', 'Provide a valid JSON body within the size limit.')
      : parserType === 'charset.unsupported' || parserType === 'encoding.unsupported'
        ? new AppError(415, 'UNSUPPORTED_MEDIA_TYPE', 'Use UTF-8 JSON without unsupported encoding.')
        : new AppError(500, 'INTERNAL_ERROR', 'The request could not be completed.');
  res.status(safe.status).json({ error: { code: safe.code, message: safe.message, fields: safe.fields } });
};
