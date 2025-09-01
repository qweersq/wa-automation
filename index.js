// Entry point for WhatsApp Automation Server
// This file now serves as a simple entry point to the new structured application

const startServer = require('./src/server');

// Start the server
startServer().catch((error) => {
  console.error('Failed to start WhatsApp automation server:', error);
  process.exit(1);
});
