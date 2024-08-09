/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Notification } from './notification.model';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import moment from 'moment';

// Insert notifications into the database
const insertNotificationIntoDb = async (payload: any) => {
  const result = await Notification.insertMany(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Notification created failed');
  }
  //@ts-ignore
  const io = global.socketio;
  if (io) {
    const ver = 'notification::' + payload?.receiver;
    io.emit(ver, { ...payload, createdAt: moment().format('YYYY-MM-DD') });
  }

  return result;
};

// Get all notifications
const getAllNotifications = async (query: Record<string, any>) => {
   
  const notificationModel = new QueryBuilder(Notification.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await notificationModel.modelQuery;
  const meta = await notificationModel.countTotal(); 
  return {
    data,
    meta,
  };
};

// Mark notifications as read
const markAsDone = async (id: string) => {
  const result = await Notification.updateMany(
    { receiver: id },
    {
      $set: {
        read: true,
      },
    },
    { new: true },
  );
  return result;
};

export const notificationServices = {
  insertNotificationIntoDb,
  getAllNotifications,
  markAsDone,
};
