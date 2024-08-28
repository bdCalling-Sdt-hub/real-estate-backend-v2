"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resentOtpValidations = void 0;
const zod_1 = require("zod");
const verifyOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        otp: zod_1.z
            .string({ required_error: 'otp is required' })
            .length(6, { message: 'otp must be exactly 6 characters long' }),
    }),
});
const resentOtpZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z
            .string({
            required_error: 'Email is required',
        })
        // .email(),           
    }),
});
exports.resentOtpValidations = {
    resentOtpZodSchema,
    verifyOtpZodSchema,
};
