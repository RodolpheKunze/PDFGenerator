// components/document/document.component.ts
import { Component, Input } from '@angular/core';
import { DocumentData, DocumentTemplate } from '../../interface/template';
import { PdfGeneratorService } from '../../service/pdf-generator.service';


@Component({
  selector: 'app-document',
  standalone: true,
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent {
  @Input() template!: DocumentTemplate;
  @Input() data!: DocumentData;

  constructor(private pdfGenerator: PdfGeneratorService) {}

  async generatePdf() {
    try {
      const pdf = await this.pdfGenerator.generatePdf(this.template, this.data);
      pdf.open();
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }
}