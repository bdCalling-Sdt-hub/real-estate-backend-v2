/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Review from './review.models';
import { IReview } from './review.interface';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteManyFromS3 } from '../../utils/s3';
import Residence from '../residence/residence.models';
import { calculateAverageRatingForResidence } from '../residence/residence.utils';

const createReview = async (payload: IReview) => {
  const result: IReview | null = await Review.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review creation failed');
  }

  const avgRating = await calculateAverageRatingForResidence(
    result?.residence?.toString() as string,
  );

  await Residence.findByIdAndUpdate(
    result?.residence,
    {
      averageRating: avgRating,
    },
    { new: true, timestamps: false },
  );

  return result;
};

// Get all reviews
const getAllReview = async (query: Record<string, any>) => {
  const reviewModel = new QueryBuilder(
    Review.find().populate(['user', 'residence']),
    query,
  )
    .populateFields('residence')
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await reviewModel.modelQuery;
  const meta = await reviewModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get review by ID
const getReviewById = async (id: string) => {
  const result = await Review.findById(id).populate(['user', 'residence']);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Review not found');
  }
  return result;
};

// Update review
const updateReview = async (id: string, payload: Partial<IReview>) => {
  const result = await Review.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Review update failed');
  }
  return result;
};

// Delete review
const deleteReview = async (id: string) => {
  const result = await Review.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Review deletion failed');
  }

  const deleteKeys: string[] = [];

  if (result?.images) {
    result?.images?.forEach(image =>
      deleteKeys.push(`images/comments/${image?.key}`),
    );
  }

  if (deleteKeys.length) {
    await deleteManyFromS3(deleteKeys);
  }

  return result;
};

export const reviewService = {
  createReview,
  getAllReview,
  getReviewById,
  updateReview,
  deleteReview,
};
