import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';
import { userServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { deleteFromS3, uploadManyToS3, uploadToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';
import { otpServices } from '../otp/otp.service';
import AppError from '../../error/AppError';
import { User } from './user.model';
import httpStatus from 'http-status';

// Create user
const insertUserByAdmin = catchAsync(async (req: Request, res: Response) => {
  const user = await User.isUserExist(req.body.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  if (req.files) {
    const { image } = req.files as UploadedFiles;

    if (image?.length) {
      req.body.image = await uploadToS3({
        file: image[0],
        fileName: `images/user/profile/${req.body.email}`,
      });
    }
  }

  req.body.verification = {
    otp: 0,
    expiresAt: new Date(),
    status: true,
  };

  const result = await userServices.insertSubAdminIntoDb(req.body);

  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: result,
  });
});

// Create user
const insertUserIntoDb = catchAsync(async (req: Request, res: Response) => {
  const user = await User.isUserExist(req.body.email as string);
  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  // req.body.documents = {
  //   selfie: null,
  //   documentType: req?.body?.documents?.documentType || null,
  //   documents: [
  //     {
  //       key: null,
  //       url: null,
  //     },
  //   ],
  // };

  if (req.files) {
    const { image } = req.files as UploadedFiles;

    if (image?.length) {
      req.body.image = await uploadToS3({
        file: image[0],
        fileName: `images/user/profile/${req.body.email}`,
      });
    }
  }

  const result = await userServices.insertSubAdminIntoDb(req.body);
  const sendOtp = await otpServices.resendOtp(result?.email as string);

  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'User created successfully',
    data: { user: result, OtpToken: sendOtp },
  });
});
// Update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (req.files) {
    const { image } = req.files as UploadedFiles;

    if (image?.length) {
      req.body.image = await uploadToS3({
        file: image[0],
        fileName: `images/user/profile/${Math.floor(10000000 + Math.random() * 90000000)}`,
      });
    }
    if (user?.image) {
      const url = new URL(user?.image);
      const pathname = url.pathname;
      await deleteFromS3(pathname);
    }
  }

  const result = await userServices.updateUser(user?._id.toString(), req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'User profile updated successfully',
    data: result,
  });
});

// Get all users
const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getAllusers(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Users retrieved successfully',
    data: result,
  });
});

// Get user by ID
const getUserById = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getSingleUser(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'User retrieved successfully',
    data: result,
  });
});

// Get my profile
const getMyProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getSingleUser(req.user.userId);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Profile retrieved successfully',
    data: result,
  });
});

// Update my profile
const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (req.files) {
    const { image } = req.files as UploadedFiles;

    if (image?.length) {
      req.body.image = await uploadToS3({
        file: image[0],
        fileName: `images/user/profile/${Math.floor(10000000 + Math.random() * 90000000)}`,
      });
    }
    //   if (user?.image) {
    //     const url = new URL(user?.image);
    //     const pathname = url.pathname;
    //    const nn =  await deleteFromS3(pathname);

    //   }
  }

  const result = await userServices.updateUser(user?._id.toString(), req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Profile updated successfully',
    data: result,
  });
});

// Delete user account
const deleteAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteAccount(req?.params?.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'User deleted successfully',
    data: result,
  });
});

// Delete my account
const deleteMyAccount = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.deleteMyAccount(
    req?.user?.userId,
    req?.body?.password,
  );
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Account deleted successfully',
    data: result,
  });
});
// Delete my account

const rejectIdVerificationRequest = catchAsync(
  async (req: Request, res: Response) => {
    const result = await userServices.rejectIdVerificationRequest(
      req?.params.id,
      req?.body,
    );

    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'user id rejection successfully',
      data: result,
    });
  },
);

//accept verification request
const requestIdVerify = catchAsync(async (req: Request, res: Response) => {

  req.body.documents = {
    selfie: null,
    documentType: req?.body?.documentType || null,
    documents: [
      {
        key: null,
        url: null,
      },
    ],
  };

  if (req.files) {
    const { document, selfie } = req.files as UploadedFiles;

    if (selfie?.length) {
      req.body.documents.selfie = await uploadToS3({
        file: selfie[0],
        fileName: `images/user/selfie/${Math.floor(10000000 + Math.random() * 90000000)}`,
      });
    }

    if (document?.length) {
      const imgsArray = document.map(image => ({
        file: image,
        path: `images/user/documents/${Math.floor(10000000 + Math.random() * 90000000)}`,
      }));

      req.body.documents.documents = await uploadManyToS3(imgsArray);
    }
  }
  const result = await userServices.requestIdVerify(req.user.userId, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'user id verify request send successfully',
    data: result,
  });
});

export const userControllers = {
  insertUserIntoDb,
  updateUser,
  getAllUsers,
  getUserById,
  getMyProfile,
  deleteMyAccount,
  deleteAccount,
  updateMyProfile,
  requestIdVerify,
  rejectIdVerificationRequest,
  insertUserByAdmin,
};
