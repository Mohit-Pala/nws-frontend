import { ModelComponent } from "./model/model.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { VertexAiService } from '../../services/vertex-ai.service';
import { GptService } from '../../services/gpt.service';
import { FirestoreService } from '../../services/firestore.service';
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
  restApi = inject(RestApiService);
  apiData: any; // Data to be passed to ModelComponent
  showSentimentModel: boolean = false; // Add this line


  firestoreService = inject(FirestoreService)
  @ViewChild(GptComponent) gptComponent!: GptComponent
  @ViewChild(GeminiComponent) geminiComponent!: GeminiComponent


  title!: string;
  article!: string;


  onSubmit(form: NgForm) {
    if (!this.title || !this.article) {
      console.log("Title and article are required!");
      return;
    }

    console.log("Submitting data:", { title: this.title, article: this.article }); // Log the data being sent

    this.restApi.getOutput(this.title, this.article)
      .then((response: any) => {
        this.apiData = response; // Assign the response to apiData
        console.log("Response received:", response); // Log the response
        console.log("apiData updated:", this.apiData); // Log apiData after update
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
}
