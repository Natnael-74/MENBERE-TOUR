import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from './handleFactory.js';

// Top 5 cheapest tours
export const top5CheapTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = 'price,-ratingsAverage';
  req.query.page = '1';
  req.query.price = { lte: '1000' };
  next();
};

export const premiumTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-price,-ratingsAverage';
  req.query.page = '1';
  req.query.price = { gte: '1000' };
  next();
};

// Get all tours
export const getAllTours = getAll(Tour); // getAll(Tour) === getAll(Tour, 'reviews')

// Get tour by ID
export const getTour = getOne(Tour, {
  path: 'reviews',
  select: '-__v -tour',
});
// Create tour
export const createTour = createOne(Tour);

// Update tour
export const updateTour = updateOne(Tour);

// Delete tour
export const deleteTour = deleteOne(Tour);

// Get tour statistics
export const getTourStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $group: {
        _id: '$difficulty',
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { stats },
  });
});

// Get monthly plan
export const getMonthlyPlan = catchAsync(async (req, res, next) => {
  const monthsArray = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const year = +req.params.year;

  if (Number.isNaN(year) || year < 1970 || year > 2100) {
    return next(
      new AppError('Please provide a valid year between 1970 and 2100', 400),
    );
  }

  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: {
        month: {
          $arrayElemAt: [monthsArray, { $subtract: ['$_id', 1] }],
        },
      },
    },
    {
      $project: { _id: 0 },
    },
    {
      $sort: { numTourStarts: -1 },
    },
  ]);

  res.status(200).json({
    status: 'success',
    data: { plan },
  });
});
