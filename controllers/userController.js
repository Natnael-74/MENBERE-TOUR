/* eslint-disable import/no-extraneous-dependencies */
import multer from 'multer';
import sharp from 'sharp';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/userModel.js';
import { getAll, getOne, updateOne, deleteOne } from './handleFactory.js';

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

export const uploadUserPhoto = upload.single('photo');

export const resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

export const getAllUsers = getAll(User);

export const getUser = getOne(User);

export const createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
});

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use updateMyPassword instead.',
        400,
      ),
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    return next(new AppError('User not found', 404));
  }

  //Convert to plain object and remove sensitive/internal fields
  const userSafe = updatedUser.toObject();
  delete userSafe.passwordResetToken;
  delete userSafe.passwordResetExpires;
  delete userSafe.passwordResetTokenCreatedAt;
  delete userSafe.passwordChangedAt;
  delete userSafe.__v;

  res.status(200).json({
    status: 'success',
    message: 'User data updated successfully',
    data: { user: userSafe },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  const deactivatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { active: false },
    { new: true },
  );

  if (!deactivatedUser) {
    return next(new AppError('User not found', 404));
  }

  res.status(204).json({
    status: 'success',
    message: 'User deactivated successfully',
  });
});

export const findDeactivatedUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: { $eq: false } }).select('+active');

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

export const getAdmins = catchAsync(async (req, res, next) => {
  const admins = await User.find({ role: 'admin' });

  res.status(200).json({
    status: 'success',
    results: admins.length,
    data: {
      admins,
    },
  });
});

export const getMe = catchAsync(async (req, res, next) => {
  req.params.id = req.user.id;
  next();
});
