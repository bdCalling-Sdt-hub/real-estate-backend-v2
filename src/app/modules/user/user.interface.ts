import { Model, Types } from 'mongoose';
import { USER_ROLE } from './user.constant';

interface IDocument {
  key: string;
  url: string;
}

interface IDocuments {
  selfie: string | null;
  documentType: string | null;
  documents: IDocument[] | null;
}

export interface TUser {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // [x: string]: any;
  _id?: Types.ObjectId;
  status: string;
  isVerified: boolean;
  id: string;
  username: string;
  name: string;
  email: string;
  phoneCode: string;
  phoneNumber: string;
  password: string;
  nationality: string;
  gender: 'Male' | 'Female' | 'Others';
  maritalStatus: string;
  dateOfBirth: string;
  job: string;
  monthlyIncome: string;
  documents?: IDocuments | null;
  verificationRequest: string;
  image?: string;
  role: 'admin' | 'user' | 'host' | 'super_admin' | 'sub_admin';
  totalProperties?: number;
  bankInfo: {
    country: string;
    bankName: string;
    swiftCode: string;
    accountHolder: string;
    accountNumber: string;
    bankAddress: string;
  };
  address?: string;
  needsPasswordChange: boolean;
  passwordChangedAt?: Date;
  isDeleted: boolean;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  tenants?: number;
  balance: number;
  about: string;
}

export interface UserModel extends Model<TUser> {
  isUserExist(email: string): Promise<TUser>;
  IsUserExistId(id: string): Promise<TUser>;
  IsUserExistUserName(userName: string): Promise<TUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
