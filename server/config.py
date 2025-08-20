# Flask application configuration and setup
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Flask application
app = Flask(__name__)

# Database configuration
# Use DATABASE_URL from environment or default to SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///moodring.db')

# Disable SQLAlchemy modification tracking for performance
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Secret key for session management and security
# Use SECRET_KEY from environment or default to development key
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')

# Initialize Flask extensions
# SQLAlchemy for database ORM
db = SQLAlchemy(app)

# Flask-Migrate for database migrations
migrate = Migrate(app, db)

# Flask-RESTful for API endpoints
api = Api(app)

# Enable Cross-Origin Resource Sharing (CORS)
# Allows frontend to make requests to backend from different origins
CORS(app)

# Import models after database is initialized
# This ensures models can use the db instance
from models import *

# Import routes after models are imported
# This ensures routes can access the models
# from routes import *
