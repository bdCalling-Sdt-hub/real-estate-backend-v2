/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { maintenanceRequestService } from './maintenanceRequest.service';
import sendResponse from '../../utils/sendResponse'; 
import { UploadedFiles } from '../../interface/common.interface';
import { uploadManyToS3 } from '../../utils/s3';

const createMaintenanceRequest = catchAsync(async (req: Request, res: Response) => {
    if (req?.files) {
      const { images } = req.files as UploadedFiles;

      if (images?.length) {
        const imgsArray: { file: any; path: string; key?: string }[] = [];

        images?.map(async (image:any) => {
          imgsArray.push({
            file: image,
            path: `images/maintenance-request`,
          });
        });
        req.body.images = await uploadManyToS3(imgsArray);
      }

     
    }


  req.body.user=req.user.userId; 
  const result = await maintenanceRequestService.createMaintenanceRequest(req.body);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request created successfully',
    data: result,
  })
});

const getAllMaintenanceRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await maintenanceRequestService.getAllMaintenanceRequest(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request get successfully',
    data: result,
  })
});

const getMaintenanceRequestById = catchAsync(async (req: Request, res: Response) => {
  const result = await maintenanceRequestService.getMaintenanceRequestById(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request get successfully',
    data: result,
  })
});

const acceptMaintenanceRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await maintenanceRequestService.AcceptMaintenanceRequest(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request accepted successfully',
    data: result,
  })
});

const cancelMaintenanceRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await maintenanceRequestService.cancelMaintenanceRequest(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request canceled successfully',
    data: result,
  })
});

const deleteMaintenanceRequest = catchAsync(async (req: Request, res: Response) => {
  const result = await maintenanceRequestService.deleteMaintenanceRequest(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Maintenance request deleted successfully',
    data: result,
  })
});

export const maintenanceRequestController = {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  getMaintenanceRequestById,
  acceptMaintenanceRequest,
  cancelMaintenanceRequest,
  deleteMaintenanceRequest,
};