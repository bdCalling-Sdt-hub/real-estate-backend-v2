"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userZodValidator = void 0;
const z = __importStar(require("zod"));
const user_constant_1 = require("./user.constant");
const createUserZodSchema = z.object({
    body: z.object({
        username: z.string({ required_error: 'Username is required' }),
        name: z.string({ required_error: 'Name is required' }),
        email: z.string({ required_error: 'Email is required' }),
        phoneNumber: z.string({ required_error: 'Phone number is required' }),
        nationality: z.string({ required_error: 'Nationality is required' }).optional(),
        gender: z.enum([...user_constant_1.gender]),
        maritalStatus: z.string({ required_error: 'Marital status is required' }).optional(),
        dateOfBirth: z.string({ required_error: 'Date of birth is required' }).optional(),
        job: z.string({ required_error: 'Job is required' }).optional(),
        monthlyIncome: z.string({ required_error: 'monthly income is required' }),
        role: z.enum([...user_constant_1.role]).default('user'),
        address: z.string({ required_error: 'Address is required' }).optional(),
        password: z
            .string({ required_error: 'Password is required' })
            // .regex(new RegExp('.*[A-Z].*'), {
            //   message: 'Must have an uppercase character',
            // })
            // .regex(new RegExp('.*[a-z].*'), {
            //   message: 'Must have a lowercase character',
            // })
            // .regex(new RegExp('.*[0-9].*'), { message: 'Must have a number' })
            // .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), {
            //   message: 'Must have a special character',
            // })
            .min(6, {
            message: 'Must be at least 6 characters long.',
        }),
    }),
});
exports.userZodValidator = {
    createUserZodSchema,
};
