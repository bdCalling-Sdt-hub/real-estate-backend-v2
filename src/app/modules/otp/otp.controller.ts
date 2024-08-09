import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import { otpServices } from './otp.service';
import sendResponse from '../../utils/sendResponse';
import { Request, Response } from 'express';

const verifyOtp = catchAsync(async (req: Request, res: Response) => {
  const token = req?.headers?.token;
  const result = await otpServices.verifyOtp(token as string, req.body.otp);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP verified successfully',
    data: result,
  });
});

const resendOtp = catchAsync(async (req: Request, res: Response) => {
  const result = await otpServices.resendOtp(req.body.email);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'OTP sent successfully',
    data: result,
  });
});

export const otpControllers = {
  verifyOtp,
  resendOtp,
};
