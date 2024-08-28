"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    residence: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Residence',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    images: {
        type: [
            {
                url: {
                    type: String,
                },
                key: {
                    type: String,
                    unique: true,
                },
            },
        ],
        required: false,
    },
    comment: {
        type: String,
        required: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
// filter out deleted documents
reviewSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
reviewSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
reviewSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Review = (0, mongoose_1.model)('Review', reviewSchema);
exports.default = Review;
