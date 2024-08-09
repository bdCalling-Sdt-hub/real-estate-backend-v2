import { z } from 'zod';

// const imageFileSchema = z.object({
//   fieldname: z.literal('images'),
//   originalname: z.string().refine(name => /\.(jpg|jpeg|png|gif)$/i.test(name), {
//     message:
//       'Invalid file type for image. Only JPG, JPEG, PNG, and GIF are allowed.',
//   }),
//   encoding: z.string(),
//   mimetype: z.string().refine(type => type.startsWith('image/'), {
//     message: 'Invalid mime type for image. Only images are allowed.',
//   }),
//   buffer: z.instanceof(Buffer),
// });

const sendMessageValidation = z.object({
  // file: z
  //   .object({
  //     image: imageFileSchema,
  //   })
  //   .optional(),
  body: z.object({
    chat: z.string({ required_error: 'chat id is required' }).optional(),
    text: z
      .string({ required_error: 'text is required' })
      .default('')
      .optional(),
    // sender: z.string({ required_error: 'sender id is required' }),
    receiver: z.string({ required_error: 'receiver id is required' }),
    seen: z.boolean().default(false),
  }),
});

const updateMessageValidation = z.object({
  // file: z
  //   .object({
  //     image: imageFileSchema,
  //   })
  //   .optional(),
  body: z.object({
    chat: z.string({ required_error: 'chat id is required' }),
    text: z
      .string({ required_error: 'text is required' })
      .default('')
      .optional(),
    // sender: z.string({ required_error: 'sender id is required' }),
    receiver: z.string({ required_error: 'receiver id is required' }),
    seen: z.boolean().default(false),
  }),
});

export const messagesValidation = {
  sendMessageValidation,
  updateMessageValidation,
};
