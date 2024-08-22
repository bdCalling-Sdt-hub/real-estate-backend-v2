import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { favoriteItemService } from './favoriteItem.service';
import sendResponse from '../../utils/sendResponse';
import pick from '../../utils/pick';
import { paginationFields } from '../../../constants/pagination';
import { favoriteItemFilterableFields } from './favoriteItem.constants';

const createFavoriteItem = catchAsync(async (req: Request, res: Response) => {
  req.body.user = req.user.userId;
  const result = await favoriteItemService.createFavoriteItem(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Favorite item added successfully',
    data: result,
  });
});

const getAllFavoriteItems = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteItemService.getAllFavoriteItem(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Favorite items retrieved successfully',
    data: result,
  });
});

const getFavoriteItemById = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteItemService.getFavoriteItemById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Favorite item retrieved successfully',
    data: result,
  });
});

const getMyFavoriteItems = catchAsync(async (req: Request, res: Response) => {
  req.query.user = req.user.userId;

  // const filters = pick(req.query, favoriteItemFilterableFields); 
  // const paginationOptions = pick(req.query, paginationFields);  
  const result = await favoriteItemService.getAllFavoriteItem(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'My favorite items retrieved successfully',
    data: result,
  });
});

const updateFavoriteItem = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteItemService.updateFavoriteItem(
    req.params.id,
    req.body,
  );
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Favorite item updated successfully',
    data: result,
  });
});

const deleteFavoriteItem = catchAsync(async (req: Request, res: Response) => {
  const result = await favoriteItemService.deleteFavoriteItem(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Favorite item deleted successfully',
    data: result,
  });
});

export const favoriteItemController = {
  createFavoriteItem,
  getAllFavoriteItems,
  getFavoriteItemById,
  getMyFavoriteItems,
  updateFavoriteItem,
  deleteFavoriteItem,
};
