/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorhandler';
import notFound from './app/middleware/notfound';
import router from './app/routes';
import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import i18nextMiddleware from 'i18next-http-middleware';
import bodyParser from 'body-parser';

const app: Application = express();
app.use(express.static('public'));

//parsers
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  }),
);

// Remove duplicate static middleware
// app.use(app.static('public'));

i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
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
app.use(i18nextMiddleware.handle(i18next));

// application routes
app.use('/api/v1', router);

// app.get('/image', (req, res) => {
//     res.send(req.t('Back-end is responding!!'))
// })
app.get('/', (req: Request, res: Response) => {
  res.send('server is running');
});
app.use(globalErrorHandler);

//Not Found
app.use(notFound);

export default app;
