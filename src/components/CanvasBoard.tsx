import React, { memo, useState, useCallback, useEffect } from 'react';
import { Tldraw, Editor } from 'tldraw';
import { CanvasErrorBoundary } from './CanvasErrorBoundary';
import { safeDeleteIndexedDB } from '../utils/storage';

interface CanvasBoardProps {
  onMount: (editor: Editor) => void;
}

export const CanvasBoard: React.FC<CanvasBoardProps> = memo(({ onMount }) => {
  const [boardVersion, setBoardVersion] = useState(0);

  useEffect(() => {
    console.log('[DIAGNOSTIC] CanvasBoard mounted');
  }, []);

  const handleMount = useCallback(
    (editor: Editor) => {
      console.log('[DIAGNOSTIC] Tldraw mounted');
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
    <CanvasErrorBoundary key={`canvas-boundary-${boardVersion}`} onResetData={handleResetData}>
      <Tldraw
        key={`tldraw-instance-${boardVersion}`}
        onMount={handleMount}
        autoFocus={false}
      />
    </CanvasErrorBoundary>
  );
});

CanvasBoard.displayName = 'CanvasBoard';
