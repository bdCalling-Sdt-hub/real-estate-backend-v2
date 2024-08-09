import { model, Schema } from 'mongoose';
import { IFavoriteItem, IFavoriteItemModel } from './favoriteItem.interface';

const favoriteItemSchema = new Schema<IFavoriteItem>({
  residence: {
    type: Schema.Types.ObjectId,
    ref: 'Residence',
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const FavoriteItem = model<IFavoriteItem, IFavoriteItemModel>(
  'FavoriteItem',
  favoriteItemSchema,
);
export default FavoriteItem;
