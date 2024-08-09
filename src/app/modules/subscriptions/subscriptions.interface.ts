import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

export interface ISubscription {
  _id?: string;
  user: ObjectId;
  package: ObjectId;
  transitionId: string;
  startAt: Date;
  endAt: Date;
  totalPrice: string;
  isPaid: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  isActive: Boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  isDeleted: Boolean;
}

export type ISubscriptionModel = Model<ISubscription, Record<string, unknown>>;
