# Book Review System

A full-stack RESTful API application for managing books and reviews, built with Node.js/Express (backend) and React/TypeScript (frontend) with PostgreSQL database.

![Project Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue)
![React](https://img.shields.io/badge/React-18-blue)

## 🌐 Live Application

🚀 **Production Deployment:**
- **Frontend (Netlify)**: https://cheerful-pie-6a5860.netlify.app/
- **Backend API (Render)**: https://book-projects-5.onrender.com/api/health

📂 **Source Code:**
- **GitHub Repository**: https://github.com/Shivamsafe/Books_Project

## ✨ Features

### 🔐 Authentication & Security
- JWT-based user authentication with secure token management
- Password hashing with bcrypt (12 salt rounds)
- Protected routes and middleware authorization
- SQL injection prevention with parameterized queries
- Security headers with Helmet.js

### 📚 Book Management
- Add new books with detailed metadata (authenticated users only)
- Browse books with advanced pagination and filtering
- Filter books by author, genre, and publication year
- Full-text search by title or author with PostgreSQL indexes
- View detailed book information with aggregated ratings

### ⭐ Review System
- Submit comprehensive reviews with 1-5 star ratings
- One review per user per book constraint
- Update and delete your own reviews (owner-only access)
- Real-time average rating calculations
- Review pagination and user attribution

### 🎨 Modern UI/UX
- Beautiful dark gradient theme with glassmorphism effects
- Fully responsive design for all device sizes
- Smooth animations and hover effects
- Accessible design with ARIA labels and keyboard navigation
- Professional landing page and intuitive navigation

## 🛠️ Tech Stack

### Backend Architecture
- **Runtime**: Node.js 18+ with Express.js 5.x
- **Language**: TypeScript 5.x for type safety
- **Database**: PostgreSQL 14+ with connection pooling
- **Authentication**: JWT tokens with configurable expiration
- **Security**: bcryptjs, helmet, CORS protection
- **Development**: nodemon, ts-node for hot reloading
- **Logging**: Morgan for request logging

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 7.x for fast development and optimized builds
- **Routing**: React Router DOM with protected routes
- **Styling**: Modern CSS3 with custom properties and flexbox/grid
- **HTTP Client**: Native Fetch API with error handling
- **State Management**: React hooks and localStorage

### Database Design
- **PostgreSQL** with properly normalized tables
- **UUID primary keys** for better security and scalability
- **Foreign key constraints** ensuring data integrity
- **Performance indexes** for search and aggregation queries
- **Automatic timestamps** with database triggers
- **Materialized views** for optimized data retrieval

## 📁 Project Structure

```
books_project/
├── 📂 server/                    # Backend API
│   ├── 📂 src/
│   │   ├── 📂 controllers/       # Business logic handlers
│   │   │   ├── authController.ts    # User authentication
│   │   │   ├── bookController.ts    # Book management
│   │   │   ├── reviewController.ts  # Review operations
│   │   │   └── searchController.ts  # Search functionality
│   │   ├── 📂 middleware/        # Express middleware
│   │   │   └── auth.ts           # JWT verification
│   │   ├── 📂 models/           # Data models
│   │   │   ├── types.ts         # TypeScript interfaces
│   │   │   └── database.postgres.ts  # PostgreSQL operations
│   │   ├── 📂 routes/           # API endpoints
│   │   │   ├── auth.ts          # Authentication routes
│   │   │   ├── books.ts         # Book routes
│   │   │   ├── reviews.ts       # Review routes
│   │   │   └── search.ts        # Search routes
│   │   ├── 📂 utils/            # Helper functions
│   │   │   ├── auth.ts          # JWT and password utilities
│   │   │   └── validation.ts    # Input validation
│   │   └── index.ts             # Main application entry
│   ├── 📂 config/               # Configuration files
│   │   └── database.ts          # Database connection setup
│   ├── 📂 scripts/              # Database scripts
│   │   ├── init-db.sql          # Database schema
│   │   └── setup-db.ts          # Database initialization
│   ├── package.json             # Dependencies and scripts
│   ├── tsconfig.json            # TypeScript configuration
│   └── .env.example             # Environment variables template
├── 📂 client/                   # Frontend React App
│   ├── 📂 src/
│   │   ├── 📂 components/       # Reusable UI components
│   │   │   └── Header.tsx       # Navigation header
│   │   ├── 📂 pages/           # Page components
│   │   │   ├── HomePage.tsx     # Landing page
│   │   │   ├── Login.tsx        # User authentication
│   │   │   ├── Register.tsx     # User registration
│   │   │   ├── BookList.tsx     # Book browsing
│   │   │   ├── BookDetail.tsx   # Individual book view
│   │   │   └── AddBook.tsx      # Book creation form
│   │   ├── 📂 utils/           # Utility functions
│   │   │   └── api.ts          # API client
│   │   ├── App.tsx             # Main app component
│   │   ├── App.css             # Global styles
│   │   └── main.tsx            # React entry point
│   ├── package.json            # Frontend dependencies
│   ├── tsconfig.json           # TypeScript config
│   └── vite.config.ts          # Vite configuration
├── 📋 SYSTEM_DESIGN.md         # Comprehensive system documentation
├── 📖 POSTGRESQL_SETUP.md      # Database setup guide
├── 📄 README.md                # This file
├── 📜 LICENSE                  # MIT License
├── 🤝 CONTRIBUTING.md          # Contribution guidelines
└── .gitignore                  # Git ignore rules
```

## 🚀 Quick Start

### Prerequisites
- **Node.js 18+** and npm
- **PostgreSQL 14+** (see database setup below)
- **Git** for version control

### Database Setup

#### Option 1: Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker run --name book-review-db \
  -e POSTGRES_DB=book_review_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

#### Option 2: Local PostgreSQL Installation
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Ubuntu**: `sudo apt install postgresql postgresql-contrib`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Shivamsafe/Books_Project.git
   cd Books_Project
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   # Copy environment template
   cp env.example .env
   # Edit .env with your PostgreSQL credentials
   ```
   
   Example `.env` configuration:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=book_review_db
   DB_USER=postgres
   DB_PASSWORD=password
   
   # JWT Secret (change in production!)
   JWT_SECRET=your-super-secret-jwt-key
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   ```

4. **Initialize database schema:**
   ```bash
   npm run setup-db
   ```

5. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   # Server runs on http://localhost:3001
   ```

2. **Start the frontend development server:**
   ```bash
   cd client
   npm run dev
   # Client runs on http://localhost:5173
   ```

3. **Open your browser and navigate to:**
   ```
   http://localhost:5173
   ```

## 📋 API Documentation

### Authentication Endpoints
```http
POST   /api/auth/signup     # Register new user
POST   /api/auth/login      # User authentication
```

### Book Management
```http
GET    /api/books           # List books (pagination, filters)
GET    /api/books/:id       # Get book details with reviews
POST   /api/books           # Create new book (auth required)
```

### Review System
```http
POST   /api/books/:id/reviews  # Add review (auth required)
PUT    /api/reviews/:id        # Update review (owner only)
DELETE /api/reviews/:id        # Delete review (owner only)
```

### Search & Discovery
```http
GET    /api/search          # Search books by title/author
GET    /api/health          # System health check
```

### Request/Response Examples

#### User Registration
```bash
# Local Development
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'

# Production API
curl -X POST https://book-projects-5.onrender.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "securepassword",
    "name": "John Doe"
  }'
```

#### Add a Book
```bash
# Local Development
curl -X POST http://localhost:3001/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Literature",
    "description": "A timeless American classic...",
    "publishedYear": 1925
  }'

# Production API
curl -X POST https://book-projects-5.onrender.com/api/books \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic Literature",
    "description": "A timeless American classic...",
    "publishedYear": 1925
  }'
```

## 🗄️ Database Schema

### Core Tables
- **users**: User accounts with authentication
- **books**: Book catalog with metadata
- **reviews**: User reviews and ratings

### Key Features
- **UUID Primary Keys**: Enhanced security and scalability
- **Foreign Key Constraints**: Data integrity enforcement
- **Automatic Timestamps**: Created/updated tracking
- **Performance Indexes**: Optimized queries for search and aggregation
- **Unique Constraints**: One review per user per book

### Database Relationships
```sql
users (1) ←→ (many) books
users (1) ←→ (many) reviews
books (1) ←→ (many) reviews
```

## 🔧 Development

### Available Scripts

#### Backend Scripts
```bash
npm run dev        # Start development server with hot reload
npm run build      # Build TypeScript to JavaScript
npm run start      # Start production server
npm run setup-db   # Initialize database schema
```

#### Frontend Scripts
```bash
npm run dev        # Start Vite development server
npm run build      # Build for production
npm run preview    # Preview production build
```

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_review_db
DB_USER=postgres
DB_PASSWORD=password

# Security
JWT_SECRET=your-jwt-secret-key

# Server
PORT=3001
NODE_ENV=development
```

### Code Quality
- **TypeScript**: Full type safety across the application
- **ESLint**: Code linting and style consistency
- **Error Handling**: Comprehensive error management
- **Input Validation**: Server-side validation for all inputs
- **Security**: SQL injection prevention, XSS protection

## 🚀 Deployment

### 🌐 Production Deployment (Current)

The application is currently deployed and accessible at:

- **🎨 Frontend**: [https://cheerful-pie-6a5860.netlify.app/](https://cheerful-pie-6a5860.netlify.app/)
  - Deployed on **Netlify** with automatic deployments from GitHub
  - Built with Vite for optimal performance
  - CDN-distributed for global accessibility

- **⚡ Backend API**: [https://book-projects-5.onrender.com/api/health](https://book-projects-5.onrender.com/api/health)
  - Deployed on **Render** with PostgreSQL database
  - Automatic SSL/TLS encryption
  - Health monitoring and automatic restarts

- **🗄️ Database**: PostgreSQL on Render (managed service)
  - Automatic backups and monitoring
  - Connection pooling for optimal performance
  - SSL-encrypted connections

### Production Architecture
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Netlify CDN   │    │   Render.com     │    │   PostgreSQL    │
│   (Frontend)    │────│   (Backend API)  │────│   (Database)    │
│                 │    │                  │    │                 │
│ React + Vite    │    │ Node.js/Express  │    │ Managed Service │
│ Global CDN      │    │ Auto SSL/TLS     │    │ Auto Backups    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Deployment Configuration

#### Frontend Environment Variables (Netlify)
```env
VITE_API_URL=https://book-projects-5.onrender.com
```

#### Backend Environment Variables (Render)
```env
NODE_ENV=production
PORT=10000
DATABASE_URL=postgresql://username:password@host:port/database
JWT_SECRET=production-secure-secret-key
```

### Local Development Setup

#### Environment Variables for Local Development
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_review_db
DB_USER=postgres
DB_PASSWORD=password

# Security
JWT_SECRET=your-jwt-secret-key

# Server
PORT=3001
NODE_ENV=development
```

### Alternative Deployment Options

#### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

#### Manual Production Setup
1. **Environment Configuration**: Set production environment variables
2. **Database**: Configure PostgreSQL with proper security settings
3. **Build**: Create optimized production builds
4. **Process Management**: Use PM2 for Node.js process management
5. **Reverse Proxy**: Configure nginx for static file serving
6. **SSL/TLS**: Enable HTTPS for secure communication

## 📈 Performance Features

### Backend Optimizations
- **Connection Pooling**: Efficient database connection management
- **Query Optimization**: Indexed queries for fast data retrieval
- **Pagination**: Efficient data loading with LIMIT/OFFSET
- **Caching**: Response caching for frequently accessed data

### Frontend Optimizations
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Asset Optimization**: Minified CSS and JavaScript
- **Responsive Images**: Optimized image loading
- **Service Workers**: Offline functionality (future enhancement)

## 🔒 Security Features

### Data Protection
- **Password Hashing**: bcrypt with 12 salt rounds
- **JWT Tokens**: Secure stateless authentication
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Input sanitization and validation

### API Security
- **CORS Configuration**: Controlled cross-origin requests
- **Rate Limiting**: Protection against abuse (future enhancement)
- **Helmet.js**: Security headers for enhanced protection
- **Input Validation**: Comprehensive server-side validation

## 📚 Documentation

- **[System Design](SYSTEM_DESIGN.md)**: Comprehensive low-level system architecture
- **[PostgreSQL Setup](POSTGRESQL_SETUP.md)**: Detailed database setup guide
- **[Contributing](CONTRIBUTING.md)**: Guidelines for contributing to the project
- **[License](LICENSE)**: MIT License terms

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on:
- Development setup
- Code style guidelines
- Pull request process
- Issue reporting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Future Enhancements

### Planned Features
- **Real-time Notifications**: WebSocket integration for live updates
- **Advanced Search**: Elasticsearch integration for better search
- **Social Features**: User profiles, following system, and recommendations
- **Mobile App**: React Native mobile application
- **Admin Dashboard**: Content management and analytics
- **API Rate Limiting**: Enhanced security and performance
- **Caching Layer**: Redis integration for improved performance
- **File Uploads**: Book cover image management
- **Email Notifications**: User engagement features

### Technical Improvements
- **Microservices**: Service decomposition for better scalability
- **GraphQL API**: More efficient data fetching
- **CI/CD Pipeline**: Automated testing and deployment
- **Kubernetes**: Container orchestration for production
- **Monitoring**: Application performance monitoring
- **Testing**: Comprehensive test coverage

## 📞 Support

If you encounter any issues or have questions:
1. Check the [documentation](POSTGRESQL_SETUP.md)
2. Search existing [issues](https://github.com/Shivamsafe/Books_Project/issues)
3. Create a new issue with detailed information
4. Contact the maintainers

## 🎯 Quick Links

- **🌐 Live App**: [https://cheerful-pie-6a5860.netlify.app/](https://cheerful-pie-6a5860.netlify.app/)
- **🔌 API Health**: [https://book-projects-5.onrender.com/api/health](https://book-projects-5.onrender.com/api/health)
- **📚 API Docs**: [API Endpoints Section](#-api-documentation)
- **🐳 Docker Setup**: [POSTGRESQL_SETUP.md](POSTGRESQL_SETUP.md)
- **📋 Contributing**: [CONTRIBUTING.md](CONTRIBUTING.md)

---

**Built with ❤️ using modern web technologies**

![Architecture](https://img.shields.io/badge/Architecture-Full%20Stack-blue)
![Database](https://img.shields.io/badge/Database-PostgreSQL-blue)
![Security](https://img.shields.io/badge/Security-JWT%20%2B%20bcrypt-green)
![Performance](https://img.shields.io/badge/Performance-Optimized-green)