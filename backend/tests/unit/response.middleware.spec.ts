import { responseMiddleware } from '../../src/shared/middleware/response.middleware';
import { Request, Response, NextFunction } from 'express';

describe('Response Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      path: '/api/test',
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    next = jest.fn();
  });

  it('should add sendSuccess method to response', () => {
    responseMiddleware(req as Request, res as Response, next);

    expect(res.sendSuccess).toBeDefined();
    expect(typeof res.sendSuccess).toBe('function');
  });

  it('should add sendError method to response', () => {
    responseMiddleware(req as Request, res as Response, next);

    expect(res.sendError).toBeDefined();
    expect(typeof res.sendError).toBe('function');
  });

  it('should call next after adding methods', () => {
    responseMiddleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('sendSuccess should format response correctly', () => {
    responseMiddleware(req as Request, res as Response, next);

    const mockData = { id: '123', name: 'Test' };
    res.sendSuccess!(mockData, 'Data fetched', 200);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        code: 200,
        message: 'Data fetched',
        data: mockData,
        timestamp: expect.any(String),
        path: '/api/test',
      }),
    );
  });

  it('sendError should format error response correctly', () => {
    responseMiddleware(req as Request, res as Response, next);

    const errorDetails = { field: 'email', message: 'Invalid email' };
    res.sendError!('Validation failed', 400, errorDetails);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        code: 400,
        message: 'Validation failed',
        details: errorDetails,
        timestamp: expect.any(String),
        path: '/api/test',
      }),
    );
  });
});
