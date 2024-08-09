import { z } from 'zod';

// Zod schema for the subscription model
const createPackageSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must be at most 50 characters long'),
    price: z
      .number({ required_error: 'Price is required' })
      .positive('Price must be a positive number'),
    durationDays: z
      .number({ required_error: 'Duration in days is required' })
      .positive('Duration in days must be a positive number'),
    features: z.array(z.string({ required_error: 'Features are required' })),
  }),
});

const updatePackageSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .min(3, 'Name must be at least 3 characters long')
      .max(50, 'Name must be at most 50 characters long')
      .optional(),
    price: z
      .number({ required_error: 'Price is required' })
      .positive('Price must be a positive number')
      .optional(),
    durationDays: z
      .number({ required_error: 'Duration in days is required' })
      .positive('Duration in days must be a positive number')
      .optional(),
    features: z
      .array(z.string({ required_error: 'Features are required' }))
      .optional(),
  }),
});

export const packageValidation = {
  createPackageSchema,
  updatePackageSchema,
};
