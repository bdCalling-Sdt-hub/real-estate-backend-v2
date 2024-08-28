"use strict";
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
exports.BookingResidenceService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const bookingResidence_models_1 = __importDefault(require("./bookingResidence.models"));
const residence_models_1 = __importDefault(require("../residence/residence.models"));
const review_models_1 = __importDefault(require("../review/review.models"));
const notification_service_1 = require("../notification/notification.service");
const user_model_1 = require("../user/user.model");
const messages_service_1 = require("../messages/messages.service");
const createBookingResidence = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const residence = yield residence_models_1.default.findById(payload.residence);
    // .populate(['host', 'residence']);
    if (!residence) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence not found');
    }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    payload.author = (_a = residence === null || residence === void 0 ? void 0 : residence.host) === null || _a === void 0 ? void 0 : _a._id;
    const result = yield bookingResidence_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'BookingResidence creation failed');
    }
    const user = yield user_model_1.User.findById(payload === null || payload === void 0 ? void 0 : payload.user);
    yield (notification_service_1.notificationServices === null || notification_service_1.notificationServices === void 0 ? void 0 : notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: result === null || result === void 0 ? void 0 : result.author,
        refference: result === null || result === void 0 ? void 0 : result._id,
        model_type: 'BookingResidence', // or 'Residence'
        message: 'You Have a new Booking Request',
        description: `${user === null || user === void 0 ? void 0 : user.email} sent you a Booking request do action for it`,
    }));
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllBookingResidence = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingResidenceModel = new QueryBuilder_1.default(bookingResidence_models_1.default.find().populate([
        {
            path: 'residence',
            populate: [
                {
                    path: 'host',
                    select: '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
                },
            ],
        },
        // { path: 'author', select: 'name email _id username phoneNumber image' },
        {
            path: 'user',
            select: '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
        },
    ]), query)
        .search(['name'])
        .filter()
        .populateFields('residence')
        .paginate()
        .sort()
        .fields();
    const data = yield bookingResidenceModel.modelQuery;
    const meta = yield bookingResidenceModel.countTotal();
    return {
        data,
        meta,
    };
});
const myBookings = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingsModel = new QueryBuilder_1.default(bookingResidence_models_1.default.find().populate([
        {
            path: 'residence',
        },
        {
            path: 'author',
            select: '-password -bankInfo -needsPasswordChange -passwordChangedAt -isDeleted',
        },
    ]), query)
        .search(['name'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const bookings = yield bookingsModel.modelQuery;
    const meta = yield bookingsModel.countTotal();
    const residenceIds = bookings.map((booking) => { var _a; return (_a = booking === null || booking === void 0 ? void 0 : booking.residence) === null || _a === void 0 ? void 0 : _a._id; });
    // Calculate average ratings for each residence
    const ratings = yield review_models_1.default.aggregate([
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
    const enrichedBookings = bookings.map((booking) => {
        const residence = booking.residence;
        const averageRating = ratingsMap[residence._id.toString()] || 0;
        return Object.assign(Object.assign({}, booking.toObject()), { averageRating });
    });
    return { enrichedBookings, meta };
});
//get booking residence
const getBookingResidenceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'oops! this residence was not found');
    }
    return result;
});
const approvedBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_models_1.default.findByIdAndUpdate(id, {
        status: 'approved',
    }, { new: true });
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
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence Booking approving failed');
    }
    yield messages_service_1.messagesService.createMessages({
        text: 'To proceed with your booking, please pay the service fee of 10 KWD. Once the payment is made, you will receive the booking payment link.',
        sender: result.author,
        receiver: result === null || result === void 0 ? void 0 : result.user,
        //@ts-ignore
        bookingId: result === null || result === void 0 ? void 0 : result._id,
        showButton: true,
    });
    yield (notification_service_1.notificationServices === null || notification_service_1.notificationServices === void 0 ? void 0 : notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: result === null || result === void 0 ? void 0 : result.user,
        refference: result === null || result === void 0 ? void 0 : result._id,
        model_type: 'BookingResidence', // or 'Residence'
        message: 'You Booking is approved',
        description: `Your booking request has been approved by the residence author`,
    }));
    return result;
});
const canceledBooking = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_models_1.default.findByIdAndUpdate(id, {
        $set: {
            status: 'canceled',
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence Booking canceling failed');
    }
    yield (notification_service_1.notificationServices === null || notification_service_1.notificationServices === void 0 ? void 0 : notification_service_1.notificationServices.insertNotificationIntoDb({
        receiver: result === null || result === void 0 ? void 0 : result.user,
        refference: result === null || result === void 0 ? void 0 : result._id,
        model_type: 'BookingResidence', // or 'Residence'
        message: 'You Booking is canceled',
        description: `Your booking request has been approved by the residence author`,
    }));
    return result;
});
const deleteBookingResidence = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'resident booking deletion failed');
    }
    return result;
});
exports.BookingResidenceService = {
    createBookingResidence,
    getAllBookingResidence,
    getBookingResidenceById,
    myBookings,
    approvedBooking,
    canceledBooking,
    deleteBookingResidence,
};
