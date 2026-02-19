/* eslint-disable import/no-extraneous-dependencies */
import multer from 'multer';
import sharp from 'sharp';

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

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadTourPhoto = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

export const resizeTourPhoto = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover || !req.files.images) return next();

  // 1) Cover image
  const filename = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.file.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${filename}`);

  req.body.imageCover = filename;

  // 2) Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filenameImages = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${filenameImages}`);

      req.body.images.push(filenameImages);
    }),
  );
  next();
});
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
