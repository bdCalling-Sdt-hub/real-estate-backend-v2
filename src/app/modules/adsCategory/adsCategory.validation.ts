import * as z from 'zod';

const CreateCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'category name is required' })
      .min(3)
      .max(50),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

const UpdateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(1).max(50).optional(),
    isDeleted: z.boolean().default(false).optional(),
  }),
});

export const CategoriesZodValidation = {
  CreateCategorySchema,
  UpdateCategorySchema,
};
