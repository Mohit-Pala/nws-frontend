import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { BackendOutput } from '../models/backedn-output.model';


@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private apiUrl = 'http://127.0.0.1:5001/submit';
  private baseUrl = 'http://127.0.0.1:5001';

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

  async getWordCloud(title: string, article: string) {
    const url = `https://quickchart.io/wordcloud?text=${article}`
    return firstValueFrom(this.http.get(url))
  }
}
