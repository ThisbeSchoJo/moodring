# Standard library imports
from datetime import datetime, timedelta, timezone
import os
import uuid
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Remote library imports
from flask import request, make_response, current_app, send_from_directory, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from flask_restful import Resource
from flask_jwt_extended.exceptions import JWTExtendedException
from werkzeug.utils import secure_filename
import openai

# Local imports
from config import app, db, api
from sqlalchemy import select
from models import Entry, User

# Basic route for testing
@app.route('/')
def home():
    api_key = os.getenv('OPENAI_API_KEY')
    return jsonify({
        "message": "MoodRing API is running!",
        "openai_key_configured": bool(api_key and api_key != 'your_openai_api_key_here')
    })

class AllUsers(Resource):
    def get(self):
        users = User.query.all()
        response_body = [user.to_dict() for user in users]
        return make_response(response_body, 200)
    
    def post(self):
        try:
            data = request.get_json()
            new_user = User(
                username = data['username']
            )
            new_user.set_password(data['password'])
            db.session.add(new_user)
            db.session.commit()
            return make_response(new_user.to_dict(), 201)
        except KeyError as e:
            return make_response({"error": f"Missing required field: {str(e)}"}, 400)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": "Failed to create user"}, 500)

api.add_resource(AllUsers, '/users')

class UserById(Resource):
    def get(self, id):
        user = db.session.get(User, id)
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "User not found"}, 404)
    
    def patch(self, id):
        user = db.session.get(User, id)
        if user:
            data = request.get_json()
            for key, value in data.items():
                setattr(user, key, value)
            db.session.commit()
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "User not found"}, 404)  
    
    def delete(self, id):
        user = db.session.get(User, id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)
        else:
            return make_response({"error": "User not found"}, 404)

api.add_resource(UserById, '/users/<int:id>')

class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            user = User.query.filter_by(username=data['username']).first()
            
            if user and user.authenticate(data['password']):
                return make_response(user.to_dict(), 200)
            else:
                return make_response({"error": "Invalid username or password"}, 401)
        except Exception as e:
            return make_response({"error": "Login failed"}, 500)

api.add_resource(Login, '/login')

class AllEntries(Resource):
    def get(self):
        # For now, we'll get user_id from query params
        # In a real app, this would come from JWT token
        user_id = request.args.get('user_id', 1)  # Default to user 1 for now
        entries = Entry.query.filter_by(user_id=user_id).all()
        response_body = [entry.to_dict() for entry in entries]
        return make_response(response_body, 200)
    
    def post(self):
        try:
            data = request.get_json()
            new_entry = Entry(
                title = data['title'],
                content = data['content'],
                mood = data.get('mood', 'neutral'),  # Default to neutral if not provided
                user_id = data.get('user_id', 1)  # Default to user 1 if not provided
            )
            db.session.add(new_entry)
            db.session.commit()
            return make_response(new_entry.to_dict(), 201)
        except KeyError as e:
            return make_response({"error": f"Missing required field: {str(e)}"}, 400)
        except Exception as e:
            db.session.rollback()
            return make_response({"error": "Failed to create entry"}, 500)

api.add_resource(AllEntries, '/entries')

class EntryById(Resource):
    def get(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            return make_response(entry.to_dict(), 200)
        else:
            return make_response({"error": "Entry not found"}, 404)
    def patch(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            try:
                data = request.get_json()
                user_id = data.get('user_id')
                
                # Verify that the user owns this entry
                if entry.user_id != user_id:
                    return make_response({"error": "You can only edit your own entries"}, 403)
                
                # Only allow updating title, content, and mood
                allowed_fields = ['title', 'content', 'mood']
                for key, value in data.items():
                    if key in allowed_fields and hasattr(entry, key):
                        setattr(entry, key, value)
                
                db.session.commit()
                return make_response(entry.to_dict(), 200)
            except Exception as e:
                db.session.rollback()
                return make_response({"error": "Failed to update entry"}, 500)
        else:
            return make_response({"error": "Entry not found"}, 404)
    
    def delete(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            try:
                # Get user_id from query params for delete
                user_id = request.args.get('user_id')
                
                # Verify that the user owns this entry
                if entry.user_id != int(user_id):
                    return make_response({"error": "You can only delete your own entries"}, 403)
                
                db.session.delete(entry)
                db.session.commit()
                return make_response({}, 204)
            except Exception as e:
                db.session.rollback()
                return make_response({"error": "Failed to delete entry"}, 500)
        else:
            return make_response({"error": "Entry not found"}, 404)

api.add_resource(EntryById, '/entries/<int:id>')

class AnalyzeMood(Resource):
    def post(self):
        try:
            data = request.get_json()
            content = data.get('content', '')
            
            if not content:
                return make_response({"error": "Content is required"}, 400)
            
            # Set up OpenAI client
            api_key = os.getenv('OPENAI_API_KEY')
            
            if not api_key or api_key == 'your_openai_api_key_here':
                return make_response({"error": "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file."}, 500)
            
            # Create the prompt for mood analysis
            prompt = f"""
            Analyze the emotional tone of this journal entry and classify it into one of these categories:
            - happy: positive, joyful, excited feelings
            - excited: enthusiastic, energetic, thrilled feelings  
            - calm: peaceful, relaxed, content feelings
            - neutral: balanced, neither positive nor negative
            - sad: unhappy, down, disappointed feelings
            - angry: frustrated, irritated, mad feelings
            - anxious: worried, nervous, stressed feelings
            
            Journal entry: "{content}"
            
            Respond with only the mood category (e.g., "happy", "sad", "neutral"). Be concise and accurate.
            """
            
            # Call OpenAI API
            openai.api_key = api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an emotion analysis expert. Respond with only the mood category."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.3
            )
            
            # Extract the mood from the response
            mood = response.choices[0].message.content.strip().lower()
            
            # Validate the mood is one of our expected values
            valid_moods = ['happy', 'excited', 'calm', 'neutral', 'sad', 'angry', 'anxious']
            if mood not in valid_moods:
                mood = 'neutral'  # Default to neutral if AI response is unexpected
            
            return make_response({"mood": mood}, 200)
            
        except Exception as e:
            print(f"Error in mood analysis: {str(e)}")
            import traceback
            traceback.print_exc()
            return make_response({"error": f"Failed to analyze mood: {str(e)}", "mood": "neutral"}, 500)

api.add_resource(AnalyzeMood, '/analyze-mood')

if __name__ == '__main__':
    app.run(debug=True, port=5555)