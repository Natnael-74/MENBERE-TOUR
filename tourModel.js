const mongoose = require('mongoose');

const schema = mongoose.Schema;

const tourSchema = new schema(
  {
    name: {
      type: String,
      // required: [true, 'A tour must have a name.'],
      // unique: [true, 'A tour name must be unique.'],
    },
    summary: {
      type: String,
    },
    imageCover: {
      type: String,
    },
    images: [String],
    startDates: [Date],
    duration: {
      type: Number,
      // min: 5,
      // max: 30,
    },
    maxGroupSize: {
      type: Number,
      // min: 5,
      // max: 30,
    },
    difficulty: {
      type: String,
      required: true,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'The value must be either of easy ,medium or difficult',
      },
    },
    price: Number,
    description: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      max: 5,
      min: 1,
    },
    ratingsQuantity: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
