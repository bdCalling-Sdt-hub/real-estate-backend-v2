import { Schema, model } from 'mongoose';
import { ICategory, ICategoryModel } from './category.interface';

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true, unique: true },
  isDeleted: { type: Boolean, default: false },
});

// filter out deleted documents
categorySchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

categorySchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

categorySchema.statics.isCategoryExist = async function (name: string) {
  return await Category.findOne({ name: name });
};

const Category = model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;
