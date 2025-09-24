# Book Review System - System Design Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture Design](#architecture-design)
3. [Database Design](#database-design)
4. [API Design](#api-design)
5. [Frontend Design](#frontend-design)
6. [Security Design](#security-design)
7. [Performance Considerations](#performance-considerations)
8. [Deployment Architecture](#deployment-architecture)
9. [Monitoring & Observability](#monitoring--observability)
10. [Future Enhancements](#future-enhancements)

---

## System Overview

### Purpose
The Book Review System is a full-stack web application that allows users to discover, review, and rate books. It provides a platform for book enthusiasts to share their opinions and discover new books based on community ratings.

### Key Features
- **User Management**: Registration, authentication, and profile management
- **Book Management**: Add books, view book details, search and filter
- **Review System**: Submit, update, and delete reviews with ratings (1-5 stars)
- **Search & Discovery**: Search books by title/author with pagination
- **Real-time Updates**: Live updates when new books or reviews are added

### Success Metrics
- User engagement (reviews per user, session duration)
- System performance (response time < 200ms, 99.9% uptime)
- Data integrity (zero data loss, consistent ratings)

---

## Architecture Design

### High-Level Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Client App    │    │   API Server    │    │   Database      │
│   (React/Vite)  │◄──►│  (Node.js/TS)   │◄──►│  (PostgreSQL)   │
│   Port: 5173    │    │   Port: 3001    │    │   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Technology Stack

#### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL 14+
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Environment**: dotenv
- **Security**: helmet, cors
- **Logging**: morgan
- **Development**: nodemon, ts-node

#### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5.x
- **Build Tool**: Vite 7.x
- **Routing**: react-router-dom
- **HTTP Client**: Fetch API
- **Styling**: CSS3 with custom properties

#### Infrastructure
- **Database Connection**: pg (node-postgres)
- **Process Management**: PM2 (production)
- **Reverse Proxy**: nginx (production)
- **Container**: Docker (optional)

### System Components

#### 1. Presentation Layer (Frontend)
```
src/
├── components/          # Reusable UI components
│   └── Header.tsx      # Navigation and user status
├── pages/              # Page-level components
│   ├── HomePage.tsx    # Landing page
│   ├── Login.tsx       # User authentication
│   ├── Register.tsx    # User registration
│   ├── BookList.tsx    # Book browsing with filters
│   ├── BookDetail.tsx  # Individual book view
│   └── AddBook.tsx     # Book creation form
├── utils/              # Utility functions
│   └── api.ts          # API client and HTTP handling
└── App.tsx             # Main application router
```

#### 2. Application Layer (Backend)
```
src/
├── controllers/        # Business logic handlers
│   ├── authController.ts    # User authentication
│   ├── bookController.ts    # Book management
│   ├── reviewController.ts  # Review operations
│   └── searchController.ts  # Search functionality
├── middleware/         # Request processing
│   └── auth.ts         # JWT verification
├── models/            # Data models and database
│   ├── types.ts       # TypeScript interfaces
│   └── database.postgres.ts  # Database operations
├── routes/            # API route definitions
│   ├── auth.ts        # Authentication routes
│   ├── books.ts       # Book routes
│   ├── reviews.ts     # Review routes
│   └── search.ts      # Search routes
└── utils/             # Utility functions
    ├── auth.ts        # JWT and password utilities
    └── validation.ts  # Input validation
```

#### 3. Data Layer (Database)
```
PostgreSQL Database
├── users              # User accounts
├── books              # Book catalog
├── reviews            # User reviews and ratings
└── indexes            # Performance optimization
```

---

## Database Design

### Entity Relationship Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     USERS       │     │     BOOKS       │     │    REVIEWS      │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (UUID) PK    │     │ id (UUID) PK    │     │ id (UUID) PK    │
│ email (VARCHAR) │     │ title (VARCHAR) │     │ book_id (UUID)  │
│ password (VARCHAR)    │ author (VARCHAR)│     │ user_id (UUID)  │
│ name (VARCHAR)  │     │ genre (VARCHAR) │     │ rating (INT)    │
│ created_at (TS) │     │ description (TEXT)    │ comment (TEXT)  │
│ updated_at (TS) │     │ published_year (INT)  │ created_at (TS) │
└─────────────────┘     │ created_at (TS) │     │ updated_at (TS) │
                        │ updated_at (TS) │     └─────────────────┘
                        │ created_by (UUID)│           │
                        └─────────────────┘           │
                               │                      │
                               └──────────────────────┘
```

### Table Schemas

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

#### Books Table
```sql
CREATE TABLE books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    published_year INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
);
```

#### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, user_id)  -- One review per user per book
);
```

### Database Indexes

#### Performance Indexes
```sql
-- Book search optimization
CREATE INDEX idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_genre ON books(genre);
CREATE INDEX idx_books_created_at ON books(created_at DESC);

-- Review aggregation optimization
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

### Database Triggers
```sql
-- Automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at BEFORE UPDATE ON books
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Database Views
```sql
-- Materialized view for book statistics
CREATE OR REPLACE VIEW books_with_stats AS
SELECT 
    b.*,
    COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating,
    COUNT(r.id) as total_reviews
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
GROUP BY b.id;
```

---

## API Design

### RESTful API Endpoints

#### Authentication Endpoints
```
POST   /api/auth/signup
POST   /api/auth/login
```

#### Book Management Endpoints
```
GET    /api/books              # List books with pagination
GET    /api/books/:id          # Get book details
POST   /api/books              # Create new book (auth required)
```

#### Review Management Endpoints
```
POST   /api/books/:id/reviews  # Add review (auth required)
PUT    /api/reviews/:id        # Update review (auth required, owner only)
DELETE /api/reviews/:id        # Delete review (auth required, owner only)
```

#### Search Endpoints
```
GET    /api/search             # Search books by title/author
```

#### Health Check
```
GET    /api/health             # System health status
```

### Request/Response Formats

#### Authentication
```typescript
// POST /api/auth/signup
Request: {
  email: string;
  password: string;
  name: string;
}

Response: {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}
```

#### Books
```typescript
// GET /api/books
Query Parameters: {
  page?: number;
  limit?: number;
  author?: string;
  genre?: string;
}

Response: {
  books: BookWithRating[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// POST /api/books
Request: {
  title: string;
  author: string;
  genre: string;
  description: string;
  publishedYear: number;
}

Headers: {
  Authorization: "Bearer <jwt_token>";
}
```

#### Reviews
```typescript
// POST /api/books/:id/reviews
Request: {
  rating: number; // 1-5
  comment: string;
}

Headers: {
  Authorization: "Bearer <jwt_token>";
}

Response: {
  message: string;
  review: Review;
}
```

### Error Handling
```typescript
// Standard error response format
{
  error: string;
  details?: any;
  timestamp: string;
  path: string;
}

// HTTP Status Codes
200 - OK
201 - Created
400 - Bad Request
401 - Unauthorized
403 - Forbidden
404 - Not Found
409 - Conflict
500 - Internal Server Error
```

---

## Frontend Design

### Component Architecture

#### Component Hierarchy
```
App
├── Header (navigation, user status)
├── Router
    ├── HomePage (landing page)
    ├── Login (authentication)
    ├── Register (user signup)
    ├── BookList (book browsing)
    ├── BookDetail (individual book)
    └── AddBook (book creation)
```

#### State Management
```typescript
// User Authentication State
interface User {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Application State
- User session (localStorage)
- Current page/route (react-router)
- Form states (component state)
- API loading states (component state)
```

### UI/UX Design Patterns

#### Design System
- **Colors**: Dark gradient theme with purple/blue accents
- **Typography**: System fonts with responsive sizing
- **Layout**: CSS Grid and Flexbox for responsive design
- **Components**: Glassmorphism effect with backdrop blur
- **Animations**: Smooth transitions and hover effects

#### Responsive Design
```css
/* Mobile-first approach */
.container {
  padding: 1rem;
}

@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### Accessibility Features
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color ratios
- Screen reader compatibility

### Frontend Routing
```typescript
// React Router configuration
{
  path: "/",              // Homepage
  path: "/login",         // User login
  path: "/register",      // User registration
  path: "/books",         // Book listing
  path: "/books/:id",     // Book details
  path: "/add-book",      // Add new book (protected)
}

// Route Protection
const ProtectedRoute = ({ children, user }) => {
  return user ? children : <Navigate to="/login" />;
};
```

---

## Security Design

### Authentication & Authorization

#### JWT Implementation
```typescript
// Token Structure
{
  payload: {
    id: string;      // User ID
    email: string;   // User email
    name: string;    // User name
    iat: number;     // Issued at
    exp: number;     // Expiration (24 hours)
  }
}

// Token Verification Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};
```

#### Password Security
```typescript
// Password Hashing (bcryptjs)
const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};
```

### Input Validation & Sanitization

#### Server-Side Validation
```typescript
// Email validation
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password requirements
const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

// Rating validation
const validateRating = (rating: number): boolean => {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
};
```

#### SQL Injection Prevention
```typescript
// Parameterized queries
const query = `
  INSERT INTO books (title, author, genre, description, published_year, created_by)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING *
`;
const values = [title, author, genre, description, publishedYear, userId];
const result = await pool.query(query, values);
```

### Security Headers & Middleware
```typescript
// Helmet.js security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));
```

---

## Performance Considerations

### Database Optimization

#### Query Optimization
```sql
-- Optimized book listing with ratings
SELECT 
    b.id, b.title, b.author, b.genre, b.description, 
    b.published_year, b.created_at, b.created_by,
    COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating,
    COUNT(r.id) as total_reviews
FROM books b
LEFT JOIN reviews r ON b.id = r.book_id
WHERE ($1::text IS NULL OR LOWER(b.author) LIKE LOWER($1))
  AND ($2::text IS NULL OR LOWER(b.genre) LIKE LOWER($2))
GROUP BY b.id
ORDER BY b.created_at DESC
LIMIT $3 OFFSET $4;
```

#### Connection Pooling
```typescript
// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  max: 20,                    // Maximum connections
  idleTimeoutMillis: 30000,   // Close idle connections
  connectionTimeoutMillis: 2000  // Connection timeout
});
```

### Application Performance

#### Response Time Optimization
- Database query optimization with indexes
- Efficient pagination with LIMIT/OFFSET
- Connection pooling for database operations
- Minimal data transfer with selective fields

#### Memory Management
- Proper error handling to prevent memory leaks
- Efficient data structures for in-memory operations
- Regular garbage collection in Node.js
- Connection pool management

### Frontend Performance

#### Bundle Optimization
```typescript
// Vite configuration for optimization
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  }
});
```

#### Caching Strategy
- Browser caching for static assets
- API response caching with appropriate headers
- Local storage for user authentication state
- Efficient re-rendering with React optimization

---

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Developer     │    │   Local Dev     │    │   Local DB      │
│   Machine       │    │   Server        │    │   PostgreSQL    │
│   (IDE/Browser) │◄──►│   (nodemon)     │◄──►│   (Homebrew)    │
│   localhost:5173│    │   localhost:3001│    │   localhost:5432│
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Load Balancer │    │   App Server    │    │   Database      │
│   (nginx)       │    │   (PM2/Node.js) │    │   (PostgreSQL)  │
│   Port: 80/443  │◄──►│   Port: 3001    │◄──►│   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Docker Configuration
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]

# Frontend Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Environment Configuration
```bash
# Production Environment Variables
NODE_ENV=production
PORT=3001
DB_HOST=production-db-host
DB_PORT=5432
DB_NAME=book_review_prod
DB_USER=app_user
DB_PASSWORD=secure_password
JWT_SECRET=super_secure_jwt_secret_key
LOG_LEVEL=info
```

---

## Monitoring & Observability

### Application Monitoring
```typescript
// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Database connectivity check
    await pool.query('SELECT 1');
    
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: 'connected',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version
    });
  } catch (error) {
    res.status(503).json({
      status: 'Error',
      database: 'disconnected',
      error: error.message
    });
  }
});
```

### Logging Strategy
```typescript
// Request logging with Morgan
app.use(morgan('combined', {
  stream: {
    write: (message) => {
      console.log(message.trim());
    }
  }
}));

// Error logging
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString()
  });
  
  res.status(500).json({ error: 'Internal server error' });
});
```

### Performance Metrics
- Response time monitoring
- Database query performance
- Memory usage tracking
- Error rate monitoring
- User engagement metrics

---

## Future Enhancements

### Scalability Improvements
1. **Database Scaling**
   - Read replicas for query optimization
   - Database sharding for large datasets
   - Caching layer (Redis) for frequent queries

2. **Application Scaling**
   - Microservices architecture
   - API Gateway for service routing
   - Message queues for async processing

3. **Frontend Optimization**
   - Server-Side Rendering (SSR)
   - Progressive Web App (PWA) features
   - Content Delivery Network (CDN)

### Feature Enhancements
1. **Advanced Search**
   - Full-text search with Elasticsearch
   - Faceted search with multiple filters
   - Search suggestions and autocomplete

2. **Social Features**
   - User profiles and following system
   - Book recommendations based on reading history
   - Discussion forums and comments

3. **Content Management**
   - Book cover image uploads
   - Rich text editor for reviews
   - Book categories and tags system

4. **Analytics & Insights**
   - Reading analytics dashboard
   - Popular books and trending reviews
   - User engagement metrics

### Technical Improvements
1. **Real-time Features**
   - WebSocket integration for live updates
   - Real-time notifications
   - Live activity feeds

2. **API Enhancements**
   - GraphQL API for efficient data fetching
   - API versioning strategy
   - Rate limiting and throttling

3. **Security Enhancements**
   - OAuth integration (Google, GitHub)
   - Two-factor authentication
   - Advanced input sanitization

4. **DevOps & Infrastructure**
   - Kubernetes deployment
   - CI/CD pipeline with automated testing
   - Infrastructure as Code (Terraform)

---

## Conclusion

The Book Review System represents a well-architected, scalable solution for book discovery and community engagement. The system demonstrates modern web development practices with:

- **Separation of Concerns**: Clear separation between frontend, backend, and database layers
- **Security Best Practices**: JWT authentication, password hashing, and SQL injection prevention
- **Performance Optimization**: Database indexing, connection pooling, and efficient queries
- **Maintainable Code**: TypeScript for type safety, modular architecture, and comprehensive documentation
- **Production Readiness**: Environment configuration, error handling, and monitoring capabilities

The architecture supports future growth through its modular design, allowing for easy integration of new features and scaling strategies as the user base and requirements evolve.
