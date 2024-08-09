import { z } from 'zod';
import { paymentType } from './payments.constants';

const paymentInitiateZodSchema = z.object({
  body: z.object({
    paymentType: z.enum([...paymentType] as [string, ...string[]]),
    bookingId: z.string({ required_error: 'booking id is require' }),
  }),
});

export const paymentValidations = {
  paymentInitiateZodSchema,
};
