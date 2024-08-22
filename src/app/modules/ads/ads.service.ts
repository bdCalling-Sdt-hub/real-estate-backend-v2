/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { FiltersData, IAds, IFilter, IPaginationOption } from './ads.interface';
import Ads from './ads.models';
// import { adsSearchableFields } from './ads.constants';
import { uploadToS3 } from '../../utils/s3';
import { SortOrder } from 'mongoose';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { adsSearchableFields } from './ads.constants';
import { paymentsService } from '../payments/payments.service';
import moment from 'moment';

const createAd = async (payload: Partial<IAds>, userId: string) => {
  const startDate = new Date();
  const endDate = new Date(startDate);
  payload?.month
    ? endDate.setMonth(endDate.getMonth() + parseInt(payload?.month))
    : endDate.setMonth(endDate.getMonth() + 1);

  payload.startAt = startDate;
  payload.expireAt = endDate;
  payload.price = payload.month ? 2 * parseInt(payload?.month) : 2;

  const result: IAds | null = await Ads.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ad creation failed');
  }

  const paymentLink = await paymentsService.initiatePayment({
    user: userId,
    bookingId: result?._id,
    paymentType: 'Ads',
  });

  return { ads: result, paymentLink: paymentLink?.data?.link };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllAds = async (
  filters: IFilter,
  paginationOptions: IPaginationOption,
) => {
  const { searchTerm, ...filtersData } = filters;
  const pipeline: any[] = [];

  // Aggregation to populate referenced fields
  pipeline.push({
    $lookup: {
      from: 'residences',
      localField: 'property',
      foreignField: '_id',
      as: 'property',
    },
  });

  pipeline.push({ $unwind: '$property' });

  pipeline.push({
    $lookup: {
      from: 'users',
      localField: 'property.host',
      foreignField: '_id',
      as: 'property.host',
    },
  });

  pipeline.push({
    $lookup: {
      from: 'categories',
      localField: 'property.category',
      foreignField: '_id',
      as: 'property.category',
    },
  });

  pipeline.push({ $unwind: '$property.host' });
  pipeline.push({ $unwind: '$property.category' });

  let matchStage: any = {};

  // Add search term conditions to matchStage
  if (searchTerm) {
    matchStage.$or = adsSearchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  // Add filtersData to matchStage
  const nonNestedFilters: any = {};
  const nestedFilters: any = {};

  Object.keys(filtersData).forEach(key => {
    if (key.includes('.')) {
      nestedFilters[key] = filtersData[key];
    } else {
      nonNestedFilters[key] = filtersData[key];
    }
  });

  // Merge non-nested filters into matchStage
  matchStage = { ...matchStage, ...nonNestedFilters };

  // Add $match stage early in the pipeline if applicable
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Add nested filters after lookup and unwind
  if (Object.keys(nestedFilters).length > 0) {
    Object.keys(nestedFilters).forEach(key => {
      pipeline.push({
        $match: {
          [key]: { $regex: nestedFilters[key], $options: 'i' },
        },
      });
    });
  }

  // Sorting and pagination
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // Add sorting, skipping, and limiting at the end
  pipeline.push({ $sort: sortConditions });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });
 

  // Execute the aggregation pipeline
  const results = await Ads.aggregate(pipeline);
  const totalData = results.length;

  return {
    meta: { page, limit, total: totalData },
    data: results,
  };
};

// const getAllAds = async(filters: IFilter,
//   paginationOptions: IPaginationOption,)=>{

// }

const getAdsById = async (id: string): Promise<IAds> => {
  const result = await Ads.findById(id).populate('property');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Ad not found.');
  }
  return result;
};

const updateAd = async (
  id: string,
  payload: Partial<IAds>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any,
): Promise<IAds | null> => {
  if (file) {
    const ad = await Ads.findById(id);
    const bannerUrl = await uploadToS3({
      file: file,
      fileName: `images/ads/${ad?.property}`,
    });

    payload.banner = bannerUrl as string;
  }
  const result = await Ads.findByIdAndUpdate(id, payload, { new: true });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Ad update failed');
  }

  return result;
};

const deleteAds = async (id: string) => {
  const result = await Ads.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Ad deletion failed');
  }

  return result;
};

export const adsService = {
  createAd,
  getAllAds,
  getAdsById,
  updateAd,
  deleteAds,
};
