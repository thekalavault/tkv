# Contributing Guidelines

## Code Standards

### Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Server entry point
├── config/                   # Configuration files
│   ├── index.ts             # Environment config (validated with Zod)
│   └── swagger.ts           # OpenAPI documentation
├── modules/                  # Feature modules
│   └── [feature]/
│       ├── [feature].controller.ts      # HTTP handlers
│       ├── [feature].service.ts         # Business logic
│       ├── [feature].repository.ts      # Data access
│       ├── [feature].routes.ts          # Route definitions
│       └── [feature].dto.ts             # Request/response DTOs with Zod schemas
├── shared/
│   ├── middleware/           # Express middleware
│   ├── errors/              # Error classes
│   ├── logger/              # Logging utilities
│   ├── db/                  # Database utilities
│   ├── dto/                 # Shared DTOs
│   └── utils/               # Utility functions
└── jobs/                     # Background jobs (BullMQ)
```

## API Response Format

All API responses must follow this standard envelope:

```json
{
  "success": true,
  "code": 200,
  "message": "Success message",
  "data": { /* response data */ },
  "timestamp": "2026-05-27T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

### Error Response
```json
{
  "success": false,
  "code": 400,
  "message": "Validation failed",
  "details": {
    "errors": [
      { "field": "email", "message": "Invalid email", "code": "invalid_string" }
    ]
  },
  "timestamp": "2026-05-27T10:30:00Z",
  "path": "/api/v1/endpoint"
}
```

## Creating a New Module

### 1. Define DTOs with Zod Schema

**src/modules/example/example.dto.ts**
```typescript
import { z } from 'zod';

export const createExampleSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().positive().optional(),
});

export type CreateExampleDto = z.infer<typeof createExampleSchema>;
```

### 2. Create Routes with Validation

**src/modules/example/example.routes.ts**
```typescript
import { Router } from 'express';
import { ExampleController } from './example.controller';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { createExampleSchema } from './example.dto';

const router = Router();
const controller = new ExampleController();

/**
 * @swagger
 * /api/v1/examples:
 *   post:
 *     summary: Create example
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateExampleRequest'
 */
router.post('/', 
  validateRequest(createExampleSchema, 'body'),
  asyncHandler((req, res) => controller.create(req, res))
);

export { router as exampleRouter };
```

### 3. Implement Controller

**src/modules/example/example.controller.ts**
```typescript
import { Request, Response } from 'express';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './example.dto';

export class ExampleController {
  private service = new ExampleService();

  async create(req: Request, res: Response) {
    const data = req.body as CreateExampleDto;
    const result = await this.service.create(data);
    res.sendSuccess(result, 'Example created', 201);
  }
}
```

### 4. Add Service Layer

**src/modules/example/example.service.ts**
```typescript
import { ApiError } from '../../shared/errors/api-error';
import { ExampleRepository } from './example.repository';
import { CreateExampleDto } from './example.dto';

export class ExampleService {
  private repository = new ExampleRepository();

  async create(dto: CreateExampleDto) {
    // Validate business logic
    const exists = await this.repository.findByEmail(dto.email);
    if (exists) {
      throw new ApiError('Email already in use', 409);
    }

    // Create and return
    return this.repository.create(dto);
  }
}
```

## Input Validation Rules

### All Endpoints Must Validate Input

1. **Body validation** - Use `validateRequest(schema, 'body')`
2. **Query validation** - Use `validateRequest(schema, 'query')`
3. **Params validation** - Use `validateRequest(schema, 'params')`

### Zod Validation Examples

```typescript
// String validations
z.string().min(1)                    // Non-empty
z.string().email()                   // Valid email
z.string().url()                     // Valid URL
z.string().uuid()                    // Valid UUID
z.string().regex(/pattern/)          // Custom pattern

// Number validations
z.number().int()                     // Integer only
z.number().positive()                // > 0
z.number().min(0).max(100)          // Range

// Custom validations
z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})
```

## Error Handling

### Always use ApiError

```typescript
throw new ApiError('User not found', 404);
throw new ApiError('Invalid credentials', 401);
throw new ApiError('Forbidden access', 403, { reason: 'insufficient permissions' });
```

### HTTP Status Codes

- **400** - Validation/bad request
- **401** - Authentication required
- **403** - Forbidden/insufficient permissions
- **404** - Not found
- **409** - Conflict (duplicate, constraint violation)
- **422** - Unprocessable entity
- **429** - Too many requests
- **500** - Server error

## Async Error Handling

Always wrap route handlers with `asyncHandler`:

```typescript
router.post('/create',
  validateRequest(schema),
  asyncHandler(async (req, res) => {
    // Exceptions here are automatically caught and passed to error handler
    const result = await service.create(req.body);
    res.sendSuccess(result);
  })
);
```

## Testing Requirements

- Write unit tests for services
- Write integration tests for APIs
- Minimum 40% code coverage
- All public methods must have tests

## Environment Variables

- All required env vars are validated in `src/config/index.ts`
- Copy `.env.example` to `.env`
- Never commit `.env` file
- Document all new env vars in `.env.example`

## Commit Messages

Use conventional commits:
```
feat: add user authentication module
fix: resolve CORS issue with preflight requests
docs: update API documentation
test: add validation middleware tests
chore: update dependencies
```

## Code Review Checklist

- [ ] DTOs have Zod schemas
- [ ] Routes use validateRequest middleware
- [ ] All async handlers use asyncHandler wrapper
- [ ] Error handling uses ApiError
- [ ] Response format matches standard envelope
- [ ] Tests included for new features
- [ ] No secrets in code or env files
- [ ] Linting passes: `npm run lint`

## Logging

Use the pino logger for all logging:

```typescript
import { logger } from '../../shared/logger/logger';

logger.info({ userId: '123' }, 'User logged in');
logger.warn({ error: err }, 'Unexpected condition');
logger.error({ err, context: 'operation' }, 'Critical error');
```

## Documentation (Swagger/OpenAPI)

Add JSDoc comments to routes:

```typescript
/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/:id', asyncHandler((req, res) => controller.getById(req, res)));
```

View API docs at `http://localhost:4000/api/v1/docs`
