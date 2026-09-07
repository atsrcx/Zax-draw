import React, { useEffect, useRef, useState, memo } from 'react';
import '@toeverything/theme/style.css';
import { EdgelessEditor } from '@blocksuite/presets';
import { ensureBlockSuiteRegistered } from '../lib/blocksuite/init';
import { getOrCreateMainDoc, clearDocPersistence } from '../lib/blocksuite/store';
import { createBlockSuiteAdapter } from '../lib/blocksuite/adapter';
import { ZaxDrawEditor } from '../types';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { Loader2 } from 'lucide-react';

// Initialize registrations
ensureBlockSuiteRegistered();

interface CanvasBoardProps {
  onMount: (editor: ZaxDrawEditor) => void;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = memo(({ onMount }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<EdgelessEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function initEditor() {
      try {
        ensureBlockSuiteRegistered();

        const { doc } = await getOrCreateMainDoc();
        if (isCancelled || !containerRef.current) return;

        // Clean any existing editor instance
        if (editorRef.current && editorRef.current.parentElement) {
          editorRef.current.parentElement.removeChild(editorRef.current);
          editorRef.current = null;
        }

        // Use custom element creation
        const editor = document.createElement('edgeless-editor') as EdgelessEditor;
        editor.doc = doc;
        editor.style.width = '100%';
        editor.style.height = '100%';
        editor.style.display = 'block';
        editor.id = 'zax-draw-edgeless-editor';

        containerRef.current.appendChild(editor);
        editorRef.current = editor;

        const adapter = createBlockSuiteAdapter(doc, editor);
        onMount(adapter);
        setIsLoading(false);
      } catch (err) {
        console.error('[ZaxDraw] Failed to initialize EdgelessEditor:', err);
        setIsLoading(false);
      }
    }

    initEditor();

    // ResizeObserver to ensure BlockSuite responds smoothly to dynamic container resizing
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        if (editorRef.current) {
          // Trigger smooth container reflow
          window.dispatchEvent(new Event('resize'));
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      isCancelled = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (editorRef.current && editorRef.current.parentElement) {
        editorRef.current.parentElement.removeChild(editorRef.current);
        editorRef.current = null;
      }
    };
  }, [onMount]);

  const handleResetData = async () => {
    await clearDocPersistence();
  };

  return (
    <CanvasErrorBoundary onResetData={handleResetData}>
      <div
        id="zax-draw-canvas-container"
        ref={containerRef}
        className="relative w-full h-full overflow-hidden bg-[#f8f9fa] dark:bg-slate-950 touch-pan-x touch-pan-y"
      >
        {isLoading && (
          <div
            id="canvas-loading-spinner"
            className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 z-20"
          >
            <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin mb-2" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              Initializing Canvas Engine...
            </span>
          </div>
        )}
      </div>
    </CanvasErrorBoundary>
  );
});

CanvasBoard.displayName = 'CanvasBoard';

