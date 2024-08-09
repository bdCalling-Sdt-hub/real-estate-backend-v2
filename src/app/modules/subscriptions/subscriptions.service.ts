/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import { ISubscription } from './subscriptions.interface';
import Subscription from './subscriptions.models';
import { userSubscriptionsSearchableFields } from './subscriptions.constants';

// Create a subscription booking
const createSubscriptions = async (payload: ISubscription) => {
  const result = await Subscription.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Subscription failed');
  }
  return result;
};

// Get all subscription bookings
const getAllSubscriptions = async (query: Record<string, any>) => {
  const ResidenceModel = new QueryBuilder(
    Subscription.find().populate(['user', 'package']),
    query,
  )
    .search(userSubscriptionsSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await ResidenceModel.modelQuery;
  const meta = await ResidenceModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get subscription booking by ID
const getSubscriptionById = async (id: string): Promise<ISubscription> => {
  const result = await Subscription.findById(id).populate(['user', 'package']);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
  }
  return result;
};

// Update subscription booking
const updateSubscription = async (
  id: string,
  payload: Partial<ISubscription>,
) => {
  const result = await Subscription.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subscription update failed');
  }
  return result;
};

// Get my subscriptions
const mySubscriptions = async (userId: string) => {
  const result = await Subscription.findOne({
    user: userId,
    isActive: true,
  }).populate(['user', 'package']);

  if (!result) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Fetching my subscriptions failed',
    );
  }

  return result;
};

// Delete subscription booking
const deleteSubscriptions = async (id: string) => {
  const result = await Subscription.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    {
      new: true,
    },
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Subscription deletion failed');
  }

  return result;
};

export const SubscriptionService = {
  createSubscriptions,
  getAllSubscriptions,
  getSubscriptionById,
  updateSubscription,
  mySubscriptions,
  deleteSubscriptions,
};
