"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const residenceSchema = new mongoose_1.Schema({
    images: [
        {
            url: { type: String },
            key: { type: String },
        },
    ],
    videos: [
        {
            url: { type: String },
            key: { type: String },
        },
    ],
    category: {
        type: mongoose_1.Types.ObjectId,
        required: true,
        ref: 'Category',
    },
    propertyName: {
        type: String,
        required: true,
    },
    squareFeet: {
        type: String,
        required: true,
    },
    bathrooms: {
        type: String,
        required: true,
    },
    bedrooms: {
        type: String,
        required: true,
    },
    residenceType: {
        type: String,
        required: true,
    },
    propertyAbout: {
        type: String,
        required: true,
    },
    features: {
        type: [],
    },
    rentType: {
        type: String,
        required: true,
    },
    paymentType: {
        type: String,
        required: true,
    },
    deposit: {
        type: String,
        required: false,
    },
    rent: {
        type: Number,
        min: 0,
        required: true,
    },
    document: {
        marriageCertificate: {
            type: Boolean,
            default: false,
        },
        salaryCertificate: {
            type: Boolean,
            default: false,
        },
        bankStatement: {
            type: Boolean,
            default: false,
        },
        passport: {
            type: Boolean,
            default: false,
        },
    },
    location: {
        latitude: {
            type: Number,
            require: true,
        },
        longitude: {
            type: Number,
            require: true,
        },
        type: {
            type: String,
            default: 'Point',
        },
    },
    address: {
        governorate: {
            type: String,
            required: true,
        },
        area: {
            type: String,
            required: true,
        },
        house: {
            type: String,
            required: true,
        },
        apartment: {
            type: String,
            required: true,
        },
        floor: {
            type: String,
            required: true,
        },
        street: {
            type: String,
            required: true,
        },
        block: {
            type: String,
            required: true,
        },
        avenue: {
            type: String,
            required: false,
        },
        additionalDirections: {
            type: String,
            required: false,
        },
    },
    discount: {
        type: Number,
        default: 0,
    },
    discountCode: {
        type: String,
        default: '',
    },
    host: {
        type: mongoose_1.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    averageRating: {
        type: Number,
        default: 0,
    },
    totalBooking: {
        type: Number,
        default: 0,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
});
residenceSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
residenceSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});
residenceSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    next();
});
const Residence = (0, mongoose_1.model)('Residence', residenceSchema);
exports.default = Residence;
