import { Schema, model } from 'mongoose';
import { IPackage, IPackageModel } from './package.interface';

const packageModel = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    durationDays: {
      type: Number,
      required: true,
    },
    features: {
      type: [String],
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// filter out deleted documents
packageModel.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

packageModel.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

packageModel.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Package = model<IPackage, IPackageModel>('Package', packageModel);

export default Package;
