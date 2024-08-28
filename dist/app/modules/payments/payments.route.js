"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRoutes = void 0;
const express_1 = require("express");
const payments_controller_1 = require("./payments.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const payments_validation_1 = require("./payments.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/initiate', (0, validateRequest_1.default)(payments_validation_1.paymentValidations.paymentInitiateZodSchema), (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), payments_controller_1.paymentsController.initiatePayment);
//web hooks
router.post('/webhooks', payments_controller_1.paymentsController.webhook);
router.get('/return', payments_controller_1.paymentsController.returnUrl);
router.get('/my-payments', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), payments_controller_1.paymentsController.myPayments);
router.get('/my-income', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), payments_controller_1.paymentsController.myIncome);
router.get('/package-income', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), payments_controller_1.paymentsController.packageIncome);
router.get('/percentage-income', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), payments_controller_1.paymentsController.PercentageIncome);
router.get('/total-incomes', (0, auth_1.default)(user_constant_1.USER_ROLE.admin), payments_controller_1.paymentsController.todayAndTotalIncome);
router.get('/packages-statistics-incomes', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin), payments_controller_1.paymentsController.PackagesStatisticsIncomes);
router.get('/percentage-statistics-incomes', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin), payments_controller_1.paymentsController.PercentageStatisticsIncomes);
router.get('/package-statistics-incomes', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin), payments_controller_1.paymentsController.calculatePackageNameByIncome);
router.get('/top-landlord-income', 
// auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
payments_controller_1.paymentsController.topLandlordIncome);
router.get('/all-transitions', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin), payments_controller_1.paymentsController.allTransitions);
exports.paymentsRoutes = router;
