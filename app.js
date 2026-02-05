import express from 'express';
import morgan from 'morgan';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
