"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contentsRoutes = void 0;
const express_1 = require("express");
const contents_controller_1 = require("./contents.controller");
const user_constant_1 = require("../user/user.constant");
const auth_1 = __importDefault(require("../../middleware/auth"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const contents_validation_1 = require("./contents.validation");
// import parseData from '../../middleware/parseData';
const router = (0, express_1.Router)();
router.post('/create-content', 
// parseData,
(0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), (0, validateRequest_1.default)(contents_validation_1.contentsValidator.createContentsZodSchema), contents_controller_1.contentsController.createContents);
router.put('/', (0, auth_1.default)(user_constant_1.USER_ROLE.super_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.admin), 
// validateRequest(contentsValidator.updateContentsZodSchema),
contents_controller_1.contentsController.updateContents);
// router.get('/all', contentsController.getAllContents);
// router.delete(
//   '/:id',
//   auth(USER_ROLE.super_admin, USER_ROLE.sub_admin, USER_ROLE.admin),
//   contentsController.deleteContents,
// );
router.get('/:id', contents_controller_1.contentsController.getContentsById);
router.get('/', contents_controller_1.contentsController.getAllContents);
exports.contentsRoutes = router;
