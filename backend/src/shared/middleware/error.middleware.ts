import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../errors/api-error';
import { logger } from '../logger/logger';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof ApiError) {
    logger.warn({ err, path: req.path, requestId: req.id }, 'API error');
    return res.status(err.statusCode).json({
      success: false,
      code: err.statusCode,
      message: err.message,
      details: err.details,
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  // CORS errors
  if (err.message && err.message.includes('CORS policy')) {
    logger.warn({ err, path: req.path, requestId: req.id }, 'CORS error');
    return res.status(403).json({
      success: false,
      code: 403,
      message: 'CORS policy violation',
      timestamp: new Date().toISOString(),
      path: req.path,
    });
  }

  logger.error({ err, path: req.path, requestId: req.id }, 'Unhandled error');
  res.status(500).json({
    success: false,
    code: 500,
    message: 'Internal server error',
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}
