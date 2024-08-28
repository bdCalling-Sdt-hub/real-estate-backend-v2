"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsRoutes = void 0;
const express_1 = require("express");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const subscriptions_controller_1 = require("./subscriptions.controller");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), 
//   parseData,
// validateRequest(subscriptionBookingZodValidation.createUserZodSchema),
subscriptions_controller_1.SubscriptionsController.createSubscriptions);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), (0, parseData_1.default)(), 
// validateRequest(subscriptionBookingZodValidation.updateUserZodSchema),
subscriptions_controller_1.SubscriptionsController.updateSubscription);
router.get('/my-subscriptions', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), subscriptions_controller_1.SubscriptionsController.mySubscriptions);
router.get('/all', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), subscriptions_controller_1.SubscriptionsController.getAllSubscriptions);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), subscriptions_controller_1.SubscriptionsController.deleteSubscriptions);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), subscriptions_controller_1.SubscriptionsController.getSubscriptionById);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), subscriptions_controller_1.SubscriptionsController.getAllSubscriptions);
exports.SubscriptionsRoutes = router;
