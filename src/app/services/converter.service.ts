import { Injectable } from '@angular/core';
import { Search } from '../models/search.model';

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
}
