# server/app.py
import os, datetime, re
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_migrate import Migrate
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity
)
from werkzeug.security import generate_password_hash, check_password_hash
from models import db, User, FraudRecord, QuizAttempt

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"]        = "sqlite:///data.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["JWT_SECRET_KEY"]                 = os.getenv("JWT_SECRET_KEY","change-me")
app.config["JWT_ACCESS_TOKEN_EXPIRES"]       = datetime.timedelta(days=7)   # 👈 longer life
db.init_app(app)
Migrate(app, db)
JWTManager(app)
CORS(app)

# ---------- Auth ----------
@app.route("/auth/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    if User.query.filter_by(email=data.get("email")).first():
        return jsonify({"msg":"Email already in use"}), 400
    u = User(
        name     = data.get("name") or "",           # 👈 save name
        email    = data["email"],
        password = generate_password_hash(data["password"])
    )
    db.session.add(u); db.session.commit()
    return jsonify({"msg":"Registered"}), 201

@app.route("/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    u = User.query.filter_by(email=data.get("email")).first()
    if not u or not check_password_hash(u.password, data.get("password","")):
        return jsonify({"msg":"Bad credentials"}), 401
    token = create_access_token(identity=str(u.id))  # 👈 keep identity a string
    return jsonify({"access_token": token})

@app.route("/me", methods=["GET"])
@jwt_required()
def me():
    uid = int(get_jwt_identity())
    u   = User.query.get_or_404(uid)
    return jsonify({"id": u.id, "name": u.name or "", "email": u.email})

# ---------- Fraud (unchanged except jwt_required) ----------
CRED_PATTERN   = re.compile(r'https?://[^/\s]+@')
PHISH_KEYWORDS = ["verify","password","login","bank","urgent","click","pay"]

def classify_text_local(text, scenario):
    text_l = text.lower()
    if CRED_PATTERN.search(text):
        return "phish", 1.0, "URL with embedded credentials"
    matches = [kw for kw in PHISH_KEYWORDS if kw in text_l]
    score   = min(1.0, len(matches)/len(PHISH_KEYWORDS))
    label   = "phish" if score>=0.3 else "safe"
    explan  = f"Found: {matches}" if matches else "No phishing keywords"
    return label, score, explan

@app.route("/classify", methods=["POST"])
@jwt_required()
def classify_endpoint():
    user_id  = int(get_jwt_identity())
    body     = request.get_json() or {}
    text     = body.get("text","")
    scenario = body.get("scenario","generic")
    label, score, expl = classify_text_local(text, scenario)
    rec = FraudRecord(user_id=user_id, scenario=scenario, text=text,
                      label=label, score=score, explanation=expl)
    db.session.add(rec); db.session.commit()
    return jsonify({"label":label,"score":score,"explanation":expl}), 200

@app.route("/history", methods=["GET"])
@jwt_required()
def get_history():
    user_id = int(get_jwt_identity())
    scn     = request.args.get("scenario")
    q = FraudRecord.query.filter_by(user_id=user_id)
    if scn: q = q.filter_by(scenario=scn)
    recs = q.order_by(FraudRecord.timestamp.desc()).all()
    return jsonify([{
        "text": r.text, "scenario": r.scenario,
        "label": r.label, "score": r.score,
        "explanation": r.explanation,
        "timestamp": r.timestamp.isoformat()
    } for r in recs])

# ---------- Quiz ----------
@app.route("/quiz-results", methods=["POST"])
@jwt_required()
def submit_quiz():
    uid  = int(get_jwt_identity())
    body = request.get_json() or {}
    score = int(body.get("score", 0))
    total = int(body.get("total", 0))
    attempt = QuizAttempt(user_id=uid, score=score, total=total)
    db.session.add(attempt); db.session.commit()
    return jsonify(attempt.to_dict()), 201

@app.route("/quiz-results", methods=["GET"])
@jwt_required()
def get_quiz_history():
    uid = int(get_jwt_identity())
    attempts = (QuizAttempt.query
                .filter_by(user_id=uid)
                .order_by(QuizAttempt.timestamp.desc())
                .all())
    return jsonify([a.to_dict() for a in attempts])


# --- Run ---------------------------------------------------------------
if __name__ == "__main__":
    # okay while you’re prototyping; migrations are better long-term
    with app.app_context():
        db.create_all()

    app.run(host="0.0.0.0", port=5000, debug=True)
