import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Database connection
import { testConnection, query } from '../config/database';

// Routes
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import reviewRoutes from './routes/reviews';
import searchRoutes from './routes/search';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());

// CORS configuration for production
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://cheerful-pie-6a5860.netlify.app',
        'https://your-custom-domain.com'
      ]
    : ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/search', searchRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Book Review API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const initializeDatabase = async () => {
  try {
    console.log('🔄 Initializing database schema...');
    
    // Create users table
    await query(`
      CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create books table
    await query(`
      CREATE TABLE IF NOT EXISTS books (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title VARCHAR(255) NOT NULL,
          author VARCHAR(255) NOT NULL,
          genre VARCHAR(255) NOT NULL,
          description TEXT NOT NULL,
          published_year INT NOT NULL,
          created_by UUID NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    // Create reviews table
    await query(`
      CREATE TABLE IF NOT EXISTS reviews (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          book_id UUID NOT NULL,
          user_id UUID NOT NULL,
          rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
          comment TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          UNIQUE (book_id, user_id)
      );
    `);

    // Create indexes
    await query(`CREATE INDEX IF NOT EXISTS idx_books_title ON books (title);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_books_author ON books (author);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_books_genre ON books (genre);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_book_id ON reviews (book_id);`);
    await query(`CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews (user_id);`);

    console.log('✅ Database schema initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

const startServer = async () => {
  try {
    // Test database connection
    const isConnected = await testConnection();
    if (!isConnected) {
      console.log('⚠️  PostgreSQL not available. Please set up PostgreSQL to use the full database features.');
      console.log('📖 See POSTGRESQL_SETUP.md for setup instructions.');
      console.log('');
      console.log('To start PostgreSQL with Docker:');
      console.log('docker run --name book-review-db -e POSTGRES_DB=book_review_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15');
      console.log('');
      console.log('❌ Server cannot start without database connection.');
      process.exit(1);
    }

    // Initialize database schema (for production deployment)
    if (process.env.NODE_ENV === 'production') {
      await initializeDatabase();
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
      console.log(`📚 Book Review API endpoints:`);
      console.log(`   POST   /api/auth/signup`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/books`);
      console.log(`   GET    /api/books`);
      console.log(`   GET    /api/books/:id`);
      console.log(`   POST   /api/books/:id/reviews`);
      console.log(`   PUT    /api/reviews/:id`);
      console.log(`   DELETE /api/reviews/:id`);
      console.log(`   GET    /api/search`);
      console.log(`   GET    /api/health`);
      console.log(`💾 Database: PostgreSQL connected`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
