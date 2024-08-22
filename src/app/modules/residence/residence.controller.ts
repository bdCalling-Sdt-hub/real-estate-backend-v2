/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { ResidenceService } from './residence.service';
import sendResponse from '../../utils/sendResponse';
import { uploadManyToS3 } from '../../utils/s3';
import { UploadedFiles } from '../../interface/common.interface';
import { USER_ROLE } from '../user/user.constant';

const createResidence = catchAsync(async (req: Request, res: Response) => { 

  if(req.user.role !== USER_ROLE.admin){
    req.body.host = req.user?.userId;
  }
  
  if (req?.files) {
    const { images, videos } = req.files as UploadedFiles;

    if (images?.length) {
      const imgsArray: { file: any; path: string; key?: string }[] = [];

      images?.map(async image => {
        imgsArray.push({
          file: image,
          path: `images/residence`,
        });
      });
      req.body.images = await uploadManyToS3(imgsArray);
    }

    if (videos?.length) {
      const videoArray: { file: any; path: string }[] = [];

      videos?.map(async image => {
        videoArray.push({ file: image, path: `videos/residence` });
      });
      req.body.videos = await uploadManyToS3(videoArray);
    }
  }

  const result = await ResidenceService.createResidence(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Residence created successfully',
    data: result,
  });
  

});

const getAllResidence = catchAsync(async (req: Request, res: Response) => { 
  const result = await ResidenceService.getAllResidence(req.query); 
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'All residences retrieved successfully',
    data: result,
  });
});

const getResidenceById = catchAsync(async (req: Request, res: Response) => {
  const result = await ResidenceService.getResidenceById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Residence retrieved successfully',
    data: result,
  });
});

const updateResidence = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;

  if (req?.files) {
    const { images, videos } = req.files as UploadedFiles;

    if (images?.length) {
      const imgsArray: { file: any; path: string }[] = [];

      images?.map(async image => {
        imgsArray.push({ file: image, path: `images/residence` });
      });
      req.body.images = await uploadManyToS3(imgsArray);
    }

    if (videos?.length) {
      const videoArray: { file: any; path: string }[] = [];

      videos?.map(async image => {
        videoArray.push({ file: image, path: `videos/residence` });
      });
      req.body.videos = await uploadManyToS3(videoArray);
    }
  }

  const result = await ResidenceService.updateResidence(id, req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Residence updated successfully',
    data: result,
  });
});

const deleteResidence = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await ResidenceService.deleteResidence(id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Residence deleted successfully',
    data: result,
  });
});

export const residenceController = {
  createResidence,
  getAllResidence,
  getResidenceById,
  updateResidence,
  deleteResidence,
};
