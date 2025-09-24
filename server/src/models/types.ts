import { Request } from 'express';

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publishedYear: number;
  createdAt: Date;
  createdBy: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number; // 1-5
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookWithRating extends Book {
  averageRating: number;
  totalReviews: number;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export interface PaginationQuery {
  page?: string;
  limit?: string;
  author?: string;
  genre?: string;
}

export interface SearchQuery {
  q?: string;
  page?: string;
  limit?: string;
}
