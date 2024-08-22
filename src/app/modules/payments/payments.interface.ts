import { ObjectId } from 'mongodb';

export interface IPayment {
  user: ObjectId;
  residence?: ObjectId;
  ads?: ObjectId;
  amount: number;
  currency: string;
  transitionId: string;
  status: string;
  type: 'BookingResidence' | 'SubscriptionBooking' | 'Ads';
  details: ObjectId;
  paymentMethod: string;
  isDeleted: boolean;
  transitionDate: Date;
  residenceAuthority?: ObjectId;
  // adminAmount: number;
  // landlordAmount: number;
}
