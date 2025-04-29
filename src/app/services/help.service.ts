import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HelpService {

  // length diff
  getLengthDifference() {
    return '(length of article) - (length of title)'
  }

  getLengthRatio() {
    return '(length of article) / (length of title)'
  }

  getCosineSimilarity() {
    return 'Cosine similarity is a metric used to measure the similarity between two non-zero vectors in an inner product space. It is defined as the cosine of the angle between the vectors, which is calculated as the dot product of the vectors divided by the product of their magnitudes. We have it clamped between 0 and 1, so that it is easier to interpret. A value of 1 indicates that the vectors are identical, while a value of 0 indicates that they are dissimilar'
  }

  getJaccardSimilarity() {
    return 'Jaccard Similarity = (number of words in both sets) / (number in either set)'  
  }

  getJaccardSimilarityBigrams() {
    return 'Jaccard Similarity = (number of bigrams in both sets) / (number in either set)'  
  }

  getNormalizedEditDistance() {
    return 'Normalized Edit Distance = (number of edits to make title into article) / (length of article)'
  }

  getTFIDFSimilarity() {
    return 'TF-IDF Similarity = (sum of tf-idf scores of words in both sets) / (sum of tf-idf scores of all words)'
  }
}
