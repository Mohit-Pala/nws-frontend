import { Component, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { PlotService } from '../../../services/plot.service';
import { CommonModule } from '@angular/common';
import { KeyValueCustom } from '../../../models/key-value-custom.model';
import { ComparisonMetric } from '../../../models/comparison-metric.model';
import { RestApiService } from '../../../services/rest-api.service';
import { ConverterService } from '../../../services/converter.service';
import { BackendOutput } from '../../../models/backedn-output.model';
import { HelpService } from '../../../services/help.service';
import { BaselineOutput } from '../../../models/baseline.model';

const baselines = new BaselineOutput();
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

  baseline: any = {
    cosineSim: 0.7919469343423844,
    jaccardWords: 0.035230973085365005,
    jaccardBigrams: 0.007854583366040075,
    tfIdfSim: 0.19162804064123354,
    normEditDist: 0.03616429257168752,
    lenDif: 2736.466,
    lenRatio: 0.03778615810327395
  };

  comparisionMetris: ComparisonMetric[] = []

  show(message: string) {
    alert(message)
  }

  removePunctuation(text: string): string {
    const cleanedText = text.replace(/[^\w\s]|_/g, "");
    
    const words = cleanedText.split(/\s+/);
    const first500Words = words.slice(0, 500);
    
    return first500Words.join(' ');
  }

  async onSubmit(title: string, article: string) {
    console.log('submitted')
    
    const cleanedTitle = this.removePunctuation(title)
    const cleanedArticle = this.removePunctuation(article)


    await this.restApi.getOutput(cleanedTitle, cleanedArticle).then((res) => {
      this.retrivedOutput.emotion = res.emotion
      this.retrivedOutput.sentiment = res.sentiment
      this.dataRetrived = true
    }).catch((err) => {
      console.error("Error fetching output:", err)
    })

    // metrics
    await this.restApi.predictNew(cleanedTitle, cleanedArticle).then((res) => {
      this.retrivedOutput.metrics = res.metrics
    })

    console.log("retrivedOutput:", this.retrivedOutput)

    this.comparisionMetris = [
      { name: 'Cosine Similarity', your: this.retrivedOutput.metrics.cosineSim, baseline: baselines.cosineSim, explanation: this.help.getCosineSimilarity() },
      { name: 'Jaccard Bigrams', your: this.retrivedOutput.metrics.jaccardBigrams, baseline: baselines.jaccardBigrams, explanation: this.help.getJaccardSimilarityBigrams() },
      { name: 'Jaccard Words', your: this.retrivedOutput.metrics.jaccardWords, baseline: baselines.jaccardWords, explanation: this.help.getJaccardSimilarity() },
      { name: 'Length Difference', your: this.retrivedOutput.metrics.lenDif, baseline: baselines.lenDif, explanation: this.help.getLengthDifference() },
      { name: 'Length Ratio', your: this.retrivedOutput.metrics.lenRatio, baseline: baselines.lenRatio, explanation: this.help.getLengthRatio() },
      { name: 'Normalized Edit Distance', your: this.retrivedOutput.metrics.normEditDist, baseline: baselines.normEditDist, explanation: this.help.getNormalizedEditDistance() },
      { name: 'TF-IDF Similarity', your: this.retrivedOutput.metrics.tfIdfSim, baseline: baselines.tfIdfSim, explanation: this.help.getTFIDFSimilarity() }
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

    // this.plotly.makeBubbleChart(this.comparisionMetris, 'Metrics Analysis', 'metrics-bubble')
    // this.plotly.makeBoxPlot(this.comparisionMetris, 'Metrics Distribution', 'metrics-box')
  }
}
