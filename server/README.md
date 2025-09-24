# Book Review API Server

RESTful API built with Node.js, Express.js, TypeScript, and PostgreSQL for a book review system.

## 📋 Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set up PostgreSQL Database**

   ### Option 1: Using Docker (Recommended)
   ```bash
   # Pull and run PostgreSQL container
   docker run --name book-review-db \
     -e POSTGRES_DB=book_review_db \
     -e POSTGRES_USER=postgres \
     -e POSTGRES_PASSWORD=password \
     -p 5432:5432 \
     -d postgres:15
   ```

   ### Option 2: Local PostgreSQL Installation
   - Install PostgreSQL on your system
   - Create a database named `book_review_db`
   - Note your credentials for the `.env` file

3. **Configure Environment Variables**
   ```bash
   # Copy the example file and edit with your credentials
   cp .env.example .env
   ```
   
   Update `.env` with your PostgreSQL configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=book_review_db
   DB_USER=postgres
   DB_PASSWORD=password

   # JWT Secret (change this in production!)
   JWT_SECRET=your-super-secret-jwt-key-change-in-production

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Initialize Database Schema**
   ```bash
   npm run setup-db
   ```

5. **Start the Development Server**
   ```bash
   npm run dev
   ```

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `POST /api/books` - Add a new book (authenticated)
- `GET /api/books` - Get all books with pagination and filters
- `GET /api/books/:id` - Get book details with reviews

### Reviews
- `POST /api/books/:id/reviews` - Add review to book (authenticated)
- `PUT /api/reviews/:id` - Update your review (authenticated)
- `DELETE /api/reviews/:id` - Delete your review (authenticated)

### Search
- `GET /api/search` - Search books by title or author

### Health Check
- `GET /api/health` - API health status

## 📊 Database Schema

The PostgreSQL database uses the following tables:

- **users** - User accounts with authentication
- **books** - Book information and metadata
- **reviews** - User reviews and ratings for books

Key features:
- UUID primary keys for all tables
- Automatic timestamp management
- Foreign key constraints
- Indexes for performance
- One review per user per book constraint

## 🔧 Development

### Scripts
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run setup-db` - Initialize database schema

### Code Structure
```
src/
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/         # Data models and database logic
├── routes/         # API routes
├── utils/          # Utility functions
└── index.ts        # Main application file

config/
└── database.ts     # Database connection configuration

scripts/
├── init-db.sql     # Database schema
└── setup-db.ts     # Database setup script
```

## 🔒 Authentication

- JWT-based authentication
- Bcrypt password hashing
- Protected routes middleware
- User session management

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }'
```

### Add Book
```bash
curl -X POST http://localhost:3000/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Fiction",
    "description": "A classic American novel",
    "publishedYear": 1925
  }'
```

### Search Books
```bash
curl "http://localhost:3000/api/search?q=gatsby&page=1&limit=10"
```

## 🏗️ Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong, unique `JWT_SECRET`
3. Configure PostgreSQL with proper security settings
4. Use SSL/TLS for database connections
5. Set up proper logging and monitoring
6. Use a reverse proxy (nginx) for serving static files

## 🔍 Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Check your connection parameters in `.env`
3. Verify database and user exist
4. Test connection with: `npm run setup-db`

### Common Errors
- **Port already in use**: Change `PORT` in `.env`
- **Database connection failed**: Check PostgreSQL service and credentials
- **JWT errors**: Verify `JWT_SECRET` is set in `.env`

## 📚 API Documentation

For detailed API documentation including request/response examples, see the main project README or use tools like Postman to explore the endpoints.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
