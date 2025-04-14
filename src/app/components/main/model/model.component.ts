import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PlotService } from '../../../services/plot.service';
import { CommonModule } from '@angular/common';
import { KeyValueCustom } from '../../../models/key-value-custom.model';
import { RestApiService } from '../../../services/rest-api.service';
import { ConverterService } from '../../../services/converter.service';
import { BackendOutput } from '../../../models/backedn-output.model';
import { HelpService } from '../../../services/help.service';

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
    // this.updateEmotionChart();
    // this.updateSentimentChart();
    this.updateSimilarityCharts();
  }

  // updateEmotionChart() {
  //   if (this.apiData && this.apiData.emotion) {
  //     this.emotions = Object.entries(this.apiData.emotion).map(([name, value]) => ({ name, value }));
  //     console.log("Emotions data:", this.emotions);
  //     if (this.emotions.length > 0) {
  //       this.plotly.makeBarGraph(this.emotions, 'Emotional Analysis', 'Emotion', 'Score', 'bar-graph');
  //     } else {
  //       console.warn("No emotion data to display");
  //     }
  //   } else {
  //     console.warn("apiData or apiData.emotion is null");
  //   }
  // }

  // updateSentimentChart() {
  //   if (this.apiData && this.apiData.sentiment) {
  //     this.sentimentData = Object.entries(this.apiData.sentiment).map(([name, value]) => ({ name, value }));
  //     console.log("Sentiment data:", this.sentimentData);
  //     if (this.sentimentData.length > 0) {
  //       this.plotly.makePieChart(this.sentimentData, 'Sentiment Analysis', 'sentiment-pie');
  //     } else {
  //       console.warn("No sentiment data to display");
  //     }
  //   } else {
  //     console.warn("apiData or apiData.sentiment is null");
  //   }
  // }

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
        if (!metric.id) {
          return
        }
        this.plotly.makeRadarChart(this.similarityData, 'Similarity Analysis', 'similarity-radar');
        this.plotly.makeGaugeChart(metric.value, metric.name, metric.name, metric.id);
      });
    } else {
      console.warn("apiData or apiData.metrics is null");
    }
  }

  // New with stricter types for error handling

  converter = inject(ConverterService)
  restApi = inject(RestApiService)
  help = inject(HelpService)

  dataRetrived: boolean = false
  retrivedOutput: BackendOutput = {
    title: '',
    article: '',
    message: '',
    emotion: {
      anger: 0,
      disgust: 0,
      fear: 0,
      joy: 0,
      sadness: 0,
      surprise: 0,
      neutral: 0
    },
    sentiment: {
      positive: 0,
      negative: 0,
      neutral: 0
    },
    metrics: {
      cosineSim: 0,
      jaccardBigrams: 0,
      jaccardWords: 0,
      lenDif: 0,
      lenRatio: 0,
      normEditDist: 0,
      tfIdfSim: 0
    }
  }

  comparisionMetris = [
    { name: 'Cosine Similarity', your: this.retrivedOutput.metrics.cosineSim, baseline: 0.9, explanation: this.help.getCosineSimilarity() },
    { name: 'Jaccard Bigrams', your: this.retrivedOutput.metrics.jaccardBigrams, baseline: 0.8, explanation: this.help.getJaccardSimilarityBigrams() },
    { name: 'Jaccard Words', your: this.retrivedOutput.metrics.jaccardWords, baseline: 0.7, explanation: this.help.getJaccardSimilarity() },
    { name: 'Length Difference', your: this.retrivedOutput.metrics.lenDif, baseline: 10, explanation: this.help.getLengthDifference() },
    { name: 'Length Ratio', your: this.retrivedOutput.metrics.lenRatio, baseline: 1.5, explanation: this.help.getLengthRatio() },
    { name: 'Normalized Edit Distance', your: this.retrivedOutput.metrics.normEditDist, baseline: 2, explanation: this.help.getNormalizedEditDistance() },
    { name: 'TF-IDF Similarity', your: this.retrivedOutput.metrics.tfIdfSim, baseline: 0.9, explanation: this.help.getTFIDFSimilarity() }
  ]

  show(message: string) {
    alert(message)
  }

  async onSubmit(title: string, article: string) {
    console.log('submitted')
    // emotion and sentiment
    await this.restApi.getOutput(title, article).then((res) => {
      this.retrivedOutput.emotion = res.emotion
      this.retrivedOutput.sentiment = res.sentiment
      this.dataRetrived = true
    }).catch((err) => {
      console.error("Error fetching output:", err)
    })

    // metrics
    await this.restApi.predictNew(title, article).then((res) => {
      this.retrivedOutput.metrics = res.metrics
    })

    console.log("retrivedOutput:", this.retrivedOutput)

    this.comparisionMetris = [
      { name: 'Cosine Similarity', your: this.retrivedOutput.metrics.cosineSim, baseline: 0.9, explanation: this.help.getCosineSimilarity() },
      { name: 'Jaccard Bigrams', your: this.retrivedOutput.metrics.jaccardBigrams, baseline: 0.8, explanation: this.help.getJaccardSimilarityBigrams() },
      { name: 'Jaccard Words', your: this.retrivedOutput.metrics.jaccardWords, baseline: 0.7, explanation: this.help.getJaccardSimilarity() },
      { name: 'Length Difference', your: this.retrivedOutput.metrics.lenDif, baseline: 10, explanation: this.help.getLengthDifference() },
      { name: 'Length Ratio', your: this.retrivedOutput.metrics.lenRatio, baseline: 1.5, explanation: this.help.getLengthRatio() },
      { name: 'Normalized Edit Distance', your: this.retrivedOutput.metrics.normEditDist, baseline: 2, explanation: this.help.getNormalizedEditDistance() },
      { name: 'TF-IDF Similarity', your: this.retrivedOutput.metrics.tfIdfSim, baseline: 0.9, explanation: this.help.getTFIDFSimilarity() }
    ]

    this.plotGraphs()
  }

  plotGraphs() {
    const emotionData = this.converter.backendToKeyEmotion(this.retrivedOutput)
    const formattedData = emotionData.map(item => ({ name: item.key, value: item.value }))
    this.plotly.makeBarGraph(formattedData, 'Emotion Analysis', 'Emotion', 'Score', 'bar-graph')

    const sentiment = this.converter.backendToKeySentiment(this.retrivedOutput)
    const ssentimentFormatted = sentiment.map(item => ({ name: item.key, value: item.value }))
    this.plotly.makePieChart(ssentimentFormatted, 'Emotion Analysis', 'sentiment-pie')
  }
}
