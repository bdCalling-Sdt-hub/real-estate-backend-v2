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
exports.bookingDocumentsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const bookingDocuments_service_1 = require("./bookingDocuments.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const s3_1 = require("../../utils/s3");
const user_constant_1 = require("../user/user.constant");
const createBookingDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const Url = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
        });
        if (req.user.role === user_constant_1.USER_ROLE.landlord) {
            req.body.landlord.signature = Url;
            req.body.landlord.signature = Url;
        }
        if (req.user.role === user_constant_1.USER_ROLE.user) {
            req.body.user.signature = Url;
        }
    }
    const result = yield bookingDocuments_service_1.bookingDocumentsService.createBookingDocuments(req.body);
    (0, sendResponse_1.default)(req, res, {
        success: true,
        statusCode: 200,
        message: 'Booking documents created successfully.',
        data: result,
    });
}));
const getAllBookingDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_service_1.bookingDocumentsService.getAllBookingDocuments(req.query);
    (0, sendResponse_1.default)(req, res, {
        success: true,
        statusCode: 200,
        message: 'Booking documents retrieved successfully.',
        data: result,
    });
}));
const getBookingDocumentsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_service_1.bookingDocumentsService.getBookingDocumentsById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        success: true,
        statusCode: 200,
        message: 'Booking documents retrieved successfully.',
        data: result,
    });
}));
const updateBookingDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.file) {
        const Url = yield (0, s3_1.uploadToS3)({
            file: req.file,
            fileName: `images/signatures/${Math.floor(100000 + Math.random() * 900000)}`,
        });
        if (req.user.role === user_constant_1.USER_ROLE.landlord) {
            req.body.landlord.signature = Url;
            req.body.landlord.signature = Url;
        }
        if (req.user.role === user_constant_1.USER_ROLE.user) {
            req.body.user.signature = Url;
        }
    }
    const result = yield bookingDocuments_service_1.bookingDocumentsService.updateBookingDocuments(req.params.bookingId, req.body);
    (0, sendResponse_1.default)(req, res, {
        success: true,
        statusCode: 200,
        message: 'Booking documents add successfully.',
        data: result,
    });
}));
const deleteBookingDocuments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () { }));
exports.bookingDocumentsController = {
    createBookingDocuments,
    getAllBookingDocuments,
    getBookingDocumentsById,
    updateBookingDocuments,
    deleteBookingDocuments,
};
