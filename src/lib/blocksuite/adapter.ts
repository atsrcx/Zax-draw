import { Doc, Text } from '@blocksuite/store';
import { EdgelessEditor } from '@blocksuite/presets';
import * as Y from 'yjs';
import { ShapeCreationProps, ZaxDrawEditor } from '../../types';

const COLOR_MAP: Record<string, { fill: string; stroke: string }> = {
  yellow: { fill: '--affine-palette-shape-yellow', stroke: '--affine-palette-line-yellow' },
  'light-blue': { fill: '--affine-palette-shape-blue', stroke: '--affine-palette-line-blue' },
  blue: { fill: '--affine-palette-shape-blue', stroke: '--affine-palette-line-blue' },
  green: { fill: '--affine-palette-shape-green', stroke: '--affine-palette-line-green' },
  red: { fill: '--affine-palette-shape-red', stroke: '--affine-palette-line-red' },
  purple: { fill: '--affine-palette-shape-purple', stroke: '--affine-palette-line-purple' },
  orange: { fill: '--affine-palette-shape-orange', stroke: '--affine-palette-line-orange' },
  teal: { fill: '--affine-palette-shape-teal', stroke: '--affine-palette-line-teal' },
  grey: { fill: '--affine-palette-shape-grey', stroke: '--affine-palette-line-grey' },
  gray: { fill: '--affine-palette-shape-grey', stroke: '--affine-palette-line-grey' },
  black: { fill: '--affine-palette-shape-black', stroke: '--affine-palette-line-black' },
  white: { fill: '--affine-palette-shape-white', stroke: '--affine-palette-line-white' },
};

function resolveColors(colorName?: string) {
  if (colorName && COLOR_MAP[colorName]) {
    return COLOR_MAP[colorName];
  }
  return { fill: '--affine-palette-shape-yellow', stroke: '--affine-palette-line-yellow' };
}

function resolveShapeType(geoName?: string): string {
  switch (geoName) {
    case 'rectangle':
    case 'rect':
      return 'rect';
    case 'ellipse':
    case 'circle':
      return 'ellipse';
    case 'diamond':
      return 'diamond';
    case 'triangle':
      return 'triangle';
    case 'star':
    case 'cloud':
    default:
      return 'rect';
  }
}

/**
 * Creates an adapter implementing ZaxDrawEditor for BlockSuite EdgelessEditor and Doc.
 */
export function createBlockSuiteAdapter(
  doc: Doc,
  edgelessEditor: EdgelessEditor
): ZaxDrawEditor {
  const getEdgelessRoot = () => {
    try {
      return edgelessEditor.host?.querySelector('affine-edgeless-root') as any;
    } catch {
      return null;
    }
  };

  const getSurfaceModel = () => {
    try {
      const root = getEdgelessRoot();
      if (root?.surfaceBlockModel) return root.surfaceBlockModel;
    } catch {
      // fallback
    }
    const surfaceBlock = doc.getBlockByFlavour('affine:surface')?.[0] as any;
    return surfaceBlock;
  };

  const getGfx = () => {
    try {
      const root = getEdgelessRoot();
      return root?.gfx || null;
    } catch {
      return null;
    }
  };

  const getViewport = () => {
    const gfx = getGfx();
    return gfx?.viewport || null;
  };

  const getViewportCenter = (): { x: number; y: number } => {
    const vp = getViewport();
    if (vp) {
      return { x: Math.round(vp.centerX || 0), y: Math.round(vp.centerY || 0) };
    }
    return { x: 400, y: 300 };
  };

  const getZoomLevel = (): number => {
    const vp = getViewport();
    return vp?.zoom ?? 1;
  };

  const zoomIn = () => {
    const vp = getViewport();
    if (vp) {
      const nextZoom = Math.min(6, (vp.zoom || 1) * 1.2);
      vp.setZoom(nextZoom);
    }
  };

  const zoomOut = () => {
    const vp = getViewport();
    if (vp) {
      const nextZoom = Math.max(0.1, (vp.zoom || 1) / 1.2);
      vp.setZoom(nextZoom);
    }
  };

  const resetZoom = () => {
    const vp = getViewport();
    if (vp) {
      vp.setZoom(1);
    }
  };

  const zoomToFit = () => {
    const gfx = getGfx();
    const vp = getViewport();
    const surface = getSurfaceModel();
    if (!vp || !surface) return;

    try {
      const elements = surface.elements ? Array.from(surface.elements.values() as any[]) : [];
      if (elements.length === 0) {
        vp.setZoom(1);
        vp.setCenter(400, 300);
        return;
      }

      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const el of elements) {
        if (el.xywh) {
          try {
            const [x, y, w, h] = JSON.parse(el.xywh);
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x + w);
            maxY = Math.max(maxY, y + h);
          } catch {
            // pass
          }
        }
      }

      if (minX !== Infinity) {
        const padding = 80;
        const boundW = Math.max(100, maxX - minX + padding * 2);
        const boundH = Math.max(100, maxY - minY + padding * 2);
        const vpW = vp.width || window.innerWidth || 1000;
        const vpH = vp.height || window.innerHeight || 800;

        const zoomX = vpW / boundW;
        const zoomY = vpH / boundH;
        const fitZoom = Math.min(1.5, Math.max(0.2, Math.min(zoomX, zoomY)));

        vp.setZoom(fitZoom);
        vp.setCenter((minX + maxX) / 2, (minY + maxY) / 2);
      }
    } catch (e) {
      console.warn('[ZaxDraw] zoomToFit error:', e);
    }
  };

  const undo = () => {
    try {
      doc.history.undo();
    } catch {
      // fallback
    }
  };

  const redo = () => {
    try {
      doc.history.redo();
    } catch {
      // fallback
    }
  };

  const addStickyNote = (options?: { text?: string; color?: string; x?: number; y?: number }): string => {
    const surface = getSurfaceModel();
    const center = getViewportCenter();
    const x = options?.x ?? (center.x - 90);
    const y = options?.y ?? (center.y - 70);
    const w = 180;
    const h = 140;
    const colors = resolveColors(options?.color || 'yellow');
    const textContent = options?.text ?? 'New Note';

    doc.captureSync();

    if (surface?.addElement) {
      const id = surface.addElement({
        type: 'shape',
        shapeType: 'rect',
        xywh: `[${x},${y},${w},${h}]`,
        radius: 8,
        filled: true,
        fillColor: colors.fill,
        strokeColor: colors.stroke,
        strokeWidth: 2,
        text: new Y.Text(textContent),
      });
      return id;
    }

    return '';
  };

  const addShape = (
    shapeType: string,
    options?: { color?: string; x?: number; y?: number; w?: number; h?: number; text?: string }
  ): string => {
    const surface = getSurfaceModel();
    const center = getViewportCenter();
    const w = options?.w ?? 150;
    const h = options?.h ?? 90;
    const x = options?.x ?? (center.x - w / 2);
    const y = options?.y ?? (center.y - h / 2);
    const colors = resolveColors(options?.color || 'yellow');
    const resolvedType = resolveShapeType(shapeType);

    doc.captureSync();

    if (surface?.addElement) {
      const id = surface.addElement({
        type: 'shape',
        shapeType: resolvedType,
        xywh: `[${x},${y},${w},${h}]`,
        radius: resolvedType === 'rect' ? 4 : 0,
        filled: true,
        fillColor: colors.fill,
        strokeColor: colors.stroke,
        strokeWidth: 2,
        text: options?.text ? new Y.Text(options.text) : undefined,
      });
      return id;
    }

    return '';
  };

  const addText = (text?: string, options?: { x?: number; y?: number }): string => {
    const surface = getSurfaceModel();
    const center = getViewportCenter();
    const x = options?.x ?? (center.x - 100);
    const y = options?.y ?? (center.y - 25);
    const textContent = text || 'Heading';

    doc.captureSync();

    if (surface?.addElement) {
      const id = surface.addElement({
        type: 'shape',
        shapeType: 'rect',
        xywh: `[${x},${y},200,50]`,
        radius: 0,
        filled: false,
        fillColor: 'transparent',
        strokeColor: 'transparent',
        strokeWidth: 0,
        text: new Y.Text(textContent),
      });
      return id;
    }

    return '';
  };

  const addArrow = (options?: { x1?: number; y1?: number; x2?: number; y2?: number; color?: string }): string => {
    const surface = getSurfaceModel();
    const center = getViewportCenter();
    const x1 = options?.x1 ?? (center.x - 100);
    const y1 = options?.y1 ?? center.y;
    const x2 = options?.x2 ?? (center.x + 100);
    const y2 = options?.y2 ?? center.y;
    const colors = resolveColors(options?.color || 'black');

    doc.captureSync();

    if (surface?.addElement) {
      const id = surface.addElement({
        type: 'connector',
        mode: 1, // Curve or Orthogonal
        source: { position: [x1, y1] },
        target: { position: [x2, y2] },
        stroke: colors.stroke,
        strokeWidth: 2,
        frontEndpointStyle: 'Arrow',
      });
      return id;
    }

    return '';
  };

  const addFrame = (title?: string, options?: { x?: number; y?: number; w?: number; h?: number }): string => {
    const surface = getSurfaceModel();
    const center = getViewportCenter();
    const w = options?.w ?? 500;
    const h = options?.h ?? 400;
    const x = options?.x ?? (center.x - w / 2);
    const y = options?.y ?? (center.y - h / 2);
    const frameTitle = title || 'Frame';

    doc.captureSync();

    // Check if affine:frame block can be added to root page
    const pageBlock = doc.getBlockByFlavour('affine:page')?.[0];
    if (pageBlock) {
      try {
        const frameId = doc.addBlock(
          'affine:frame',
          {
            title: new Text(frameTitle),
            xywh: `[${x},${y},${w},${h}]`,
          },
          pageBlock.id
        );
        return frameId;
      } catch {
        // fallback to rectangle frame on surface
      }
    }

    if (surface?.addElement) {
      const id = surface.addElement({
        type: 'shape',
        shapeType: 'rect',
        xywh: `[${x},${y},${w},${h}]`,
        radius: 8,
        filled: false,
        fillColor: 'transparent',
        strokeColor: '--affine-palette-line-grey',
        strokeWidth: 2,
        text: new Y.Text(frameTitle),
      });
      return id;
    }

    return '';
  };

  const createShapes = (shapes: ShapeCreationProps[]): string[] => {
    const createdIds: string[] = [];
    doc.captureSync();

    for (const s of shapes) {
      if (s.type === 'note') {
        const text = s.props?.text || (typeof s.props?.richText === 'string' ? s.props.richText : '');
        const id = addStickyNote({
          x: s.x,
          y: s.y,
          text: text || 'Note',
          color: s.props?.color,
        });
        if (id) createdIds.push(id);
      } else if (s.type === 'arrow') {
        const start = s.props?.start || { x: s.x, y: s.y };
        const end = s.props?.end || { x: s.x + 100, y: s.y };
        const id = addArrow({
          x1: start.x,
          y1: start.y,
          x2: end.x,
          y2: end.y,
          color: s.props?.color,
        });
        if (id) createdIds.push(id);
      } else if (s.type === 'geo') {
        const text = s.props?.text || (typeof s.props?.richText === 'string' ? s.props.richText : '');
        const id = addShape(s.props?.geo || 'rectangle', {
          x: s.x,
          y: s.y,
          w: s.props?.w,
          h: s.props?.h,
          color: s.props?.color,
          text,
        });
        if (id) createdIds.push(id);
      } else if (s.type === 'text') {
        const text = s.props?.text || (typeof s.props?.richText === 'string' ? s.props.richText : 'Text');
        const id = addText(text, { x: s.x, y: s.y });
        if (id) createdIds.push(id);
      } else if (s.type === 'frame') {
        const id = addFrame(s.props?.text || 'Frame', {
          x: s.x,
          y: s.y,
          w: s.props?.w,
          h: s.props?.h,
        });
        if (id) createdIds.push(id);
      }
    }

    return createdIds;
  };

  const clearAll = () => {
    doc.captureSync();
    const surface = getSurfaceModel();
    if (surface?.elements) {
      const keys = Array.from(surface.elements.keys() as string[]);
      for (const k of keys) {
        try {
          surface.deleteElement(k);
        } catch {
          // pass
        }
      }
    }
  };

  const getShapesCount = (): number => {
    const surface = getSurfaceModel();
    if (surface?.elements) {
      return surface.elements.size || 0;
    }
    return 0;
  };

  const getSelectedCount = (): number => {
    const gfx = getGfx();
    if (gfx?.selection?.elements) {
      return gfx.selection.elements.length || 0;
    }
    return 0;
  };

  const exportImage = async (format: 'png' | 'svg'): Promise<{ blob: Blob; url: string; filename: string }> => {
    // Locate the canvas rendered inside edgeless editor
    const canvas = edgelessEditor.querySelector('canvas') as HTMLCanvasElement | null;
    const filename = `zax-draw-${Date.now()}.${format}`;

    if (canvas && format === 'png') {
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            resolve({ blob, url, filename });
          } else {
            // Fallback canvas creation
            const fallback = document.createElement('canvas');
            fallback.width = 1200;
            fallback.height = 800;
            const ctx = fallback.getContext('2d');
            if (ctx) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, 1200, 800);
              ctx.font = '20px sans-serif';
              ctx.fillStyle = '#1e293b';
              ctx.fillText('Zax-draw Whiteboard Snapshot', 50, 80);
            }
            fallback.toBlob((fbBlob) => {
              const b = fbBlob || new Blob([], { type: 'image/png' });
              resolve({ blob: b, url: URL.createObjectURL(b), filename });
            }, 'image/png');
          }
        }, 'image/png');
      });
    }

    // SVG export
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
        <rect width="100%" height="100%" fill="#f8f9fa"/>
        <text x="50" y="80" font-family="sans-serif" font-size="24" font-weight="bold" fill="#1e293b">Zax-draw Whiteboard</text>
        <text x="50" y="120" font-family="sans-serif" font-size="14" fill="#64748b">Exported on ${new Date().toLocaleString()}</text>
      </svg>
    `.trim();

    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    return { blob, url, filename };
  };

  const exportJson = async (): Promise<string> => {
    const update = Y.encodeStateAsUpdate(doc.spaceDoc);
    const base64 = btoa(String.fromCharCode.apply(null, Array.from(update)));
    return JSON.stringify({
      version: 1,
      app: 'zax-draw',
      timestamp: Date.now(),
      updateBase64: base64,
    }, null, 2);
  };

  const importJson = async (jsonString: string): Promise<boolean> => {
    try {
      const data = JSON.parse(jsonString);
      if (data.updateBase64) {
        const binaryString = atob(data.updateBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        doc.load();
        Y.applyUpdate(doc.spaceDoc, bytes);
        zoomToFit();
        return true;
      }
      return false;
    } catch (err) {
      console.warn('[ZaxDraw] Import JSON error:', err);
      return false;
    }
  };

  const setTool = (toolName: string, options?: any) => {
    try {
      const gfx = getGfx();
      if (gfx?.tool) {
        if (toolName === 'select' || toolName === 'default') {
          gfx.tool.setTool('default');
        } else if (toolName === 'pan' || toolName === 'hand') {
          gfx.tool.setTool('pan');
        } else if (toolName === 'brush' || toolName === 'draw' || toolName === 'pen') {
          gfx.tool.setTool('brush', options || { strokeWidth: 4 });
        } else if (toolName === 'eraser') {
          gfx.tool.setTool('eraser');
        } else if (toolName === 'shape') {
          const resolvedType = options?.shapeType ? resolveShapeType(options.shapeType) : 'rect';
          gfx.tool.setTool('shape', { shapeType: resolvedType, ...options });
        } else if (toolName === 'note' || toolName === 'sticky') {
          gfx.tool.setTool('affine:note');
        } else if (toolName === 'text') {
          gfx.tool.setTool('text');
        } else if (toolName === 'connector' || toolName === 'arrow') {
          gfx.tool.setTool('connector', options || { mode: 1 });
        } else if (toolName === 'frame') {
          gfx.tool.setTool('frame');
        } else {
          gfx.tool.setTool(toolName, options);
        }
      }
    } catch (err) {
      console.warn('[ZaxDraw] setTool error:', err);
    }
  };

  const getActiveTool = (): string => {
    try {
      const gfx = getGfx();
      const current = gfx?.tool?.currentToolName$?.value || gfx?.tool?.currentToolName;
      if (current === 'default') return 'select';
      if (current === 'affine:note') return 'note';
      return current || 'select';
    } catch {
      return 'select';
    }
  };

  return {
    doc,
    edgelessEditor,
    setTool,
    getActiveTool,
    zoomIn,
    zoomOut,
    resetZoom,
    zoomToFit,
    undo,
    redo,
    addStickyNote,
    addShape,
    addText,
    addArrow,
    addFrame,
    createShapes,
    clearAll,
    exportImage,
    exportJson,
    importJson,
    getShapesCount,
    getSelectedCount,
    getZoomLevel,
    getViewportCenter,
  };
}
