import catchAsync from '../utils/catchAsync.js';
import Tour from '../models/tourModel.js';
import User from '../models/userModel.js';
import Review from '../models/reviewModel.js';
import Booking from '../models/bookingModel.js';
import AppError from '../utils/appError.js';

// export const alerts = (req, res, next) => {
//   const { alert } = req.query;
//   if (alert === 'booking')
//     res.locals.alert =
//       "Your booking was successful! Please check your email for a confirmation. If your booking doesn't show up here immediatly, please come back later.";
//   next();
// };

export const getOverview = catchAsync(async (req, res, next) => {
  const queryObj = {};

  // Search
  if (req.query.search) {
    queryObj.name = {
      $regex: req.query.search,
      $options: 'i',
    };
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = 6;
  const skip = (page - 1) * limit;

  const totalTours = await Tour.countDocuments(queryObj);
  const totalPages = Math.ceil(totalTours / limit);

  const tours = await Tour.find(queryObj).skip(skip).limit(limit);

  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
    showSearch: true,
    query: req.query.search,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  });
});

export const getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }

  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

export const getLoginForm = (req, res) => {
  res.status(200).render('login', {
    title: 'Log into your account',
  });
};

export const getSignupForm = (req, res) => {
  res.status(200).render('signup', {
    title: 'Sign up for an account',
  });
};

export const getForgotPasswordForm = (req, res) => {
  res.status(200).render('forgotPassword', {
    title: 'Forgot Password',
  });
};

export const getResetPasswordForm = (req, res) => {
  res.status(200).render('resetPassword', {
    title: 'Reset Password',
  });
};

export const getAccount = (req, res) => {
  res.status(200).render('account', {
    title: 'Your account',
    user: req.user,
  });
};

// export const getMyTours = catchAsync(async (req, res, next) => {
//   // 1) Find all bookings
//   const bookings = await Booking.find({ user: req.user.id });

//   // 2) Find tours with the returned IDs
//   const tourIDs = bookings.map((el) => el.tour);
//   const tours = await Tour.find({ _id: { $in: tourIDs } });

//   res.status(200).render('overview', {
//     title: 'My Tours',
//     tours,
//   });
// });

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

export const getMyReviews = catchAsync(async (req, res, next) => {
  const reviews = await Review.find({ user: req.user.id });
  res.status(200).render('myReviews', {
    title: 'My Reviews',
    reviews,
  });
});

export const getEditAndDeleteReview = catchAsync(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('There is no review with that ID.', 404));
  }

  res.status(200).render('editAndDeleteReview', {
    title: 'Review',
    review,
  });
});

export const getHome = (req, res) => {
  res.status(200).render('home', {
    title: 'Home',
    showHomeNav: true,
  });
};

export const getContactForm = (req, res) => {
  res.status(200).render('contact', {
    title: 'Contact Us',
  });
};

export const getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });

  if (!bookings) {
    return next(new AppError('There are no bookings for this user.', 404));
  }

  const tourIDs = bookings.map((el) => el.tour);
  if (!tourIDs) {
    return next(new AppError('There are no tours for this user booked.', 404));
  }

  const tours = await Tour.find({ _id: { $in: tourIDs } });
  if (!tours) {
    return next(new AppError('There are no tours for this user booked.', 404));
  }

  res.status(200).render('myTours', {
    title: 'My Tours',
    tours,
  });
});
