from flask import Flask, request, jsonify
from flask_cors import CORS
from models import process_article
from transformers import pipeline, AutoTokenizer, AutoModel
import torch
import nltk
from nltk.translate.bleu_score import sentence_bleu
from rouge_score import rouge_scorer
from nltk.corpus import wordnet as wn
from nltk.corpus import wordnet_ic
brown_ic = wordnet_ic.ic('ic-brown.dat')
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})

# Load the sentiment analysis model
sentiment_model_name = "cardiffnlp/twitter-roberta-base-sentiment"
sentiment_analyzer = pipeline('sentiment-analysis', model=sentiment_model_name)

# Load the emotion analysis model
emotion_model_name = 'j-hartmann/emotion-english-distilroberta-base'
emotion_classifier = pipeline('text-classification', model=emotion_model_name, return_all_scores=True)

# Load the deepseek model
try:
    tokenizer = AutoTokenizer.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
    model = AutoModel.from_pretrained("deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B")
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
    emotion_results = []
    for emotion in emotions:
        emotion_results.append({
            'label': emotion['label'],
            'score': emotion['score']
        })
    return emotion_results

def similarity(title, text, model):
    with torch.no_grad():
        title_embedding = model(**title).last_hidden_state.mean(dim=1)
        article_embedding = model(**text).last_hidden_state.mean(dim=1)
    return torch.nn.functional.cosine_similarity(title_embedding, article_embedding)

def get_ngrams(text, n):
    if n <= 0:
        return set() 
    words = text.split()
    return set(zip(*[words[i:] for i in range(n)]))

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

        # Cosine similarity
        print("Calculating cosine similarity") 
        inputs_title = tokenizer(title, return_tensors="pt", truncation=True, max_length=512)
        inputs_article = tokenizer(article, return_tensors="pt", truncation=True, max_length=512)
        similarity_score = similarity(inputs_title, inputs_article, model).item()
        print("Cosine similarity calculated:", similarity_score) 

        # Jaccard words
        print("Calculating Jaccard words")
        title_words = set(title.split())
        article_words = set(article.split())
        jaccard_words = jaccard_similarity(title_words, article_words)
        print("Jaccard words calculated:", jaccard_words) 

        # Jaccard bigrams
        print("Calculating Jaccard bigrams")
        title_bigrams = get_ngrams(title, 2)
        article_bigrams = get_ngrams(article, 2)
        jaccard_bigrams = jaccard_similarity(title_bigrams, article_bigrams)
        print("Jaccard bigrams calculated:", jaccard_bigrams)

        # TF-IDF Vectorizer
        print("Calculating TF-IDF similarity")
        corpus = [title, article]
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)
        tfidf_similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        print("TF-IDF similarity calculated:", tfidf_similarity)

        # Edit distance
        print("Calculating edit distance")
        edit_distance = Levenshtein.distance(title, article)
        max_possible_edit_distance = max(len(title), len(article))
        normalized_edit_distance = 1 - (edit_distance / max_possible_edit_distance)
        print("Edit distance calculated:", normalized_edit_distance)

        result = {
                'title': title,
                'article': article,
                'message': 'Data received successfully',
                'cosine-similarity': similarity_score,
                'jaccard-words': jaccard_words,
                'jaccard-bigrams': jaccard_bigrams,
                'tfidf-similarity': tfidf_similarity,
                'edit-distance': normalized_edit_distance
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
    except Exception as e:
        print(f"Error in /submit: {e}")
        return jsonify({'error': 'Internal server error'}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
