# server/models.py
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id       = db.Column(db.Integer, primary_key=True)
    name     = db.Column(db.String(80))      
    email    = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(128), nullable=False)   # stored hashed
    created  = db.Column(db.DateTime, default=datetime.utcnow)

class FraudRecord(db.Model):
    id          = db.Column(db.Integer, primary_key=True)
    user_id     = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    scenario    = db.Column(db.String(64))
    text        = db.Column(db.Text)
    label       = db.Column(db.String(16))
    score       = db.Column(db.Float)
    explanation = db.Column(db.Text)
    timestamp   = db.Column(db.DateTime, default=datetime.utcnow)
    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "scenario": self.scenario,
            "text": self.text,
            "label": self.label,
            "score": self.score,
            "explanation": self.explanation,
            "timestamp": self.timestamp.isoformat(),
        }

class QuizAttempt(db.Model):
    id        = db.Column(db.Integer, primary_key=True)
    user_id   = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    score     = db.Column(db.Integer)
    total     = db.Column(db.Integer)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "score": self.score,
            "total": self.total,
            "timestamp": self.timestamp.isoformat(),
        }