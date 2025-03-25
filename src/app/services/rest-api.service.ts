import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor() { }

  async getOutput(title: string, article: string) {
    const getRequest = 'http://127.0.0.1:5001/submit'
    const response = await fetch(getRequest, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
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

  async getItems() {
    const getRequest = 'http://127.0.0.1:5000/api/items'
    const response = await fetch(getRequest, {
      method: 'GET',
    })

    if (!response.ok) {
      throw new Error('Failed to get items from the backend')
    }

    return await response.json()
  }
}
