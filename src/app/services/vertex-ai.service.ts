import { inject, Injectable } from '@angular/core';
import { getGenerativeModel, ModelParams, VertexAI } from '@angular/fire/vertexai';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class VertexAiService {

  constructor() { }

  auth = inject(AuthService)
  gemini = inject(VertexAI)

  systemIns = `
    You are a fake news awareness bot, you may get a real news article or a fake one
    Only provide 3 realted sources 
    keep list to 3 items
    Make sure to format as JSON, only reply with answer, no """json answer"""
    Reply in the following format
    facts:{LIST OF FACTS, YES USE square braces}
    source: {LIST OF SOURCES, YES USE square braces, No urls}
    words:{LIST OF WORDS, YES USE square braces}
  `

  geminiModelParams: ModelParams = {
    model: 'gemini-1.5-flash',
    systemInstruction: this.systemIns
  }

  geminiModel = getGenerativeModel(this.gemini, this.geminiModelParams)

  async testGem() {
    console.log('fake')
    const prompt = "The sun will explode in 2026 after humans put a dyson sphere on the sun"
    const result = await this.geminiModel.generateContent(prompt)
    const response = result.response
    const text = response.text()
    console.log(text)
    const parsed = JSON.parse(text)
    console.log(parsed)
    return parsed
  }
}
