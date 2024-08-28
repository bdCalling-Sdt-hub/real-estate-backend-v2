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
exports.categoryController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const adsCategory_service_1 = require("./adsCategory.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createAdsCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_service_1.categoryService.createAdsCategory(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Ads Category created successfully',
        data: result,
    });
}));
const getAllAdsCategories = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_service_1.categoryService.getAllAdsCategories(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Ads Categories retrieved successfully',
        data: result,
    });
}));
const getAdsCategoryById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_service_1.categoryService.getAdsCategoryById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Ads Category retrieved successfully',
        data: result,
    });
}));
const updateAdsCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_service_1.categoryService.updateAdsCategory(req.params.id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Ads Category updated successfully',
        data: result,
    });
}));
const deleteAdsCategory = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield adsCategory_service_1.categoryService.deleteAdsCategory(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Ads Category deleted successfully',
        data: result,
    });
}));
exports.categoryController = {
    createAdsCategory,
    getAllAdsCategories,
    getAdsCategoryById,
    updateAdsCategory,
    deleteAdsCategory,
};
