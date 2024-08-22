import { Router } from 'express';
import { userControllers } from './user.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from './user.constant';
import parseData from '../../middleware/parseData';
import multer, { memoryStorage } from 'multer';
import validateRequest from '../../middleware/validateRequest';
import { userZodValidator } from './user.validation';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

//create a user
router.post(
  '/create-user',
  // auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  parseData(),
  validateRequest(userZodValidator?.createUserZodSchema),
  userControllers.insertUserIntoDb,
);
router.post(
  '/admin-create-user',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  parseData(),
  validateRequest(userZodValidator?.createUserZodSchema),
  userControllers.insertUserByAdmin,
);
 

router.patch(
  '/update/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  parseData(),
  userControllers.updateUser,
);

//update a user
router.patch(
  '/my-profile',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  upload.fields([{ name: 'image', maxCount: 1 }]),
  parseData(),
  userControllers.updateMyProfile,
);

//get my profile
router.get(
  '/my-profile',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.user,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  userControllers.getMyProfile,
);

// get all
router.get(
  '/all',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  userControllers.getAllUsers,
);

//delete my account
router.delete(
  '/delete-my-account',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  userControllers.deleteMyAccount,
);

//delete user
router.patch(
  '/verification-request-reject/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),

  userControllers.rejectIdVerificationRequest,
);

//delete user
router.patch(
  '/request-id-verify',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.admin,
    USER_ROLE.landlord,
    USER_ROLE.user,
  ),
  upload.fields([
    { name: 'document', maxCount: 5 },
    { name: 'selfie', maxCount: 1 },
  ]),
  parseData(),
  userControllers.requestIdVerify,
);

//reject verification request
router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.admin),
  userControllers.rejectIdVerificationRequest,
);

//get user by id
router.get(
  '/:id',
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  userControllers.getUserById,
);

router.get(
  '/',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  userControllers.getAllUsers,
);

export const userRoutes = router;
