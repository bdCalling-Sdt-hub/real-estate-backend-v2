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
exports.adsControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const ads_service_1 = require("./ads.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const s3_1 = require("../../utils/s3");
const createAds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const bannerUrl = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/ads/${Math.floor(100000 + Math.random() * 900000)}`,
        });
        req.body.banner = bannerUrl;
    }
    const result = yield ads_service_1.adsService.createAd(req.body, req.user.userId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ad created successfully',
        data: result,
    });
}));
const getAllAds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield ads_service_1.adsService.getAllAds(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'all ads found successfully',
        data: result,
    });
}));
const getAdsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield ads_service_1.adsService.getAdsById(id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'get ads successfully!',
        data: result,
    });
}));
const updateAds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield ads_service_1.adsService.updateAd(id, req.body, req.file);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ad updated successfully',
        data: result,
    });
}));
const deleteAds = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield ads_service_1.adsService.deleteAds(id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'ad deleted successfully',
        data: result,
    });
}));
exports.adsControllers = {
    createAds,
    getAllAds,
    getAdsById,
    updateAds,
    deleteAds,
};
