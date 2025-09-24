import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Book, Review, User } from '../types';

interface BookDetailProps {
  user: User | null;
}

const BookDetail: React.FC<BookDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [book, setBook] = useState<Book & {
    reviews: Review[];
    reviewsPagination: any;
    averageRating: number;
    totalReviews: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    if (!id) return;
    
    setLoading(true);
    setError('');

    try {
      const response = await api.getBookById(id) as any;
      setBook(response.book);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch book');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !user) return;

    setSubmittingReview(true);

    try {
      await api.addReview(id, reviewForm);
      setReviewForm({ rating: 5, comment: '' });
      setShowReviewForm(false);
      fetchBook(); // Refresh book data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUpdateReview = async (reviewId: string) => {
    setSubmittingReview(true);

    try {
      await api.updateReview(reviewId, editForm);
      setEditingReview(null);
      fetchBook(); // Refresh book data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.deleteReview(reviewId);
      fetchBook(); // Refresh book data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete review');
    }
  };

  const startEditing = (review: Review) => {
    setEditingReview(review.id);
    setEditForm({ rating: review.rating, comment: review.comment });
  };

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    return (
      <span className="stars">
        {'★'.repeat(fullStars)}
        {hasHalfStar ? '☆' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
    );
  };

  const renderRatingInput = (
    value: number,
    onChange: (rating: number) => void,
    _name: string
  ) => (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: star <= value ? '#f39c12' : '#ddd',
            cursor: 'pointer',
            padding: '2px',
          }}
        >
          ★
        </button>
      ))}
      <span style={{ marginLeft: '10px' }}>({value}/5)</span>
    </div>
  );

  if (loading) return <div className="loading">Loading book...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!book) return <div className="error">Book not found</div>;

  const userReview = book.reviews.find(review => review.userId === user?.id);
  const canReview = user && !userReview;

  return (
    <div>
      <div className="book-detail">
        <div className="book-detail-header">
          <h1 className="book-detail-title">{book.title}</h1>
          <div className="book-detail-meta">
            <span><strong>Author:</strong> {book.author}</span>
            <span><strong>Genre:</strong> {book.genre}</span>
            <span><strong>Published:</strong> {book.publishedYear}</span>
            <div className="rating">
              {book.averageRating > 0 ? (
                <>
                  {renderStars(book.averageRating)}
                  <span>({book.averageRating}) • {book.totalReviews} reviews</span>
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>
          </div>
        </div>
        <p className="book-detail-description">{book.description}</p>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Reviews ({book.totalReviews})</h2>
          {canReview && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="btn"
            >
              {showReviewForm ? 'Cancel Review' : 'Write a Review'}
            </button>
          )}
          {!user && (
            <Link to="/login" className="btn">
              Login to Write a Review
            </Link>
          )}
        </div>

        {showReviewForm && (
          <form onSubmit={handleSubmitReview} className="review-card">
            <h3>Write Your Review</h3>
            <div className="form-group">
              <label>Rating</label>
              {renderRatingInput(
                reviewForm.rating,
                (rating) => setReviewForm({ ...reviewForm, rating }),
                'rating'
              )}
            </div>
            <div className="form-group">
              <label htmlFor="comment">Comment</label>
              <textarea
                id="comment"
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your thoughts about this book..."
                rows={4}
                required
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn" disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {book.reviews.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#7f8c8d', padding: '20px' }}>
            No reviews yet. Be the first to review this book!
          </p>
        ) : (
          book.reviews.map((review) => (
            <div key={review.id} className="review-card">
              {editingReview === review.id ? (
                <div>
                  <div className="form-group">
                    <label>Rating</label>
                    {renderRatingInput(
                      editForm.rating,
                      (rating) => setEditForm({ ...editForm, rating }),
                      'editRating'
                    )}
                  </div>
                  <div className="form-group">
                    <label>Comment</label>
                    <textarea
                      value={editForm.comment}
                      onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={() => handleUpdateReview(review.id)}
                      className="btn"
                      disabled={submittingReview}
                    >
                      {submittingReview ? 'Updating...' : 'Update'}
                    </button>
                    <button
                      onClick={() => setEditingReview(null)}
                      className="btn btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="review-header">
                    <div>
                      <span className="review-author">{review.userName}</span>
                      <div className="rating">
                        {renderStars(review.rating)}
                        <span>({review.rating}/5)</span>
                      </div>
                    </div>
                    {user?.id === review.userId && (
                      <div className="review-actions">
                        <button
                          onClick={() => startEditing(review)}
                          className="btn btn-secondary"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="btn btn-danger"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                  <small style={{ color: '#7f8c8d' }}>
                    {new Date(review.createdAt).toLocaleDateString()}
                    {review.updatedAt !== review.createdAt && ' (edited)'}
                  </small>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BookDetail;
