/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import Handlebars from 'handlebars';
import httpStatus from 'http-status';
import moment from 'moment';
import path from 'path';
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
import { formatAddress } from './bookingResidence';
import { IBookingResidence } from './bookingResidence.interface';
import BookingResidence from './bookingResidence.models';
const createBookingResidence = async (
  payload: IBookingResidence,
): Promise<IBookingResidence> => {
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

const generateContractPdf = async (bookingId: string) => {
  try {
    // Simulate fetching data (replace this with actual database call)
    const oneBooking = await BookingResidence.findOne({ _id: bookingId });
    console.log(oneBooking);
    const booking: any = await BookingResidence.findById(bookingId).populate(
      'author residence user',
    );

    const contract = await BookingDocuments.findOne({ booking: bookingId });
    const result = {
      contractId: booking?.contractId,
      signatureDate: moment(booking?.createdAt).format('YYYY-MM-DD'),
      startDate: moment(booking?.startDate).format('YYYY-MM-DD'),
      endDate: moment(booking?.endDate).format('YYYY-MM-DD'),
      landlordName: booking?.author?.nameArabic,
      // landorldId: booking?.author,
      landlordPhone: booking?.author?.phoneNumber,
      landlordNationality: booking?.author?.nationality,
      tenantId: contract?.user?.civilId,
      landlordId: contract?.landlord?.civilId,
      tenatName: booking?.user?.nameArabic,
      tenantPhone: booking?.user?.phoneNumber,
      // tenantId: booking?.tenantId,
      tenantNationality: booking?.user?.nationality,
      propertyType: booking?.residence?.residenceType,
      address: formatAddress(booking?.residence?.address),
      amount: booking?.totalPrice,
      tenantSignature: contract?.user?.signature,
      landlordSignature: contract?.landlord?.signature,
      deposite: booking?.address?.deposit,
    };

    // Read HTML template
    const templatePath = path.join(__dirname, '../../../../index.html'); // Adjust as per your folder structure
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Compile HTML using Handlebars
    const template = Handlebars.compile(htmlTemplate);
    const renderedHtml = template(result);

    // Launch Puppeteer and take a screenshot
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set a custom viewport size to increase the width
    await page.setViewport({
      width: 1200, // Set the desired width (increase as needed)
      height: 800, // Set a suitable height (it will scroll if the content is larger)
    });

    await page.setContent(renderedHtml, { waitUntil: 'networkidle0' });

    // Take a full-page screenshot
    const screenshotBuffer = await page.screenshot({ fullPage: true });

    await browser.close();

    // Construct the S3 upload params
    const fileName = `images/contract-${bookingId}.png`; // Customize the file path for S3
    const file = {
      file: screenshotBuffer, // The image buffer
      fileName, // The S3 file path
    };

    // Upload the image to S3 using the utility function
    const s3Url = await uploadToS3(file);

    return s3Url; // Return the S3 URL after uploading the image
  } catch (error) {
    console.error('Error generating and uploading image:', error);
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
