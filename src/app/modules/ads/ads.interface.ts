// import { ObjectId } from 'mongoose';
// import { ObjectId } from 'mongodb';
import { Model, Schema } from 'mongoose';
import { IResidence } from '../residence/residence.interface';

export interface IAds {
  _id?: string;
  price: number;
  banner?: string;
  startAt: Date | string;
  expireAt: Date | string;
  status: boolean;
  tranId: string;
  property: Schema.Types.ObjectId | IResidence;
  isDeleted: boolean;
  paymentLink?: string;
  month?: string;
}

export type IAdsModel = Model<IAds, Record<string, unknown>>;

export type IPaginationOption = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
};

export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

export interface FiltersData {
  [key: string]: string; // Assuming filtersData has string values
}
