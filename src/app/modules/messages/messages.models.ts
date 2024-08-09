import { Schema, model } from 'mongoose';
import { IMessages, IMessagesModel } from './messages.interface';

const messageSchema = new Schema<IMessages>(
  {
    id: {
      type: String,
      require: true,
      unique: true,
    },
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
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    chat: {
      type: Schema.Types.ObjectId,
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
