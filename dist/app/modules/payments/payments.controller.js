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
exports.paymentsController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const payments_service_1 = require("./payments.service");
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const initiatePayment = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    req.body.user = (_a = req === null || req === void 0 ? void 0 : req.user) === null || _a === void 0 ? void 0 : _a.userId;
    const result = yield payments_service_1.paymentsService.initiatePayment(req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'initial Url get successfully',
        data: result,
    });
}));
// //web hook
const webhook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.webhook(req === null || req === void 0 ? void 0 : req.body);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Payment initiate successfully',
        data: result,
    });
}));
const returnUrl = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.returnUrl(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'return url get successfully',
        data: result,
    });
}));
const myIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const result = yield payments_service_1.paymentsService.myIncome((_b = req === null || req === void 0 ? void 0 : req.user) === null || _b === void 0 ? void 0 : _b.userId, req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Payment successfully',
        data: result,
    });
}));
const myPayments = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.myPayments(req === null || req === void 0 ? void 0 : req.user.userId);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Payment successfully',
        data: result,
    });
}));
const packageIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.packageIncome();
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Package Income Get Successfully',
        data: result,
    });
}));
const PercentageIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.PercentageIncome();
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Percentage Income Get Successfully',
        data: result,
    });
}));
const todayAndTotalIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.todayAndTotalIncome(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Today And Total Income Get Successfully',
        data: result,
    });
}));
const PackagesStatisticsIncomes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.PackagesStatisticsIncomes(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Packages statistics incomes get successfully',
        data: result,
    });
}));
const PercentageStatisticsIncomes = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.PercentageStatisticsIncomes(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Percentage statistics incomes get successfully',
        data: result,
    });
}));
const calculatePackageNameByIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.calculatePackageNameByIncome(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'package incomes by package name get successfully',
        data: result,
    });
}));
const topLandlordIncome = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.topLandlordIncome();
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'Top landlord income get successfully',
        data: result,
    });
}));
const allTransitions = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield payments_service_1.paymentsService.allTransitions(req.query);
    (0, sendResponse_1.default)(req, res, {
        statusCode: 200,
        success: true,
        message: 'all transitions get successfully',
        data: result,
    });
}));
exports.paymentsController = {
    initiatePayment,
    webhook,
    returnUrl,
    myIncome,
    myPayments,
    packageIncome,
    PercentageIncome,
    todayAndTotalIncome,
    PackagesStatisticsIncomes,
    PercentageStatisticsIncomes,
    calculatePackageNameByIncome,
    allTransitions,
    topLandlordIncome,
};
