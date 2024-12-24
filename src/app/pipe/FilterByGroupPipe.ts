import { Pipe, PipeTransform } from '@angular/core';
import { PdfStyle } from '../interface/pdf-style.interface';


@Pipe({
  name: 'filterByGroup',
  standalone: true
})
export class FilterByGroupPipe implements PipeTransform {
  transform(styles: PdfStyle[], group: string): PdfStyle[] {
    return styles.filter(style => style.group === group);
  }
}