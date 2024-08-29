import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import httpStatus, { SWITCHING_PROTOCOLS } from 'http-status';
import AppError from '../../error/AppError';
import { User } from '../user/user.model';
import {
  ISignInWithGoogle,
  TchangePassword,
  Tlogin,
  TresetPassword,
} from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import { generateOtp } from '../../utils/otpGenerator';
import moment from 'moment';
import { sendEmail } from '../../utils/mailSender';
import bcrypt from 'bcrypt';
import { TUser } from '../user/user.interface';
import { REGISTER_WITH, USER_ROLE } from '../user/user.constant';

// Login
const login = async (payload: Tlogin) => {
  const user: TUser | null = await User.isUserExist(payload?.email);

  console.log(user);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }

  if (user?.registerWith !== REGISTER_WITH.credential) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'your credential is not available',
    );
  }

  if (!(await User.isPasswordMatched(payload.password, user.password))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  const jwtPayload: { userId: string; role: string } = {
    userId: user?._id?.toString() as string,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const signInWithGoogle = async (payload: ISignInWithGoogle) => {
  const user = await User.isUserExist(payload.email);
  if (
    user?.registerWith === REGISTER_WITH.google &&
    payload.registerWith === REGISTER_WITH.google
  ) {
    const jwtPayload: { userId: string; role: string } = {
      userId: user?._id?.toString() as string,
      role: user?.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  } else if (
    user?.registerWith === REGISTER_WITH.apple &&
    payload.registerWith === REGISTER_WITH.apple
  ) {
    const jwtPayload: { userId: string; role: string } = {
      userId: user?._id?.toString() as string,
      role: user?.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      user,
      accessToken,
      refreshToken,
    };
  } else if (!payload.email && !payload.role && !payload.name) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Please provide email, role and name',
    );
  } else if (payload?.role === USER_ROLE.admin) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'you cannot able to create  admin',
    );
  } else if (!user && payload.registerWith === REGISTER_WITH.google) {
    const newUser = await User.create({
      email: payload?.email,
      name: payload?.name,
      role: payload?.role,
      registerWith: REGISTER_WITH.google,
      verification: {
        otp: 0,
        expiresAt: new Date(),
        status: true,
      },
    });

    if (!newUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user',
      );
    }

    const jwtPayload: { userId: string; role: string } = {
      userId: newUser?._id?.toString() as string,
      role: newUser?.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      newUser,
      accessToken,
      refreshToken,
    };
  } else if (!user && payload.registerWith === REGISTER_WITH.apple) {
    const newUser = await User.create({
      email: payload?.email,
      name: payload?.name,
      role: payload?.role,
      registerWith: REGISTER_WITH.apple,
      verification: {
        otp: 0,
        expiresAt: new Date(),
        status: true,
      },
    });

    if (!newUser) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create user',
      );
    }

    const jwtPayload: { userId: string; role: string } = {
      userId: newUser?._id?.toString() as string,
      role: newUser?.role,
    };

    const accessToken = createToken(
      jwtPayload,
      config.jwt_access_secret as string,
      config.jwt_access_expires_in as string,
    );

    const refreshToken = createToken(
      jwtPayload,
      config.jwt_refresh_secret as string,
      config.jwt_refresh_expires_in as string,
    );

    return {
      newUser,
      accessToken,
      refreshToken,
    };
  } else {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'your credential is not available',
    );
  }
};
// Change password
const changePassword = async (id: string, payload: TchangePassword) => {
  const user = await User.IsUserExistId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user.password))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match');
  }

  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    },
    { new: true },
  );

  return result;
};

// Forgot password
const forgotPassword = async (email: string) => {
  const user = await User.isUserExist(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'this user is deleted');
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
  }

  const jwtPayload = {
    email: email,
    id: user?._id,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '3m',
  });

  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(3, 'minute');

  await User.findByIdAndUpdate(user?._id, {
    verification: {
      otp,
      expiresAt,
    },
  });

  await sendEmail(
    email,
    'Your reset password OTP is:',
    `<div><h5>Your OTP is: ${otp}</h5>
    <p>Valid until: ${expiresAt.toLocaleString()}</p>
    </div>`,
  );

  return { email, token };
};

// Reset password
const resetPassword = async (token: string, payload: TresetPassword) => {
  let decode;

  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session has expired. Please try again',
    );
  }

  const user = await User.findById(decode?.userId || decode?.id).select(
    'isDeleted verification _id',
  );
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (new Date() > user?.verification?.expiresAt) {
    throw new AppError(httpStatus.FORBIDDEN, 'Session has expired');
  }
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'OTP is not verified yet');
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(decode?.userId, {
    password: hashedPassword,
    passwordChangedAt: new Date(),
    verification: {
      otp: 0,
      status: true,
    },
  });

  return result;
};

// Refresh token
const refreshToken = async (token: string) => {
  // Checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userId } = decoded;
  const user = await User.IsUserExistId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (user?.status === 'blocked') {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is Blocked');
  }
  const jwtPayload = {
    userId: user.id,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken,
  signInWithGoogle,
};
