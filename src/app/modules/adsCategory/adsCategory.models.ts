import { Schema, model } from 'mongoose';
import { IAdsCategory, IAdsCategoryModel } from './adsCategory.interface';

const adsCategorySchema = new Schema<IAdsCategory>({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
});

// filter out deleted documents
adsCategorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adsCategorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

adsCategorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

adsCategorySchema.statics.isCategoryExist = async function (name: string) {
  return await AdsCategory.findOne({ name: name });
};

const AdsCategory = model<IAdsCategory, IAdsCategoryModel>(
  'AdsCategory',
  adsCategorySchema,
);

export default AdsCategory;
