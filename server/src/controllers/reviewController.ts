import { Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../models/database';
import { Review, AuthRequest } from '../models/types';
import { validateRating } from '../utils/validation';

export const addReview = (req: AuthRequest, res: Response) => {
  try {
    const { id: bookId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!rating || !comment) {
      return res.status(400).json({ error: 'Rating and comment are required' });
    }

    if (!validateRating(rating)) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    // Check if book exists
    const book = db.findBookById(bookId);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = db.findReviewByUserAndBook(userId, bookId);
    if (existingReview) {
      return res.status(409).json({ error: 'You have already reviewed this book' });
    }

    // Create review
    const newReview: Review = {
      id: uuidv4(),
      bookId,
      userId,
      rating: parseInt(rating),
      comment: comment.trim(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const createdReview = db.createReview(newReview);

    res.status(201).json({
      message: 'Review added successfully',
      review: createdReview
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReview = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!rating && !comment) {
      return res.status(400).json({ error: 'At least rating or comment must be provided' });
    }

    if (rating && !validateRating(rating)) {
      return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
    }

    // Find review
    const review = db.findReviewById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check ownership
    if (review.userId !== userId) {
      return res.status(403).json({ error: 'You can only update your own reviews' });
    }

    // Update review
    const updates: Partial<Review> = {
      updatedAt: new Date()
    };

    if (rating) updates.rating = parseInt(rating);
    if (comment) updates.comment = comment.trim();

    const updatedReview = db.updateReview(id, updates);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReview = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Validation
    if (!userId) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find review
    const review = db.findReviewById(id);
    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Check ownership
    if (review.userId !== userId) {
      return res.status(403).json({ error: 'You can only delete your own reviews' });
    }

    // Delete review
    const deleted = db.deleteReview(id);
    if (!deleted) {
      return res.status(500).json({ error: 'Failed to delete review' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
