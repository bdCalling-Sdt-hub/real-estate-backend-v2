import { ObjectId } from 'mongodb';
import { Model } from 'mongoose';

interface IAddress {
  governorate: string;
  area: string;
  house: string;
  apartment: string;
  floor: string;
  street: string;
  block: string;
  avenue:string;
  additionalDirections:string
}
interface IFile {
  url: string;
  key: string;
}

interface map {
  latitude: number;
  longitude: number;
  coordinates?: [number];
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
  deposit: string;
  document: {
    marriageCertificate: boolean;
    salaryCertificate: boolean;
    bankStatement: boolean;
    passport: boolean;
  };
}

export type IResidenceModel = Model<IResidence, Record<string, unknown>>;
