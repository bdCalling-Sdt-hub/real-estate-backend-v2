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
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../config"));
const sendEmail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com.",
        port: 587,
        secure: config_1.default.NODE_ENV === "production",
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: config_1.default.nodemailer_host_email,
            pass: config_1.default.nodemailer_host_pass,
        },
    });
    yield transporter.sendMail({
        from: "nurmdopu428@gmail.com", // sender address
        to, // list of receivers
        subject,
        text: "", // plain text body
        html, // html body
    });
});
exports.sendEmail = sendEmail;
