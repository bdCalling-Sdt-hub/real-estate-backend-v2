import { Schema, model } from 'mongoose';
import { ISubscription, ISubscriptionModel } from './subscriptions.interface';

const SubscriptionSchema = new Schema<ISubscription>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    package: {
      type: Schema.Types.ObjectId,
      ref: 'Package',
    },
    transitionId: {
      type: String,
    },
    startAt: { type: Date },
    endAt: { type: Date },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isActive: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

// SubscriptionSchema.pre('save', async function (next) {
//   if (!this.isModified('startDate')) {
//     this.startAt = new Date();
//   }
//   const packages: Partial<IPackage | null> =  await Package.findById(this.package);
//   if (!packages)
//     throw new AppError(httpStatus.NOT_FOUND, 'subscription not found');

//   this.endAt = new Date(this.startAt);
//   this.endAt.setDate(
//     this.endAt.getDate() + (packages?.durationDays as number),
//   );
//   next();
// });

SubscriptionSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

SubscriptionSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Subscription = model<ISubscription, ISubscriptionModel>(
  'Subscription',
  SubscriptionSchema,
);

export default Subscription;
