"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const favoriteItemSchema = new mongoose_1.Schema({
    residence: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Residence',
    },
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
});
const FavoriteItem = (0, mongoose_1.model)('FavoriteItem', favoriteItemSchema);
exports.default = FavoriteItem;
