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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adsCategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
});
// filter out deleted documents
adsCategorySchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
adsCategorySchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
adsCategorySchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
adsCategorySchema.statics.isCategoryExist = function (name) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield AdsCategory.findOne({ name: name });
    });
};
const AdsCategory = (0, mongoose_1.model)('AdsCategory', adsCategorySchema);
exports.default = AdsCategory;
