# PostgreSQL Migration Guide

This guide explains how to set up and use PostgreSQL with the Book Review System.

## 🚀 Quick Start

### Step 1: Install PostgreSQL

#### Option A: Using Docker (Recommended)
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

#### Option B: Local Installation
- **macOS**: `brew install postgresql && brew services start postgresql`
- **Ubuntu**: `sudo apt install postgresql postgresql-contrib`
- **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

### Step 2: Configure Environment
```bash
cd server
cp env.example .env
# Edit .env with your database credentials
```

### Step 3: Initialize Database
```bash
npm run setup-db
```

### Step 4: Start the Server
```bash
npm run dev
```

## 📊 Database Schema

The system now uses the following PostgreSQL tables:

### Users Table
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

### Books Table
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

### Reviews Table
```sql
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book_id, user_id)
);
```

## 🔧 Configuration

### Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=book_review_db
DB_USER=postgres
DB_PASSWORD=password

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Database Connection Settings
- **Connection Pool Size**: 20 connections
- **Idle Timeout**: 30 seconds
- **Connection Timeout**: 2 seconds
- **Auto-reconnection**: Enabled

## 🚀 Performance Features

### Indexes
- Full-text search on book titles
- Author and genre filtering
- Rating aggregation
- Timestamp-based sorting

### Views
- `books_with_stats` - Books with average ratings and review counts

### Triggers
- Automatic `updated_at` timestamp updates
- Data validation constraints

## 🛠️ Development Commands

```bash
# Database management
npm run setup-db          # Initialize database schema
npm run dev               # Start development server
npm run build             # Build for production

# Docker management
docker start book-review-db    # Start existing container
docker stop book-review-db     # Stop container
docker rm book-review-db       # Remove container
```

## 🔍 Troubleshooting

### Common Issues

#### 1. Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution**: Start PostgreSQL service or Docker container

#### 2. Database Does Not Exist
```
Error: database "book_review_db" does not exist
```
**Solution**: Create database manually or use Docker with environment variables

#### 3. Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution**: Check username/password in `.env` file

#### 4. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5432
```
**Solution**: Stop existing PostgreSQL instance or change port

### Database Reset
```bash
# Using Docker
docker stop book-review-db
docker rm book-review-db
docker run --name book-review-db \
  -e POSTGRES_DB=book_review_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Reinitialize schema
npm run setup-db
```

## 📈 Migration Benefits

✅ **Data Persistence**: No data loss on server restart  
✅ **Better Performance**: Database indexes and query optimization  
✅ **Scalability**: Support for concurrent users  
✅ **Data Integrity**: Foreign key constraints and validation  
✅ **Full-text Search**: Advanced search capabilities  
✅ **Production Ready**: Suitable for production deployment  

## 🔄 From In-Memory to PostgreSQL

### What Changed
- **Database Layer**: Replaced in-memory arrays with PostgreSQL tables
- **Async Operations**: All database operations are now async/await
- **UUIDs**: Using UUID primary keys instead of incremental IDs
- **Relationships**: Proper foreign key relationships
- **Indexing**: Performance optimizations with database indexes

### What Stayed the Same
- **API Endpoints**: All endpoints remain identical
- **Authentication**: JWT authentication unchanged
- **Client Code**: Frontend requires no changes
- **Response Format**: API responses maintain same structure

## 🛡️ Security Considerations

- **Password Hashing**: bcrypt with salt rounds
- **SQL Injection**: Parameterized queries prevent injection
- **Connection Pooling**: Secure connection management
- **Environment Variables**: Sensitive data in `.env` file
- **UUID Primary Keys**: Harder to guess than incremental IDs

This migration maintains full backward compatibility while providing enterprise-grade data persistence and performance improvements.
