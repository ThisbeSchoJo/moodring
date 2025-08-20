# Database models for the MoodRing application
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.orm import validates
from datetime import datetime
from config import db
import bcrypt

class User(db.Model, SerializerMixin):
    """
    User model representing application users.
    
    Attributes:
        id: Primary key for user identification
        username: Unique username for login
        _password_hash: Hashed password for security
        entries: One-to-many relationship with journal entries
    """
    __tablename__ = 'users'

    # Primary key for user identification
    id = db.Column(db.Integer, primary_key = True)
    
    # Unique username for login (required)
    username = db.Column(db.String, unique = True, nullable = False)
    
    # Hashed password for security (stored as string)
    _password_hash = db.Column(db.String)
    
    # Relationships: One user can have many journal entries
    entries = db.relationship('Entry', back_populates='user', cascade='all, delete-orphan')
    
    # Serialization rules to prevent circular references when converting to JSON
    serialize_rules = ('-_password_hash', '-entries.user')
    
    def set_password(self, password):
        """
        Hash and set the user's password using bcrypt.
        
        Args:
            password (str): Plain text password to hash
        """
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        """
        Verify the user's password against the stored hash.
        
        Args:
            password (str): Plain text password to verify
            
        Returns:
            bool: True if password matches, False otherwise
        """
        return bcrypt.checkpw(password.encode('utf-8'), self._password_hash.encode('utf-8'))

class Entry(db.Model, SerializerMixin):
    """
    Journal entry model representing individual journal entries.
    
    Attributes:
        id: Primary key for entry identification
        title: Entry title (required)
        content: Entry content/body text (required)
        mood: AI-detected emotions (comma-separated string)
        created_at: Timestamp when entry was created
        updated_at: Timestamp when entry was last updated
        user_id: Foreign key linking to user
        user: Relationship to the user who created this entry
    """
    __tablename__ = 'entries'

    # Primary key for entry identification
    id = db.Column(db.Integer, primary_key = True)
    
    # Entry title (required field)
    title = db.Column(db.String, nullable = False)
    
    # Entry content/body text (required field)
    content = db.Column(db.String, nullable = False)
    
    # AI-detected emotions stored as comma-separated string
    # Examples: "happy,excited" or "sad,anxious" or "neutral"
    mood = db.Column(db.String, default = 'neutral')
    
    # Timestamps for tracking creation and updates
    created_at = db.Column(db.DateTime, default = datetime.now)
    updated_at = db.Column(db.DateTime, default = datetime.now)

    # Foreign key relationship to user
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationship: Many entries belong to one user
    user = db.relationship('User', back_populates = 'entries')
    
    # Serialization rules to prevent circular references when converting to JSON
    serialize_rules = ('-user.entries',)

    def get_moods_list(self):
        """
        Convert comma-separated mood string to a list of individual moods.
        
        Returns:
            list: List of individual mood strings
        """
        return [mood.strip() for mood in self.mood.split(',') if mood.strip()]
    
    def set_moods_list(self, moods_list):
        """
        Set moods from a list, converting to comma-separated string for storage.
        
        Args:
            moods_list (list): List of mood strings to combine
        """
        self.mood = ','.join(moods_list)
    
    def __repr__(self):
        """String representation of the entry for debugging"""
        return f'<Entry {self.title}>'