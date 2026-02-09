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

const router = express.Router({ mergeParams: true });

// Top 5 cheap tours
router.route('/top-5-cheap').get(top5CheapTours, getAllTours);

// Premium tours (most expensive)
router.route('/premium-tours').get(premiumTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(getAllTours).post(createTour);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);

export default router;
