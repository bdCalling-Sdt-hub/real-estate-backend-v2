import { model, Schema } from 'mongoose';
import {
  IBookingDocuments,
  IBookingDocumentsModel,
} from './bookingDocuments.interface'; 

const bookingDocumentSchema = new Schema<IBookingDocuments>({
  booking: {
    type: Schema.Types.ObjectId,
    ref: 'BookingResidence',
  },

  landlord: {
    type: {
      signature: {
        type: String,
        default: null,
      },
      documents: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      civilId: {
        type: String,
        default: null,
      },
    },
  },
  user: {
    type: {
      signature: {
        type: String,
        default: null,
      },
      documents: [
        {
          url: { type: String },
          key: { type: String },
        },
      ],
      civilId: {
        type: String,
        default: null,
      },
    },
  },
});

const BookingDocuments = model<IBookingDocuments, IBookingDocumentsModel>(
  'BookingDocuments',
  bookingDocumentSchema,
);

export default BookingDocuments;
