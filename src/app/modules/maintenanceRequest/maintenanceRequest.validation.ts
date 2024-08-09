import { z } from 'zod'; 

// const objectIdSchema = z.string().refine(val => Types.ObjectId.isValid(val), {
//   message: 'Invalid ObjectId',
// });

const extraInfoSchema = z.object({
  name: z.string().nonempty({ message: 'Name is required' }),
  apartment: z.string().nonempty({ message: 'Apartment is required' }),
  floor: z.string().nonempty({ message: 'Floor is required' }),
  address: z.string().nonempty({ message: 'Address is required' }),
  email: z.string().email({ message: 'Email is required and must be valid' }),
  phoneNumber: z.string().nonempty({ message: 'Phone number is required' }),
});

const createMaintenanceRequestSchema = z.object({
  body: z.object({ 
    property: z.string({required_error:"property id is required"}),
    problems: z.string().nonempty({ message: 'Problems are required' }), 
    status: z.enum(['pending', 'accepted', 'cancelled'], {
      errorMap: () => ({
        message: "Status must be one of 'pending', 'accepted', or 'cancelled'",
      }),
    }),
    extraInfo: extraInfoSchema,
  }),
});

export const MaintenanceRequestValidation = { createMaintenanceRequestSchema };
