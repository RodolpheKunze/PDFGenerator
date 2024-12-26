export interface PdfStyle {
    name: string;
    style: string;
    icon?: string;
    group: 'heading' | 'text' | 'alignment';
  }

  export interface FontSize {
    label: string;
    value: number;
  }
  
  export const FONT_SIZES: FontSize[] = [
    { label: '8', value: 8 },
    { label: '10', value: 10 },
    { label: '12', value: 12 },
    { label: '14', value: 14 },
    { label: '16', value: 16 },
    { label: '18', value: 18 },
    { label: '20', value: 20 },
    { label: '24', value: 24 },
    { label: '28', value: 28 },
    { label: '32', value: 32 }
  ];
  

  export const STYLE_COMPONENTS: PdfStyle []= [
    // Headings
    {
      name: 'Header 1',
      style: `{
        "fontSize": 24,
        "bold": true,
        "margin": [0, 10, 0, 5]
      }`,
      icon: 'heading-1',
      group: 'heading'
    },
    {
      name: 'Header 2',
      style: `{
        "fontSize": 18,
        "bold": true,
        "margin": [0, 8, 0, 4]
      }`,
      icon: 'heading-2',
      group: 'heading'
    },
    // Text styles
    {
      name: 'Normal Text',
      style: `{
        "fontSize": 12,
        "margin": [0, 5, 0, 5]
      }`,
      icon: 'type',
      group: 'text'
    },
    {
      name: 'Bold',
      style: `{
        "bold": true
      }`,
      icon: 'bold',
      group: 'text'
    },
    {
      name: 'Italic',
      style: `{
        "italics": true
      }`,
      icon: 'italic',
      group: 'text'
    },
    // Alignment
    {
      name: 'Left Align',
      style: `{
        "alignment": "left"
      }`,
      icon: 'AlignLeft',
      group: 'alignment'
    },
    {
      name: 'Centered',
      style: `{
        "alignment": "center"
      }`,
      icon: 'AlignCenter',
      group: 'alignment'
    },
    {
      name: 'Right',
      style: `{
        "alignment": "right"
      }`,
      icon: 'AlignRight',
      group: 'alignment'
    }
  ];
