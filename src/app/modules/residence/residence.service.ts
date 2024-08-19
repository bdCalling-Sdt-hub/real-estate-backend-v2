/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import { IResidence } from './residence.interface';
import AppError from '../../error/AppError';
import Residence from './residence.models';
import QueryBuilder from '../../builder/QueryBuilder';
import { residenceSearchableFields } from './residence.constants';
import { deleteManyFromS3 } from '../../utils/s3';
import { calculateAverageRatingForResidence } from './residence.utils';
import { Types } from 'mongoose';
import { changeLanguage } from 'i18next';

const createResidence = async (
  payload: Partial<IResidence>,
): Promise<IResidence | null> => {

  if (!payload?.host) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized access');
  }
  
  if (!payload?.images) {
    throw new AppError(httpStatus.BAD_REQUEST, 'images is required');
  }
  const result = await Residence.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Residence creation failed');
  }
  return result;
};

//http://your-api-endpoint/residences?monthlyPrice=0-100&dailyPrice=50-200&sortByPopularity=true&searchTerm=example&sort=createdAt&page=1&limit=10&fields=propertyName,squareFeet

// eslint-disable-next-line @typescript-eslint/no-explicit-any

const getAllResidence = async (query: Record<string, any>) => {
  const allResidence: any[] = []; 
  const ResidenceModel = new QueryBuilder(
    Residence.find().populate([
      { path: 'category', select: 'name _id' },
      {
        path: 'host',
        select: 'name email image phoneNumber role verificationRequest',
      },
    ]),
    query,
  )
    .search(residenceSearchableFields)
    .filter()
    .paginate()
    .rangeFilter('perMonthPrice', query.perMonthPrice)
    .rangeFilter('perNightPrice', query.perNightPrice)
    .sort()
    .fields();

  const data = await ResidenceModel.modelQuery;
  const meta = await ResidenceModel.countTotal();

  if (data) {
    await Promise.all(
      data.map(async residence => {
        const review: any = await calculateAverageRatingForResidence(
          residence._id as Types.ObjectId,
        );
        allResidence.push({ ...residence?.toObject(), ...review });
      }),
    );
  }

  return {
    allResidence,
    meta,
  };
};

const getResidenceById = async (id: string) => {
  const result = await Residence.findById(id).populate([
    { path: 'category', select: 'name _id' },
    { path: 'host', select: 'name email image phoneNumber role' },
  ]);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Residence not found');
  }

  const avgRating = await calculateAverageRatingForResidence(
    result?._id as Types.ObjectId,
  );

  return { ...result.toObject(), avgRating };
};

const updateResidence = async (id: string, payload: Partial<IResidence>) => {
  const result = await Residence.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Residence update failed');
  }
  return result;
};

const deleteResidence = async (id: string) => {
  const result = await Residence.findByIdAndUpdate(
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
    throw new AppError(httpStatus.BAD_REQUEST, 'Residence deletion failed');
  }

  const deleteKeys: string[] = [];

  if (result?.images) {
    result?.images?.forEach(image =>
      deleteKeys.push(`images/residence/${image?.key}`),
    );
  }
  if (result?.videos) {
    result?.videos?.forEach(video =>
      deleteKeys.push(`videos/residence/${video?.key}`),
    );
  }
  if (deleteKeys.length) {
    await deleteManyFromS3(deleteKeys);
  }
  return result;
};

export const ResidenceService = {
  createResidence,
  getAllResidence,
  getResidenceById,
  updateResidence,
  deleteResidence,
};
