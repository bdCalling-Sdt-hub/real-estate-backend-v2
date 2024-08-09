import { Router } from 'express';
import { favoriteItemController } from './favoriteItem.controller';
import validateRequest from '../../middleware/validateRequest';
import { favoriteItemValidation } from './favoriteItem.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/add-favorite-item',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  validateRequest(favoriteItemValidation.createFavoriteItemSchema),
  favoriteItemController.createFavoriteItem,
);

// router.patch('/update/:id', favoriteItemController.updatefavoriteItem);

router.get(
  '/my-favorite-items/',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  favoriteItemController.getMyFavoriteItems,
);

router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  favoriteItemController.deleteFavoriteItem,
);

router.get(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  favoriteItemController.getFavoriteItemById,
);
// router.get('/', favoriteItemController.getAllfavoriteItem);

export const favoriteItemRoutes = router;
