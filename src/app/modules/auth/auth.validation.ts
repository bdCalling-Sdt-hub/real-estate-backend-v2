import { z } from 'zod';

const loginZodValidationSchema = z.object({
  body: z.object({
    email: z.string({
      required_error: 'Email is required!',
    }),
    password: z.string({
      required_error: 'Password is required!',
    }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh token is required!',
    }),
  }),
});

export const authValidation = {
  refreshTokenValidationSchema,
  loginZodValidationSchema,
};
