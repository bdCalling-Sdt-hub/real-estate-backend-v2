"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middleware/globalErrorhandler"));
const notfound_1 = __importDefault(require("./app/middleware/notfound"));
const routes_1 = __importDefault(require("./app/routes"));
const i18next_1 = __importDefault(require("i18next"));
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_http_middleware_1 = __importDefault(require("i18next-http-middleware"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.static('public'));
//parsers
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));
// Remove duplicate static middleware
// app.use(app.static('public'));
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_http_middleware_1.default.LanguageDetector)
    .init({
    backend: {
        loadPath: './translation/{{lng}}/translation.json',
        // loadPath: _dirname + '/translation/{{lng}}/translation.json', --> not use _dirname and use (.) ->./translation
    },
    detection: {
        order: ['header'],
        caches: ['cookie'],
    },
    preload: ['en', 'ar'],
    fallbackLng: 'en', // default language en= english
});
app.use(i18next_http_middleware_1.default.handle(i18next_1.default));
// application routes
app.use('/api/v1', routes_1.default);
// app.get('/image', (req, res) => {
//     res.send(req.t('Back-end is responding!!'))
// })
app.get('/', (req, res) => {
    res.send('server is running');
});
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notfound_1.default);
exports.default = app;
