import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Emotions } from '../../../models/emotions.model';

@Component({
  selector: 'app-model',
  imports: [CommonModule],
  templateUrl: './model.component.html',
  styleUrl: './model.component.css'
})
export class ModelComponent {
  dummy_emotions: Emotions = {
    anger: 0.1,
    disgust: 0.2,
    fear: 0.1,
    joy: 0.2,
    sadness: 0.1,
    surprise: 0.1,
    neutral: 0.2
  }
}
