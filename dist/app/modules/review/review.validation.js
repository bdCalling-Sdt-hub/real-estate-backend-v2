"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewValidation = void 0;
const zod_1 = require("zod");
const createReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        residence: zod_1.z.string({ required_error: 'residence id is required' }),
        rating: zod_1.z
            .number({ required_error: 'rating is required' })
            .min(1, { message: 'Rating must be at least 1' })
            .max(5, { message: 'Rating must be at most 5' }),
        comment: zod_1.z.string({ required_error: 'review is required' }),
    }),
});
const updateReviewZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        residence: zod_1.z
            .string({ required_error: 'residence id is required' })
            .optional(),
        rating: zod_1.z
            .number({ required_error: 'rating is required' })
            .min(1, { message: 'Rating must be at least 1' })
            .max(5, { message: 'Rating must be at most 5' })
            .optional(),
        comment: zod_1.z.string({ required_error: 'review is required' }).optional(),
    }),
});
exports.ReviewValidation = {
    createReviewZodSchema,
    updateReviewZodSchema,
};
