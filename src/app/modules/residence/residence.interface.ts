import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

interface IAddress {
  governorate: string;
  area: string;
  block: string;
  street: string;
  house: string;
  floor: string;
  apartment: string;
}
interface IFile {
  url: string;
  key: string;
}

interface map {
  latitude: number;
  longitude: number;
  coordinates: [number];
  type: { type: string };
}

export interface IResidence {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  toObject: any;
  _id?: ObjectId;
  avgRating?: number | null;
  images: IFile[];
  videos: IFile[] | null | [];
  category: ObjectId;
  propertyName: string;
  squareFeet: string;
  bathrooms: string;
  bedrooms: string;
  features: string[];
  rentType: string;
  location: map;
  residenceType: string;
  perNightPrice: number;
  perMonthPrice: number;
  propertyAbout: string;
  address: IAddress;
  paciNo: number;
  rules: string;
  discount: number;
  discountCode: string;
  host: ObjectId;
  popularity: number;
  isDeleted: boolean;
}

export type IResidenceModel = Model<IResidence, Record<string, unknown>>;
