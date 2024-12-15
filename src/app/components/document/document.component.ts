// components/document/document.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { DocumentData, DocumentTemplate } from '../../interface/template';
import { PdfGeneratorService } from '../../service/pdf-generator.service';
import { DataService } from '../../service/data.service';
import { TemplateService } from '../../service/template.service';
import { firstValueFrom } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-document',
  standalone: true,
  imports: [HttpClientModule], 
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit {
  @Input() templateName!: string;
  @Input() dataPath!: string;
  
  private template: any;
  private data: any;
  isReady = false;

  constructor(private pdfGenerator: PdfGeneratorService,
    private templateService: TemplateService,
    private dataService: DataService) {}

    async ngOnInit() {
      try {
        // Load template and data in parallel
        [this.template, this.data] = await Promise.all([
          this.templateService.getTemplate(this.templateName),
          this.dataService.getData(this.dataPath)
        ]);
        
        this.isReady = true;
      } catch (error) {
        console.error('Error loading template or data:', error);
      }
    }

    async generatePdf() {
      if (!this.isReady) return;
  
      try {
        const pdf = await this.pdfGenerator.generatePdf(this.template, this.data);
        pdf.open();
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
  }
}