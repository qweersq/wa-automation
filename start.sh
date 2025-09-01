#!/bin/bash

echo "🚀 Starting WhatsApp Automation Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp env.example .env
    echo "✅ .env file created. You can modify it if needed."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Start the server: npm start"
echo "2. Open http://localhost:3001/api/wa/test in your browser"
echo "3. Get QR code: http://localhost:3001/api/wa/qr"
echo "4. Scan QR code with WhatsApp mobile app"
echo "5. Test sending message using the API"
echo ""
echo "💡 For development with auto-restart: npm run dev"
