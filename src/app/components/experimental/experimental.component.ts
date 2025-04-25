import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RestApiService } from '../../services/rest-api.service';
import { removeStopwords } from 'stopword';
import { BackendOutput } from '../../models/backedn-output.model';
import { Search } from '../../models/search.model';
import { FirestoreService } from '../../services/firestore.service';
import { GptComponent } from '../main/gpt/gpt.component';
import { ModelComponent } from '../main/model/model.component';
import { LoadingComponent } from "../loading/loading.component";

@Component({
  selector: 'app-experimental',
  imports: [CommonModule, FormsModule, GptComponent, ModelComponent, LoadingComponent],
  templateUrl: './experimental.component.html',
  styleUrl: './experimental.component.css'
})
export class ExperimentalComponent {


  restApi = inject(RestApiService);
  apiData: BackendOutput | null = null; // Data to be passed to ModelComponent
  showSentimentModel: boolean = false;
  firestoreService = inject(FirestoreService)


  @ViewChild(GptComponent) gptComponent!: GptComponent
  @ViewChild(ModelComponent) modelComponent!: ModelComponent

  title!: string;
  article!: string;
  url = ''

  wordCloudSource = `https://quickchart.io/wordcloud?text=${this.article}`

  submitted = false
  currentlyLoading = {
    model: true,
    gpt: true
  }

  sendToDb: Search = {
    title: [],
    emotion: {
      anger: 0,
      disgust: 0,
      fear: 0,
      joy: 0,
      sadness: 0,
      surprise: 0,
      neutral: 0
    },
    sentiment: {
      positive: 0,
      negative: 0,
      neutral: 0
    },
    model: {
      cosineSim: 0,
      jaccardBigrams: 0,
      jaccardWords: 0,
      lenDif: 0,
      lenRatio: 0,
      normEditDist: 0,
      tfIdfSim: 0
    },
    gpt: {
      facts: [],
      source: [],
      words: []
    }
  }


  async onSubmit(form: NgForm) {

    this.submitted = true

    await this.restApi.scrapeArticle(this.url).then((res) => {
      console.log(res)
      this.title = res.content.title
      this.article = res.content.article
    }).catch((err) => {
      console.log(err)
    })

    const newArticle = removeStopwords(this.article.split(' ')).join(' ')
    console.log(newArticle)

    this.wordCloudSource = `https://quickchart.io/wordcloud?text=${newArticle}`

    await this.modelComponent.onSubmit(this.title, this.article).then(() => {
      console.log('Model content generated')
      this.currentlyLoading.model = false
    }).catch((err) => {
      console.error(err)
      this.currentlyLoading.model = false
    }).finally(() => {
      this.currentlyLoading.model = false
    })

    await this.gptComponent.generateGPTContent(this.title, this.article).then(() => {
      console.log('GPT content generated')
      this.currentlyLoading.gpt = false
    }).catch((err) => {
      console.error(err)
      this.currentlyLoading.gpt = false
    }).finally(() => {
      this.currentlyLoading.gpt = false
    })

    console.log('after everything, hopefully')
    // title is working
    this.sendToDb.title = this.title.split(' ')
    this.sendToDb.emotion = this.modelComponent.retrivedOutput.emotion
    this.sendToDb.sentiment = this.modelComponent.retrivedOutput.sentiment
    this.sendToDb.model = this.modelComponent.retrivedOutput.metrics
    this.sendToDb.gpt = this.gptComponent.dummyData
    console.log(this.sendToDb)
  }

  putInDatabase() {
    this.firestoreService.putData(this.sendToDb).then(() => {
      console.log('Data sent to Firestore')
    }).catch(() => {
      console.error()
    })
  }

  reload() {
    window.location.reload()
  }
}
