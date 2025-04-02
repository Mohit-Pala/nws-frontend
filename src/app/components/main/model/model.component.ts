import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PlotService } from '../../../services/plot.service';
import { CommonModule } from '@angular/common';
import { KeyValueCustom } from '../../../models/key-value-custom.model';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})

export class ModelComponent implements OnChanges {
  @Input() apiData: any;

  plotly = inject(PlotService);
  emotions: any[] = [];
  sentimentData: any[] = [];
  similarityData: KeyValueCustom[] = [];

  comparision_metrics = [
    {name: 'Cosine Similarity', your: 0.34, baseline: 0.75},
  ]

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apiData']) {
      console.log("apiData in ModelComponent changed:", this.apiData);
      this.updateCharts();
      this.plotly.makeRadarChart(this.similarityData, 'Similarity Analysis', 'similarity-radar');
    }
  }

  updateCharts() {
    if (!this.apiData) {
      console.warn('No data to update charts.');
      return;
    }
    this.updateEmotionChart();
    this.updateSentimentChart();
    this.updateSimilarityCharts();
  }

  updateEmotionChart() {
    this.emotions = this.apiData.emotions || [];
    console.log("Emotions data:", this.emotions);
    if (this.emotions.length > 0) {
      this.plotly.makeBarGraph(this.emotions, 'Emotional Analysis', 'Emotion', 'Score', 'bar-graph');
    } else {
      console.warn("No emotion data to display");
    }
  }

  updateSentimentChart() {
    this.sentimentData = this.processSentimentData(this.apiData.sentiment);
    console.log("Sentiment data:", this.sentimentData);
    if (this.sentimentData.length > 0) {
      this.plotly.makePieChart(this.sentimentData, 'Sentiment Analysis', 'sentiment-pie');
    } else {
      console.warn("No sentiment data to display");
    }
  }

  updateSimilarityCharts() {
    this.similarityData = [
      { name: 'Cosine Similarity', value: this.apiData['cosine-similarity'], id: 'gauge-cosine-similarity' } as KeyValueCustom,
      { name: 'TF-IDF Similarity', value: this.apiData['tfidf-similarity'], id: 'gauge-tfidf-similarity' } as KeyValueCustom,
      { name: 'Jaccard (Words)', value: this.apiData['jaccard-words'], id: 'gauge-jaccard-words' } as KeyValueCustom,
      { name: 'Jaccard (Bigrams)', value: this.apiData['jaccard-bigrams'], id: 'gauge-jaccard-bigrams' } as KeyValueCustom,
      { name: 'Normalized Edit Distance', value: this.apiData['edit-distance'], id: 'gauge-edit-distance' } as KeyValueCustom
    ];
    this.similarityData.forEach(metric => {
      this.plotly.makeGaugeChart(metric.value, metric.name, metric.name, metric.id);
    });
  }

  processSentimentData(sentiment: any): any[] {
    if (!sentiment || !sentiment.sentiment || !sentiment.score) {
      console.warn("Invalid sentiment data:", sentiment);
      return [];
    }

    const { sentiment: label, score: confidence } = sentiment; // Updated destructuring
    const otherConfidence = ((1 - confidence) / 2);

    switch (label) {
      case 'positive':
        return [
          { name: 'Positive', value: confidence },
          { name: 'Neutral', value: otherConfidence },
          { name: 'Negative', value: otherConfidence }
        ];
      case 'neutral':
        return [
          { name: 'Positive', value: otherConfidence },
          { name: 'Neutral', value: confidence },
          { name: 'Negative', value: otherConfidence }
        ];
      case 'negative':
        return [
          { name: 'Positive', value: otherConfidence },
          { name: 'Neutral', value: otherConfidence },
          { name: 'Negative', value: confidence }
        ];
      default:
        console.warn("Unknown sentiment label:", label);
        return [];
    }
  }



}
