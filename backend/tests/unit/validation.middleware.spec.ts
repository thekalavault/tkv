import { validateRequest } from '../../src/shared/middleware/validation.middleware';
import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../src/shared/errors/api-error';

describe('Validation Middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
    };
    res = {};
    next = jest.fn();
  });

  it('should pass valid data', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    req.body = {
      email: 'test@example.com',
      password: 'password123',
    };

    const middleware = validateRequest(schema, 'body');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(req.body).toEqual({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should reject invalid email', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    req.body = {
      email: 'invalid-email',
      password: 'password123',
    };

    const middleware = validateRequest(schema, 'body');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  it('should reject short password', () => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(8),
    });

    req.body = {
      email: 'test@example.com',
      password: 'short',
    };

    const middleware = validateRequest(schema, 'body');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(ApiError));
  });

  it('should validate query parameters', () => {
    const schema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(10),
    });

    req.query = {
      page: '2',
      limit: '20',
    };

    const middleware = validateRequest(schema, 'query');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });

  it('should apply defaults', () => {
    const schema = z.object({
      page: z.coerce.number().int().positive().default(1),
      limit: z.coerce.number().int().positive().default(10),
    });

    req.query = {};

    const middleware = validateRequest(schema, 'query');
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
  });
});
