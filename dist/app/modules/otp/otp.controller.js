"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.otpControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const otp_service_1 = require("./otp.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const verifyOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.token;
    const result = yield otp_service_1.otpServices.verifyOtp(token, req.body.otp);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP verified successfully',
        data: result,
    });
}));
const resendOtp = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield otp_service_1.otpServices.resendOtp(req.body.email);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'OTP sent successfully',
        data: result,
    });
}));
exports.otpControllers = {
    verifyOtp,
    resendOtp,
};
