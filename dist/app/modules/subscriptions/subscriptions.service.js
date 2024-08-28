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
exports.SubscriptionService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const subscriptions_models_1 = __importDefault(require("./subscriptions.models"));
const subscriptions_constants_1 = require("./subscriptions.constants");
// Create a subscription booking
const createSubscriptions = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Subscription failed');
    }
    return result;
});
// Get all subscription bookings
const getAllSubscriptions = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ResidenceModel = new QueryBuilder_1.default(subscriptions_models_1.default.find().populate(['user', 'package']), query)
        .search(subscriptions_constants_1.userSubscriptionsSearchableFields)
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield ResidenceModel.modelQuery;
    const meta = yield ResidenceModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get subscription booking by ID
const getSubscriptionById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_models_1.default.findById(id).populate(['user', 'package']);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription not found');
    }
    return result;
});
// Update subscription booking
const updateSubscription = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_models_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription update failed');
    }
    return result;
});
// Get my subscriptions
const mySubscriptions = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_models_1.default.findOne({
        user: userId,
        isActive: true,
    }).populate(['user', 'package']);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Fetching my subscriptions failed');
    }
    return result;
});
// Delete subscription booking
const deleteSubscriptions = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield subscriptions_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Subscription deletion failed');
    }
    return result;
});
exports.SubscriptionService = {
    createSubscriptions,
    getAllSubscriptions,
    getSubscriptionById,
    updateSubscription,
    mySubscriptions,
    deleteSubscriptions,
};
