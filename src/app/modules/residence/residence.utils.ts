import { Types } from 'mongoose';
import Review from '../review/review.models';
interface IResult {
  averageRating: number;
  totalReview: number;
}

export const calculateAverageRatingForResidence = async (
  residenceId: string,
): Promise<IResult | null> => {
  const result = await Review.aggregate([
    {
      $match: {
        residence: new Types.ObjectId(residenceId),
        isDeleted: { $ne: true },
      },
    }, // Match the residence and filter out deleted reviews
    {
      $group: {
        _id: '$residence',
        averageRating: { $avg: '$rating' },
        totalReview: { $sum: 1 }, // Count the number of reviews
      },
    }, // Group by residence and calculate the average rating
  ]);

  if (result.length > 0) {
    return {
      averageRating: Number(result[0].averageRating.toFixed(1) || 0),
      totalReview: result[0].totalReview, // Return the total number of reviews
    };
  }

  const defaultNumber: number = 0;
  return {
    averageRating: Number(defaultNumber.toFixed(1)),
    totalReview: defaultNumber, // No ratings found
  };
};

// export const calculateAverageRatingForResidence = async (
//   residenceId: string,
// ): Promise<IResult | null> => {
//   const result = await Review.aggregate([
//     {
//       $match: {
//         residence: new Types.ObjectId(residenceId),
//         isDeleted: { $ne: true },
//       },
//     }, // Match the residence and filter out deleted reviews
//     {
//       $group: {
//         _id: '$residence',
//         averageRating: { $avg: '$rating' },
//         totalReview: { $sum: '$rating' },
//       },
//     }, // Group by residence and calculate the average rating
//   ]);

//   if (result.length > 0) {
//     return {
//       averageRating: Number(result[0].averageRating.toFixed(1)||0),
//       totalReview: Number(result[0].totalReview.toFixed(1)||0),
//     };
//   }
//   const defaultNumber: number = 0;
//   return {
//     averageRating: Number(defaultNumber.toFixed(1)),
//     totalReview: Number(defaultNumber.toFixed(1)),
//   }; // No ratings found
// };
