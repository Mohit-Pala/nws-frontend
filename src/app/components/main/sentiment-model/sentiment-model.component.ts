import * as Plotly from 'plotly.js-dist-min';
import { Component, OnInit } from '@angular/core';
import { tickFormat } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-sentiment-model',
  templateUrl: './sentiment-model.component.html',
  styleUrls: ['./sentiment-model.component.css']
})
export class SentimentModelComponent implements OnInit {

  ngOnInit() {
    const sentimentData = [
      { label: 'positive', score: 0.9 },
    ];

    const color_map = {
      'negative': 'red',
      'neutral': 'gray',
      'positive': '#00FF00'
    };

    const data = sentimentData.map(item => ({
      x: [item.label],
      y: [item.score],
      type: 'bar' as const,
      name: item.label,
      marker: {
        color: color_map[item.label as keyof typeof color_map]
      }
    }));

    const layout = {
      title: 'Sentiment Analysis',
      xaxis: { title: 'Sentiment' },
      yaxis: { title: 'Score',
		   range: [0, 1],
		   tickformat: '.0%'
	   },
	   width: 800
    };
    Plotly.newPlot('sentiment-graph', data, layout);
  }
}
