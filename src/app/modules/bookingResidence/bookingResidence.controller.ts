import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { BookingResidenceService } from './bookingResidence.service';

const createBookingResidence = catchAsync(
  async (req: Request, res: Response) => {
    req.body.user = req.user?.userId;
    const result = await BookingResidenceService.createBookingResidence(
      req.body,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Residence booked successfully',
      data: result,
    });
  },
);

const getAllBookingResidence = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingResidenceService.getAllBookingResidence(
      req.query,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'All booking residences retrieved successfully',
      data: result,
    });
  },
);

const myBookings = catchAsync(async (req: Request, res: Response) => {
  req.query.user = req.user?.userId;

  const result = await BookingResidenceService.myBookings(req.query);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'All my booking residences retrieved successfully',
    data: result,
  });
});

const getBookingResidenceById = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingResidenceService.getBookingResidenceById(
      req.params.id,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Booking residence retrieved successfully',
      data: result,
    });
  },
);

const canceledBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingResidenceService.canceledBooking(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'residence booking  canceled successfully',
    data: result,
  });
});

const approvedBooking = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingResidenceService.approvedBooking(req.params.id);
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'residence booking  approved successfully',
    data: result,
  });
});
const deleteBookingResidence = catchAsync(
  async (req: Request, res: Response) => {
    const result = await BookingResidenceService.deleteBookingResidence(
      req.params.id,
    );
    sendResponse(req, res, {
      statusCode: 200,
      success: true,
      message: 'Booking residence deleted successfully',
      data: result,
    });
  },
);
const generateContractPdf = catchAsync(async (req: Request, res: Response) => {
  const result = await BookingResidenceService.generateContractPdf(
    req.params.id,
  );
  sendResponse(req, res, {
    statusCode: 200,
    success: true,
    message: 'Booking residence deleted successfully',
    data: result,
  });
});

export const BookingResidenceController = {
  createBookingResidence,
  getAllBookingResidence,
  getBookingResidenceById,
  myBookings,
  canceledBooking,
  approvedBooking,
  deleteBookingResidence,
  generateContractPdf,
};
