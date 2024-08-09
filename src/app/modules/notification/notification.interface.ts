import { ObjectId } from 'mongodb';
export enum modeType {
  BookingResidence = 'BookingResidence',
  SubscriptionBooking = 'SubscriptionBooking',
  Ads = 'Ads',
  User = 'User',
}
export interface TNotification {
  receiver: ObjectId;
  message: string;
  description?: string;
  refference: ObjectId;
  model_type: modeType;
  date?: Date;
  read: boolean;
  isDeleted: boolean;
}
