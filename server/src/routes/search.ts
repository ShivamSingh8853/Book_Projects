import { Router } from 'express';
import { searchBooks } from '../controllers/searchController';

const router = Router();

router.get('/', searchBooks);

export default router;
