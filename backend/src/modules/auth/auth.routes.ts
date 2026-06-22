import { Router } from 'express';
import { AuthController } from './auth.controller';
import { asyncHandler } from '../../shared/utils/async-handler';
import { validateRequest } from '../../shared/middleware/validation.middleware';
import { loginSchema, refreshSchema } from './auth.dto';
import { authGuard, AuthRequest } from '../../shared/middleware/auth.middleware';

const authController = new AuthController();
const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validateRequest(loginSchema, 'body'), asyncHandler((req, res) => authController.login(req, res)));

/**
 * @swagger
 * /api/v1/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token refreshed
 *       401:
 *         description: Invalid refresh token
 */
router.post('/refresh', validateRequest(refreshSchema, 'body'), asyncHandler((req, res) => authController.refresh(req, res)));

/**
 * @swagger
 * /api/v1/auth/logout:
 *   post:
 *     summary: User logout
 *     tags: [Auth]
 *     responses:
 *       204:
 *         description: Logout successful
 */
router.post('/logout', (req, res) => {
  res.clearCookie('refresh_token');
  res.status(204).send();
});

router.post('/firebase-sync', authGuard, asyncHandler(async (req: AuthRequest, res) => {
  res.json({
    success: true,
    user: req.user,
  });
}));

export { router as authRouter };
