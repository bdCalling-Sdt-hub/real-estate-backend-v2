"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a random 6-digit number
    return otp.toString(); // Convert to string and return
};
exports.generateOtp = generateOtp;
