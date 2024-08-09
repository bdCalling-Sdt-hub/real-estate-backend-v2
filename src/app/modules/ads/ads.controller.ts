import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { adsService } from './ads.service';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { deleteFromS3, uploadToS3 } from '../../utils/s3';
import pick from '../../utils/pick';
import { paginationFields } from '../../../constants/pagination';
import { adsFilterableFields } from './ads.constants';

const createAds = catchAsync(async (req: Request, res: Response) => {
  if (req.file) {
    const bannerUrl = await uploadToS3({
      file: req.file,
      fileName: `images/ads/${req.body.property}`,
    });

    req.body.banner = bannerUrl;
  }
  const result = await adsService.createAd(req.body);

  sendResponse(req, res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'ad created successfully',
    data: result,
  });
});

const getAllAds = catchAsync(async (req: Request, res: Response) => {
   const filters = pick(req.query, adsFilterableFields);
   const paginationOptions = pick(req.query, paginationFields);
  const result = await adsService.getAllAds(filters, paginationOptions);

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
  if (result.banner) {
    await deleteFromS3(`images/ads/${result.property}`);
  }
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
