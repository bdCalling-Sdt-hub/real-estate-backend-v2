"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingResidenceRoutes = void 0;
const express_1 = require("express");
// import validateRequest from '../../middleware/validateRequest';
// import { BookingResidenceValidation } from './bookingResidence.validation';
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const bookingResidence_controller_1 = require("./bookingResidence.controller");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), 
// validateRequest(BookingResidenceValidation.createBookingResidenceZddSchema),
bookingResidence_controller_1.BookingResidenceController.createBookingResidence);
router.patch('/approved/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.landlord), bookingResidence_controller_1.BookingResidenceController.approvedBooking);
router.patch('/cancel/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.landlord), bookingResidence_controller_1.BookingResidenceController.canceledBooking);
router.get('/all', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin), bookingResidence_controller_1.BookingResidenceController.getAllBookingResidence);
router.get('/my-booking', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), bookingResidence_controller_1.BookingResidenceController.myBookings);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), bookingResidence_controller_1.BookingResidenceController.deleteBookingResidence);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), bookingResidence_controller_1.BookingResidenceController.getBookingResidenceById);
router.get('/', 
// auth(USER_ROLE.admin, USER_ROLE.sub_admin, USER_ROLE.super_admin),
bookingResidence_controller_1.BookingResidenceController.getAllBookingResidence);
exports.BookingResidenceRoutes = router;
