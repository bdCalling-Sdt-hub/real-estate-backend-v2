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
exports.BookingResidenceController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const bookingResidence_service_1 = require("./bookingResidence.service");
const createBookingResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield bookingResidence_service_1.BookingResidenceService.createBookingResidence(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Residence booked successfully',
        data: result,
    });
}));
const getAllBookingResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_service_1.BookingResidenceService.getAllBookingResidence(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'All booking residences retrieved successfully',
        data: result,
    });
}));
const myBookings = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    req.query.user = (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId;
    const result = yield bookingResidence_service_1.BookingResidenceService.myBookings(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'All my booking residences retrieved successfully',
        data: result,
    });
}));
const getBookingResidenceById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_service_1.BookingResidenceService.getBookingResidenceById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Booking residence retrieved successfully',
        data: result,
    });
}));
const canceledBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_service_1.BookingResidenceService.canceledBooking(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'residence booking  canceled successfully',
        data: result,
    });
}));
const approvedBooking = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_service_1.BookingResidenceService.approvedBooking(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'residence booking  approved successfully',
        data: result,
    });
}));
const deleteBookingResidence = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield bookingResidence_service_1.BookingResidenceService.deleteBookingResidence(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Booking residence deleted successfully',
        data: result,
    });
}));
exports.BookingResidenceController = {
    createBookingResidence,
    getAllBookingResidence,
    getBookingResidenceById,
    myBookings,
    canceledBooking,
    approvedBooking,
    deleteBookingResidence,
};
