import { z } from 'zod';

const createFavoriteItemSchema = z.object({
  body: z.object({
    // user: z.string({ required_error: 'user id is required' }),
    residence: z.string({ required_error: 'residence id is required' }),
  }),
});
const updateFavoriteItemSchema = z.object({
  body: z.object({
    // user: z.string({ required_error: 'user id is required' }),
    residence: z.string({ required_error: 'residence id is required' }),
  }),
});

export const favoriteItemValidation = {
  createFavoriteItemSchema,
  updateFavoriteItemSchema,
};
