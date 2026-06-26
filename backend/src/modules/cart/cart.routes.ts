import { Router } from 'express';
import { CartController } from './cart.controller';
import { authGuard } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new CartController();

router.use(authGuard);

router.get('/', (req, res) => controller.getCart(req, res));
router.post('/', (req, res) => controller.addToCart(req, res));
router.delete('/:id', (req, res) => controller.removeFromCart(req, res));
router.delete('/', (req, res) => controller.clearCart(req, res));

export default router;
