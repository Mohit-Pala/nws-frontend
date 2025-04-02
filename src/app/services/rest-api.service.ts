import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Observable } from 'rxjs';

// Define an interface for the data you expect to receive from the /predict endpoint
export interface PredictResponse {
	emotions: any[]; // Replace 'any' with a more specific type if you know the structure
	sentiment: {
	  sentiment: string;
	  score: number;
	};
	'cosine-similarity': number;
	'tfidf-similarity': number;
	'jaccard-words': number;
	'jaccard-bigrams': number;
	'edit-distance': number;
  }

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiUrl = 'http://127.0.0.1:5001/submit';
  private baseUrl = 'http://127.0.0.1:5001';

  constructor(private http: HttpClient) {}

  predict(title: string, text: string): Observable<PredictResponse> {
    const url = `${this.baseUrl}/predict`;
    const body = { title: title, article: text };
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post<PredictResponse>(url, body, httpOptions);
  }

  async getOutput(title: string, article: string): Promise<any> {
    return firstValueFrom(this.http.post<any>(this.apiUrl, { title, article }));
  }
}
