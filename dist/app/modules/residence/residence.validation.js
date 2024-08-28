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
exports.residenceValidation = void 0;
const z = __importStar(require("zod"));
// Define the Zod schema for the images
const imageFileSchema = z.object({
    fieldname: z.literal('images'),
    originalname: z.string().refine(name => /\.(jpg|jpeg|png|gif)$/i.test(name), {
        message: 'Invalid file type for image. Only JPG, JPEG, PNG, and GIF are allowed.',
    }),
    encoding: z.string(),
    mimetype: z.string().refine(type => type.startsWith('image/'), {
        message: 'Invalid mime type for image. Only images are allowed.',
    }),
    buffer: z.instanceof(Buffer),
});
// Define a schema for video file validation
const videoFileSchema = z.object({
    fieldname: z.literal('videos'),
    originalname: z.string().refine(name => /\.(mp4|avi|mov)$/i.test(name), {
        message: 'Invalid file type for video. Only MP4, AVI, and MOV are allowed.',
    }),
    encoding: z.string(),
    mimetype: z.string().refine(type => type.startsWith('video/'), {
        message: 'Invalid mime type for video. Only videos are allowed.',
    }),
    buffer: z.instanceof(Buffer),
});
// Define the Zod schema for the address
const addressSchema = z.object({
    governorate: z.string({ required_error: 'governorate is required' }).min(1),
    area: z.string({ required_error: 'area is required' }).min(1).optional(),
    block: z.string({ required_error: 'block is required' }).min(1),
    street: z.string({ required_error: 'street is required' }).min(1),
    house: z.string({ required_error: 'house is required' }).min(1),
    floor: z.string({ required_error: 'floor is required' }).optional(),
    // state: z.string({ required_error: 'state is required' }).min(1),
});
// Define the Zod schema for the residence
const createResidenceSchema = z.object({
    files: z.object({
        images: z.array(imageFileSchema).refine(images => images.length < 10, {
            message: 'Exactly 10 images are required.',
        }),
        videos: z
            .array(videoFileSchema)
            .refine(videos => videos.length < 3, {
            message: 'Exactly 3 videos are required.',
        })
            .optional(),
    }),
    body: z.object({
        category: z.string({ required_error: 'category is required' }),
        propertyName: z.string({ required_error: 'propertyName is required' }),
        squareFeet: z.string({ required_error: 'property size is required' }),
        bathrooms: z.string({ required_error: 'bathrooms is required' }),
        bedrooms: z.string({ required_error: 'bedrooms is required' }),
        residenceType: z.string({ required_error: 'residence type is required' }),
        features: z.array(z.string()),
        rentType: z.string({ required_error: 'rent type is required' }),
        perNightPrice: z.number({ required_error: 'per night price is required' }),
        perMonthPrice: z.number({ required_error: 'per month price is required' }),
        propertyAbout: z.string({ required_error: 'property about is required' }),
        address: addressSchema,
        paciNo: z.number({ required_error: 'PACI No price is required' }),
        rules: z.string({ required_error: 'rules is required' }),
    }),
});
exports.residenceValidation = {
    createResidenceSchema,
    // updateResidenceSchema,
};