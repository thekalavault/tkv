import { Router } from 'express';
import { authGuard, roleGuard, AuthRequest } from '../../shared/middleware/auth.middleware';
import { UsersController } from './users.controller';
import { asyncHandler } from '../../shared/utils/async-handler';

const router = Router();
const controller = new UsersController();

router.get('/me', authGuard, asyncHandler((req: AuthRequest, res) => controller.me(req, res)));
router.patch('/me', authGuard, asyncHandler((req: AuthRequest, res) => controller.updateProfile(req, res)));
router.get('/', authGuard, roleGuard(['admin']), asyncHandler((req: AuthRequest, res) => controller.listUsers(req, res)));
router.put('/:id/role', authGuard, roleGuard(['admin']), asyncHandler((req: AuthRequest, res) => controller.updateRole(req, res)));
router.delete('/:id', authGuard, roleGuard(['admin']), asyncHandler((req: AuthRequest, res) => controller.deleteUser(req, res)));

export { router as userRouter };
