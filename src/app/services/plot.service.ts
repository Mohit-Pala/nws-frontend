import { Injectable } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Data } from 'plotly.js-dist-min';
import { KeyValueCustom } from '../models/key-value-custom.model';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor() { }

  rainbowColorScale = [
    'rgba(255, 0, 0, 1)',
    'rgba(255, 165, 0, 1)',
    'rgba(255, 255, 0, 1)',
    'rgba(0, 255, 0, 1)',
    'rgba(0, 0, 255, 1)',
    'rgba(75, 0, 130, 1)',
    'rgba(238, 130, 238, 1)'
  ]

  emotionColorScale = [

  ]

  makeBarGraph(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.value),
      type: 'bar',
      marker: {
        color: this.rainbowColorScale
      }
    }]

    const layout = {
      title: title,
      xaxis: { title: xAxisLabel },
      yaxis: { title: yAxisLabel }
    }

    Plotly.newPlot(domId, trace, layout)
  }

}
