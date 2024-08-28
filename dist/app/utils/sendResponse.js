"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendResponse = (req, res, data) => {
    res.status(data === null || data === void 0 ? void 0 : data.statusCode).json({
        success: data.success,
        message: data.message ? req.t(data === null || data === void 0 ? void 0 : data.message) : null,
        data: data.data || {} || [],
        meta: data.meta,
    });
};
exports.default = sendResponse;
