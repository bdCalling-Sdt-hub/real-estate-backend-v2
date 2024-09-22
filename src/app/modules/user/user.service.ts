/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { TUser } from './user.interface';
import { User } from './user.model';
import { deleteFile } from '../../utils/fileHelper';
import bcrypt from 'bcrypt';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteManyFromS3 } from '../../utils/s3';
import { sendEmail } from '../../utils/mailSender';
import { notificationServices } from '../notification/notification.service';
import { generateRandomString } from './user.utils';

// Insert sub-admin into the database
const insertSubAdminIntoDb = async (
  payload: Partial<TUser>,
): Promise<TUser> => {
  const user = await User.isUserExist(payload.email as string);

  if (user) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  const userExistByUsername = await User.IsUserExistUserName(
    payload.username as string,
  );

  if (userExistByUsername) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Username already exists. Try another username',
    );
  }

  const result = await User.create(payload);

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user creating failed');
  }

  await sendEmail(
    result?.email,
    'New User Created - REAL-STATE',
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Create a account in Real-State</h2>
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
        <p style="font-size: 16px;">A your account has been created with the following credentials:</p>
        <p style="font-size: 16px;"><strong>Email:</strong> ${result?.email}</p>
        <p style="font-size: 16px;"><strong>Password:</strong> ${payload.password}</p>
        <p style="font-size: 14px; color: #666;">Please advise the user to log in and change their password immediately.</p>
      </div>
    </div>`,
  );

  return result;
};

// Get user by ID
const getme = async (id: string): Promise<TUser | null> => {
  const result = await User.findById(id);
  return result;
};

const getAllusers = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find().populate(''), query)
    .search([
      'name',
      'email',
      'role',
      'phoneNumber',
      'nationality',
      'status',
      'gender',
    ])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await userModel.modelQuery;
  const meta = await userModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get single user by ID
const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found');
  }
  return result;
};

// Update user
const updateUser = async (
  id: string,
  payload: Partial<TUser>,
): Promise<TUser | null> => {
  console.log('payload==========>', payload);
  const user = await User.findById(id);

  if (payload?.email) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Email update is not allowed');
  }
  if (payload?.role) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Role update is not allowed');
  }

  const result = await User.findByIdAndUpdate(id, payload, { new: true });
  console.log('result', result);
  if (result && payload?.image) {
    await deleteFile(user?.image as string);
  }

  if (payload?.verificationRequest === 'accepted') {
    const admin: TUser | null = await User.findOne({ role: 'admin' });
    if (!admin) {
      throw new AppError(httpStatus.FORBIDDEN, 'Admin not found');
    }
    await notificationServices.insertNotificationIntoDb({
      receiver: result?._id,
      refference: admin._id,
      model_type: 'User',
      message: `${result?.name} Admin Accept your verification request`,
    });
  }

  return result;
};

// Delete user account
const deleteAccount = async (id: string): Promise<void> => {
  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User deletion failed');
  }
  await deleteManyFromS3([
    `images/user/profile/${result.email}`,
    `images/user/civilId/${result.email}-frontSide`,
    `images/user/civilId/${result.email}-backSide`,
  ]);

  return;
};

// Delete my account
const deleteMyAccount = async (id: string, password: string) => {
  const user = await User.IsUserExistId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isPasswordMatched = await bcrypt.compare(password, user?.password);
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.NOT_ACCEPTABLE, 'Password does not match');
  }

  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    },
  );

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User deletion failed');
  }

  await deleteManyFromS3([
    `images/user/profile/${user.email}`,
    `images/user/civilId/${user.email}-frontSide`,
    `images/user/civilId/${user.email}-backSide`,
  ]);
  return result;
};

//verification request send
const requestIdVerify = async (userId: string, payload: Partial<TUser>) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'Invalid user');
  }
  const admin: TUser | null = await User.findOne({ role: 'admin' });
  if (!admin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Admin not found');
  }
  payload.verificationRequest = 'send';

  const result = await User.findByIdAndUpdate(userId, payload, { new: true });

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Request for id verify failed');
  }

  await notificationServices.insertNotificationIntoDb({
    receiver: admin._id,
    refference: userId,
    model_type: 'User',
    message: `${user?.email} user send verification request`,
  });

  return result;
};

//verification accept
// const acceptIdVerify = async(userId:string)=>{
//   const result = await User.findByIdAndUpdate(userId, {
//     isVerified: true,
//     verifyRequest: 'accepted',
//   });

//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'accept your id verification');
//   }

//   return result;
// }

//verification reject

const rejectIdVerificationRequest = async (userId: string, payload: any) => {
  const result = await User.findByIdAndUpdate(
    userId,
    {
      verificationRequest: 'pending',
    },
    { new: true },
  );

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'verifyRequest rejection failed',
    );
  }

  const admin: TUser | null = await User.findOne({ role: 'admin' });
  if (!admin) {
    throw new AppError(httpStatus.FORBIDDEN, 'Admin not found');
  }
  await notificationServices.insertNotificationIntoDb({
    receiver: result?._id,
    refference: admin._id,
    model_type: 'User',
    message: `${result?.name} Admin reject your verification request`,
    description: payload?.reason,
  });

  const emailContent = `
 <div
      style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border: 1px solid #dddddd;
        border-radius: 5px;
      "
    >
      <h2 style="color: #ff0000">ID Verification Rejected</h2>
      <div
        style="
          background-color: #f2f2f2;
          padding: 20px;
          border-radius: 5px;
          margin-top: 20px;
        "
      >
        <p style="font-size: 16px">Dear ${result?.name || 'User'},</p>
        <p style="font-size: 16px">
          Your ID verification request has been rejected for the following
          reason:
        </p>
        <p style="font-size: 16px; font-weight: bold; color: #ff0000">
          ${payload?.reason}
        </p>
        <p style="font-size: 16px">
          If you believe this is a mistake, please contact our support team for
          further assistance and resend request.
        </p>
      </div>
      <div style="margin-top: 20px">
        <p style="font-size: 14px; color: #666">Best regards,</p>
        <p style="font-size: 14px; color: #666">The Support Team</p>
      </div>
    </div>
  `;

  await sendEmail(
    // 'boroxar723@padvn.com',
    result?.email,
    'Your ID Verification Rejected',
    emailContent,
  );
  return result;
};

// const signInWithGoogle = async (payload: Partial<TUser>) => {

//     const user = await User.isUserExist(payload.email as string);

//     if (user) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'User already exists with this email',
//       );
//     }

//     const userExistByUsername = await User.IsUserExistUserName(
//       payload.username as string,
//     );

//     if (userExistByUsername) {
//       throw new AppError(
//         httpStatus.FORBIDDEN,
//         'Username already exists. Try another username',
//       );
//     }
//   const result = await User.create(payload);
//   if (!result) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'User creation Failed');
//   }
// };
export const userServices = {
  insertSubAdminIntoDb,
  getme,
  getAllusers,
  updateUser,
  getSingleUser,
  deleteAccount,
  deleteMyAccount,
  rejectIdVerificationRequest,
  requestIdVerify,
  // acceptIdVerify,
};
