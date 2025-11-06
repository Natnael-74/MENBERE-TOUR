const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const APIFeatures = require('../utils/apiFeatures');

/**
 * Get all documents (supports nested routes)
 * e.g., /tours/:tourId/reviews → automatically filters by tourId
 */
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    // Handle nested routes dynamically
    for (const [key, value] of Object.entries(req.params)) {
      if (key.endsWith('Id')) {
        const fieldName = key.replace('Id', '');
        filter[fieldName] = value;
      }
    }

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(200).json({
      status: 'success',
      results: docs.length,
      data: { data: docs },
    });
  });

/**
 * Get a single document
 * Optional population for relationships
 */
exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);

    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

/**
 * Create a document
 * Supports nested route auto-fill (e.g., tourId, userId)
 */
exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    // Auto-fill fields from nested route params
    for (const [key, value] of Object.entries(req.params)) {
      if (key.endsWith('Id')) {
        const fieldName = key.replace('Id', '');
        req.body[fieldName] = value;
      }
    }

    // Optional: attach authenticated user
    if (req.user && !req.body.user) req.body.user = req.user.id;

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });

/**
 * Update a document
 */
exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { data: doc },
    });
  });

/**
 * Delete a document
 */
exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({ status: 'success', data: null });
  });
