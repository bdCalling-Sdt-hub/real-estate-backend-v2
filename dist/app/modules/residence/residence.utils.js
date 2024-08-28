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
exports.calculateAverageRatingForResidence = void 0;
const mongoose_1 = require("mongoose");
const review_models_1 = __importDefault(require("../review/review.models"));
const calculateAverageRatingForResidence = (residenceId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_models_1.default.aggregate([
        {
            $match: {
                residence: new mongoose_1.Types.ObjectId(residenceId),
                isDeleted: { $ne: true },
            },
        }, // Match the residence and filter out deleted reviews
        {
            $group: {
                _id: '$residence',
                averageRating: { $avg: '$rating' },
                totalReview: { $sum: '$rating' },
            },
        }, // Group by residence and calculate the average rating
    ]);
    if (result.length > 0) {
        return {
            averageRating: Number(result[0].averageRating.toFixed(1)),
            totalReview: Number(result[0].totalReview.toFixed(1)),
        };
    }
    const defaultNumber = 0;
    return {
        averageRating: Number(defaultNumber.toFixed(1)),
        totalReview: Number(defaultNumber.toFixed(1)),
    }; // No ratings found
});
exports.calculateAverageRatingForResidence = calculateAverageRatingForResidence;
