import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { bookingDocumentsService } from './bookingDocuments.service';
import sendResponse from '../../utils/sendResponse';
import { uploadManyToS3 } from '../../utils/s3';
import { USER_ROLE } from '../user/user.constant';
import { UploadedFiles } from '../../interface/common.interface';

const createBookingDocuments = catchAsync(
  async (req: Request, res: Response) => {
    if (req?.files) {
      const { documents, signature } = req.files as UploadedFiles;

      if (documents?.length) {
        const documentArray: { file: any; path: string }[] = [];

        documents?.map(async (document: any) => {
          documentArray.push({ file: document, path: `images/documents` });
        });
        const documentsLinks = await uploadManyToS3(documentArray);

        if (req.user.role === USER_ROLE.landlord) {
          req.body.landlord.documents = documentsLinks;
        }

        if (req.user.role === USER_ROLE.user) {
          req.body.user.documents = documentsLinks;
        }
      }
      if (signature?.length) {
        const signatureArray: { file: any; path: string }[] = [];

        signature?.map(async (document: any) => {
          signatureArray.push({ file: document, path: `images/signature` });
        });
        const signatureLinks = await uploadManyToS3(signatureArray);

        if (req.user.role === USER_ROLE.landlord) {
          req.body.landlord.signature = signatureLinks[0]?.url;
        }

        if (req.user.role === USER_ROLE.user) {
          req.body.user.signature = signatureLinks[0]?.url;
        }
      }
    }

    // if (req.file) {
    //   const Url = await uploadToS3({
    //     file: req.file,
    //     fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
    //   });

    //   if (req.user.role === USER_ROLE.landlord) {
    //     req.body.landlord.signature = Url;
    //     req.body.landlord.signature = Url;
    //   }

    //   if (req.user.role === USER_ROLE.user) {
    //     req.body.user.signature = Url;
    //   }
    // }

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
    if (req?.files) {
      const { documents, signature } = req.files as UploadedFiles;

      if (documents?.length) {
        const documentArray: { file: any; path: string }[] = [];

        documents?.map(async (document: any) => {
          documentArray.push({ file: document, path: `images/documents` });
        });
        const documentsLinks = await uploadManyToS3(documentArray);

        if (req.user.role === USER_ROLE.landlord) {
          req.body.landlord.documents = documentsLinks;
        }

        if (req.user.role === USER_ROLE.user) {
          req.body.user.documents = documentsLinks;
        }
      }
      if (signature?.length) {
        const signatureArray: { file: any; path: string }[] = [];

        signature?.map(async (document: any) => {
          signatureArray.push({ file: document, path: `images/signature` });
        });
        const signatureLinks = await uploadManyToS3(signatureArray);

        if (req.user.role === USER_ROLE.landlord) {
          req.body.landlord.signature = signatureLinks[0]?.url;
        }

        if (req.user.role === USER_ROLE.user) {
          req.body.user.signature = signatureLinks[0]?.url;
        }
      }
    }
    // if (req.file) {
    //   const Url = await uploadToS3({
    //     file: req.file,
    //     fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
    //   });

    //   if (req.user.role === USER_ROLE.landlord) {
    //     req.body.landlord.signature = Url;
    //     req.body.landlord.signature = Url;
    //   }

    //   if (req.user.role === USER_ROLE.user) {
    //     req.body.user.signature = Url;
    //   }
    // }

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
