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
exports.residenceController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const residence_service_1 = require("./residence.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const user_constant_1 = require("../user/user.constant");
const createResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (req.user.role !== user_constant_1.USER_ROLE.admin) {
        req.body.host = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    }
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { images, videos } = req.files;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/residence`,
                });
            }));
            req.body.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
        if (videos === null || videos === void 0 ? void 0 : videos.length) {
            const videoArray = [];
            videos === null || videos === void 0 ? void 0 : videos.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                videoArray.push({ file: image, path: `videos/residence` });
            }));
            req.body.videos = yield (0, s3_1.uploadManyToS3)(videoArray);
        }
    }
    const result = yield residence_service_1.ResidenceService.createResidence(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Residence created successfully',
        data: result,
    });
}));
const getAllResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield residence_service_1.ResidenceService.getAllResidence(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'All residences retrieved successfully',
        data: result,
    });
}));
const getResidenceById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield residence_service_1.ResidenceService.getResidenceById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Residence retrieved successfully',
        data: result,
    });
}));
const updateResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { images, videos } = req.files;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({ file: image, path: `images/residence` });
            }));
            req.body.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
        if (videos === null || videos === void 0 ? void 0 : videos.length) {
            const videoArray = [];
            videos === null || videos === void 0 ? void 0 : videos.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                videoArray.push({ file: image, path: `videos/residence` });
            }));
            req.body.videos = yield (0, s3_1.uploadManyToS3)(videoArray);
        }
    }
    const result = yield residence_service_1.ResidenceService.updateResidence(id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Residence updated successfully',
        data: result,
    });
}));
const deleteResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const result = yield residence_service_1.ResidenceService.deleteResidence(id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Residence deleted successfully',
        data: result,
    });
}));
exports.residenceController = {
    createResidence,
    getAllResidence,
    getResidenceById,
    updateResidence,
    deleteResidence,
};
