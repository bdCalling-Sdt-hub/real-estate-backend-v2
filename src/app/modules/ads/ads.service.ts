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

const createAd = async (payload: Partial<IAds>): Promise<IAds> => {
  const result = Ads.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ad creation failed');
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllAds = async (
  filters: IFilter,
  paginationOptions: IPaginationOption,
) => {
 
  const { searchTerm, ...filtersData } = filters;

   console.log(searchTerm);


  const pipeline: any[] = [];

  // Match stage for basic conditions
  let matchStage: any = {};

  if (searchTerm) {
    matchStage.$or = adsSearchableFields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    }));
  }

  // Merge filtersData into matchStage
  if (Object.keys(filtersData).length > 0) {
    const filteredKeys = Object.keys(filtersData).filter(
      key => !key.includes('.'),
    );

    // Creating a new object with filtered keys
    const filteredObject: any = {};
    filteredKeys.forEach(key => {
      filteredObject[key] = filtersData[key];
    });

    matchStage = { ...matchStage, ...filteredObject };
  }

  // Add initial $match stage to pipeline
  pipeline.push({ $match: matchStage });

  // Sorting and pagination
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions);

  const sortConditions: { [key: string]: SortOrder } = {};
  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  // Aggregation to populate referenced fields
  pipeline.push({
    $lookup: {
      from: 'residences', // Name of the Residence collection
      localField: 'property',
      foreignField: '_id',
      as: 'property',
    },
  });

  // Unwind property array
  pipeline.push({ $unwind: '$property' });

  // Populate host and category fields within property
  pipeline.push({
    $lookup: {
      from: 'users', // Assuming 'users' is the collection name for hosts
      localField: 'property.host',
      foreignField: '_id',
      as: 'property.host',
    },
  });

  pipeline.push({
    $lookup: {
      from: 'categories', // Assuming 'categories' is the collection name for categories
      localField: 'property.category',
      foreignField: '_id',
      as: 'property.category',
    },
  });

  // Unwind populated fields to filter on them
  pipeline.push({ $unwind: '$property.host' });
  pipeline.push({ $unwind: '$property.category' });

  if (Object.keys(filtersData).length > 0) {
    const filteredKeys = Object.keys(filtersData).filter(key =>
      key.includes('.'),
    );

    const filteredObject: FiltersData = {};
    filteredKeys.forEach(key => {
      if (filtersData[key]) {
        filteredObject[key] = filtersData[key];
      }
    });

    if (Object.keys(filteredObject).length > 0) {
      Object.keys(filteredObject).forEach(key => {
        const value = filteredObject[key];
        pipeline.push({
          $match: {
            [key]: { $regex: value, $options: 'i' },
          },
        });
      });
    }
  }

  // Execute aggregation pipeline
  const totalData = (await Ads.aggregate(pipeline)).length;
  pipeline.push({ $sort: sortConditions });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  const results = await Ads.aggregate(pipeline);

  return {
    meta: { page, limit, total: totalData },
    data: results,
  };
};

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
