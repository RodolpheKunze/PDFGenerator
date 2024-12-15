import { DocumentTemplate } from "../interface/template";

export const invoiceTemplate: DocumentTemplate = {
  content: [
    {
      image: '{{logoImage}}',
      width: 150
    },
    {
        text: '{{title}}'
    },
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
      ]
    },
    {
      table: {
        headerRows: 1,
        widths: ['*', 'auto', 'auto', 'auto'],
        body: [
          ['Description', 'Quantity', 'Rate', 'Amount']
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