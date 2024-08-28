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
exports.ResidenceRouter = void 0;
const express_1 = require("express");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
// import validateRequest from '../../middleware/validateRequest';
// import { residenceValidation } from './residence.validation';
const residence_controller_1 = require("./residence.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create-residence', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
]), (0, parseData_1.default)(), 
// validateRequest(residenceValidation.createResidenceSchema),
residence_controller_1.residenceController.createResidence);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), upload.fields([
    { name: 'images', maxCount: 10 },
    { name: 'videos', maxCount: 3 },
]), (0, parseData_1.default)(), 
// validateRequest(residenceValidation.updateResidenceSchema),
residence_controller_1.residenceController.updateResidence);
router.get('/all', residence_controller_1.residenceController.getAllResidence);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.landlord), residence_controller_1.residenceController.deleteResidence);
router.get('/:id', residence_controller_1.residenceController.getResidenceById);
router.get('/', residence_controller_1.residenceController.getAllResidence);
exports.ResidenceRouter = router;
