import { Component, Input, OnChanges, SimpleChanges, inject, OnInit } from '@angular/core';
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
export class ModelComponent implements OnChanges, OnInit {
  @Input() apiData: any;

  plotly = inject(PlotService);
  emotions: any[] = [];
  sentimentData: any[] = [];
  guageSimilarity: number = 0;
  similarityData: KeyValueCustom[] = [
    { name: 'Cosine Similarity', value: 0.85 }, // higher is better
    { name: 'TF-IDF Similarity', value: 0.72 }, // higher is better
    { name: 'Jaccard (Words)', value: 0.45 }, // higher is better
    { name: 'Jaccard (Bigrams)', value: 0.32 }, // higher is better
    { name: 'Normalized Edit Distance', value: 0.28 } // lower is better
  ];

  constructor() { }

  ngOnInit(): void {
    this.plotly.makeRadarChart(this.similarityData, 'Similarity Analysis', 'similarity-radar');
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['apiData']) {
      console.log("apiData in ModelComponent changed:", this.apiData);
      this.updateCharts();
    }
  }

  updateCharts() {
    if (!this.apiData) {
      console.warn('No data to update charts.');
      return;
    }

    this.emotions = this.apiData.emotions || [];
    console.log("Emotions data:", this.emotions);

    // Handle the single sentiment label and confidence
    this.sentimentData = this.processSentimentData(this.apiData.sentiment);
    console.log("Sentiment data:", this.sentimentData);

    // Handle the similarity data
    this.guageSimilarity = this.apiData.guageSimilarity || 0;
    console.log("Gauge data:", this.guageSimilarity)

    if (this.emotions.length > 0) {
      this.plotly.makeBarGraph(this.emotions, 'Emotional Analysis', 'Emotion', 'Score', 'bar-graph');
    } else {
      console.warn("No emotion data to display");
    }

    if (this.sentimentData.length > 0) {
      this.plotly.makePieChart(this.sentimentData, 'Sentiment Analysis', 'sentiment-pie');
    } else {
      console.warn("No sentiment data to display");
    }
    this.plotly.makeGaugeChart(this.guageSimilarity, 'Text Similarity', 'Cosine Similarity', 'similarity-gauge');
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
