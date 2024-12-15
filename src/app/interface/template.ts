
export interface PDFTemplate {
  content: Content[];
  styles?: { [key: string]: Style };
  defaultStyle?: Style;
}

export interface Style {
  fontSize?: number;
  bold?: boolean;
  margin?: number[];
  alignment?: 'left' | 'right' | 'center' | 'justify';
  [key: string]: any;
}

export interface Content {
  text?: string;
  style?: string;
  columns?: Content[];
  stack?: (string | Content)[];
  table?: {
    headerRows?: number;
    widths?: (string | number)[];
    body: any[][];
  };
  width?: string | number;
  alignment?: 'left' | 'right' | 'center';
  margin?: number[];
  [key: string]: any;
}


export interface DocumentTemplate {
  content: any[];
  styles?: Record<string, any>;
  defaultStyle?: Record<string, any>;
}

export interface DocumentData {
  [key: string]: any;
}