import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';

export interface BackendOutput {
  title: string;
  article: string;
  message: string;
  emotion: {
    anger: number;
    disgust: number;
    fear: number;
    joy: number;
    sadness: number;
    surprise: number;
    neutral: number;
  };
  sentiment: {
    positive: number;
    negative: number;
    neutral: number;
  };
  metrics: {
    cosineSim: number;
    jaccardBigrams: number;
    jaccardWords: number;
    lenDif: number;
    lenRatio: number;
    normEditDist: number;
    tfIdfSim: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class RestApiService {
  private apiUrl = 'http://127.0.0.1:5001/submit';
  private baseUrl = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient) {}

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
}
