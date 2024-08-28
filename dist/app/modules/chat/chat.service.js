"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const chat_models_1 = __importDefault(require("./chat.models"));
const messages_models_1 = __importDefault(require("../messages/messages.models"));
const s3_1 = require("../../utils/s3");
const user_model_1 = require("../user/user.model");
// Create chat
const createChat = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const user1 = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.participants[0]);
    if (!user1) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid user');
    }
    const user2 = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.participants[1]);
    if (!user2) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid user');
    }
    const alreadyExists = yield chat_models_1.default.findOne({
        participants: { $all: payload.participants },
    }).populate(['participants']);
    if (alreadyExists) {
        return alreadyExists;
    }
    const result = chat_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Chat creation failed');
    }
    return result;
});
// Get my chat list
const getMyChatList = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const chats = yield chat_models_1.default.find({
        participants: { $all: userId },
    }).populate({
        path: 'participants',
        select: 'name email image role _id phoneNumber username',
        match: { _id: { $ne: userId } },
    });
    if (!chats) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Chat list not found');
    }
    const data = [];
    for (const chatItem of chats) {
        const chatId = chatItem._id;
        // Find the latest message in the chat
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const message = yield messages_models_1.default.findOne({ chat: chatId }).sort({
            updatedAt: -1,
        });
        const unreadMessageCount = yield messages_models_1.default.countDocuments({
            chat: chatId,
            seen: false,
            sender: { $ne: userId },
        });
        if (message) {
            data.push({ chat: chatItem, message: message, unreadMessageCount });
        }
    }
    data.sort((a, b) => {
        const dateA = (a.message && a.message.createdAt) || 0;
        const dateB = (b.message && b.message.createdAt) || 0;
        return dateB - dateA;
    });
    return data;
});
// Get chat by ID
const getChatById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_models_1.default.findById(id).populate({
        path: 'participants',
        select: 'name email image role _id phoneNumber username',
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Chat not found');
    }
    return result;
});
// Update chat list
const updateChatList = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chat_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Chat not found');
    }
    return result;
});
// Delete chat list
const deleteChatList = (id) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, s3_1.deleteFromS3)(`images/messages/${id}`);
    const result = yield chat_models_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Chat not found');
    }
    return result;
});
exports.chatService = {
    createChat,
    getMyChatList,
    getChatById,
    updateChatList,
    deleteChatList,
};
