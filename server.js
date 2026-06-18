require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { sequelize } = require('./models');

// Import routes
const authRoutes = require('./routes/authRoutes');
const postingRoutes = require('./routes/postingRoutes');
const healthRoutes = require('./routes/healthRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/postings', postingRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/favorites', favoriteRoutes);

// Health check endpoint - Test database connection
app.get('/api/health', async (req, res) => {
  try {
    // Ensure database is initialized
    await initDatabase();
    
    await sequelize.authenticate();
    res.status(200).json({
      status: 'success',
      message: 'Server is running',
      environment: process.env.NODE_ENV,
      database: 'connected',
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint tidak ditemukan',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Terjadi kesalahan pada server',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Initialize database
let dbInitialized = false;
const initDatabase = async () => {
  if (dbInitialized) return;
  
  try {
    console.log('Attempting to connect to database...');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_NAME:', process.env.DB_NAME);
    console.log('DB_USER:', process.env.DB_USER);
    
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    await sequelize.sync({ alter: false });
    console.log('✓ Database synchronized');
    
    dbInitialized = true;
  } catch (error) {
    console.error('✗ Database error:', error.message);
    console.error('Full error:', error);
    dbInitialized = false;
    throw error;
  }
};

// Start server (only for local development)
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      await initDatabase();

      app.listen(PORT, () => {
        console.log(`✓ Server is running on port ${PORT}`);
        console.log(`✓ API documentation:`);
        console.log(`  - Auth: POST /api/auth/register, POST /api/auth/login, POST /api/auth/logout`);
        console.log(`  - Postings: GET /api/postings, POST /api/postings (admin), GET/PUT/DELETE /api/postings/:id (admin)`);
        console.log(`  - Health: POST/PUT /api/health/:posting_id (admin), GET /api/health/:posting_id`);
        console.log(`  - Favorites: POST/GET/DELETE /api/favorites (user only)`);
        console.log(`\n✓ Environment: ${process.env.NODE_ENV || 'development'}`);
      });
    } catch (error) {
      console.error('✗ Failed to start server:', error.message);
      process.exit(1);
    }
  };

  startServer();
} else {
  // Initialize for production (Vercel serverless)
  console.log('Production mode detected - initializing database...');
  initDatabase().catch(error => {
    console.error('✗ Production init error:', error.message);
    console.error('Environment variables check:');
    console.error('- NODE_ENV:', process.env.NODE_ENV);
    console.error('- DB_HOST:', process.env.DB_HOST ? '✓' : '✗ MISSING');
    console.error('- DB_PORT:', process.env.DB_PORT ? '✓' : '✗ MISSING');
    console.error('- DB_NAME:', process.env.DB_NAME ? '✓' : '✗ MISSING');
    console.error('- DB_USER:', process.env.DB_USER ? '✓' : '✗ MISSING');
    console.error('- DB_PASSWORD:', process.env.DB_PASSWORD ? '✓' : '✗ MISSING');
  });
}

module.exports = app;

