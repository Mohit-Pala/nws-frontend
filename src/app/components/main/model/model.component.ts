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

  ngOnInit() {
    this.plotly.makeBarGraph(this.dummy_emotions, 'Bar Graph', 'Categories', 'Values', 'bar-graph')
  }
}
