"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handelMulterError = (err) => {
    let errorSources = [
        { path: '', message: 'File upload error' },
    ];
    switch (err.code) {
        case 'LIMIT_FILE_SIZE':
            errorSources = [
                {
                    path: err.code,
                    message: 'File size is too large.',
                },
            ];
            break;
        case 'LIMIT_UNEXPECTED_FILE':
            errorSources = [{ path: '', message: 'Too many files to upload.' }];
            break;
        default:
            errorSources = [{ path: '', message: err.message }];
            break;
    }
    const statusCode = 400;
    return { statusCode, message: 'Validation Error', errorSources };
};
exports.default = handelMulterError;
