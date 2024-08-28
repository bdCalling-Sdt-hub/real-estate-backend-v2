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
exports.paymentsService = void 0;
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const config_1 = __importDefault(require("../../config"));
const payments_utils_1 = require("./payments.utils");
const payments_models_1 = __importDefault(require("./payments.models"));
const payments_constants_1 = require("./payments.constants");
const bookingResidence_models_1 = __importDefault(require("../bookingResidence/bookingResidence.models"));
const moment_1 = __importDefault(require("moment"));
const subscriptions_models_1 = __importDefault(require("../subscriptions/subscriptions.models"));
const ads_models_1 = __importDefault(require("../ads/ads.models"));
const mongoose_1 = require("mongoose");
const user_model_1 = require("../user/user.model");
const residence_models_1 = __importDefault(require("../residence/residence.models"));
const messages_models_1 = __importDefault(require("../messages/messages.models"));
const messages_service_1 = require("../messages/messages.service");
// Initiate payment
const initiatePayment = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    const initiate = yield (0, payments_utils_1.getPaymentConfig)(payload);
    if ((payload === null || payload === void 0 ? void 0 : payload.paymentType) === 'BookingResidence') {
        const residence = yield bookingResidence_models_1.default.findById(payload === null || payload === void 0 ? void 0 : payload.bookingId);
        payload.residenceAuthority = residence === null || residence === void 0 ? void 0 : residence.author;
    }
    const haveInPayment = yield payments_models_1.default.findOne({
        status: 'pending',
        details: new mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.bookingId),
        type: payload === null || payload === void 0 ? void 0 : payload.paymentType,
        user: new mongoose_1.Types.ObjectId(payload === null || payload === void 0 ? void 0 : payload.user),
    });
    if (!haveInPayment) {
        yield payments_models_1.default.create({
            user: payload.user,
            transitionId: (_a = initiate === null || initiate === void 0 ? void 0 : initiate.reference) === null || _a === void 0 ? void 0 : _a.id,
            type: payload.paymentType,
            details: payload === null || payload === void 0 ? void 0 : payload.bookingId,
            amount: (_b = initiate === null || initiate === void 0 ? void 0 : initiate.order) === null || _b === void 0 ? void 0 : _b.amount,
            residenceAuthority: payload.residenceAuthority,
            transitionDate: (0, moment_1.default)(),
        });
    }
    else {
        yield payments_models_1.default.findByIdAndUpdate(haveInPayment === null || haveInPayment === void 0 ? void 0 : haveInPayment._id, {
            transitionId: (_c = initiate === null || initiate === void 0 ? void 0 : initiate.reference) === null || _c === void 0 ? void 0 : _c.id,
            transitionDate: (0, moment_1.default)(),
        });
    }
    try {
        const res = yield fetch('https://sandboxapi.upayments.com/api/v1/charge', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                // Authorization: `Bearer ${config?.payment?.payment_token}`,
                Authorization: `Bearer ${(_d = config_1.default === null || config_1.default === void 0 ? void 0 : config_1.default.payment) === null || _d === void 0 ? void 0 : _d.payment_token}`,
            },
            body: JSON.stringify(initiate),
        });
        const data = yield res.json();
        return data;
    }
    catch (err) {
        console.error(err);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, err.message);
    }
});
// Webhook for payment status
const webhook = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h, _j;
    const status = payload.result === 'CAPTURED' ? 'completed' : 'failed';
    const payment = yield payments_models_1.default.findOneAndUpdate({ transitionId: payload.trn_udf }, {
        $set: {
            status: status,
            paymentMethod: payload === null || payload === void 0 ? void 0 : payload.payment_type,
            transitionDate: payload === null || payload === void 0 ? void 0 : payload.transaction_date,
        },
    }, {
        new: true,
    });
    if (!payment) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Payment not found');
    }
    let updateData = {};
    if (payment.type === payments_constants_1.paymentTypes.Booking_Residence) {
        const booking = yield bookingResidence_models_1.default.findByIdAndUpdate((_e = payment === null || payment === void 0 ? void 0 : payment.details) === null || _e === void 0 ? void 0 : _e._id, {
            isPaid: payload.result === 'CAPTURED' ? true : false,
        }, { new: true });
        if (payload.result === 'CAPTURED') {
            yield user_model_1.User.findByIdAndUpdate(booking === null || booking === void 0 ? void 0 : booking.author, {
                $inc: { balance: payment === null || payment === void 0 ? void 0 : payment.amount, tenants: 1, totalBooking: 1 },
            }, { new: true, timestamps: false });
        }
        // await Residence.findByIdAndUpdate(
        //   booking?.residence,
        //   { $inc: { popularity: 1 } },
        //   { new: true, timestamps: false },
        // );
        //  await notificationServices?.insertNotificationIntoDb({
        //    receiverId: someReceiverId,
        //    referenceId: someReferenceId,
        //    modelType: 'Payment', // or 'Residence'
        //    message: 'Your payment has been received.',
        //  });
        return payment;
    }
    else if (payment.type === payments_constants_1.paymentTypes.Subscription_Booking) {
        const subscription = yield subscriptions_models_1.default.findById(payment === null || payment === void 0 ? void 0 : payment.details).populate('package');
        if (!subscription) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Package not found');
        }
        //pre sub
        const haveAnSubscription = yield subscriptions_models_1.default.findOne({
            user: (_f = payment === null || payment === void 0 ? void 0 : payment.user) === null || _f === void 0 ? void 0 : _f._id,
            isPaid: true,
            endAt: { $gt: new Date() },
        });
        const startAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        let endAt = (0, moment_1.default)()
            .add((_g = subscription === null || subscription === void 0 ? void 0 : subscription.package) === null || _g === void 0 ? void 0 : _g.durationDays, 'day')
            .format('YYYY-MM-DD HH:mm:ss');
        if (haveAnSubscription) {
            const time = (0, moment_1.default)(haveAnSubscription.endAt).diff((0, moment_1.default)());
            endAt = (0, moment_1.default)(endAt)
                .add(time, 'milliseconds')
                .format('YYYY-MM-DD HH:mm:ss');
        }
        const newSubscription = yield subscriptions_models_1.default.findByIdAndUpdate((_h = payment === null || payment === void 0 ? void 0 : payment.details) === null || _h === void 0 ? void 0 : _h._id, {
            transitionId: payment === null || payment === void 0 ? void 0 : payment.transitionId,
            isPaid: payload.result === 'CAPTURED' ? true : false,
            startAt: startAt,
            endAt: endAt,
        });
        if (!newSubscription) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
        }
        return payments_models_1.default;
    }
    else if (payment.type === payments_constants_1.paymentTypes.Ads) {
        const ads = yield ads_models_1.default.findByIdAndUpdate(payment === null || payment === void 0 ? void 0 : payment.details);
        if (!ads) {
            throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Ads not found');
        }
        yield ads_models_1.default.findByIdAndUpdate((_j = payment === null || payment === void 0 ? void 0 : payment.details) === null || _j === void 0 ? void 0 : _j._id, {
            status: payload.result === 'CAPTURED' ? true : false,
            tranId: payment === null || payment === void 0 ? void 0 : payment.transitionId,
        });
    }
    return payment;
});
//return url
const returnUrl = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_models_1.default.findOne({ transitionId: query === null || query === void 0 ? void 0 : query.trn_udf });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_GATEWAY, 'payment not found!');
    }
    if ((result === null || result === void 0 ? void 0 : result.status) === 'completed') {
        const messages = yield messages_models_1.default.findOneAndUpdate({
            bookingId: new mongoose_1.Types.ObjectId(result === null || result === void 0 ? void 0 : result.details),
            sender: new mongoose_1.Types.ObjectId(result === null || result === void 0 ? void 0 : result.residenceAuthority),
            receiver: new mongoose_1.Types.ObjectId(result === null || result === void 0 ? void 0 : result.user),
            showButton: true,
        }, { showButton: false }, { new: true });
        if (messages) {
            yield messages_service_1.messagesService.createMessages({
                text: 'Your payment has been successfully completed. You can now communicate with the landlord.',
                //@ts-ignore
                sender: result.residenceAuthority,
                //@ts-ignore
                receiver: result === null || result === void 0 ? void 0 : result.user,
            });
        }
    }
    return result;
});
const myPayments = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payments_models_1.default.find({ user: userId }).populate([
        {
            path: 'user',
            select: 'name email _id image role address phoneNumber',
        },
        {
            path: 'details',
            select: '-isDeleted -__v',
        },
    ]);
    return payments;
});
const myIncome = (userId, query) => __awaiter(void 0, void 0, void 0, function* () {
    // Ensure user is valid
    const user = yield user_model_1.User.findById(userId);
    if (!user) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'User not found!');
    }
    // Extract query parameters
    const { daily, week, month, sixMonths, year, date } = query;
    // Define match stage for aggregation
    let matchStage = {
        type: payments_constants_1.paymentTypes.Booking_Residence,
        status: 'completed',
        residenceAuthority: new mongoose_1.Types.ObjectId(userId),
    };
    // Define date range for filtering
    if (daily) {
        const today = (0, moment_1.default)().startOf('day').toDate();
        const tomorrow = (0, moment_1.default)(today).add(1, 'day').toDate();
        matchStage.createdAt = { $gte: today, $lt: tomorrow };
    }
    else if (week) {
        const startOfWeek = (0, moment_1.default)().startOf('week').toDate();
        const endOfWeek = (0, moment_1.default)(startOfWeek).endOf('week').toDate();
        matchStage.createdAt = { $gte: startOfWeek, $lt: endOfWeek };
    }
    else if (month && year) {
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (sixMonths) {
        const today = new Date();
        const sixMonthsAgo = (0, moment_1.default)(today).subtract(6, 'months').toDate();
        matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
    }
    else if (year) {
        const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').toDate();
        const endDate = (0, moment_1.default)(`${year}-12-31`).endOf('year').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (date) {
        const formattedDate = (0, moment_1.default)(date);
        const startOfDay = formattedDate.startOf('day').toDate();
        const endOfDay = formattedDate.endOf('day').toDate();
        matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    // Create aggregation pipeline
    const aggregationPipeline = [];
    if (Object.keys(matchStage).length > 0) {
        aggregationPipeline.push({ $match: matchStage });
    }
    aggregationPipeline.push({
        $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
                week: { $week: '$createdAt' }, // Group by week
            },
            totalIncome: { $sum: '$landlordAmount' },
        },
    });
    aggregationPipeline.push({
        $sort: { '_id.year': 1, '_id.month': 1, '_id.week': 1 },
    });
    const result = yield payments_models_1.default.aggregate(aggregationPipeline);
    const weeklyIncome = result.map(item => ({
        year: item._id.year,
        month: item._id.month,
        week: item._id.week,
        income: item.totalIncome,
    }));
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let yearlyIncome = 0;
    const formattedResult = monthNames.map((monthName, index) => {
        const monthData = result.find(item => item._id.month === index + 1);
        const income = monthData ? monthData.totalIncome : 0;
        yearlyIncome += income;
        return {
            month: monthName,
            income: income,
        };
    });
    // Calculate the half-yearly income
    const firstHalfIncome = formattedResult
        .slice(0, 6)
        .reduce((sum, month) => sum + month.income, 0);
    const secondHalfIncome = formattedResult
        .slice(6, 12)
        .reduce((sum, month) => sum + month.income, 0);
    // Create separate objects for half-yearly and yearly income
    const halfYearlyIncome = [
        { period: 'First Half', income: firstHalfIncome },
        { period: 'Second Half', income: secondHalfIncome },
    ];
    const yearlyIncomeObj = { period: 'Yearly', income: yearlyIncome };
    const totalIncome = yield payments_models_1.default.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalIncome: { $sum: '$landlordAmount' } } },
    ]).exec();
    const transitions = yield payments_models_1.default.find({
        type: payments_constants_1.paymentTypes.Booking_Residence,
        status: 'completed',
        residenceAuthority: new mongoose_1.Types.ObjectId(userId),
    }).populate([
        { path: 'user', select: '_id name email image image' },
        { path: 'details', populate: ['residence'] },
    ]);
    return {
        totalMyIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
        weeklyIncome: weeklyIncome, // Add weekly income
        monthlyIncome: formattedResult,
        halfYearlyIncome: halfYearlyIncome,
        yearlyIncome: yearlyIncomeObj,
        totalTransitions: transitions,
    };
});
const packageIncome = () => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, moment_1.default)().startOf('day').toDate();
    const tomorrow = (0, moment_1.default)(today).endOf('day').toDate();
    const matchStage = {
        type: payments_constants_1.paymentTypes.Subscription_Booking,
        status: 'completed',
    };
    const result = yield payments_models_1.default.aggregate([
        {
            $match: Object.assign({}, matchStage),
        },
        {
            $addFields: {
                isToday: {
                    $and: [
                        { $gte: ['$transitionDate', today] },
                        { $lt: ['$transitionDate', tomorrow] },
                    ],
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: '$user' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] },
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            email: 1,
                            name: 1,
                            username: 1,
                            _id: 1,
                            phoneNumber: 1,
                        },
                    },
                ],
                as: 'userDetails',
            },
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $lookup: {
                from: 'subscriptions', // The collection name for details
                localField: 'details',
                foreignField: '_id',
                as: 'detailsInfo',
            },
        },
        {
            $unwind: {
                path: '$detailsInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                detailsInfo: {
                    $cond: {
                        if: { $eq: ['$type', payments_constants_1.paymentTypes.Subscription_Booking] },
                        then: '$detailsInfo',
                        else: null, // Add other conditions for different types if needed
                    },
                },
            },
        },
        {
            $lookup: {
                from: 'packages', // The collection name for packages
                localField: 'detailsInfo.package', // The field in detailsInfo that references the package
                foreignField: '_id',
                as: 'packageInfo',
            },
        },
        {
            $unwind: {
                path: '$packageInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $addFields: {
                'detailsInfo.package': '$packageInfo',
            },
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: '$amount' },
                totalTransactions: { $sum: 1 },
                todayIncome: {
                    $sum: {
                        $cond: ['$isToday', '$amount', 0],
                    },
                },
                todayTransactions: {
                    $sum: {
                        $cond: ['$isToday', 1, 0],
                    },
                },
                totalPaymentsList: {
                    $push: {
                        amount: '$amount',
                        paymentMethod: '$paymentMethod',
                        status: '$status',
                        transitionId: '$transitionId',
                        transitionDate: '$transitionDate',
                        type: '$type',
                        user: '$userDetails',
                        details: '$detailsInfo',
                        residenceAuthority: '$residenceAuthority',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalTransactions: 1,
                todayIncome: 1,
                todayTransactions: 1,
                totalPaymentsList: 1,
            },
        },
    ]);
    return result.length > 0
        ? result[0]
        : {
            totalIncome: 0,
            totalTransactions: 0,
            todayIncome: 0,
            todayTransactions: 0,
            totalPaymentsList: [],
        };
});
const PercentageIncome = () => __awaiter(void 0, void 0, void 0, function* () {
    var _k;
    const today = (0, moment_1.default)().startOf('day').toDate();
    const tomorrow = (0, moment_1.default)(today).endOf('day').toDate();
    const matchStage = {
        type: payments_constants_1.paymentTypes.Booking_Residence,
        status: 'completed',
    };
    const result = yield payments_models_1.default.aggregate([
        {
            $match: Object.assign({}, matchStage),
        },
        {
            $addFields: {
                isToday: {
                    $and: [
                        { $gte: ['$transitionDate', today] },
                        { $lt: ['$transitionDate', tomorrow] },
                    ],
                },
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { userId: '$residenceAuthority' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] },
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            email: 1,
                            name: 1,
                            username: 1,
                            _id: 1,
                            phoneNumber: 1,
                        },
                    },
                ],
                as: 'userDetails',
            },
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: '$adminAmount' },
                todayIncome: {
                    $sum: {
                        $cond: ['$isToday', '$adminAmount', 0],
                    },
                },
                totalPaymentsList: {
                    $push: {
                        amount: '$amount',
                        paymentMethod: '$paymentMethod',
                        status: '$status',
                        user: '$userDetails',
                        transitionId: '$transitionId',
                        transitionDate: '$transitionDate',
                        type: '$type',
                        details: '$detailsInfo',
                        residenceAuthority: '$residenceAuthority',
                        landlordAmount: '$landlordAmount',
                        adminAmount: '$adminAmount',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalTransactions: 1,
                todayIncome: 1,
                todayTransactions: 1,
                totalPaymentsList: 1,
            },
        },
    ]);
    console.table((_k = result[0]) === null || _k === void 0 ? void 0 : _k.totalPaymentsList);
    return result.length > 0
        ? result[0]
        : {
            totalIncome: 0,
            totalTransactions: 0,
            todayIncome: 0,
            todayTransactions: 0,
            totalPaymentsList: [],
        };
});
const todayAndTotalIncome = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { year } = query;
    const today = (0, moment_1.default)().startOf('day').toDate();
    const tomorrow = (0, moment_1.default)(today).add(1, 'days').toDate();
    const startDate = (0, moment_1.default)(`${year || (0, moment_1.default)().format('yyyy')}-01-01`)
        .startOf('year')
        .toDate();
    const endDate = (0, moment_1.default)(`${year || (0, moment_1.default)().format('yyyy')}-12-31`).endOf('year').toDate;
    const [todayIncomeResult, totalIncomeResult] = yield Promise.all([
        payments_models_1.default.aggregate([
            {
                $match: {
                    status: 'completed',
                    transitionDate: {
                        $gte: today,
                        $lt: tomorrow,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]),
        payments_models_1.default.aggregate([
            {
                $match: {
                    status: 'completed',
                },
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$amount' },
                },
            },
        ]),
    ]);
    // Aggregate income for each month
    const monthlyIncomeResult = yield payments_models_1.default.aggregate([
        {
            $match: {
                status: 'completed',
                transitionDate: {
                    $gte: startDate,
                    $lt: endDate,
                },
            },
        },
        {
            $group: {
                _id: { month: { $month: '$transitionDate' } },
                total: { $sum: '$amount' },
            },
        },
        {
            $sort: { '_id.month': 1 },
        },
    ]);
    // Create an array with all months initialized to 0 income
    const monthlyIncome = [
        { month: 'Jan', income: 0 },
        { month: 'Feb', income: 0 },
        { month: 'Mar', income: 0 },
        { month: 'Apr', income: 0 },
        { month: 'May', income: 0 },
        { month: 'Jun', income: 0 },
        { month: 'Jul', income: 0 },
        { month: 'Aug', income: 0 },
        { month: 'Sep', income: 0 },
        { month: 'Oct', income: 0 },
        { month: 'Nov', income: 0 },
        { month: 'Dec', income: 0 },
    ];
    // Fill the income data for the corresponding months
    monthlyIncomeResult.forEach(item => {
        const monthIndex = item._id.month - 1; // MongoDB months are 1-indexed
        monthlyIncome[monthIndex].income = item.total;
    });
    const todayIncome = todayIncomeResult.length > 0 ? todayIncomeResult[0].total : 0;
    const totalIncome = totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;
    const properties = yield residence_models_1.default.countDocuments();
    return {
        todayIncome,
        totalIncome,
        monthlyIncome,
        properties,
    };
});
const PackagesStatisticsIncomes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract query parameters
    const { daily, month, sixMonths, year, date } = query;
    // Define match stage for aggregation
    let matchStage = {
        type: payments_constants_1.paymentTypes.Subscription_Booking,
        status: 'completed',
    };
    // Define date range for filtering
    if (daily) {
        const today = (0, moment_1.default)().startOf('day').toDate();
        const tomorrow = (0, moment_1.default)(today).add(1, 'day').toDate();
        matchStage.createdAt = { $gte: today, $lt: tomorrow };
    }
    else if (month && year) {
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (sixMonths) {
        const today = new Date();
        const sixMonthsAgo = (0, moment_1.default)(today).subtract(6, 'months').toDate();
        matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
    }
    else if (year) {
        const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').toDate();
        const endDate = (0, moment_1.default)(`${year}-12-31`).endOf('year').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (date) {
        const formattedDate = (0, moment_1.default)(date);
        const startOfDay = formattedDate.startOf('day').toDate();
        const endOfDay = formattedDate.endOf('day').toDate();
        matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    // Create aggregation pipeline
    const aggregationPipeline = [{ $match: matchStage }];
    aggregationPipeline.push({
        $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            },
            totalIncome: { $sum: '$amount' },
        },
    });
    aggregationPipeline.push({
        $sort: { '_id.year': 1, '_id.month': 1 },
    });
    const result = yield payments_models_1.default.aggregate(aggregationPipeline);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let yearlyIncome = 0;
    const formattedResult = monthNames.map((monthName, index) => {
        const monthData = result.find(item => item._id.month === index + 1);
        const income = monthData ? monthData.totalIncome : 0;
        yearlyIncome += income;
        return { month: monthName, income };
    });
    // Calculate the half-yearly income
    const firstHalfIncome = formattedResult
        .slice(0, 6)
        .reduce((sum, month) => sum + month.income, 0);
    const secondHalfIncome = formattedResult
        .slice(6, 12)
        .reduce((sum, month) => sum + month.income, 0);
    // Create separate objects for half-yearly and yearly income
    const halfYearlyIncome = [
        { period: 'First Half', income: firstHalfIncome },
        { period: 'Second Half', income: secondHalfIncome },
    ];
    const yearlyIncomeObj = { period: 'Yearly', income: yearlyIncome };
    // Get total income
    const totalIncome = yield payments_models_1.default.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
    ]).exec();
    // Get total transitions
    const transitions = yield payments_models_1.default.find({
        type: payments_constants_1.paymentTypes.Subscription_Booking,
        status: 'completed',
    }).populate({
        path: 'details',
        populate: { path: 'package' },
    });
    return {
        totalMyIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
        monthlyIncome: formattedResult,
        halfYearlyIncome,
        yearlyIncome: yearlyIncomeObj,
        totalTransitions: transitions,
    };
});
const PercentageStatisticsIncomes = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract query parameters
    const { daily, month, sixMonths, year, date } = query;
    // Define match stage for aggregation
    let matchStage = {
        type: payments_constants_1.paymentTypes.Booking_Residence,
        status: 'completed',
    };
    // Define date range for filtering
    if (daily) {
        const today = (0, moment_1.default)().startOf('day').toDate();
        const tomorrow = (0, moment_1.default)(today).add(1, 'day').toDate();
        matchStage.createdAt = { $gte: today, $lt: tomorrow };
    }
    else if (month && year) {
        const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
        const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (sixMonths) {
        const today = new Date();
        const sixMonthsAgo = (0, moment_1.default)(today).subtract(6, 'months').toDate();
        matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
    }
    else if (year) {
        const startDate = (0, moment_1.default)(`${year}-01-01`).startOf('year').toDate();
        const endDate = (0, moment_1.default)(`${year}-12-31`).endOf('year').toDate();
        matchStage.createdAt = { $gte: startDate, $lte: endDate };
    }
    else if (date) {
        const formattedDate = (0, moment_1.default)(date);
        const startOfDay = formattedDate.startOf('day').toDate();
        const endOfDay = formattedDate.endOf('day').toDate();
        matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
    }
    // Create aggregation pipeline
    const aggregationPipeline = [{ $match: matchStage }];
    aggregationPipeline.push({
        $group: {
            _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' },
            },
            totalIncome: { $sum: '$adminAmount' },
        },
    });
    aggregationPipeline.push({
        $sort: { '_id.year': 1, '_id.month': 1 },
    });
    const result = yield payments_models_1.default.aggregate(aggregationPipeline);
    const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ];
    let yearlyIncome = 0;
    const formattedResult = monthNames.map((monthName, index) => {
        const monthData = result.find(item => item._id.month === index + 1);
        const income = monthData ? monthData.totalIncome : 0;
        yearlyIncome += income;
        return { month: monthName, income };
    });
    // Calculate the half-yearly income
    const firstHalfIncome = formattedResult
        .slice(0, 6)
        .reduce((sum, month) => sum + month.income, 0);
    const secondHalfIncome = formattedResult
        .slice(6, 12)
        .reduce((sum, month) => sum + month.income, 0);
    // Create separate objects for half-yearly and yearly income
    const halfYearlyIncome = [
        { period: 'First Half', income: firstHalfIncome },
        { period: 'Second Half', income: secondHalfIncome },
    ];
    const yearlyIncomeObj = { period: 'Yearly', income: yearlyIncome };
    // Get total income
    const totalIncome = yield payments_models_1.default.aggregate([
        { $match: matchStage },
        { $group: { _id: null, totalIncome: { $sum: '$adminAmount' } } },
    ]).exec();
    return {
        totalMyIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
        monthlyIncome: formattedResult,
        halfYearlyIncome,
        yearlyIncome: yearlyIncomeObj,
    };
});
const calculatePackageNameByIncome = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const { year, month } = query;
    // Calculate the start and end dates for the given month
    const startDate = (0, moment_1.default)(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = (0, moment_1.default)(startDate).endOf('month').toDate();
    const incomeData = yield payments_models_1.default.aggregate([
        {
            $match: {
                status: 'completed',
                type: payments_constants_1.paymentTypes.Subscription_Booking,
                createdAt: { $gte: startDate, $lt: endDate },
            },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'details',
                foreignField: '_id',
                as: 'subscriptionData',
            },
        },
        {
            $unwind: '$subscriptionData',
        },
        {
            $lookup: {
                from: 'packages',
                localField: 'subscriptionData.package',
                foreignField: '_id',
                as: 'packageData',
            },
        },
        {
            $unwind: '$packageData',
        },
        {
            $group: {
                _id: '$packageData.name',
                totalIncome: { $sum: '$amount' },
            },
        },
        {
            $project: {
                _id: 0,
                packageName: '$_id',
                totalIncome: 1,
            },
        },
    ]);
    return incomeData.length > 0 ? incomeData : [];
});
const topLandlordIncome = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_models_1.default.aggregate([
        {
            $match: {
                isPaid: true,
                // status: 'approved',
                // isDeleted: { $ne: true }
            },
        },
        {
            $group: {
                _id: '$author',
                totalIncome: { $sum: '$totalPrice' },
                totalTransactions: { $sum: 1 },
            },
        },
        {
            $sort: { totalIncome: -1 },
        },
        {
            $limit: 15,
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'authorDetails',
            },
        },
        {
            $unwind: '$authorDetails',
        },
        {
            $project: {
                _id: 0,
                author: {
                    name: '$authorDetails.name',
                    email: '$authorDetails.email',
                    image: '$authorDetails.image',
                    role: '$authorDetails.role',
                    phoneNumber: '$authorDetails.phoneNumber',
                    address: '$authorDetails.address',
                },
                totalIncome: 1,
                totalTransactions: 1,
            },
        },
    ]);
    // const result = await Payment.aggregate([
    //   {
    //     $match: {
    //       type: paymentTypes.Booking_Residence,
    //       status: 'completed',
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: '$residenceAuthority',
    //       totalIncome: { $sum: '$landlordAmount' },
    //       totalTransactions: { $sum: 1 },
    //     },
    //   },
    //   {
    //     $sort: { totalIncome: -1 },
    //   },
    //   {
    //     $limit: 15,
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       localField: '_id',
    //       foreignField: '_id',
    //       as: 'residenceAuthorityDetails',
    //     },
    //   },
    //   {
    //     $unwind: '$residenceAuthorityDetails',
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       author: {
    //         name: '$residenceAuthorityDetails.name',
    //         email: '$residenceAuthorityDetails.email',
    //         image: '$residenceAuthorityDetails.image',
    //         role: '$residenceAuthorityDetails.role',
    //         phoneNumber: '$residenceAuthorityDetails.phoneNumber',
    //         address: '$residenceAuthorityDetails.address',
    //       },
    //       totalIncome: 1,
    //       totalTransactions: 1,
    //     },
    //   },
    // ]);
    return result;
});
//all percentage transitions
const allTransitions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const today = (0, moment_1.default)().startOf('day').toDate();
    const tomorrow = (0, moment_1.default)(today).endOf('day').toDate();
    const matchStage = {
        status: 'completed',
        type: query === null || query === void 0 ? void 0 : query.type,
    };
    if (!query.type) {
        delete matchStage.type;
    }
    const result = yield payments_models_1.default.aggregate([
        {
            $match: Object.assign({}, matchStage),
        },
        {
            $addFields: {
                isToday: {
                    $and: [
                        { $gte: ['$transitionDate', today] },
                        { $lt: ['$transitionDate', tomorrow] },
                    ],
                },
            },
        },
        // Lookup to populate the "user" field
        {
            $lookup: {
                from: 'users',
                let: { userId: '$user' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] },
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            email: 1,
                            name: 1,
                            username: 1,
                            _id: 1,
                            phoneNumber: 1,
                        },
                    },
                ],
                as: 'userInfo',
            },
        },
        {
            $unwind: {
                path: '$userInfo',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Lookup for BookingResidence details
        {
            $lookup: {
                from: 'bookingresidences',
                let: { detailsId: '$details' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$detailsId'] },
                        },
                    },
                    {
                        $project: {
                            // Replace these fields with the actual fields you need
                            _id: 1,
                        },
                    },
                ],
                as: 'bookingResidenceDetails',
            },
        },
        {
            $unwind: {
                path: '$bookingResidenceDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Lookup for Ads details
        {
            $lookup: {
                from: 'ads',
                let: { detailsId: '$details' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$detailsId'] },
                        },
                    },
                    {
                        $project: {
                            // Replace these fields with the actual fields you need
                            _id: 1,
                            property: 1,
                            tranId: 1,
                            status: 1,
                            expireAt: 1,
                            startAt: 1,
                            banner: 1,
                            price: 1,
                        },
                    },
                ],
                as: 'adsDetails',
            },
        },
        {
            $unwind: {
                path: '$adsDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        // Combine the details fields into one
        {
            $addFields: {
                detailsInfo: {
                    $cond: {
                        if: { $eq: ['$type', 'BookingResidence'] },
                        then: '$bookingResidenceDetails',
                        else: {
                            $cond: {
                                if: { $eq: ['$type', 'Ads'] },
                                then: '$adsDetails',
                                else: null,
                            },
                        },
                    },
                },
            },
        },
        // Lookup to populate the "residenceAuthority" field
        {
            $lookup: {
                from: 'users',
                let: { userId: '$residenceAuthority' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $eq: ['$_id', '$$userId'] },
                        },
                    },
                    {
                        $project: {
                            role: 1,
                            email: 1,
                            name: 1,
                            username: 1,
                            _id: 1,
                            phoneNumber: 1,
                        },
                    },
                ],
                as: 'userDetails',
            },
        },
        {
            $unwind: {
                path: '$userDetails',
                preserveNullAndEmptyArrays: true,
            },
        },
        {
            $group: {
                _id: null,
                totalIncome: { $sum: '$amount' },
                todayIncome: {
                    $sum: {
                        $cond: ['$isToday', '$amount', 0],
                    },
                },
                totalPaymentsList: {
                    $push: {
                        amount: '$amount',
                        paymentMethod: '$paymentMethod',
                        status: '$status',
                        transitionId: '$transitionId',
                        transitionDate: '$transitionDate',
                        type: '$type',
                        details: '$detailsInfo',
                        user: '$userInfo',
                        residenceAuthority: '$userDetails',
                        landlordAmount: '$landlordAmount',
                        adminAmount: '$adminAmount',
                    },
                },
            },
        },
        {
            $project: {
                _id: 0,
                totalIncome: 1,
                totalTransactions: 1,
                todayIncome: 1,
                todayTransactions: 1,
                totalPaymentsList: 1,
            },
        },
    ]);
    // const result = await Payment.aggregate([
    //   {
    //     $match: {
    //       ...matchStage,
    //     },
    //   },
    //   {
    //     $addFields: {
    //       isToday: {
    //         $and: [
    //           { $gte: ['$transitionDate', today] },
    //           { $lt: ['$transitionDate', tomorrow] },
    //         ],
    //       },
    //     },
    //   },
    //   {
    //     $lookup: {
    //       from: 'users',
    //       let: { userId: '$residenceAuthority' },
    //       pipeline: [
    //         {
    //           $match: {
    //             $expr: { $eq: ['$_id', '$$userId'] },
    //           },
    //         },
    //         {
    //           $project: {
    //             role: 1,
    //             email: 1,
    //             name: 1,
    //             username: 1,
    //             _id: 1,
    //             phoneNumber: 1,
    //           },
    //         },
    //       ],
    //       as: 'userDetails',
    //     },
    //   },
    //   {
    //     $unwind: {
    //       path: '$userDetails',
    //       preserveNullAndEmptyArrays: true,
    //     },
    //   },
    //   {
    //     $group: {
    //       _id: null,
    //       totalIncome: { $sum: '$amount' },
    //       todayIncome: {
    //         $sum: {
    //           $cond: ['$isToday', '$amount', 0],
    //         },
    //       },
    //       totalPaymentsList: {
    //         $push: {
    //           amount: '$amount',
    //           paymentMethod: '$paymentMethod',
    //           status: '$status',
    //           transitionId: '$transitionId',
    //           transitionDate: '$transitionDate',
    //           type: '$type',
    //           details: '$detailsInfo',
    //           residenceAuthority: '$userDetails',
    //           landlordAmount: '$landlordAmount',
    //           adminAmount: '$adminAmount',
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $project: {
    //       _id: 0,
    //       totalIncome: 1,
    //       totalTransactions: 1,
    //       todayIncome: 1,
    //       todayTransactions: 1,
    //       totalPaymentsList: 1,
    //     },
    //   },
    // ]);
    return (result === null || result === void 0 ? void 0 : result.length) > 0 ? result[0] : [];
});
exports.paymentsService = {
    initiatePayment,
    webhook,
    myPayments,
    myIncome,
    packageIncome,
    PercentageIncome,
    todayAndTotalIncome,
    PackagesStatisticsIncomes,
    PercentageStatisticsIncomes,
    calculatePackageNameByIncome,
    topLandlordIncome,
    allTransitions,
    returnUrl,
};
