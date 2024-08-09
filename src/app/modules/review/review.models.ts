import { Schema, model } from 'mongoose';
import { IReview, IReviewModel } from './review.interface';

const reviewSchema = new Schema<IReview>({
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
  rating: {
    type: Number,
    required: true,
  },
  images: {
    type: [
      {
        url: {
          type: String,
        },
        key: {
          type: String,
          unique: true,
        },
      },
    ],
    required: false,
  },
  comment: {
    type: String,
    required: true,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

// filter out deleted documents
reviewSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

reviewSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

reviewSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Review = model<IReview, IReviewModel>('Review', reviewSchema);
export default Review;
