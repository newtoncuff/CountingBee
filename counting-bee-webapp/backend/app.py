from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import random
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '../data/database/counting_machine.db')

app = Flask(__name__)
CORS(app)

def get_db():
    # Ensure the directory exists
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS sequences (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numbers TEXT NOT NULL,
        difficulty TEXT NOT NULL
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        consecutive_correct INTEGER DEFAULT 0
    )''')
    c.execute('''CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        sequence_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        correct BOOLEAN NOT NULL DEFAULT 0
    )''')
    conn.commit()
    conn.close()

def setup():
    init_db()
    populate_sequences()

def populate_sequences():
    conn = get_db()
    c = conn.cursor()
    # Only populate if table is empty
    c.execute('SELECT COUNT(*) FROM sequences')
    if c.fetchone()[0] == 0:
        # Easy: 1-10, Medium: 10-25, Hard: 25-100
        for diff, (start, end) in {
            'easy': (1, 10),
            'medium': (10, 25),
            'hard': (25, 100)
        }.items():
            for _ in range(30):
                length = random.randint(4, 6)
                seq = list(range(random.randint(start, end - length + 1), random.randint(start, end - length + 1) + length))
                c.execute('INSERT INTO sequences (numbers, difficulty) VALUES (?, ?)', (','.join(map(str, seq)), diff))
    conn.commit()
    conn.close()

@app.route('/api/difficulty')
def get_difficulty():
    return jsonify(['easy', 'medium', 'hard'])

@app.route('/api/puzzle')
def get_puzzle():
    difficulty = request.args.get('difficulty', 'easy')
    conn = get_db()
    c = conn.cursor()
    # Get last 10 sequence_ids from tasks
    c.execute('SELECT sequence_id FROM tasks ORDER BY date DESC LIMIT 10')
    recent = set(row['sequence_id'] for row in c.fetchall())
    c.execute('SELECT * FROM sequences WHERE difficulty=?', (difficulty,))
    candidates = [row for row in c.fetchall() if row['id'] not in recent]
    if not candidates:
        return jsonify({'error': 'No available puzzles'}), 404
    seq_row = random.choice(candidates)
    numbers = [int(n) for n in seq_row['numbers'].split(',') if n.strip()]
    # Randomly blank 1-2 numbers
    missing_indices = random.sample(range(len(numbers)), random.randint(1, 2))
    # Generate options more safely
    correct_answers = [numbers[i] for i in missing_indices]
    num_range = list(range(min(numbers), max(numbers)+1))
    
    # Try to get some wrong options, but don't exceed available range
    available_wrong = [n for n in num_range if n not in correct_answers]
    num_wrong_options = min(len(available_wrong), len(missing_indices) * 2)
    wrong_options = random.sample(available_wrong, num_wrong_options) if available_wrong else []
    
    all_options = wrong_options + correct_answers
    random.shuffle(all_options)
    
    puzzle = {
        'id': seq_row['id'],
        'numbers': [n if i not in missing_indices else None for i, n in enumerate(numbers)],
        'correctNumbers': numbers,  # Include the full correct sequence
        'missingIndices': missing_indices,
        'options': all_options,
        'difficulty': seq_row['difficulty']
    }
    return jsonify(puzzle)

@app.route('/api/submit', methods=['POST'])
def submit_puzzle():
    data = request.get_json()
    puzzle_id = data.get('puzzleId')
    answers = data.get('answers', [])
    user_id = 1  # Single user for demo
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM sequences WHERE id=?', (puzzle_id,))
    seq_row = c.fetchone()
    if not seq_row:
        return jsonify({'error': 'Puzzle not found'}), 404
    numbers = [int(n) for n in seq_row['numbers'].split(',') if n.strip()]
    # Get the missing indices and answers from the submission
    missing_indices = data.get('missingIndices', [])
    submitted_answers = data.get('answers', [])
    
    # Check if the submitted answers match the correct numbers at those positions  
    correct = len(submitted_answers) == len(missing_indices) and all(
        numbers[missing_indices[i]] == submitted_answers[i] 
        for i in range(len(missing_indices))
    )
    # Update user progress
    c.execute('SELECT * FROM users WHERE id=?', (user_id,))
    user = c.fetchone()
    if not user:
        c.execute('INSERT INTO users (id, name, consecutive_correct) VALUES (?, ?, ?)', (user_id, 'child', 0))
        conn.commit()
        consecutive_correct = 0
    else:
        consecutive_correct = user['consecutive_correct']
    if correct:
        consecutive_correct += 1
        message = 'Great job!'
        
        # If we've just completed a cycle of 10, reset to start new cycle
        if consecutive_correct > 10:
            consecutive_correct = 1  # Start new cycle at 1
    else:
        consecutive_correct = 0
        message = 'Try again!'
    
    stars = min(consecutive_correct, 10)
    c.execute('UPDATE users SET consecutive_correct=? WHERE id=?', (consecutive_correct, user_id))
    c.execute('INSERT INTO tasks (user_id, sequence_id, date, completed, correct) VALUES (?, ?, ?, ?, ?)',
              (user_id, puzzle_id, datetime.utcnow().isoformat(), 1, int(correct)))
    conn.commit()
    conn.close()
    return jsonify({
        'correct': correct,
        'message': message,
        'progress': {
            'userId': user_id,
            'consecutiveCorrect': consecutive_correct,
            'stars': stars
        }
    })

@app.route('/api/progress')
def get_progress():
    user_id = 1
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT consecutive_correct FROM users WHERE id=?', (user_id,))
    row = c.fetchone()
    stars = row['consecutive_correct'] if row else 0
    return jsonify({'userId': user_id, 'consecutiveCorrect': stars, 'stars': min(stars, 10)})



@app.route('/api/stats')
def get_stats():
    user_id = 1
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT COUNT(*) as total, SUM(correct) as correct FROM tasks WHERE user_id=?', (user_id,))
    row = c.fetchone()
    return jsonify({'total': row['total'], 'correct': row['correct'] or 0})

# Admin endpoints would go here

if __name__ == '__main__':
    setup()  # Initialize database and populate sequences
    app.run(host='0.0.0.0', port=5000)
