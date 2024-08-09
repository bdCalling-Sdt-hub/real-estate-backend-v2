/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { messagesService } from './messages.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';
import Message from './messages.models';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { chatService } from '../chat/chat.service';
import Chat from '../chat/chat.models';
import { IChat } from '../chat/chat.interface';

const createMessages = catchAsync(async (req: Request, res: Response) => {
  const id = `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
  req.body.id = id;
  if (req.file) {
    const imageUrl = await uploadToS3({
      file: req.file,
      fileName: `images/messages/${req.body.chat}/${id}`,
    });

    req.body.imageUrl = imageUrl;
  }

  req.body.sender = req.user.userId;

  const result = await messagesService.createMessages(req.body);

  //@ts-ignore
  const io = global.socketio;
  
if(io){
  const senderMessage = 'new-message::' + result.chat.toString();
  const receiverMessage = 'new-message::' + result.chat.toString();

  io.emit(senderMessage, result);
  io.emit(receiverMessage, result);

  // //----------------------ChatList------------------------//
  const ChatListSender = await chatService.getMyChatList(
    result?.sender.toString(),
  );
  const ChatListReceiver = await chatService.getMyChatList(
    result?.receiver.toString(),
  );

  const senderChat = 'chat-list::' + result.sender.toString();
  const receiverChat = 'chat-list::' + result.receiver.toString();
  io.emit(receiverChat, ChatListSender);
  io.emit(senderChat, ChatListReceiver);

}


  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Message sent successfully',
    data: result,
  });
});

// Get all messages
const getAllMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.getAllMessages(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

// Get messages by chat ID
const getMessagesByChatId = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.getMessagesByChatId(req.params.chatId);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Messages retrieved successfully',
    data: result,
  });
});

// Get message by ID
const getMessagesById = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.getMessagesById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Message retrieved successfully',
    data: result,
  });
});

// Update message
const updateMessages = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const message = await Message.findById(req.params.id);
    if (!message) {
      throw new AppError(httpStatus.NOT_FOUND, 'Message not found');
    }
    const imageUrl = await uploadToS3({
      file: req.file,
      fileName: `images/messages/${message.chat}/${message.id}`,
    });

    req.body.imageUrl = imageUrl;
  }

  const result = await messagesService.updateMessages(req.params.id, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Message updated successfully',
    data: result,
  });
});

//seen messages
const seenMessage = catchAsync(async (req: Request, res: Response) => {

  const chatList:IChat|null = await Chat.findById( req.params.chatId);
  if (!chatList) {
    throw new AppError(httpStatus.BAD_REQUEST, 'chat id is not valid');
  }


  const result = await messagesService.seenMessage(
    req.user.userId,
    req.params.chatId,
  );

  const user1 = chatList.participants[0];
  const user2 = chatList.participants[1];
  // //----------------------ChatList------------------------//
  const ChatListUser1 = await chatService.getMyChatList(user1.toString());

  const ChatListUser2 = await chatService.getMyChatList(user2.toString());

  const user1Chat = 'chat-list::' + user1;

  const user2Chat = 'chat-list::' + user2;

  io.emit(user1Chat, ChatListUser1);
  io.emit(user2Chat, ChatListUser2);


  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Message seen successfully',
    data: result,
  });
})
// Delete message
const deleteMessages = catchAsync(async (req: Request, res: Response) => {
  const result = await messagesService.deleteMessages(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Message deleted successfully',
    data: result,
  });
});

export const messagesController = {
  createMessages,
  getAllMessages,
  getMessagesByChatId,
  getMessagesById,
  updateMessages,
  deleteMessages,
  seenMessage,
};
