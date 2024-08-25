import { Router } from 'express';
import parseData from '../../middleware/parseData';
import validateRequest from '../../middleware/validateRequest';
import { adsValidation } from './ads.validation';
import { adsControllers } from './ads.controller';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middleware/auth';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-ads',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord
  ),
  upload.single('banner'),
  parseData(),
  validateRequest(adsValidation.createAdsZodSchema),
  adsControllers.createAds,
);

router.patch(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  upload.single('banner'),
  parseData(),
  // validateRequest(adsValidation.updateAdsZodSchema),
  adsControllers.updateAds,
);

router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  adsControllers.deleteAds,
);

router.get('/:id', adsControllers.getAdsById);

router.get(
  '/',
  // auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
  adsControllers.getAllAds,
);

export const adsRoutes = router;
