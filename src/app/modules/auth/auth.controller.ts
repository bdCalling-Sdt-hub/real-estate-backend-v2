import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { authServices } from './auth.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import config from '../../config';

// login
const login = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.login(req.body);
  const { refreshToken } = result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookieOptions:any = {
    secure: false,
    httpOnly: true,
    maxAge: 31536000000,
  };

  if (config.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
  }
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

const signInWithGoogle = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.signInWithGoogle(req.body);
  const { refreshToken } = result;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cookieOptions: any = {
    secure: false,
    httpOnly: true,
    maxAge: 31536000000,
  };

  if (config.NODE_ENV === 'production') {
    cookieOptions.sameSite = 'none';
  }
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Logged in successfully',
    data: result,
  });
});

// change password
const changePassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.changePassword(req?.user?.userId, req.body);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password changed successfully',
    data: result,
  });
});

// forgot password
const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.forgotPassword(req?.body?.email);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'An OTP sent to your email!',
    data: result,
  });
});

// reset password
const resetPassword = catchAsync(async (req: Request, res: Response) => {
  const result = await authServices.resetPassword(
    req?.headers?.token as string,
    req?.body,
  );
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Password reset successfully',
    data: result,
  });
});

// refresh token
const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const result = await authServices.refreshToken(refreshToken);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Access token retrieved successfully',
    data: result,
  });
});

export const authControllers = {
  login,
  signInWithGoogle,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
};
