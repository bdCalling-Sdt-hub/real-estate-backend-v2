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
exports.bookingDocumentsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const bookingDocuments_models_1 = __importDefault(require("./bookingDocuments.models"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const mongoose_1 = require("mongoose");
const createBookingDocuments = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create booking documents');
    }
    return result;
});
const getAllBookingDocuments = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const bookingModel = new QueryBuilder_1.default(bookingDocuments_models_1.default.find(), query)
        .search(['booking'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield bookingModel.modelQuery;
    const meta = yield bookingModel.countTotal();
    return {
        data,
        meta,
    };
});
const getBookingDocumentsById = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_models_1.default.findById(_id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Booking documents not found');
    }
    return result;
});
const updateBookingDocuments = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_models_1.default.findOneAndUpdate({ booking: new mongoose_1.Types.ObjectId(id) }, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Booking documents not found');
    }
    return result;
});
const deleteBookingDocuments = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingDocuments_models_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Booking documents not found');
    }
    return result;
});
exports.bookingDocumentsService = {
    createBookingDocuments,
    getAllBookingDocuments,
    getBookingDocumentsById,
    updateBookingDocuments,
    deleteBookingDocuments,
};
