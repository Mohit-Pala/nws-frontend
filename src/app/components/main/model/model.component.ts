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
export class ModelComponent {
  @Input() apiData: BackendOutput | null = null;

  plotly = inject(PlotService);

  emotions: any[] = [];
  sentimentData: any[] = [];
  similarityData: KeyValueCustom[] = [];

  constructor() { }

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
