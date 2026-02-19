// eslint-disable-next-line import/no-extraneous-dependencies
import Stripe from 'stripe';

import Tour from '../models/tourModel.js';
import Booking from '../models/bookingModel.js';
//import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
//import AppError from '../utils/appError.js';
import {
  getAll,
  getOne,
  createOne,
  updateOne,
  deleteOne,
} from './handleFactory.js';

export const getAllBookings = getAll(Booking);

export const createBooking = createOne(Booking);

export const getBooking = getOne(Booking);

export const updateBooking = updateOne(Booking);

export const deleteBooking = deleteOne(Booking);

// Lazy initialization of Stripe - only when needed
let stripe;
const getStripe = () => {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set');
    }
    stripe = new Stripe(key);
  }
  return stripe;
};

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  const stripeInstance = getStripe();
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Check if tour exists
  if (!tour) return next(new Error('No tour found with that ID.'));

  // 2) Create checkout session
  const session = await stripeInstance.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment', // ensure it's payment mode
    success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100, // amount in cents
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
  });

  // 3) Create session as response
  res.status(200).json({
    status: 'success',
    session,
  });
});

export const createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});
