const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB, getConnectionStatus } = require('./config/db');
const config = require('./config');
const routes = require('./routes');

const app = express();

// Connect to MongoDB (non-blocking)
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'VSSCT API',
    version: '1.0.0',
    description: 'Backend API for Vishwa Shanti Sewa Charitable Trust',
    status: 'running',
    database: getConnectionStatus() ? 'connected' : 'disconnected',
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: getConnectionStatus() ? 'connected' : 'disconnected',
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start Server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 VSSCT Server running on http://localhost:${PORT}`);
  console.log(`📱 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🔧 Environment: ${config.nodeEnv}`);
});
