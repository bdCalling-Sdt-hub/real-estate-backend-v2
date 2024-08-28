"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("./user.constant");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const multer_1 = __importStar(require("multer"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const user_validation_1 = require("./user.validation");
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
//create a user
router.post('/create-user', 
// auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
upload.fields([{ name: 'image', maxCount: 1 }]), (0, parseData_1.default)(), (0, validateRequest_1.default)(user_validation_1.userZodValidator === null || user_validation_1.userZodValidator === void 0 ? void 0 : user_validation_1.userZodValidator.createUserZodSchema), user_controller_1.userControllers.insertUserIntoDb);
router.post('/admin-create-user', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), upload.fields([{ name: 'image', maxCount: 1 }]), (0, parseData_1.default)(), (0, validateRequest_1.default)(user_validation_1.userZodValidator === null || user_validation_1.userZodValidator === void 0 ? void 0 : user_validation_1.userZodValidator.createUserZodSchema), user_controller_1.userControllers.insertUserByAdmin);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.admin), upload.fields([{ name: 'image', maxCount: 1 }]), (0, parseData_1.default)(), user_controller_1.userControllers.updateUser);
//update a user
router.patch('/my-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), upload.fields([{ name: 'image', maxCount: 1 }]), (0, parseData_1.default)(), user_controller_1.userControllers.updateMyProfile);
//get my profile
router.get('/my-profile', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), user_controller_1.userControllers.getMyProfile);
// get all
router.get('/all', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.getAllUsers);
//delete my account
router.delete('/delete-my-account', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), user_controller_1.userControllers.deleteMyAccount);
//delete user
router.patch('/verification-request-reject/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.rejectIdVerificationRequest);
//delete user
router.patch('/request-id-verify', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.user), upload.fields([
    { name: 'document', maxCount: 5 },
    { name: 'selfie', maxCount: 1 },
]), (0, parseData_1.default)(), user_controller_1.userControllers.requestIdVerify);
//reject verification request
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.rejectIdVerificationRequest);
//get user by id
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), user_controller_1.userControllers.getUserById);
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), user_controller_1.userControllers.getAllUsers);
exports.userRoutes = router;
