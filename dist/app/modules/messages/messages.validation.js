"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messagesValidation = void 0;
const zod_1 = require("zod");
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
const sendMessageValidation = zod_1.z.object({
    // file: z
    //   .object({
    //     image: imageFileSchema,
    //   })
    //   .optional(),
    body: zod_1.z.object({
        chat: zod_1.z.string({ required_error: 'chat id is required' }).optional(),
        text: zod_1.z
            .string({ required_error: 'text is required' })
            .default('')
            .optional(),
        // sender: z.string({ required_error: 'sender id is required' }),
        receiver: zod_1.z.string({ required_error: 'receiver id is required' }),
        seen: zod_1.z.boolean().default(false),
    }),
});
const updateMessageValidation = zod_1.z.object({
    // file: z
    //   .object({
    //     image: imageFileSchema,
    //   })
    //   .optional(),
    body: zod_1.z.object({
        chat: zod_1.z.string({ required_error: 'chat id is required' }),
        text: zod_1.z
            .string({ required_error: 'text is required' })
            .default('')
            .optional(),
        // sender: z.string({ required_error: 'sender id is required' }),
        receiver: zod_1.z.string({ required_error: 'receiver id is required' }),
        seen: zod_1.z.boolean().default(false),
    }),
});
exports.messagesValidation = {
    sendMessageValidation,
    updateMessageValidation,
};
