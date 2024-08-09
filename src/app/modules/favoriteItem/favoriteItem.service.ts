import httpStatus from 'http-status';
import { IFavoriteItem } from './favoriteItem.interface';
import FavoriteItem from './favoriteItem.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { calculateAverageRatingForResidence } from '../residence/residence.utils';
import { Types } from 'mongoose';

const createFavoriteItem = async (payload: IFavoriteItem) => {
  const isExist = await FavoriteItem.findOne({
    $and: [{ user: payload?.user }, { residence: payload?.residence }],
  });
  if (isExist) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Favorite item already exists');
  }

  const result = await FavoriteItem.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Favorite item creation failed');
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllFavoriteItem = async (query: Record<string, any>) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allFavoriteItems: any[] = [];
  const favoriteItemModel = new QueryBuilder(
    FavoriteItem.find().populate(['residence', 'user']),
    query,
  )
    .search([])
    .filter()
    .paginate()
    .sort();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await favoriteItemModel.modelQuery;
  const meta = await favoriteItemModel.countTotal();

  
  if (data) {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data.map(async (items: any) => {
        const avgRating = await calculateAverageRatingForResidence(
          items?.residence?._id as Types.ObjectId,
        );
        allFavoriteItems.push({ ...items?.toObject(), avgRating }); // Use toObject() to get a plain object
      }),
    );
  }
  return {
    allFavoriteItems,
    meta,
  };
};

const getFavoriteItemById = async (id: string) => {
  const result = await FavoriteItem.findById(id).populate([
    'residence',
    'user',
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Favorite item not found');
  }
  return result;
};

const getMyFavoriteItems = async (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const myFavoriteItems: any[] = [];
  const result = await FavoriteItem.find({ user: userId }).populate([
    'residence',
    'user',
  ]);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Favorite item not found');
  }
  if (result) {
    await Promise.all(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.map(async (items: any) => {
        const avgRating = await calculateAverageRatingForResidence(
          items?.residence?._id as Types.ObjectId,
        );
        myFavoriteItems.push({ ...items?.toObject(), avgRating }); // Use toObject() to get a plain object
      }),
    );
  }
  return myFavoriteItems;
};

const updateFavoriteItem = async (
  id: string,
  payload: Partial<IFavoriteItem>,
) => {
  const result = await FavoriteItem.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Favorite item update failed');
  }
  return result;
};

const deleteFavoriteItem = async (id: string) => {
  const result = await FavoriteItem.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Favorite item deletion failed');
  }
  return result;
};

export const favoriteItemService = {
  createFavoriteItem,
  getAllFavoriteItem,
  getFavoriteItemById,
  getMyFavoriteItems,
  updateFavoriteItem,
  deleteFavoriteItem,
};
