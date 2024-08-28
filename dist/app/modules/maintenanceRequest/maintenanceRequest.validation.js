"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaintenanceRequestValidation = void 0;
const zod_1 = require("zod");
// const objectIdSchema = z.string().refine(val => Types.ObjectId.isValid(val), {
//   message: 'Invalid ObjectId',
// });
const extraInfoSchema = zod_1.z.object({
    name: zod_1.z.string().nonempty({ message: 'Name is required' }),
    apartment: zod_1.z.string().nonempty({ message: 'Apartment is required' }),
    floor: zod_1.z.string().nonempty({ message: 'Floor is required' }),
    address: zod_1.z.string().nonempty({ message: 'Address is required' }),
    email: zod_1.z.string().email({ message: 'Email is required and must be valid' }),
    phoneNumber: zod_1.z.string().nonempty({ message: 'Phone number is required' }),
});
const createMaintenanceRequestSchema = zod_1.z.object({
    body: zod_1.z.object({
        property: zod_1.z.string({ required_error: "property id is required" }),
        problems: zod_1.z.string().nonempty({ message: 'Problems are required' }),
        status: zod_1.z.enum(['pending', 'accepted', 'cancelled'], {
            errorMap: () => ({
                message: "Status must be one of 'pending', 'accepted', or 'cancelled'",
            }),
        }),
        extraInfo: extraInfoSchema,
    }),
});
exports.MaintenanceRequestValidation = { createMaintenanceRequestSchema };
