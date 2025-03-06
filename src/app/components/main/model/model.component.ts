import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emotions } from '../../../models/emotions.model';

import { Color, NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-model',
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  d2ummy_emotions: Emotions = {
    anger: 0.1,
    disgust: 0.2,
    fear: 0.1,
    joy: 0.2,
    sadness: 0.1,
    surprise: 0.1,
    neutral: 0.2
  }

  view: [number, number] = [window.innerWidth, window.innerHeight / 3];

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

  colorScheme: Color = {
    name: 'myScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['RED', 'BLUE', '#C7B42C', '#AAAAAA']
  };


  multi: any[] = [];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  onSelect(event: any) {
    console.log(event);
  }
}
