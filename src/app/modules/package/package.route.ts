import { Router } from 'express';
import parseData from '../../middleware/parseData';
import validateRequest from '../../middleware/validateRequest'; 
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import { PackageController } from './package.controller';
import { packageValidation } from './package.validation';

const router = Router();

router.post(
  '/create-package',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  validateRequest(packageValidation.createPackageSchema),
  PackageController.createPackage,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  parseData(),
  validateRequest(packageValidation.updatePackageSchema),
  PackageController.updatePackage,
);

// router.get('/all', SubscriptionsController.getAllSubscriptions);

router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  PackageController.deletePackage,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  PackageController.getPackageById,
);

router.get(
  '/',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  PackageController.getAllPackages,
);

export const PackageRoutes = router;
