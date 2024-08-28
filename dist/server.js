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
exports.io = void 0;
const http_1 = require("http");
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const socketIo_1 = __importDefault(require("./socketIo"));
let server;
exports.io = (0, socketIo_1.default)((0, http_1.createServer)(app_1.default));
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.connect(config_1.default.database_url);
            server = app_1.default.listen(Number(config_1.default.port), 
            // config.ip as string, 
            () => {
                console.log(`app is listening on port ${config_1.default.ip} : ${config_1.default.port}`);
            });
            exports.io.listen(Number(config_1.default.socket_port));
            console.log(`Socket is listening on port ${config_1.default.ip} : ${config_1.default.socket_port}`);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            global.socketio = exports.io;
        }
        catch (err) {
            console.log(err);
        }
    });
}
main();
process.on('unhandledRejection', err => {
    console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
    if (server) {
        server.close(() => {
            process.exit(1);
        });
    }
    process.exit(1);
});
process.on('uncaughtException', () => {
    console.log(`😈 uncaughtException is detected , shutting down ...`);
    process.exit(1);
});
