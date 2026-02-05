const mongoose = require('mongoose');

const schema = mongoose.Schema;

const reviewSchema = new schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty!']
    },
    rating: {
      type: Number,
      max: 5,
      min: 1
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A Review must belong to a tour.']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A Review must belong to a user.']
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre('save', function(next) {
  this.populate({ path: 'tour' }).populate({ path: 'user' });
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

