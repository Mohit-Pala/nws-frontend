import { Component, inject, OnInit } from '@angular/core';
import { GenAiOutput } from '../../../models/gen-ai-output.model';
import { CommonModule } from '@angular/common';
import { GptService } from '../../../services/gpt.service';

@Component({
  selector: 'app-gpt',
  imports: [CommonModule],
  templateUrl: './gpt.component.html',
  styleUrl: './gpt.component.css'
})
export class GptComponent implements OnInit {

  gpt = inject(GptService)

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

  async generateGPTContent(title: string, article: string) {
    await this.gpt.getGptContent(title).then((parsed) => {
      if(parsed){
        this.dummyData = parsed
      }
    })
  }
}
