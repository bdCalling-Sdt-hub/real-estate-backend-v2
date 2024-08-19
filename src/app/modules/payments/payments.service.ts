/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import config from '../../config';
import { getPaymentConfig } from './payments.utils';
import Payment from './payments.models';
import { paymentTypes } from './payments.constants';
import BookingResidence from '../bookingResidence/bookingResidence.models';
import { IPayment } from './payments.interface';
import moment from 'moment';
import Subscription from '../subscriptions/subscriptions.models';
import Ads from '../ads/ads.models';
import { Types } from 'mongoose';
import { User } from '../user/user.model';
import Residence from '../residence/residence.models';

// Initiate payment
const initiatePayment = async (payload: any) => {
  const initiate: any = await getPaymentConfig(payload);
  if (payload?.paymentType === 'BookingResidence') {
    const residence = await BookingResidence.findById(payload?.bookingId);
    payload.residenceAuthority = residence?.author;
  }

  const haveInPayment = await Payment.findOne({
    status: 'pending',
    details: new Types.ObjectId(payload?.bookingId),
    type: payload?.paymentType,
    user: new Types.ObjectId(payload?.user),
  });

  if (!haveInPayment) {
    await Payment.create({
      user: payload.user,
      transitionId: initiate?.reference?.id,
      type: payload.paymentType,
      details: payload?.bookingId,
      amount: initiate?.order?.amount,
      residenceAuthority: payload.residenceAuthority,
      transitionDate: moment(),
    });
  } else {
    await Payment.findByIdAndUpdate(haveInPayment?._id, {
      transitionId: initiate?.reference?.id,
      transitionDate: moment(),
    });
  }

  console.log(initiate);

  try {
    const res = await fetch('https://sandboxapi.upayments.com/api/v1/charge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        // Authorization: `Bearer ${config?.payment?.payment_token}`,
        Authorization: `Bearer ${config?.payment?.payment_token}`,
      },
      body: JSON.stringify(initiate),
    });
    const data = await res.json();
    return data;
  } catch (err: any) {
    console.log(err);
    throw new AppError(httpStatus.BAD_REQUEST, err.message);
  }
};

// Webhook for payment status
const webhook = async (payload: any) => {
  const status = payload.result === 'CAPTURED' ? 'completed' : 'failed';
  const payment: IPayment | null = await Payment.findOneAndUpdate(
    { transitionId: payload.trn_udf },
    {
      $set: {
        status: status,
        paymentMethod: payload?.payment_type,
        transitionDate: payload?.transaction_date,
      },
    },
    {
      new: true,
    },
  );

  if (!payment) {
    throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
  }

  if (payment.type === paymentTypes.Booking_Residence) {
    const booking = await BookingResidence.findByIdAndUpdate(
      payment?.details?._id,
      {
        isPaid: payload.result === 'CAPTURED' ? true : false,
      },
      { new: true },
    );

    await User.findByIdAndUpdate(
      booking?.author,
      { $inc: { balance: payment?.landlordAmount } },
      { new: true, timestamps: false },
    );
    await Residence.findByIdAndUpdate(
      booking?.residence,
      { $inc: { popularity: 1 } },
      { new: true, timestamps: false },
    );

    //  await notificationServices?.insertNotificationIntoDb({
    //    receiverId: someReceiverId,
    //    referenceId: someReferenceId,
    //    modelType: 'Payment', // or 'Residence'
    //    message: 'Your payment has been received.',
    //  });
    return payment;
  } else if (payment.type === paymentTypes.Subscription_Booking) {
    const subscription: any = await Subscription.findById(
      payment?.details,
    ).populate('package');

    if (!subscription) {
      throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
    }

    //pre sub
    const haveAnSubscription = await Subscription.findOne({
      user: payment?.user?._id,
      isPaid: true,
      endAt: { $gt: new Date() },
    });

    const startAt = moment().format('YYYY-MM-DD HH:mm:ss');

    let endAt = moment()
      .add(subscription?.package?.durationDays, 'day')
      .format('YYYY-MM-DD HH:mm:ss');

    if (haveAnSubscription) {
      const time = moment(haveAnSubscription.endAt).diff(moment());
      endAt = moment(endAt)
        .add(time, 'milliseconds')
        .format('YYYY-MM-DD HH:mm:ss');
    }

    const newSubscription = await Subscription.findByIdAndUpdate(
      payment?.details?._id,
      {
        transitionId: payment?.transitionId,
        isPaid: payload.result === 'CAPTURED' ? true : false,
        startAt: startAt,
        endAt: endAt,
      },
    );

    if (!newSubscription) {
      throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
    }

    return Payment;
  } else if (payment.type === paymentTypes.Ads) {
    const ads = await Ads.findByIdAndUpdate(payment?.details);
    if (!ads) {
      throw new AppError(httpStatus.NOT_FOUND, 'Ads not found');
    }

    await Ads.findByIdAndUpdate(payment?.details?._id, {
      isPaid: payload.result === 'CAPTURED' ? true : false,
      tranId: payment?.transitionId,
    });
  }

  return payment;
};

//return url
const returnUrl = async (query: Record<string, any>) => { 
  const result = await Payment.findOne({ transitionId: query?.trn_udf });
  console.log('🚀 ~ returnUrl ~ result:', result);
  if (!result) {
    throw new AppError(httpStatus.BAD_GATEWAY, 'payment not found!');
  }
  return result;
}; 

const myPayments = async (userId: string) => {
  const payments = await Payment.find({ user: userId }).populate([
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
};

const myIncome = async (userId: string, query: Record<string, any>) => {
  // Ensure user is valid
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found!');
  }

  // Extract query parameters
  const { daily, week, month, sixMonths, year, date } = query;

  // Define match stage for aggregation
  let matchStage: any = {
    type: paymentTypes.Booking_Residence,
    status: 'completed',
    residenceAuthority: new Types.ObjectId(userId),
  };

  // Define date range for filtering
  if (daily) {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'day').toDate();
    matchStage.createdAt = { $gte: today, $lt: tomorrow };
  } else if (week) {
    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment(startOfWeek).endOf('week').toDate();
    matchStage.createdAt = { $gte: startOfWeek, $lt: endOfWeek };
  } else if (month && year) {
    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (sixMonths) {
    const today = new Date();
    const sixMonthsAgo = moment(today).subtract(6, 'months').toDate();
    matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
  } else if (year) {
    const startDate = moment(`${year}-01-01`).startOf('year').toDate();
    const endDate = moment(`${year}-12-31`).endOf('year').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (date) {
    const formattedDate = moment(date);
    const startOfDay = formattedDate.startOf('day').toDate();
    const endOfDay = formattedDate.endOf('day').toDate();
    matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  // Create aggregation pipeline
  const aggregationPipeline: any[] = [];

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

  const result = await Payment.aggregate(aggregationPipeline);

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

  const totalIncome = await Payment.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalIncome: { $sum: '$landlordAmount' } } },
  ]).exec();

  const transitions = await Payment.find({
    type: paymentTypes.Booking_Residence,
    status: 'completed',
    residenceAuthority: new Types.ObjectId(userId),
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
};

const packageIncome = async () => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment(today).endOf('day').toDate();

  const matchStage = {
    type: paymentTypes.Subscription_Booking,
    status: 'completed',
  };

  const result = await Payment.aggregate([
    {
      $match: {
        ...matchStage,
      },
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
            if: { $eq: ['$type', paymentTypes.Subscription_Booking] },
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
};

const PercentageIncome = async () => {
  const today = moment().startOf('day').toDate();
  const tomorrow = moment(today).endOf('day').toDate();

  const matchStage = {
    type: paymentTypes.Booking_Residence,
    status: 'completed',
  };

  const result = await Payment.aggregate([
    {
      $match: {
        ...matchStage,
      },
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

  return result.length > 0
    ? result[0]
    : {
        totalIncome: 0,
        totalTransactions: 0,
        todayIncome: 0,
        todayTransactions: 0,
        totalPaymentsList: [],
      };
};

const todayAndTotalIncome = async (query: Record<string, any>) => {
  const { year } = query;

  const today = moment().startOf('day').toDate();
  const tomorrow = moment(today).add(1, 'days').toDate();
  const startDate = moment(`${year || moment().format('yyyy')}-01-01`)
    .startOf('year')
    .toDate();
  const endDate = moment(`${year || moment().format('yyyy')}-12-31`).endOf(
    'year',
  ).toDate;

  const [todayIncomeResult, totalIncomeResult] = await Promise.all([
    Payment.aggregate([
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
    Payment.aggregate([
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
  const monthlyIncomeResult = await Payment.aggregate([
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

  const todayIncome =
    todayIncomeResult.length > 0 ? todayIncomeResult[0].total : 0;
  const totalIncome =
    totalIncomeResult.length > 0 ? totalIncomeResult[0].total : 0;

  const properties = await Residence.countDocuments();
  return {
    todayIncome,
    totalIncome,
    monthlyIncome,
    properties,
  };
};

const PackagesStatisticsIncomes = async (query: Record<string, any>) => {
  // Extract query parameters
  const { daily, month, sixMonths, year, date } = query;

  // Define match stage for aggregation
  let matchStage: any = {
    type: paymentTypes.Subscription_Booking,
    status: 'completed',
  };

  // Define date range for filtering
  if (daily) {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'day').toDate();
    matchStage.createdAt = { $gte: today, $lt: tomorrow };
  } else if (month && year) {
    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (sixMonths) {
    const today = new Date();
    const sixMonthsAgo = moment(today).subtract(6, 'months').toDate();
    matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
  } else if (year) {
    const startDate = moment(`${year}-01-01`).startOf('year').toDate();
    const endDate = moment(`${year}-12-31`).endOf('year').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (date) {
    const formattedDate = moment(date);
    const startOfDay = formattedDate.startOf('day').toDate();
    const endOfDay = formattedDate.endOf('day').toDate();
    matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  // Create aggregation pipeline
  const aggregationPipeline: any[] = [{ $match: matchStage }];

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

  const result = await Payment.aggregate(aggregationPipeline);

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
  const totalIncome = await Payment.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalIncome: { $sum: '$amount' } } },
  ]).exec();

  // Get total transitions
  const transitions = await Payment.find({
    type: paymentTypes.Subscription_Booking,
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
};
const PercentageStatisticsIncomes = async (query: Record<string, any>) => {
  // Extract query parameters
  const { daily, month, sixMonths, year, date } = query;

  // Define match stage for aggregation
  let matchStage: any = {
    type: paymentTypes.Booking_Residence,
    status: 'completed',
  };

  // Define date range for filtering
  if (daily) {
    const today = moment().startOf('day').toDate();
    const tomorrow = moment(today).add(1, 'day').toDate();
    matchStage.createdAt = { $gte: today, $lt: tomorrow };
  } else if (month && year) {
    const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = moment(startDate).endOf('month').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (sixMonths) {
    const today = new Date();
    const sixMonthsAgo = moment(today).subtract(6, 'months').toDate();
    matchStage.createdAt = { $gte: sixMonthsAgo, $lt: today };
  } else if (year) {
    const startDate = moment(`${year}-01-01`).startOf('year').toDate();
    const endDate = moment(`${year}-12-31`).endOf('year').toDate();
    matchStage.createdAt = { $gte: startDate, $lte: endDate };
  } else if (date) {
    const formattedDate = moment(date);
    const startOfDay = formattedDate.startOf('day').toDate();
    const endOfDay = formattedDate.endOf('day').toDate();
    matchStage.createdAt = { $gte: startOfDay, $lte: endOfDay };
  }

  // Create aggregation pipeline
  const aggregationPipeline: any[] = [{ $match: matchStage }];

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

  const result = await Payment.aggregate(aggregationPipeline);

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
  const totalIncome = await Payment.aggregate([
    { $match: matchStage },
    { $group: { _id: null, totalIncome: { $sum: '$adminAmount' } } },
  ]).exec();

  return {
    totalMyIncome: totalIncome.length > 0 ? totalIncome[0].totalIncome : 0,
    monthlyIncome: formattedResult,
    halfYearlyIncome,
    yearlyIncome: yearlyIncomeObj,
  };
};

const calculatePackageNameByIncome = async (query: Record<string, any>) => {
  const { year, month } = query;

  // Calculate the start and end dates for the given month
  const startDate = moment(`${year}-${month}-01`).startOf('month').toDate();
  const endDate = moment(startDate).endOf('month').toDate();

  const incomeData = await Payment.aggregate([
    {
      $match: {
        status: 'completed',
        type: paymentTypes.Subscription_Booking,
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
};

const topLandlordIncome = async () => {
  const result = await Payment.aggregate([
    {
      $match: {
        type: paymentTypes.Booking_Residence,
        status: 'completed',
      },
    },
    {
      $group: {
        _id: '$residenceAuthority',
        totalIncome: { $sum: '$landlordAmount' },
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
        as: 'residenceAuthorityDetails',
      },
    },
    {
      $unwind: '$residenceAuthorityDetails',
    },

    {
      $project: {
        _id: 0,
        author: {
          name: '$residenceAuthorityDetails.name',
          email: '$residenceAuthorityDetails.email',
          image: '$residenceAuthorityDetails.image',
          role: '$residenceAuthorityDetails.role',
          phoneNumber: '$residenceAuthorityDetails.phoneNumber',
          address: '$residenceAuthorityDetails.address',
        },
        totalIncome: 1,
        totalTransactions: 1,
      },
    },
  ]);

  return result;
};

export const paymentsService = {
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
  returnUrl,
};
