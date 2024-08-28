"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageValidation = void 0;
const zod_1 = require("zod");
// Zod schema for the subscription model
const createPackageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, 'Name must be at least 3 characters long')
            .max(50, 'Name must be at most 50 characters long'),
        price: zod_1.z
            .number({ required_error: 'Price is required' })
            .positive('Price must be a positive number'),
        durationDays: zod_1.z
            .number({ required_error: 'Duration in days is required' })
            .positive('Duration in days must be a positive number'),
        features: zod_1.z.array(zod_1.z.string({ required_error: 'Features are required' })),
    }),
});
const updatePackageSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string({ required_error: 'Name is required' })
            .min(3, 'Name must be at least 3 characters long')
            .max(50, 'Name must be at most 50 characters long')
            .optional(),
        price: zod_1.z
            .number({ required_error: 'Price is required' })
            .positive('Price must be a positive number')
            .optional(),
        durationDays: zod_1.z
            .number({ required_error: 'Duration in days is required' })
            .positive('Duration in days must be a positive number')
            .optional(),
        features: zod_1.z
            .array(zod_1.z.string({ required_error: 'Features are required' }))
            .optional(),
    }),
});
exports.packageValidation = {
    createPackageSchema,
    updatePackageSchema,
};
