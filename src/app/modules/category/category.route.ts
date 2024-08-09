import { Router } from 'express';
import { categoryController } from './category.controller';
import validateRequest from '../../middleware/validateRequest';
import { CategoriesZodValidation } from './category.validation';
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
  categoryController.createCategory,
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
  categoryController.updateCategory,
);
// router.get('/all', categoryController.getAllCategories);

router.delete(
  '/:id',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.sub_admin),
  categoryController.deleteCategory,
);

router.get('/:id', categoryController.getCategoryById);

router.get('/', categoryController.getAllCategories);

export const categoryRoutes = router;
