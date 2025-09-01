const express = require('express');
const cors = require('cors');
const config = require('./config/app');

// Import routes
const whatsappRoutes = require('./routes/whatsappRoutes');
const generalRoutes = require('./routes/generalRoutes');

class App {
  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Setup middleware
  setupMiddleware() {
    // CORS
    this.app.use(cors());
    
    // Body parsing middleware
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Request logging (if debug mode is enabled)
    if (config.debug) {
      this.app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
      });
    }
  }

  // Setup routes
  setupRoutes() {
    // API routes
    this.app.use('/api/wa', whatsappRoutes);
    
    // General routes
    this.app.use('/', generalRoutes);
    
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
      });
    });
    
    // Global error handler
    this.app.use((error, req, res, next) => {
      console.error('Global error handler:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: config.debug ? error.message : 'Something went wrong'
      });
    });
  }

  // Start server
  start() {
    return new Promise((resolve) => {
      const server = this.app.listen(config.port, () => {
        console.log(`🚀 WhatsApp automation server running on port ${config.port}`);
        console.log(`📱 Test endpoint: http://localhost:${config.port}/api/wa/test`);
        console.log(`🔗 QR endpoint: http://localhost:${config.port}/api/wa/qr`);
        console.log(`📊 Status endpoint: http://localhost:${config.port}/api/wa/status`);
        console.log(`❤️  Health check: http://localhost:${config.port}/health`);
        
        if (config.debug) {
          console.log('🐛 Debug mode enabled');
        }
        
        resolve(server);
      });

      // Graceful shutdown
      process.on('SIGTERM', () => {
        console.log('SIGTERM received, shutting down gracefully');
        server.close(() => {
          console.log('Process terminated');
          process.exit(0);
        });
      });

      process.on('SIGINT', () => {
        console.log('SIGINT received, shutting down gracefully');
        server.close(() => {
          console.log('Process terminated');
          process.exit(0);
        });
      });
    });
  }

  // Get Express app instance
  getApp() {
    return this.app;
  }
}

module.exports = App;
