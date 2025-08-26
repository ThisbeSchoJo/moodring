# MoodRing - AI-Powered Journal App ✨

A modern, AI-powered journal application that analyzes your emotions and creates colorful visual representations of your mood journey. Built with React, Flask, and OpenAI's GPT-3.5-turbo.

## Features

- **AI Emotion Analysis**: Automatic emotion detection and color assignment using GPT-3.5-turbo
- **Beautiful Visual Design**: Gradient backgrounds with seamless blending effects and golden ratio proportions
- **User Authentication**: Secure login and signup system with password visibility toggles
- **Personality Profiles**: AI-generated insights based on your journaling patterns
- **Responsive Design**: Works beautifully on all devices
- **Real-time Analysis**: Instant emotion detection as you write
- **Accessibility**: Full keyboard navigation and ARIA labels
- **Modern UI**: Glassmorphism effects, shimmer animations, and smooth transitions

## 📸 Screenshots & Demo

### Screenshots

![Signup Form](screenshots/signup.png)
![Login Form](screenshots/login.png)
![New Entry Form](screenshots/newentry.png)
![Journal View](screenshots/journal.png)
![Mood Color Guide](screenshots/colorguide.png)
![Entry Detail](screenshots/entrydetail.png)
![Profile Page](screenshots/profile.png)

### Demo Video

<!-- Add demo video link here -->
<!-- Example: [Watch Demo Video](https://youtube.com/watch?v=your-video-id) -->

## Tech Stack

- **Frontend**: React 18, React Router v6, Axios, Lucide React Icons
- **Backend**: Flask, Flask-SQLAlchemy, OpenAI API (GPT-3.5-turbo)
- **Database**: SQLite with Alembic migrations
- **Styling**: CSS3 with golden ratio proportions, gradients, and animations

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8 or higher
- OpenAI API key

### Setup

1. **Clone and install dependencies**

```bash
git clone <repository-url>
cd moodring
chmod +x setup.sh
./setup.sh
```

2. **Configure environment**

Edit `server/.env` and add your OpenAI API key:

```bash
OPENAI_API_KEY=your_actual_openai_api_key_here
FLASK_ENV=development
```

3. **Start the application**

Backend (Terminal 1):

```bash
cd server
python app.py
```

Frontend (Terminal 2):

```bash
cd client
npm start
```

4. **Optional: Seed with sample data**

```bash
cd server
python seed.py
```

## Usage

1. Open `http://localhost:3000` in your browser
2. Sign up or log in
3. Create your first journal entry
4. Watch as AI analyzes your emotions and assigns beautiful colors
5. View your emotional journey in the main journal
6. Check out your AI-generated personality profile

## API Endpoints

- `POST /login` - User login
- `POST /users` - User registration
- `GET /entries?user_id=<id>` - Get user's entries
- `POST /entries` - Create new entry
- `PATCH /entries/<id>` - Update entry
- `DELETE /entries/<id>?user_id=<id>` - Delete entry
- `POST /analyze-mood` - Analyze text for emotions
- `GET /user-profile/<user_id>` - Get personality profile

## Project Structure

```
moodring/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Auth/     # Login/Signup components
│   │   │   ├── Common/   # Shared components (Header, EntryForm, etc.)
│   │   │   ├── EntryDetail/ # Entry detail and editing
│   │   │   ├── Journal/  # Journal list components
│   │   │   └── Profile/  # Profile and statistics
│   │   ├── context/      # Authentication context
│   │   ├── styling/      # CSS files
│   │   └── utils/        # Utility functions (mood colors, error handling)
│   └── package.json
├── server/                # Flask backend
│   ├── app.py            # Main application
│   ├── models.py         # Database models
│   ├── seed.py           # Sample data
│   ├── migrations/       # Database migrations
│   └── requirements.txt  # Python dependencies
└── setup.sh              # Setup script
```

## Key Features

### **AI Integration**

- **Mood Analysis**: Uses GPT-3.5-turbo to detect emotions in journal entries
- **Personality Profiles**: Generates comprehensive personality insights
- **Consistent Detection**: Maintains emotional consistency across entries

### **Visual Design**

- **Golden Ratio**: All spacing and typography follows golden ratio (1.618)
- **Mood-Based Colors**: Each emotion has unique gradient colors
- **Seamless Blending**: Adjacent entries blend colors for visual continuity
- **Glassmorphism**: Modern glass-like effects throughout the UI

### **User Experience**

- **Accessibility**: Full keyboard navigation and screen reader support
- **Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Hover effects, shimmer animations, and transitions
- **Error Handling**: Comprehensive error messages and recovery

## Customization

- **Add emotions**: Edit `client/src/utils/moodColors.js`
- **Modify AI analysis**: Update prompts in `server/app.py`
- **Change styling**: Modify CSS files in `client/src/styling/`
- **Adjust proportions**: Update golden ratio calculations in components

## Code Quality

- **ESLint**: Clean code with no warnings
- **Component Structure**: Well-organized, modular components
- **Error Handling**: Centralized error management
- **Documentation**: Comprehensive code comments
- **Performance**: Optimized builds and efficient rendering

## Deployment

**Frontend:**

```bash
cd client
npm run build
```

**Backend:** Consider using PostgreSQL and Gunicorn for production.

## Support

If you encounter issues:

1. Check all dependencies are installed
2. Verify your OpenAI API key is correct
3. Ensure both frontend and backend are running
4. Check the browser console for any errors

For additional help, please open an issue on GitHub.

---

**Happy Journaling! ✨📖**
