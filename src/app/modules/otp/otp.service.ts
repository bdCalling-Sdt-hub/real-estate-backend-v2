import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import moment from 'moment';
import config from '../../config';
import AppError from '../../error/AppError';
import { sendEmail } from '../../utils/mailSender';
import { generateOtp } from '../../utils/otpGenerator';
import { sendMobileSms, sendWhatsAppMessage } from '../../utils/smsSender';
import { User } from '../user/user.model';

const verifyOtp = async (token: string, otp: string | number) => {
  if (!token) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized');
  }
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as Secret,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Session has expired. Please try to submit OTP within 1 minute',
    );
  }

  const user = await User.findById(decode?.id).select(
    'verification status email role _id',
  );
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }
  if (new Date() > user?.verification?.expiresAt) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'OTP has expired. Please resend it',
    );
  }
  if (Number(otp) !== Number(user?.verification?.otp)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'OTP did not match');
  }

  const updateUser = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        status: user?.status === 'active' ? user?.status : 'active',
        verification: {
          otp: 0,
          expiresAt: moment().add(2, 'minute'),
          status: true,
        },
      },
    },
    { new: true },
  ).select('_id username role email');

  const jwtPayload = {
    email: user?.email,
    role: user?.role,
    userId: user?._id,
  };
  const jwtToken = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '30d',
  });

  return { user: updateUser, token: jwtToken };
};

const resendOtp = async (email: string, type: string) => {
  console.log('hitted');
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User not found');
  }

  const otp = generateOtp();
  const expiresAt = moment().add(3, 'minute');

  const updateOtp = await User.findByIdAndUpdate(
    user?._id,
    {
      $set: {
        verification: {
          otp,
          expiresAt,
          status: false,
        },
      },
    },
    { new: true },
  );

  if (!updateOtp) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to resend OTP. Please try again later',
    );
  }

  const jwtPayload = {
    email: user?.email,
    id: user?._id,
  };
  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '3m',
  });

  await sendEmail(
    user?.email,
    'Your One Time OTP',
    `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Your One Time OTP</h2>
      <div style="background-color: #f2f2f2; padding: 20px; border-radius: 5px;">
        <p style="font-size: 16px;">Your OTP is: <strong>${otp}</strong></p>
        <p style="font-size: 14px; color: #666;">This OTP is valid until: ${expiresAt.toLocaleString()}</p>
      </div>
    </div>`,
  );

  // const integratedNumber = '96599615330';
  const phoneNumber = user?.phoneCode + user?.phoneNumber;

  const phoneNumbers = [phoneNumber];
  const languageCode = 'ar';
  const OTPCode = otp.toString();
  const smsOptions = {
    recipients: [
      {
        mobiles: phoneNumber,
        otp: OTPCode,
        // Add more variables as needed
      },
    ],
  };
  if (type === 'whatsapp') {
    await sendWhatsAppMessage(
      // integratedNumber,
      phoneNumbers,
      languageCode,
      OTPCode,
    );
  } else {
    await sendMobileSms(smsOptions);
  }

  return { token };
};

export const otpServices = {
  verifyOtp,
  resendOtp,
};
