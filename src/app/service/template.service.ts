// services/template.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  constructor(private http: HttpClient) {}

  async getTemplate(templateName: string): Promise<any> {
    // Dynamic import of the JSON file
    const template = await import(`../../assets/templates/${templateName}.json`);
    return template.default;
  }

  // API version
  getTemplateFromApi(templateId: string): Observable<any> {
    return this.http.get(`/api/templates/${templateId}`);
  }
}