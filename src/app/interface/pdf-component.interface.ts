export interface PdfComponent {
    name: string;
    icon?: string;
    template: string;
}

export const BASIC_COMPONENTS: PdfComponent[] = [
    {
        name: 'Text',
        template: `{
  "text": "Your text here",
  "style": "normal"
}`
    },
    {
        name: 'Header',
        template: `{
  "text": "Header text",
  "style": "header"
}`
    },
    {
        name: 'Image',
        template: `{
  "image": "{{imageName}}",
  "width": 150
}`
    }
];

export const LAYOUT_COMPONENTS: PdfComponent[] = [
    {
        name: 'Columns',
        template: `{
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
}`
    },
    {
        name: 'Stack',
        template: `{
  "stack": [
    "First line",
    "Second line",
    "Third line"
  ]
}`
    },
    {
        name: 'Table',
        template: `{
  "table": {
    "headerRows": 1,
    "widths": ["*", "auto", "auto"],
    "body": [
      ["Header 1", "Header 2", "Header 3"],
      ["Cell 1", "Cell 2", "Cell 3"]
    ]
  }
}`
    }
];

export const DATA_COMPONENTS: PdfComponent[] = [
    {
        name: 'Data Field',
        template: `"{{fieldName}}"`
    },
    {
        name: 'Data Loop',
        template: `{
  "ul": [
    "{{#each items}}",
    "{{name}}",
    "{{/each}}"
  ]
}`
    }
];
