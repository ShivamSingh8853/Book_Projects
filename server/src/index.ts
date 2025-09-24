import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Routes
import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import reviewRoutes from './routes/reviews';
import searchRoutes from './routes/search';

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
});

export default app;
