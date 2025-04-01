import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {
  private apiUrl = 'http://127.0.0.1:5001/submit';

  constructor(private http: HttpClient) {}

  async getOutput(title: string, article: string): Promise<any> {
    return firstValueFrom(this.http.post<any>(this.apiUrl, { title, article }));
  }
}
