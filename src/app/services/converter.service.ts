import { Injectable } from '@angular/core';
import { Search } from '../models/search.model';
import { BackendOutput } from '../models/backedn-output.model';

@Injectable({
  providedIn: 'root'
})
export class ConverterService {

  constructor() { }

  searchToKeyEmotion(search: Search) {
    const keyEmotion = Object.entries(search.emotion).map(([name, value]) => {
      return { key: name, value: value }
    })
    return keyEmotion
  }

  searchToKeySentiment(search: Search) {
    const keySentiment = Object.entries(search.sentiment).map(([name, value]) => {
      return { key: name, value: value }
    })
    return keySentiment
  }

  backendToKeyEmotion(backendOut: BackendOutput) {
    const keyEmotion = Object.entries(backendOut.emotion).map(([name, value]) => {
      return { key: name, value: value }
    })
    return keyEmotion
  }
  
  backendToKeySentiment(backendOut: BackendOutput) {
    const keySentiment = Object.entries(backendOut.sentiment).map(([name, value]) => {
      return { key: name, value: value }
    })
    return keySentiment
  }
}
