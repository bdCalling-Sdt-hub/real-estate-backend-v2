import httpStatus from 'http-status';
import { IBookingDocuments } from './bookingDocuments.interface';
import BookingDocuments from './bookingDocuments.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { Types } from 'mongoose';

const createBookingDocuments = async (payload: IBookingDocuments) => {
  const result = await BookingDocuments.create(payload);

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create booking documents',
    );
  }

  return result;
};


const getAllBookingDocuments = async (query:Record<string, any>) => {
 const bookingModel = new QueryBuilder(BookingDocuments.find(), query)
   .search(['booking'])
   .filter()
   .paginate()
   .sort()
   .fields();

 const data = await bookingModel.modelQuery;
 const meta = await bookingModel.countTotal();
 return {
   data,
   meta,
 };
};

const getBookingDocumentsById = async (_id:string) => {
  const result = await BookingDocuments.findById(_id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Booking documents not found');
  }
  return result;
};


const updateBookingDocuments = async (id:string,payload:Partial<IBookingDocuments>) => {
  const result = await BookingDocuments.findOneAndUpdate({booking: new Types.ObjectId(id)}, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Booking documents not found');
  }
  return result;
};
const deleteBookingDocuments = async (id:string) => {
  const result = await BookingDocuments.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Booking documents not found');
  }
  return result;
};

export const bookingDocumentsService = {
  createBookingDocuments,
  getAllBookingDocuments,
  getBookingDocumentsById,
  updateBookingDocuments,
  deleteBookingDocuments,
};
