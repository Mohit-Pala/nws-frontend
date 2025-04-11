import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PlotService } from '../../../services/plot.service';
import { CommonModule } from '@angular/common';
import { KeyValueCustom } from '../../../models/key-value-custom.model';
import { BackendOutput } from '../../../services/rest-api.service';

@Component({
  selector: 'app-model',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent implements OnChanges {
  @Input() apiData: BackendOutput | null = null;

  plotly = inject(PlotService);
  emotions: any[] = [];
  sentimentData: any[] = [];
  similarityData: KeyValueCustom[] = [];

  comparision_metrics = [
    { name: 'Cosine Similarity', your: 0.34, baseline: 0.75 },
  ];

  constructor() { }

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
    this.updateEmotionChart();
    this.updateSentimentChart();
    this.updateSimilarityCharts();
  }

  updateEmotionChart() {
    if (this.apiData && this.apiData.emotion) {
      this.emotions = Object.entries(this.apiData.emotion).map(([name, value]) => ({ name, value }));
      console.log("Emotions data:", this.emotions);
      if (this.emotions.length > 0) {
        this.plotly.makeBarGraph(this.emotions, 'Emotional Analysis', 'Emotion', 'Score', 'bar-graph');
      } else {
        console.warn("No emotion data to display");
      }
    } else {
      console.warn("apiData or apiData.emotion is null");
    }
  }

  updateSentimentChart() {
    if (this.apiData && this.apiData.sentiment) {
      this.sentimentData = Object.entries(this.apiData.sentiment).map(([name, value]) => ({ name, value }));
      console.log("Sentiment data:", this.sentimentData);
      if (this.sentimentData.length > 0) {
        this.plotly.makePieChart(this.sentimentData, 'Sentiment Analysis', 'sentiment-pie');
      } else {
        console.warn("No sentiment data to display");
      }
    } else {
      console.warn("apiData or apiData.sentiment is null");
    }
  }

  updateSimilarityCharts() {
    if (this.apiData && this.apiData.metrics) {
      this.similarityData = [
        { name: 'Cosine Similarity', value: this.apiData.metrics.cosineSim, id: 'gauge-cosine-similarity' } as KeyValueCustom,
        { name: 'TF-IDF Similarity', value: this.apiData.metrics.tfIdfSim, id: 'gauge-tfidf-similarity' } as KeyValueCustom,
        { name: 'Jaccard (Words)', value: this.apiData.metrics.jaccardWords, id: 'gauge-jaccard-words' } as KeyValueCustom,
        { name: 'Jaccard (Bigrams)', value: this.apiData.metrics.jaccardBigrams, id: 'gauge-jaccard-bigrams' } as KeyValueCustom,
        { name: 'Normalized Edit Distance', value: this.apiData.metrics.normEditDist, id: 'gauge-edit-distance' } as KeyValueCustom
      ];
      this.similarityData.forEach(metric => {
        if(!metric.id) {
          return
        }
        this.plotly.makeRadarChart(this.similarityData, 'Similarity Analysis', 'similarity-radar');
        this.plotly.makeGaugeChart(metric.value, metric.name, metric.name, metric.id);
      });
    } else {
      console.warn("apiData or apiData.metrics is null");
    }
  }
}
