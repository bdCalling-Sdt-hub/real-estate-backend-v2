"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingDocumentSchema = new mongoose_1.Schema({
    booking: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BookingResidence',
    },
    landlord: {
        type: {
            signature: {
                type: String,
                default: null,
            },
            civilId: {
                type: String,
                default: null,
            },
        },
    },
    user: {
        type: {
            signature: {
                type: String,
                default: null,
            },
            civilId: {
                type: String,
                default: null,
            },
        },
    },
});
const BookingDocuments = (0, mongoose_1.model)("BookingDocuments", bookingDocumentSchema);
exports.default = BookingDocuments;
