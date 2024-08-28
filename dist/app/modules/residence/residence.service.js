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
exports.ResidenceService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const residence_models_1 = __importDefault(require("./residence.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const residence_constants_1 = require("./residence.constants");
const s3_1 = require("../../utils/s3");
const residence_utils_1 = require("./residence.utils");
const user_model_1 = require("../user/user.model");
const createResidence = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(payload === null || payload === void 0 ? void 0 : payload.host)) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Unauthorized access');
    }
    if (!(payload === null || payload === void 0 ? void 0 : payload.images)) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'images is required');
    }
    const result = yield residence_models_1.default.create(payload);
    yield user_model_1.User.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.host, { $inc: { totalProperties: 1 } }, { timestamps: false });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence creation failed');
    }
    return result;
});
//http://your-api-endpoint/residences?monthlyPrice=0-100&dailyPrice=50-200&sortByPopularity=true&searchTerm=example&sort=createdAt&page=1&limit=10&fields=propertyName,squareFeet
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllResidence = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const allResidence = [];
    // const features = query.features ? query.features.split(',') : [];
    const ResidenceModel = new QueryBuilder_1.default(residence_models_1.default.find().populate([
        { path: 'category', select: 'name _id' },
        {
            path: 'host',
            select: 'name email image phoneNumber role verificationRequest',
        },
    ]), query)
        .search(residence_constants_1.residenceSearchableFields)
        .filter()
        .paginate()
        .rangeFilter('rent', query.rent)
        .arrayFilter('features', query === null || query === void 0 ? void 0 : query.features)
        .sort()
        .fields();
    const data = yield ResidenceModel.modelQuery;
    const meta = yield ResidenceModel.countTotal();
    if ((data === null || data === void 0 ? void 0 : data.length) > 0) {
        yield Promise.all(data.map((residence) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const review = yield (0, residence_utils_1.calculateAverageRatingForResidence)((_a = residence === null || residence === void 0 ? void 0 : residence._id) === null || _a === void 0 ? void 0 : _a.toString());
            allResidence.push(Object.assign(Object.assign({}, residence === null || residence === void 0 ? void 0 : residence.toObject()), review));
        })));
    }
    return {
        allResidence: allResidence,
        meta,
    };
});
const getResidenceById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield residence_models_1.default.findById(id).populate([
        { path: 'category', select: 'name _id' },
        { path: 'host', select: 'name email image phoneNumber role' },
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Residence not found');
    }
    const avgRating = yield (0, residence_utils_1.calculateAverageRatingForResidence)((_b = result === null || result === void 0 ? void 0 : result._id) === null || _b === void 0 ? void 0 : _b.toString());
    return Object.assign(Object.assign({}, result.toObject()), avgRating);
});
const updateResidence = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield residence_models_1.default.findByIdAndUpdate(id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence update failed');
    }
    return result;
});
const deleteResidence = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const result = yield residence_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Residence deletion failed');
    }
    yield user_model_1.User.findByIdAndUpdate(result === null || result === void 0 ? void 0 : result.host, { inc: { totalProperties: -1 } });
    const deleteKeys = [];
    if (result === null || result === void 0 ? void 0 : result.images) {
        (_c = result === null || result === void 0 ? void 0 : result.images) === null || _c === void 0 ? void 0 : _c.forEach(image => deleteKeys.push(`images/residence/${image === null || image === void 0 ? void 0 : image.key}`));
    }
    if (result === null || result === void 0 ? void 0 : result.videos) {
        (_d = result === null || result === void 0 ? void 0 : result.videos) === null || _d === void 0 ? void 0 : _d.forEach(video => deleteKeys.push(`videos/residence/${video === null || video === void 0 ? void 0 : video.key}`));
    }
    if (deleteKeys.length) {
        yield (0, s3_1.deleteManyFromS3)(deleteKeys);
    }
    return result;
});
exports.ResidenceService = {
    createResidence,
    getAllResidence,
    getResidenceById,
    updateResidence,
    deleteResidence,
};
