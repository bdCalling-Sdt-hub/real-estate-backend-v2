import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

interface IFile {
  url: string;
  key: number;
}
export interface IReview {
  user: ObjectId;
  residence: ObjectId;
  rating: number;
  comment: string;
  images: IFile[];
  isDeleted: boolean;
}

export type IReviewModel = Model<IReview, Record<string, unknown>>;
