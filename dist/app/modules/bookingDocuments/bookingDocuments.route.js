"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingDocumentsRoutes = void 0;
const express_1 = require("express");
const bookingDocuments_controller_1 = require("./bookingDocuments.controller");
const multer_1 = __importStar(require("multer"));
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.landlord), upload.single('signature'), (0, parseData_1.default)(), bookingDocuments_controller_1.bookingDocumentsController.createBookingDocuments);
router.patch('/:bookingId', (0, auth_1.default)(user_constant_1.USER_ROLE.user), upload.single('signature'), (0, parseData_1.default)(), bookingDocuments_controller_1.bookingDocumentsController.updateBookingDocuments);
router.delete('/:id', bookingDocuments_controller_1.bookingDocumentsController.deleteBookingDocuments);
router.get('/:id', bookingDocuments_controller_1.bookingDocumentsController.getBookingDocumentsById);
router.get('/', bookingDocuments_controller_1.bookingDocumentsController.getAllBookingDocuments);
exports.bookingDocumentsRoutes = router;
