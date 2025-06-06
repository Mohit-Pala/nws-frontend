import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { BackendOutput } from '../models/backedn-output.model';
import { ScrapedOutput } from '../models/scraped-output';


@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private apiUrl = 'http://127.0.0.1:5001/submit';
  private baseUrl = 'http://127.0.0.1:5001';


  //   private apiUrl = 'https://150.136.15.83/5001/submit';
  //   private baseUrl = 'https://150.136.15.83/5001';

  constructor(private http: HttpClient) { }

  predict(title: string, text: string): Observable<any> {
    const url = `${this.baseUrl}/predict`;
    const body = { title: title, article: text };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<any>(url, body, httpOptions);
  }

  async getOutput(title: string, article: string): Promise<BackendOutput> {
    return firstValueFrom(this.http.post<BackendOutput>(this.apiUrl, { title, article }));
  }

  async predictNew(title: string, article: string): Promise<BackendOutput> {
    return firstValueFrom(this.http.post<BackendOutput>(`${this.baseUrl}/predict`, { title, article }));
  }

  async scrapeArticle(url: string): Promise<ScrapedOutput> {
    return firstValueFrom(this.http.post<ScrapedOutput>(`${this.baseUrl}/scrape`, { url }));
  }

  async getWordCloud(title: string, article: string) {
    const url = `https://quickchart.io/wordcloud?text=${article}`
    return firstValueFrom(this.http.get(url))
  }
}
