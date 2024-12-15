// template-editor.component.ts
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfGeneratorService } from '../../service/pdf-generator.service';

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.css'
})
export class TemplateEditorComponent implements OnInit {
  template = '';
  data = '';
  dataSource = 'file';
  apiUrl = '';
  error = '';
  previewUrl: SafeResourceUrl | null = null;

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {}

  get canPreview(): boolean {
    return Boolean(this.template && 
      ((this.dataSource === 'file' && this.data) || 
       (this.dataSource === 'api' && this.apiUrl)));
  }

  async onTemplateChange(value: string) {
    try {
      if (value) {
        JSON.parse(value);
      }
      this.error = '';
      await this.updatePreview();
    } catch (err) {
      this.error = 'Invalid template JSON format';
    }
  }

  async onDataChange(value: string) {
    try {
      if (value) {
        JSON.parse(value);
      }
      this.error = '';
      await this.updatePreview();
    } catch (err) {
      this.error = 'Invalid data JSON format';
    }
  }

  async updatePreview() {
    try {
      if (!this.canPreview) return;

      let parsedTemplate = JSON.parse(this.template);
      let parsedData;

      if (this.dataSource === 'file') {
        parsedData = JSON.parse(this.data);
      } else {
        const response = await fetch(this.apiUrl);
        parsedData = await response.json();
      }

      const pdfDoc = await this.pdfGenerator.generatePdf(parsedTemplate, parsedData);
      
      pdfDoc.getBlob((blob: Blob) => {
        const url = URL.createObjectURL(blob);
        this.previewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.error = '';
      });
    } catch (err: any) {
      this.error = err.message;
      this.previewUrl = null;
    }
  }

  downloadPdf() {
    if (this.previewUrl) {
      const link = document.createElement('a');
      link.href = (this.previewUrl as any).changingThisBreaksApplicationSecurity;
      link.download = 'document.pdf';
      link.click();
    }
  }
}