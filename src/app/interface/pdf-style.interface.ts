export interface PdfStyle {
    name: string;
    style: string;
    icon?: string;
    group: 'heading' | 'text' | 'alignment';
  }

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
      icon: 'text',
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
  