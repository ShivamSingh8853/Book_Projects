import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { Book, BookWithRating, AuthRequest, PaginationQuery } from '../models/types';
import { validatePagination } from '../utils/validation';

export const addBook = (req: AuthRequest, res: Response) => {
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
    const newBook: Book = {
      id: uuidv4(),
      title: title.trim(),
      author: author.trim(),
      genre: genre.trim(),
      description: description.trim(),
      publishedYear,
      createdAt: new Date(),
      createdBy: userId
    };

    const createdBook = db.createBook(newBook);

    res.status(201).json({
      message: 'Book added successfully',
      book: createdBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getAllBooks = (req: AuthRequest, res: Response) => {
  try {
    const { page, limit, author, genre } = req.query as PaginationQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    let books = db.getAllBooks();

    // Apply filters
    if (author) {
      books = books.filter(book => 
        book.author.toLowerCase().includes(author.toLowerCase())
      );
    }

    if (genre) {
      books = books.filter(book => 
        book.genre.toLowerCase().includes(genre.toLowerCase())
      );
    }

    // Add rating information
    const booksWithRating: BookWithRating[] = books.map(book => {
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
      books: paginatedBooks,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(booksWithRating.length / limitNum),
        totalBooks: booksWithRating.length,
        hasNext: endIndex < booksWithRating.length,
        hasPrev: pageNum > 1
      }
    });
  } catch (error) {
    console.error('Get all books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBookById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { page, limit } = req.query as PaginationQuery;
    const { page: pageNum, limit: limitNum } = validatePagination(page, limit);

    // Find book
    const book = db.findBookById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Get rating information
    const { averageRating, totalReviews } = db.getBookAverageRating(book.id);

    // Get reviews with pagination
    const allReviews = db.findReviewsByBookId(book.id);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedReviews = allReviews.slice(startIndex, endIndex);

    // Get user information for reviews
    const reviewsWithUserInfo = paginatedReviews.map(review => {
      const user = db.findUserById(review.userId);
      return {
        ...review,
        userName: user?.name || 'Unknown User'
      };
    });

    const bookWithDetails = {
      ...book,
      averageRating,
      totalReviews,
      reviews: reviewsWithUserInfo,
      reviewsPagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(allReviews.length / limitNum),
        totalReviews: allReviews.length,
        hasNext: endIndex < allReviews.length,
        hasPrev: pageNum > 1
      }
    };

    res.json({ book: bookWithDetails });
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
