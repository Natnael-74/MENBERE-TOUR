import express from 'express';
import {
  protect,
  // restrictTo,
  // login,
  // signup,
  // updateSettings,
  isLoggedIn,
} from '../controllers/authController.js';
import {
  getOverview,
  getTour,
  getLoginForm,
  getSignupForm,
  getForgotPasswordForm,
  getResetPasswordForm,
  getAccount,
  //getMyTours,
  getMyReviews,
  getEditAndDeleteReview,
  getContactForm,
  getMyTours,
} from '../controllers/viewsController.js';
import { createBookingCheckout } from '../controllers/bookingController.js';

const router = express.Router();

router.use(isLoggedIn);

router.get('/', createBookingCheckout, getOverview);
router.get('/overview', createBookingCheckout, getOverview);
router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);
router.get('/signup', getSignupForm);
router.get('/forgotPassword', getForgotPasswordForm);
router.get('/resetPassword/:token', getResetPasswordForm);
router.get('/me', protect, getAccount);

router.get('/my-reviews', protect, getMyReviews);
router.get('/my-tours', protect, getMyTours);

router.get('/editAndDeleteReview/:id', protect, getEditAndDeleteReview);

router.get('/contact', getContactForm);
export default router;
