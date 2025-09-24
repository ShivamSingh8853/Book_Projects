import { Router } from 'express';
import { updateReview, deleteReview } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Review management routes
router.put('/:id', authenticateToken, updateReview);
router.delete('/:id', authenticateToken, deleteReview);

export default router;
