from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
import json
from dotenv import load_dotenv
import openai

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# In-memory storage for journal entries (in production, use a database)
journal_entries = []

def analyze_emotion_with_ai(text):
    """Analyze the emotion of a journal entry using OpenAI"""
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are an emotion analyzer. Analyze the given text and return a JSON response with: 1) primary_emotion (string), 2) emotion_intensity (1-10), 3) color_assignment (hex color code), 4) emotion_tags (array of emotions). Be empathetic and accurate."
                },
                {
                    "role": "user",
                    "content": f"Analyze the emotion in this journal entry: {text}"
                }
            ],
            max_tokens=200
        )
        
        # Parse the response
        analysis = json.loads(response.choices[0].message.content)
        return analysis
    except Exception as e:
        print(f"Error analyzing emotion: {e}")
        return {
            "primary_emotion": "neutral",
            "emotion_intensity": 5,
            "color_assignment": "#808080",
            "emotion_tags": ["neutral"]
        }

@app.route('/api/entries', methods=['GET'])
def get_entries():
    """Get all journal entries"""
    return jsonify(journal_entries)

@app.route('/api/entries', methods=['POST'])
def create_entry():
    """Create a new journal entry with AI emotion analysis"""
    data = request.get_json()
    
    if not data or 'content' not in data:
        return jsonify({'error': 'Content is required'}), 400
    
    # Analyze emotion using AI
    emotion_analysis = analyze_emotion_with_ai(data['content'])
    
    # Create entry
    entry = {
        'id': len(journal_entries) + 1,
        'content': data['content'],
        'timestamp': datetime.now().isoformat(),
        'emotion_analysis': emotion_analysis
    }
    
    journal_entries.append(entry)
    return jsonify(entry), 201

@app.route('/api/entries/<int:entry_id>', methods=['GET'])
def get_entry(entry_id):
    """Get a specific journal entry"""
    entry = next((e for e in journal_entries if e['id'] == entry_id), None)
    if entry:
        return jsonify(entry)
    return jsonify({'error': 'Entry not found'}), 404

@app.route('/api/entries/<int:entry_id>', methods=['PUT'])
def update_entry(entry_id):
    """Update a journal entry and re-analyze emotions"""
    data = request.get_json()
    entry = next((e for e in journal_entries if e['id'] == entry_id), None)
    
    if not entry:
        return jsonify({'error': 'Entry not found'}), 404
    
    if 'content' in data:
        entry['content'] = data['content']
        # Re-analyze emotion
        emotion_analysis = analyze_emotion_with_ai(data['content'])
        entry['emotion_analysis'] = emotion_analysis
        entry['timestamp'] = datetime.now().isoformat()
    
    return jsonify(entry)

@app.route('/api/entries/<int:entry_id>', methods=['DELETE'])
def delete_entry(entry_id):
    """Delete a journal entry"""
    global journal_entries
    journal_entries = [e for e in journal_entries if e['id'] != entry_id]
    return jsonify({'message': 'Entry deleted'})

@app.route('/api/emotions/summary', methods=['GET'])
def get_emotion_summary():
    """Get a summary of emotions across all entries"""
    if not journal_entries:
        return jsonify({'message': 'No entries found'})
    
    emotion_counts = {}
    color_frequency = {}
    
    for entry in journal_entries:
        emotion = entry['emotion_analysis']['primary_emotion']
        color = entry['emotion_analysis']['color_assignment']
        
        emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1
        color_frequency[color] = color_frequency.get(color, 0) + 1
    
    return jsonify({
        'emotion_counts': emotion_counts,
        'color_frequency': color_frequency,
        'total_entries': len(journal_entries)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)

