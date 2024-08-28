import { Router } from 'express';
import { bookingDocumentsController } from './bookingDocuments.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

router.post(
  '/',
  auth(USER_ROLE.landlord),
  upload.single('signature'),
  parseData(),
  bookingDocumentsController.createBookingDocuments,
);

router.patch(
  '/:bookingId',
  auth(USER_ROLE.user),
  upload.single('signature'),
  parseData(),
  bookingDocumentsController.updateBookingDocuments,
);

router.delete('/:id', bookingDocumentsController.deleteBookingDocuments);

router.get('/:id', bookingDocumentsController.getBookingDocumentsById);
router.get('/', bookingDocumentsController.getAllBookingDocuments);

export const bookingDocumentsRoutes = router;