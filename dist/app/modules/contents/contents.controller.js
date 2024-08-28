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
exports.contentsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const contents_service_1 = require("./contents.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const createContents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_service_1.contentsService.createContents(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Content created successfully',
        data: result,
    });
}));
// Get all contents
const getAllContents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_service_1.contentsService.getAllContents(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Contents retrieved successfully',
        data: result,
    });
}));
// Get contents by ID
const getContentsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_service_1.contentsService.getContentsById(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Content retrieved successfully',
        data: result,
    });
}));
// Update contents
const updateContents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_service_1.contentsService.updateContents(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Content updated successfully',
        data: result,
    });
}));
// Delete contents
const deleteContents = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield contents_service_1.contentsService.deleteContents(req.params.id);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Content deleted successfully',
        data: result,
    });
}));
exports.contentsController = {
    createContents,
    getAllContents,
    getContentsById,
    updateContents,
    deleteContents,
};
