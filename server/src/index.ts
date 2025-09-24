import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Database connection
import { testConnection } from '../config/database';

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
app.use(cors());
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
