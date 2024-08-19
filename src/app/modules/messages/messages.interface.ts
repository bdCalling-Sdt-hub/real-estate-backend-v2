import { Model, ObjectId } from 'mongoose';
import { IBookingResidence } from '../bookingResidence/bookingResidence.interface';

export interface IMessages {
  _id?: ObjectId;
  id?: string;
  text?: string;
  imageUrl?: string;
  seen: boolean;
  chat: ObjectId;
  sender: ObjectId;
  receiver: ObjectId;
  bookingId:ObjectId|IBookingResidence | null,
  showButton: boolean; 
}

export type IMessagesModel = Model<IMessages, Record<string, unknown>>;
