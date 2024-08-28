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
exports.authControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
// login
const login = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield auth_service_1.authServices.login(req.body);
    const { refreshToken } = result;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cookieOptions = {
        secure: false,
        httpOnly: true,
        maxAge: 31536000000,
    };
    if (config_1.default.NODE_ENV === 'production') {
        cookieOptions.sameSite = 'none';
    }
    res.cookie('refreshToken', refreshToken, cookieOptions);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Logged in successfully',
        data: result,
    });
}));
// change password
const changePassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield auth_service_1.authServices.changePassword((_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password changed successfully',
        data: result,
    });
}));
// forgot password
const forgotPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield auth_service_1.authServices.forgotPassword((_b = req === null || req === void 0 ? void 0 : req.body) === null || _b === void 0 ? void 0 : _b.email);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'An OTP sent to your email!',
        data: result,
    });
}));
// reset password
const resetPassword = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield auth_service_1.authServices.resetPassword((_c = req === null || req === void 0 ? void 0 : req.headers) === null || _c === void 0 ? void 0 : _c.token, req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password reset successfully',
        data: result,
    });
}));
// refresh token
const refreshToken = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.cookies;
    const result = yield auth_service_1.authServices.refreshToken(refreshToken);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Access token retrieved successfully',
        data: result,
    });
}));
exports.authControllers = {
    login,
    changePassword,
    forgotPassword,
    resetPassword,
    refreshToken,
};
