import { Component } from '@angular/core';
import { PdfGeneratorService } from '../service/pdf-generator.service';
import { PDFTemplate } from '../interface/template';



const invoiceTemplate : PDFTemplate = {
  content: [
    {
      text: '{{company.name}}',
      style: 'header'
    },
    {
      columns: [
        {
          stack: [
            '{{company.address}}',
            '{{company.phone}}'
          ],
          width: '*'
        },
        {
          stack: [
            'Invoice #: {{invoice.number}}',
            'Date: {{invoice.date}}'
          ],
          width: '*',
          alignment: 'right'
        }
      ],
      margin: [0, 20, 0, 20]
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto'],
        body: [
          ['Description', 'Quantity', 'Rate', 'Amount'],
          // Dynamic rows will be added in the service
        ]
      }
    }
  ],
  styles: {
    header: {
      fontSize: 20,
      bold: true,
      margin: [0, 0, 0, 10]
    }
  },
  defaultStyle: {
    fontSize: 12
  }
};

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent {
  constructor(private pdfGenerator: PdfGeneratorService) {}

  generatePdf() {
    const data = {
      company: {
        name: "ACME Corp",
        address: "123 Business St",
        phone: "(555) 555-5555"
      },
      invoice: {
        number: "INV-001",
        date: "2024-12-09"
      },
      items: [
        {
          description: "Widget A",
          quantity: 2,
          rate: 100,
          amount: 200
        },
        {
          description: "Widget B",
          quantity: 1,
          rate: 50,
          amount: 50
        }
      ]
    };

    this.pdfGenerator.generatePdf(invoiceTemplate, data).open();
  }
}