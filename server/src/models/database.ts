import { User, Book, Review } from './types';

// In-memory database implementation
class Database {
  private users: User[] = [];
  private books: Book[] = [];
  private reviews: Review[] = [];

  // User methods
  createUser(user: User): User {
    this.users.push(user);
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find(user => user.email === email);
  }

  findUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  // Book methods
  createBook(book: Book): Book {
    this.books.push(book);
    return book;
  }

  getAllBooks(): Book[] {
    return this.books;
  }

  findBookById(id: string): Book | undefined {
    return this.books.find(book => book.id === id);
  }

  searchBooks(query: string): Book[] {
    const searchTerm = query.toLowerCase();
    return this.books.filter(book => 
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm)
    );
  }

  // Review methods
  createReview(review: Review): Review {
    this.reviews.push(review);
    return review;
  }

  findReviewsByBookId(bookId: string): Review[] {
    return this.reviews.filter(review => review.bookId === bookId);
  }

  findReviewById(id: string): Review | undefined {
    return this.reviews.find(review => review.id === id);
  }

  findReviewByUserAndBook(userId: string, bookId: string): Review | undefined {
    return this.reviews.find(review => 
      review.userId === userId && review.bookId === bookId
    );
  }

  updateReview(id: string, updates: Partial<Review>): Review | undefined {
    const reviewIndex = this.reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) return undefined;

    this.reviews[reviewIndex] = { ...this.reviews[reviewIndex], ...updates };
    return this.reviews[reviewIndex];
  }

  deleteReview(id: string): boolean {
    const reviewIndex = this.reviews.findIndex(review => review.id === id);
    if (reviewIndex === -1) return false;

    this.reviews.splice(reviewIndex, 1);
    return true;
  }

  // Utility methods
  getBookAverageRating(bookId: string): { averageRating: number; totalReviews: number } {
    const bookReviews = this.findReviewsByBookId(bookId);
    if (bookReviews.length === 0) {
      return { averageRating: 0, totalReviews: 0 };
    }

    const totalRating = bookReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / bookReviews.length) * 10) / 10;

    return { averageRating, totalReviews: bookReviews.length };
  }
}

export const db = new Database();
