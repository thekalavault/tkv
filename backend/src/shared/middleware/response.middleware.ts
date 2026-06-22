import { Request, Response, NextFunction } from 'express';

export interface ApiResponse<T = any> {
  success: boolean;
  code: number;
  message: string;
  data?: T;
  details?: any;
  timestamp: string;
  path?: string;
}

declare global {
  namespace Express {
    interface Response {
      sendSuccess<T>(data: T, message?: string, statusCode?: number): void;
      sendError(message: string, statusCode?: number, details?: any): void;
    }
  }
}

export function responseMiddleware(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  // Success response
  res.sendSuccess = function <T>(data: T, message: string = 'Success', statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      code: statusCode,
      message,
      data,
      timestamp: new Date().toISOString(),
      path: req.path,
    };
    return res.status(statusCode).json(response);
  };

  // Error response
  res.sendError = function (message: string, statusCode: number = 500, details?: any) {
    const response: ApiResponse = {
      success: false,
      code: statusCode,
      message,
      timestamp: new Date().toISOString(),
      path: req.path,
    };
    if (details) {
      response.details = details;
    }
    return res.status(statusCode).json(response);
  };

  next();
}
