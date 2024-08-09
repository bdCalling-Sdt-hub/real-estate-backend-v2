import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IMaintenanceRequest } from './maintenanceRequest.interface';
import MaintenanceRequest from './maintenanceRequest.models';
import QueryBuilder from '../../builder/QueryBuilder';
import { deleteManyFromS3 } from '../../utils/s3';

const createMaintenanceRequest = async (payload: IMaintenanceRequest) => {
  const result = await MaintenanceRequest.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create maintenance request',
    );
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllMaintenanceRequest = async (query: Record<string, any>) => {
  const maintenanceRequestsModel = new QueryBuilder(
    MaintenanceRequest.find().populate([
      { path: 'user', select: 'name email phoneNumber' },
      { path: 'property' },
    ]),
    query,
  )
    .search(['status', 'property', 'problems'])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data: IMaintenanceRequest[] | [] =
    await maintenanceRequestsModel.modelQuery;
  const meta = await maintenanceRequestsModel.countTotal();
  return { data, meta };
};

const getMaintenanceRequestById = async (id: string) => {
  const result = await MaintenanceRequest.findById(id).populate([
    { path: 'user', select: 'name email phoneNumber' },
    { path: 'property' },
  ]);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Maintenance request not found');
  }
  return result;
};

const AcceptMaintenanceRequest = async (id: string) => {
  const result = await MaintenanceRequest.findByIdAndUpdate(
    id,
    { status: 'accepted' },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to accept maintenance request',
    );
  }
  return result;
};

const cancelMaintenanceRequest = async (id: string) => {
  const result = await MaintenanceRequest.findByIdAndUpdate(
    id,
    { status: 'cancelled' },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to cancel maintenance request',
    );
  }
  return result;
};

const deleteMaintenanceRequest = async (id: string) => {
  const result = await MaintenanceRequest.findByIdAndDelete(id);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete maintenance request',
    );
  }

  const deleteKeys: string[] = [];

  if (result?.images) {
    result?.images?.forEach(image =>
      deleteKeys.push(`images/residence${image?.key}`),
    );
  }
  if (deleteKeys.length) {
    await deleteManyFromS3(deleteKeys);
  }

  return result;
};

export const maintenanceRequestService = {
  createMaintenanceRequest,
  getAllMaintenanceRequest,
  getMaintenanceRequestById,
  AcceptMaintenanceRequest,
  cancelMaintenanceRequest,
  deleteMaintenanceRequest,
};
