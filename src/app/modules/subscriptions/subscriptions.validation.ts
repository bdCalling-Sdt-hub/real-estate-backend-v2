import * as z from 'zod';

const createUserZodSchema = z.object({
  body: z.object({
    package: z.string({ required_error: 'package ID is required' }),
    transitionId: z.string({ required_error: 'transition ID is required' }),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z
      .boolean({ required_error: 'isActive is required' })
      .default(false),
  }),
});
const updateUserZodSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'user ID is required' }).optional(),
    package: z
      .string({ required_error: 'subscription ID is required' })
      .optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z
      .boolean({ required_error: 'isActive is required' })
      .default(false)
      .optional(),
  }),
});

export const subscriptionZodValidation = {
  createUserZodSchema,
  updateUserZodSchema,
};
