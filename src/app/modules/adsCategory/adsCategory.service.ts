import httpStatus from 'http-status';
import { IAdsCategory } from './adsCategory.interface'; 
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import AdsCategory from './adsCategory.models';

const createAdsCategory = async (payload: Partial<IAdsCategory>) => {
  const category = await AdsCategory.isCategoryExist(payload.name as string);
  if (category) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category already exists');
  }

  const result = await AdsCategory.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category creation failed');
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllAdsCategories = async (query: Record<string, any>) => {
  const categoriesModel = new QueryBuilder(AdsCategory.find(), query)
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await categoriesModel.modelQuery;
  const meta = await categoriesModel.countTotal();
  return {
    data,
    meta,
  };
};

const getAdsCategoryById = async (id: string) => {
  const result = await AdsCategory.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ads Category not found');
  }
  return result;
};

const updateAdsCategory = async (id: string, payload: Partial<IAdsCategory>) => {
  const result = await AdsCategory.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ads Category update failed');
  }
  return result;
};

const deleteAdsCategory = async (id: string) => {
  const result = await AdsCategory.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Ads Category deletion failed');
  }
  return result;
};

export const categoryService = {
  deleteAdsCategory,
  updateAdsCategory,
  getAdsCategoryById,
  getAllAdsCategories,
  createAdsCategory,
};
