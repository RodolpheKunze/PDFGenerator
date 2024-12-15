// services/data.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) {}

  async getData(dataPath: string): Promise<any> {
    const data = await import(`../../assets/data/${dataPath}.json`);
    return data.default;
  }

  getDataFromApi(endpoint: string): Observable<any> {
    return this.http.get(`/api/${endpoint}`);
  }
}