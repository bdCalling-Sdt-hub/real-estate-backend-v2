import { Router } from 'express';
// import validateRequest from '../../middleware/validateRequest';
// import { BookingResidenceValidation } from './bookingResidence.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { BookingResidenceController } from './bookingResidence.controller';

const router = Router();

router.post(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  // validateRequest(BookingResidenceValidation.createBookingResidenceZddSchema),
  BookingResidenceController.createBookingResidence,
);

router.patch(
  '/approved/:id',
  auth(USER_ROLE.landlord),
  BookingResidenceController.approvedBooking,
);

router.patch(
  '/cancel/:id',
  auth(USER_ROLE.landlord),
  BookingResidenceController.canceledBooking,
);

router.get(
  '/all',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  BookingResidenceController.getAllBookingResidence,
);

router.get(
  '/my-booking',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  BookingResidenceController.myBookings,
);
router.delete(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  BookingResidenceController.deleteBookingResidence,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.user,
    USER_ROLE.landlord,
  ),
  BookingResidenceController.getBookingResidenceById,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  BookingResidenceController.getAllBookingResidence,
);

export const BookingResidenceRoutes = router;
