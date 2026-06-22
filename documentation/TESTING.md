# Testing Guide

## Overview

This backend uses Jest for unit and integration tests, with comprehensive test coverage targets and E2E tests using Supertest.

## Test Structure

```
tests/
├── setup.ts              # Global test configuration
├── unit/                 # Unit tests for individual functions/classes
│   ├── api-error.spec.ts
│   ├── validation.middleware.spec.ts
│   └── response.middleware.spec.ts
└── e2e/                  # End-to-end API tests
    └── auth.e2e.test.ts
```

## Running Tests

### All Tests
```bash
npm test
```

### Watch Mode (for development)
```bash
npm run test:watch
```

### E2E Tests Only
```bash
npm run test:e2e
```

### Tests with Coverage Report
```bash
npm test -- --coverage
```

## Writing Tests

### Unit Test Template
```typescript
import { functionToTest } from '../src/path/to/function';

describe('FunctionName', () => {
  it('should do something when condition X', () => {
    // Arrange
    const input = { /* ... */ };

    // Act
    const result = functionToTest(input);

    // Assert
    expect(result).toEqual(expectedOutput);
  });
});
```

### E2E Test Template
```typescript
import request from 'supertest';
import { app } from '../../src/app';

describe('POST /api/v1/endpoint', () => {
  it('should return 200 with valid input', async () => {
    const response = await request(app)
      .post('/api/v1/endpoint')
      .send({ /* payload */ });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });
});
```

## Coverage Targets

- **Branches**: 40%
- **Functions**: 40%
- **Lines**: 40%
- **Statements**: 40%

View detailed coverage report:
```bash
npm test -- --coverage
open coverage/lcov-report/index.html  # macOS
start coverage/lcov-report/index.html # Windows
```

## Best Practices

1. **Test naming**: Use descriptive names starting with "should"
   - ✅ "should return 400 when email is invalid"
   - ❌ "test login"

2. **Test organization**: Use AAA pattern (Arrange, Act, Assert)

3. **Mocking**: Use `jest.mock()` for external dependencies
   - Database calls
   - API calls
   - Logger functions

4. **Test isolation**: Each test should be independent
   - Use `beforeEach()` for setup
   - Use `afterEach()` for cleanup

5. **Assertions**: Be specific
   - ✅ `expect(result).toEqual({ id: '123', name: 'Test' })`
   - ❌ `expect(result).toBeDefined()`

## Common Testing Patterns

### Mocking Request/Response
```typescript
let req: Partial<Request>;
let res: Partial<Response>;

beforeEach(() => {
  req = { body: {}, params: {} };
  res = { 
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
});
```

### Testing Middleware
```typescript
it('should call next on valid input', () => {
  const next = jest.fn();
  middleware(req as Request, res as Response, next);
  expect(next).toHaveBeenCalled();
});
```

### Testing Error Handling
```typescript
it('should throw ApiError on invalid data', () => {
  expect(() => functionToTest(invalidData)).toThrow(ApiError);
});
```

## Continuous Integration

Tests run automatically on:
- Pull request creation
- Pushes to main branch
- Before deployment

Minimum coverage must pass before merging.

## Debugging Tests

### Run single test file
```bash
npx jest tests/unit/api-error.spec.ts
```

### Run tests matching pattern
```bash
npx jest --testNamePattern="should return"
```

### Debug mode (Node inspector)
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Tips

- Use `test.only()` to focus on specific tests
- Use `test.skip()` to skip tests temporarily
- Check test output for helpful error messages
- Review Jest documentation: https://jestjs.io/docs/getting-started
