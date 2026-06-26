import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { logger } from './shared/logger/logger';
import { config } from './config';
import { errorHandler } from './shared/middleware/error.middleware';
import { responseMiddleware } from './shared/middleware/response.middleware';
import { requestLoggingMiddleware } from './shared/middleware/request-logging.middleware';
import { swaggerSpec } from './config/swagger';
import { authRouter } from './modules/auth/auth.routes';
import { artworkRouter } from './modules/artworks/artwork.routes';
import { userRouter } from './modules/users/users.routes';
import { supportRouter } from './modules/support/support.routes';
import { crmRouter } from './modules/crm/crm.routes';
import cartRoutes from './modules/cart/cart.routes';
import favoritesRoutes from './modules/favorites/favorites.routes';
import imagesRoutes from './modules/images/images.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://thekalavault.com',
        'https://www.thekalavault.com',
        'https://app.thekalavault.com',
      ];

      if (process.env.FRONTEND_URL) {
        allowedOrigins.push(process.env.FRONTEND_URL);
      }

      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Allow any Vercel preview domain
      if (origin.endsWith('.vercel.app')) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        logger.warn({ origin }, 'CORS error');
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Only use csurf in production
if (config.nodeEnv === 'production') {
  app.use(csurf({ cookie: { httpOnly: true, sameSite: 'strict', secure: true } }));
}

// Serve uploaded files statically
import path from 'path';
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add request logging and response middleware
app.use(requestLoggingMiddleware);
app.use(responseMiddleware);


// Rate limiting
app.use(
  rateLimit({
    windowMs: 60_000, // 1 minute
    max: 120, // 120 requests per minute
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later',
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        code: 429,
        message: 'Too many requests, please try again later',
        timestamp: new Date().toISOString(),
      });
    },
  }),
);

// Swagger API Documentation
app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, { swaggerOptions: { defaultModelsExpandDepth: 1 } }));

// API Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/artworks', artworkRouter);
app.use('/api/v1/support', supportRouter);
app.use('/api/v1/crm', crmRouter);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/favorites', favoritesRoutes);
app.use('/api/v1/images', imagesRoutes);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.sendSuccess(
    {
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    },
    'Server is healthy',
    200,
  );
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    code: 404,
    message: 'Endpoint not found',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Error handler (must be last)
app.use(errorHandler);

export { app };
