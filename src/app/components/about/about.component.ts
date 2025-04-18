import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {

  // version by weeks i think 

  projectName: string = 'News Analyzer'

  version = '0.7.0'

  githubPage = 'https://github.com/Mohit-Pala/nws-frontend'

  contributors = [
    { name: 'Mohit Pala', github: 'https://github.com/mohit-pala' },
    { name: 'Rachel King', github: 'https://github.com/rachelking12' },
  ]

  frontend = [
    { name: 'Angular', link: 'https://angular.io/' },
    { name: 'Plotly', link: 'https://plotly.com/javascript/' },
    { name: 'Tailwind', link: 'https://tailwindcss.com/' },
    { name: 'Firebase', link: 'https://firebase.google.com/' },
  ]

  backend = [
    // Python
    { name: 'Flask', link: 'https://flask.palletsprojects.com/en/stable/' },
    { name: 'Pytorch', link: 'https://pytorch.org/' },
    { name: 'Hugging Face Transformers', link: 'https://huggingface.co/' },

    // Web 
    { name: 'Vertex AI', link: 'https://cloud.google.com/vertex-ai' },
    { name: 'OpenAI', link: 'https://openai.com/' },
    { name: 'Google Cloud', link: 'https://cloud.google.com/' },
    { name: 'Firestore Database', link: 'https://firebase.google.com/docs/firestore' },
  ]

  modelsUsed = [
    'Sentiment Analysis',
    'Emotion Analysis',
    'GPT-3',
    'Gemini',
  ]

  devDetails = {
    madeFor: 'Capstone Project, Appalachian State University, Computer Science',
    madeBy: 'Mohit Pala, Rachel King',
    startDate: 'Feb 2025',
    endDate: 'April 2025',
  }

  theme = {
    light: 'Rosepine Dawn',
    dark: 'Rosepine'
  }
}
