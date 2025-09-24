import { Request, Response } from 'express';
import { db } from '../models/database';
import { BookWithRating, SearchQuery } from '../models/types';
import { validatePagination } from '../utils/validation';

export const searchBooks = (req: Request, res: Response) => {
  try {
    const { q, page, limit } = req.query as SearchQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    // Validation
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }

    // Search books
    const searchResults = db.searchBooks(q.trim());

    // Add rating information
    const booksWithRating: BookWithRating[] = searchResults.map(book => {
      const { averageRating, totalReviews } = db.getBookAverageRating(book.id);
      return {
        ...book,
        averageRating,
        totalReviews
      };
    });

    // Pagination
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedBooks = booksWithRating.slice(startIndex, endIndex);

    res.json({
      query: q.trim(),
      books: paginatedBooks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(booksWithRating.length / limitNum),
        totalResults: booksWithRating.length,
        hasNext: endIndex < booksWithRating.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Search books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
