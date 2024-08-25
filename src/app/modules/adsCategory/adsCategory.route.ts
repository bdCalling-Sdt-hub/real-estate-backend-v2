import { Router } from 'express';
import { categoryController } from './adsCategory.controller';
import validateRequest from '../../middleware/validateRequest';
import { CategoriesZodValidation } from './adsCategory.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/create-category',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  validateRequest(CategoriesZodValidation.CreateCategorySchema),
  categoryController.createAdsCategory,
);
router.patch(
  '/update/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.user,
    USER_ROLE.landlord, USER_ROLE.landlord
  ),
  validateRequest(CategoriesZodValidation.UpdateCategorySchema),
  categoryController.updateAdsCategory,
);
// router.get('/all', categoryController.getAllCategories);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.sub_admin),
  categoryController.deleteAdsCategory,
);

router.get('/:id', categoryController.getAdsCategoryById);

router.get('/', categoryController.getAllAdsCategories);

export const AdsCategoryRoutes = router;
