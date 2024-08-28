"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const maintenanceRequestSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Residence', required: true },
    problems: { type: String, required: true },
    images: [
        {
            url: {
                type: String,
            },
            key: {
                type: String,
            },
        },
    ],
    status: {
        type: String,
        enum: ['pending', 'accepted', 'cancelled'],
        default: 'pending',
    },
    extraInfo: {
        type: {
            name: { type: String, required: true },
            apartment: { type: String, required: true },
            floor: { type: String, required: true },
            address: { type: String, required: true },
            email: { type: String, required: true },
            phoneNumber: { type: String, required: true },
        },
    },
}, {
    timestamps: true,
});
const MaintenanceRequest = (0, mongoose_1.model)('MaintenanceRequest', maintenanceRequestSchema);
exports.default = MaintenanceRequest;
