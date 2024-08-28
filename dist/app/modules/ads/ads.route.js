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
exports.adsRoutes = void 0;
const express_1 = require("express");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const ads_validation_1 = require("./ads.validation");
const ads_controller_1 = require("./ads.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const multer_1 = __importStar(require("multer"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create-ads', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), upload.single('banner'), (0, parseData_1.default)(), (0, validateRequest_1.default)(ads_validation_1.adsValidation.createAdsZodSchema), ads_controller_1.adsControllers.createAds);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), upload.single('banner'), (0, parseData_1.default)(), 
// validateRequest(adsValidation.updateAdsZodSchema),
ads_controller_1.adsControllers.updateAds);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), ads_controller_1.adsControllers.deleteAds);
router.get('/:id', ads_controller_1.adsControllers.getAdsById);
router.get('/', 
// auth(USER_ROLE.super_admin, USER_ROLE.sub_admin),
ads_controller_1.adsControllers.getAllAds);
exports.adsRoutes = router;
