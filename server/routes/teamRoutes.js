import express from 'express';
import {
  getTeamMembers,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getTeamPerformanceSummary,
} from '../controllers/teamController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/performance/summary', getTeamPerformanceSummary);
router.route('/').get(getTeamMembers).post(createTeamMember);
router
  .route('/:id')
  .get(getTeamMemberById)
  .put(updateTeamMember)
  .delete(deleteTeamMember);

export default router;
