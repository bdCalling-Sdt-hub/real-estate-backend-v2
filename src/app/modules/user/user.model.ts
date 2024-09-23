import { Error, Schema, model } from 'mongoose';
import { TUser, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';
import {
  gender,
  monthlyIncome,
  REGISTER_WITH,
  role,
  USER_ROLE,
} from './user.constant';
const userSchema = new Schema<TUser>(
  {
    // username: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
    name: {
      type: String,
      required: true,
    },
    nameArabic: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
    },
    phoneCode: {
      type: String,
      default: '+1',
    },
    nationality: {
      type: String,
      default: '',
    },
    maritalStatus: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      enum: gender,
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    job: {
      type: String,
      default: '',
    },
    monthlyIncome: {
      type: String,
      enum: monthlyIncome,
      required: false,
    },
    bankInfo: {
      country: {
        type: String,
      },
      bankName: {
        type: String,
      },
      accountHolder: {
        type: String,
      },
      swiftCode: {
        type: String,
      },
      accountNumber: {
        type: String,
      },
      bankAddress: {
        type: String,
      },
    },
    documents: {
      type: {
        selfie: { type: String || null },
        documentType: { type: String || null },
        documents: [
          {
            key: String || null,
            url: String || null,
          },
        ],
      },
      required: false,
    },
    totalProperties: {
      type: Number,
    },
    verificationRequest: {
      type: String,
      enum: ['pending', 'send', 'accepted', 'rejected'],
      default: 'pending',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    address: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: role,
      default: 'user',
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    status: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    needsPasswordChange: {
      type: Boolean,
      default: false,
    },
    passwordChangedAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    tenants: {
      type: String,
      default: 0,
    },
    verification: {
      otp: {
        type: String,
        select: false,
      },
      expiresAt: {
        type: Date,
        select: false,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    registerWith: {
      type: String,
      enum: [
        REGISTER_WITH.credential,
        REGISTER_WITH.apple,
        REGISTER_WITH.google,
      ],
      default: 'credential',
    },
    balance: {
      type: Number,
      default: 0,
    },
    about: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  if (user.registerWith === REGISTER_WITH.credential) {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds),
    );
  }
  next();
});

// set '' after saving password
userSchema.post(
  'save',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function (error: Error, doc: any, next: (error?: Error) => void): void {
    doc.password = '';
    next();
  },
);
// filter out deleted documents
userSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

userSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};
userSchema.statics.IsUserExistUserName = async function (username: string) {
  return await User.findOne({ username: username }).select('+password');
};
userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};
userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);
