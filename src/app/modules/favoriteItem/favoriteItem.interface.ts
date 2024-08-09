import { Model, Schema } from 'mongoose';

export interface IFavoriteItem {
  residence: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

export type IFavoriteItemModel = Model<IFavoriteItem, Record<string, unknown>>;
