import * as z from 'zod';
import { gender, role } from './user.constant';

 

const createUserZodSchema = z.object({
 
  body: z.object({
    username: z.string({ required_error: 'Username is required' }),
    name: z.string({ required_error: 'Name is required' }),
    email: z.string({ required_error: 'Email is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    nationality: z.string({ required_error: 'Nationality is required' }).optional(),
    gender: z.enum([...gender] as [string, ...string[]]),
    maritalStatus: z.string({ required_error: 'Marital status is required' }).optional(),
    dateOfBirth: z.string({ required_error: 'Date of birth is required' }).optional(),
    job: z.string({ required_error: 'Job is required' }).optional(),
    monthlyIncome: z.string({ required_error: 'monthly income is required' }),
    role: z.enum([...role] as [string, ...string[]]).default('user'),

    address: z.string({ required_error: 'Address is required' }).optional(),
    password: z
      .string({ required_error: 'Password is required' })
      // .regex(new RegExp('.*[A-Z].*'), {
      //   message: 'Must have an uppercase character',
      // })
      // .regex(new RegExp('.*[a-z].*'), {
      //   message: 'Must have a lowercase character',
      // })
      // .regex(new RegExp('.*[0-9].*'), { message: 'Must have a number' })
      // .regex(new RegExp('.*[`~<>?,./!@#$%^&*()\\-_+="\'|{}\\[\\];:\\\\].*'), {
      //   message: 'Must have a special character',
      // })
      .min(6, {
        message: 'Must be at least 6 characters long.',
      }),
  }),
});

 

export const userZodValidator = {
  createUserZodSchema, 
};
