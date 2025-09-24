# Book Review System

A full-stack RESTful API application for managing books and reviews, built with Node.js/Express (backend) and React/TypeScript (frontend).

## Features

### Authentication
- User registration and login with JWT tokens
- Secure password hashing with bcrypt
- Protected routes for authenticated users

### Books
- Add new books (authenticated users only)
- View all books with pagination
- Filter books by author and genre
- Search books by title or author
- View detailed book information with reviews and ratings

### Reviews
- Submit reviews for books (one per user per book)
- Rate books from 1-5 stars
- Update your own reviews
- Delete your own reviews
- View average ratings and review counts

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- JWT for authentication
- bcryptjs for password hashing
- In-memory database (no external database required)
- CORS, Helmet, and Morgan middleware

### Frontend
- React with TypeScript
- Vite for build tooling
- React Router for routing
- Modern CSS with responsive design

## Project Structure

```
books_project/
├── server/           # Backend API
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Authentication middleware
│   │   ├── models/        # Data models and in-memory database
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── index.ts       # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── client/           # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript interfaces
│   │   ├── utils/         # Utility functions
│   │   ├── App.tsx        # Main App component
│   │   └── main.tsx       # React entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Books
- `GET /api/books` - Get all books (with pagination and filters)
- `GET /api/books/:id` - Get book details with reviews
- `POST /api/books` - Add a new book (authenticated)

### Reviews
- `POST /api/books/:id/reviews` - Add a review (authenticated)
- `PUT /api/reviews/:id` - Update your review (authenticated)
- `DELETE /api/reviews/:id` - Delete your review (authenticated)

### Search
- `GET /api/search?q=query` - Search books by title or author

### Health
- `GET /api/health` - Health check endpoint

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- No database required (uses in-memory storage)

### Installation

1. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server (Terminal 1):**
   ```bash
   cd server
   npm run dev
   ```
   Server will run on http://localhost:3000

2. **Start the client (Terminal 2):**
   ```bash
   cd client
   npm run dev
   ```
   Client will run on http://localhost:5173

### Building for Production

1. **Build the server:**
   ```bash
   cd server
   npm run build
   npm start
   ```

2. **Build the client:**
   ```bash
   cd client
   npm run build
   npm run preview
   ```

## Usage

1. **Register/Login:** Create an account or login with existing credentials
2. **Browse Books:** View all books, use filters, or search by title/author
3. **Add Books:** Authenticated users can add new books
4. **Review Books:** Authenticated users can review books and rate them 1-5 stars
5. **Manage Reviews:** Edit or delete your own reviews

## Features Overview

### Authentication Flow
- Users register with email, name, and password
- JWT tokens are used for authentication
- Tokens are stored in localStorage on the client
- Protected routes require valid authentication

### Book Management
- Books have title, author, genre, description, and published year
- Anyone can view books and reviews
- Only authenticated users can add new books
- Books display average ratings and review counts

### Review System
- Users can review books only once
- Reviews include a 1-5 star rating and comment
- Users can edit/delete their own reviews
- Reviews show reviewer name and timestamps

### Search and Filtering
- Search books by title or author (partial, case-insensitive)
- Filter books by author or genre
- Pagination for large result sets
- Responsive design for mobile and desktop

## Sample Data

The application starts with an empty database. You can:
1. Register a user account
2. Add some sample books
3. Write reviews for the books
4. Test the search and filtering features

## Development Notes

- Uses in-memory storage (data resets on server restart)
- All API responses include proper error handling
- Frontend includes loading states and error messages
- Responsive design works on mobile and desktop
- TypeScript provides type safety across the stack

## Future Enhancements

- Database persistence (MongoDB, PostgreSQL)
- Book cover images
- User profiles and favorite books
- Book categories and advanced filtering
- Review voting/helpfulness
- Admin panel for content management
- Email verification for registration
- Password reset functionality
