import { Schema, model } from 'mongoose';
import { IResidence, IResidenceModel } from './residence.interface';

// Define the Address schema
const addressSchema = new Schema({
  governorate: { type: String, required: true },
  area: { type: String, required: true },
  block: { type: String, required: true },
  street: { type: String, required: true },
  house: { type: String, required: true },
  floor: { type: String, required: true },
  apartment: { type: String, required: true },
});

// Define the File schema
const fileSchema = new Schema({
  url: { type: String, required: true },
  key: { type: String, required: true },
});

const ResidenceSchema = new Schema<IResidence>(
  {
    images: { type: [fileSchema], required: true },
    videos: { type: [fileSchema], default: [] },
    category: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Category',
    },
    propertyName: { type: String, required: true },
    squareFeet: { type: String, required: true },
    bathrooms: { type: String, required: true },
    bedrooms: { type: String, required: true },
    features: [{ type: String, required: true }],
    rentType: { type: String, required: true },
    residenceType: { type: String, required: true },
    perNightPrice: { type: Number, required: true },
    perMonthPrice: { type: Number, required: true },
    propertyAbout: { type: String, required: true },
    address: { type: addressSchema, required: true },
    paciNo: { type: Number, required: true },
    rules: { type: String, required: true },
    discount: { type: Number, default: 0 },
    discountCode: { type: String },
    location: {
      latitude: Number,
      longitude: Number,
      coordinates: [Number],
      type: { type: String, default: 'Point' },
    },
    host: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    popularity: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// filter out deleted documents
ResidenceSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ResidenceSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

ResidenceSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Residence = model<IResidence, IResidenceModel>(
  'Residence',
  ResidenceSchema,
);
export default Residence;
