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
exports.favoriteItemController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const favoriteItem_service_1 = require("./favoriteItem.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createFavoriteItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.user = req.user.userId;
    const result = yield favoriteItem_service_1.favoriteItemService.createFavoriteItem(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Favorite item added successfully',
        data: result,
    });
}));
const getAllFavoriteItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_service_1.favoriteItemService.getAllFavoriteItem(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Favorite items retrieved successfully',
        data: result,
    });
}));
const getFavoriteItemById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_service_1.favoriteItemService.getFavoriteItemById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Favorite item retrieved successfully',
        data: result,
    });
}));
const getMyFavoriteItems = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    req.query.user = req.user.userId;
    // const filters = pick(req.query, favoriteItemFilterableFields); 
    // const paginationOptions = pick(req.query, paginationFields);  
    const result = yield favoriteItem_service_1.favoriteItemService.getAllFavoriteItem(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'My favorite items retrieved successfully',
        data: result,
    });
}));
const updateFavoriteItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_service_1.favoriteItemService.updateFavoriteItem(req.params.id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Favorite item updated successfully',
        data: result,
    });
}));
const deleteFavoriteItem = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield favoriteItem_service_1.favoriteItemService.deleteFavoriteItem(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Favorite item deleted successfully',
        data: result,
    });
}));
exports.favoriteItemController = {
    createFavoriteItem,
    getAllFavoriteItems,
    getFavoriteItemById,
    getMyFavoriteItems,
    updateFavoriteItem,
    deleteFavoriteItem,
};
