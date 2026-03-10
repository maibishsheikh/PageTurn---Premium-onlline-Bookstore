const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later' }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api/', limiter);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/books', require('./routes/bookRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'PageTurn Bookstore API is running', timestamp: new Date().toISOString() });
});

// Seed route (temporary - remove after seeding)
const { seedDatabase } = require('./controllers/seedController');
app.get('/api/seed', seedDatabase);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handler
app.use(errorHandler);

// Export app for Vercel serverless
module.exports = app;

// Start server only when run directly (not imported by Vercel)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n📚 PageTurn Bookstore API running on port ${PORT}`);
    console.log(`   Environment: ${process.env.NODE_ENV}`);
    console.log(`   Health: http://localhost:${PORT}/api/health\n`);
  });
}
