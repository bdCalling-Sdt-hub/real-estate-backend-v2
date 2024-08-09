/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { reviewService } from './review.service';
import sendResponse from '../../utils/sendResponse';
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';

// Create a review
const createReview = catchAsync(async (req: Request, res: Response) => {
  if (req?.files) {
    const { images } = req.files as UploadedFiles;

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/comments`,
        });
      });
      req.body.images = await uploadManyToS3(imgsArray);
    }
  }

  req.body.user = req.user.userId;
  const result = await reviewService.createReview(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Review created successfully',
    data: result,
  });
});

// Get all reviews
const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getAllReview(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Reviews retrieved successfully',
    data: result,
  });
});

// Get review by ID
const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.getReviewById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Review retrieved successfully',
    data: result,
  });
});

// Update review
const updateReview = catchAsync(async (req: Request, res: Response) => {
  if (req?.files) {
    const { images } = req.files as UploadedFiles;

    if (images?.length) {
      const imgsArray: { file: any; path: string }[] = [];

      images?.map(async image => {
        imgsArray.push({ file: image, path: `images/residence` });
      });
      req.body.images = await uploadManyToS3(imgsArray);
    }
  }

  const result = await reviewService.updateReview(req.params.id, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Review updated successfully',
    data: result,
  });
});

// Delete review
const deleteReview = catchAsync(async (req: Request, res: Response) => {
  const result = await reviewService.deleteReview(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Review deleted successfully',
    data: result,
  });
});

export const reviewController = {
  createReview,
  getAllReview,
  getReviewById,
  updateReview,
  deleteReview,
};
