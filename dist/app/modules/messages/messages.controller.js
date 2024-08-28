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
exports.messagesController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const messages_service_1 = require("./messages.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const messages_models_1 = __importDefault(require("./messages.models"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const chat_service_1 = require("../chat/chat.service");
const chat_models_1 = __importDefault(require("../chat/chat.models"));
const createMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
    req.body.id = id;
    if (req.file) {
        const imageUrl = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/messages/${req.body.chat}/${id}`,
        });
        req.body.imageUrl = imageUrl;
    }
    req.body.sender = req.user.userId;
    const result = yield messages_service_1.messagesService.createMessages(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Message sent successfully',
        data: result,
    });
}));
// Get all messages
const getAllMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_service_1.messagesService.getAllMessages(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
}));
// Get messages by chat ID
const getMessagesByChatId = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_service_1.messagesService.getMessagesByChatId(req.params.chatId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Messages retrieved successfully',
        data: result,
    });
}));
// Get message by ID
const getMessagesById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_service_1.messagesService.getMessagesById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Message retrieved successfully',
        data: result,
    });
}));
// Update message
const updateMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const message = yield messages_models_1.default.findById(req.params.id);
        if (!message) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Message not found');
        }
        const imageUrl = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/messages/${message.chat}/${message.id}`,
        });
        req.body.imageUrl = imageUrl;
    }
    const result = yield messages_service_1.messagesService.updateMessages(req.params.id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Message updated successfully',
        data: result,
    });
}));
//seen messages
const seenMessage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const chatList = yield chat_models_1.default.findById(req.params.chatId);
    if (!chatList) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'chat id is not valid');
    }
    const result = yield messages_service_1.messagesService.seenMessage(req.user.userId, req.params.chatId);
    const user1 = chatList.participants[0];
    const user2 = chatList.participants[1];
    // //----------------------ChatList------------------------//
    const ChatListUser1 = yield chat_service_1.chatService.getMyChatList(user1.toString());
    const ChatListUser2 = yield chat_service_1.chatService.getMyChatList(user2.toString());
    const user1Chat = 'chat-list::' + user1;
    const user2Chat = 'chat-list::' + user2;
    io.emit(user1Chat, ChatListUser1);
    io.emit(user2Chat, ChatListUser2);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Message seen successfully',
        data: result,
    });
}));
// Delete message
const deleteMessages = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_service_1.messagesService.deleteMessages(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Message deleted successfully',
        data: result,
    });
}));
exports.messagesController = {
    createMessages,
    getAllMessages,
    getMessagesByChatId,
    getMessagesById,
    updateMessages,
    deleteMessages,
    seenMessage,
};
