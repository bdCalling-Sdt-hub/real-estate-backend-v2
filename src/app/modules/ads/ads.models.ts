import { Schema, model } from 'mongoose';
import { IAds, IAdsModel } from './ads.interface';
import moment from 'moment';

const AdsSchema = new Schema<IAds>({
  // price: { type: Number, required: true },
  // startAt: { type: Date, required: true },
  // expireAt: { type: Date, required: true },
  banner: {
    type: String,
  },
  expireDate: {
    type: Date, 
    required: true, 
  },
  // status: {
  //   type: Boolean,
  //   default: false,
  // },
  // tranId: { type: String, required: false },
  // property: { type: Schema.Types.ObjectId, ref: 'Residence', required: true },
  contactLink: { type: String, require: true },
  category: { type: Schema.Types.ObjectId, ref: 'AdsCategory', required: true },
  isDeleted: { type: Boolean, default: false },
}); 

AdsSchema.pre('save', async function (next) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const expiredDate = this.expireDate;
  if (expiredDate) {
     this.expireDate = moment(expiredDate).toDate()
  }
  next();
});

// filter out deleted documents// Filter out deleted and expired documents
AdsSchema.pre('find', function (next) {
  this.find({
    isDeleted: { $ne: true },
    expireDate: { $gt: new Date().toISOString() },
  });
  next();
});

AdsSchema.pre('findOne', function (next) {
  this.find({
    isDeleted: { $ne: true },
    expireDate: { $gt: new Date().toISOString() },
  });
  next();
});

AdsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({
    $match: {
      isDeleted: { $ne: true },
      expireDate: { $gt: new Date().toISOString() },
    },
  });
  next();
});


const Ads = model<IAds, IAdsModel>('Ads', AdsSchema);

export default Ads;
