import { Model } from 'mongoose';

export interface IPackage {
  name: string;
  price: number;
  durationDays: number;
  features: string[];
  isDeleted: boolean;
}

export type IPackageModel = Model<IPackage, Record<string, unknown>>;
