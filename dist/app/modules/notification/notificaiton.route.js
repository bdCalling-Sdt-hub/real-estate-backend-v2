"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const notification_controller_1 = require("./notification.controller");
const router = (0, express_1.Router)();
// router.post("/",)
router.get('/', (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), notification_controller_1.notificationControllers.getAllNotifications);
router.patch("/", (0, auth_1.default)(user_constant_1.USER_ROLE.vendor, user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.user), notification_controller_1.notificationControllers.markAsDone);
exports.notificationRoutes = router;
