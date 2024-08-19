import { Types } from 'mongoose';
import Review from '../review/review.models';
interface IResult {
  averageRating: number;
  totalReview: number;
}
export const calculateAverageRatingForResidence = async (
  residenceId: Types.ObjectId,
): Promise<IResult | null> => {
  const result = await Review.aggregate([
    { $match: { residence: residenceId, isDeleted: { $ne: true } } }, // Match the residence and filter out deleted reviews
    {
      $group: {
        _id: '$residence',
        averageRating: { $avg: '$rating' },
        totalReview: { $sum: '$rating' },
      },
    }, // Group by residence and calculate the average rating
  ]);

  if (result.length > 0) { 
    return {
      averageRating: Number(result[0].averageRating.toFixed(1)),
      totalReview: Number(result[0].totalReview.toFixed(1)),
    };
  }
  const defaultNumber: number = 0;
  return {
    averageRating: Number(defaultNumber.toFixed(1)),
    totalReview: Number(defaultNumber.toFixed(1)),
  }; // No ratings found
};
