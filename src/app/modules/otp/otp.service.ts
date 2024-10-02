import httpStatus from 'http-status';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import moment from 'moment';
import config from '../../config';
import AppError from '../../error/AppError';
import { sendEmail } from '../../utils/mailSender';
import { generateOtp } from '../../utils/otpGenerator';
import { sendMobileSms, sendWhatsAppMessage } from '../../utils/smsSender';
import { User } from '../user/user.model';
import path from 'path';
import fs from 'fs';

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

const resendOtp = async (email: string, type?: string) => {
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

  const otpEmailPath = path.join(
    __dirname,
    '../../../../public/view/otp_temp.html',
  );

  await sendEmail(
    user?.email,
    'Your One Time OTP - Mostaajer / رمز التحقق لمرة واحدة - مستأجر',
    fs
      .readFileSync(otpEmailPath, 'utf8')
      .replace('{{otp}}', otp)
      .replace('{{expiry}}', expiresAt.toLocaleString())
      .replace('{{otp2}}', otp)
      .replace('{{expiry2}}', expiresAt.toLocaleString()),
  );

  // await sendEmail(
  //   user?.email,
  //   'Your One Time OTP - Mostaajer / رمز التحقق لمرة واحدة - مستأجر',
  //   `<div style="font-family: Arial, sans-serif; color: #333; background-color: #f7f7f7; padding: 20px;">
  //     <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
  //       <div style="background-color: #00466a; padding: 20px; text-align: center; color: white;">
  //         <h2 style="margin: 0; font-size: 24px;">Your One Time OTP - Mostaajer</h2>
  //         <p style="font-size: 16px; margin: 5px 0;">رمز التحقق لمرة واحدة - مستأجر</p>
  //       </div>

  //       <div style="padding: 20px; text-align: left;">
  //         <p style="font-size: 16px; color: #333;">
  //           <strong>Your OTP is:</strong> ${otp} <br>
  //           <strong>رمز التحقق الخاص بك هو:</strong> ${otp}
  //         </p>

  //         <p style="font-size: 16px; color: #333; margin-top: 20px;">
  //           <strong>This OTP is valid until:</strong> ${expiresAt.toLocaleString()} <br>
  //           <strong>هذا الرمز صالح حتى:</strong> ${expiresAt.toLocaleString()}
  //         </p>

  //         <p style="font-size: 14px; color: #999; margin-top: 20px;">Please use this OTP within the validity period. Do not share it with anyone.</p>
  //         <p style="font-size: 14px; color: #999; margin-top: 5px;">يرجى استخدام هذا الرمز خلال الفترة الصالحة. لا تشاركها مع أي شخص.</p>
  //       </div>

  //       <div style="background-color: #00466a; padding: 20px; text-align: center; color: white;">
  //         <p style="font-size: 14px; margin: 0;">Thank you for using Mostaajer / شكرًا لاستخدامك مستأجر</p>
  //       </div>
  //     </div>
  //   </div>`,
  // );

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
      },
    ],
  };
 
    await sendWhatsAppMessage(
      // integratedNumber,
      phoneNumbers,
      languageCode,
      OTPCode,
    );
    await sendMobileSms(smsOptions);
 

  return { token };
};

export const otpServices = {
  verifyOtp,
  resendOtp,
};
