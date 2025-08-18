#!/bin/bash

echo "🎨 Setting up MoodRing - AI-Powered Journal App"
echo "================================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Install backend dependencies
echo "🐍 Installing backend dependencies..."
cd server
pip3 install -r requirements.txt
cd ..

# Create .env file if it doesn't exist
if [ ! -f "server/.env" ]; then
    echo "🔧 Creating .env file..."
    echo "OPENAI_API_KEY=your_openai_api_key_here" > server/.env
    echo "FLASK_ENV=development" >> server/.env
    echo "⚠️  Please update server/.env with your OpenAI API key"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update server/.env with your OpenAI API key"
echo "2. Start the backend: cd server && python3 app.py"
echo "3. Start the frontend: cd client && npm start"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "Happy journaling! ✨"




