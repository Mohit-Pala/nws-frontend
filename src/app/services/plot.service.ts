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
    'red',
    'darkgreen',
    'purple',
    'orange',
    'gray',
    'blue',
    'pink'
  ]

  sentiment_color_map = [
    '#00FF00',
    'gray',
    'red',
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

  makePieChart(data: KeyValueCustom[], title: string, domId: string) {
    const trace: Data[] = [{
      labels: data.map(e => e.name),
      values: data.map(e => e.value),
      type: 'pie',
      marker: {
        colors: this.sentiment_color_map
      }
    }]

    const layout = {
      title: title,
      width: 800
    }

    Plotly.newPlot(domId, trace, layout)
  }

}
