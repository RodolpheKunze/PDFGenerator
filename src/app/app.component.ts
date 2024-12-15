import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { InvoiceComponent } from "./invoice/invoice.component";
import { DocumentComponent } from './components/document/document.component';
import { invoiceData } from './data/invoice.data';
import { invoiceTemplate } from './templates/invoice.template';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InvoiceComponent,DocumentComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'PDFGenerator';
  template = invoiceTemplate;
  data = invoiceData;
}
