"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const contentsSchema = new mongoose_1.Schema({
    aboutUs: {
        type: String,
    },
    termsAndConditions: {
        type: String,
    },
    privacyPolicy: {
        type: String,
    },
    supports: {
        type: String,
    },
    faq: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
// filter out deleted documents
const Contents = (0, mongoose_1.model)('Contents', contentsSchema);
exports.default = Contents;
