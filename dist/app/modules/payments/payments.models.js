"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const payments_constants_1 = require("./payments.constants");
const paymentSchema = new mongoose_1.Schema({
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
        required: true,
    },
    transitionId: {
        type: String,
        required: true,
        unique: true,
    },
    transitionDate: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: payments_constants_1.paymentType,
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    details: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        refPath: 'type',
    },
    residenceAuthority: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    // landlordAmount: {
    //   type: Number,
    //   required: true,
    //   default: function () {
    //     return this.amount * 0.9;
    //   },
    // },
    // adminAmount: {
    //   type: Number,
    //   required: true,
    //   default: function () {
    //     return this.amount * 0.1;
    //   },
    // },
}, {
    timestamps: true,
    // discriminatorKey: 'type',
});
const Payment = (0, mongoose_1.model)('Payment', paymentSchema);
exports.default = Payment;
