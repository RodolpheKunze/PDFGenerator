import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

(window as any).pdfMake = pdfMake;
(window as any).pdfMake.vfs = pdfFonts.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  generatePdf(template: any, data: any) {
    const processedTemplate = this.processTemplate(template, data);
    return pdfMake.createPdf(processedTemplate);
  }

  private processTemplate(template: any, data: any): any {
    // Deep clone the template to avoid modifying the original
    const processedTemplate = JSON.parse(JSON.stringify(template));
    
    // Process all content
    this.processNode(processedTemplate, data);
    
    // Handle table data separately
    this.processTableData(processedTemplate, data);
    
    return processedTemplate;
  }

  private processNode(node: any, data: any): any {
    if (typeof node === 'string') {
      return this.replacePlaceholders(node, data);
    }
    
    if (Array.isArray(node)) {
      node.forEach((item, index) => {
        if (typeof item === 'string') {
          node[index] = this.replacePlaceholders(item, data);
        } else if (typeof item === 'object') {
          this.processNode(item, data);
        }
      });
      return;
    }
    
    if (typeof node === 'object' && node !== null) {
      Object.keys(node).forEach(key => {
        if (typeof node[key] === 'string') {
          node[key] = this.replacePlaceholders(node[key], data);
        } else if (typeof node[key] === 'object') {
          this.processNode(node[key], data);
        }
      });
    }
  }

  private processTableData(template: any, data: any): void {
    // Find all tables in the template
    const findTables = (node: any): any[] => {
      const tables: any[] = [];
      
      if (node.table) {
        tables.push(node);
      }
      
      if (node.content && Array.isArray(node.content)) {
        node.content.forEach((item: any) => {
          if (typeof item === 'object') {
            tables.push(...findTables(item));
          }
        });
      }
      
      return tables;
    };

    const tables = findTables(template);
    
    // Process each table
    tables.forEach(table => {
      if (data.items && Array.isArray(data.items)) {
        // Add dynamic rows from data
        const rows = data.items.map((item: any) => [
          item.description,
          item.quantity.toString(),
          item.rate.toString(),
          item.amount.toString()
        ]);
        
        table.table.body.push(...rows);
      }
    });
  }

  private replacePlaceholders(text: string, data: any): string {
    return text.replace(/{{([\w.]+)}}/g, (match, path) => {
      const value = path.split('.').reduce((obj: any, key: string) => obj?.[key], data);
      return value !== undefined ? value.toString() : match;
    });
  }
}