import * as Plotly from 'plotly.js-dist-min';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sentiment-model',
  templateUrl: './sentiment-model.component.html',
  styleUrls: ['./sentiment-model.component.css']
})
export class SentimentModelComponent implements OnInit {

  ngOnInit() {
    const sentimentData = [
      { label: 'Positive', score: 0.9 },
      { label: 'Neutral', score: 0.05 },
      { label: 'Negative', score: 0.05 }
    ];

    const color_map = {
      'Negative': 'red',
      'Neutral': 'gray',
      'Positive': '#00FF00'
    };

    const data: Partial<Plotly.PieData>[] = [{
      labels: sentimentData.map(item => item.label),
      values: sentimentData.map(item => item.score),
      type: 'pie' as const, 
      marker: {
        colors: sentimentData.map(item => color_map[item.label as keyof typeof color_map])
      }
    }];

    const layout = {
      title: 'Sentiment Analysis',
      width: 800
    };

    Plotly.newPlot('sentiment-graph', data, layout);
  }
}
