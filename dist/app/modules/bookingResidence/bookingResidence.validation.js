"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingResidenceValidation = void 0;
const zod_1 = require("zod");
// Custom Zod refinement to validate MongoDB ObjectId
// Zod schema for IBookingResidence
const createBookingResidenceZddSchema = zod_1.z.object({
    body: zod_1.z.object({
        residence: zod_1.z.string({ required_error: 'residence id is required' }),
        startDate: zod_1.z.union([
            zod_1.z.string({ required_error: 'Start date is required' }),
            zod_1.z.date({ required_error: 'Start date is required' }),
        ]),
        endDate: zod_1.z.union([
            zod_1.z.string({ required_error: 'Start date is required' }),
            zod_1.z.date({ required_error: 'Start date is required' }),
        ]),
        totalPrice: zod_1.z
            .number({
            required_error: 'total price is required',
        })
            .positive('Total price must be a positive number'),
        isPaid: zod_1.z.boolean().default(false),
        extraInfo: zod_1.z.object({
            name: zod_1.z.string({ required_error: 'Name is required' }),
            email: zod_1.z.string({
                required_error: 'Email is required and must be valid',
            }),
            age: zod_1.z.string({ required_error: 'Age is required' }),
            gender: zod_1.z.string({ required_error: 'Gender is required' }),
            phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
            address: zod_1.z.string({ required_error: 'Address is required' }),
        }),
    }),
});
const updateBookingResidenceZddSchema = zod_1.z.object({
    body: zod_1.z
        .object({
        residence: zod_1.z.string({ required_error: 'residence id is required' }),
        startDate: zod_1.z.union([
            zod_1.z.string({ required_error: 'Start date is required' }),
            zod_1.z.date({ required_error: 'Start date is required' }),
        ]),
        endDate: zod_1.z.union([
            zod_1.z.string({ required_error: 'Start date is required' }),
            zod_1.z.date({ required_error: 'Start date is required' }),
        ]),
        totalPrice: zod_1.z
            .number({
            required_error: 'total price is required',
        })
            .positive('Total price must be a positive number'),
        isPaid: zod_1.z.boolean().default(false),
        extraInfo: zod_1.z
            .object({
            name: zod_1.z.string({ required_error: 'Name is required' }),
            email: zod_1.z.string({
                required_error: 'Email is required and must be valid',
            }),
            age: zod_1.z.string({ required_error: 'Age is required' }),
            gender: zod_1.z.string({ required_error: 'Gender is required' }),
            phoneNumber: zod_1.z.string({ required_error: 'Phone number is required' }),
            address: zod_1.z.string({ required_error: 'Address is required' }),
        })
            .deepPartial(),
    })
        .deepPartial(),
});
exports.BookingResidenceValidation = {
    createBookingResidenceZddSchema,
    updateBookingResidenceZddSchema,
};
