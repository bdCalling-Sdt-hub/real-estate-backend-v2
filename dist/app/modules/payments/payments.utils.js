"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentConfig = exports.getUserTokenFromUPayment = void 0;
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
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const payments_constants_1 = require("./payments.constants");
const bookingResidence_models_1 = __importDefault(require("../bookingResidence/bookingResidence.models"));
const user_model_1 = require("../user/user.model");
// import { ISubscription } from '../subscriptions/subscriptions.interface';
const subscriptions_models_1 = __importDefault(require("../subscriptions/subscriptions.models"));
const getUserTokenFromUPayment = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const uniqueToken = Math.floor(100000 + Math.random() * 900000) + Date.now();
    const res = yield fetch('https://sandboxapi.upayments.com/api/v1/create-customer-unique-token', {
        method: 'POST', // Specify the method
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${(_a = config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.payment) === null || _a === void 0 ? void 0 : _a.payment_token}`,
        },
        body: JSON.stringify({
            customerUniqueToken: uniqueToken,
        }), // Convert the body to a JSON string
    });
    const data = yield res.json();
    if (!data) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'customer-unique-token creation failed');
    }
    return data;
});
exports.getUserTokenFromUPayment = getUserTokenFromUPayment;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPaymentConfig = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    const tranId = Math.floor(100000 + Math.random() * 900000) + Date.now().toString();
    const user = yield user_model_1.User.findById(payload.user);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    let order = null;
    switch (payload.paymentType) {
        case payments_constants_1.paymentTypes.Booking_Residence:
            // eslint-disable-next-line no-case-declarations
            const residenceBooking = yield bookingResidence_models_1.default.findById(payload.bookingId);
            if (!residenceBooking) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Residence booking not found');
            }
            order = {
                id: residenceBooking._id,
                description: '', // Add appropriate description if needed
                currency: 'KWD',
                amount: 10,
            };
            break;
        case payments_constants_1.paymentTypes.Subscription_Booking:
            // eslint-disable-next-line no-case-declarations
            const subscription = yield subscriptions_models_1.default.findById(payload.bookingId).populate('package');
            if (!subscription) {
                throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
            }
            order = {
                id: subscription === null || subscription === void 0 ? void 0 : subscription._id,
                description: '', // Add appropriate description if needed
                currency: 'KWD',
                amount: parseInt((_c = (_b = subscription === null || subscription === void 0 ? void 0 : subscription.package) === null || _b === void 0 ? void 0 : _b.price) === null || _c === void 0 ? void 0 : _c.toString()),
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
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Invalid payment type');
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
        returnUrl: `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.server_url}payments/return`,
        cancelUrl: 'https://docs.stripe.com/payments/quickstart?lang=node#use-webhook',
        notificationUrl: `${config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.server_url}/payments/webhooks`,
        // 'https://www.linkedin.com/feed/?highlightedUpdateType=SHARED_BY_YOUR_NETWORK&highlightedUpdateUrn=urn%3Ali%3Aactivity%3A7215661277094756352',
        customerExtraData: tranId,
        order, // Added the order object to the return object for completeness
    };
});
exports.getPaymentConfig = getPaymentConfig;
