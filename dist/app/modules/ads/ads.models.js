"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const AdsSchema = new mongoose_1.Schema({
    // price: { type: Number, required: true },
    // startAt: { type: Date, required: true },
    // expireAt: { type: Date, required: true },
    banner: {
        type: String,
    },
    // status: {
    //   type: Boolean,
    //   default: false,
    // },
    // tranId: { type: String, required: false },
    // property: { type: Schema.Types.ObjectId, ref: 'Residence', required: true },
    contactLink: { type: String, require: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'AdsCategory', required: true },
    isDeleted: { type: Boolean, default: false },
});
// filter out deleted documents
AdsSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
AdsSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
AdsSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Ads = (0, mongoose_1.model)('Ads', AdsSchema);
exports.default = Ads;
