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
exports.reviewRoutes = void 0;
const express_1 = require("express");
const review_controller_1 = require("./review.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const review_validation_1 = require("./review.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
// images;
router.post('/create-review', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), upload.fields([{ name: 'images', maxCount: 3 }]), (0, parseData_1.default)(), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.createReviewZodSchema), review_controller_1.reviewController.createReview);
// router.get('/all', reviewController.getAllReview);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), upload.fields([{ name: 'images', maxCount: 3 }]), (0, parseData_1.default)(), (0, validateRequest_1.default)(review_validation_1.ReviewValidation.updateReviewZodSchema), review_controller_1.reviewController.updateReview);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), review_controller_1.reviewController.deleteReview);
router.get('/:id', review_controller_1.reviewController.getReviewById);
router.get('/', review_controller_1.reviewController.getAllReview);
exports.reviewRoutes = router;
