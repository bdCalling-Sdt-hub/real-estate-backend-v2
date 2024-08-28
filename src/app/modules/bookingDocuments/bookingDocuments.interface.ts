import { Model, Types } from 'mongoose';

interface IData {
  signature: string | null;
  civilId: string | null;
}

export interface IBookingDocuments {
  booking: Types.ObjectId;
  landlord: IData;
  user: IData;
}

export type IBookingDocumentsModel = Model<
  IBookingDocuments,
  Record<string, unknown>
>;
