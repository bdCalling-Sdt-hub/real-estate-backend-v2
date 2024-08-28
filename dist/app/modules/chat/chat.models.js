"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    participants: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    status: {
        type: String,
        enum: ['accepted', 'blocked'],
        default: 'accepted',
    },
}, { timestamps: true });
const Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.default = Chat;
