import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Chat from './chat.models';
import { IChat } from './chat.interface';
import Message from '../messages/messages.models';
import { deleteFromS3 } from '../../utils/s3';
import { User } from '../user/user.model';

// Create chat
const createChat = async (payload: IChat) => {
  const user1 = await User.findById(payload?.participants[0]);

  if (!user1) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }
  
  const user2 = await User.findById(payload?.participants[1]);

  if (!user2) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid user');
  }

  const alreadyExists = await Chat.findOne({
    participants: { $all: payload.participants },
  }).populate(['participants']);

  if (alreadyExists) {
    return alreadyExists;
  }

  const result = Chat.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat creation failed');
  }
  return result;
};

// Get my chat list
const getMyChatList = async (userId: string) => {
  const chats = await Chat.find({
    participants: { $all: userId },
  }).populate({
    path: 'participants',
    select: 'name email image role _id phoneNumber username',
    match: { _id: { $ne: userId } },
  });

  if (!chats) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat list not found');
  }

  const data = [];
  for (const chatItem of chats) {
    const chatId = chatItem?._id;

    // Find the latest message in the chat
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const message: any = await Message.findOne({ chat: chatId }).sort({
      updatedAt: -1,
    });

    const unreadMessageCount = await Message.countDocuments({
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
};

// Get chat by ID
const getChatById = async (id: string) => {
  const result = await Chat.findById(id).populate({
    path: 'participants',
    select: 'name email image role _id phoneNumber username',
  });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

// Update chat list
const updateChatList = async (id: string, payload: Partial<IChat>) => {
  const result = await Chat.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

// Delete chat list
const deleteChatList = async (id: string) => {
  await deleteFromS3(`images/messages/${id}`);
  const result = await Chat.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Chat not found');
  }
  return result;
};

export const chatService = {
  createChat,
  getMyChatList,
  getChatById,
  updateChatList,
  deleteChatList,
};
