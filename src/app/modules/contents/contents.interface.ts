import { Model, ObjectId } from 'mongoose';

export interface IContents {
  _id?: string;
  createdBy: ObjectId;
  aboutUs?: string;
  termsAndConditions?: string;
  privacyPolicy?: string;
  supports?: string;
  faq?: string;
  isDeleted?: boolean;
}

export type IContentsModel = Model<IContents, Record<string, unknown>>;
