import { Injectable } from '@angular/core';
import * as Plotly from 'plotly.js-dist-min';
import { Data } from 'plotly.js-dist-min';
import { KeyValueCustom } from '../models/key-value-custom.model';
import { ComparisonMetric } from '../models/comparison-metric.model';

@Injectable({
  providedIn: 'root'
})
export class PlotService {

  constructor() { }

  emotionColorScale = [
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

  makeBarGraph(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.value),
      type: 'bar',
      marker: {
        color: this.emotionColorScale
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

  makeHorizontalBarGraph(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      y: data.map(e => e.name),
      x: data.map(e => e.value),
      type: 'bar',
      orientation: 'h',
      marker: {
        color: this.emotionColorScale
      }
    }]

    const layout = {
      title: title,
      xaxis: { title: xAxisLabel },
      yaxis: { title: yAxisLabel }
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeLineChart(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.value),
      type: 'scatter',
      mode: 'lines+markers',
      marker: {
        color: "blue"
      },
      line: {
        color: "blue"
      }
    }]

    const layout = {
      title: title,
      xaxis: { title: xAxisLabel },
      yaxis: { title: yAxisLabel }
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeAreaChart(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.value),
      type: 'scatter',
      mode: 'lines',
      fill: 'tozeroy',
      marker: {
        color: "blue"
      },
      line: {
        color: "blue"
      }
    }]

    const layout = {
      title: title,
      xaxis: { title: xAxisLabel },
      yaxis: { title: yAxisLabel }
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeScatterPlot(data: KeyValueCustom[], title: string, xAxisLabel: string, yAxisLabel: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.value),
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: "blue",
        size: 10
      }
    }]

    const layout = {
      title: title,
      xaxis: { title: xAxisLabel },
      yaxis: { title: yAxisLabel }
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeRadarChart(data: KeyValueCustom[], title: string, domId: string) {
    const trace: Data[] = [{
      type: 'scatterpolar',
      r: data.map(e => e.value),
      theta: data.map(e => e.name),
      fill: 'toself',
      name: 'Similarity Metrics',
      marker: {
        color: "blue"
      },
      line: {
        color: "blue"
      }
    }]

    const layout = {
      title: title,
      polar: {
        radialaxis: {
          visible: true,
          range: [0, 1]
        }
      },
      width: 800,
      height: 600
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeGaugeChart(value: number, title: string, metric: string, domId: string) {
    const percentValue = value * 100

    const trace: Data[] = [{
      type: 'indicator',
      mode: 'gauge+number',
      value: percentValue,
      title: { text: metric, font: { size: 18 } },
      gauge: {
        axis: {
          range: [0, 100],
          tickwidth: 1,
          tickcolor: 'darkblue'
        },
        bar: { color: 'rgba(50, 120, 200, 0.85)' },
        bgcolor: 'white',
        borderwidth: 2,
        bordercolor: 'gray',
        steps: [
          { range: [0, 40], color: 'red' },
          { range: [40, 75], color: 'darkorange' },
          { range: [75, 100], color: 'lightgreen' }
        ],
        threshold: {
          line: { color: 'red', width: 4 },
          thickness: 0.75,
          value: 90
        }
      }
    }]

    const layout = {
      title: title,
      width: 400,
      height: 300,
      margin: { t: 40, r: 25, l: 25, b: 25 }
    }

    Plotly.newPlot(domId, trace, layout)
  }

  makeBubbleChart(data: ComparisonMetric[], title: string, domId: string) {
    const trace: Data[] = [{
      x: data.map(e => e.name),
      y: data.map(e => e.your),
      mode: 'markers',
      marker: {
        size: data.map(e => e.baseline * 20), 
        colorscale: 'Viridis',
        showscale: true
      },
      type: 'scatter',
      text: data.map(e => `Baseline: ${e.baseline}<br>Your Score: ${e.your}`),
      hoverinfo: 'text'
    }];

    const layout = {
      title: title,
      xaxis: { title: 'Metrics' },
      yaxis: { title: 'Your Score' },
      width: 800,
      height: 600
    };

    Plotly.newPlot(domId, trace, layout);
  }

  makeBoxPlot(data: ComparisonMetric[], title: string, domId: string) {
    const traces: Data[] = [];
    
    traces.push({
      y: data.map(e => e.your),
      type: 'box',
      name: 'Your Scores',
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8
    });

    traces.push({
      y: data.map(e => e.baseline),
      type: 'box',
      name: 'Baselines',
      boxpoints: 'all',
      jitter: 0.3,
      pointpos: -1.8
    });

    const layout = {
      title: title,
      yaxis: { title: 'Score' },
      width: 800,
      height: 600,
      boxmode: 'group' as const
    };

    Plotly.newPlot(domId, traces, layout);
  }
}
