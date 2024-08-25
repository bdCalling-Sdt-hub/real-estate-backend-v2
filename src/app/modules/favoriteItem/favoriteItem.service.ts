import httpStatus from 'http-status';
import { IFavoriteItem } from './favoriteItem.interface';
import FavoriteItem from './favoriteItem.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { calculateAverageRatingForResidence } from '../residence/residence.utils';
import { SortOrder, Types } from 'mongoose';
import { IFilter, IPaginationOption } from '../ads/ads.interface';
import { paginationHelper } from '../../helpers/pagination.helpers';
import { favoriteItemSearchableFields } from './favoriteItem.constants';

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
          items?.residence?._id,
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

const getMyFavoriteItems = async (
  filters: IFilter, 
) => {
  const { searchTerm, user, ...filtersData } = filters;
  const andCondition = [];

  if (searchTerm) {
    andCondition.push({
      $or: favoriteItemSearchableFields.map(field => ({
        $regexMatch: {
          input: `$${field}`, 
          regex: searchTerm,
          options: 'i',
        },
      })),
    });
  }

  if (Object.entries(filtersData).length) {
    let userId = [{ $eq: ['$_id', '$$id'] }];
    const addition = Object.entries(filtersData)?.map(([field, value]) => ({
      $eq: [`$${field}`, `${value}`],
    }));
    const newArray = [...userId, ...addition];
    andCondition.push({
      $and: newArray,
    });
  } 
  
  // Aggregation pipeline
  const result = await FavoriteItem.aggregate([
    { $match: { user: new Types.ObjectId(user) } },
    {
      $lookup: {
        from: 'residences',
        let: { id: '$residence' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: andCondition,
              },
            },
          },
        ],
        as: 'residenceDate',
      },
    },
  ]); 
  const filterData = result.filter(data => data.residenceDate.length > 0);
 
  const allFavoriteItems = await Promise.all(
    filterData.map(async items => {
      const avgRating = await calculateAverageRatingForResidence(
        items.residence._id,
      );
      return { ...items, avgRating };
    }),
  );

  return allFavoriteItems;
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
  const result = await FavoriteItem.deleteOne({ residence: id });
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
