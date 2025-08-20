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

# Basic route for testing API connectivity
@app.route('/')
def home():
    """Health check endpoint to verify API is running and OpenAI key is configured"""
    api_key = os.getenv('OPENAI_API_KEY')
    return jsonify({
        "message": "MoodRing API is running!",
        "openai_key_configured": bool(api_key and api_key != 'your_openai_api_key_here')
    })

class AllUsers(Resource):
    """Resource for handling all user operations (GET all users, POST new user)"""
    
    def get(self):
        """Retrieve all users from the database"""
        users = User.query.all()
        response_body = [user.to_dict() for user in users]
        return make_response(response_body, 200)
    
    def post(self):
        """Create a new user with username and password"""
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
    """Resource for handling individual user operations (GET, PATCH, DELETE by ID)"""
    
    def get(self, id):
        """Retrieve a specific user by ID"""
        user = db.session.get(User, id)
        if user:
            return make_response(user.to_dict(), 200)
        else:
            return make_response({"error": "User not found"}, 404)
    
    def patch(self, id):
        """Update a specific user's information"""
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
        """Delete a specific user by ID"""
        user = db.session.get(User, id)
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response({}, 204)
        else:
            return make_response({"error": "User not found"}, 404)

api.add_resource(UserById, '/users/<int:id>')

class Login(Resource):
    """Resource for user authentication"""
    
    def post(self):
        """Authenticate user with username and password"""
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
    """Resource for handling all journal entry operations"""
    
    def get(self):
        """Retrieve all entries for a specific user"""
        # For now, we'll get user_id from query params
        # In a real app, this would come from JWT token
        user_id = request.args.get('user_id', 1)  # Default to user 1 for now
        entries = Entry.query.filter_by(user_id=user_id).all()
        response_body = [entry.to_dict() for entry in entries]
        return make_response(response_body, 200)
    
    def post(self):
        """Create a new journal entry"""
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
    """Resource for handling individual journal entry operations"""
    
    def get(self, id):
        """Retrieve a specific journal entry by ID"""
        entry = db.session.get(Entry, id)
        if entry:
            return make_response(entry.to_dict(), 200)
        else:
            return make_response({"error": "Entry not found"}, 404)
    
    def patch(self, id):
        """Update a specific journal entry"""
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
        """Delete a specific journal entry"""
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
    """Resource for AI-powered mood analysis of journal entries"""
    
    def post(self):
        """Analyze the emotional tone of journal content using OpenAI GPT-3.5-turbo"""
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
            Analyze the emotional tone of this journal entry and identify ALL the emotions present. 
            Choose from these categories:
            - happy: positive, joyful, content feelings
            - excited: enthusiastic, energetic, thrilled feelings  
            - calm: peaceful, relaxed, serene feelings
            - neutral: balanced, neither positive nor negative
            - sad: unhappy, down, disappointed feelings
            - angry: frustrated, irritated, mad feelings
            - anxious: worried, nervous, stressed feelings
            - grateful: thankful, appreciative feelings
            - hopeful: optimistic, looking forward feelings
            - confused: uncertain, unclear feelings
            
            Journal entry: "{content}"
            
            Respond with ONLY the mood categories separated by commas (e.g., "happy,excited" or "sad,anxious" or "neutral"). 
            If multiple emotions are present, include all of them. Be accurate and comprehensive.
            """
            
            # Call OpenAI API
            openai.api_key = api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an emotion analysis expert. Respond with only the mood categories separated by commas."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=50,
                temperature=0.3
            )
            
            # Extract the moods from the response
            mood_response = response.choices[0].message.content.strip().lower()
            
            # Parse and validate the moods
            valid_moods = ['happy', 'excited', 'calm', 'neutral', 'sad', 'angry', 'anxious', 'grateful', 'hopeful', 'confused']
            
            # Split by comma and clean up each mood
            detected_moods = [mood.strip() for mood in mood_response.split(',')]
            
            # Filter to only include valid moods
            validated_moods = [mood for mood in detected_moods if mood in valid_moods]
            
            # If no valid moods found, default to neutral
            if not validated_moods:
                validated_moods = ['neutral']
            
            # Join back into comma-separated string
            mood = ','.join(validated_moods)
            
            return make_response({"mood": mood}, 200)
            
        except Exception as e:
            print(f"Error in mood analysis: {str(e)}")
            import traceback
            traceback.print_exc()
            return make_response({"error": f"Failed to analyze mood: {str(e)}", "mood": "neutral"}, 500)

api.add_resource(AnalyzeMood, '/analyze-mood')

class UserProfile(Resource):
    """Resource for AI-generated personality profiles based on journal entries"""
    
    def get(self, user_id):
        """Generate a comprehensive personality profile by analyzing all user's journal entries"""
        try:
            # Get all entries for the user
            entries = Entry.query.filter_by(user_id=user_id).all()
            
            if not entries:
                return make_response({"error": "No entries found for this user"}, 404)
            
            # Combine all entry content for analysis
            all_content = " ".join([entry.content for entry in entries])
            all_titles = " ".join([entry.title for entry in entries])
            
            # Set up OpenAI client
            api_key = os.getenv('OPENAI_API_KEY')
            
            if not api_key or api_key == 'your_openai_api_key_here':
                return make_response({"error": "OpenAI API key not configured. Please set OPENAI_API_KEY in your .env file."}, 500)
            
            # Create the prompt for personality/mood profile analysis
            prompt = f"""
            Analyze this person's journal entries to understand their overall emotional personality and mood patterns.
            
            Journal titles: {all_titles}
            Journal content: {all_content}
            
            Based on these entries, provide:
            1. A dominant overall mood/personality trait (choose from: happy, excited, calm, neutral, sad, angry, anxious, grateful, hopeful, confused)
            2. A secondary mood trait that also appears frequently
            3. A brief personality description (2-3 sentences)
            
            Respond in this exact format:
            DOMINANT_MOOD: [mood]
            SECONDARY_MOOD: [mood]
            DESCRIPTION: [description]
            """
            
            # Call OpenAI API
            openai.api_key = api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a personality and mood analysis expert. Analyze journal entries to understand emotional patterns."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.3
            )
            
            # Parse the response
            analysis_response = response.choices[0].message.content.strip()
            
            # Extract the components
            lines = analysis_response.split('\n')
            dominant_mood = "neutral"
            secondary_mood = "neutral"
            description = "A thoughtful journal keeper."
            
            for line in lines:
                if line.startswith('DOMINANT_MOOD:'):
                    dominant_mood = line.replace('DOMINANT_MOOD:', '').strip().lower()
                elif line.startswith('SECONDARY_MOOD:'):
                    secondary_mood = line.replace('SECONDARY_MOOD:', '').strip().lower()
                elif line.startswith('DESCRIPTION:'):
                    description = line.replace('DESCRIPTION:', '').strip()
            
            # Validate moods
            valid_moods = ['happy', 'excited', 'calm', 'neutral', 'sad', 'angry', 'anxious', 'grateful', 'hopeful', 'confused']
            if dominant_mood not in valid_moods:
                dominant_mood = "neutral"
            if secondary_mood not in valid_moods:
                secondary_mood = "neutral"
            
            # Create combined mood for gradient
            combined_mood = f"{dominant_mood},{secondary_mood}"
            
            return make_response({
                "dominant_mood": dominant_mood,
                "secondary_mood": secondary_mood,
                "combined_mood": combined_mood,
                "description": description,
                "entry_count": len(entries)
            }, 200)
            
        except Exception as e:
            print(f"Error in profile analysis: {str(e)}")
            import traceback
            traceback.print_exc()
            return make_response({"error": f"Failed to analyze profile: {str(e)}"}, 500)

api.add_resource(UserProfile, '/user-profile/<int:user_id>')

# Run the Flask application
if __name__ == '__main__':
    app.run(debug=True, port=5555)