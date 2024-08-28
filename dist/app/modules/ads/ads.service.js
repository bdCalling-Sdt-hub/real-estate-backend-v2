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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adsService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const ads_models_1 = __importDefault(require("./ads.models"));
// import { adsSearchableFields } from './ads.constants';
const s3_1 = require("../../utils/s3");
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const createAd = (payload, userId) => __awaiter(void 0, void 0, void 0, function* () {
    // const startDate = new Date();
    // const endDate = new Date(startDate);
    // payload?.month
    //   ? endDate.setMonth(endDate.getMonth() + parseInt(payload?.month))
    //   : endDate.setMonth(endDate.getMonth() + 1);
    // payload.startAt = startDate;
    // payload.expireAt = endDate;
    // payload.price = payload.month ? 2 * parseInt(payload?.month) : 2;
    const result = yield ads_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Ad creation failed');
    }
    // const paymentLink = await paymentsService.initiatePayment({
    //   user: userId,
    //   bookingId: result?._id,
    //   paymentType: 'Ads',
    // });
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// const getAllAds = async (
//   filters: IFilter,
//   paginationOptions: IPaginationOption,
// ) => {
//   const { searchTerm, ...filtersData } = filters;
//   const pipeline: any[] = [];
//   // Aggregation to populate referenced fields
//   pipeline.push({
//     $lookup: {
//       from: 'residences',
//       localField: 'property',
//       foreignField: '_id',
//       as: 'property',
//     },
//   });
//   pipeline.push({ $unwind: '$property' });
//   pipeline.push({
//     $lookup: {
//       from: 'users',
//       localField: 'property.host',
//       foreignField: '_id',
//       as: 'property.host',
//     },
//   });
//   pipeline.push({
//     $lookup: {
//       from: 'categories',
//       localField: 'property.category',
//       foreignField: '_id',
//       as: 'property.category',
//     },
//   });
//   pipeline.push({ $unwind: '$property.host' });
//   pipeline.push({ $unwind: '$property.category' });
//   let matchStage: any = {};
//   // Add search term conditions to matchStage
//   if (searchTerm) {
//     matchStage.$or = adsSearchableFields.map(field => ({
//       [field]: { $regex: searchTerm, $options: 'i' },
//     }));
//   }
//   // Add filtersData to matchStage
//   const nonNestedFilters: any = {};
//   const nestedFilters: any = {};
//   Object.keys(filtersData).forEach(key => {
//     if (key.includes('.')) {
//       nestedFilters[key] = filtersData[key];
//     } else {
//       nonNestedFilters[key] = filtersData[key];
//     }
//   });
//   // Merge non-nested filters into matchStage
//   matchStage = { ...matchStage, ...nonNestedFilters };
//   // Add $match stage early in the pipeline if applicable
//   if (Object.keys(matchStage).length > 0) {
//     pipeline.push({ $match: matchStage });
//   }
//   // Add nested filters after lookup and unwind
//   if (Object.keys(nestedFilters).length > 0) {
//     Object.keys(nestedFilters).forEach(key => {
//       pipeline.push({
//         $match: {
//           [key]: { $regex: nestedFilters[key], $options: 'i' },
//         },
//       });
//     });
//   }
//   // Sorting and pagination
//   const { page, limit, skip, sortBy, sortOrder } =
//     paginationHelper.calculatePagination(paginationOptions);
//   const sortConditions: { [key: string]: SortOrder } = {};
//   if (sortBy && sortOrder) {
//     sortConditions[sortBy] = sortOrder === 'desc' ? -1 : 1;
//   }
//   // Add sorting, skipping, and limiting at the end
//   pipeline.push({ $sort: sortConditions });
//   pipeline.push({ $skip: skip });
//   pipeline.push({ $limit: limit });
//   // Execute the aggregation pipeline
//   const results = await Ads.aggregate(pipeline);
//   const totalData = results.length;
//   return {
//     meta: { page, limit, total: totalData },
//     data: results,
//   };
// };
const getAllAds = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const adsModel = new QueryBuilder_1.default(ads_models_1.default.find().populate({ path: 'category', select: 'name _id' }), query)
        .search([])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield adsModel.modelQuery;
    const meta = yield adsModel.countTotal();
    return {
        data,
        meta,
    };
});
// const getAllAds = async(filters: IFilter,
//   paginationOptions: IPaginationOption,)=>{
// }
const getAdsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ads_models_1.default.findById(id).populate({
        path: 'category',
        select: 'name _id',
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Ad not found.');
    }
    return result;
});
const updateAd = (id, payload, 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
file) => __awaiter(void 0, void 0, void 0, function* () {
    if (file) {
        const ad = yield ads_models_1.default.findById(id);
        const bannerUrl = yield (0, s3_1.uploadToS3)({
            file: file,
            fileName: `images/ads/${Math.floor(100000 + Math.random() * 900000)}`,
        });
        payload.banner = bannerUrl;
    }
    const result = yield ads_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Ad update failed');
    }
    return result;
});
const deleteAds = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ads_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Ad deletion failed');
    }
    return result;
});
exports.adsService = {
    createAd,
    getAllAds,
    getAdsById,
    updateAd,
    deleteAds,
};
