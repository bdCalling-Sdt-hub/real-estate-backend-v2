import { z } from 'zod';

const createReviewZodSchema = z.object({
  body: z.object({
    residence: z.string({ required_error: 'residence id is required' }),
    rating: z
      .number({ required_error: 'rating is required' })
      .min(1, { message: 'Rating must be at least 1' })
      .max(5, { message: 'Rating must be at most 5' }),
    comment: z.string({ required_error: 'review is required' }),
  }),
});

const updateReviewZodSchema = z.object({
  body: z.object({
    residence: z
      .string({ required_error: 'residence id is required' })
      .optional(),
    rating: z
      .number({ required_error: 'rating is required' })
      .min(1, { message: 'Rating must be at least 1' })
      .max(5, { message: 'Rating must be at most 5' })
      .optional(),
    comment: z.string({ required_error: 'review is required' }).optional(),
  }),
});

export const ReviewValidation = {
  createReviewZodSchema,
  updateReviewZodSchema,
};
