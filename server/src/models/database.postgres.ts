import { Pool } from 'pg';
import { pool } from '../../config/database';
import { User, Book, Review } from './types';

export class PostgreSQLDatabase {
  private pool: Pool;

  constructor() {
    this.pool = pool;
  }

  // User methods
  async createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const query = `
      INSERT INTO users (email, password, name)
      VALUES ($1, $2, $3)
      RETURNING id, email, password, name, created_at as "createdAt"
    `;
    const values = [user.email, user.password, user.name];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findUserByEmail(email: string): Promise<User | undefined> {
    const query = `
      SELECT id, email, password, name, created_at as "createdAt"
      FROM users 
      WHERE email = $1
    `;
    const result = await this.pool.query(query, [email]);
    return result.rows[0];
  }

  async findUserById(id: string): Promise<User | undefined> {
    const query = `
      SELECT id, email, password, name, created_at as "createdAt"
      FROM users 
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  // Book methods
  async createBook(book: Omit<Book, 'id' | 'createdAt'>): Promise<Book> {
    const query = `
      INSERT INTO books (title, author, genre, description, published_year, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, title, author, genre, description, published_year as "publishedYear", 
                created_at as "createdAt", created_by as "createdBy"
    `;
    const values = [book.title, book.author, book.genre, book.description, book.publishedYear, book.createdBy];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async getAllBooks(page: number = 1, limit: number = 10, author?: string, genre?: string): Promise<{
    books: (Book & { averageRating: number; totalReviews: number })[];
    totalCount: number;
  }> {
    const offset = (page - 1) * limit;
    let whereClause = '';
    let values: any[] = [limit, offset];
    let paramCount = 2;

    if (author) {
      paramCount++;
      whereClause += `WHERE LOWER(b.author) LIKE LOWER($${paramCount}) `;
      values.push(`%${author}%`);
    }

    if (genre) {
      paramCount++;
      whereClause += `${whereClause ? 'AND' : 'WHERE'} LOWER(b.genre) LIKE LOWER($${paramCount}) `;
      values.push(`%${genre}%`);
    }

    const query = `
      SELECT 
        b.id, b.title, b.author, b.genre, b.description, 
        b.published_year as "publishedYear", b.created_at as "createdAt", 
        b.created_by as "createdBy",
        COALESCE(ROUND(AVG(r.rating), 1), 0) as "averageRating",
        COUNT(r.id) as "totalReviews"
      FROM books b
      LEFT JOIN reviews r ON b.id = r.book_id
      ${whereClause}
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM books b
      ${whereClause}
    `;

    const [booksResult, countResult] = await Promise.all([
      this.pool.query(query, values),
      this.pool.query(countQuery, values.slice(2)) // Remove limit and offset for count
    ]);

    return {
      books: booksResult.rows.map(row => ({
        ...row,
        totalReviews: parseInt(row.totalReviews),
        averageRating: parseFloat(row.averageRating)
      })),
      totalCount: parseInt(countResult.rows[0].count)
    };
  }

  async findBookById(id: string): Promise<Book | undefined> {
    const query = `
      SELECT id, title, author, genre, description, published_year as "publishedYear", 
             created_at as "createdAt", created_by as "createdBy"
      FROM books 
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async searchBooks(searchQuery: string, page: number = 1, limit: number = 10): Promise<{
    books: (Book & { averageRating: number; totalReviews: number })[];
    totalCount: number;
  }> {
    const offset = (page - 1) * limit;
    const searchTerm = `%${searchQuery.toLowerCase()}%`;

    const query = `
      SELECT 
        b.id, b.title, b.author, b.genre, b.description, 
        b.published_year as "publishedYear", b.created_at as "createdAt", 
        b.created_by as "createdBy",
        COALESCE(ROUND(AVG(r.rating), 1), 0) as "averageRating",
        COUNT(r.id) as "totalReviews"
      FROM books b
      LEFT JOIN reviews r ON b.id = r.book_id
      WHERE LOWER(b.title) LIKE $1 OR LOWER(b.author) LIKE $1
      GROUP BY b.id
      ORDER BY b.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM books 
      WHERE LOWER(title) LIKE $1 OR LOWER(author) LIKE $1
    `;

    const [booksResult, countResult] = await Promise.all([
      this.pool.query(query, [searchTerm, limit, offset]),
      this.pool.query(countQuery, [searchTerm])
    ]);

    return {
      books: booksResult.rows.map(row => ({
        ...row,
        totalReviews: parseInt(row.totalReviews),
        averageRating: parseFloat(row.averageRating)
      })),
      totalCount: parseInt(countResult.rows[0].count)
    };
  }

  // Review methods
  async createReview(review: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<Review> {
    const query = `
      INSERT INTO reviews (book_id, user_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING id, book_id as "bookId", user_id as "userId", rating, comment,
                created_at as "createdAt", updated_at as "updatedAt"
    `;
    const values = [review.bookId, review.userId, review.rating, review.comment];
    
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async findReviewsByBookId(bookId: string, page: number = 1, limit: number = 10): Promise<{
    reviews: (Review & { userName: string })[];
    totalCount: number;
  }> {
    const offset = (page - 1) * limit;

    const query = `
      SELECT 
        r.id, r.book_id as "bookId", r.user_id as "userId", r.rating, r.comment,
        r.created_at as "createdAt", r.updated_at as "updatedAt",
        u.name as "userName"
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.book_id = $1
      ORDER BY r.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as count
      FROM reviews 
      WHERE book_id = $1
    `;

    const [reviewsResult, countResult] = await Promise.all([
      this.pool.query(query, [bookId, limit, offset]),
      this.pool.query(countQuery, [bookId])
    ]);

    return {
      reviews: reviewsResult.rows,
      totalCount: parseInt(countResult.rows[0].count)
    };
  }

  async findReviewById(id: string): Promise<Review | undefined> {
    const query = `
      SELECT id, book_id as "bookId", user_id as "userId", rating, comment,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM reviews 
      WHERE id = $1
    `;
    const result = await this.pool.query(query, [id]);
    return result.rows[0];
  }

  async findReviewByUserAndBook(userId: string, bookId: string): Promise<Review | undefined> {
    const query = `
      SELECT id, book_id as "bookId", user_id as "userId", rating, comment,
             created_at as "createdAt", updated_at as "updatedAt"
      FROM reviews 
      WHERE user_id = $1 AND book_id = $2
    `;
    const result = await this.pool.query(query, [userId, bookId]);
    return result.rows[0];
  }

  async updateReview(id: string, updates: Partial<Pick<Review, 'rating' | 'comment'>>): Promise<Review | undefined> {
    const setClause = [];
    const values = [];
    let paramCount = 0;

    if (updates.rating !== undefined) {
      paramCount++;
      setClause.push(`rating = $${paramCount}`);
      values.push(updates.rating);
    }

    if (updates.comment !== undefined) {
      paramCount++;
      setClause.push(`comment = $${paramCount}`);
      values.push(updates.comment);
    }

    if (setClause.length === 0) {
      return this.findReviewById(id);
    }

    paramCount++;
    values.push(id);

    const query = `
      UPDATE reviews 
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING id, book_id as "bookId", user_id as "userId", rating, comment,
                created_at as "createdAt", updated_at as "updatedAt"
    `;

    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  async deleteReview(id: string): Promise<boolean> {
    const query = 'DELETE FROM reviews WHERE id = $1';
    const result = await this.pool.query(query, [id]);
    return result.rowCount > 0;
  }

  // Utility methods
  async getBookAverageRating(bookId: string): Promise<{ averageRating: number; totalReviews: number }> {
    const query = `
      SELECT 
        COALESCE(ROUND(AVG(rating), 1), 0) as "averageRating",
        COUNT(id) as "totalReviews"
      FROM reviews 
      WHERE book_id = $1
    `;
    const result = await this.pool.query(query, [bookId]);
    const row = result.rows[0];
    
    return {
      averageRating: parseFloat(row.averageRating),
      totalReviews: parseInt(row.totalReviews)
    };
  }
}

export const db = new PostgreSQLDatabase();
