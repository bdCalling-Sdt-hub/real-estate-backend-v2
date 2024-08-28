"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpRoutes = void 0;
const express_1 = require("express");
const otp_controller_1 = require("./otp.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const otp_validation_1 = require("./otp.validation");
const router = (0, express_1.Router)();
router.post('/verify-otp', (0, validateRequest_1.default)(otp_validation_1.resentOtpValidations.verifyOtpZodSchema), otp_controller_1.otpControllers.verifyOtp);
router.post('/resend-otp', (0, validateRequest_1.default)(otp_validation_1.resentOtpValidations.resentOtpZodSchema), otp_controller_1.otpControllers.resendOtp);
exports.otpRoutes = router;
