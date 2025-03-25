import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor() { }

  async getOutput(title: string, article: string) {
    const getRequest = 'https://localhost:5001/submit'
    const response = await fetch(getRequest, {
      method: 'POST',
      headers: {

      },
      body: JSON.stringify({
        title: title,
        article: article
      })
    })

    if (!response.ok) {
      throw new Error('Failed to get output from the backend')
    }

    return await response.json()
  }
}
