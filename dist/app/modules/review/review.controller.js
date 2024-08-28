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
exports.reviewController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const review_service_1 = require("./review.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
// Create a review
const createReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { images } = req.files;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/comments`,
                });
            }));
            req.body.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    req.body.user = req.user.userId;
    const result = yield review_service_1.reviewService.createReview(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Review created successfully',
        data: result,
    });
}));
// Get all reviews
const getAllReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getAllReview(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Reviews retrieved successfully',
        data: result,
    });
}));
// Get review by ID
const getReviewById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.getReviewById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Review retrieved successfully',
        data: result,
    });
}));
// Update review
const updateReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { images } = req.files;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({ file: image, path: `images/residence` });
            }));
            req.body.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    const result = yield review_service_1.reviewService.updateReview(req.params.id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Review updated successfully',
        data: result,
    });
}));
// Delete review
const deleteReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewService.deleteReview(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Review deleted successfully',
        data: result,
    });
}));
exports.reviewController = {
    createReview,
    getAllReview,
    getReviewById,
    updateReview,
    deleteReview,
};
