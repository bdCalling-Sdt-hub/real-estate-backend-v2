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
exports.contentsService = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../error/AppError"));
const contents_models_1 = __importDefault(require("./contents.models"));
const QueryBuilder_1 = __importDefault(require("../../builder/QueryBuilder"));
// Create a new content
const createContents = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_models_1.default.create(payload);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content creation failed');
    }
    return result;
});
// Get all contents
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getAllContents = (query) => __awaiter(void 0, void 0, void 0, function* () {
    const ContentModel = new QueryBuilder_1.default(contents_models_1.default.find().populate(['createdBy']), query)
        .search(['createdBy'])
        .filter()
        .paginate()
        .sort()
        .fields();
    const data = yield ContentModel.modelQuery;
    const meta = yield ContentModel.countTotal();
    return {
        data,
        meta,
    };
});
// Get content by ID
const getContentsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_models_1.default.findById(id).populate(['createdBy']);
    if (!result) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'Oops! Content not found');
    }
    return result;
});
// Update content
const updateContents = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const content = yield contents_models_1.default.find({});
    if (!content) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, "content not found");
    }
    const result = yield contents_models_1.default.findByIdAndUpdate((_a = content[0]) === null || _a === void 0 ? void 0 : _a._id, payload, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content update failed');
    }
    return result;
});
// Delete content
const deleteContents = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_models_1.default.findByIdAndUpdate(id, {
        $set: {
            isDeleted: true,
        },
    }, { new: true });
    if (!result) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'Content deletion failed');
    }
    return result;
});
exports.contentsService = {
    createContents,
    getAllContents,
    getContentsById,
    updateContents,
    deleteContents,
};
