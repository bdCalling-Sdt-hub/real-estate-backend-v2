import { Router } from 'express';
import { paymentsController } from './payments.controller';
import validateRequest from '../../middleware/validateRequest';
import { paymentValidations } from './payments.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

router.post(
  '/initiate',
  validateRequest(paymentValidations.paymentInitiateZodSchema),
  auth(
    USER_ROLE.user,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  paymentsController.initiatePayment,
);

//web hooks
router.post('/webhooks', paymentsController.webhook);
router.get('/return', paymentsController.returnUrl);
router.get(
  '/my-payments',
  auth(
    USER_ROLE.user,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  paymentsController.myPayments,
);

router.get(
  '/my-income',
  auth(
    USER_ROLE.user,
    USER_ROLE.admin,
    USER_ROLE.sub_admin,
    USER_ROLE.super_admin,
    USER_ROLE.landlord,
  ),
  paymentsController.myIncome,
);

router.get(
  '/package-income',
  auth(USER_ROLE.admin),
  paymentsController.packageIncome,
);

router.get(
  '/percentage-income',
  auth(USER_ROLE.admin),
  paymentsController.PercentageIncome,
);
router.get(
  '/total-incomes',
  auth(USER_ROLE.admin),
  paymentsController.todayAndTotalIncome,
);

router.get(
  '/packages-statistics-incomes',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  paymentsController.PackagesStatisticsIncomes,
);
router.get(
  '/percentage-statistics-incomes',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  paymentsController.PercentageStatisticsIncomes,
);
router.get(
  '/package-statistics-incomes',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  paymentsController.calculatePackageNameByIncome,
);
router.get(
  '/top-landlord-income',
  // auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  paymentsController.topLandlordIncome,
);
router.get(
  '/all-transitions',
  auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
  paymentsController.allTransitions,
);

export const paymentsRoutes = router;
