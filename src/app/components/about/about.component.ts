import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-about',
  imports: [CommonModule, FormsModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  selectedType: string = 'All'
  types: string[] = ['All', 'API', 'Dataset', 'Docs']

  getSortedSources() {
    if (this.selectedType === 'All') {
      return this.sourcesUsed
    }
    return this.sourcesUsed.filter(source => source.type === this.selectedType)
  }


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

  sourcesUsed = [
    { name: 'ISOT Fake News dataset', link: 'https://onlineacademiccommunity.uvic.ca/isot/2022/11/27/fake-news-detection-datasets/', type: 'Dataset' },
    { name: 'Firestore Docs', link: 'https://firebase.google.com/docs/firestore/', type: 'Docs' },
    { name: 'Free Tier: Install Flask on an Ubuntu VM', link: 'https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/flask-on-ubuntu/01oci-ubuntu-flask-summary.htm', type: 'Docs' },
    { name: '5-Day Gen AI Intensive Course with Google Learn Guide', link: 'https://www.kaggle.com/learn-guide/5-day-genai', type: 'Docs' },
    { name: 'Open AI API', link: 'https://openai.com/api/', type: 'API' },
    { name: 'Google Cloud Vertex AI', link: 'https://cloud.google.com/vertex-ai/docs/generative-ai/overview', type: 'API' },
    { name: 'Flask Quickstart', link: 'https://flask.palletsprojects.com/en/stable/quickstart/', type: 'Docs' },
    { name: 'Angular Docs', link: 'https://angular.dev/overview', type: 'Docs' },
	{ name: 'Flask-CORS Docs', link: 'https://flask-cors.readthedocs.io/en/latest/', type: 'Docs' },
	{ name: 'Scikit-learn Docs', link: 'https://scikit-learn.org/stable/user_guide.html', type: 'Docs' },
	{ name: 'PyTorch Docs', link: 'https://pytorch.org/docs/stable/index.html', type: 'Docs' },
	{ name: 'NLTK Docs', link: 'https://www.nltk.org/', type: 'Docs' },
	{ name: 'Plotly Docs', link: 'https://plotly.com/python/', type: 'Docs' },
  ]

  llmPrompts = [
    { llm: 'Claude Sonet', roughPrompt: 'Copy about page CSS to all components under main page', task: 'css', platform: 'Cline' },
    { llm: 'Claude Sonet', roughPrompt: 'Copy about page CSS to help page', task: 'css', platform: 'Cline' },
    { llm: 'Copilot', roughPrompt: 'Debug firewall issued and SELinux on Oracle Linux Server', task: 'cloud', platform: 'MS Copilot' },
  ]
}
