import { Types } from 'mongoose';
import Review from '../review/review.models';

export const calculateAverageRatingForResidence = async (
  residenceId: Types.ObjectId,
): Promise<number | null> => {
  const result = await Review.aggregate([
    { $match: { residence: residenceId, isDeleted: { $ne: true } } }, // Match the residence and filter out deleted reviews
    { $group: { _id: '$residence', averageRating: { $avg: '$rating' } } }, // Group by residence and calculate the average rating
  ]);

  if (result.length > 0) {
    return result[0].averageRating;
  }

  return 0; // No ratings found
};
