import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStage,
  deleteLead,
  getKanbanBoard,
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/kanban', getKanbanBoard);
router.route('/').get(getLeads).post(createLead);
router.patch('/:id/stage', updateLeadStage);
router
  .route('/:id')
  .get(getLeadById)
  .put(updateLead)
  .delete(deleteLead);

export default router;
