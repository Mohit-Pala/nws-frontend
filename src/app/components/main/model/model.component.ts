import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emotions } from '../../../models/emotions.model';

import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

import * as Plotly from 'plotly.js-dist-min';
import { Data } from 'plotly.js-dist-min';
import { PlotService } from '../../../services/plot.service';
import { KeyValueCustom } from '../../../models/key-value-custom.model';

@Component({
  selector: 'app-model',
  imports: [CommonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent implements OnInit {

  plotly = inject(PlotService)

  dummy_emotions = [
    {
      name: "anger",
      value: 0.1
    },
    {
      name: "disgust",
      value: 0.2
    },
    {
      name: "fear",
      value: 0.1
    },
    {
      name: "joy",
      value: 0.2
    },
    {
      name: "sadness",
      value: 0.1
    },
    {
      name: "surprise",
      value: 0.1
    },
    {
      name: "neutral",
      value: 0.2
    }
  ]

  sentimentData = [
    {
      name: 'Positive',
      value: 0.9
    },
    {
      name: 'Neutral',
      value: 0.05
    },
    {
      name: 'Negative',
      value: 0.05
    }
  ]

  similarityData = [
    { name: 'Cosine Similarity', value: 0.85 }, // higher is better
    { name: 'TF-IDF Similarity', value: 0.72 }, // higher is better
    { name: 'Jaccard (Words)', value: 0.45 }, // higher is better
    { name: 'Jaccard (Bigrams)', value: 0.32 }, // higher is better
    { name: 'Normalized Edit Distance', value: 0.28 } // lower is better
  ]

  guageSimilarity: number = 0.85

  ngOnInit() {
    this.plotly.makeBarGraph(this.dummy_emotions, 'Bar Graph', 'Categories', 'Values', 'bar-graph')
    this.plotly.makePieChart(this.sentimentData, 'Sentiment Analysis', 'sentiment-pie')
    this.plotly.makeRadarChart(this.similarityData, 'Similarity Analysis', 'similarity-radar')
    this.plotly.makeGaugeChart(this.guageSimilarity, 'Text Similarity', 'Cosine Similarity', 'similarity-gauge')
  }
}
