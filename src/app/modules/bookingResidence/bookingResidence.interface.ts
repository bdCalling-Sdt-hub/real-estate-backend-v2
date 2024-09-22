/* eslint-disable @typescript-eslint/no-explicit-any */
import { Model, ObjectId } from 'mongoose';

export interface IBookingResidence {
  payload: any;
  _id?: string;
  residence: ObjectId;
  contractNo: string;
  user: ObjectId;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  author: ObjectId;
  isPaid: boolean;
  isDeleted: boolean;
  discount: number;
  status: string;
  guest: {
    child: number;
    adult: number;
  };
}


export type IBookingResidenceModel = Model<
  IBookingResidence,
  Record<string, unknown>
>;
