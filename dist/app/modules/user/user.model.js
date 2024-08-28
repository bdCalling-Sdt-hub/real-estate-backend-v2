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
exports.User = void 0;
const mongoose_1 = require("mongoose");
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: false,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String,
        default: `https://${config_1.default.aws.bucket}.s3.${config_1.default.aws.region}.amazonaws.com/profile.jpeg`,
    },
    phoneNumber: {
        type: String,
    },
    phoneCode: {
        type: String,
        required: true,
        default: '+1',
    },
    nationality: {
        type: String,
        default: '',
    },
    maritalStatus: {
        type: String,
        default: '',
    },
    gender: {
        type: String,
        enum: user_constant_1.gender,
    },
    dateOfBirth: {
        type: String,
        default: '',
    },
    job: {
        type: String,
        default: '',
    },
    monthlyIncome: {
        type: String,
        enum: user_constant_1.monthlyIncome,
        required: true,
    },
    bankInfo: {
        country: {
            type: String,
        },
        bankName: {
            type: String,
        },
        accountHolder: {
            type: String,
        },
        swiftCode: {
            type: String,
        },
        accountNumber: {
            type: String,
        },
        bankAddress: {
            type: String,
        },
    },
    documents: {
        type: {
            selfie: { type: String || null },
            documentType: { type: String || null },
            documents: [
                {
                    key: String || null,
                    url: String || null,
                },
            ],
        },
        required: false,
    },
    totalProperties: {
        type: Number,
    },
    verificationRequest: {
        type: String,
        enum: ['pending', 'send', 'accepted', 'rejected'],
        default: 'pending',
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    address: {
        type: String,
        default: '',
    },
    role: {
        type: String,
        enum: user_constant_1.role,
        default: 'user',
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    status: {
        type: String,
        enum: ['active', 'blocked'],
        default: 'active',
    },
    needsPasswordChange: {
        type: Boolean,
        default: false,
    },
    passwordChangedAt: {
        type: Date,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    tenants: {
        type: String,
        default: 0
    },
    verification: {
        otp: {
            type: String,
            select: false,
        },
        expiresAt: {
            type: Date,
            select: false,
        },
        status: {
            type: Boolean,
            default: false,
        },
    },
    balance: {
        type: Number,
        default: 0,
    },
    about: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const user = this;
        user.password = yield bcrypt_1.default.hash(user.password, Number(config_1.default.bcrypt_salt_rounds));
        next();
    });
});
// set '' after saving password
userSchema.post('save', 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function (error, doc, next) {
    doc.password = '';
    next();
});
// filter out deleted documents
userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
userSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
userSchema.statics.isUserExist = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ email: email }).select('+password');
    });
};
userSchema.statics.IsUserExistUserName = function (username) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findOne({ username: username }).select('+password');
    });
};
userSchema.statics.IsUserExistId = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield exports.User.findById(id).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
exports.User = (0, mongoose_1.model)('User', userSchema);
