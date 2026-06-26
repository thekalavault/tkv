import { Router } from 'express';
import { FavoritesController } from './favorites.controller';
import { authGuard } from '../../shared/middleware/auth.middleware';

const router = Router();
const controller = new FavoritesController();

router.use(authGuard);

router.get('/', (req, res) => controller.getFavorites(req, res));
router.post('/', (req, res) => controller.addFavorite(req, res));
router.delete('/:id', (req, res) => controller.removeFavorite(req, res));

export default router;
