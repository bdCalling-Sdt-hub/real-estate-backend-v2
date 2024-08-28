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
exports.reviewService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const review_models_1 = __importDefault(require("./review.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
const residence_models_1 = __importDefault(require("../residence/residence.models"));
const residence_utils_1 = require("../residence/residence.utils");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield review_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Review creation failed');
    }
    const avgRating = yield (0, residence_utils_1.calculateAverageRatingForResidence)((_a = result === null || result === void 0 ? void 0 : result.residence) === null || _a === void 0 ? void 0 : _a.toString());
    yield residence_models_1.default.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.residence, {
        averageRating: avgRating,
    }, { new: true, timestamps: false });
    return result;
});
// Get all reviews
const getAllReview = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const reviewModel = new QueryBuilder_1.default(review_models_1.default.find().populate(['user', 'residence']), query)
        .populateFields('residence')
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield reviewModel.modelQuery;
    const meta = yield reviewModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get review by ID
const getReviewById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_models_1.default.findById(id).populate(['user', 'residence']);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Review not found');
    }
    return result;
});
// Update review
const updateReview = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Review update failed');
    }
    return result;
});
// Delete review
const deleteReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield review_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Review deletion failed');
    }
    const deleteKeys = [];
    if (result === null || result === void 0 ? void 0 : result.images) {
        (_b = result === null || result === void 0 ? void 0 : result.images) === null || _b === void 0 ? void 0 : _b.forEach(image => deleteKeys.push(`images/comments/${image === null || image === void 0 ? void 0 : image.key}`));
    }
    if (deleteKeys.length) {
        yield (0, s3_1.deleteManyFromS3)(deleteKeys);
    }
    return result;
});
exports.reviewService = {
    createReview,
    getAllReview,
    getReviewById,
    updateReview,
    deleteReview,
};
