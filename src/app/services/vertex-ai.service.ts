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
    DONT SAY SOMETHING IS FAKE, ONLY PROVIDE FACTS AND LET THE USER DECIDE
    Only provide 3 realted sources 
    keep ALL lists to 3 items ONLY
    Make sure to format as JSON, only reply with answer, no """json answer"""
    Reply in the following format
    facts:{LIST OF FACTS, YES USE square braces}
    source: {LIST OF sources, YES USE square braces, No urls}
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

  async getGeminiContent(title: string) {
    console.log('Generating gemini content ......')
    const result = await this.geminiModel.generateContent(title)
    const response = result.response
    const text = response.text()
    console.log(text)
    const parsed = JSON.parse(text)
    console.log(parsed)
    return parsed
  }
}
