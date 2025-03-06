import { Injectable } from '@angular/core';
import { OpenAI } from 'openai';
import { openAiKey } from '../../../api_key';

@Injectable({
  providedIn: 'root'
})
export class GptService {

  constructor() { }

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

  openai = new OpenAI({
    apiKey: openAiKey,
    dangerouslyAllowBrowser: true
  })


  async generateContent(content: string) {
    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini-2024-07-18',
      messages: [
        {
          role: 'user',
          content: content,
        },
        {
          role: 'system',
          content: this.systemIns,
        },
      ],
    });
    const result =  (completion.choices[0].message.content);
    if (!result){
      return
    }
    const parsed = JSON.parse(result)
    return parsed
  }

  async testFunction() {
    console.log('test func')
    const prompt = "The sun will explode in 2026 after humans put a dyson sphere on the sun"
    const result = await this.generateContent(prompt)
    console.log(result)
    return result
  }
}
