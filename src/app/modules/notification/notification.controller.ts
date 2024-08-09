/* eslint-disable @typescript-eslint/ban-ts-comment */
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';  
import { notificationServices } from './notification.service';

const insertNotificationIntoDb = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.insertNotificationIntoDb(req.body);

  //@ts-ignore
  const io = global?.socketio;
  if (io) {
    io.to();
  }
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification added successfully',
    data: result,
  });
});

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
  const query = { ...req.query };
  query['receiver'] = req?.user?.userId;
  const result = await notificationServices.getAllNotifications(query);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notifications retrieved successfully',
    data: result?.data,
    meta: result?.meta,
  });
});

const markAsDone = catchAsync(async (req: Request, res: Response) => {
  const result = await notificationServices.markAsDone(req?.user?.userId);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Notification marked as read successfully',
    data: result,
  });
});

export const notificationControllers = {
  insertNotificationIntoDb,
  getAllNotifications,
  markAsDone,
};
