import { Router } from 'express'; 
import parseData from '../../middleware/parseData';  
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';
import { SubscriptionsController } from './subscriptions.controller';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  //   parseData,
  // validateRequest(subscriptionBookingZodValidation.createUserZodSchema),
  SubscriptionsController.createSubscriptions,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  parseData(),
  // validateRequest(subscriptionBookingZodValidation.updateUserZodSchema),
  SubscriptionsController.updateSubscription,
);

router.get(
  '/my-subscriptions',
  auth(USER_ROLE.user, USER_ROLE.landlord),
  SubscriptionsController.mySubscriptions,
);

router.get(
  '/all',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  SubscriptionsController.getAllSubscriptions,
);

router.delete(
  '/:id',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  SubscriptionsController.deleteSubscriptions,
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
  SubscriptionsController.getSubscriptionById,
);

router.get(
  '/',
  auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
  SubscriptionsController.getAllSubscriptions,
);

export const SubscriptionsRoutes = router;
