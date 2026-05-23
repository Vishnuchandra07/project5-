import express from 'express';
import {
  getActivities,
  getLeadActivities,
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getActivities);
router.get('/lead/:leadId', getLeadActivities);

export default router;
