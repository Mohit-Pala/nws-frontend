import { Component, inject } from '@angular/core';
import { Search } from '../../../models/search.model';
import { CommonModule } from '@angular/common';
import { PlotService } from '../../../services/plot.service';
import { KeyValueCustom } from '../../../models/key-value-custom.model';

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent {

  plotly = inject(PlotService)

  dataRetrived = false
  retrivedSearch: Search = {
    title: ['Sample Title'],
    emotion: {
      anger: 0.1,
      disgust: 0.2,
      fear: 0.3,
      joy: 0.4,
      sadness: 0.5,
      surprise: 0.6,
      neutral: 0.7
    },
    sentiment: {
      positive: 0.8,
      negative: 0.9,
      neutral: 1.0
    },
    model: {
      cosineSim: 0.95,
      jaccardBigrams: 0.85,
      jaccardWords: 0.75,
      lenDif: 10,
      lenRatio: 1.5,
      normEditDist: 2,
      tfIdfSim: 0.9
    },
    gemini: {
      facts: ['Fact1', 'Fact2'],
      source: ['Source1', 'Source2'],
      words: ['Word1', 'Word2']
    },
    gpt: {
      facts: ['Fact3', 'Fact4'],
      source: ['Source3', 'Source4'],
      words: ['Word3', 'Word4']
    }
  }



  updateData() {
    this.retrivedSearch.emotion = {
      anger: 0.1,
      disgust: 0.1,
      fear: 0.1,
      joy: 0.1,
      sadness: 0.1,
      surprise: 0.1,
      neutral: 0.4
    }

    const emotions: KeyValueCustom[] = [
      {name: 'Anger', value: this.retrivedSearch.emotion.anger},
      {name: 'Disgust', value: this.retrivedSearch.emotion.disgust},
      {name: 'Fear', value: this.retrivedSearch.emotion.fear},
      {name: 'Joy', value: this.retrivedSearch.emotion.joy},
      {name: 'Sadness', value: this.retrivedSearch.emotion.sadness},
      {name: 'Surprise', value: this.retrivedSearch.emotion.surprise},
      {name: 'Neutral', value: this.retrivedSearch.emotion.neutral}
    ]
    this.plotly.makeBarGraph(emotions, 'Emotion Analysis', 'Emotion', 'Value', 'emotions')
    this.dataRetrived = true
  }


}
