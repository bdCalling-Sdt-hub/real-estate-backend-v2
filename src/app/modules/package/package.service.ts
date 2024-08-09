import AppError from '../../error/AppError';
import QueryBuilder from '../../builder/QueryBuilder';
import httpStatus from 'http-status'; 
import Package from './package.model';
import { IPackage } from './package.interface';
import { PackageSearchableFields } from './package.constants';

// Create a subscription
const createPackage = async (payload: IPackage) => {
  const result = await Package.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Package creation failed');
  }
  return result;
};

// Get all subscriptions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllPackages = async (query: Record<string, any>) => {
  const subscriptionsModel = new QueryBuilder(Package.find(), query)
    .search(PackageSearchableFields)
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await subscriptionsModel.modelQuery;
  const meta = await subscriptionsModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get subscription by ID
const getPackageById = async (id: string) => {
  const result = await Package.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package not found');
  }
  return result;
};

// Update subscription
const updatePackage = async (
  id: string,
  payload: Partial<IPackage>,
) => {
  const result = await Package.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Package update failed');
  }
  return result;
};

// Delete subscription
const deletePackage = async (id: string) => {
  const result = await Package.findByIdAndUpdate(
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
    throw new AppError(httpStatus.NOT_FOUND, 'Package deletion failed');
  }
  return result;
};

export const PackageService = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
};
