import { Component, inject, OnInit } from '@angular/core';
import { GenAiOutput } from '../../../models/gen-ai-output.model';
import { CommonModule } from '@angular/common';
import { VertexAiService } from '../../../services/vertex-ai.service';

@Component({
  selector: 'app-gemini',
  imports: [CommonModule],
  templateUrl: './gemini.component.html',
  styleUrl: './gemini.component.css'
})
export class GeminiComponent implements OnInit {

  gemini = inject(VertexAiService)

  dummyData: GenAiOutput = {
    facts: [
      'This is a fact',
      'This is another fact',
      'This is a third fact'
    ],
    source: [
      'This is a source',
      'This is another source',
      'This is a third source'
    ],
    words: [
      'This is a keyword',
      'This is another keyword',
      'This is a third keyword'
    ]
  }

  ngOnInit() {

  }

  onSubmitPressed() {
    this.gemini.testGem().then((parsed) => {
      this.dummyData = parsed
    })
  }

  async generateGeminiContent(title: string, article: string) {
    await this.gemini.getGeminiContent(title).then((parsed) => {
      if(parsed){
        this.dummyData = parsed
      }
    })
  }
}
