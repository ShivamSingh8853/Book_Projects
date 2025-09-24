const API_BASE_URL = '/api';

class ApiClient {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...this.getAuthHeaders(),
      ...(options.headers as Record<string, string>),
    };

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async signup(userData: { email: string; password: string; name: string }) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  // Book methods
  async getBooks(params?: {
    page?: number;
    limit?: number;
    author?: string;
    genre?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.author) searchParams.append('author', params.author);
    if (params?.genre) searchParams.append('genre', params.genre);

    const query = searchParams.toString();
    return this.request(`/books${query ? `?${query}` : ''}`);
  }

  async getBookById(id: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return this.request(`/books/${id}${query ? `?${query}` : ''}`);
  }

  async addBook(bookData: {
    title: string;
    author: string;
    genre: string;
    description: string;
    publishedYear: number;
  }) {
    return this.request('/books', {
      method: 'POST',
      body: JSON.stringify(bookData),
    });
  }

  // Review methods
  async addReview(bookId: string, reviewData: { rating: number; comment: string }) {
    return this.request(`/books/${bookId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId: string, reviewData: { rating?: number; comment?: string }) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId: string) {
    return this.request(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // Search methods
  async searchBooks(query: string, params?: { page?: number; limit?: number }) {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    return this.request(`/search?${searchParams.toString()}`);
  }
}

export const api = new ApiClient();
