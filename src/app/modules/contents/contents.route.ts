import { Router } from 'express';
import { contentsController } from './contents.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import validateRequest from '../../middleware/validateRequest';
import { contentsValidator } from './contents.validation';
// import parseData from '../../middleware/parseData';

const router = Router();

router.post(
  '/create-content',
  // parseData,
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  validateRequest(contentsValidator.createContentsZodSchema),
  contentsController.createContents,
);

router.put(
  '/',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  // validateRequest(contentsValidator.updateContentsZodSchema),
  contentsController.updateContents,
);

// router.get('/all', contentsController.getAllContents);

// router.delete(
//   '/:id',
//   auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
//   contentsController.deleteContents,
// );

router.get('/:id', contentsController.getContentsById);

router.get('/', contentsController.getAllContents);

export const contentsRoutes = router;
