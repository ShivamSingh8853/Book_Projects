import { Request, Response } from 'express';
import { db } from '../models/database.postgres';
import { BookWithRating, SearchQuery } from '../models/types';
import { validatePagination } from '../utils/validation';

export const searchBooks = async (req: Request, res: Response) => {
  try {
    const { q, page, limit } = req.query as SearchQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    // Validation
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    // Search books with PostgreSQL
    const result = await db.searchBooks(q.trim(), pageNum, limitNum);

    res.json({
      query: q.trim(),
      books: result.books,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(result.totalCount / limitNum),
        totalResults: result.totalCount,
        hasNext: pageNum < Math.ceil(result.totalCount / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
