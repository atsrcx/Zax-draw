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

  // Focus and virtual keyboard controller: Prevent virtual keyboard from opening on canvas/diagram clicks
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Allow keyboard only for explicit input fields (e.g., header title, search, modal inputs)
      const isExplicitInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.id === 'board-title-input' ||
        Boolean(target.closest('header')) ||
        Boolean(target.closest('[role="dialog"]')) ||
        Boolean(target.closest('.modal-container'));

      if (isExplicitInput) {
        return;
      }

      // If focus happens on a canvas element, check if it is actively in text editing mode
      const isActivelyEditingText =
        target.classList?.contains('inline-editor') ||
        target.classList?.contains('affine-paragraph') ||
        target.getAttribute('contenteditable') === 'true';

      // If user tapped a diagram, shape, or canvas background, do not open mobile virtual keyboard
      if (!isActivelyEditingText) {
        target.setAttribute('inputmode', 'none');
        target.setAttribute('virtualkeyboardpolicy', 'manual');
      } else {
        // If it is an intentional text block, check if it was explicitly activated
        if (!target.dataset?.editing && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          target.setAttribute('inputmode', 'none');
        }
      }
    };

    // Close any lingering keyboard when clicking on non-input canvas areas
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInput =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        Boolean(target.closest('header')) ||
        Boolean(target.closest('[role="dialog"]'));

      if (!isInput) {
        const active = document.activeElement as HTMLElement | null;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
          active.blur();
        }
      }
    };

    document.addEventListener('focusin', handleFocusIn, { capture: true });
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      document.removeEventListener('focusin', handleFocusIn, { capture: true });
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

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
        className="relative w-full h-full overflow-hidden select-none bg-[#f8f9fa] dark:bg-slate-950 touch-pan-x touch-pan-y"
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

