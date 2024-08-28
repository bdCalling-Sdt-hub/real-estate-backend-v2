"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentsValidator = void 0;
const zod_1 = require("zod");
const createContentsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        createdBy: zod_1.z.string({ required_error: 'createBy is required' }),
        aboutUs: zod_1.z.string({ required_error: 'about us is required' }).optional(),
        termsAndConditions: zod_1.z
            .string({ required_error: 'terms and conditions us is required' })
            .optional(),
        privacyPolicy: zod_1.z
            .string({ required_error: 'privacy policy us is required' })
            .optional(),
        supports: zod_1.z
            .string({ required_error: 'supports us is required' })
            .optional(),
        faq: zod_1.z.string({ required_error: 'supports us is required' }).optional(),
    }),
});
const updateContentsZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        createBy: zod_1.z.string({ required_error: 'createBy is required' }).optional(),
        aboutUs: zod_1.z.string({ required_error: 'about us is required' }).optional(),
        termsAndConditions: zod_1.z
            .string({ required_error: 'terms and conditions us is required' })
            .optional(),
        privacyPolicy: zod_1.z
            .string({ required_error: 'privacy policy us is required' })
            .optional(),
        supports: zod_1.z
            .string({ required_error: 'supports us is required' })
            .optional(),
        faq: zod_1.z.string({ required_error: 'supports us is required' }).optional(),
    }),
});
exports.contentsValidator = {
    createContentsZodSchema,
    updateContentsZodSchema,
};
