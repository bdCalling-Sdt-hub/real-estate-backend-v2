import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { adsService } from './ads.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { uploadToS3 } from '../../utils/s3';

const createAds = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const bannerUrl = await uploadToS3({
      file: req.file,
      fileName: `images/ads/${Math.floor(100000 + Math.random() * 900000)}`,
    });

    req.body.banner = bannerUrl;
  }
  const result = await adsService.createAd(req.body, req.user.userId);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ad created successfully',
    data: result,
  });
});

const getAllAds = catchAsync(async (req: Request, res: Response) => {
  const result = await adsService.getAllAds(req.query);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'all ads found successfully',
    data: result,
  });
});

const getAdsById = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adsService.getAdsById(id);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get ads successfully!',
    data: result,
  });
});

const updateAds = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adsService.updateAd(id, req.body, req.file);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ad updated successfully',
    data: result,
  });
});

const deleteAds = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await adsService.deleteAds(id);
  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ad deleted successfully',
    data: result,
  });
});

export const adsControllers = {
  createAds,
  getAllAds,
  getAdsById,
  updateAds,
  deleteAds,
};
