import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from './adsCategory.service';
import sendResponse from '../../utils/sendResponse';

const createAdsCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createAdsCategory(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Ads Category created successfully',
    data: result,
  });
});

const getAllAdsCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllAdsCategories(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Ads Categories retrieved successfully',
    data: result,
  });
});

const getAdsCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAdsCategoryById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Ads Category retrieved successfully',
    data: result,
  });
});

const updateAdsCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.updateAdsCategory(
    req.params.id,
    req.body,
  );
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Ads Category updated successfully',
    data: result,
  });
});

const deleteAdsCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteAdsCategory(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Ads Category deleted successfully',
    data: result,
  });
});

export const categoryController = {
  createAdsCategory,
  getAllAdsCategories,
  getAdsCategoryById,
  updateAdsCategory,
  deleteAdsCategory,
};
