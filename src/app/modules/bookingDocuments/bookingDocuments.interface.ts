import { Model, Types } from 'mongoose';
interface IDoc {
  key: string;
  url: string;
}

interface IData {
  signature: string | null;
  documents: IDoc[];
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
