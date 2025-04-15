import { ModelComponent } from "./model/model.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, inject, ViewChild } from '@angular/core';
import { GeminiComponent } from "./gemini/gemini.component";
import { GptComponent } from "./gpt/gpt.component";
import { SentimentModelComponent } from './sentiment-model/sentiment-model.component';
import { RestApiService } from '../../services/rest-api.service';
import { BackendOutput } from "../../models/backedn-output.model";
import { Search } from "../../models/search.model";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ModelComponent, CommonModule, FormsModule, GeminiComponent, GptComponent, SentimentModelComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {
  restApi = inject(RestApiService);
  apiData: BackendOutput | null = null; // Data to be passed to ModelComponent
  showSentimentModel: boolean = false;

  @ViewChild(GptComponent) gptComponent!: GptComponent
  @ViewChild(GeminiComponent) geminiComponent!: GeminiComponent
  @ViewChild(ModelComponent) modelComponent!: ModelComponent

  title!: string;
  article!: string;

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
    gemini: {
      facts: [],
      source: [],
      words: []
    },
    gpt: {
      facts: [],
      source: [],
      words: []
    }
  }

  async onSubmit(form: NgForm) {
    // if (!this.title || !this.article) {
    //   console.log("Title and article are required!");
    //   return;
    // }

    // console.log("Submitting data:", { title: this.title, article: this.article });

    // Call /submit to get sentiment and emotion data
    // this.restApi.getOutput(this.title, this.article)
    //   .then((submitResponse: BackendOutput) => {
    //     console.log("Submit Response received:", submitResponse);

    //     // Call /predict to get similarity data
    //     this.restApi.predict(this.title, this.article).subscribe({
    //       next: (predictResponse: any) => {
    //         console.log("Predict Response received:", predictResponse);
    //         // Combine the data from both responses
    //         this.apiData = { ...submitResponse, ...predictResponse };
    //         console.log("apiData updated:", this.apiData);
    //       },
    //       error: (error) => {
    //         console.error("Predict Error:", error);
    //       }
    //     });
    //   })
    //   .catch((error) => {
    //     console.error("Submit Error:", error);
    //   });
    await this.modelComponent.onSubmit(this.title, this.article)
    await this.geminiComponent.generateGeminiContent(this.title, this.article).then(() => {}).catch(() => {})
    await this.gptComponent.generateGPTContent(this.title, this.article)

    console.log('after everything, hopefully')
  }
}
