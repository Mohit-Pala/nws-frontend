from flask import Flask, request, jsonify
from flask_cors import CORS
from models import process_article  # Import the function from models.py
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Load the sentiment analysis model
sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment"
sentiment_analyzer = pipeline('sentiment-analysis', model=sentiment_model_name)

# Load the emotion analysis model
emotion_model_name = 'j-hartmann/emotion-english-distilroberta-base'
emotion_classifier = pipeline('text-classification', model=emotion_model_name, return_all_scores=True)

label_map = {
    'LABEL_0': 'negative',
    'LABEL_1': 'neutral',
    'LABEL_2': 'positive'
}

def analyze_sentiment(text):
    sentiment = sentiment_analyzer(text)[0]
    sentiment_label = label_map.get(sentiment['label'], sentiment['label'])
    return {
        'sentiment': sentiment_label,
        'score': sentiment['score']
    }

def analyze_emotions(text):
    emotions = emotion_classifier(text)[0]
    emotion_results = []
    for emotion in emotions:
        emotion_results.append({
            'label': emotion['label'],
            'score': emotion['score']
        })
    return emotion_results



@app.route('/submit', methods=['POST'])
def submit_data():
    data = request.get_json()
    title = data.get('title')
    article = data.get('article')

    if not title or not article:
        return jsonify({'error': 'Title and article are required'}), 400

    full_text = f"{title}. {article}"
    sentiment_result = analyze_sentiment(full_text)
    emotion_result = analyze_emotions(full_text)

    # Convert emotions to frontend-compatible format
    emotion_plot_data = [{'name': e['label'], 'value': e['score']} for e in emotion_result]

    result = {
        'title': title,
        'article': article,
        'message': 'Data received successfully',
        'sentiment': sentiment_result,
        'emotions': emotion_plot_data
    }

    return jsonify(result)


if __name__ == '__main__':
    app.run(debug=True, port=5001)
