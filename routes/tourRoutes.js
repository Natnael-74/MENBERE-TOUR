import express from 'express';
import {
  getAllTours,
  createTour,
  updateTour,
  deleteTour,
  getTour,
  top5CheapTours,
  premiumTours,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import reviewRouter from './reviewRoutes.js';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

// Top 5 cheap tours
router.route('/top-5-cheap').get(top5CheapTours, getAllTours);

// Premium tours (most expensive)
router.route('/premium-tours').get(premiumTours, getAllTours);

router.route('/tour-stats').get(protect, restrictTo('admin'), getTourStats);

router
  .route('/monthly-plan/:year')
  .get(protect, restrictTo('admin'), getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  .post(protect, restrictTo('admin', 'guide'), createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(protect, restrictTo('admin', 'guide'), updateTour)
  .delete(protect, restrictTo('admin', 'guide'), deleteTour);

export default router;
