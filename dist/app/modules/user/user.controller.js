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
exports.userControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_service_1 = require("./user.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const otp_service_1 = require("../otp/otp.service");
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("./user.model");
const http_status_1 = __importDefault(require("http-status"));
// Create user
const insertUserByAdmin = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(req.body.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
    }
    if (req.files) {
        const { image } = req.files;
        if (image === null || image === void 0 ? void 0 : image.length) {
            req.body.image = yield (0, s3_1.uploadToS3)({
                file: image[0],
                fileName: `images/user/profile/${req.body.email}`,
            });
        }
    }
    req.body.verification = {
        otp: 0,
        expiresAt: new Date(),
        status: true,
    };
    const result = yield user_service_1.userServices.insertSubAdminIntoDb(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'User created successfully',
        data: result,
    });
}));
// Create user
const insertUserIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(req.body.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
    }
    // req.body.documents = {
    //   selfie: null,
    //   documentType: req?.body?.documents?.documentType || null,
    //   documents: [
    //     {
    //       key: null,
    //       url: null,
    //     },
    //   ],
    // };
    if (req.files) {
        const { image } = req.files;
        if (image === null || image === void 0 ? void 0 : image.length) {
            req.body.image = yield (0, s3_1.uploadToS3)({
                file: image[0],
                fileName: `images/user/profile/${req.body.email}`,
            });
        }
    }
    const result = yield user_service_1.userServices.insertSubAdminIntoDb(req.body);
    const sendOtp = yield otp_service_1.otpServices.resendOtp(result === null || result === void 0 ? void 0 : result.email);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'User created successfully',
        data: { user: result, OtpToken: sendOtp },
    });
}));
// Update user
const updateUser = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.params.id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (req.files) {
        const { image } = req.files;
        if (image === null || image === void 0 ? void 0 : image.length) {
            req.body.image = yield (0, s3_1.uploadToS3)({
                file: image[0],
                fileName: `images/user/profile/${Math.floor(10000000 + Math.random() * 90000000)}`,
            });
        }
        if (user === null || user === void 0 ? void 0 : user.image) {
            const url = new URL(user === null || user === void 0 ? void 0 : user.image);
            const pathname = url.pathname;
            yield (0, s3_1.deleteFromS3)(pathname);
        }
    }
    const result = yield user_service_1.userServices.updateUser(user === null || user === void 0 ? void 0 : user._id.toString(), req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'User profile updated successfully',
        data: result,
    });
}));
// Get all users
const getAllUsers = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getAllusers(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: result,
    });
}));
// Get user by ID
const getUserById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getSingleUser(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'User retrieved successfully',
        data: result,
    });
}));
// Get my profile
const getMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.getSingleUser(req.user.userId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Profile retrieved successfully',
        data: result,
    });
}));
// Update my profile
const updateMyProfile = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(req.user.userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (req.files) {
        const { image } = req.files;
        if (image === null || image === void 0 ? void 0 : image.length) {
            req.body.image = yield (0, s3_1.uploadToS3)({
                file: image[0],
                fileName: `images/user/profile/${Math.floor(10000000 + Math.random() * 90000000)}`,
            });
        }
        //   if (user?.image) {
        //     const url = new URL(user?.image);
        //     const pathname = url.pathname;
        //    const nn =  await deleteFromS3(pathname);
        //   }
    }
    const result = yield user_service_1.userServices.updateUser(user === null || user === void 0 ? void 0 : user._id.toString(), req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Profile updated successfully',
        data: result,
    });
}));
// Delete user account
const deleteAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield user_service_1.userServices.deleteAccount((_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'User deleted successfully',
        data: result,
    });
}));
// Delete my account
const deleteMyAccount = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const result = yield user_service_1.userServices.deleteMyAccount((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId, (_c = req === null || req === void 0 ? void 0 : req.body) === null || _c === void 0 ? void 0 : _c.password);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Account deleted successfully',
        data: result,
    });
}));
// Delete my account
const rejectIdVerificationRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_service_1.userServices.rejectIdVerificationRequest(req === null || req === void 0 ? void 0 : req.params.id, req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'user id rejection successfully',
        data: result,
    });
}));
//accept verification request
const requestIdVerify = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    req.body.documents = {
        selfie: null,
        documentType: ((_d = req === null || req === void 0 ? void 0 : req.body) === null || _d === void 0 ? void 0 : _d.documentType) || null,
        documents: [
            {
                key: null,
                url: null,
            },
        ],
    };
    if (req.files) {
        const { document, selfie } = req.files;
        if (selfie === null || selfie === void 0 ? void 0 : selfie.length) {
            req.body.documents.selfie = yield (0, s3_1.uploadToS3)({
                file: selfie[0],
                fileName: `images/user/selfie/${req.body.email}`,
            });
        }
        if (document === null || document === void 0 ? void 0 : document.length) {
            const imgsArray = document.map(image => ({
                file: image,
                path: `images/user/documents`,
            }));
            req.body.documents.documents = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield user_service_1.userServices.requestIdVerify(req.user.userId, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'user id verify request send successfully',
        data: result,
    });
}));
exports.userControllers = {
    insertUserIntoDb,
    updateUser,
    getAllUsers,
    getUserById,
    getMyProfile,
    deleteMyAccount,
    deleteAccount,
    updateMyProfile,
    requestIdVerify,
    rejectIdVerificationRequest,
    insertUserByAdmin,
};
