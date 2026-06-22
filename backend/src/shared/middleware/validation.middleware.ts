import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { ApiError } from '../errors/api-error';

type ValidationTarget = 'body' | 'query' | 'params';

export function validateRequest(schema: ZodSchema, target: ValidationTarget = 'body') {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const dataToValidate = target === 'body' ? req.body : target === 'query' ? req.query : req.params;
      const result = schema.safeParse(dataToValidate);

      if (!result.success) {
        const errors = result.error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code,
        }));
        throw new ApiError('Validation failed', 400, { errors });
      }

      // Replace the data with validated data
      if (target === 'body') {
        req.body = result.data;
      } else if (target === 'query') {
        req.query = result.data as any;
      } else {
        req.params = result.data as any;
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}
