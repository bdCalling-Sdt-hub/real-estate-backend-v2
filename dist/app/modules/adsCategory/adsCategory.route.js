"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdsCategoryRoutes = void 0;
const express_1 = require("express");
const adsCategory_controller_1 = require("./adsCategory.controller");
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const adsCategory_validation_1 = require("./adsCategory.validation");
const auth_1 = __importDefault(require("../../middleware/auth"));
const user_constant_1 = require("../user/user.constant");
const router = (0, express_1.Router)();
router.post('/create-category', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord), (0, validateRequest_1.default)(adsCategory_validation_1.CategoriesZodValidation.CreateCategorySchema), adsCategory_controller_1.categoryController.createAdsCategory);
router.patch('/update/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.user, user_constant_1.USER_ROLE.landlord, user_constant_1.USER_ROLE.landlord), (0, validateRequest_1.default)(adsCategory_validation_1.CategoriesZodValidation.UpdateCategorySchema), adsCategory_controller_1.categoryController.updateAdsCategory);
// router.get('/all', categoryController.getAllCategories);
router.delete('/:id', (0, auth_1.default)(user_constant_1.USER_ROLE.admin, user_constant_1.USER_ROLE.sub_admin, user_constant_1.USER_ROLE.sub_admin), adsCategory_controller_1.categoryController.deleteAdsCategory);
router.get('/:id', adsCategory_controller_1.categoryController.getAdsCategoryById);
router.get('/', adsCategory_controller_1.categoryController.getAllAdsCategories);
exports.AdsCategoryRoutes = router;