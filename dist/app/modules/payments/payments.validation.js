"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentValidations = void 0;
const zod_1 = require("zod");
const payments_constants_1 = require("./payments.constants");
const paymentInitiateZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        paymentType: zod_1.z.enum([...payments_constants_1.paymentType]),
        bookingId: zod_1.z.string({ required_error: 'booking id is require' }),
    }),
});
exports.paymentValidations = {
    paymentInitiateZodSchema,
};
