"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatValidation = void 0;
const zod_1 = require("zod");
const createChatValidation = zod_1.z.object({
    body: zod_1.z.object({
        participants: zod_1.z
            .array(zod_1.z.string())
            .length(2, 'must be add in the array user and receiver id'),
        status: zod_1.z.enum(['accepted', 'blocked']).default('accepted'),
    }),
});
exports.chatValidation = {
    createChatValidation,
};
