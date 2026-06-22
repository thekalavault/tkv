import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../logger/logger';

declare global {
  namespace Express {
    interface Request {
      id?: string;
    }
  }
}

export function requestLoggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // Assign unique request ID
  req.id = uuidv4();

  const startTime = Date.now();

  // Log incoming request
  logger.info(
    {
      requestId: req.id,
      method: req.method,
      path: req.path,
      query: req.query,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    },
    'Incoming request',
  );

  // Intercept response to log it
  const originalSend = res.send.bind(res);
  res.send = function (data: any) {
    const duration = Date.now() - startTime;
    logger.info(
      {
        requestId: req.id,
        method: req.method,
        path: req.path,
        statusCode: res.statusCode,
        duration: `${duration}ms`,
      },
      'Request completed',
    );
    return originalSend(data);
  };

  next();
}
