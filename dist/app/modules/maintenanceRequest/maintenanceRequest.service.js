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
exports.maintenanceRequestService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const maintenanceRequest_models_1 = __importDefault(require("./maintenanceRequest.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
const s3_1 = require("../../utils/s3");
const createMaintenanceRequest = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create maintenance request');
    }
    return result;
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllMaintenanceRequest = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const maintenanceRequestsModel = new QueryBuilder_1.default(maintenanceRequest_models_1.default.find().populate([
        { path: 'user', select: 'name email phoneNumber' },
        { path: 'property' },
    ]), query)
        .search(['status', 'property', 'problems'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield maintenanceRequestsModel.modelQuery;
    const meta = yield maintenanceRequestsModel.countTotal();
    return { data, meta };
});
const getMaintenanceRequestById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_models_1.default.findById(id).populate([
        { path: 'user', select: 'name email phoneNumber' },
        { path: 'property' },
    ]);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Maintenance request not found');
    }
    return result;
});
const AcceptMaintenanceRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_models_1.default.findByIdAndUpdate(id, { status: 'accepted' }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to accept maintenance request');
    }
    return result;
});
const cancelMaintenanceRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield maintenanceRequest_models_1.default.findByIdAndUpdate(id, { status: 'cancelled' }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to cancel maintenance request');
    }
    return result;
});
const deleteMaintenanceRequest = (id) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const result = yield maintenanceRequest_models_1.default.findByIdAndDelete(id);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to delete maintenance request');
    }
    const deleteKeys = [];
    if (result === null || result === void 0 ? void 0 : result.images) {
        (_a = result === null || result === void 0 ? void 0 : result.images) === null || _a === void 0 ? void 0 : _a.forEach(image => deleteKeys.push(`images/residence${image === null || image === void 0 ? void 0 : image.key}`));
    }
    if (deleteKeys.length) {
        yield (0, s3_1.deleteManyFromS3)(deleteKeys);
    }
    return result;
});
exports.maintenanceRequestService = {
    createMaintenanceRequest,
    getAllMaintenanceRequest,
    getMaintenanceRequestById,
    AcceptMaintenanceRequest,
    cancelMaintenanceRequest,
    deleteMaintenanceRequest,
};
