"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatRoutes = void 0;
const express_1 = require("express");
const chat_controller_1 = require("./chat.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const chat_validation_1 = require("./chat.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(chat_validation_1.chatValidation.createChatValidation), chat_controller_1.chatController.createChat);
router.patch('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user), (0, validateRequest_1.default)(chat_validation_1.chatValidation.createChatValidation), chat_controller_1.chatController.updateChat);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user), chat_controller_1.chatController.deleteChat);
router.get('/my-chat-list', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user), chat_controller_1.chatController.getMyChatList);
router.get('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.user), chat_controller_1.chatController.getChatById);
exports.chatRoutes = router;
