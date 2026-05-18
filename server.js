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

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
  });
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

// Start server
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('✓ Database connection established');

    // Sync database (set alter: false untuk development, false untuk production)
    await sequelize.sync({ alter: false });
    console.log('✓ Database synchronized');

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

module.exports = app;
