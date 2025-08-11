# Standard library imports
from datetime import datetime, timedelta, timezone
import os
import uuid

# Remote library imports
from flask import request, make_response, current_app, send_from_directory, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_restful import Resource
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.utils import secure_filename

# Local imports
from config import app, db, api
from sqlalchemy import select

# Basic route for testing
@app.route('/')
def home():
    return jsonify({"message": "MoodRing API is running!"})

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)