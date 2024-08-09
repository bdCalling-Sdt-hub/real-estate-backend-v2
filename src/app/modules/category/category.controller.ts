import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { categoryService } from './category.service';
import sendResponse from '../../utils/sendResponse';

const createCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.createCategory(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Category created successfully',
    data: result,
  });
});

const getAllCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getAllCategories(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Categories retrieved successfully',
    data: result,
  });
});

const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.getCategoryById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Category retrieved successfully',
    data: result,
  });
});

const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.updateCategory(req.params.id, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Category updated successfully',
    data: result,
  });
});

const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const result = await categoryService.deleteCategory(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Category deleted successfully',
    data: result,
  });
});

export const categoryController = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
