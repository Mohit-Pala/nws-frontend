import { Component, inject, ViewChild } from '@angular/core';
import { ModelComponent } from "./model/model.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VertexAiService } from '../../services/vertex-ai.service';
import { GptService } from '../../services/gpt.service';
import { GeminiComponent } from "./gemini/gemini.component";
import { GptComponent } from "./gpt/gpt.component";
import { SentimentModelComponent } from './sentiment-model/sentiment-model.component';
import { RestApiService } from '../../services/rest-api.service';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ModelComponent, CommonModule, FormsModule, GeminiComponent, GptComponent, SentimentModelComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  restApi = inject(RestApiService)
  tmpReturn = ''

  @ViewChild(GptComponent) gptComponent!: GptComponent
  @ViewChild(GeminiComponent) geminiComponent!: GeminiComponent

  title!: string
  article!: string

  onSubmit(form: NgForm) {
    console.log(this.title)
    console.log(this.article)

    // this.gptComponent.generateGPTContent(this.title, this.article)
    // this.geminiComponent.generateGeminiContent(this.title, this.article)

    this.restApi.getOutput(this.title, this.article).then((response) => {
      this.tmpReturn = response
      console.log(response)
    }).catch((error) => {
      console.log(error)
    })
  }
}