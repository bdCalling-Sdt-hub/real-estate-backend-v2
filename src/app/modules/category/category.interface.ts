import { Model } from 'mongoose';

export interface ICategory {
  _id?: string;
  name: string;
  isDeleted: boolean;
}

export interface ICategoryModel extends Model<ICategory> {
  isCategoryExist(name: string): Promise<ICategory>;
}
