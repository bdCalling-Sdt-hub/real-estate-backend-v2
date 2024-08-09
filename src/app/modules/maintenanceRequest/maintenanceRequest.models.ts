import { model, Schema } from 'mongoose';
import {
  IMaintenanceRequest,
  IMaintenanceRequestModel,
} from './maintenanceRequest.interface';

const maintenanceRequestSchema = new Schema<IMaintenanceRequest>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Residence', required: true },
    problems: { type: String, required: true },
    images: [
      {
        url: {
          type: String,
        },
        key: {
          type: String,
        },
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'accepted', 'cancelled'],
      default: 'pending',
    },
    extraInfo: {
      type: {
        name: { type: String, required: true },
        apartment: { type: String, required: true },
        floor: { type: String, required: true },
        address: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
      },
    },
  },
  {
    timestamps: true,
  },
);

const MaintenanceRequest = model<IMaintenanceRequest, IMaintenanceRequestModel>(
  'MaintenanceRequest',
  maintenanceRequestSchema,
);

export default MaintenanceRequest;
