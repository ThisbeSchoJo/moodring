from app import app
from models import db, User, Entry
from datetime import datetime
import random

def seed_database():
    print("🗑️ Deleting existing data...")
    Entry.query.delete()
    User.query.delete()
    
    print("🌱 Seeding database...")
    
    # Create test users
    user1 = User(username="testuser1")
    user1.set_password("password123")
    
    user2 = User(username="testuser2") 
    user2.set_password("password123")
    
    db.session.add_all([user1, user2])
    db.session.commit()
    
    # Create test entries
    entry1 = Entry(
        title="My First Journal Entry",
        content="Today I'm feeling grateful for the beautiful weather and the opportunity to reflect on my day.",
        user_id=user1.id
    )
    
    entry2 = Entry(
        title="A Peaceful Moment",
        content="Spent some time in nature today. The sound of birds and rustling leaves was so calming.",
        user_id=user1.id
    )
    
    entry3 = Entry(
        title="New Beginnings",
        content="Starting this journal journey to track my emotional well-being and personal growth.",
        user_id=user2.id
    )
    
    db.session.add_all([entry1, entry2, entry3])
    db.session.commit()
    
    print("✅ Database seeded successfully!")
    print(f"Created {User.query.count()} users and {Entry.query.count()} entries")

if __name__ == "__main__":
    with app.app_context():
        seed_database()