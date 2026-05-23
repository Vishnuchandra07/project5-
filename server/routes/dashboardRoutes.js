import express from 'express';
import {
  getDashboardStats,
  getRevenueChart,
  getConversionStats,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/revenue-chart', getRevenueChart);
router.get('/conversion-stats', getConversionStats);

export default router;
