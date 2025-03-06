import { Component, inject } from '@angular/core';
import { ModelComponent } from "./model/model.component";
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { VertexAiService } from '../../services/vertex-ai.service';
import { GptService } from '../../services/gpt.service';
import { GeminiComponent } from "./gemini/gemini.component";
import { GptComponent } from "./gpt/gpt.component";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [ModelComponent, CommonModule, FormsModule, GeminiComponent, GptComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})

export class MainComponent {

  title!: string
  article!: string

  onSubmit(form: NgForm) {

  }


}
