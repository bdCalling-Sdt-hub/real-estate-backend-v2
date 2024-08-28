"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.role = exports.gender = exports.monthlyIncome = exports.USER_ROLE = void 0;
exports.USER_ROLE = {
    super_admin: 'super_admin',
    sub_admin: 'sub_admin',
    admin: 'admin',
    user: 'user',
    landlord: 'landlord',
    vendor: 'vendor',
};
exports.monthlyIncome = [
    'Under 800 KD',
    'Between 800 - 1499 KD',
    'Between 1500 - 3000 KD',
    'Over 3000 KD',
];
exports.gender = ['Male', 'Female', 'Others'];
exports.role = ['admin', 'user', 'super_admin', 'landlord', 'sub_admin'];
