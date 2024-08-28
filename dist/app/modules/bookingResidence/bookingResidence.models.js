"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BookingResidenceSchema = new mongoose_1.Schema({
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
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    discount: {
        type: Number,
        required: true,
        default: 0,
    },
    guest: {
        child: {
            type: Number,
            required: true,
            default: 0,
        },
        adult: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    status: {
        type: String,
        enum: ['pending', 'approved', "ongoing", 'canceled'],
        required: true,
        default: 'pending',
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
BookingResidenceSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
BookingResidenceSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
BookingResidenceSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const BookingResidence = (0, mongoose_1.model)('BookingResidence', BookingResidenceSchema);
exports.default = BookingResidence;
