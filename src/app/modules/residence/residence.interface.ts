import { Model, ObjectId } from 'mongoose';

interface IAddress {
  governorate: string;
  area: string;
  house: string;
  apartment: string;
  floor: string;
  street: string;
  block: string;
  avenue: string;
  additionalDirections: string;
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
  averageRating: number | null;
  images: IFile[];
  videos: IFile[] | null | [];
  category: ObjectId;
  propertyName: string;
  squareFeet: string;
  bathrooms: string;
  bedrooms: string;
  residenceType: string;
  propertyAbout: string;
  features: string[];
  rentType: string;
  paymentType: string;
  deposit: string;
  rent: number;
  document: {
    marriageCertificate: boolean;
    salaryCertificate: boolean;
    bankStatement: boolean;
    passport: boolean;
  };
  location: map;
  address: IAddress;
  discount: number;
  discountCode: string;
  host: ObjectId;
  isDeleted: boolean;
  // popularity: number;

  // perNightPrice: number;
  // perMonthPrice: number;
  // paciNo: number;
  // rules: string;
}

export type IResidenceModel = Model<IResidence, Record<string, unknown>>;
