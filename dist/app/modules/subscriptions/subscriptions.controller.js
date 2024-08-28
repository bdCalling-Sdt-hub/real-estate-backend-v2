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
exports.SubscriptionsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const subscriptions_service_1 = require("./subscriptions.service");
// Create user subscription
const createSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield subscriptions_service_1.SubscriptionService.createSubscriptions(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Subscription create successfully',
        data: result,
    });
}));
// Get all user subscriptions
const getAllSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_service_1.SubscriptionService.getAllSubscriptions(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'All subscriptions retrieved successfully',
        data: result,
    });
}));
// Get user subscription by ID
const getSubscriptionById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_service_1.SubscriptionService.getSubscriptionById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'subscription retrieved successfully',
        data: result,
    });
}));
// Update user subscription
const updateSubscription = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_service_1.SubscriptionService.updateSubscription(req.params.id, req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'subscription updated successfully',
        data: result,
    });
}));
// Get my subscriptions
const mySubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.userId;
    const result = yield subscriptions_service_1.SubscriptionService.mySubscriptions(userId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'My subscriptions retrieved successfully',
        data: result,
    });
}));
// Delete user subscription
const deleteSubscriptions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_service_1.SubscriptionService.deleteSubscriptions(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'subscription deleted successfully',
        data: result,
    });
}));
exports.SubscriptionsController = {
    createSubscriptions,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    mySubscriptions,
    deleteSubscriptions,
};
