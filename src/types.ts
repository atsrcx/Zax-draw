export interface ShapeCreationProps {
  id?: string;
  type: string; // 'geo' | 'note' | 'arrow' | 'text' | 'frame'
  x: number;
  y: number;
  props?: {
    geo?: string; // 'rectangle' | 'ellipse' | 'diamond' | 'triangle' | 'star' | 'cloud'
    w?: number;
    h?: number;
    text?: string;
    richText?: any;
    color?: string;
    fill?: string;
    size?: string;
    start?: { x: number; y: number };
    end?: { x: number; y: number };
  };
}

export interface ZaxDrawEditor {
  isDisposed?: boolean;
  doc: any;
  edgelessEditor: any;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  zoomToFit: (options?: { animation?: { duration?: number } }) => void;
  undo: () => void;
  redo: () => void;
  canUndo?: () => boolean;
  canRedo?: () => boolean;
  addStickyNote: (options?: { text?: string; color?: string; x?: number; y?: number }) => string;
  addShape: (shapeType: string, options?: { color?: string; x?: number; y?: number; w?: number; h?: number; text?: string }) => string;
  addText: (text?: string, options?: { x?: number; y?: number }) => string;
  addArrow: (options?: { x1?: number; y1?: number; x2?: number; y2?: number; color?: string }) => string;
  addFrame: (title?: string, options?: { x?: number; y?: number; w?: number; h?: number }) => string;
  createShapes: (shapes: ShapeCreationProps[]) => string[];
  clearAll: () => void;
  exportImage: (format: 'png' | 'svg') => Promise<{ blob: Blob; url: string; filename: string }>;
  exportJson: () => Promise<string>;
  importJson: (json: string) => Promise<boolean>;
  getShapesCount: () => number;
  getSelectedCount: () => number;
  getZoomLevel: () => number;
  getViewportCenter: () => { x: number; y: number };
  toggleGrid?: (enabled: boolean) => void;
  onUpdate?: (callback: () => void) => () => void;
}

export interface TemplateDefinition {
  id: string;
  title: string;
  description: string;
  category: 'Diagram' | 'Agile' | 'Planning' | 'Design';
  icon: string;
  create: (editor: ZaxDrawEditor) => void;
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

