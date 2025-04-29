from flask import Flask, request, jsonify
from flask_cors import CORS
from transformers import pipeline, AutoTokenizer, AutoModel
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein
import os

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


# Load the sentiment analysis model
sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment"
sentiment_analyzer = pipeline('sentiment-analysis', model=sentiment_model_name)

# Load the emotion analysis model
emotion_model_name = 'j-hartmann/emotion-english-distilroberta-base'
emotion_classifier = pipeline(
    'text-classification', model=emotion_model_name, return_all_scores=True)

# Load the deepseek model
try:
    tokenizer = AutoTokenizer.from_pretrained(
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
    model = AutoModel.from_pretrained(
        "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
except Exception as e:
    print(f"Error loading DeepSeek model: {e}")

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
    emotion_results = {}
    for emotion in emotions:
        emotion_results[emotion['label']] = emotion['score']
    return emotion_results


def similarity(title, text, model):
    with torch.no_grad():
        title_embedding = model(**title).last_hidden_state.mean(dim=1)
        article_embedding = model(**text).last_hidden_state.mean(dim=1)
    return torch.nn.functional.cosine_similarity(title_embedding, article_embedding)


def get_ngrams(text, n):
    text = text.lower()
    if n <= 0:
        return set()
    words = text.split()
    return set([" ".join(ngram) for ngram in zip(*[words[i:] for i in range(n)])])


def jaccard_similarity(set1, set2):
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    if union == 0:
        return 0.0  # Handle the case where the union is zero
    return intersection / union


@app.route('/predict', methods=['POST'])
def predict():
    print("Entering /predict route")
    try:
        data = request.get_json()
        print("Data received in /predict:", data)
        if not data:
            print("No data provided")
            return jsonify({'error': 'No data provided'}), 400
        title = data.get('title')
        article = data.get('article')
        if not title or not article:
            print("Missing title or article")
            return jsonify({'error': 'Title and article are required'}), 400

        print("Calculating... ")
        # Cosine similarity
        inputs_title = tokenizer(title, return_tensors="pt", truncation=True)
        inputs_article = tokenizer(
            article, return_tensors="pt", truncation=True)
        similarity_score = similarity(
            inputs_title, inputs_article, model).item()
        print("Cosine similarity calculated:", similarity_score)

        # Jaccard words
        title_words = set(title.split())
        article_words = set(article.split())
        jaccard_words = jaccard_similarity(title_words, article_words)
        print("Jaccard words calculated:", jaccard_words)

        # Jaccard bigrams
        title_bigrams = get_ngrams(title, 2)
        article_bigrams = get_ngrams(article, 2)
        jaccard_bigrams = jaccard_similarity(title_bigrams, article_bigrams)
        print("Jaccard bigrams calculated:", jaccard_bigrams)

        # TF-IDF Vectorizer
        corpus = [title, article]
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)
        tfidf_similarity = cosine_similarity(
            tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        print("TF-IDF similarity calculated:", tfidf_similarity)

        # Edit distance
        edit_distance = Levenshtein.distance(title, article)
        max_possible_edit_distance = max(len(title), len(article))
        normalized_edit_distance = 1 - \
            (edit_distance / max_possible_edit_distance)
        print("Edit distance calculated:", normalized_edit_distance)

        # Length difference and ratio
        len_diff = abs(len(title) - len(article))
        len_ratio = len(title) / \
            len(article) if len(article) != 0 else float('inf')

        result = {
            'title': title,
            'article': article,
            'message': 'Data received successfully',
            'metrics': {
                'cosineSim': similarity_score,
                'jaccardWords': jaccard_words,
                'jaccardBigrams': jaccard_bigrams,
                'tfIdfSim': tfidf_similarity,
                'normEditDist': normalized_edit_distance,
                'lenDif': len_diff,
                'lenRatio': len_ratio
            }
        }
        print("Returning result:", result)
        return jsonify(result)
    except Exception as e:
        print(f"Error in /predict: {e}")
        return jsonify({'error': 'Internal server error'}), 500


@app.route('/submit', methods=['POST'])
def submit_data():
    try:
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        title = data.get('title')
        article = data.get('article')
        # clamp to 480 words to not exceed 514 tokens
        article = article[:480]

        if not title or not article:
            return jsonify({'error': 'Title and article are required'}), 400

        full_text = f"{title}. {article}"
        sentiment_result = analyze_sentiment(full_text)
        emotion_result = analyze_emotions(full_text)

        # Convert emotions to frontend-compatible format
        emotion_plot_data = {}
        emotion_plot_data['anger'] = emotion_result.get('anger', 0)
        emotion_plot_data['disgust'] = emotion_result.get('disgust', 0)
        emotion_plot_data['fear'] = emotion_result.get('fear', 0)
        emotion_plot_data['joy'] = emotion_result.get('joy', 0)
        emotion_plot_data['sadness'] = emotion_result.get('sadness', 0)
        emotion_plot_data['surprise'] = emotion_result.get('surprise', 0)
        emotion_plot_data['neutral'] = emotion_result.get('neutral', 0)

        sentiment_plot_data = {}
        sentiment_plot_data['positive'] = 0
        sentiment_plot_data['negative'] = 0
        sentiment_plot_data['neutral'] = 0

        if sentiment_result['sentiment'] == 'positive':
            sentiment_plot_data['positive'] = sentiment_result['score']
            sentiment_plot_data['negative'] = (
                1 - sentiment_result['score']) / 2
            sentiment_plot_data['neutral'] = (
                1 - sentiment_result['score']) / 2
        elif sentiment_result['sentiment'] == 'negative':
            sentiment_plot_data['negative'] = sentiment_result['score']
            sentiment_plot_data['positive'] = (
                1 - sentiment_result['score']) / 2
            sentiment_plot_data['neutral'] = (
                1 - sentiment_result['score']) / 2
        elif sentiment_result['sentiment'] == 'neutral':
            sentiment_plot_data['neutral'] = sentiment_result['score']
            sentiment_plot_data['positive'] = (
                1 - sentiment_result['score']) / 2
            sentiment_plot_data['negative'] = (
                1 - sentiment_result['score']) / 2

        result = {
            'title': title,
            'article': article,
            'message': 'Data received successfully',
            'emotion': emotion_plot_data,
            'sentiment': sentiment_plot_data
        }
        print("Result being returned:", result)  # Print the result
        return jsonify(result)
    except Exception as e:
        print(f"Error in /submit: {e}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    # app.run(debug=True, port=5001)
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5001)), use_reloader=False)
