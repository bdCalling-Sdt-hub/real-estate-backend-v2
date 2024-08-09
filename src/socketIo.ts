/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createToken } from './app/modules/auth/auth.utils';
// socketIO.js
import { Server as HttpServer } from 'http';
import { Server } from 'socket.io';
import getUserDetailsFromToken from './app/helpers/getUserDetailsFromToken';
import { User } from './app/modules/user/user.model';
import Message from './app/modules/messages/messages.models';
import { chatService } from './app/modules/chat/chat.service';
import AppError from './app/error/AppError';
import httpStatus from 'http-status';
import { TUser } from './app/modules/user/user.interface';

const initializeSocketIO = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  // Online users
  const onlineUser = new Set();

  io.on('connection', async socket => {
    console.log('connected', socket?.id);

    try {
      //----------------------user token get from front end-------------------------//
      const token =
        socket.handshake.auth?.token || socket.handshake.headers?.token;

      //----------------------check Token and return user details-------------------------//
      const user: any = await getUserDetailsFromToken(token);
      if (!user) {
        // io.emit('io-error', {success:false, message:'invalid Token'});
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid token');
      }

      socket.join(user?._id?.toString());

      //----------------------user id set in online array-------------------------//
      onlineUser.add(user?._id?.toString());

      socket.on('check', (data, callback) => {
        console.log(data);
        callback({ success: true });
      });

      //----------------------online array send for front end------------------------//
      io.emit('onlineUser', Array.from(onlineUser));

      //----------------------user details and messages send for front end -->(as need to use)------------------------//
      socket.on('message-page', async (userId, callback) => {
        if (!userId) {
          callback({ success: false, message: 'userId is required' });
        }

        try {
          const receiverDetails: TUser = await User.findById(userId).select(
            '_id email role image',
          );

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
            _id: receiverDetails?._id,
            email: receiverDetails?.email,
            image: receiverDetails?.image,
            role: receiverDetails?.role,
          };

          socket.emit('user-details', payload);

          const getPreMessage = await Message.find({
            $or: [
              { sender: user?._id, receiver: userId },
              { sender: userId, receiver: user?._id },
            ],
          }) 
            .sort({ updatedAt: -1 });

          socket.emit('message', getPreMessage || []);
        } catch (error: any) {
          callback({
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error });
          console.error('Error in message-page event:', error);
        }
      });

      //----------------------chat list------------------------//
      socket.on('my-chat-list', async (data, callback) => {
        try {
          const chatList = await chatService.getMyChatList(user?._id);
          const myChat = 'chat-list::' + user?._id;

          io.emit(myChat, chatList);

          callback({ success: true, message: chatList });
        } catch (error: any) {
          callback({
            success: false,
            message: error.message,
          });
          io.emit('io-error', { success: false, message: error.message });
        }
      });

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
        onlineUser.delete(user?._id?.toString());
        console.log('disconnect user ', socket.id);
      });
    } catch (error) {
      console.error('-- socket.io connection error --', error);
    }
  });

  return io;
};
// const initializeSocketIO = (server: HttpServer) => {
//   const io = new Server(server, {
//     cors: {
//       origin: '*',
//     },
//   });

//   //online user
//   const onlineUser = new Set();

//   io.on('connection', async socket => {
//     console.log('connected', socket?.id);

//     //----------------------user token get from front end-------------------------//
//     const token =
//       socket.handshake.auth?.token || socket.handshake.headers?.token;
//     //----------------------check Token and return user details-------------------------//
//     const user: any = await getUserDetailsFromToken(token);
//     socket.join(user?._id?.toString());

//     //----------------------user id set in online array-------------------------//
//     onlineUser.add(user?._id?.toString());

//     //----------------------online array send for front end------------------------//
//     io.emit('onlineUser', Array.from(onlineUser));

//     //----------------------user details and messages send for front end -->(as need to use)------------------------//
//     socket.on('message-page', async userId => {
//       console.log('userID', userId);

//       const userDetails = await User.findById(userId);

//       const payload = {
//         _id: userDetails?._id,
//         email: userDetails?.email,
//         image: userDetails?.image,
//         online: onlineUser.has(userId),
//       };

//       socket.emit('message-user', payload);

//       //get previous message
//       const getPreMessage = await Message.findOne({
//         $or: [
//           { sender: user?._id, receiver: userId },
//           { sender: userId, receiver: user?._id },
//         ],
//       })
//         .populate('messages')
//         .sort({ updatedAt: -1 });
//       // socket.emit('message', getPreMessage?.messages || []);
//     });

//     //----------------------new message send-----------------------//
//     socket.on('new message', async data => {
//       console.log(user?._id)
//       //----------------------when message send then load all message by chat id------------------------//
//       const messages = await Message.find({
//         chat: data?.chat,
//       });
//       io.to(data?.sender).emit('message', messages || []);
//       io.to(data?.receiver).emit('message', messages || []);

//       //----------------------ChatList------------------------//
//       const ChatListSender = await chatService.getMyChatList(data?.sender);
//       const ChatListReceiver = await chatService.getMyChatList(data?.receiver);

//       io.to(data?.sender).emit('chat-list', ChatListSender);
//       io.to(data?.receiver).emit('chat-list', ChatListReceiver);
//     });

//     //----------------------seen message-----------------------//
//     socket.on('seen', async senderId => {
//       const messages = await Message.find({
//         sender: senderId,
//         receiver: user?._id,
//         seen: false,
//       });

//       const messageArr: string[] = [];
//       messages.map(message => messageArr.push(message._id.toString()));

//       if (messageArr.length > 0) {
//         const updateMessages = await Message.updateMany(
//           {
//             _id: { $in: messageArr },
//           },
//           { $set: { seen: true } },
//         );
//       }

//       //----------------------ChatList------------------------//
//       const ChatListSender = await chatService.getMyChatList(
//         user?._id.toString(),
//       );
//       const ChatListReceiver = await chatService.getMyChatList(senderId);

//       io.to(user?._id?.toString()).emit('chat-list', ChatListSender);
//       io.to(senderId).emit('chat-list', ChatListReceiver);
//     });

//     //-----------------------Disconnect------------------------//

//     socket.on('disconnect', () => {
//       onlineUser.delete(user?._id?.toString());
//       console.log('disconnect user ', socket.id);
//     });
//   });
//   return io;
// };

export default initializeSocketIO;
