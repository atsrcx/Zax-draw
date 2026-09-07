import React, { memo, useState, useCallback, useEffect } from 'react';
import { Tldraw, Editor, createShapeId, toRichText } from 'tldraw';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { safeDeleteIndexedDB } from '../utils/storage';

interface CanvasBoardProps {
  onMount: (editor: Editor) => void;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = memo(({ onMount }) => {
  const [boardVersion, setBoardVersion] = useState(0);

  useEffect(() => {
    console.log('[DIAGNOSTIC] CanvasBoard mounted');
    const win = window as any;
    win.__TLDRAW_DIAGNOSTICS__ = {
      ...(win.__TLDRAW_DIAGNOSTICS__ || {}),
      canvasBoardMounted: true,
      canvasBoardTime: new Date().toLocaleTimeString(),
    };
    window.dispatchEvent(new CustomEvent('tldraw-diagnostic-update'));
  }, []);

  const handleMount = useCallback(
    (editor: Editor) => {
      console.log('[DIAGNOSTIC] Tldraw mounted');
      const win = window as any;
      win.__TLDRAW_DIAGNOSTICS__ = {
        ...(win.__TLDRAW_DIAGNOSTICS__ || {}),
        tldrawMounted: true,
        tldrawMountTime: new Date().toLocaleTimeString(),
        editorId: String(editor.store?.id || 'editor-ready'),
      };

      // Add temporary test shape for diagnostic verification (Requirement 6)
      try {
        const testShapeId = createShapeId('diag-test-shape');
        editor.createShapes([
          {
            id: testShapeId,
            type: 'geo',
            x: 60,
            y: 60,
            props: {
              w: 220,
              h: 140,
              geo: 'rectangle',
              color: 'red',
              fill: 'solid',
              richText: toRichText('DIAGNOSTIC TEST SHAPE'),
            },
          },
        ]);
        editor.zoomToFit({ animation: { duration: 0 } });
        win.__TLDRAW_DIAGNOSTICS__.testShapeStatus = 'CREATED (Red Geo at 60,60)';
        console.log('[DIAGNOSTIC] Test shape created successfully');
      } catch (err: any) {
        win.__TLDRAW_DIAGNOSTICS__.testShapeStatus = `FAILED: ${err?.message || String(err)}`;
        console.error('[DIAGNOSTIC] Failed to create test shape:', err);
      }

      window.dispatchEvent(new CustomEvent('tldraw-diagnostic-update'));
      onMount(editor);
    },
    [onMount],
  );

  const handleResetData = useCallback(async () => {
    try {
      await safeDeleteIndexedDB('tldraw_sdk_main_board');
      await safeDeleteIndexedDB('tldraw');
    } catch (err) {
      console.warn('[CanvasBoard] Failed to delete IndexedDB during reset:', err);
    }
    setBoardVersion((v) => v + 1);
  }, []);

  return (
    <div
      id="tldraw-board-inner-container"
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}
    >
      <CanvasErrorBoundary key={`canvas-boundary-${boardVersion}`} onResetData={handleResetData}>
        <Tldraw
          key={`tldraw-instance-${boardVersion}`}
          onMount={handleMount}
          autoFocus={false}
        />
      </CanvasErrorBoundary>
    </div>
  );
});

CanvasBoard.displayName = 'CanvasBoard';
