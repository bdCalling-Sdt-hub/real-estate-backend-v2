import { Router } from 'express';
import { maintenanceRequestController } from './maintenanceRequest.controller';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import parseData from '../../middleware/parseData';
import multer, { memoryStorage } from 'multer';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/create-maintenanceRequest',
  auth(USER_ROLE.user),
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  maintenanceRequestController.createMaintenanceRequest,
);

router.patch(
  '/accept/:id',
  maintenanceRequestController.acceptMaintenanceRequest,
);
router.patch(
  '/cancel/:id',
  maintenanceRequestController.cancelMaintenanceRequest,
);
 
router.delete('/:id', maintenanceRequestController.deleteMaintenanceRequest);

router.get('/:id', maintenanceRequestController.getMaintenanceRequestById);
router.get('/', maintenanceRequestController.getAllMaintenanceRequest);

export const maintenanceRequestRoutes = router;
