import AppError from '../utils/appError.js';

const HandleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const HandleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const HandleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const HandleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const HandleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

const HandleSyntaxError = () =>
  new AppError('Invalid JSON syntax. Please check your request body.', 400);

const HandleMulterError = () =>
  new AppError('File upload error. Please check your file and try again.', 400);

const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status || 'error',
    message: err.message,
    stack: err.stack,
    error: err,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      status: err.status || 'error',
      message: err.message,
    });
  } else {
    console.error('ERROR 💥', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server.',
    });
  }
};

const errorController = (err, req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    if (err.name === 'CastError') error = HandleCastErrorDB(error);
    if (err.name === 'ValidationError') error = HandleValidationErrorDB(error);
    if (err.code === 11000) error = HandleDuplicateFieldsDB(error);
    if (err.name === 'JsonWebTokenError') error = HandleJWTError();
    if (err.name === 'TokenExpiredError') error = HandleJWTExpiredError();
    if (err.name === 'SyntaxError') error = HandleSyntaxError();
    if (err.name === 'MulterError') error = HandleMulterError();

    sendErrorProd(error, res);
  }
};

export default errorController;
