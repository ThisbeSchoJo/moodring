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
    user1 = User(username="alice")
    user1.set_password("password123")
    
    user2 = User(username="bob") 
    user2.set_password("password123")
    
    user3 = User(username="charlie")
    user3.set_password("password123")
    
    user4 = User(username="demo")
    user4.set_password("demo123")
    
    db.session.add_all([user1, user2, user3, user4])
    db.session.commit()
    
    # Create test entries with diverse moods and content
    entries = [
        Entry(
            title="My First Journal Entry",
            content="Today I'm feeling grateful for the beautiful weather and the opportunity to reflect on my day. The sun was shining, and I had a wonderful conversation with an old friend. Sometimes it's the simple moments that bring the most joy. We sat in the park for hours, talking about everything and nothing. She told me about her new job and how she's finally feeling fulfilled in her career. It reminded me that change is possible and that sometimes the best things happen when you least expect them. We laughed about old memories and made plans for the future. It's amazing how a single conversation can shift your entire perspective on life. I realized that I've been so focused on what I don't have that I've forgotten to appreciate what I do have. My friend reminded me that happiness isn't about having everything perfect, but about finding joy in the imperfect moments. As we watched the sunset together, I felt this overwhelming sense of gratitude for the people in my life who make it better just by being in it.",
            mood="grateful,happy",
            user_id=user1.id
        ),
        Entry(
            title="A Peaceful Moment",
            content="Spent some time in nature today. The sound of birds and rustling leaves was so calming. Found a quiet spot by the lake and just sat there for an hour, watching the water ripple and feeling completely at peace.",
            mood="calm,neutral",
            user_id=user1.id
        ),
        Entry(
            title="New Beginnings",
            content="Starting this journal journey to track my emotional well-being and personal growth. I'm excited about this new chapter and hopeful about what lies ahead. Time to be more mindful about my feelings.",
            mood="excited,hopeful",
            user_id=user2.id
        ),
        Entry(
            title="Frustrating Day at Work",
            content="Today was incredibly frustrating. My computer crashed three times, I missed an important deadline, and my boss was not understanding at all. I feel so angry and stressed about everything that went wrong.",
            mood="angry,anxious",
            user_id=user1.id
        ),
        Entry(
            title="Missing Someone",
            content="I've been thinking about my grandmother a lot lately. She passed away last year, and I miss her so much. Her wisdom, her laugh, the way she always knew exactly what to say. I'm feeling really sad today.",
            mood="sad",
            user_id=user2.id
        ),
        Entry(
            title="Confused About Life Direction",
            content="I'm not sure what I want to do with my life anymore. Everyone seems to have it figured out except me. Should I change careers? Move to a new city? I feel so lost and confused about my next steps. I've been working in the same job for five years now, and while it pays the bills, it doesn't fulfill me anymore. I see my friends posting about their exciting new opportunities, their promotions, their travels, and I can't help but feel like I'm falling behind. But then I think about starting over, and the thought terrifies me. What if I make the wrong choice? What if I end up even more miserable? I've been reading self-help books, talking to career counselors, even taking personality tests to figure out what I'm supposed to do. But the more I research, the more confused I become. There are so many options, so many paths I could take. How do I know which one is right for me? I'm afraid of making a mistake, of wasting more time on something that won't make me happy. But I'm also afraid of staying stuck in this rut forever. Maybe the problem isn't that I don't know what I want, but that I'm too afraid to go after it. I need to find the courage to take a risk, to trust that I'll figure it out as I go along.",
            mood="confused,anxious",
            user_id=user3.id
        ),
        Entry(
            title="Amazing Concert Experience",
            content="Went to see my favorite band tonight and it was absolutely incredible! The energy in the crowd was electric, the music was perfect, and I felt so alive and connected to everyone around me. Best night ever! I've been waiting for this concert for months, and it exceeded all my expectations. The venue was packed with thousands of people, all singing along to every song. When the band came on stage, the entire crowd erupted in cheers and applause. The lead singer's voice was even more powerful live than on the recordings, and the guitar solos were absolutely mind-blowing. I found myself dancing and singing along with complete strangers, feeling this incredible sense of unity and joy. During the encore, they played my favorite song, and I was moved to tears. It was one of those moments where you feel completely present, completely alive, and completely grateful to be experiencing something so beautiful. The band seemed to feed off the crowd's energy, and the crowd fed off theirs. It was this perfect symbiotic relationship that created something magical. I made friends with the people standing next to me, and we exchanged contact information, promising to meet up at future concerts. The whole experience reminded me of the power of music to bring people together, to create moments of pure joy and connection. I'm still buzzing with excitement hours later, and I know this memory will stay with me for a long time.",
            mood="excited,happy",
            user_id=user2.id
        ),
        Entry(
            title="Meditation Breakthrough",
            content="Had a really deep meditation session today. For the first time in weeks, I felt truly calm and centered. My mind was quiet, and I could feel this sense of inner peace that I've been searching for.",
            mood="calm",
            user_id=user3.id
        ),
        Entry(
            title="Anxiety About Tomorrow",
            content="I have a big presentation tomorrow and I'm feeling really anxious about it. What if I mess up? What if people think I'm not qualified? I can't stop worrying about all the things that could go wrong.",
            mood="anxious",
            user_id=user1.id
        ),
        Entry(
            title="Grateful for My Friends",
            content="Had dinner with my closest friends tonight and I'm feeling so grateful for them. They've been there for me through everything - the good times and the bad. I don't know what I'd do without their support and love. We've been friends for over a decade now, and they've seen me at my best and my worst. They were there when I got my first job, when I went through my first heartbreak, when I lost my father, when I finally found love again. They've celebrated my victories and comforted me in my defeats. Tonight, as we sat around the table sharing stories and laughing until our sides hurt, I realized how lucky I am to have these people in my life. They know me better than anyone else, and they love me anyway. They accept my flaws, encourage my dreams, and push me to be the best version of myself. When I'm feeling down, they know exactly what to say to lift my spirits. When I'm being too hard on myself, they remind me to be kinder. They've taught me what true friendship means - it's not about being perfect or always agreeing, but about showing up, being honest, and loving each other through the messiness of life. I'm grateful for their wisdom, their humor, their patience, and their unwavering support. They've made my life richer and more meaningful than I could have ever imagined.",
            mood="grateful,happy",
            user_id=user2.id
        ),
        Entry(
            title="Feeling Overwhelmed",
            content="There's just so much to do and I don't know where to start. Work is piling up, I have bills to pay, appointments to schedule, and I feel like I'm drowning in responsibilities. I need to take a step back and breathe.",
            mood="anxious,confused",
            user_id=user3.id
        ),
        Entry(
            title="Beautiful Sunset",
            content="Watched the most incredible sunset tonight. The sky was painted in shades of pink, orange, and purple. It reminded me that even on difficult days, there's still beauty in the world. Sometimes you just need to look up.",
            mood="calm,happy",
            user_id=user1.id
        ),
        Entry(
            title="Angry About Injustice",
            content="I'm so angry about the unfair treatment I witnessed today. Someone was being discriminated against and it made me furious. Why do people have to be so cruel to each other? I want to do something to make things better.",
            mood="angry",
            user_id=user2.id
        ),
        Entry(
            title="Feeling Lost",
            content="I don't know who I am anymore. Everything I thought I wanted doesn't seem right anymore. I feel like I'm just going through the motions without any real purpose or direction. I need to figure out what truly matters to me. I used to have such clear goals and dreams, but somewhere along the way, I lost sight of them. Maybe it was the pressure to conform, to follow the path that everyone else was taking. I got a degree, found a stable job, moved into a nice apartment, and checked off all the boxes that society told me I should check. But now I'm sitting here, looking at my life, and wondering if this is really what I want. I feel like I'm living someone else's life, following someone else's script. The things that used to excite me don't excite me anymore. The people I used to admire seem to have lost their luster. I'm questioning everything - my relationships, my career, my values, my beliefs. It's like I'm having an identity crisis, but I'm too old for that, aren't I? I should have this figured out by now. But maybe that's the problem - maybe I've been so focused on what I should be that I've forgotten who I actually am. I need to take some time to rediscover myself, to figure out what brings me joy, what makes me feel alive, what gives my life meaning. I need to stop living for other people's expectations and start living for myself. It's scary to think about starting over, but it's even scarier to think about continuing down this path that doesn't feel right.",
            mood="sad,confused",
            user_id=user3.id
        ),
        Entry(
            title="Excited About New Project",
            content="Started working on a new creative project today and I'm so excited about it! I have so many ideas and I can't wait to see where this leads. It feels like the beginning of something really special.",
            mood="excited,hopeful",
            user_id=user1.id
        ),
        Entry(
            title="Neutral Day",
            content="Today was just... fine. Nothing particularly good or bad happened. I went to work, came home, watched some TV, and now I'm here. Sometimes it's okay to have days that are just neutral.",
            mood="neutral",
            user_id=user2.id
        ),
        Entry(
            title="Hopeful About the Future",
            content="Despite all the challenges, I'm feeling really hopeful about the future. I believe that good things are coming and that I have the strength to handle whatever comes my way. The best is yet to come.",
            mood="hopeful",
            user_id=user3.id
        ),
        Entry(
            title="Mixed Emotions",
            content="Today has been a rollercoaster of emotions. I'm happy about some things, sad about others, and confused about everything in between. Sometimes it's hard to make sense of all these feelings.",
            mood="happy,sad,confused",
            user_id=user1.id
        ),
        Entry(
            title="Feeling Accomplished",
            content="Finally finished that project I've been working on for months! It turned out even better than I expected, and I'm so proud of myself. Hard work really does pay off.",
            mood="excited,happy",
            user_id=user2.id
        ),
        Entry(
            title="Missing Home",
            content="I've been away from home for a while now, and I'm really starting to miss it. The familiar sights, sounds, and people. Sometimes I wonder if I made the right choice by leaving.",
            mood="sad",
            user_id=user3.id
        ),
        Entry(
            title="Feeling Inspired",
            content="Read an amazing book today that completely changed my perspective on life. I feel so inspired and motivated to make positive changes. Sometimes all you need is the right words at the right time.",
            mood="excited,hopeful",
            user_id=user1.id
        ),
        Entry(
            title="Stressed About Money",
            content="Money is really tight right now and I'm feeling so stressed about it. Bills are piling up, and I don't know how I'm going to make ends meet. I need to figure out a better financial plan.",
            mood="anxious",
            user_id=user2.id
        ),
        Entry(
            title="Grateful for Simple Pleasures",
            content="Today I'm grateful for the simple things - a hot cup of coffee in the morning, the sound of rain on the window, and the comfort of my favorite blanket. Sometimes the smallest things bring the most joy.",
            mood="grateful,calm",
            user_id=user3.id
        )
    ]
    
    db.session.add_all(entries)
    db.session.commit()
    
    print("✅ Database seeded successfully!")
    print(f"Created {User.query.count()} users and {Entry.query.count()} entries")
    print("\n🧪 Test Users:")
    print("Username: alice, Password: password123")
    print("Username: bob, Password: password123")
    print("Username: charlie, Password: password123")
    print("Username: demo, Password: demo123")

if __name__ == "__main__":
    with app.app_context():
        seed_database()