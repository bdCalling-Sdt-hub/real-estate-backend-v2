import { Schema, model } from 'mongoose';
import {
  IBookingResidence,
  IBookingResidenceModel,
} from './bookingResidence.interface';

const BookingResidenceSchema = new Schema<IBookingResidence>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    residence: {
      type: Schema.Types.ObjectId,
      ref: 'Residence',
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, 
    discount:{
      type: Number,
      required: true,
      default: 0,
    },
    guest:{
      child: {
        type: Number,
        required: true,
        default: 0,
      },
      adult: {
        type: Number,
        required: true,
        default: 0,
      },
    },
    status:{
      type: String,
      enum: ['pending', 'approved', 'canceled'],
      required: true,
      default: 'pending',
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

BookingResidenceSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

BookingResidenceSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

BookingResidenceSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const BookingResidence = model<IBookingResidence, IBookingResidenceModel>(
  'BookingResidence',
  BookingResidenceSchema,
);

export default BookingResidence;
