import { z } from 'zod';

// Custom Zod refinement to validate MongoDB ObjectId

// Zod schema for IBookingResidence
const createBookingResidenceZddSchema = z.object({
  body: z.object({
    residence: z.string({ required_error: 'residence id is required' }),
    startDate: z.union([
      z.string({ required_error: 'Start date is required' }),
      z.date({ required_error: 'Start date is required' }),
    ]),
    endDate: z.union([
      z.string({ required_error: 'Start date is required' }),
      z.date({ required_error: 'Start date is required' }),
    ]),
    totalPrice: z
      .number({
        required_error: 'total price is required',
      })
      .positive('Total price must be a positive number'),
    isPaid: z.boolean().default(false),
    extraInfo: z.object({
      name: z.string({ required_error: 'Name is required' }),
      email: z.string({
        required_error: 'Email is required and must be valid',
      }),
      age: z.string({ required_error: 'Age is required' }),
      gender: z.string({ required_error: 'Gender is required' }),
      phoneNumber: z.string({ required_error: 'Phone number is required' }),
      address: z.string({ required_error: 'Address is required' }),
    }),
  }),
});
const updateBookingResidenceZddSchema = z.object({
  body: z
    .object({
      residence: z.string({ required_error: 'residence id is required' }),
      startDate: z.union([
        z.string({ required_error: 'Start date is required' }),
        z.date({ required_error: 'Start date is required' }),
      ]),
      endDate: z.union([
        z.string({ required_error: 'Start date is required' }),
        z.date({ required_error: 'Start date is required' }),
      ]),
      totalPrice: z
        .number({
          required_error: 'total price is required',
        })
        .positive('Total price must be a positive number'),
      isPaid: z.boolean().default(false),
      extraInfo: z
        .object({
          name: z.string({ required_error: 'Name is required' }),
          email: z.string({
            required_error: 'Email is required and must be valid',
          }),
          age: z.string({ required_error: 'Age is required' }),
          gender: z.string({ required_error: 'Gender is required' }),
          phoneNumber: z.string({ required_error: 'Phone number is required' }),
          address: z.string({ required_error: 'Address is required' }),
        })
        .deepPartial(),
    })
    .deepPartial(),
});

export const BookingResidenceValidation = {
  createBookingResidenceZddSchema,
  updateBookingResidenceZddSchema,
};
