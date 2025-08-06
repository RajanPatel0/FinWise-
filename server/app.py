from flask import Flask, request, jsonify
import joblib

app = Flask(__name__)
model = joblib.load('fraud_model.pkl')
vectorizer = joblib.load('vectorizer.pkl')

@app.route('/api/classify-fraud', methods=['POST'])
def classify_fraud():
    text = request.json.get('text','')
    X = vectorizer.transform([text])
    proba = model.predict_proba(X)[0][1]  # phishing probability
    label = 'phish' if proba > 0.5 else 'safe'

    # Simple “explanation”: top 3 weighted features
    features = vectorizer.get_feature_names_out()
    coefs    = model.coef_[0]
    top_idx  = coefs.argsort()[-3:][::-1]
    keywords = [features[i] for i in top_idx]

    return jsonify({
      'score': float(proba),
      'label': label,
      'explanation': 'Top suspicious features: ' + ', '.join(keywords)
    })

if __name__=='__main__':
    app.run()
