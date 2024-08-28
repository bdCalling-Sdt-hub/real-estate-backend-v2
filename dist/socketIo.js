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
const socket_io_1 = require("socket.io");
const getUserDetailsFromToken_1 = __importDefault(require("./app/helpers/getUserDetailsFromToken"));
const user_model_1 = require("./app/modules/user/user.model");
const messages_models_1 = __importDefault(require("./app/modules/messages/messages.models"));
const chat_service_1 = require("./app/modules/chat/chat.service");
const AppError_1 = __importDefault(require("./app/error/AppError"));
const http_status_1 = __importDefault(require("http-status"));
const chat_models_1 = __importDefault(require("./app/modules/chat/chat.models"));
const mongoose_1 = require("mongoose");
const initializeSocketIO = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
        },
    });
    // Online users
    const onlineUser = new Set();
    io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d;
        console.log('connected', socket === null || socket === void 0 ? void 0 : socket.id);
        try {
            //----------------------user token get from front end-------------------------//
            const token = ((_a = socket.handshake.auth) === null || _a === void 0 ? void 0 : _a.token) || ((_b = socket.handshake.headers) === null || _b === void 0 ? void 0 : _b.token);
            //----------------------check Token and return user details-------------------------//
            const user = yield (0, getUserDetailsFromToken_1.default)(token);
            if (!user) {
                // io.emit('io-error', {success:false, message:'invalid Token'});
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid token');
            }
            socket.join((_c = user === null || user === void 0 ? void 0 : user._id) === null || _c === void 0 ? void 0 : _c.toString());
            //----------------------user id set in online array-------------------------//
            onlineUser.add((_d = user === null || user === void 0 ? void 0 : user._id) === null || _d === void 0 ? void 0 : _d.toString());
            socket.on('check', (data, callback) => {
                console.log(data);
                callback({ success: true });
            });
            //----------------------online array send for front end------------------------//
            io.emit('onlineUser', Array.from(onlineUser));
            //----------------------user details and messages send for front end -->(as need to use)------------------------//
            socket.on('message-page', (userId, callback) => __awaiter(void 0, void 0, void 0, function* () {
                if (!userId) {
                    callback({ success: false, message: 'userId is required' });
                }
                try {
                    const receiverDetails = yield user_model_1.User.findById(userId).select('_id email role image');
                    if (!receiverDetails) {
                        callback({
                            success: false,
                            message: 'user is not found!',
                        });
                        io.emit('io-error', {
                            success: false,
                            message: 'user is not found!',
                        });
                    }
                    const payload = {
                        _id: receiverDetails === null || receiverDetails === void 0 ? void 0 : receiverDetails._id,
                        email: receiverDetails === null || receiverDetails === void 0 ? void 0 : receiverDetails.email,
                        image: receiverDetails === null || receiverDetails === void 0 ? void 0 : receiverDetails.image,
                        role: receiverDetails === null || receiverDetails === void 0 ? void 0 : receiverDetails.role,
                    };
                    socket.emit('user-details', payload);
                    const getPreMessage = yield messages_models_1.default.find({
                        $or: [
                            { sender: user === null || user === void 0 ? void 0 : user._id, receiver: userId },
                            { sender: userId, receiver: user === null || user === void 0 ? void 0 : user._id },
                        ],
                    }).sort({ updatedAt: -1 });
                    socket.emit('message', getPreMessage || []);
                }
                catch (error) {
                    callback({
                        success: false,
                        message: error.message,
                    });
                    io.emit('io-error', { success: false, message: error });
                    console.error('Error in message-page event:', error);
                }
            }));
            //----------------------chat list------------------------//
            socket.on('my-chat-list', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    const chatList = yield chat_service_1.chatService.getMyChatList(user === null || user === void 0 ? void 0 : user._id);
                    const myChat = 'chat-list::' + (user === null || user === void 0 ? void 0 : user._id);
                    io.emit(myChat, chatList);
                    callback({ success: true, message: chatList });
                }
                catch (error) {
                    callback({
                        success: false,
                        message: error.message,
                    });
                    io.emit('io-error', { success: false, message: error.message });
                }
            }));
            //----------------------seen message-----------------------//
            socket.on('seen', (_e, callback_1) => __awaiter(void 0, [_e, callback_1], void 0, function* ({ chatId }, callback) {
                if (!chatId) {
                    callback({
                        success: false,
                        message: 'chatId id is required',
                    });
                    io.emit('io-error', {
                        success: false,
                        message: 'chatId id is required',
                    });
                }
                try {
                    const chatList = yield chat_models_1.default.findById(chatId);
                    if (!chatList) {
                        callback({
                            success: false,
                            message: 'chat id is not valid',
                        });
                        io.emit('io-error', {
                            success: false,
                            message: 'chat id is not valid',
                        });
                        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'chat id is not valid');
                    }
                    const messageIdList = yield messages_models_1.default.aggregate([
                        {
                            $match: {
                                chat: new mongoose_1.Types.ObjectId(chatId),
                                seen: false,
                                sender: { $ne: new mongoose_1.Types.ObjectId(user === null || user === void 0 ? void 0 : user._id) },
                            },
                        },
                        { $group: { _id: null, ids: { $push: '$_id' } } },
                        { $project: { _id: 0, ids: 1 } },
                    ]);
                    console.log('🚀 ~ socket.on ~ messageIdList:', messageIdList);
                    const unseenMessageIdList = messageIdList.length > 0 ? messageIdList[0].ids : [];
                    const updateMessages = yield messages_models_1.default.updateMany({ _id: { $in: unseenMessageIdList } }, { $set: { seen: true } });
                    const user1 = chatList.participants[0];
                    const user2 = chatList.participants[1];
                    // //----------------------ChatList------------------------//
                    const ChatListUser1 = yield chat_service_1.chatService.getMyChatList(user1.toString());
                    const ChatListUser2 = yield chat_service_1.chatService.getMyChatList(user2.toString());
                    const user1Chat = 'chat-list::' + user1;
                    const user2Chat = 'chat-list::' + user2;
                    io.emit(user1Chat, ChatListUser1);
                    io.emit(user2Chat, ChatListUser2);
                    // const messages = await Message.find({
                    //   sender: senderId,
                    //   receiver: user?._id,
                    //   seen: false,
                    // });
                    // const messageArr: string[] = [];
                    // messages.forEach(message => messageArr.push(message._id.toString()));
                    // if (messageArr.length > 0) {
                    //   await Message.updateMany(
                    //     {
                    //       _id: { $in: messageArr },
                    //     },
                    //     { $set: { seen: true } },
                    //   );
                    // }
                    // //----------------------ChatList------------------------//
                    // const ChatListSender = await chatService.getMyChatList(
                    //   user?._id.toString(),
                    // );
                    // const ChatListReceiver = await chatService.getMyChatList(senderId);
                    // const senderChat = 'chat-list::' + user?._id.toString();
                    // const receiverChat = 'chat-list::' + senderId;
                    // io.emit(senderChat, ChatListSender);
                    // io.emit(receiverChat, ChatListReceiver);
                }
                catch (error) {
                    callback({
                        success: false,
                        message: error.message,
                    });
                    console.error('Error in seen event:', error);
                    socket.emit('error', { message: error.message });
                }
            }));
            //----------------------new messages------------------------//
            // socket.on('new message', async (data, callback) => {
            //   try {
            //     if (!data.chat) {
            //       callback({
            //         success: false,
            //         message: 'Chat id is required',
            //       });
            //       throw io.emit('io-error', {
            //         success: false,
            //         message: 'Chat id is required',
            //       });
            //     }
            //     if (!data.sender) {
            //       callback({
            //         success: false,
            //         message: 'sender id is required',
            //       });
            //       throw io.emit('io-error', {
            //         success: false,
            //         message: 'sender id is required',
            //       });
            //     }
            //     if (!data.receiver) {
            //       callback({
            //         success: false,
            //         message: 'receiver id is required',
            //       });
            //       throw io.emit('io-error', {
            //         success: false,
            //         message: 'receiver id is required',
            //       });
            //     }
            //     //----------------------when message send then load all message by chat id------------------------//
            //     const messages = await Message.find({
            //       chat: data?.chat,
            //     });
            //     io.to(data?.sender).emit('message', messages || []);
            //     io.to(data?.receiver).emit('message', messages || []);
            //     //----------------------ChatList------------------------//
            //     const ChatListSender = await chatService.getMyChatList(data?.sender);
            //     const ChatListReceiver = await chatService.getMyChatList(
            //       data?.receiver,
            //     );
            //     io.to(data?.sender).emit('chat-list', ChatListSender);
            //     io.to(data?.receiver).emit('chat-list', ChatListReceiver);
            //   } catch (error: any) {
            //     callback({
            //       success: false,
            //       message: error.message,
            //     });
            //     io.emit('io-error', { success: false, message: error.message });
            //     console.error('Error in new message event:', error);
            //   }
            // });
            //----------------------seen message-----------------------//
            // socket.on('seen', async (senderId, callback) => {
            //   if (!senderId) {
            //     callback({
            //       success: false,
            //       message: 'Sender id is required',
            //     });
            //     io.emit('io-error', {
            //       success: false,
            //       message: 'sender id is required',
            //     });
            //   }
            //   try {
            //     const messages = await Message.find({
            //       sender: senderId,
            //       receiver: user?._id,
            //       seen: false,
            //     });
            //     const messageArr: string[] = [];
            //     messages.forEach(message => messageArr.push(message._id.toString()));
            //     if (messageArr.length > 0) {
            //       await Message.updateMany(
            //         {
            //           _id: { $in: messageArr },
            //         },
            //         { $set: { seen: true } },
            //       );
            //     }
            //     //----------------------ChatList------------------------//
            //     const ChatListSender = await chatService.getMyChatList(
            //       user?._id.toString(),
            //     );
            //     const ChatListReceiver = await chatService.getMyChatList(senderId);
            //     io.to(user?._id?.toString()).emit('chat-list', ChatListSender);
            //     io.to(senderId).emit('chat-list', ChatListReceiver);
            //   } catch (error: any) {
            //     callback({
            //       success: false,
            //       message: error.message,
            //     });
            //     console.error('Error in seen event:', error);
            //     socket.emit('error', { message: error.message });
            //   }
            // });
            //-----------------------Disconnect------------------------//
            socket.on('disconnect', () => {
                var _a;
                onlineUser.delete((_a = user === null || user === void 0 ? void 0 : user._id) === null || _a === void 0 ? void 0 : _a.toString());
                io.emit('onlineUser', Array.from(onlineUser));
                console.log('disconnect user ', socket.id);
            });
        }
        catch (error) {
            console.error('-- socket.io connection error --', error);
        }
    }));
    return io;
};
exports.default = initializeSocketIO;
