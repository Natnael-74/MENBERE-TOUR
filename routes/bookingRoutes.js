import express from 'express';
import {
  getCheckoutSession,
  getAllBookings,
  createBooking,
  getBooking,
  updateBooking,
  deleteBooking,
} from '../controllers/bookingController.js';
import { protect, restrictTo } from '../controllers/authController.js';

const router = express.Router();

router.get('/checkout-session/:tourId', protect, getCheckoutSession);

router.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  getCheckoutSession,
);

router.use(restrictTo('admin'));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
