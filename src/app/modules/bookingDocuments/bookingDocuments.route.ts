import { Router } from 'express';
import { bookingDocumentsController } from './bookingDocuments.controller';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });
// documents;
router.post(
  '/',
  auth(USER_ROLE.landlord),
  upload.fields([
    { name: 'signature', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]),
  // upload.single('signature'),
  parseData(),
  bookingDocumentsController.createBookingDocuments,
);

router.patch(
  '/:bookingId',
  auth(USER_ROLE.user),
  upload.fields([
    { name: 'signature', maxCount: 1 },
    { name: 'documents', maxCount: 10 },
  ]),
  parseData(),
  bookingDocumentsController.updateBookingDocuments,
);

router.delete('/:id', bookingDocumentsController.deleteBookingDocuments);

router.get('/:id', bookingDocumentsController.getBookingDocumentsById);
router.get('/', bookingDocumentsController.getAllBookingDocuments);

export const bookingDocumentsRoutes = router;