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
exports.messagesService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const messages_models_1 = __importDefault(require("./messages.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
const chat_models_1 = __importDefault(require("../chat/chat.models"));
const chat_service_1 = require("../chat/chat.service");
// const createMessages = async (payload: IMessages) => {
// const alreadyExists = await Chat.findOne({
//   participants: { $all: [payload.sender, payload.receiver] },
// }).populate(['participants']);
// if (!alreadyExists) {
//   const chatList = await Chat.create({
//     participants: [payload.sender, payload.receiver],
//   });
//   //@ts-ignore
//   payload.chat = chatList._id;
// } else {
//   //@ts-ignore
//   payload.chat = alreadyExists._id;
// }
// const result = await Message.create(payload);
// if (!result) {
//   throw new AppError(httpStatus.BAD_REQUEST, 'Message creation failed');
// }
// return result;
// };
const createMessages = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const alreadyExists = yield chat_models_1.default.findOne({
        participants: { $all: [payload.sender, payload.receiver] },
    }).populate(['participants']);
    if (!alreadyExists) {
        const chatList = yield chat_models_1.default.create({
            participants: [payload.sender, payload.receiver],
        });
        //@ts-ignore
        payload.chat = chatList === null || chatList === void 0 ? void 0 : chatList._id;
    }
    else {
        //@ts-ignore
        payload.chat = alreadyExists === null || alreadyExists === void 0 ? void 0 : alreadyExists._id;
    }
    const result = yield messages_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Message creation failed');
    }
    //@ts-ignore
    const io = global.socketio;
    if (io) {
        const senderMessage = 'new-message::' + result.chat.toString();
        io.emit(senderMessage, result);
        // //----------------------ChatList------------------------//
        const ChatListSender = yield chat_service_1.chatService.getMyChatList(result === null || result === void 0 ? void 0 : result.sender.toString());
        const ChatListReceiver = yield chat_service_1.chatService.getMyChatList(result === null || result === void 0 ? void 0 : result.receiver.toString());
        const senderChat = 'chat-list::' + result.sender.toString();
        const receiverChat = 'chat-list::' + result.receiver.toString();
        io.emit(receiverChat, ChatListSender);
        io.emit(senderChat, ChatListReceiver);
    }
    return result;
});
// Get all messages
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllMessages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const MessageModel = new QueryBuilder_1.default(messages_models_1.default.find().populate([
        {
            path: 'sender',
            select: 'name email image role _id phoneNumber username',
        },
        {
            path: 'receiver',
            select: 'name email image role _id phoneNumber username',
        },
    ]), query)
        .filter()
        // .paginate()
        .sort()
        .fields();
    const data = yield MessageModel.modelQuery;
    const meta = yield MessageModel.countTotal();
    return {
        data,
        meta,
    };
});
// Update messages
const updateMessages = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Message update failed');
    }
    return result;
});
// Get messages by chat ID
const getMessagesByChatId = (chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_models_1.default.find({ chat: chatId });
    return result;
});
// Get message by ID
const getMessagesById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield messages_models_1.default.findById(id).populate([
        {
            path: 'sender',
            select: 'name email image role _id phoneNumber username',
        },
        {
            path: 'receiver',
            select: 'name email image role _id phoneNumber username',
        },
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Message not found');
    }
    return result;
});
const deleteMessages = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield messages_models_1.default.findById(id);
    if (!message) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Message not found');
    }
    if (message === null || message === void 0 ? void 0 : message.imageUrl) {
        yield (0, s3_1.deleteFromS3)(`images/messages/${message === null || message === void 0 ? void 0 : message.chat.toString()}/${message === null || message === void 0 ? void 0 : message.id}`);
    }
    const result = yield messages_models_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Message not found');
    }
    return result;
});
const seenMessage = (userId, chatId) => __awaiter(void 0, void 0, void 0, function* () {
    const messageIdList = yield messages_models_1.default.aggregate([
        {
            $match: {
                chat: chatId,
                seen: false,
                sender: { $ne: userId },
            },
        },
        { $group: { _id: null, ids: { $push: '$_id' } } },
        { $project: { _id: 0, ids: 1 } },
    ]);
    const unseenMessageIdList = messageIdList.length > 0 ? messageIdList[0].ids : [];
    const updateMessages = yield messages_models_1.default.updateMany({ _id: { $in: unseenMessageIdList } }, { $set: { seen: true } });
    return updateMessages;
});
exports.messagesService = {
    createMessages,
    getMessagesByChatId,
    getMessagesById,
    updateMessages,
    getAllMessages,
    deleteMessages,
    seenMessage,
};
