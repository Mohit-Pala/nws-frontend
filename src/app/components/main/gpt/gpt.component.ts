import { Component } from '@angular/core';
import { GenAiOutput } from '../../../models/gen-ai-output.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gpt',
  imports: [CommonModule],
  templateUrl: './gpt.component.html',
  styleUrl: './gpt.component.css'
})
export class GptComponent {
  dummyData: GenAiOutput = {
    facts: [
      'This is a fact',
      'This is another fact',
      'This is a third fact'
    ],
    sources: [
      'This is a source',
      'This is another source',
      'This is a third source'
    ],
    keywords: [
      'This is a keyword',
      'This is another keyword',
      'This is a third keyword'
    ]
  }
}
