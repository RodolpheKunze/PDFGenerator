// template-editor.component.ts
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfGeneratorService } from '../../service/pdf-generator.service';

interface ValidationError {
  message: string;
  position?: number;
  line?: number;
}

interface PdfComponent {
  name: string;
  icon?: string;
  template: string;
}

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.css'
})
export class TemplateEditorComponent implements OnInit {
  @ViewChild('templateEditor') templateEditor!: ElementRef;
  template = '';
  templateError: ValidationError | null = null;
  dataError: ValidationError | null = null;
  data = '';
  dataSource = 'file';
  apiUrl = '';
  error = '';
  previewUrl: SafeResourceUrl | null = null;
  showHelp = false;
  isLoading = false;
  templateHelpText = `{
  "content": [
    {
      "text": "Header Text",
      "style": "header"
    },
    {
      "columns": [
        {
          "width": "*",
          "text": "Column 1"
        },
        {
          "width": "*",
          "text": "Column 2"
        }
      ]
    }
  ],
  "styles": {
    "header": {
      "fontSize": 20,
      "bold": true
    }
  }
}`;



  constructor(
    private pdfGenerator: PdfGeneratorService,
    private sanitizer: DomSanitizer
  ) {}


  basicComponents: PdfComponent[] = [
    {
      name: 'Text',
      template: `{
  "text": "Your text here",
  "style": "normal"
}`
    },
    {
      name: 'Header',
      template: `{
  "text": "Header text",
  "style": "header"
}`
    },
    {
      name: 'Image',
      template: `{
  "image": "{{imageName}}",
  "width": 150
}`
    }
  ];

  layoutComponents: PdfComponent[] = [
    {
      name: 'Columns',
      template: `{
  "columns": [
    {
      "width": "*",
      "text": "Column 1"
    },
    {
      "width": "*",
      "text": "Column 2"
    }
  ]
}`
    },
    {
      name: 'Stack',
      template: `{
  "stack": [
    "First line",
    "Second line",
    "Third line"
  ]
}`
    },
    {
      name: 'Table',
      template: `{
  "table": {
    "headerRows": 1,
    "widths": ["*", "auto", "auto"],
    "body": [
      ["Header 1", "Header 2", "Header 3"],
      ["Cell 1", "Cell 2", "Cell 3"]
    ]
  }
}`
    }
  ];

  dataComponents: PdfComponent[] = [
    {
      name: 'Data Field',
      template: `"{{fieldName}}"`
    },
    {
      name: 'Data Loop',
      template: `{
  "ul": [
    "{{#each items}}",
    "{{name}}",
    "{{/each}}"
  ]
}`
    }
  ];

  insertComponent(component: PdfComponent) {
    try {
      let currentTemplate = this.template;
      
      if (!currentTemplate.trim()) {
        currentTemplate = `{
  "content": [
  ],
  "styles": {
    "header": {
      "fontSize": 18,
      "bold": true,
      "margin": [0, 0, 0, 10]
    },
    "normal": {
      "fontSize": 12,
      "margin": [0, 5, 0, 5]
    }
  }
}`;
      }

      const templateObj = JSON.parse(currentTemplate);

      if (!templateObj.content) {
        templateObj.content = [];
      }

      const newComponent = JSON.parse(component.template);
      templateObj.content.push(newComponent);

      this.template = JSON.stringify(templateObj, null, 2);
      this.onTemplateChange(this.template);

    } catch (e) {
      console.error('Error inserting component:', e);
    }
  }


  ngOnInit() {}

  get canPreview(): boolean {
    return Boolean(this.template && 
      ((this.dataSource === 'file' && this.data) || 
       (this.dataSource === 'api' && this.apiUrl)));
  }

  loadSampleTemplate() {
    this.template = this.templateHelpText;
    this.onTemplateChange(this.template);
  }

  loadSampleData() {
    this.data = `{
  "title": "Sample Document",
  "items": [
    {
      "name": "Item 1",
      "price": 100
    },
    {
      "name": "Item 2",
      "price": 200
    }
  ]
}`;
    this.onDataChange(this.data);
  }

  formatJson(type: 'template' | 'data') {
    try {
      const content = type === 'template' ? this.template : this.data;
      const formatted = JSON.stringify(JSON.parse(content), null, 2);
      if (type === 'template') {
        this.template = formatted;
        this.onTemplateChange(formatted);
      } else {
        this.data = formatted;
        this.onDataChange(formatted);
      }
    } catch (e) {
      // Error will be shown by validation
    }
  }

  clearEditor(type: 'template' | 'data') {
    if (type === 'template') {
      this.template = '';
      this.templateError = null;
    } else {
      this.data = '';
      this.dataError = null;
    }
  }
  async fetchApiData() {
    try {
      this.isLoading = true;
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      this.data = JSON.stringify(data, null, 2);
      this.onDataChange(this.data);
    } catch (e: any) {
      this.dataError = {
        message: `API Error: ${e.message}`,
      };
    } finally {
      this.isLoading = true;
    }
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