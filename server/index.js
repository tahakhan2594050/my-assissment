import express from 'express';
import cors from 'cors';

const app = express();

// CORS configuration
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Content Creation API is Live!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
});

// Simple test endpoints without authentication for now
app.get('/api/user/get-user-creations', (req, res) => {
  // Return dummy data for testing
  const dummyCreations = [
    {
      id: 1,
      title: 'Sample AI Article',
      content: 'This is a sample AI-generated article about technology trends...',
      type: 'article',
      created_at: new Date().toISOString(),
      user_id: 'test-user'
    },
    {
      id: 2,
      title: 'Sample Blog Title',
      content: '10 Amazing Blog Title Ideas for Your Content Strategy',
      type: 'blog-title',
      created_at: new Date().toISOString(),
      user_id: 'test-user'
    }
  ];

  res.json({
    success: true,
    creations: dummyCreations,
    count: dummyCreations.length,
    note: 'Using dummy data for testing'
  });
});

app.get('/api/ai/test', (req, res) => {
  res.json({
    success: true,
    message: 'AI endpoint is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/user/test', (req, res) => {
  res.json({
    success: true,
    message: 'User endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.path} not found` 
  });
});

export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}