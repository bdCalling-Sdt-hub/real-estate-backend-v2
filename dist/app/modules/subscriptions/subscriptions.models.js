"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const SubscriptionSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    package: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
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
const Subscription = (0, mongoose_1.model)('Subscription', SubscriptionSchema);
exports.default = Subscription;
