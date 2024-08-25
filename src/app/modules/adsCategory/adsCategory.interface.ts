import { Model } from 'mongoose';

export interface IAdsCategory {
  _id?: string;
  name: string;
  isDeleted: boolean;
}

export interface IAdsCategoryModel extends Model<IAdsCategory> {
  isCategoryExist(name: string): Promise<IAdsCategory>;
}
