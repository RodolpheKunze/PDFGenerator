import { Injectable } from '@angular/core';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ImageService } from './image.service';

(window as any).pdfMake = pdfMake;
(window as any).pdfMake.vfs = pdfFonts.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorService {
  constructor(private imageService: ImageService) {}

  async generatePdf(template: any, data: any) {
    const processedTemplate = await this.processTemplate(template, data);
    return pdfMake.createPdf(processedTemplate);
  }

  private async processTemplate(template: any, data: any): Promise<any> {
    // Deep clone the template to avoid modifying the original
    const processedTemplate = JSON.parse(JSON.stringify(template));
    
    // Process image in content
    await this.processContentImages(processedTemplate.content, data);
    
    // Process all content
    this.processNode(processedTemplate, data);
    
    // Handle table data separately
    this.processTableData(processedTemplate, data);
    
    return processedTemplate;
  }

  private async processContentImages(content: any[], data: any) {
    for (const item of content) {
      if (item.image && typeof item.image === 'string' && item.image.includes('{{')) {
        // Get image name from data using placeholder
        const imageName = this.replacePlaceholders(item.image, data);
        if (imageName) {
          // Convert image to base64
          item.image = await this.imageService.getImageAsBase64(imageName);
        }
      }
      // Process nested content
      if (item.content) {
        await this.processContentImages(Array.isArray(item.content) ? item.content : [item.content], data);
      }
    }
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
        if (key !== 'image' && typeof node[key] === 'string') {
          node[key] = this.replacePlaceholders(node[key], data);
        } else if (typeof node[key] === 'object') {
          this.processNode(node[key], data);
        }
      });
    }
  }

  private processTableData(template: any, data: any): void {
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
    tables.forEach(table => {
      if (data.items && Array.isArray(data.items)) {
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