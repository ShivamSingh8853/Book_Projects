export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  publishedYear: number;
  createdAt: string;
  createdBy: string;
  averageRating?: number;
  totalReviews?: number;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  userName?: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
