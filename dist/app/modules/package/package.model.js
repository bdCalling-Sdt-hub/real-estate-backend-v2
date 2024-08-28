"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const packageModel = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
    },
    durationDays: {
        type: Number,
        required: true,
    },
    features: {
        type: [String],
        required: true,
    },
    isDeleted: { type: Boolean, default: false },
}, { timestamps: true });
// filter out deleted documents
packageModel.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
packageModel.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
packageModel.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Package = (0, mongoose_1.model)('Package', packageModel);
exports.default = Package;
