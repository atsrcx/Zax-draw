export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Diagram' | 'Agile' | 'Planning' | 'Design';
  icon: string;
  create: (editor: any) => void;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

export interface BoardMetadata {
  title: string;
  lastModified: number;
}
