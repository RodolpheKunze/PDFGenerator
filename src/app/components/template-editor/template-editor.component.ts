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
  FONT_SIZES,
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
  fontSizes = FONT_SIZES;
  selectedFontSize: number = 12; 

  constructor(
    private pdfGenerator: PdfGeneratorService,
    private sanitizer: DomSanitizer
  ) { }

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
    this.data = '{}';
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

    // Get the text cursor selection points from the textarea
    const textArea = document.querySelector('.json-editor') as HTMLTextAreaElement;
    const selectionStart = textArea.selectionStart;
    const selectionEnd = textArea.selectionEnd;
  const selection = this.template.substring(selectionStart, selectionEnd);
  let selectionJson;
  if (this.isValidJsonObject(selection)) {
    //valid selection
    selectionJson = JSON.parse(selection);
  } else {
    //incomplete selection: try to find a full json part
    const selectionExtended = this.findCompleteJsonObject(
      this.template, 
      selectionStart, 
      selectionEnd
    );
    if (selectionExtended) {
      console.log('Found complete JSON object:', selectionExtended.text);
      // Work with the complete object
      selectionJson = JSON.parse(selectionExtended.text);
    } else {
      //the Json object is really crap, will need to show an error message on the screen
      console.log('Could not find a complete JSON object');
    }
  }
    console.log("style selected: ", selectionJson.style)
      let templateObj = JSON.parse(currentTemplate);
      // Ensure styles object exists if not create the JSON area
      if (!templateObj.styles) {
        templateObj.styles = {};
        const timestamp = new Date().getTime();
        const styleName = `${style.name.toLowerCase().replace(/\s+/g, '_')}_${timestamp}`;
        const styleObj = JSON.parse(style.style);
        styleObj.fontSize = this.selectedFontSize;
        templateObj.styles[styleName] = styleObj;
        console.log("styles part of the template: ", templateObj.styles)
        const selection = this.findCompleteJsonObject(this.template, selectionStart, selectionEnd);
        if (selection) {
          const selectionJson = JSON.parse(selection.text);
          selectionJson.style = styleName;
          console.log("selectionJson value : ",selectionJson)
          // Build the new template string
          const beforeSelection = this.template.substring(0, selection.start);
          const afterSelection = this.template.substring(selection.end);
          // Update the template object instead of string manipulation
          const tempObj = JSON.parse(beforeSelection + JSON.stringify(selectionJson) + afterSelection);
          console.log("tempObj value: ", tempObj)
          templateObj = {
            ...tempObj,
            styles: {
              ...templateObj.styles  // Keep the existing styles
            }
          };
        }
    // Single final stringify for the complete template
    this.template = JSON.stringify(templateObj, null, 2);
    
    this.onTemplateChange(this.template);
      }
      else
    {
      //styles exist, will need to update the one selected if already available
    }
/*
    // Generate a unique style name


   // If there's a selection, wrap it in a styled component
   if (selectionStart !== selectionEnd) {
    // Get the selected text
    const selectedText = this.template.substring(selectionStart, selectionEnd);
    
    try {
      // Try to parse the selected text as JSON
      const selectedObj = JSON.parse(selectedText);
      
      // If it's a valid JSON object, add the style to it
      if (typeof selectedObj === 'object') {
        //selectedObj.style = styleName;
        
        // Replace the selection with the styled object
      }
      this.formatTemplateJson();
    } catch (e) {
      // If it's not valid JSON, create a new text component with the style
      const styledComponent = {
        text: selectedText,
        //style: styleName
      };
      
      if (!templateObj.content) {
        templateObj.content = [];
      }
      templateObj.content.push(styledComponent);
    }
  }
  this.template = JSON.stringify(templateObj, null, 2);
  // Update the template and preview
  this.onTemplateChange(this.template);*/
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
      console.log('onTemplateChange with value:', value);
      if (value) {
        JSON.parse(value);
        console.log('json parsed:', JSON.parse(value));
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
      console.log('in updatePreview with this.canPreview:', this.canPreview);
      if (!this.canPreview) return;

      let parsedTemplate = JSON.parse(this.template);
      let parsedData;
      parsedData = JSON.parse(this.data);
      console.log(
        'parsedTemplate:',
        parsedTemplate,
        ' parsedData:',
        parsedData
      );

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
  formatTemplateJson() {
    console.log("formating the template")
    try {
      const templateObj = JSON.parse(this.template);
      this.template = JSON.stringify(templateObj, null, 2);
    } catch (e) {
      console.error('Error formatting template:', e);
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

  private isValidJsonObject(str: string): boolean {
    try {
      const parsed = JSON.parse(str);
      // Check if it's actually an object and not a primitive value
      return parsed && typeof parsed === 'object' && !Array.isArray(parsed);
    } catch (e) {
      return false;
    }
  }

  private findCompleteJsonObject(content: string, start: number, end: number): { 
    text: string; 
    start: number; 
    end: number; 
  } | null {
    const textArea = document.querySelector('.json-editor') as HTMLTextAreaElement;
    const fullText = content;
    let braceCount = 0;
    let startPos = start;
    let endPos = end;
  
    // Look backwards to find opening brace
    for (let i = start; i >= 0; i--) {
      if (fullText[i] === '{') {
        startPos = i;
        braceCount++;
        break;
      }
    }
  
    // Look forwards to find closing brace
    for (let i = Math.max(end - 1, startPos + 1); i < fullText.length; i++) {
      if (fullText[i] === '{') braceCount++;
      if (fullText[i] === '}') {
        braceCount--;
        if (braceCount === 0) {
          endPos = i + 1;
          break;
        }
      }
    }
  
    // Validate if we found a complete object
    if (braceCount === 0 && startPos !== -1 && endPos !== -1) {
      const extractedText = fullText.substring(startPos, endPos);
      try {
        // Verify it's valid JSON
        JSON.parse(extractedText);
        this.updateTextAreaSelection(textArea, startPos, endPos);
        return {
          text: extractedText,
          start: startPos,
          end: endPos
        };
      } catch (e) {
        return null;
      }
    }
  
    return null;
  }
  private updateTextAreaSelection(textArea: HTMLTextAreaElement, start: number, end: number) {
    // Set focus to the textarea
    console.log("in the text area update")
    textArea.focus();
    // Update the selection
    textArea.setSelectionRange(start, end);
  }
  
}
