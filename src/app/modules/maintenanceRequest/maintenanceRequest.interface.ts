import { Model, Types } from 'mongoose';

export interface IMaintenanceRequest {
  _id?: string;
  user: Types.ObjectId;
  property: Types.ObjectId;
  problems: string;
  images: [{ key: string; url: string }];
  status: 'pending' | 'accepted' | 'cancelled';
  extraInfo: {
    name: string;
    apartment: string;
    floor: string;
    address: string;
    email: string;
    phoneNumber: string;
  };
}

export type IMaintenanceRequestModel = Model<
  IMaintenanceRequest,
  Record<string, unknown>
>;
