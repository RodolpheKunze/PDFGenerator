// template-editor.component.ts
import {
  Component,
  ElementRef,
  NgModule,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PdfGeneratorService } from '../../service/pdf-generator.service';
import { FilterByGroupPipe } from '../../pipe/FilterByGroupPipe';
import {
  PdfStyle,
  STYLE_COMPONENTS,
} from '../../interface/pdf-style.interface';
import {
  PdfComponent,
  BASIC_COMPONENTS,
  DATA_COMPONENTS,
  LAYOUT_COMPONENTS,
} from '../../interface/pdf-component.interface';

interface ValidationError {
  message: string;
  position?: number;
  line?: number;
}

@Component({
  selector: 'app-template-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterByGroupPipe, LucideAngularModule],
  templateUrl: './template-editor.component.html',
  styleUrl: './template-editor.component.css',
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
  styleComponents = STYLE_COMPONENTS;
  basicComponents = BASIC_COMPONENTS;
  layoutComponents = LAYOUT_COMPONENTS;
  dataComponents = DATA_COMPONENTS;

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private sanitizer: DomSanitizer
  ) {}

  insertComponent(component: PdfComponent) {
    try {
      let currentTemplate = this.template;

      if (!currentTemplate.trim()) {
        currentTemplate = `{
  "content": [
  ]
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

  ngOnInit() {
    this.data="{}"
  }

  get canPreview(): boolean {
    return Boolean(
      this.template /*&&
        ((this.dataSource === 'file' && this.data) ||
          (this.dataSource === 'api' && this.apiUrl))*/
    );
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

  insertStyle(style: PdfStyle) {
    try {
      let currentTemplate = this.template;

      if (!currentTemplate.trim()) {
        currentTemplate = `{
    "content": [],
    "styles": {}
  }`;
      }
      const templateObj = JSON.parse(currentTemplate);

      // Ensure styles object exists
      if (!templateObj.styles) {
        templateObj.styles = {};
      }

      // Add style with a unique name
      const styleName = style.name.toLowerCase().replace(/\s+/g, '_');
      templateObj.styles[styleName] = JSON.parse(style.style);

      this.template = JSON.stringify(templateObj, null, 2);
      this.onTemplateChange(this.template);
    } catch (e) {
      console.error('Error inserting style:', e);
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
      console.log("onTemplateChange with value:", value)
      if (value) {
        JSON.parse(value);
        console.log("json parsed:", JSON.parse(value))
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
      console.log("in updatePreview with this.canPreview:", this.canPreview)
      if (!this.canPreview) return;

      let parsedTemplate = JSON.parse(this.template);
      let parsedData;
        parsedData = JSON.parse(this.data);
        console.log("parsedTemplate:", parsedTemplate, " parsedData:", parsedData)

      const pdfDoc = await this.pdfGenerator.generatePdf(
        parsedTemplate,
        parsedData
      );

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
      link.href = (
        this.previewUrl as any
      ).changingThisBreaksApplicationSecurity;
      link.download = 'document.pdf';
      link.click();
    }
  }
}
