import { Router } from 'express';
import { addBook, getAllBooks, getBookById } from '../controllers/bookController';
import { addReview } from '../controllers/reviewController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Book routes
router.post('/', authenticateToken, addBook);
router.get('/', getAllBooks);
router.get('/:id', getBookById);

// Review routes for specific books
router.post('/:id/reviews', authenticateToken, addReview);

export default router;
