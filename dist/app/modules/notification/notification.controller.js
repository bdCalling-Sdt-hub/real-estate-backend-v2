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
exports.notificationControllers = void 0;
/* eslint-disable @typescript-eslint/ban-ts-comment */
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const notification_service_1 = require("./notification.service");
const insertNotificationIntoDb = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield notification_service_1.notificationServices.insertNotificationIntoDb(req.body);
    //@ts-ignore
    const io = global === null || global === void 0 ? void 0 : global.socketio;
    if (io) {
        io.to();
    }
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification added successfully',
        data: result,
    });
}));
const getAllNotifications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const query = Object.assign({}, req.query);
    query['receiver'] = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield notification_service_1.notificationServices.getAllNotifications(query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notifications retrieved successfully',
        data: result === null || result === void 0 ? void 0 : result.data,
        meta: result === null || result === void 0 ? void 0 : result.meta,
    });
}));
const markAsDone = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield notification_service_1.notificationServices.markAsDone((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification marked as read successfully',
        data: result,
    });
}));
exports.notificationControllers = {
    insertNotificationIntoDb,
    getAllNotifications,
    markAsDone,
};
