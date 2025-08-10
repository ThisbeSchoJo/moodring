# MoodRing - AI-Powered Journal App

A beautiful journal application that uses AI to analyze emotions and assign colors to your entries. Built with React (frontend) and Flask (backend).

## Features

- 📝 **Journal Entries**: Write and save your daily thoughts and feelings
- 🎨 **AI Emotion Analysis**: Automatic emotion detection and color assignment
- 📊 **Emotion Tracking**: Visual representation of your emotional journey
- 💫 **Real-time Preview**: See AI analysis as you type
- 📱 **Responsive Design**: Beautiful interface that works on all devices
- 🔄 **Edit & Delete**: Full CRUD operations for your entries

## Tech Stack

- **Frontend**: React, React Router, Axios, Lucide React Icons
- **Backend**: Flask, Flask-CORS, OpenAI API
- **Styling**: Custom CSS with modern design patterns

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- Python (v3.8 or higher)
- OpenAI API key

### 1. Clone and Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
pip install -r requirements.txt
```

### 2. Environment Setup

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add your OpenAI API key to the `.env` file:

```
OPENAI_API_KEY=your_openai_api_key_here
FLASK_ENV=development
```

### 3. Start the Development Servers

#### Start the Flask Backend

```bash
cd server
python app.py
```

The backend will run on `http://localhost:5000`

#### Start the React Frontend

In a new terminal:

```bash
cd client
npm start
```

The frontend will run on `http://localhost:3000`

### 4. Usage

1. Open your browser and navigate to `http://localhost:3000`
2. Click "New Entry" to create your first journal entry
3. Write about your day, thoughts, or feelings
4. The AI will automatically analyze your emotions and assign colors
5. View your emotional journey in the main journal view

## API Endpoints

### Journal Entries
- `GET /api/entries` - Get all journal entries
- `POST /api/entries` - Create a new entry with AI analysis
- `GET /api/entries/<id>` - Get a specific entry
- `PUT /api/entries/<id>` - Update an entry (re-analyzes emotions)
- `DELETE /api/entries/<id>` - Delete an entry

### Emotion Analysis
- `GET /api/emotions/summary` - Get emotion statistics across all entries

## AI Emotion Analysis

The app uses OpenAI's GPT-3.5-turbo to analyze journal entries and provide:

- **Primary Emotion**: The dominant emotion detected
- **Emotion Intensity**: Scale of 1-10
- **Color Assignment**: Hex color code representing the emotion
- **Emotion Tags**: Array of related emotions

## Project Structure

```
moodring/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.js
│   │   │   ├── Journal.js
│   │   │   ├── EntryForm.js
│   │   │   └── EntryDetail.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                # Flask backend
│   ├── app.py            # Main Flask application
│   ├── requirements.txt   # Python dependencies
│   └── .env              # Environment variables
└── README.md
```

## Customization

### Adding New Emotions

To customize the emotion analysis, modify the system prompt in `server/app.py`:

```python
"content": "You are an emotion analyzer. Analyze the given text and return a JSON response with: 1) primary_emotion (string), 2) emotion_intensity (1-10), 3) color_assignment (hex color code), 4) emotion_tags (array of emotions). Be empathetic and accurate."
```

### Styling

The app uses a modern gradient design with glassmorphism effects. You can customize colors and styles in `client/src/App.css`.

## Deployment

### Frontend (React)
```bash
cd client
npm run build
```

### Backend (Flask)
For production, consider using:
- Gunicorn for WSGI server
- PostgreSQL for database
- Environment variables for configuration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

