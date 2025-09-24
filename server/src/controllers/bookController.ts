import { Response } from 'express';
import { db } from '../models/database.postgres';
import { Book, BookWithRating, AuthRequest, PaginationQuery } from '../models/types';
import { validatePagination } from '../utils/validation';

export const addBook = async (req: AuthRequest, res: Response) => {
  try {
    const { title, author, genre, description, publishedYear } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!title || !author || !genre || !description || !publishedYear) {
      return res.status(400).json({ 
        error: 'Title, author, genre, description, and published year are required' 
      });
    }

    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
      return res.status(400).json({ error: 'Invalid published year' });
    }

    // Create book
    const bookData = {
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      description: description.trim(),
      publishedYear,
      createdBy: userId
    };

    const createdBook = await db.createBook(bookData);

    res.status(201).json({
      message: 'Book added successfully',
      book: createdBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllBooks = async (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, author, genre } = req.query as PaginationQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    const result = await db.getAllBooks(pageNum, limitNum, author, genre);

    res.json({
      books: result.books,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(result.totalCount / limitNum),
        totalItems: result.totalCount,
        itemsPerPage: limitNum,
        hasNext: pageNum < Math.ceil(result.totalCount / limitNum),
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query as PaginationQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    // Find book
    const book = await db.findBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get rating information and reviews
    const [ratingInfo, reviewsResult] = await Promise.all([
      db.getBookAverageRating(book.id),
      db.findReviewsByBookId(book.id, pageNum, limitNum)
    ]);

    const bookWithDetails = {
      ...book,
      averageRating: ratingInfo.averageRating,
      totalReviews: ratingInfo.totalReviews,
      reviews: reviewsResult.reviews,
      reviewsPagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(reviewsResult.totalCount / limitNum),
        totalReviews: reviewsResult.totalCount,
        hasNext: pageNum < Math.ceil(reviewsResult.totalCount / limitNum),
        hasPrev: pageNum > 1
      }
    };

    res.json({ book: bookWithDetails });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};