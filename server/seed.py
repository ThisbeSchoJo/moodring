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

    user6 = User(username="Edgar Allan Poe")
    user6.set_password("password123")

    user7 = User(username="Rainer Maria Rilke")
    user7.set_password("password123")

    user8 = User(username="Emily Dickinson")
    user8.set_password("password123")
    
    
    db.session.add_all([user1, user2, user3, user4, user5, user6, user7, user8])
    db.session.commit()
    
    # Create test entries inspired by famous diarists
    entries = [
        # Kafka-inspired entries (introspective, anxious, existential)
        Entry(
            title="The Weight of Existence",
            content="Another night of sleeplessness. The walls of my room seem to press closer with each passing hour. I write these words not because I believe anyone will read them, but because the act of writing itself is the only thing that keeps me from disappearing entirely. The world outside my window continues its indifferent rotation, while I remain trapped in this endless cycle of thought and doubt. What is the purpose of all this? Why do I continue to exist when my existence brings nothing but confusion and pain? The words I write tonight will be forgotten tomorrow, just as I will be forgotten when I am gone. And yet, I continue to write.",
            mood="sad,anxious",
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
            mood="grateful,calm",
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
            mood="hopeful,excited",
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
            mood="sad,anxious",
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
            mood="hopeful,grateful",
            user_id=user5.id
        ),
        Entry(
            title="Love Like a Hurricane",
            content="When I love, I love with the intensity of a hurricane, with the power to destroy and create in equal measure. My heart is not a gentle thing—it is wild and untamed, capable of both great joy and great sorrow. I have loved and been loved, hurt and been hurt, and I would not change any of it. Love is not safe, not gentle, not predictable. It is dangerous and beautiful, like a storm that clears the air and leaves everything fresh and new. I am not afraid of love, even though it has broken me and rebuilt me more times than I can count. I will love again, fiercely and completely, because that is who I am.",
            mood="in love,excited",
            user_id=user5.id
        ),
        
        # Edgar Allan Poe-inspired entries (dark, gothic, mysterious)
        Entry(
            title="The Raven",
            content="Once upon a midnight dreary, while I pondered, weak and weary, over many a quaint and curious volume of forgotten lore. The darkness presses in around me like a shroud, and I am alone with my thoughts, my memories, my regrets. I hear a tapping, a gentle rapping at my chamber door, and I wonder if it is a visitor or merely the wind, or perhaps something more sinister. The night is full of shadows and secrets, and I am drawn to them like a moth to flame. There is beauty in the darkness, poetry in the macabre, truth in the terrifying. I am not afraid of the night; I am its child.",
            mood="sad,anxious",
            user_id=user6.id
        ),
        Entry(
            title="The Tell-Tale Heart",
            content="I hear it still, that terrible beating, that infernal rhythm that drives me to madness. It is the sound of my own guilt, my own conscience, my own dark deeds coming back to haunt me. I thought I could hide from it, bury it deep within the walls of my mind, but it will not be silenced. It grows louder with each passing moment, until it fills my entire being with its terrible music. I am not a monster, I tell myself, but perhaps I am. Perhaps we are all monsters, capable of terrible things when pushed to our limits. The heart knows what the mind tries to forget.",
            mood="anxious,confused",
            user_id=user6.id
        ),
        
        # Rainer Maria Rilke-inspired entries (poetic, introspective, philosophical)
        Entry(
            title="Letters to a Young Poet",
            content="I am learning to be patient with myself, to allow the questions to live within me without demanding immediate answers. The answers will come when I am ready to receive them, not when I force them into existence. I am learning to trust the process of becoming, to understand that growth happens in its own time, in its own way. The seeds I plant today may not bloom tomorrow, but they are growing nonetheless. I am learning to be gentle with my own unfolding, to honor the mystery of my own becoming. This is the work of a lifetime, and I am only just beginning.",
            mood="calm,grateful",
            user_id=user7.id
        ),
        Entry(
            title="The Duino Elegies",
            content="There are moments when I feel the weight of existence pressing down on me, when the questions of life and death and meaning become almost unbearable. But in these moments, I also feel most alive, most connected to the great mystery of being. The darkness is not something to fear, but something to embrace, for it is in the darkness that we find our deepest truths. I am learning to dance with the questions, to let them lead me deeper into the mystery of my own soul. The answers are not the point; the asking is everything.",
            mood="confused,hopeful",
            user_id=user7.id
        ),
        
        # Emily Dickinson-inspired entries (introspective, nature, mortality)
        Entry(
            title="Because I Could Not Stop for Death",
            content="I have been thinking about death lately, not with fear, but with curiosity. Death is the great mystery, the one question that none of us can answer until we face it ourselves. But perhaps death is not the end, but a transformation, a change from one form of existence to another. The flowers die in winter, but they return in spring. The stars fade at dawn, but they shine again at night. Everything in nature teaches us about cycles, about endings that are also beginnings. I am learning to embrace the mystery, to find beauty in the unknown.",
            mood="calm,hopeful",
            user_id=user8.id
        ),
        Entry(
            title="Hope is the Thing with Feathers",
            content="Hope is a fragile thing, like a bird that perches in the soul and sings without words. It is easy to lose hope in a world that seems so full of darkness and despair. But hope is also stubborn, refusing to be silenced even in the darkest times. It sings in the face of adversity, in the midst of suffering, in the depths of despair. I am learning to listen for that song, to nurture the hope that lives within me. It may be small and quiet, but it is also persistent and strong. Hope is not the absence of fear, but the courage to keep going despite it.",
            mood="hopeful,calm",
            user_id=user8.id
        ),
        
        # Additional entries for existing authors (to reach 5+ each)
        
        # More Kafka entries (existential, bureaucratic, anxious)
        Entry(
            title="The Castle",
            content="I have been trying to reach the castle for days now, but every path I take seems to lead me further away. The officials tell me I need the proper documents, but when I ask for the documents, they tell me I need to speak to someone else. It's a maze of bureaucracy, a labyrinth of rules and regulations that make no sense. I am beginning to wonder if the castle even exists, or if it's just a mirage, a dream that keeps me moving forward even when I know I'll never arrive. But I cannot stop trying, because to stop would be to admit defeat, and I am not ready to do that yet.",
            mood="anxious,confused",
            user_id=user1.id
        ),
        Entry(
            title="The Metamorphosis",
            content="I woke up this morning and found that I had been transformed into something else entirely. I am not sure what I am now, only that I am no longer what I was. My family looks at me with fear and disgust, and I cannot blame them. I am afraid of myself, of what I have become. But perhaps this transformation is not a curse, but a blessing. Perhaps I needed to become something else to see the world as it truly is. The old me was blind to so many things, trapped in a life that was not really living. This new form, whatever it is, allows me to see clearly for the first time.",
            mood="confused,hopeful",
            user_id=user1.id
        ),
        Entry(
            title="The Trial",
            content="I have been accused of a crime, but no one will tell me what the crime is. I am being tried in a court that follows rules I do not understand, by judges who speak a language I cannot comprehend. The evidence against me is secret, the witnesses are anonymous, and my defense is irrelevant. I am guilty because I have been accused, and I will be punished because I am guilty. This is the logic of the system, and I am powerless to change it. But I refuse to accept this injustice, even if it means fighting a battle I cannot win. I will speak the truth, even if no one is listening.",
            mood="angry,confused",
        user_id=user1.id
        ),
        
        # More Virginia Woolf entries (stream of consciousness, feminist, introspective)
        Entry(
            title="To the Lighthouse",
            content="The lighthouse stands on the distant shore, a beacon of hope and guidance in the darkness. I have been trying to reach it for years, but the journey is never straightforward. There are storms that push me off course, currents that carry me in unexpected directions, and moments when I lose sight of the light entirely. But I keep moving forward, because the lighthouse represents something essential—a destination, a purpose, a meaning. Perhaps the journey itself is the point, not the arrival. Perhaps the light I seek is not at the end of the path, but in the act of seeking itself.",
            mood="hopeful,calm",
            user_id=user2.id
        ),
        Entry(
            title="Mrs. Dalloway",
            content="I am planning a party, but really I am planning my life. Every detail matters—the flowers, the food, the music, the guests. Each choice I make reveals something about who I am, what I value, how I want to be seen. I am creating a world within my home, a space where people can come together and connect, where conversations can flow and relationships can deepen. But I am also creating a mask, a performance that hides the real me. I wonder if anyone will see through the facade, if anyone will recognize the woman behind the hostess, the person behind the persona.",
            mood="confused,hopeful",
            user_id=user2.id
        ),
        Entry(
            title="Orlando",
            content="I have lived many lives, been many people, experienced the world from different perspectives. I have been a man and a woman, young and old, rich and poor. Each transformation has taught me something new about myself, about others, about the nature of identity. I am not one thing, but many things, a collection of experiences and memories that shift and change over time. I am learning to embrace this fluidity, to see it not as a weakness but as a strength. I am not defined by any single aspect of myself, but by the whole complex, contradictory, beautiful person I am becoming.",
            mood="excited,hopeful",
            user_id=user2.id
        ),
        
        # More Anne Frank entries (hopeful, coming-of-age, wartime)
        Entry(
            title="The Secret Annex",
            content="We have been hiding here for months now, living in silence and fear, but also in hope. This small space has become our world, and we have learned to find joy in the smallest things—a ray of sunlight through the window, a shared meal, a moment of laughter. We are not free, but we are alive, and that is something to be grateful for. I am learning to appreciate the simple pleasures of life, to find beauty in the midst of ugliness, to hold onto hope even when it seems foolish. This experience has taught me that the human spirit is stronger than any prison, that love can survive even in the darkest places.",
            mood="hopeful,grateful",
            user_id=user3.id
        ),
        Entry(
            title="My First Love",
            content="I think I am falling in love for the first time. It is a strange and wonderful feeling, like discovering a new color or hearing a new song. I find myself thinking about him constantly, wondering what he is doing, hoping he is thinking about me too. But love in these times is complicated—we are both hiding, both afraid, both uncertain about the future. I do not know if we will ever be able to be together openly, if we will ever be able to walk hand in hand in the sunlight. But for now, this secret love is enough. It gives me something to dream about, something to hope for, something to live for.",
            mood="in love,hopeful",
            user_id=user3.id
        ),
        Entry(
            title="The Diary of a Young Girl",
            content="I write in this diary because I need someone to talk to, someone who will listen without judgment, someone who will understand. I cannot share my deepest thoughts with anyone else—not my family, not my friends, not even the boy I think I love. But here, in these pages, I can be completely honest. I can write about my fears and my dreams, my anger and my joy, my doubts and my certainties. This diary is my confidant, my therapist, my best friend. It is the one place where I can be myself, completely and without reservation. I am grateful for this small act of rebellion, this tiny space of freedom in a world that wants to take everything from me.",
            mood="hopeful,calm",
            user_id=user3.id
        ),
        
        # More Sylvia Plath entries (intense, emotional, often dark)
        Entry(
            title="Daddy",
            content="I have been trying to write about my father for years, but the words always get stuck in my throat. He is a figure of such power and mystery in my life, both loved and feared, both present and absent. I am still trying to understand our relationship, to make sense of the complex emotions he stirs in me. Sometimes I feel like I am still a little girl, desperate for his approval, terrified of his disapproval. Other times I feel like I am fighting against him, trying to break free from his influence, to become my own person. I am learning that I can love him and be angry with him at the same time, that these feelings are not mutually exclusive.",
            mood="angry,confused",
            user_id=user4.id
        ),
        Entry(
            title="Lady Lazarus",
            content="I have died many times, and each time I have come back to life. I am like a phoenix, rising from the ashes of my own destruction. But resurrection is not always a blessing—sometimes it feels like a curse, like being forced to live when you would rather rest. I am tired of dying and being reborn, tired of the cycle of destruction and renewal. But I am also learning that there is strength in survival, that each resurrection makes me stronger, more resilient, more determined. I am not a victim of my own darkness; I am a warrior who has learned to fight it.",
            mood="sad,hopeful",
            user_id=user4.id
        ),
        Entry(
            title="Ariel",
            content="I am riding through the morning, the wind in my hair, the sun on my face, and I feel completely free. This is what it means to be alive—to move through the world with purpose and passion, to feel the power of your own body, to know that you are capable of anything. I am not afraid anymore, not of the darkness, not of the pain, not of the uncertainty. I am embracing the wildness within me, the part of myself that refuses to be tamed or controlled. I am learning to trust my own instincts, to follow my own path, to be my own master.",
            mood="excited,hopeful",
            user_id=user4.id
        ),
        
        # More Frida Kahlo entries (passionate, artistic, dealing with pain and love)
        Entry(
            title="Self-Portrait with Thorn Necklace",
            content="I paint myself as I am, with all my pain and all my beauty, with all my scars and all my strength. I do not hide the thorns around my neck, the blood on my skin, the tears in my eyes. These are part of who I am, part of my story, part of my truth. I am not ashamed of my suffering, because it has made me who I am. I am not afraid of my pain, because it has taught me to be strong. I am not hiding my wounds, because they are my medals, my badges of honor, my proof that I have survived. I am beautiful because I am real, because I am honest, because I am brave.",
            mood="hopeful,excited",
            user_id=user5.id
        ),
        Entry(
            title="The Two Fridas",
            content="I am two people, two women, two souls living in one body. There is the Frida who is strong and independent, who creates art and fights for justice, who loves fiercely and lives passionately. And there is the Frida who is vulnerable and dependent, who needs love and approval, who fears abandonment and rejection. These two Fridas are constantly at war within me, each trying to dominate the other. But I am learning to accept both parts of myself, to see them not as enemies but as complementary aspects of my being. I am whole because I contain multitudes, because I am both strong and weak, both independent and dependent, both fierce and gentle.",
            mood="confused,hopeful",
            user_id=user5.id
        ),
        Entry(
            title="Viva la Vida",
            content="Long live life! That is my motto, my battle cry, my reason for being. Despite all the pain I have endured, despite all the losses I have suffered, despite all the disappointments I have faced, I still believe in the beauty and joy of life. I still find reasons to celebrate, to dance, to laugh, to love. I still believe that every day is a gift, that every moment is precious, that every breath is a miracle. I am not naive—I know that life is hard and unfair and often cruel. But I also know that life is beautiful and surprising and full of wonder. I choose to focus on the beauty, to celebrate the wonder, to embrace the joy.",
            mood="excited,grateful",
            user_id=user5.id
        ),
        
        # More Edgar Allan Poe entries (dark, gothic, mysterious)
        Entry(
            title="The Fall of the House of Usher",
            content="I have come to this ancient house, this crumbling mansion that seems to breathe with a life of its own. The walls whisper secrets, the floors groan with the weight of memories, and the air is thick with the scent of decay and despair. I am drawn to this place like a moth to flame, fascinated by its darkness, its mystery, its beauty. There is something here that speaks to my soul, something that understands the darkness within me. I am not afraid of the shadows; I am one of them. The house and I are kindred spirits, both haunted by our own ghosts.",
            mood="sad,confused",
            user_id=user6.id
        ),
        Entry(
            title="The Masque of the Red Death",
            content="I am hosting a masquerade ball, a celebration of life in the face of death. The guests wear elaborate costumes, hiding their true selves behind masks of beauty and grace. But I know that death is among us, moving through the crowd like a shadow, touching each of us with its cold hand. We dance and laugh and pretend that we are immortal, but we are all dying, each of us in our own way. The red death is not just a disease; it is the truth that we try to ignore, the reality that we try to escape. But there is no escape, only the dance.",
            mood="sad,anxious",
            user_id=user6.id
        ),
        Entry(
            title="Annabel Lee",
            content="I loved her, and she loved me. Our love was pure and innocent, like the love of angels. But the angels in heaven were jealous of our happiness, and they sent a wind that chilled and killed my beautiful Annabel Lee. Now she lies in her sepulcher by the sea, and I lie here beside her, dreaming of the love we shared. Death cannot separate us, for our souls are bound together for eternity. I will love her forever, in this life and the next, in the light and in the darkness. She is my heart, my soul, my everything.",
            mood="sad,in love",
            user_id=user6.id
        ),
        
        # More Rainer Maria Rilke entries (poetic, introspective, philosophical)
        Entry(
            title="The Book of Hours",
            content="I am learning to pray, not in the traditional sense, but in the way that poets pray—through attention, through wonder, through gratitude. I am learning to see the divine in the ordinary, the sacred in the mundane, the holy in the everyday. The morning light through my window is a prayer, the sound of birdsong is a prayer, the taste of bread is a prayer. I am learning to live with reverence, to treat each moment as a gift, each encounter as a blessing. I am learning that prayer is not about asking for things, but about opening myself to the mystery of existence.",
            mood="grateful,calm",
            user_id=user7.id
        ),
        Entry(
            title="Sonnets to Orpheus",
            content="I am learning to sing, not with my voice, but with my soul. I am learning to make music from silence, poetry from pain, beauty from brokenness. Orpheus taught me that art is not about escaping from life, but about transforming it, about finding the song within the suffering. I am learning to trust the creative impulse, to follow the muse wherever she leads, to surrender to the flow of inspiration. I am learning that the artist's task is not to explain the world, but to celebrate it, to find the music in everything, even in the darkest moments.",
            mood="excited,hopeful",
            user_id=user7.id
        ),
        Entry(
            title="The Notebooks of Malte Laurids Brigge",
            content="I am learning to see the world with new eyes, to notice the details that others miss, to find meaning in the seemingly meaningless. Every face I see tells a story, every building holds secrets, every street leads somewhere. I am learning to be a witness, to observe without judgment, to record without commentary. I am learning that the poet's task is not to create beauty, but to reveal it, to show others what they have been too busy to see. I am learning that the world is full of poetry, if only we have the eyes to see it.",
            mood="calm,hopeful",
            user_id=user7.id
        ),
        
        # More Emily Dickinson entries (introspective, nature, mortality)
        Entry(
            title="I'm Nobody! Who are you?",
            content="I am nobody, and I am proud of it. I do not seek fame or recognition, do not crave the attention of the crowd. I am content to live in my own small world, to write my poems in secret, to find beauty in the quiet moments. The world is full of somebodies, people who are always trying to be noticed, always trying to be important. But I prefer to be invisible, to observe without being observed, to speak without being heard. There is freedom in being nobody, freedom to be myself, to think my own thoughts, to live my own life. I am nobody, and I am everything.",
            mood="calm,hopeful",
            user_id=user8.id
        ),
        Entry(
            title="Wild Nights",
            content="I dream of wild nights, of passionate love, of the kind of connection that sets the soul on fire. But I am a recluse, a woman who lives alone, who writes poems instead of living life. I wonder if I will ever know the touch of another, the warmth of another's body, the sound of another's heartbeat. I wonder if I will ever experience the wild nights of my dreams, or if they will remain forever in the realm of imagination. Perhaps it is enough to dream, to write about love even if I never experience it. Perhaps the poetry is the love, the words are the passion, the dreams are the reality.",
            mood="in love,excited",
            user_id=user8.id
        ),
        Entry(
            title="The Soul selects her own Society",
            content="My soul is selective, choosing only those who understand her, who speak her language, who share her vision. I do not need many friends, only a few who are true, who are real, who are worthy of my trust. The world is full of people, but my soul recognizes only a handful as kindred spirits. I am not lonely, even though I am alone. I am not isolated, even though I live in seclusion. My soul has chosen her own society, and it is enough. I do not need the approval of the many, only the understanding of the few. I am content with my own company, with the voices in my head, with the poems in my heart.",
            mood="calm,hopeful",
            user_id=user8.id
        ),
        
        # Additional entries with more mood variety
        
        # Kafka with angry mood
        Entry(
            title="The Penal Colony",
            content="I am trapped in a system that I did not create, following rules that I do not understand, serving a purpose that I cannot comprehend. The machine of bureaucracy grinds on, crushing everything in its path, including my own humanity. I am angry at the injustice, at the cruelty, at the senselessness of it all. But my anger is impotent, my rage is useless, my fury is meaningless. I am just another cog in the machine, another victim of the system. I want to break free, to rebel, to fight back, but I do not know how. I am angry, but I am also afraid.",
            mood="angry,anxious",
        user_id=user1.id
        ),
        
        # Virginia Woolf with neutral mood
        Entry(
            title="The Mark on the Wall",
            content="I am staring at a mark on the wall, a small, insignificant thing that has captured my attention completely. It is neither beautiful nor ugly, neither important nor trivial. It simply is. I find myself thinking about how we assign meaning to things, how we create stories around objects, how we make sense of the world through narrative. The mark is just a mark, but I have made it into something more. Perhaps this is what we all do—we take the raw material of existence and shape it into something meaningful, something that makes sense to us.",
            mood="neutral,calm",
        user_id=user2.id
        ),
        
        # Anne Frank with grateful mood
        Entry(
            title="The Simple Joys",
            content="Today I am grateful for the simple things—the warmth of the sun through the window, the sound of my family's voices, the taste of bread and butter. These are the things that keep me going, that remind me that life is still worth living, even in the darkest times. I am grateful for the books that transport me to other worlds, for the music that lifts my spirits, for the love that surrounds me. I am grateful for the strength that I did not know I had, for the courage that I find within myself, for the hope that refuses to die. Gratitude is my weapon against despair.",
            mood="grateful,hopeful",
            user_id=user3.id
        ),
        
        # Sylvia Plath with excited mood
        Entry(
            title="The Colossus",
            content="I am rebuilding myself, piece by piece, creating something new from the ruins of the old. I am excited about this process of transformation, about the possibility of becoming someone different, someone stronger, someone better. I am not the same person I was yesterday, and I will not be the same person tomorrow. I am constantly changing, constantly growing, constantly becoming. This is what it means to be alive—to be in a state of perpetual becoming, to be always on the verge of something new. I am excited about the future, about the unknown, about the possibilities that lie ahead.",
            mood="excited,hopeful",
            user_id=user4.id
        ),
        
        # Frida Kahlo with confused mood
        Entry(
            title="The Broken Column",
            content="I am trying to understand myself, to make sense of the contradictions within me, to reconcile the different parts of my being. I am strong and weak, brave and afraid, confident and uncertain. I am a woman who loves passionately and suffers deeply, who creates beauty and experiences pain, who is both whole and broken. I do not know who I am anymore, or who I want to be. I am confused about my identity, about my purpose, about my place in the world. But perhaps confusion is not a bad thing. Perhaps it is the beginning of wisdom, the first step toward understanding.",
            mood="confused,hopeful",
            user_id=user5.id
        ),
        
        # Edgar Allan Poe with in love mood
        Entry(
            title="To Helen",
            content="I have found her, the one who makes my heart beat faster, who fills my mind with thoughts of beauty and grace. She is like a star in the night sky, bright and distant and unattainable, but I cannot help but be drawn to her light. I am in love with her, though I know that love is a dangerous thing, a poison that can destroy as easily as it can heal. But I cannot help myself. I am willing to risk everything for this feeling, this madness, this beautiful insanity. Love is the greatest mystery of all, and I am its willing victim.",
            mood="in love,excited",
            user_id=user6.id
        ),
        
        # Rainer Maria Rilke with sad mood
        Entry(
            title="The Elegy",
            content="I am mourning the loss of something I never had, grieving for a dream that never came true, weeping for a love that never was. There is a sadness in my heart that I cannot explain, a melancholy that colors everything I see. I am sad for the beauty that is wasted, for the love that is unrequited, for the life that is unlived. But perhaps sadness is not the enemy. Perhaps it is the companion of beauty, the shadow that makes the light more precious. I am learning to embrace my sadness, to find poetry in my pain, to make art from my sorrow.",
            mood="sad,calm",
            user_id=user7.id
        ),
        
        # Emily Dickinson with angry mood
        Entry(
            title="Much Madness is divinest Sense",
            content="I am angry at the world for its narrow definitions, its rigid rules, its insistence on conformity. They call me mad because I do not fit their mold, because I refuse to be what they want me to be. But I know that my madness is divine sense, that my difference is my strength, that my rebellion is my salvation. I am angry at the injustice of it all, at the way they try to silence those who speak the truth, at the way they punish those who dare to be different. But my anger gives me power, my rage gives me voice, my fury gives me courage.",
            mood="angry,hopeful",
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
    print("Username: Edgar Allan Poe, Password: password123")
    print("Username: Rainer Maria Rilke, Password: password123")
    print("Username: Emily Dickinson, Password: password123")

if __name__ == "__main__":
    with app.app_context():
        seed_database()