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
exports.maintenanceRequestRoutes = void 0;
const express_1 = require("express");
const maintenanceRequest_controller_1 = require("./maintenanceRequest.controller");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const parseData_1 = __importDefault(require("../../middleware/parseData"));
const multer_1 = __importStar(require("multer"));
const router = (0, express_1.Router)();
const storage = (0, multer_1.memoryStorage)();
const upload = (0, multer_1.default)({ storage });
router.post('/create-maintenanceRequest', (0, auth_1.default)(user_constant_1.USER_ROLE.user), upload.fields([{ name: 'images', maxCount: 3 }]), (0, parseData_1.default)(), maintenanceRequest_controller_1.maintenanceRequestController.createMaintenanceRequest);
router.patch('/accept/:id', maintenanceRequest_controller_1.maintenanceRequestController.acceptMaintenanceRequest);
router.patch('/cancel/:id', maintenanceRequest_controller_1.maintenanceRequestController.cancelMaintenanceRequest);
router.delete('/:id', maintenanceRequest_controller_1.maintenanceRequestController.deleteMaintenanceRequest);
router.get('/:id', maintenanceRequest_controller_1.maintenanceRequestController.getMaintenanceRequestById);
router.get('/', maintenanceRequest_controller_1.maintenanceRequestController.getAllMaintenanceRequest);
exports.maintenanceRequestRoutes = router;
