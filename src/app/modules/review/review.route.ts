import { Router } from 'express';
import { reviewController } from './review.controller';
import validateRequest from '../../middleware/validateRequest';
import { ReviewValidation } from './review.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import multer, { memoryStorage } from 'multer';
import parseData from '../../middleware/parseData';

const router = Router();
const storage = memoryStorage();
const upload = multer({ storage });

// images;
router.post(
  '/create-review',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  validateRequest(ReviewValidation.createReviewZodSchema),
  reviewController.createReview,
);
// router.get('/all', reviewController.getAllReview);
router.patch(
  '/update/:id',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  upload.fields([{ name: 'images', maxCount: 3 }]),
  parseData(),
  validateRequest(ReviewValidation.updateReviewZodSchema),
  reviewController.updateReview,
);

router.delete(
  '/:id',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  reviewController.deleteReview,
);

router.get('/:id', reviewController.getReviewById);
router.get('/', reviewController.getAllReview);

export const reviewRoutes = router;
