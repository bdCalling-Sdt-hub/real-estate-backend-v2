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
exports.PackageService = void 0;
const AppError_1 = __importDefault(require("../../error/AppError"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const http_status_1 = __importDefault(require("http-status"));
const package_model_1 = __importDefault(require("./package.model"));
const package_constants_1 = require("./package.constants");
// Create a subscription
const createPackage = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_model_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Package creation failed');
    }
    return result;
});
// Get all subscriptions
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllPackages = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const subscriptionsModel = new QueryBuilder_1.default(package_model_1.default.find(), query)
        .search(package_constants_1.PackageSearchableFields)
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield subscriptionsModel.modelQuery;
    const meta = yield subscriptionsModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get subscription by ID
const getPackageById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_model_1.default.findById(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Package not found');
    }
    return result;
});
// Update subscription
const updatePackage = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_model_1.default.findByIdAndUpdate(id, payload, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Package update failed');
    }
    return result;
});
// Delete subscription
const deletePackage = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield package_model_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, {
        new: true,
    });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Package deletion failed');
    }
    return result;
});
exports.PackageService = {
    createPackage,
    getAllPackages,
    getPackageById,
    updatePackage,
    deletePackage,
};
