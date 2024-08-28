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
exports.storeFile = exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const unlinkSync = util_1.default.promisify(fs_1.default.unlink);
const deleteFile = (path) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (fs_1.default.existsSync(`../public/${path}`)) {
            yield unlinkSync(`../public/${path}`);
        }
        else {
            console.error('not found');
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }
    catch (err) {
        throw new Error(`Error deleting file: ${err.message}`);
    }
});
exports.deleteFile = deleteFile;
const storeFile = (folderName, filename) => {
    return `/uploads/${folderName}/${filename}`;
};
exports.storeFile = storeFile;
