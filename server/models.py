from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db
import bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key = True)
    username = db.Column(db.String, unique = True, nullable = False)
    _password_hash = db.Column(db.String)
    
    # Relationships
    entries = db.relationship('Entry', back_populates='user', cascade='all, delete-orphan')
    
    # Serialization rules to prevent circular references
    serialize_rules = ('-_password_hash', '-entries.user')
    
    # Password methods
    def set_password(self, password):
        """Hash and set the user's password"""
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        """Verify the user's password"""
        return bcrypt.checkpw(password.encode('utf-8'), self._password_hash.encode('utf-8'))

class Entry(db.Model, SerializerMixin):
    __tablename__ = 'entries'

    id = db.Column(db.Integer, primary_key = True)
    title = db.Column(db.String, nullable = False)
    content = db.Column(db.String, nullable = False)
    mood = db.Column(db.String, default = 'neutral')  # comma-separated moods: "happy,excited" or "sad,anxious"
    created_at = db.Column(db.DateTime, default = datetime.now)
    updated_at = db.Column(db.DateTime, default = datetime.now)

    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    user = db.relationship('User', back_populates = 'entries')
    
    # Serialization rules to prevent circular references
    serialize_rules = ('-user.entries',)

    def get_moods_list(self):
        """Return moods as a list"""
        return [mood.strip() for mood in self.mood.split(',') if mood.strip()]
    
    def set_moods_list(self, moods_list):
        """Set moods from a list"""
        self.mood = ','.join(moods_list)
    
    def __repr__(self):
        return f'<Entry {self.title}>'