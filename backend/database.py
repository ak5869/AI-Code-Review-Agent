import sqlite3
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / "review_history.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reviews (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            review_summary TEXT,
            issues TEXT,
            review_date TEXT DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'completed'
        )
    ''')
    conn.commit()
    conn.close()

def insert_review(filename, review_summary, issues, status='completed'):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO reviews (filename, review_summary, issues, status)
        VALUES (?, ?, ?, ?)
    ''', (filename, review_summary, issues, status))
    conn.commit()
    conn.close()

def get_all_reviews():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute('''
        SELECT id, filename, review_summary, issues, review_date, status
        FROM reviews
        ORDER BY review_date DESC
    ''')
    rows = cursor.fetchall()
    conn.close()
    return rows
