import { ModelComponent } from "./model/model.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, inject, ViewChild } from '@angular/core';
import { GptComponent } from "./gpt/gpt.component";
import { SentimentModelComponent } from './sentiment-model/sentiment-model.component';
import { RestApiService } from '../../services/rest-api.service';
import { BackendOutput } from "../../models/backedn-output.model";
import { Search } from "../../models/search.model";
import { FirestoreService } from "../../services/firestore.service";
import { removeStopwords } from "stopword";
import { LoadingComponent } from "../loading/loading.component";
import { Router } from "@angular/router";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ModelComponent, CommonModule, FormsModule, GptComponent, LoadingComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  restApi = inject(RestApiService);
  apiData: BackendOutput | null = null; // Data to be passed to ModelComponent
  showSentimentModel: boolean = false;
  firestoreService = inject(FirestoreService)
  router = inject(Router)


  @ViewChild(GptComponent) gptComponent!: GptComponent
  @ViewChild(ModelComponent) modelComponent!: ModelComponent

  title!: string;
  article!: string;

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


    if (this.title === '' || this.article === '' || this.title === undefined || this.article === undefined) {
      alert('Title or article is empty')
      return
    }

    this.firestoreService.putData(this.sendToDb).then(() => {
      console.log('Data sent to Firestore')
      this.router.navigate(['/search'])
    }).catch(() => {
      console.error()
    })
  }

  reload() {
    window.location.reload()
  }
}
