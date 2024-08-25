import * as z from 'zod';

// Define enum for status

// Zod schema for Ads
const createAdsZodSchema = z.object({
  body: z.object({
    contactLink: z.string({ required_error: 'contact link is required' }), 
  }),
});
 

export const adsValidation = {
  createAdsZodSchema,
  // updateAdsZodSchema,
};
