import { ApiError } from '../../src/shared/errors/api-error';

describe('ApiError', () => {
  it('should create error with default status code', () => {
    const error = new ApiError('Something went wrong');

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(500);
    expect(error.details).toBeUndefined();
  });

  it('should create error with custom status code', () => {
    const error = new ApiError('Not found', 404);

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
  });

  it('should create error with details', () => {
    const details = { field: 'email', reason: 'duplicate' };
    const error = new ApiError('Validation failed', 400, details);

    expect(error.message).toBe('Validation failed');
    expect(error.statusCode).toBe(400);
    expect(error.details).toEqual(details);
  });

  it('should inherit from Error', () => {
    const error = new ApiError('Test error', 500);

    expect(error instanceof Error).toBe(true);
  });

  it('should have proper error stack trace', () => {
    const error = new ApiError('Test error');

    expect(error.stack).toBeDefined();
  });
});
