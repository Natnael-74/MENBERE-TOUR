import express from 'express';
import path from 'path';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// eslint-disable-next-line import/no-extraneous-dependencies
import cookieParser from 'cookie-parser';
// eslint-disable-next-line import/no-extraneous-dependencies
import compression from 'compression';

import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import viewRouter from './routes/viewRoutes.js';
import AppError from './utils/appError.js';
import __dirname from './utils/directory.js';

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

//Serving static files
app.use(express.static(path.join(__dirname, '../public')));

app.use(compression());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", 'data:', 'blob:'],
        styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
        scriptSrc: [
          "'self'",
          'https://js.stripe.com',
          "'unsafe-inline'",
          'data:',
          'blob:',
        ],
        scriptSrcElem: [
          "'self'",
          'https://js.stripe.com',
          "'unsafe-inline'",
          'data:',
          'blob:',
        ],
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        fontSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'", 'ws:', 'wss:', 'https://js.stripe.com'],
        frameSrc: ["'self'", 'https://js.stripe.com'],
      },
    },
  }),
);

//request parser and size limit
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

const allLimiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});

const authLimiter = rateLimit({
  max: 10,
  windowMs: 5 * 60 * 1000,
  message:
    'Too many login attempts from this IP, please try again in 5 minutes!',
});

app.use('/api', allLimiter);
app.use('/api/v1/users/signup', authLimiter);
app.use('/api/v1/users/login', authLimiter);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

//View Routes
app.use('/', viewRouter);

//API
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/bookings', bookingRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
