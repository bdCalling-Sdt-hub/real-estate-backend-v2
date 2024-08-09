import * as z from 'zod';

// Define enum for status

// Zod schema for Ads
const createAdsZodSchema = z.object({
  body: z.object({
    price: z.number().positive(),
    startAt: z.union([z.date(), z.string()]),
    expireAt: z.union([z.date(), z.string()]),
    status: z.boolean().optional(), // Make status optional
    tranId: z.string(),
    property: z.string(),
    isDeleted: z.boolean().default(false),
  }),
});

const updateAdsZodSchema = z.object({
  body: z.object({
    price: z.number().positive().optional(),
    startAt: z.union([z.date(), z.string()]).optional(),
    expireAt: z.union([z.date(), z.string()]).optional(),
    status: z.boolean().optional(), // Make status optional
    tranId: z.string().optional(),
    property: z.string().optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const adsValidation = {
  createAdsZodSchema,
  updateAdsZodSchema,
};
