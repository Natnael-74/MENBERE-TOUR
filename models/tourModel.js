import mongoose from 'mongoose';
import slugify from 'slugify';
import validator from 'validator';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or equal than 40 characters'],
      minlength: [10, 'A tour name must have more or equal than 10 characters'],
      validate: {
        validator: function (val) {
          return validator.isAlpha(val.replace(/\s/g, ''));
        },
        message: 'Tour name must only contain characters',
      },
    },

    slug: String,

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      max: [10000, 'A tour price must be less than or equal to 10000'],
      min: [100, 'A tour price must be greater than or equal to 0'],
    },

    discount: {
      type: Number,
      validate: {
        validator: function (val) {
          // 'this' only points to current doc on NEW document creation.DO NOT work on Updates.
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },

    images: [String],

    // locations: {
    //   type: String,
    //   required: [true, 'A tour must have a location'],
    //   trim: true,
    // },

    // startLocation: {
    //   type: String,
    //   required: [true, 'A tour must have a start location'],
    //   trim: true,
    // },

    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
      min: [1, 'A tour duration must be at least 1 day'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size'],
      min: [3, 'A tour group size must be at least 3 people'],
    },

    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  if (!this.duration || this.duration < 7) return 'Less than a week';
  return Math.ceil(this.duration / 7);
});

//Virtual Populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

tourSchema.pre('save', function () {
  this.slug = slugify(this.name, { lower: true });
});

tourSchema.pre(/^find/, function () {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
