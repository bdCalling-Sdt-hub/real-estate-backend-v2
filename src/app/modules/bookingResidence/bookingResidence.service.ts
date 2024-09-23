/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import Handlebars from 'handlebars';
import httpStatus from 'http-status';
import moment from 'moment';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import puppeteer from 'puppeteer';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/AppError';
import { uploadToS3 } from '../../utils/s3';
import BookingDocuments from '../bookingDocuments/bookingDocuments.models';
import { notificationServices } from '../notification/notification.service';
import { IResidence } from '../residence/residence.interface';
import Residence from '../residence/residence.models';
import Review from '../review/review.models';
import { User } from '../user/user.model';
import { generateRandomString } from '../user/user.utils';
import { formatAddress } from './bookingResidence';
import { IBookingResidence } from './bookingResidence.interface';
import BookingResidence from './bookingResidence.models';
const createBookingResidence = async (
  payload: IBookingResidence,
): Promise<IBookingResidence> => {
  payload.contractId = await generateRandomString(8);
  const residence: IResidence | null = await Residence.findById(
    payload.residence,
  );
  // .populate(['host', 'residence']);
  if (!residence) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Residence not found');
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  payload.author = residence?.host?._id;
  const result: IBookingResidence | null =
    await BookingResidence.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'BookingResidence creation failed',
    );
  }

  const user = await User.findById(payload?.user);

  await notificationServices?.insertNotificationIntoDb({
    receiver: result?.author,
    refference: result?._id,
    model_type: 'BookingResidence', // or 'Residence'
    message: 'You Have a new Booking Request',
    description: `${user?.email} sent you a Booking request do action for it`,
  });
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllBookingResidence = async (query: Record<string, any>) => {
  const bookingResidenceModel = new QueryBuilder(
    BookingResidence.find().populate([
      {
        path: 'residence',
        populate: [
          {
            path: 'host',
            select:
              '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
          },
        ],
      },
      // { path: 'author', select: 'name email _id username phoneNumber image' },
      {
        path: 'user',
        select:
          '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
      },
    ]),
    query,
  )
    .search(['name'])
    .filter()
    .populateFields('residence')
    .paginate()
    .sort()
    .fields();

  const data = await bookingResidenceModel.modelQuery;
  const meta = await bookingResidenceModel.countTotal();
  return {
    data,
    meta,
  };
};

const myBookings = async (query: Record<string, any>) => {
  const bookingsModel = new QueryBuilder(
    BookingResidence.find().populate([
      {
        path: 'residence',
      },
      {
        path: 'author',
        select:
          '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
      },
    ]),
    query,
  )
    .search(['name'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const bookings = await bookingsModel.modelQuery;
  const meta = await bookingsModel.countTotal();
  const residenceIds = bookings.map((booking: any) => booking?.residence?._id);

  // Calculate average ratings for each residence
  const ratings = await Review.aggregate([
    { $match: { residence: { $in: residenceIds }, isDeleted: { $ne: true } } },
    {
      $group: {
        _id: '$residence',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  // Map ratings to residences in the bookings
  const ratingsMap = ratings.reduce((acc, curr) => {
    acc[curr._id.toString()] = curr.averageRating;
    return acc;
  }, {});

  const enrichedBookings = bookings.map((booking: any) => {
    const residence: any = booking.residence;
    const averageRating = ratingsMap[residence._id.toString()] || 0;
    return { ...booking.toObject(), averageRating };
  });

  return { enrichedBookings, meta };
};

//get booking residence
const getBookingResidenceById = async (
  id: string,
): Promise<IBookingResidence> => {
  const result = await BookingResidence.findById(id).populate(
    'author residence user',
  );
  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'oops! this residence was not found',
    );
  }
  return result;
};

const approvedBooking = async (id: string) => {
  const result = await BookingResidence.findByIdAndUpdate(
    id,
    {
      status: 'approved',
    },
    { new: true },
  );

  // {
  //   guest: { child: 2, adult: 1 },
  //   _id: new ObjectId('66c17ff97ac39461c5aae1c7'),
  //   user: new ObjectId('66bc3a47b39842d46f1eef7d'),
  //   residence: new ObjectId('66b49d136e97ef48d41c5670'),
  //   startDate: 2024-08-01T00:00:00.000Z,
  //   endDate: 2024-08-07T00:00:00.000Z,
  //   totalPrice: 500,
  //   author: new ObjectId('66b467b0a606dbaac03a9101'),
  //   discount: 10,
  //   status: 'approved',
  //   isPaid: false,
  //   isDeleted: false,
  //   createdAt: 2024-08-18T05:00:41.867Z,
  //   updatedAt: 2024-08-19T06:46:43.431Z,
  //   __v: 0
  // }

  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Residence Booking approving failed',
    );
  }
  // await messagesService.createMessages({
  //   text: 'To proceed with your booking, please pay the service fee of 10 KWD. Once the payment is made, you will receive the booking payment link.',
  //   sender: result.author,
  //   receiver: result?.user,
  //   //@ts-ignore
  //   bookingId: result?._id,
  //   showButton: true,
  // });

  await notificationServices?.insertNotificationIntoDb({
    receiver: result?.user,
    refference: result?._id,
    model_type: 'BookingResidence', // or 'Residence'
    message: 'You Booking is approved',
    description: `Your booking request has been approved by the residence author`,
  });

  return result;
};

const canceledBooking = async (id: string) => {
  const result = await BookingResidence.findByIdAndUpdate(
    id,
    {
      $set: {
        status: 'canceled',
      },
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Residence Booking canceling failed',
    );
  }
  await notificationServices?.insertNotificationIntoDb({
    receiver: result?.user,
    refference: result?._id,
    model_type: 'BookingResidence', // or 'Residence'
    message: 'You Booking is canceled',
    description: `Your booking request has been approved by the residence author`,
  });
  return result;
};

const deleteBookingResidence = async (
  id: string,
): Promise<IBookingResidence> => {
  const result = await BookingResidence.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'resident booking deletion failed',
    );
  }
  return result;
};

// get contract details
// Ensure puppeteer is required

const generateContractPdf = async (bookingId: string) => {
  try {
    // Fetch booking and contract data
    const booking: any = await BookingResidence.findById(bookingId)
      .select('contractId author residence user startDate endDate createdAt')
      .populate('author residence user');

    if (!booking) throw new Error(`Booking with ID ${bookingId} not found`);

    const contract = await BookingDocuments.findOne({ booking: bookingId });
    if (!contract)
      throw new Error(`Contract for booking ${bookingId} not found`);

    // Prepare the result object
    const result = {
      contractId: booking.contractId,
      signatureDate: moment(booking.createdAt).format('YYYY-MM-DD'),
      startDate: moment(booking.startDate).format('YYYY-MM-DD'),
      endDate: moment(booking.endDate).format('YYYY-MM-DD'),
      landlordName: booking.author.nameArabic,
      landlordPhone: booking.author.phoneNumber,
      landlordNationality: booking.author.nationality,
      tenantId: contract.user.civilId,
      landlordId: contract.landlord.civilId,
      tenantName: booking.user.nameArabic,
      tenantPhone: booking.user.phoneNumber,
      tenantNationality: booking.user.nationality,
      propertyType: booking.residence.residenceType,
      address: formatAddress(booking.residence.address),
      amount: booking.totalPrice,
      tenantSignature: contract.user.signature,
      landlordSignature: contract.landlord.signature,
      deposit: booking.residence.deposit,
    };

    // Read HTML template and compile with Handlebars
    const templatePath = path.join(__dirname, '../../../../index.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    const template = Handlebars.compile(htmlTemplate);
    const renderedHtml = template(result);

    // Launch Puppeteer in headless mode
    const browser = await puppeteer.launch({
      headless: true, // Ensure that Puppeteer runs in headless mode
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // Add these for compatibility on some Linux servers
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1550, height: 1600 }); // Adjusted height for better aspect ratio
    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Capture a screenshot of the rendered HTML without extra margins
    const screenshotBuffer = await page.screenshot({
      fullPage: true,
      omitBackground: true, // Removes background color
    });
    await browser.close();

    // Get the image dimensions to fit into the PDF correctly
    const pdfDoc = await PDFDocument.create();

    // Get image dimensions from the screenshot
    const image = await pdfDoc.embedPng(screenshotBuffer);
    const imageWidth = image.width;
    const imageHeight = image.height;

    // Create a PDF page that matches the image dimensions, with no extra margins
    const page1 = pdfDoc.addPage([imageWidth, imageHeight]);

    // Draw the image on the PDF page without any margins
    page1.drawImage(image, {
      x: 0, // Start at the very edge of the PDF page
      y: 0, // Start at the bottom
      width: imageWidth, // Match the image width to the page
      height: imageHeight, // Match the image height to the page
    });

    const pdfBytes = await pdfDoc.save();

    // Upload the PDF to S3
    const fileName = `contracts/contract-${bookingId}.pdf`;
    const file = { file: pdfBytes, fileName };
    const s3Url = await uploadToS3(file);

    return s3Url; // Return the S3 URL for the PDF
  } catch (error) {
    console.error('Error generating and uploading PDF:', error);
    throw error;
  }
};

// Express route to handle the request

export const BookingResidenceService = {
  createBookingResidence,
  getAllBookingResidence,
  getBookingResidenceById,
  myBookings,
  approvedBooking,
  canceledBooking,
  deleteBookingResidence,
  generateContractPdf,
};
