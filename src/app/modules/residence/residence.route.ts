import { Router } from 'express';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
// import validateRequest from '../../middleware/validateRequest';
// import { residenceValidation } from './residence.validation';
import { residenceController } from './residence.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-residence',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]),
  parseData(),
  // validateRequest(residenceValidation.createResidenceSchema),
  residenceController.createResidence,
);

router.patch(
  '/update/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
  ]),
  parseData(),
  // validateRequest(residenceValidation.updateResidenceSchema),

  residenceController.updateResidence,
);

router.get('/all', residenceController.getAllResidence);

router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  residenceController.deleteResidence,
);
router.get('/:id', residenceController.getResidenceById);
router.get('/', residenceController.getAllResidence);

export const ResidenceRouter = router;
