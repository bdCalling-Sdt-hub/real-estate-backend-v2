"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = __importDefault(require("../app/config"));
exports.s3Client = new client_s3_1.S3Client({
    region: `${config_1.default.aws.region}`,
    credentials: {
        accessKeyId: `${config_1.default.aws.accessKeyId}`,
        secretAccessKey: `${config_1.default.aws.secretAccessKey}`,
    },
});
