"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteItemValidation = void 0;
const zod_1 = require("zod");
const createFavoriteItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        // user: z.string({ required_error: 'user id is required' }),
        residence: zod_1.z.string({ required_error: 'residence id is required' }),
    }),
});
const updateFavoriteItemSchema = zod_1.z.object({
    body: zod_1.z.object({
        // user: z.string({ required_error: 'user id is required' }),
        residence: zod_1.z.string({ required_error: 'residence id is required' }),
    }),
});
exports.favoriteItemValidation = {
    createFavoriteItemSchema,
    updateFavoriteItemSchema,
};
