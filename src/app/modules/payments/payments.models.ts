import { Schema, model } from 'mongoose';
import { IPayment } from './payments.interface';
import { paymentType } from './payments.constants';

const paymentSchema = new Schema<IPayment>(
  {
    amount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
      required: true,
    },
    transitionId: {
      type: String,
      required: true,
      unique: true,
    },
    transitionDate: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: paymentType,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    details: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'type',
    },
    residenceAuthority: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    // landlordAmount: {
    //   type: Number,
    //   required: true,
    //   default: function () {
    //     return this.amount * 0.9;
    //   },
    // },
    // adminAmount: {
    //   type: Number,
    //   required: true,
    //   default: function () {
    //     return this.amount * 0.1;
    //   },
    // },
    
  },
  {
    timestamps: true,
    // discriminatorKey: 'type',
  },
);

const Payment = model<IPayment>('Payment', paymentSchema);

export default Payment;
