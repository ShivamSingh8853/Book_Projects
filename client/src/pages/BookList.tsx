import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../utils/api';
import { Book } from '../types';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    author: '',
    genre: '',
    page: 1,
    limit: 12,
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNext: false,
    hasPrev: false,
  });

  const fetchBooks = async (isSearch = false) => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (isSearch && searchQuery.trim()) {
        response = await api.searchBooks(searchQuery, {
          page: filters.page,
          limit: filters.limit,
        }) as any;
        setBooks(response.books);
        setPagination(response.pagination);
      } else {
        response = await api.getBooks({
          page: filters.page,
          limit: filters.limit,
          author: filters.author || undefined,
          genre: filters.genre || undefined,
        }) as any;
        setBooks(response.books);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters.page, filters.limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchBooks(true);
  };

  const handleFilter = () => {
    setFilters({ ...filters, page: 1 });
    setSearchQuery('');
    fetchBooks(false);
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
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

  return (
    <div>
      <div className="books-page-header">
        <h1 className="books-page-title">Discover Amazing Books</h1>
        <p className="books-page-subtitle">
          Explore our collection of books, read reviews, and find your next great read
        </p>
      </div>
      
      <div className="search-filters">
        <form onSubmit={handleSearch} className="search-row">
          <div className="search-group">
            <label htmlFor="search">Search Books</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button type="submit" className="btn search-btn">
            Search
          </button>
        </form>

        <div className="search-row" style={{ marginTop: '15px' }}>
          <div className="search-group">
            <label htmlFor="author">Filter by Author</label>
            <input
              type="text"
              id="author"
              placeholder="Author name..."
              value={filters.author}
              onChange={(e) => setFilters({ ...filters, author: e.target.value })}
            />
          </div>
          <div className="search-group">
            <label htmlFor="genre">Filter by Genre</label>
            <input
              type="text"
              id="genre"
              placeholder="Genre..."
              value={filters.genre}
              onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
            />
          </div>
          <button type="button" onClick={handleFilter} className="btn search-btn">
            Apply Filters
          </button>
        </div>
      </div>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <div className="loading">Loading books...</div>
      ) : (
        <>
          <div className="book-grid">
            {books.map((book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="book-card">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">by {book.author}</p>
                  <p className="book-genre">{book.genre}</p>
                  <p className="book-description">{book.description}</p>
                  <div className="book-meta">
                    <span>Published: {book.publishedYear}</span>
                    <div className="rating">
                      {book.averageRating ? (
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
              </Link>
            ))}
          </div>

          {books.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3 className="empty-title">No books found</h3>
              <p className="empty-description">
                {searchQuery 
                  ? "Try a different search term or explore our filters" 
                  : "Be the first to add a book to our collection!"
                }
              </p>
              <Link to="/add-book" className="btn" style={{ marginTop: '20px', width: 'auto', display: 'inline-block' }}>
                Add the First Book
              </Link>
            </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </button>
              
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={pagination.currentPage === page ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookList;
