// import httpStatus from 'http-status';
// import config from '../../config';
// import AppError from '../../error/AppError';
// import { paymentTypes } from './payments.constants';
// import Ads from '../ads/ads.models';
// import BookingResidence from '../bookingResidence/bookingResidence.models';
// import { User } from '../user/user.model';
// import { IBookingResidence } from '../bookingResidence/bookingResidence.interface';
// import { IAds } from '../ads/ads.interface';
// import Subscription from '../subscriptions/subscriptions.models';
// import { ISubscription } from '../subscriptions/subscriptions.interface';
// import { IPackage } from '../package/package.interface';

// export const getUserTokenFromUPayment = async () => {
//   const uniqueToken = Math.floor(100000 + Math.random() * 900000) + Date.now();
//   const res = await fetch(
//     'https://sandboxapi.upayments.com/api/v1/create-customer-unique-token',
//     {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Accept: 'application/json',
//         Authorization: `Bearer ${config.payment?.payment_token}`,
//       },
//       body: JSON.stringify({
//         customerUniqueToken: uniqueToken,
//       }),
//     },
//   );

//   const data = await res.json();
//   if (!data) {
//     throw new AppError(
//       httpStatus.BAD_REQUEST,
//       'Customer unique token creation failed',
//     );
//   }
//   return data;
// };

// interface Order {
//   id: string;
//   description: string;
//   currency: string;
//   amount: number;
// }

// interface PaymentPayload {
//   user: string;
//   paymentType: string;
//   bookingId: string;
// }

// export const getPaymentConfig = async (payload: PaymentPayload) => {
//   const tranId =
//     Math.floor(100000 + Math.random() * 900000) + Date.now().toString();
//   const user = await User.findById(payload.user);

//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, 'User not found');
//   }

//   let order: Order | null = null;

//   switch (payload.paymentType) {
//     case paymentTypes.Booking_Residence:
//       const residenceBooking: IBookingResidence | null =
//         await BookingResidence.findById(payload.bookingId);
//       if (!residenceBooking) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Residence booking not found');
//       }
//       order = {
//         id: residenceBooking._id as string,
//         description: 'Residence Booking',
//         currency: 'KWD',
//         amount: 10,
//       };
//       break;

//     case paymentTypes.Subscription_Booking:
//       const subscription: ISubscription | null = await Subscription.findById(
//         payload.bookingId,
//       ).populate('package');

//       if (!subscription) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
//       }

//       order = {
//         id: subscription._id as string,
//         description: 'Subscription Booking', // Add appropriate description if needed
//         currency: 'KWD',
//         amount: (subscription?.package as IPackage)?.price as number,
//       };
//       break;

//     case paymentTypes.Ads:
//       const ads: IAds | null = await Ads.findById(payload.bookingId);
//       if (!ads) {
//         throw new AppError(httpStatus.NOT_FOUND, 'Ads booking not found');
//       }
//       order = {
//         id: ads._id as string,
//         description: 'Ads Booking',
//         currency: 'KWD',
//         amount: ads.price as number,
//       };
//       break;

//     default:
//       throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment type');
//   }

//   return {
//     language: 'en',
//     reference: {
//       id: tranId,
//     },
//     customer: {
//       uniqueId: user._id,
//       name: user.name,
//       email: user.email,
//     },
//     returnUrl: config.payment?.returnUrl,
//     cancelUrl: config.payment?.cancelUrl,
//     notificationUrl: config.payment?.notificationUrl,
//     customerExtraData: tranId,
//     order,
//   };
// };

/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../error/AppError';
import { paymentTypes } from './payments.constants';
import Ads from '../ads/ads.models';
import BookingResidence from '../bookingResidence/bookingResidence.models';
import { User } from '../user/user.model';
import { IBookingResidence } from '../bookingResidence/bookingResidence.interface';
import { IAds } from '../ads/ads.interface';
// import { ISubscription } from '../subscriptions/subscriptions.interface';
import Subscription from '../subscriptions/subscriptions.models';

export const getUserTokenFromUPayment = async () => {
  const uniqueToken = Math.floor(100000 + Math.random() * 900000) + Date.now();
  const res = await fetch(
    'https://sandboxapi.upayments.com/api/v1/create-customer-unique-token',
    {
      method: 'POST', // Specify the method
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${config?.payment?.payment_token}`,
      },
      body: JSON.stringify({
        customerUniqueToken: uniqueToken,
      }), // Convert the body to a JSON string
    },
  );

  const data = await res.json();
  if (!data) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'customer-unique-token creation failed',
    );
  }
  return data;
};

interface Order {
  id: string;
  description: string;
  currency: string;
  amount: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPaymentConfig = async (payload: any) => {
  const tranId =
    Math.floor(100000 + Math.random() * 900000) + Date.now().toString();
  const user = await User.findById(payload.user);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  let order: Order | null = null;

  switch (payload.paymentType) {
    case paymentTypes.Booking_Residence:
      // eslint-disable-next-line no-case-declarations
      const residenceBooking: IBookingResidence | null =
        await BookingResidence.findById(payload.bookingId);
      if (!residenceBooking) {
        throw new AppError(httpStatus.NOT_FOUND, 'Residence booking not found');
      }
      order = {
        id: residenceBooking._id as string,
        description: '', // Add appropriate description if needed
        currency: 'KWD',
        amount: 10,
      };
      break;

    case paymentTypes.Subscription_Booking:
      // eslint-disable-next-line no-case-declarations
      const subscription: any = await Subscription.findById(
        payload.bookingId,
      ).populate('package');
      if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
      }

      order = {
        id: subscription?._id as string,
        description: '', // Add appropriate description if needed
        currency: 'KWD',
        amount: parseInt(subscription?.package?.price?.toString()),
      };
      break;

    // case paymentTypes.Ads:
    //   // eslint-disable-next-line no-case-declarations
    //   const ads: IAds | null = await Ads.findById(payload.bookingId);
    //   if (!ads) {
    //     throw new AppError(httpStatus.NOT_FOUND, 'Ads booking not found');
    //   }
    //   order = {
    //     id: ads._id as string,
    //     description: '', // Add appropriate description if needed
    //     currency: 'KWD',
    //     amount: ads.price as number,
    //   };
    //   break;

    default:
      throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment type');
  }

  return {
    language: 'en',
    reference: {
      id: tranId,
    },
    customer: {
      uniqueId: user._id,
      name: user.name,
      email: user.email,
    },
    returnUrl: `${config?.server_url}payments/return`,
    cancelUrl:
      'https://docs.stripe.com/payments/quickstart?lang=node#use-webhook',
    notificationUrl: `${config?.server_url}/payments/webhooks`,
    // 'https://www.linkedin.com/feed/?highlightedUpdateType=SHARED_BY_YOUR_NETWORK&highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7215661277094756352',
    customerExtraData: tranId,
    order, // Added the order object to the return object for completeness
  };
};
