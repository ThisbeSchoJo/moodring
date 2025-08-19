from app import app
from models import db, User, Entry
from datetime import datetime
import random

def seed_database():
    print("🗑️ Deleting existing data...")
    Entry.query.delete()
    User.query.delete()
    
    print("🌱 Seeding database...")
    
    # Create test users - famous diarists and writers
    user1 = User(username="Franz Kafka")
    user1.set_password("password123")
    
    user2 = User(username="Virginia Woolf")
    user2.set_password("password123")
    
    user3 = User(username="Anne Frank")
    user3.set_password("password123")
    
    user4 = User(username="Sylvia Plath")
    user4.set_password("password123")

    user5 = User(username="Frida Kahlo")
    user5.set_password("password123")

    user6 = User(username="Marcus Aurelius")
    user6.set_password("password123")

    user7 = User(username="Anaïs Nin")
    user7.set_password("password123")

    user8 = User(username="John Cheever")
    user8.set_password("password123")
    
    
    db.session.add_all([user1, user2, user3, user4, user5, user6, user7, user8])
    db.session.commit()
    
    # Create test entries inspired by famous diarists
    entries = [
        # Kafka-inspired entries (introspective, anxious, existential)
        Entry(
            title="The Weight of Existence",
            content="Another night of sleeplessness. The walls of my room seem to press closer with each passing hour. I write these words not because I believe anyone will read them, but because the act of writing itself is the only thing that keeps me from disappearing entirely. The world outside my window continues its indifferent rotation, while I remain trapped in this endless cycle of thought and doubt. What is the purpose of all this? Why do I continue to exist when my existence brings nothing but confusion and pain? The words I write tonight will be forgotten tomorrow, just as I will be forgotten when I am gone. And yet, I continue to write.",
            mood="anxious,confused",
            user_id=user1.id
        ),
        Entry(
            title="The Office as Prison",
            content="Today at work, I felt like a character in one of my own stories. The fluorescent lights hummed their mechanical song, and my colleagues moved about like automatons, performing their assigned tasks with practiced efficiency. I sat at my desk, staring at the papers before me, and realized that I have become exactly what I feared most: a cog in a machine that cares nothing for my thoughts or dreams. The clock on the wall ticked away the hours of my life, and I could do nothing but watch as another day slipped through my fingers like sand. I am not living; I am merely existing, waiting for something that may never come.",
            mood="sad,confused",
            user_id=user1.id
        ),
        
        # Virginia Woolf-inspired entries (stream of consciousness, emotional depth)
        Entry(
            title="The Waves of Memory",
            content="The afternoon light falls through the window in golden shafts, and I find myself thinking of childhood summers by the sea. The way the waves would crash against the shore, each one different from the last, yet somehow the same. My thoughts flow like those waves now, rising and falling, carrying me to places I had forgotten existed. I remember the feel of sand between my toes, the taste of salt on my lips, the sound of seagulls crying overhead. These memories are more real to me than the room I sit in now. They are the threads that connect me to who I was, who I am, and who I might yet become. The past is not dead; it lives within us, shaping every moment of our present.",
            mood="calm,hopeful",
            user_id=user2.id
        ),
        Entry(
            title="A Room of One's Own",
            content="I have finally found it—a space that is entirely my own. Not just a physical room, though that too, but a mental space where my thoughts can roam freely without fear of interruption or judgment. Here, in this quiet corner of the world, I can be whoever I choose to be. I can write without worrying about what others will think, dream without fearing that my dreams are too small or too large. This room is my sanctuary, my refuge from the chaos of the outside world. Within these walls, I am free to explore the depths of my own mind, to discover truths that have been hidden from me until now. This is where I will find my voice, my purpose, my self.",
            mood="hopeful,calm",
            user_id=user2.id
        ),
        
        # Anne Frank-inspired entries (hopeful yet realistic, coming-of-age)
        Entry(
            title="The Light Through the Curtain",
            content="Even in the darkest moments, I can see a sliver of light through the curtain. It reminds me that the world is still out there, waiting for me to return to it. I know that things are difficult now, that the future is uncertain, but I refuse to give up hope. I believe that people are truly good at heart, that love will triumph over hatred, that this darkness will not last forever. I write these words as a promise to myself: I will survive this, and I will emerge stronger than before. The world may be cruel, but it is also beautiful, and I will not let the cruelty blind me to the beauty. I will hold onto hope with both hands, because hope is the only thing stronger than fear.",
            mood="hopeful,calm",
            user_id=user3.id
        ),
        Entry(
            title="Growing Up in Strange Times",
            content="Sometimes I feel like I'm growing up too fast, forced to understand things that no child should have to understand. But other times, I feel like I'm not growing up fast enough, that the world is changing around me while I remain the same. I want to be brave and strong, but I also want to be allowed to be young and carefree. I want to believe in the goodness of people, but I also want to be realistic about the world we live in. I am caught between childhood and adulthood, between innocence and experience, between hope and despair. But maybe that's what growing up means—learning to hold these contradictions within yourself without being torn apart by them.",
            mood="confused,hopeful",
            user_id=user3.id
        ),
        
        # Sylvia Plath-inspired entries (intense, emotional, often dark)
        Entry(
            title="The Bell Jar",
            content="I feel like I'm living under a bell jar, watching the world through glass that distorts everything I see. The people around me move in slow motion, their voices reaching me as if through water. I want to break free, to feel the air on my skin, to connect with the world around me, but the glass is too thick, too strong. I am trapped in my own mind, a prisoner of my own thoughts. The world outside is beautiful and terrible, and I want to experience it fully, but I can't seem to break through this barrier that separates me from everything else. I am alone, even when I'm surrounded by people who love me.",
            mood="sad,confused",
            user_id=user4.id
        ),
        Entry(
            title="The Fig Tree",
            content="I see my life as a fig tree, with branches reaching in every direction, each fig representing a different possibility, a different future. I want to choose one, to pluck it and make it mine, but I'm paralyzed by the fear of making the wrong choice. What if I choose the wrong fig? What if I spend my life wondering about the ones I didn't choose? I want to be a writer, a mother, a traveler, a lover, a friend, a daughter, a sister—I want to be everything, but I can only be one thing at a time. The figs are ripening, and soon they will fall to the ground, wasted. I must choose, but how?",
            mood="anxious,confused",
            user_id=user4.id
        ),
        
        # Frida Kahlo-inspired entries (passionate, artistic, dealing with pain and love)
        Entry(
            title="The Pain and the Passion",
            content="My body is a battlefield, scarred and broken, but my soul is a garden, wild and beautiful. The pain is always there, a constant companion, but so is the passion—for life, for art, for love. I paint my pain onto canvas, transforming suffering into something beautiful, something that speaks to others who are also hurting. My body may be broken, but my spirit is unbreakable. I will not let pain define me, limit me, or destroy me. Instead, I will use it as fuel for my art, my love, my life. I am not a victim; I am a warrior, fighting for beauty in a world that often seems ugly and cruel.",
            mood="hopeful,excited",
            user_id=user5.id
        ),
        Entry(
            title="Love Like a Hurricane",
            content="When I love, I love with the intensity of a hurricane, with the power to destroy and create in equal measure. My heart is not a gentle thing—it is wild and untamed, capable of both great joy and great sorrow. I have loved and been loved, hurt and been hurt, and I would not change any of it. Love is not safe, not gentle, not predictable. It is dangerous and beautiful, like a storm that clears the air and leaves everything fresh and new. I am not afraid of love, even though it has broken me and rebuilt me more times than I can count. I will love again, fiercely and completely, because that is who I am.",
            mood="in love,excited",
            user_id=user5.id
        ),
        
        # Marcus Aurelius-inspired entries (stoic, philosophical, reflective)
        Entry(
            title="The Discipline of the Mind",
            content="Today I remind myself that I am not my thoughts, not my emotions, not my circumstances. I am the observer of these things, the one who chooses how to respond to them. When I feel anger rising within me, I can choose to let it pass like a cloud across the sky. When I feel fear gripping my heart, I can choose to face it with courage. When I feel joy bubbling up, I can choose to savor it without clinging to it. I am not a slave to my emotions; I am their master. This is the discipline of the mind, the practice of choosing my responses rather than being controlled by my reactions. It is not easy, but it is necessary.",
            mood="calm,hopeful",
            user_id=user6.id
        ),
        Entry(
            title="The Art of Living",
            content="I am learning that life is not about avoiding pain or seeking pleasure, but about living with wisdom and virtue. The challenges I face are not obstacles to my happiness, but opportunities to practice patience, courage, and compassion. The people who frustrate me are not enemies, but teachers showing me where I need to grow. The losses I experience are not punishments, but reminders of what truly matters. I am not perfect, and I do not expect to be. I am simply trying to live each day with intention, with awareness, with love. This is the art of living, and I am still learning.",
            mood="hopeful,calm",
            user_id=user6.id
        ),
        
        # Anaïs Nin-inspired entries (sensual, artistic, deeply personal)
        Entry(
            title="The Garden of Sensuality",
            content="I am discovering that my body is not just a vessel for my mind, but a source of wisdom and pleasure in its own right. The way the sun feels on my skin, the taste of ripe fruit, the sound of music that makes me want to move—these are not distractions from spiritual growth, but pathways to it. I am learning to trust my senses, to honor my desires, to celebrate the physical world without shame or guilt. My body is a garden, and I am learning to tend it with love and care. I am not afraid of my own sensuality anymore; I am embracing it as part of who I am.",
            mood="excited,hopeful",
            user_id=user7.id
        ),
        Entry(
            title="The Labyrinth of the Heart",
            content="My heart is a labyrinth, with winding paths that lead to hidden chambers of memory and desire. I am exploring these depths, not to escape from the world, but to understand myself better so I can love the world more fully. Each turn reveals something new about who I am, what I want, what I fear, what I love. I am not afraid of getting lost in this labyrinth, because I know that every path leads somewhere, and every discovery brings me closer to the center of my own being. I am learning to trust the journey, to embrace the uncertainty, to find beauty in the darkness.",
            mood="hopeful,calm",
            user_id=user7.id
        ),
        
        # John Cheever-inspired entries (American suburban life, often conflicted)
        Entry(
            title="The Perfect Lawn",
            content="I spent the morning mowing the lawn, trying to make it as perfect as the ones on either side of mine. The neighbors wave as they drive by, and I wave back, but I wonder if they can see the emptiness behind my smile. My house looks perfect from the outside—clean, well-maintained, respectable. But inside, I feel like I'm suffocating. I have everything I'm supposed to want: a good job, a nice house, a loving family. So why do I feel so restless, so unsatisfied? Maybe the problem isn't with my life, but with the expectations I've placed on it. Maybe perfection is the enemy of happiness.",
            mood="confused,anxious",
            user_id=user8.id
        ),
        Entry(
            title="The Commute",
            content="Every morning, I join the river of cars flowing toward the city, each of us in our own little metal boxes, pretending we're not all going to the same place to do the same things. We stop at the same red lights, merge into the same lanes, park in the same garages. We are a community of strangers, united by our shared routine and our shared silence. I wonder what the others are thinking about as they drive. Are they happy? Are they worried? Are they, like me, wondering if this is all there is? The commute is a metaphor for life itself—we're all going somewhere, but most of us aren't sure where, or why.",
            mood="neutral,confused",
            user_id=user8.id
        )
    ]
    
    db.session.add_all(entries)
    db.session.commit()
    
    print("✅ Database seeded successfully!")
    print(f"Created {User.query.count()} users and {Entry.query.count()} entries")
    print("\n🧪 Test Users (Famous Diarists):")
    print("Username: Franz Kafka, Password: password123")
    print("Username: Virginia Woolf, Password: password123")
    print("Username: Anne Frank, Password: password123")
    print("Username: Sylvia Plath, Password: password123")
    print("Username: Frida Kahlo, Password: password123")
    print("Username: Marcus Aurelius, Password: password123")
    print("Username: Anaïs Nin, Password: password123")
    print("Username: John Cheever, Password: password123")

if __name__ == "__main__":
    with app.app_context():
        seed_database()