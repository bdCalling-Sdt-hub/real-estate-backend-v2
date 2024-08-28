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
exports.userServices = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const user_model_1 = require("./user.model");
const fileHelper_1 = require("../../utils/fileHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
const mailSender_1 = require("../../utils/mailSender");
const notification_service_1 = require("../notification/notification.service");
// Insert sub-admin into the database
const insertSubAdminIntoDb = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.isUserExist(payload.email);
    if (user) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User already exists with this email');
    }
    const userExistByUsername = yield user_model_1.User.IsUserExistUserName(payload.username);
    if (userExistByUsername) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Username already exists. Try another username');
    }
    const result = yield user_model_1.User.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'user creating failed');
    }
    yield (0, mailSender_1.sendEmail)(result === null || result === void 0 ? void 0 : result.email, 'New User Created - REAL-STATE', `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Create a account in Real-State</h2>
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
        <p style="font-size: 16px;">A your account has been created with the following credentials:</p>
        <p style="font-size: 16px;"><strong>Email:</strong> ${result === null || result === void 0 ? void 0 : result.email}</p>
        <p style="font-size: 16px;"><strong>Password:</strong> ${payload.password}</p>
        <p style="font-size: 14px; color: #666;">Please advise the user to log in and change their password immediately.</p>
      </div>
    </div>`);
    return result;
});
// Get user by ID
const getme = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    return result;
});
const getAllusers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const userModel = new QueryBuilder_1.default(user_model_1.User.find().populate(''), query)
        .search([
        'name',
        'email',
        'role',
        'phoneNumber',
        'nationality',
        'status',
        'gender',
    ])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield userModel.modelQuery;
    const meta = yield userModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get single user by ID
const getSingleUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'user not found');
    }
    return result;
});
// Update user
const updateUser = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(id);
    if (payload === null || payload === void 0 ? void 0 : payload.email) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Email update is not allowed');
    }
    if (payload === null || payload === void 0 ? void 0 : payload.role) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Role update is not allowed');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, payload, { new: true });
    if (result && (payload === null || payload === void 0 ? void 0 : payload.image)) {
        yield (0, fileHelper_1.deleteFile)(user === null || user === void 0 ? void 0 : user.image);
    }
    if ((payload === null || payload === void 0 ? void 0 : payload.verificationRequest) === 'accepted') {
        const admin = yield user_model_1.User.findOne({ role: 'admin' });
        if (!admin) {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Admin not found');
        }
        yield notification_service_1.notificationServices.insertNotificationIntoDb({
            receiver: result === null || result === void 0 ? void 0 : result._id,
            refference: admin._id,
            model_type: 'User',
            message: `${result === null || result === void 0 ? void 0 : result.name} Admin Accept your verification request`,
        });
    }
    return result;
});
// Delete user account
const deleteAccount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User deletion failed');
    }
    yield (0, s3_1.deleteManyFromS3)([
        `images/user/profile/${result.email}`,
        `images/user/civilId/${result.email}-frontSide`,
        `images/user/civilId/${result.email}-backSide`,
    ]);
    return;
});
// Delete my account
const deleteMyAccount = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.IsUserExistId(id);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const isPasswordMatched = yield bcrypt_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(http_status_1.default.NOT_ACCEPTABLE, 'Password does not match');
    }
    const result = yield user_model_1.User.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User deletion failed');
    }
    yield (0, s3_1.deleteManyFromS3)([
        `images/user/profile/${user.email}`,
        `images/user/civilId/${user.email}-frontSide`,
        `images/user/civilId/${user.email}-backSide`,
    ]);
    return result;
});
//verification request send
const requestIdVerify = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, 'Invalid user');
    }
    const admin = yield user_model_1.User.findOne({ role: 'admin' });
    if (!admin) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Admin not found');
    }
    payload.verificationRequest = 'send';
    const result = yield user_model_1.User.findByIdAndUpdate(userId, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Request for id verify failed');
    }
    yield notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: admin._id,
        refference: userId,
        model_type: 'User',
        message: `${user === null || user === void 0 ? void 0 : user.email} user send verification request`,
    });
    return result;
});
//verification accept
// const acceptIdVerify = async(userId:string)=>{
//   const result = await User.findByIdAndUpdate(userId, {
//     isVerified: true,
//     verifyRequest: 'accepted',
//   });
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'accept your id verification');
//   }
//   return result;
// }
//verification reject
const rejectIdVerificationRequest = (userId, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield user_model_1.User.findByIdAndUpdate(userId, {
        verificationRequest: 'pending',
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'verifyRequest rejection failed');
    }
    const admin = yield user_model_1.User.findOne({ role: 'admin' });
    if (!admin) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Admin not found');
    }
    yield notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: result === null || result === void 0 ? void 0 : result._id,
        refference: admin._id,
        model_type: 'User',
        message: `${result === null || result === void 0 ? void 0 : result.name} Admin reject your verification request`,
        description: payload === null || payload === void 0 ? void 0 : payload.reason,
    });
    const emailContent = `
 <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 5px;
      "
    >
      <h2 style="color: #ff0000">ID Verification Rejected</h2>
      <div
        style="
          background-color: #f2f2f2;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        "
      >
        <p style="font-size: 16px">Dear ${(result === null || result === void 0 ? void 0 : result.name) || 'User'},</p>
        <p style="font-size: 16px">
          Your ID verification request has been rejected for the following
          reason:
        </p>
        <p style="font-size: 16px; font-weight: bold; color: #ff0000">
          ${payload === null || payload === void 0 ? void 0 : payload.reason}
        </p>
        <p style="font-size: 16px">
          If you believe this is a mistake, please contact our support team for
          further assistance and resend request.
        </p>
      </div>
      <div style="margin-top: 20px">
        <p style="font-size: 14px; color: #666">Best regards,</p>
        <p style="font-size: 14px; color: #666">The Support Team</p>
      </div>
    </div>
  `;
    yield (0, mailSender_1.sendEmail)(
    // 'boroxar723@padvn.com',
    result === null || result === void 0 ? void 0 : result.email, 'Your ID Verification Rejected', emailContent);
    return result;
});
// const signInWithGoogle = async (payload: Partial<TUser>) => {
//     const user = await User.isUserExist(payload.email as string);
//     if (user) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'User already exists with this email',
//       );
//     }
//     const userExistByUsername = await User.IsUserExistUserName(
//       payload.username as string,
//     );
//     if (userExistByUsername) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'Username already exists. Try another username',
//       );
//     }
//   const result = await User.create(payload);
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User creation Failed');
//   }
// };
exports.userServices = {
    insertSubAdminIntoDb,
    getme,
    getAllusers,
    updateUser,
    getSingleUser,
    deleteAccount,
    deleteMyAccount,
    rejectIdVerificationRequest,
    requestIdVerify,
    // acceptIdVerify,
};
