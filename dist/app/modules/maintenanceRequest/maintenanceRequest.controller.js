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
exports.maintenanceRequestController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const maintenanceRequest_service_1 = require("./maintenanceRequest.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const createMaintenanceRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req === null || req === void 0 ? void 0 : req.files) {
        const { images } = req.files;
        if (images === null || images === void 0 ? void 0 : images.length) {
            const imgsArray = [];
            images === null || images === void 0 ? void 0 : images.map((image) => __awaiter(void 0, void 0, void 0, function* () {
                imgsArray.push({
                    file: image,
                    path: `images/maintenance-request`,
                });
            }));
            req.body.images = yield (0, s3_1.uploadManyToS3)(imgsArray);
        }
    }
    req.body.user = req.user.userId;
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.createMaintenanceRequest(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request created successfully',
        data: result,
    });
}));
const getAllMaintenanceRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.getAllMaintenanceRequest(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request get successfully',
        data: result,
    });
}));
const getMaintenanceRequestById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.getMaintenanceRequestById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request get successfully',
        data: result,
    });
}));
const acceptMaintenanceRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.AcceptMaintenanceRequest(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request accepted successfully',
        data: result,
    });
}));
const cancelMaintenanceRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.cancelMaintenanceRequest(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request canceled successfully',
        data: result,
    });
}));
const deleteMaintenanceRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_service_1.maintenanceRequestService.deleteMaintenanceRequest(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Maintenance request deleted successfully',
        data: result,
    });
}));
exports.maintenanceRequestController = {
    createMaintenanceRequest,
    getAllMaintenanceRequest,
    getMaintenanceRequestById,
    acceptMaintenanceRequest,
    cancelMaintenanceRequest,
    deleteMaintenanceRequest,
};
