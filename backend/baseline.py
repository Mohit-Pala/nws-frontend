import pandas as pd
import json
import numpy as np
from transformers import AutoTokenizer, AutoModel
import torch
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import Levenshtein

dataset_file = 'data/True.csv' 
output_file = 'data/baselines.json' 
model_name = "deepseek-ai/DeepSeek-R1-Distill-Qwen-1.5B"
sample_size = 500
random_state = 42

# Load models
print(f"Loading tokenizer and model: {model_name}")
try:
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModel.from_pretrained(model_name)
    print("Models loaded successfully.")
    models_loaded = True
except Exception as e:
    print(f"Warning: Could not load models ({e}).")
    models_loaded = False
    tokenizer = None
    model = None


def get_ngrams(text, n):
    text = text.lower()
    if n <= 0: return set()
    words = text.split()
    # Handle cases where text has fewer words than n
    if len(words) < n: return set()
    return set([" ".join(ngram) for ngram in zip(*[words[i:] for i in range(n)])])

def jaccard_similarity(set1, set2):
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union != 0 else 0.0

def calculate_metrics_for_pair(title, article, tokenizer, model):
    metrics = {}

    # Cosine Similarity
    if models_loaded and tokenizer and model:
        try:
            with torch.no_grad():
                inputs_title = tokenizer(title, return_tensors="pt", truncation=True, max_length=512, padding=True)
                inputs_article = tokenizer(article, return_tensors="pt", truncation=True, max_length=512, padding=True)
                title_embedding = model(**inputs_title).last_hidden_state.mean(dim=1)
                article_embedding = model(**inputs_article).last_hidden_state.mean(dim=1)
                metrics['cosineSim'] = torch.nn.functional.cosine_similarity(title_embedding, article_embedding).item()
        except Exception as e:
            metrics['cosineSim'] = None
    else:
         metrics['cosineSim'] = None

    # Jaccard words
    title_words = set(title.split())
    article_words = set(article.split())
    metrics['jaccardWords'] = jaccard_similarity(title_words, article_words)

    # Jaccard bigrams
    title_bigrams = get_ngrams(title, 2)
    article_bigrams = get_ngrams(article, 2)
    metrics['jaccardBigrams'] = jaccard_similarity(title_bigrams, article_bigrams)

    # TF-IDF Vectorizer
    try:
        corpus = [title, article]
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)
        # Case title/article might be empty
        if tfidf_matrix.shape[0] == 2:
             metrics['tfIdfSim'] = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
        else:
             metrics['tfIdfSim'] = 0.0
    except ValueError as e:
        print(f"TF-IDF Error for title '{title[:30]}...': {e}")
        metrics['tfIdfSim'] = 0.0

    # Edit distance
    try:
        edit_distance = Levenshtein.distance(title, article)
        max_len = max(len(title), len(article))
        metrics['normEditDist'] = (1 - (edit_distance / max_len)) if max_len > 0 else 1.0 # 1 if both empty, prevents div by zero
    except Exception as e:
        print(f"Edit Distance Error for title '{title[:30]}...': {e}")
        metrics['normEditDist'] = None

    # Length difference and ratio
    len_title = len(title)
    len_article = len(article)
    metrics['lenDif'] = abs(len_title - len_article)
    metrics['lenRatio'] = len_title / len_article if len_article != 0 else float('inf') # Handle div by zero

    return metrics

# Main Calculation Logic
print(f"Loading dataset from {dataset_file}...")
try:
    df_full = pd.read_csv(dataset_file)
    if 'title' not in df_full.columns or 'text' not in df_full.columns:
        raise ValueError("Dataset must contain 'title' and 'text' columns.")
    print(f"Dataset loaded with {len(df_full)} entries.")
    print(f"Taking a simple random sample of {sample_size} entries...")
    df = df_full.sample(n=sample_size, random_state=random_state)
    print(f"Sampled {len(df)} entries.")
except Exception as e:
    print(f"Error loading dataset: {e}")
    exit()

all_metrics = []
print("Calculating metrics for each entry...")
for index, row in df.iterrows():
    title = str(row['title'])
    text = str(row['text'])

    # Basic validation
    if not title or not text:
        print(f"Skipping row {index}.")
        continue

    calculated = calculate_metrics_for_pair(title, text, tokenizer, model)
    all_metrics.append(calculated)


print(f"Finished calculating metrics for {len(all_metrics)} entries.")

# Aggregate and Average
print("Calculating average baselines...")
if not all_metrics:
    print("No metrics.")
    exit()

baseline_averages = {}
# Get metric keys
metric_keys = []
first_valid_result = next((m for m in all_metrics if m is not None), None)
if first_valid_result:
    metric_keys = [k for k, v in first_valid_result.items() if v is not None]
else:
    print("No results.")
    # metric_keys = ['cosineSim', 'jaccardWords', 'jaccardBigrams', 'tfIdfSim', 'normEditDist', 'lenDif', 'lenRatio']


for key in metric_keys:
    valid_values = [m[key] for m in all_metrics if m is not None and key in m and m[key] is not None and np.isfinite(m[key])] # Filter None and non-finite values like inf
    if valid_values:
        baseline_averages[key] = np.mean(valid_values)
    else:
        baseline_averages[key] = 0


print("Calculated Baselines:")
print(json.dumps(baseline_averages, indent=4))

# Save baseline
print(f"Saving baselines to {output_file}...")
try:
    with open(output_file, 'w') as f:
        json.dump(baseline_averages, f, indent=4)
    print("Baselines saved.")
except Exception as e:
    print(f"Error saving baselines.")
