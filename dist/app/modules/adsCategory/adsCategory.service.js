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
exports.categoryService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const adsCategory_models_1 = __importDefault(require("./adsCategory.models"));
const createAdsCategory = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield adsCategory_models_1.default.isCategoryExist(payload.name);
    if (category) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Category already exists');
    }
    const result = yield adsCategory_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Category creation failed');
    }
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllAdsCategories = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const categoriesModel = new QueryBuilder_1.default(adsCategory_models_1.default.find(), query)
        .search(['name'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield categoriesModel.modelQuery;
    const meta = yield categoriesModel.countTotal();
    return {
        data,
        meta,
    };
});
const getAdsCategoryById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_models_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Ads Category not found');
    }
    return result;
});
const updateAdsCategory = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Ads Category update failed');
    }
    return result;
});
const deleteAdsCategory = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Ads Category deletion failed');
    }
    return result;
});
exports.categoryService = {
    deleteAdsCategory,
    updateAdsCategory,
    getAdsCategoryById,
    getAllAdsCategories,
    createAdsCategory,
};
