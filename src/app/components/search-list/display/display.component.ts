import { Component, inject, OnInit } from '@angular/core';
import { Search } from '../../../models/search.model';
import { CommonModule } from '@angular/common';
import { PlotService } from '../../../services/plot.service';
import { KeyValueCustom } from '../../../models/key-value-custom.model';
import { ConverterService } from '../../../services/converter.service';
import { HelpService } from '../../../services/help.service';
import { ActivatedRoute } from '@angular/router';
import { FirestoreService } from '../../../services/firestore.service';

@Component({
  selector: 'app-display',
  imports: [CommonModule],
  templateUrl: './display.component.html',
  styleUrl: './display.component.css'
})
export class DisplayComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) { }

  plotly = inject(PlotService)
  converter = inject(ConverterService)
  help = inject(HelpService)
  firestore = inject(FirestoreService)

  dataRetrived = false
  retrivedSearch: Search = {
    title: ['Sample Title'],
    emotion: {
      anger: 0.1,
      disgust: 0.3,
      fear: 0.3,
      joy: 0.4,
      sadness: 0.5,
      surprise: 0.6,
      neutral: 0.7
    },
    sentiment: {
      positive: 0.1,
      negative: 0.8,
      neutral: 0.1
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

  comparisionMetris = [
    { name: 'Cosine Similarity', your: this.retrivedSearch.model.cosineSim, baseline: 0.9, explanation: this.help.getCosineSimilarity() },
    { name: 'Jaccard Bigrams', your: this.retrivedSearch.model.jaccardBigrams, baseline: 0.8, explanation: this.help.getJaccardSimilarityBigrams() },
    { name: 'Jaccard Words', your: this.retrivedSearch.model.jaccardWords, baseline: 0.7, explanation: this.help.getJaccardSimilarity() },
    { name: 'Length Difference', your: this.retrivedSearch.model.lenDif, baseline: 10, explanation: this.help.getLengthDifference() },
    { name: 'Length Ratio', your: this.retrivedSearch.model.lenRatio, baseline: 1.5, explanation: this.help.getLengthRatio() },
    { name: 'Normalized Edit Distance', your: this.retrivedSearch.model.normEditDist, baseline: 2, explanation: this.help.getNormalizedEditDistance() },
    { name: 'TF-IDF Similarity', your: this.retrivedSearch.model.tfIdfSim, baseline: 0.9, explanation: this.help.getTFIDFSimilarity() }
  ]

  updateData() {
    this.comparisionMetris = [
      { name: 'Cosine Similarity', your: this.retrivedSearch.model.cosineSim, baseline: 0.9, explanation: this.help.getCosineSimilarity() },
      { name: 'Jaccard Bigrams', your: this.retrivedSearch.model.jaccardBigrams, baseline: 0.8, explanation: this.help.getJaccardSimilarityBigrams() },
      { name: 'Jaccard Words', your: this.retrivedSearch.model.jaccardWords, baseline: 0.7, explanation: this.help.getJaccardSimilarity() },
      { name: 'Length Difference', your: this.retrivedSearch.model.lenDif, baseline: 10, explanation: this.help.getLengthDifference() },
      { name: 'Length Ratio', your: this.retrivedSearch.model.lenRatio, baseline: 1.5, explanation: this.help.getLengthRatio() },
      { name: 'Normalized Edit Distance', your: this.retrivedSearch.model.normEditDist, baseline: 2, explanation: this.help.getNormalizedEditDistance() },
      { name: 'TF-IDF Similarity', your: this.retrivedSearch.model.tfIdfSim, baseline: 0.9, explanation: this.help.getTFIDFSimilarity() }
    ]
  }

  plotGraphs() {
    const emotionData = this.converter.searchToKeyEmotion(this.retrivedSearch)
    const formattedData = emotionData.map(item => ({ name: item.key, value: item.value }))
    this.plotly.makeBarGraph(formattedData, 'Emotion Analysis', 'Emotion', 'Score', 'emotions')

    const sentiment = this.converter.searchToKeySentiment(this.retrivedSearch)
    const ssentimentFormatted = sentiment.map(item => ({ name: item.key, value: item.value }))
    this.plotly.makePieChart(ssentimentFormatted, 'Emotion Analysis', 'sentiments')
  }


  test() {
    console.log(this.converter.searchToKeyEmotion(this.retrivedSearch))
    console.log(this.converter.searchToKeySentiment(this.retrivedSearch))
  }

  show(stuff: string) {
    alert(stuff)
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id')
      console.log(id)

      if (!id) {
        return
      }

      this.firestore.getDataById(id).then((res) => {
        console.log(res)
        if (!res) {
          return
        }
        this.retrivedSearch = res
        this.updateData()
        this.plotGraphs()
      })


    })
  }
}
