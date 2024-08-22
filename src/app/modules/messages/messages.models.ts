import { Schema, Types, model } from 'mongoose';
import { IMessages, IMessagesModel } from './messages.interface'; 

const messageSchema = new Schema<IMessages>(
  {
    // id: {
    //   type: String,
    //   require: true,
    //   unique: true,
    // },
    text: {
      type: String,
      default: '',
    },
    imageUrl: {
      type: String,
      default: '',
    },
    seen: {
      type: Boolean,
      default: false,
    },
    sender: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    bookingId: {
      type: Types.ObjectId || null,
      required: false,
      ref: 'User',
      default: null,
    },
    showButton: {
      type: Boolean,
      default: false,
    },
    // isPaymentLink: {
    //   type: String,
    //   enum: isPaymentLinkStatus,
    //   default: '',
    // },
    chat: {
      type: Types.ObjectId,
      required: true,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  },
);

const Message = model<IMessages, IMessagesModel>('Messages', messageSchema);

export default Message;
