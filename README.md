# WhatsApp Automation Server

A Node.js server that provides WhatsApp automation capabilities using WhatsApp Web JS and Puppeteer.

## Features

- WhatsApp Web integration
- QR code generation for authentication
- Message sending capabilities
- RESTful API endpoints
- Automatic reconnection handling
- Cross-platform support

## Prerequisites

- Node.js (v14 or higher)
- Google Chrome browser
- macOS, Windows, or Linux

## Installation

1. **Clone or navigate to the project directory:**
   ```bash
   cd wa-automation
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit the `.env` file with your preferred settings.

4. **Run the diagnostic tool (recommended):**
   ```bash
   npm run check-chrome
   ```

5. **Start the server:**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check
- `GET /health` - Server health status

### WhatsApp Status
- `GET /api/wa/test` - Test endpoint
- `GET /api/wa/status` - Connection status
- `GET /api/wa/qr` - Get QR code for authentication

### Messaging
- `POST /api/wa/send-message` - Send WhatsApp message

### Session Management
- `POST /api/wa/destroy-session` - Destroy current session and reinitialize
- `POST /api/wa/logout` - Logout from WhatsApp and reset session
- `POST /api/wa/restart` - Restart WhatsApp service completely

## Usage

1. **Start the server:**
   ```bash
   npm start
   ```

2. **Get QR code for authentication:**
   ```bash
   curl http://localhost:3001/api/wa/qr
   ```

3. **Scan the QR code with your WhatsApp mobile app**

4. **Check connection status:**
   ```bash
   curl http://localhost:3001/api/wa/status
   ```

5. **Send a message:**
   ```bash
   curl -X POST http://localhost:3001/api/wa/send-message \
     -H "Content-Type: application/json" \
     -d '{"phone": "1234567890", "message": "Hello from automation!"}'
   ```

6. **Session management (jika ada masalah koneksi):**
   ```bash
   # Destroy session dan reinitialize
   curl -X POST http://localhost:3001/api/wa/destroy-session
   
   # Logout dan reset session
   curl -X POST http://localhost:3001/api/wa/logout
   
   # Restart service sepenuhnya
   curl -X POST http://localhost:3001/api/wa/restart
   ```

## Troubleshooting

### Common Issues

#### 1. Puppeteer Timeout Error
**Error:** `TimeoutError: Timed out after 30000 ms while trying to connect to the browser`

**Solutions:**
- Run the diagnostic tool: `npm run check-chrome`
- Ensure Google Chrome is installed and up to date
- Try running Chrome manually to verify it works
- Check if antivirus software is blocking Chrome
- Increase timeout in `.env` file

#### 2. Chrome Not Found
**Error:** `Chrome not found in common locations`

**Solutions:**
- Install Google Chrome from https://www.google.com/chrome/
- Set the correct Chrome path in `.env`:
  ```
  CHROME_PATH=/Applications/Google Chrome.app/Contents/MacOS/Google Chrome
  ```

#### 3. Port Already in Use
**Error:** `EADDRINUSE: address already in use`

**Solutions:**
- Change the port in `.env`:
  ```
  WA_AUTOMATION_PORT=3002
  ```
- Or kill the process using the port:
  ```bash
  lsof -ti:3001 | xargs kill -9
  ```

#### 4. Authentication Issues
**Error:** `WhatsApp authentication failed`

**Solutions:**
- Clear the `.wwebjs_auth` folder (if it exists)
- Restart the server
- Try scanning the QR code again
- Ensure your phone has a stable internet connection

### macOS Specific Issues

#### 1. Sandbox Issues
If you encounter sandbox-related errors, the server is already configured with the necessary flags:
- `--no-sandbox`
- `--disable-setuid-sandbox`

#### 2. Permission Issues
If Chrome can't start due to permissions:
```bash
# Make Chrome executable
chmod +x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
```

#### 3. Gatekeeper Issues
If macOS blocks Chrome:
1. Go to System Preferences > Security & Privacy
2. Click "Allow Anyway" for Google Chrome
3. Or run: `sudo spctl --master-disable`

### Debug Mode

Enable debug mode for more verbose logging:

1. Set `DEBUG=true` in your `.env` file
2. Restart the server
3. Check the console output for detailed information

### Manual Chrome Testing

Test if Chrome works manually:
```bash
# Test Chrome launch
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --no-sandbox --version
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WA_AUTOMATION_PORT` | Server port | `3001` |
| `CHROME_PATH` | Path to Chrome executable | Auto-detected |
| `DEBUG` | Enable debug logging | `false` |

## Development

For development with auto-restart:
```bash
npm run dev
```

## Security Notes

- The server runs on localhost by default
- QR codes contain sensitive authentication data
- Keep your `.wwebjs_auth` folder secure
- Don't expose the server to the public internet without proper authentication

## Support

If you continue to experience issues:

1. Run the diagnostic tool: `npm run check-chrome`
2. Check the console output for error messages
3. Ensure all prerequisites are met
4. Try running with debug mode enabled
5. Check the [WhatsApp Web JS documentation](https://github.com/pedroslopez/whatsapp-web.js)

## License

This project is for internal use only.
