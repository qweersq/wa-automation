# WhatsApp Automation - Project Structure

## 📁 Directory Structure

```
wa-automation/
├── src/
│   ├── config/
│   │   └── app.js              # Application configuration
│   ├── controllers/
│   │   └── whatsappController.js # HTTP request handlers
│   ├── routes/
│   │   ├── whatsappRoutes.js   # WhatsApp API routes
│   │   └── generalRoutes.js    # General routes (health, etc.)
│   ├── services/
│   │   └── whatsappService.js  # WhatsApp business logic
│   ├── app.js                  # Express app setup
│   └── server.js               # Server entry point
├── index.js                    # Main entry point
├── package.json
├── README.md
└── check-chrome.js            # Chrome diagnostic tool
```

## 🏗️ Architecture Overview

### **MVC Pattern Implementation**

#### **Models (Services)**
- **`whatsappService.js`**: Contains all WhatsApp business logic
  - Client initialization and management
  - QR code generation
  - Message sending
  - Connection status management
  - Error handling and retry logic

#### **Views (Routes)**
- **`whatsappRoutes.js`**: WhatsApp-specific API endpoints
  - `/api/wa/qr` - Get QR code
  - `/api/wa/status` - Check connection status
  - `/api/wa/send-message` - Send WhatsApp message
  - `/api/wa/test` - Test endpoint

- **`generalRoutes.js`**: General application endpoints
  - `/health` - Health check

#### **Controllers**
- **`whatsappController.js`**: HTTP request/response handling
  - Input validation
  - Error handling
  - Response formatting
  - Service coordination

### **Configuration**
- **`app.js`**: Centralized configuration management
  - Environment variables
  - Port settings
  - Debug mode
  - Puppeteer arguments

### **Application Setup**
- **`app.js`**: Express application setup
  - Middleware configuration
  - Route registration
  - Error handling
  - Graceful shutdown

- **`server.js`**: Server startup and management

## 🔄 Data Flow

```
HTTP Request → Routes → Controller → Service → WhatsApp Web JS
                ↓
HTTP Response ← Controller ← Service ← WhatsApp Web JS
```

## 📋 Key Features

### **Separation of Concerns**
- **Routes**: Define API endpoints and HTTP methods
- **Controllers**: Handle HTTP requests/responses and validation
- **Services**: Contain business logic and external integrations
- **Config**: Centralized configuration management

### **Error Handling**
- Global error handler in `app.js`
- Service-level error handling
- Controller-level error responses
- Graceful error recovery

### **Configuration Management**
- Environment-based configuration
- Debug mode support
- Flexible Puppeteer settings
- Centralized port management

### **Maintainability**
- Modular structure
- Clear responsibilities
- Easy to test individual components
- Scalable architecture

## 🚀 Benefits of New Structure

1. **Maintainability**: Each component has a single responsibility
2. **Testability**: Easy to unit test individual services and controllers
3. **Scalability**: Easy to add new features and endpoints
4. **Readability**: Clear separation of concerns
5. **Reusability**: Services can be reused across different controllers
6. **Error Handling**: Centralized and consistent error handling
7. **Configuration**: Centralized configuration management

## 🔧 Adding New Features

### To add a new endpoint:

1. **Add method to service** (`src/services/whatsappService.js`)
2. **Add method to controller** (`src/controllers/whatsappController.js`)
3. **Add route** (`src/routes/whatsappRoutes.js`)

### To add new configuration:

1. **Update config** (`src/config/app.js`)
2. **Update environment variables** (`.env`)

### To add new middleware:

1. **Update app setup** (`src/app.js`)

## 📝 Code Standards

- **ES6+ Classes**: Used for services and controllers
- **Async/Await**: Used for asynchronous operations
- **Error Handling**: Consistent error handling patterns
- **Logging**: Structured logging with timestamps
- **Comments**: Clear documentation for complex logic
