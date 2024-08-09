import httpStatus from 'http-status';
import { ICategory } from './category.interface';
import Category from './category.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';

const createCategory = async (payload: Partial<ICategory>) => {
  const category = await Category.isCategoryExist(payload.name as string);
  if (category) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category already exists');
  }

  const result = await Category.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category creation failed');
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllCategories = async (query: Record<string, any>) => {
  const categoriesModel = new QueryBuilder(Category.find(), query)
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

const getCategoryById = async (id: string) => {
  const result = await Category.findById(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category not found');
  }
  return result;
};

const updateCategory = async (id: string, payload: Partial<ICategory>) => {
  const result = await Category.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category update failed');
  }
  return result;
};

const deleteCategory = async (id: string) => {
  const result = await Category.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Category deletion failed');
  }
  return result;
};

export const categoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
