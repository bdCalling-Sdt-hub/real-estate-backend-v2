"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.favoriteItemService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const favoriteItem_models_1 = __importDefault(require("./favoriteItem.models"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const residence_utils_1 = require("../residence/residence.utils");
const mongoose_1 = require("mongoose");
const favoriteItem_constants_1 = require("./favoriteItem.constants");
const createFavoriteItem = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield favoriteItem_models_1.default.findOne({
        $and: [{ user: payload === null || payload === void 0 ? void 0 : payload.user }, { residence: payload === null || payload === void 0 ? void 0 : payload.residence }],
    });
    if (isExist) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Favorite item already exists');
    }
    const result = yield favoriteItem_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Favorite item creation failed');
    }
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllFavoriteItem = (query) => __awaiter(void 0, void 0, void 0, function* () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const allFavoriteItems = [];
    const favoriteItemModel = new QueryBuilder_1.default(favoriteItem_models_1.default.find().populate(['residence', 'user']), query)
        .search([])
        .filter()
        .paginate()
        .sort();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data = yield favoriteItemModel.modelQuery;
    const meta = yield favoriteItemModel.countTotal();
    if (data) {
        yield Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.map((items) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const avgRating = yield (0, residence_utils_1.calculateAverageRatingForResidence)((_a = items === null || items === void 0 ? void 0 : items.residence) === null || _a === void 0 ? void 0 : _a._id);
            allFavoriteItems.push(Object.assign(Object.assign({}, items === null || items === void 0 ? void 0 : items.toObject()), { avgRating })); // Use toObject() to get a plain object
        })));
    }
    return {
        allFavoriteItems,
        meta,
    };
});
const getFavoriteItemById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_models_1.default.findById(id).populate([
        'residence',
        'user',
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Favorite item not found');
    }
    return result;
});
const getMyFavoriteItems = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { searchTerm, user } = filters, filtersData = __rest(filters, ["searchTerm", "user"]);
    const andCondition = [];
    if (searchTerm) {
        andCondition.push({
            $or: favoriteItem_constants_1.favoriteItemSearchableFields.map(field => ({
                $regexMatch: {
                    input: `$${field}`,
                    regex: searchTerm,
                    options: 'i',
                },
            })),
        });
    }
    if (Object.entries(filtersData).length) {
        let userId = [{ $eq: ['$_id', '$$id'] }];
        const addition = (_b = Object.entries(filtersData)) === null || _b === void 0 ? void 0 : _b.map(([field, value]) => ({
            $eq: [`$${field}`, `${value}`],
        }));
        const newArray = [...userId, ...addition];
        andCondition.push({
            $and: newArray,
        });
    }
    // Aggregation pipeline
    const result = yield favoriteItem_models_1.default.aggregate([
        { $match: { user: new mongoose_1.Types.ObjectId(user) } },
        {
            $lookup: {
                from: 'residences',
                let: { id: '$residence' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: andCondition,
                            },
                        },
                    },
                ],
                as: 'residenceDate',
            },
        },
    ]);
    const filterData = result.filter(data => data.residenceDate.length > 0);
    const allFavoriteItems = yield Promise.all(filterData.map((items) => __awaiter(void 0, void 0, void 0, function* () {
        const avgRating = yield (0, residence_utils_1.calculateAverageRatingForResidence)(items.residence._id);
        return Object.assign(Object.assign({}, items), { avgRating });
    })));
    return allFavoriteItems;
});
const updateFavoriteItem = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Favorite item update failed');
    }
    return result;
});
const deleteFavoriteItem = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_models_1.default.deleteOne({ residence: id });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Favorite item deletion failed');
    }
    return result;
});
exports.favoriteItemService = {
    createFavoriteItem,
    getAllFavoriteItem,
    getFavoriteItemById,
    getMyFavoriteItems,
    updateFavoriteItem,
    deleteFavoriteItem,
};
