import express from 'express';
import cors from 'cors';

const app = express();

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://localhost:3000',
      'https://localhost:5173'
    ];
    
    // Allow all vercel.app domains
    if (origin && origin.includes('.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow specific domains
    if (origin && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // For production, allow all origins (you can restrict this later)
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'x-requested-with',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers'
  ],
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Add request logging for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Origin:', req.headers.origin);
  console.log('Headers:', req.headers);
  next();
});

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'AI Content Creation API is Live!', 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    cors: 'enabled'
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production',
    cors: 'enabled'
  });
});

// Test endpoint without authentication
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working without authentication',
    timestamp: new Date().toISOString(),
    origin: req.headers.origin
  });
});

// Simple user creations endpoint (no auth for testing)
app.get('/api/user/get-user-creations', (req, res) => {
  console.log('GET /api/user/get-user-creations called');
  console.log('Headers:', req.headers);
  
  // Return dummy data for testing
  const dummyCreations = [
    {
      id: 1,
      title: 'Sample AI Article',
      content: 'This is a sample AI-generated article about technology trends and innovations in 2024...',
      type: 'article',
      created_at: new Date().toISOString(),
      user_id: 'test-user',
      imageUrl: null
    },
    {
      id: 2,
      title: 'Amazing Blog Title Ideas',
      content: '10 Creative Blog Title Ideas That Will Boost Your Content Strategy and Engagement',
      type: 'blog-title',
      created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      user_id: 'test-user',
      imageUrl: null
    },
    {
      id: 3,
      title: 'AI Generated Image',
      content: 'Beautiful landscape with mountains and lakes',
      type: 'image',
      created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      user_id: 'test-user',
      imageUrl: 'https://via.placeholder.com/300x200'
    }
  ];

  res.json({
    success: true,
    creations: dummyCreations,
    count: dummyCreations.length,
    note: 'Using dummy data for testing - CORS enabled'
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
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.method} ${req.path} not found`,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'GET /api/test',
      'GET /api/user/get-user-creations',
      'GET /api/ai/test',
      'GET /api/user/test'
    ]
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