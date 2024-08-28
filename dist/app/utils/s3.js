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
exports.deleteManyFromS3 = exports.uploadManyToS3 = exports.deleteFromS3 = exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../config"));
const aws_1 = require("../../constants/aws");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../error/AppError"));
//upload a single file
const uploadToS3 = (_a) => __awaiter(void 0, [_a], void 0, function* (
// eslint-disable-next-line @typescript-eslint/no-explicit-any
{ file, fileName }) {
    const command = new client_s3_1.PutObjectCommand({
        Bucket: config_1.default.aws.bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    });
    try {
        const key = yield aws_1.s3Client.send(command);
        if (!key) {
            throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'File Upload failed');
        }
        const url = `https://${config_1.default.aws.bucket}.s3.${config_1.default.aws.region}.amazonaws.com/${fileName}`;
        return url;
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'File Upload failed');
    }
});
exports.uploadToS3 = uploadToS3;
// delete file from s3 bucket
const deleteFromS3 = (key) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const command = new client_s3_1.DeleteObjectCommand({
            Bucket: config_1.default.aws.bucket,
            Key: key,
        });
        yield aws_1.s3Client.send(command);
    }
    catch (error) {
        console.error(error);
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 's3 file delete failed');
    }
});
exports.deleteFromS3 = deleteFromS3;
// upload multiple files
const uploadManyToS3 = (files) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadPromises = files.map((_b) => __awaiter(void 0, [_b], void 0, function* ({ file, path, key }) {
            const newFileName = key
                ? key
                : `${Math.floor(100000 + Math.random() * 900000)}${Date.now()}`;
            const fileKey = `${path}/${newFileName}`;
            const command = new client_s3_1.PutObjectCommand({
                Bucket: config_1.default.aws.bucket,
                Key: fileKey,
                Body: file === null || file === void 0 ? void 0 : file.buffer,
            });
            yield aws_1.s3Client.send(command);
            const url = `https://${config_1.default.aws.bucket}.s3.${config_1.default.aws.region}.amazonaws.com/${fileKey}`;
            return { url, key: newFileName };
        }));
        const uploadedUrls = yield Promise.all(uploadPromises);
        return uploadedUrls;
    }
    catch (error) {
        throw new Error('File Upload failed');
    }
});
exports.uploadManyToS3 = uploadManyToS3;
// delete many file
const deleteManyFromS3 = (keys) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deleteParams = {
            Bucket: config_1.default.aws.bucket,
            Delete: {
                Objects: keys.map(key => ({ Key: key })),
                Quiet: false,
            },
        };
        const command = new client_s3_1.DeleteObjectsCommand(deleteParams);
        yield aws_1.s3Client.send(command);
    }
    catch (error) {
        throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'S3 file delete failed');
    }
});
exports.deleteManyFromS3 = deleteManyFromS3;
