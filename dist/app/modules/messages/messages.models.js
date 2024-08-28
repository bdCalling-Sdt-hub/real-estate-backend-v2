"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    // id: {
    //   type: String,
    //   require: true,
    //   unique: true,
    // },
    text: {
        type: String,
        default: '',
    },
    imageUrl: {
        type: String,
        default: '',
    },
    seen: {
        type: Boolean,
        default: false,
    },
    sender: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    receiver: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    bookingId: {
        type: mongoose_1.Types.ObjectId || null,
        required: false,
        ref: 'User',
        default: null,
    },
    showButton: {
        type: Boolean,
        default: false,
    },
    // isPaymentLink: {
    //   type: String,
    //   enum: isPaymentLinkStatus,
    //   default: '',
    // },
    chat: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Chat',
    },
}, {
    timestamps: true,
});
const Message = (0, mongoose_1.model)('Messages', messageSchema);
exports.default = Message;
