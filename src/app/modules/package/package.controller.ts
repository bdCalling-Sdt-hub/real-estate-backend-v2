import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse'; 
import { PackageService } from './package.service';

// Create package
const createPackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.createPackage(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package created successfully',
    data: result,
  });
});

// Get all package
const getAllPackages = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getAllPackages(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  });
});

// Get package by ID
const getPackageById = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.getPackageById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package retrieved successfully',
    data: result,
  });
});

// Update package
const updatePackage = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await PackageService.updatePackage(id, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package updated successfully',
    data: result,
  });
});

// Delete package
const deletePackage = catchAsync(async (req: Request, res: Response) => {
  const result = await PackageService.deletePackage(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Package deleted successfully',
    data: result,
  });
});

export const PackageController = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
