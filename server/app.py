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
from models import Entry, User

# Basic route for testing
@app.route('/')
def home():
    return jsonify({"message": "MoodRing API is running!"})

class AllUsers(Resource):
    def get(self):
        users = User.query.all()
        response_body = [user.to_dict() for user in users]
        return make_response(response_body, 200)
    
    def post(self):
        data = request.get_json()
        new_user = User(
            username = data['username'],
            email = data['email'],
            password = data['password']
        )
        db.session.add(new_user)
        db.session.commit()
        return make_response(new_user.to_dict(), 201)

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



class AllEntries(Resource):
    def get(self):
        entries = Entry.query.all()
        response_body = [entry.to_dict() for entry in entries]
        return make_response(response_body, 200)
    
    def post(self):
        data = request.get_json()
        new_entry = Entry(
            title = data['title'],
            content = data['content']
        )
        db.session.add(new_entry)
        db.session.commit()
        return make_response(new_entry.to_dict(), 201)

api.add_resource(AllEntries, '/entries')

class EntryById(Resource):
    def get(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            response_body = entry.to_dict()
            return make_response(response_body, 200)
        else:
            response_body = {"error": "Entry not found"}
            return make_response(response_body, 404)
    def patch(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            data = request.get_json()
            for key, value in data.items():
                setattr(entry, key, value)
            db.session.commit()
            return make_response(entry.to_dict(), 200)
        else:
            response_body = {"error": "Entry not found"}
            return make_response(response_body, 404)
    
    def delete(self, id):
        entry = db.session.get(Entry, id)
        if entry:
            db.session.delete(entry)
            db.session.commit()
            return make_response({}, 204)
        else:
            response_body = {"error": "Entry not found"}
            return make_response(response_body, 404)

api.add_resource(EntryById, '/entries/<int:id>')


if __name__ == '__main__':
    app.run(debug=True, port=5000)