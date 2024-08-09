import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import Contents from './contents.models';
import { IContents } from './contents.interface';
import QueryBuilder from '../../builder/QueryBuilder';

// Create a new content
const createContents = async (payload: IContents) => {
  const result = await Contents.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Content creation failed');
  }
  return result;
};

// Get all contents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllContents = async (query: Record<string, any>) => {
  const ContentModel = new QueryBuilder(
    Contents.find().populate(['createdBy']),
    query,
  )
    .search(['createdBy'])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await ContentModel.modelQuery;
  const meta = await ContentModel.countTotal();
  return {
    data,
    meta,
  };
};

// Get content by ID
const getContentsById = async (id: string) => {
  const result = await Contents.findById(id).populate(['createdBy']);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Oops! Content not found');
  }
  return result;
};

// Update content
const updateContents = async ( payload: Partial<IContents>) => {
   const content = await Contents.find({})
  if(!content){
    throw new AppError(httpStatus.NOT_FOUND, "content not found");
  }
   
  const result = await Contents.findByIdAndUpdate(content[0]?._id, payload, { new: true });
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Content update failed');
  }
  return result;
};

// Delete content
const deleteContents = async (id: string) => {
  const result = await Contents.findByIdAndUpdate(
    id,
    {
      $set: {
        isDeleted: true,
      },
    },
    { new: true },
  );

  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Content deletion failed');
  }

  return result;
};

export const contentsService = {
  createContents,
  getAllContents,
  getContentsById,
  updateContents,
  deleteContents,
};
