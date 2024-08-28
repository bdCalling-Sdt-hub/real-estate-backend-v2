import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bookingDocumentsService } from './bookingDocuments.service';
import sendResponse from '../../utils/sendResponse';
import { uploadToS3 } from '../../utils/s3';
import { USER_ROLE } from '../user/user.constant';

const createBookingDocuments = catchAsync(
  async (req: Request, res: Response) => {
    if (req.file) {
      const Url = await uploadToS3({
        file: req.file,
        fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      if (req.user.role === USER_ROLE.landlord) {
        req.body.landlord.signature = Url;
        req.body.landlord.signature = Url;
      }

      if (req.user.role === USER_ROLE.user) {
        req.body.user.signature = Url;
      }
    }

    const result = await bookingDocumentsService.createBookingDocuments(
      req.body,
    );

    sendResponse(req, res, {
      success: true,
      statusCode: 200,
      message: 'Booking documents created successfully.',
      data: result,
    });
  },
);

const getAllBookingDocuments = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingDocumentsService.getAllBookingDocuments(
      req.query,
    );

    sendResponse(req, res, {
      success: true,
      statusCode: 200,
      message: 'Booking documents retrieved successfully.',
      data: result,
    });
  },
);

const getBookingDocumentsById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await bookingDocumentsService.getBookingDocumentsById(
      req.params.id,
    );

    sendResponse(req, res, {
      success: true,
      statusCode: 200,
      message: 'Booking documents retrieved successfully.',
      data: result,
    });
  },
);

const updateBookingDocuments = catchAsync(
  async (req: Request, res: Response) => {
    if (req.file) {
      const Url = await uploadToS3({
        file: req.file,
        fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
      });

      if (req.user.role === USER_ROLE.landlord) {
        req.body.landlord.signature = Url;
        req.body.landlord.signature = Url;
      }

      if (req.user.role === USER_ROLE.user) {
        req.body.user.signature = Url;
      }
    }

    const result = await bookingDocumentsService.updateBookingDocuments(
      req.params.bookingId,
      req.body,
    );

    sendResponse(req, res, {
      success: true,
      statusCode: 200,
      message: 'Booking documents add successfully.',
      data: result,
    });
  },
);

const deleteBookingDocuments = catchAsync(
  async (req: Request, res: Response) => {},
);

export const bookingDocumentsController = {
  createBookingDocuments,
  getAllBookingDocuments,
  getBookingDocumentsById,
  updateBookingDocuments,
  deleteBookingDocuments,
};
